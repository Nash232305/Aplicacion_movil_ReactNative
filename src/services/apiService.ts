import axios from 'axios';

export const getBalance = async () => {
  try {
    const response = await fetch('https://z755adyvuc.execute-api.us-east-2.amazonaws.com/dev/balance');
    const data = await response.json();
    return data.balance; // Asegúrate de que el campo `balance` es el correcto en la respuesta de la API
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
};

interface Movement {
  id: string; // default_user
  name: string; // nombreContacto
  amount: number; // monto
  date: string; // fecha
  userId: string; // El identificador único adicional
}


export const getMovements = async (lastEvaluatedKey: string | null = null, _pageSize: number = 10) => {
  try {
    const url = `https://z755adyvuc.execute-api.us-east-2.amazonaws.com/dev/movements${lastEvaluatedKey ? `?lastEvaluatedKey=${lastEvaluatedKey}` : ''}`;
  
    const response = await fetch(url);
    const data = await response.json();

    return {
      items: data.items.map((item: ItemType): Movement => ({
        id: item.id,
        name: item.nombreContacto,
        amount: item.monto,
        date: item.fecha, // Asegúrate de que el formato de fecha sea correcto
        userId: item.userId, // Mapea correctamente el campo userId
      })),
      lastEvaluatedKey: data.lastEvaluatedKey,
    };
  } catch (error) {
    console.error('Error fetching movements:', error);
    throw error;
  }
};


export const createMovement = async (movementData: {
  nombreContacto: string;
  numeroContacto: string;
  monto: number;
  detalle: string;
  tipoMovimiento?: string;
}) => {
  try {
    const response = await fetch('https://z755adyvuc.execute-api.us-east-2.amazonaws.com/dev/movements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...movementData,
        tipoMovimiento: 'SINPE móvil', // Valor por defecto
      }),
    });

    if (!response.ok) {
      // Si la respuesta no es exitosa, lanza un error
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al registrar el movimiento');
    }

    return await response.json(); // Devuelve la respuesta en caso de éxito
  } catch (error) {
    console.error('Error creating movement:', error);
    throw error; // Lanza el error para que pueda ser manejado en el componente
  }
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


export const getMovementDetails = async (id: string, fecha: string): Promise<MovementDetails> => {
  try {
    const response = await axios.get(
      `https://z755adyvuc.execute-api.us-east-2.amazonaws.com/dev/detallesMovimiento/${id}/${fecha}`
    );
    return response.data as MovementDetails; // Asegura que el tipo coincida
  } catch (error) {
    throw error;
  }
};
