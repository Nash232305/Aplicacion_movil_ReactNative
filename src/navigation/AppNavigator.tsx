import React as _React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// Importa las herramientas necesarias de React Navigation para manejar la navegación entre pantallas.

import HomeScreen from '../screens/HomeScreen';
import TransferScreen from '../screens/TransferScreen';
import DetailsScreen from '../screens/DetailsScreen';
import ContactsScreen from '../screens/ContactsScreen';
// Importa los componentes de pantalla que se usarán en la navegación.

export interface Movement {
  id: string;
  name: string;
  amount: number;
  date: string;
}
// Define una interfaz `Movement` que describe la estructura de un movimiento, con las propiedades `id`, `name`, `amount` y `date`.
// Esto asegura consistencia y ayuda con el autocompletado al usar TypeScript.

export type RootStackParamList = {
  Home: { newMovement?: Movement } | undefined;
  Transfer: { contact: { name: string; phoneNumber: string; initials: string } };
  Details: { movement: Movement };
  Contacts: undefined;
};
// Define los parámetros para cada pantalla del stack de navegación:
// - `Home`: Puede recibir opcionalmente un nuevo movimiento (`newMovement`) o no tener parámetros.
// - `Transfer`: Requiere un parámetro `contact` con detalles del contacto (nombre, número de teléfono e iniciales).
// - `Details`: Requiere un parámetro `movement` para mostrar los detalles de un movimiento específico.
// - `Contacts`: No recibe parámetros.

const Stack = createStackNavigator<RootStackParamList>();
// Crea una instancia de Stack Navigator usando el tipo `RootStackParamList` para asegurar que los parámetros de las pantallas sean consistentes.

const AppNavigator = () => (
  <NavigationContainer>
    {/* Proporciona el contenedor principal para la navegación de la aplicación. */}
    <Stack.Navigator>
      {/* Define las pantallas y sus configuraciones dentro del stack de navegación. */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
        // Configura la pantalla principal (`HomeScreen`) y oculta su encabezado.
      />
      <Stack.Screen
        name="Transfer"
        component={TransferScreen}
        options={{ headerShown: false }}
        // Configura la pantalla de transferencias (`TransferScreen`) y oculta su encabezado.
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ headerShown: false }}
        // Configura la pantalla de detalles (`DetailsScreen`) y oculta su encabezado.
      />
      <Stack.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{ headerShown: false }}
        // Configura la pantalla de contactos (`ContactsScreen`) y oculta su encabezado.
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
// Exporta el componente de navegación para que pueda ser utilizado como el núcleo de la aplicación.
