import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { createMovement, getBalance } from '../services/apiService'; // Importa getBalance

type TransferScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Transfer'>;
type TransferScreenRouteProp = RouteProp<RootStackParamList, 'Transfer'>;

type Props = {
  navigation: TransferScreenNavigationProp;
  route: TransferScreenRouteProp;
};

const TransferScreen: React.FC<Props> = ({ navigation, route }) => {
  const { contact } = route.params;
  const [amount, setAmount] = useState('');
  const [detail, setDetail] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const currentBalance = await getBalance();
        setBalance(currentBalance);
      } catch (error) {
        console.error('Error al obtener el balance:', error);
      }
    };

    fetchBalance();
  }, []);

   const handleConfirm = async () => {
    if (!amount || !detail) {
        Alert.alert('Error', 'Por favor, ingresa el monto y el detalle.');
        return;
    }

    const parsedAmount = parseFloat(amount.replace(/,/g, '').replace(/₡/g, ''));

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        Alert.alert('Error', 'Por favor, ingresa un monto válido.');
        return;
    }

    setLoading(true);

    try {
        const response = await createMovement({
            nombreContacto: contact.name,
            numeroContacto: contact.phoneNumber,
            monto: parsedAmount,
            detalle: detail,
        });

        if (!response || response.error) {
            const errorMessage =
                response.error === 'Fondos insuficientes para realizar esta transferencia.'
                    ? 'No tienes fondos suficientes.'
                    : 'Hubo un problema al realizar la transferencia.';
            throw new Error(errorMessage);
        }

        Alert.alert('Éxito', 'La transferencia se ha realizado correctamente.');
        navigation.navigate('Home');
    } catch (error) {
        Alert.alert('Error', (error as Error).message || 'Ocurrió un problema inesperado.');
        console.error(error);
    } finally {
        setLoading(false);
    }
};
  

  // Función para formatear el número de teléfono en el formato deseado
  const formatPhoneNumber = (number: string) => {
    const cleanedNumber = number.replace(/\D/g, '');
    if (cleanedNumber.startsWith('506') && cleanedNumber.length === 11) {
      return `+506 ${cleanedNumber.slice(3, 7)}-${cleanedNumber.slice(7)}`;
    } else if (cleanedNumber.length === 8) {
      return `+506 ${cleanedNumber.slice(0, 4)}-${cleanedNumber.slice(4)}`;
    }
    return number;
  };

  // Función para aplicar el formato con coma y punto al finalizar la entrada
  const applyFormat = () => {
    const cleanedValue = amount.replace(/[^0-9]/g, '');
    if (cleanedValue) {
      const formattedValue = parseFloat(cleanedValue).toLocaleString('en-US', {
        style: 'currency',
        currency: 'CRC',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      setAmount(formattedValue.replace('CRC', '₡').trim());
    }
  };

  return (
    <View style={styles.container}>
      {/* Render de UI */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={styles.header}>Enviar dinero</Text>
      </View>

      <Text style={styles.subHeader}>Transferir a</Text>
      <View style={styles.contactInfo}>
        <View style={styles.contactIcon}>
          <Text style={styles.contactInitial}>{contact.initials}</Text>
        </View>
        <View>
          <Text style={styles.contactName}>{contact.name}</Text>
          <Text style={styles.contactNumber}>{formatPhoneNumber(contact.phoneNumber)}</Text>
        </View>
      </View>

      <Text style={styles.label}>Monto</Text>
      <TextInput
        style={styles.input}
        placeholder="₡0.00"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        onBlur={applyFormat}
      />

      <Text style={styles.label}>Detalle</Text>
      <TextInput
        style={styles.input}
        placeholder="Escribe un detalle"
        value={detail}
        onChangeText={setDetail}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirmar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
    paddingTop: 40,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
    flex: 1,
  },
  subHeader: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactInitial: {
    fontSize: 18,
    color: '#4A90E2',
  },
  contactName: {
    fontSize: 18,
    color: '#000',
  },
  contactNumber: {
    fontSize: 14,
    color: '#4A90E2',
  },
  label: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: '#e6e6e6',
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 25,
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 15,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  confirmButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    height: 50,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TransferScreen;
