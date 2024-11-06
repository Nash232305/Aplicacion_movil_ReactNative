# Aplicación Móvil React Native - SINPE Móvil

Desarrollar una aplicación móvil en React Native que simula el envío de dinero por SINPE Móvil y lista dichos envíos.

## 📱 Descripción

Esta aplicación permite a los usuarios:
- **Consultar su saldo disponible**.
- **Realizar transferencias SINPE Móvil** a sus contactos.
- **Visualizar un historial de movimientos** ordenados del más reciente al más antiguo.
- **Consultar detalles específicos de cada movimiento**.

El proyecto incluye:
- Interfaz amigable desarrollada en **React Native**.
- Backend desarrollado en **Node.js** (repositorio [aquí](https://github.com/Nash232305/backend-nodejs)).
- Conexión con AWS para la persistencia de datos y ejecución de funciones Lambda.

## 🚀 Funcionalidades

1. **Transferencias SINPE Móvil**
   - Enviar dinero a contactos seleccionados desde la lista.
   - Validación de montos disponibles y número de teléfono.
   - Balance actualizado automáticamente tras cada transacción exitosa.

2. **Lista de Movimientos**
   - Historial de transferencias mostradas de forma paginada.
   - Actualización en tiempo real al agregar o eliminar movimientos.

3. **Detalle de Movimiento**
   - Consulta de detalles de cada movimiento, incluyendo:
     - Fecha.
     - Número de teléfono destino.
     - Monto.
     - Tipo de movimiento.

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React Native
- **Backend:** Node.js con AWS Lambda y DynamoDB
- **Librerías principales:**
  - `axios` para realizar peticiones HTTP.
  - `react-navigation` para la navegación entre pantallas.
  - `date-fns` para el manejo de fechas.
  - `react-native-vector-icons` para iconos.

## 📂 Estructura del Proyecto

```plaintext
APLICACION_MOVIL_REACTNATIVE/
├── .expo/                      # Archivos de configuración del entorno Expo.
├── assets/                     # Recursos como imágenes, íconos y fuentes.
│   ├── sinpe_icon.png
│   └── wink_logo.png
├── node_modules/               # Dependencias instaladas con npm.
├── src/                        # Código fuente principal de la aplicación.
│   ├── navigation/             # Configuración de la navegación.
│   │   └── AppNavigator.tsx    # Definición de rutas (Stacks, Tabs, etc.).
│   ├── screens/                # Pantallas principales de la app.
│   │   ├── ContactsScreen.tsx
│   │   ├── DetailsScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   └── TransferScreen.tsx
│   └── services/               # Lógica de conexión con el backend.
│       └── apiService.ts       # Funciones para consumir la API.
├── .gitignore                  # Ignora archivos no relevantes en Git.
├── app.json                    # Configuración del proyecto Expo.
├── App.tsx                     # Entrada principal de la aplicación.
├── babel.config.js             # Configuración de Babel.
├── package-lock.json           # Versión bloqueada de las dependencias.
├── package.json                # Información del proyecto y dependencias.
├── README.md                   # Documentación del proyecto.
└── tsconfig.json               # Configuración de TypeScript.
