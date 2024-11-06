import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getMovementDetails } from '../services/apiService'; // Importa la función desde apiService

type DetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Details'>;
type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

type Props = {
  navigation: DetailsScreenNavigationProp;
  route: DetailsScreenRouteProp;
};

interface MovementDetails {
  id: string;
  fecha: string;
  nombreContacto: string;
  numeroContacto: string;
  monto: number;
  detalle: string;
  tipoMovimiento: string;
}


const DetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { movement } = route.params;
  const [movementDetails, setMovementDetails] = useState<MovementDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovementDetails = async () => {
      try {
        const data = await getMovementDetails(movement.id, movement.date);
        setMovementDetails(data);
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar la información del movimiento');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMovementDetails();
  }, [movement.id, movement.date]);
  

  const formatCurrency = (value: number) => {
    return `₡ ${Math.abs(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatPhoneNumber = (phoneNumber: string) => {
    const cleanedNumber = phoneNumber.replace(/\D/g, ''); // Remover todos los caracteres que no sean dígitos
    const isPrefixed = cleanedNumber.startsWith('506'); // Verificar si el número ya tiene el prefijo
    
    // Si el número ya tiene el prefijo +506, no agregarlo de nuevo
    const fullNumber = isPrefixed ? cleanedNumber : `506${cleanedNumber}`;
    
    // Formatear el número en el formato +506 XXXX-XXXX
    return `+${fullNumber.slice(0, 3)} ${fullNumber.slice(3, 7)}-${fullNumber.slice(7)}`;
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

      const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        ...(isToday ? {} : { day: 'numeric', month: 'long', year: 'numeric' })
      };

      return `${isToday ? 'Hoy' : ''} ${date.toLocaleTimeString('es-CR', options)}`.trim();
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (!movementDetails) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
            {movementDetails.nombreContacto.split(' ').map((n) => n[0]).join('')}
          </Text>
        </View>
        <Text style={styles.movementTitle}>SINPE móvil - {movementDetails.nombreContacto}</Text>
        <Text style={styles.amount}>{formatCurrency(movementDetails.monto)}</Text>

        <View style={styles.detailSection}>
          <Text style={styles.label}>Fecha</Text>
          <Text style={styles.detailText}>{formatDate(movementDetails.fecha)}</Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.label}>Número de teléfono destino</Text>
          <Text style={styles.detailText}>{formatPhoneNumber(movementDetails.numeroContacto)}</Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.label}>Descripción</Text>
          <Text style={styles.detailText}>{movementDetails.detalle}</Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.label}>Tipo de movimiento</Text>
          <Text style={styles.detailText}>{movementDetails.tipoMovimiento}</Text>
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
    marginBottom: 16,
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
