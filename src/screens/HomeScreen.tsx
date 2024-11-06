import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Animated,
  PanResponder,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getBalance, getMovements } from '../services/apiService';
import { format, parseISO, isToday } from 'date-fns';
import { es } from 'date-fns/locale';

interface Movement {
  id: string;
  name: string;
  amount: number;
  date: string;
}

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const translateY = useRef(new Animated.Value(0)).current;
  const balanceAnimation = useRef(new Animated.Value(1)).current;
  const pageSize = 10; // Número de movimientos por página

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setRefreshing(true);
    try {
      // Obtén el balance
      const fetchedBalance = await getBalance();
      setBalance(fetchedBalance);
  
      // Llama a loadMovements para cargar todos los movimientos desde el principio
      await loadMovements(); // Llama a loadMovements sin limpiar los movimientos antes
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  const loadMovements = async (isRefresh = false) => {
    if (!hasMore && lastKey !== null) return; // Evita cargar si no hay más y no es una carga inicial
  
    try {
      const { items: newMovements, lastEvaluatedKey } = await getMovements(isRefresh ? null : lastKey);
  
      // Combinar los movimientos previos con los nuevos sin duplicar, y ordenar del más reciente al más antiguo
      setMovements((prevMovements) => {
        const allMovements = isRefresh ? newMovements : [...prevMovements, ...newMovements];
  
        // Ordenar los movimientos por fecha de más reciente a más antiguo
        const sortedMovements = allMovements
          .filter((movement: { id: any; }, index: any, self: any[]) => index === self.findIndex((m) => m.id === movement.id))
          .sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
        return sortedMovements;
      });
  
      // Actualizar la clave para la paginación
      setLastKey(lastEvaluatedKey);
      setHasMore(Boolean(lastEvaluatedKey));
    } catch (error) {
      console.error('Error loading movements:', error);
    }
  };
  
  
  const onEndReached = () => {
    if (hasMore && !refreshing) {
      loadMovements();
    }
  };
  
  const onRefresh = () => {
    // Restablece lastKey y hasMore para forzar una recarga desde el principio
    setLastKey(null);
    setHasMore(true);
    loadData(); // Llama a loadData sin vaciar los movimientos
  };
  
  

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 20,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0 && gestureState.dy <= 100) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 50) {
        onRefresh();
      }
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    },
  });

  const formatCurrency = (value: number) => {
    return `₡ ${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const renderItem = ({ item }: { item: Movement }) => {
    const parsedDate = parseISO(item.date);
    const formattedDate = isToday(parsedDate)
      ? 'Hoy ' + format(parsedDate, 'hh:mm a', { locale: es })
      : format(parsedDate, 'dd/MM/yy hh:mm a', { locale: es });

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Details', { movement: item })}
        style={styles.movementItem}
      >
        <View style={styles.movementInfo}>
          <Text style={styles.movementText}>SINPE móvil - {item.name}</Text>
          <Text style={styles.movementDate}>{formattedDate}</Text>
        </View>
        <Text style={styles.movementAmount}>
          - {formatCurrency(Math.abs(item.amount))}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View {...panResponder.panHandlers}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {refreshing && <Text style={styles.refreshText}>Actualizando...</Text>}
          <Image source={require('../path_to_image/wink_logo.png')} style={styles.logo} />
          <Text style={styles.balanceTitle}>Cuenta Colones</Text>
          <Text style={styles.subtitle}>Saldo disponible</Text>
          <Animated.Text style={[styles.balance, { transform: [{ scale: balanceAnimation }] }]}>
            {balance !== null ? formatCurrency(balance) : 'Cargando...'}
          </Animated.Text>
          <Text style={styles.question}>¿Qué querés hacer?</Text>

          <TouchableOpacity onPress={() => navigation.navigate('Contacts')}>
            <Image source={require('../path_to_image/sinpe_icon.png')} style={styles.sinpeIcon} />
            <Text style={styles.sinpeText}>SINPE móvil</Text>
          </TouchableOpacity>

          <Text style={styles.movementsTitle}>Movimientos</Text>
        </ScrollView>
      </View>

      <FlatList
        data={movements}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  refreshText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#4A90E2',
    paddingTop: 39,
  },
  logo: {
    width: 500,
    height: 90,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 30,
    transform: [{ translateY: 39 }],
  },
  balanceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  balance: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  question: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  sinpeIcon: {
    width: 330,
    height: 65,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 5,
  },
  sinpeText: {
    color: '#4A90E2',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 50,
    lineHeight: 16,
    alignSelf: 'center',
  },
  movementsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  movementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  movementInfo: {
    flexDirection: 'column',
  },
  movementText: {
    fontSize: 16,
  },
  movementDate: {
    fontSize: 12,
    color: '#666',
  },
  movementAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
});

export default HomeScreen;
