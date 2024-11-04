import React, { useState, useRef } from 'react';
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
  const [balance] = useState(36850.0);
  const [movements] = useState<Movement[]>([
    { id: '1', name: 'Arturo Robles', amount: -1850.0, date: 'Hoy 10:12 a.m.' },
    { id: '2', name: 'Juan Fernandez', amount: -1850.0, date: 'Hoy 8:36 a.m.' },
    { id: '3', name: 'Alberto Chaves', amount: -5200.0, date: 'Hoy 8:12 a.m.' },
    { id: '4', name: 'Bernal Campos', amount: -28000.0, date: 'Hoy 8:00 a.m.' },
    { id: '5', name: 'María Perez', amount: -1850.0, date: '11/10/22 11:30 a.m.' },
  ]);

  const [refreshing, setRefreshing] = useState(false);
  const translateY = useRef(new Animated.Value(0)).current;
  const balanceAnimation = useRef(new Animated.Value(1)).current;

  const onRefresh = () => {
    setRefreshing(true);

    // Animación de balance
    Animated.sequence([
      Animated.timing(balanceAnimation, { toValue: 1.2, duration: 200, useNativeDriver: true }),
      Animated.timing(balanceAnimation, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
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

  const renderItem = ({ item }: { item: Movement }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Details', { movement: item })}
      style={styles.movementItem}
    >
      <View style={styles.movementInfo}>
        <Text style={styles.movementText}>SINPE móvil - {item.name}</Text>
        <Text style={styles.movementDate}>{item.date}</Text>
      </View>
      <Text style={styles.movementAmount}>
        {item.amount < 0 ? '-' : ''}
        {formatCurrency(Math.abs(item.amount))}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView {...panResponder.panHandlers} showsVerticalScrollIndicator={false}>
        {refreshing && <Text style={styles.refreshText}>Actualizando...</Text>}
        <Image source={require('../path_to_image/wink_logo.png')} style={styles.logo} />
        <Text style={styles.balanceTitle}>Cuenta Colones</Text>
        <Text style={styles.subtitle}>Saldo disponible</Text>
        <Animated.Text style={[styles.balance, { transform: [{ scale: balanceAnimation }] }]}>
          {formatCurrency(balance)}
        </Animated.Text>
        <Text style={styles.question}>¿Qué querés hacer?</Text>

        <TouchableOpacity onPress={() => navigation.navigate('Contacts')}>
          <Image source={require('../path_to_image/sinpe_icon.png')} style={styles.sinpeIcon} />
          <Text style={styles.sinpeText}>SINPE móvil</Text>
        </TouchableOpacity>

        <Text style={styles.movementsTitle}>Movimientos</Text>
      </ScrollView>

      <FlatList
        data={movements}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
    paddingTop: 9,
  },
  logo: {
    width: 500,
    height: 90,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 50,
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
    marginBottom: 20,
  },
  question: {
    fontSize: 16,
    color: '#666',
    marginBottom: 1,
  },
  sinpeIcon: {
    width: 330,
    height: 65,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 15,
  },
  sinpeText: {
    color: '#4A90E2',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 50,
    lineHeight: 16,
    marginBottom: 20,
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
