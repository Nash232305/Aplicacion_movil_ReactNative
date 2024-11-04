import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';

type DetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Details'>;
type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

type Props = {
  navigation: DetailsScreenNavigationProp;
  route: DetailsScreenRouteProp;
};

const DetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { movement } = route.params;

  const formatCurrency = (value: number) => {
    return `₡ ${Math.abs(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatPhoneNumber = (phoneNumber: string) => {
    return `+${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7)}`;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) throw new Error();
      const today = new Date();
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      const options: Intl.DateTimeFormatOptions = isToday
        ? { hour: 'numeric', minute: 'numeric', hour12: true }
        : { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };

      return date.toLocaleDateString('es-CR', options);
    } catch {
      return dateString;
    }
  };

  const phoneNumber = formatPhoneNumber('50687536347'); // Número ficticio para mostrar el formato

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Detalle de movimiento</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.contactIcon}>
          <Text style={styles.contactInitials}>
            {movement.name.split(' ').map((n: string) => n[0]).join('')}
          </Text>
        </View>
        <Text style={styles.movementTitle}>SINPE móvil - {movement.name}</Text>
        <Text style={styles.amount}>{formatCurrency(movement.amount)}</Text>

        <View style={styles.detailSection}>
          <Text style={styles.label}>Fecha</Text>
          <Text style={styles.detailText}>{formatDate(movement.date)}</Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.label}>Número de teléfono destino</Text>
          <Text style={styles.detailText}>{phoneNumber}</Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.label}>Descripción</Text>
          <Text style={styles.detailText}>Transferencia SINPE móvil</Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.label}>Tipo de movimiento</Text>
          <Text style={styles.detailText}>SINPE móvil</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingTop: 40,
  },
  backButtonContainer: {
    paddingRight: 10,
  },
  backButton: {
    fontSize: 24,
    color: '#4A90E2',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
    flex: 1,
  },
  detailsContainer: {
    alignItems: 'center',
    marginVertical: 50,
  },
  contactIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  contactInitials: {
    fontSize: 18,
    color: '#4A90E2',
  },
  movementTitle: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  detailSection: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '300',
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 'auto',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DetailsScreen;
