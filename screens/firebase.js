// Importa las funciones necesarias de Firebase (v9+)
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, push } from 'firebase/database';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "REPLACEMENT_API_KEY",
  authDomain: "walkingbuddy-f8712.firebaseapp.com",
  projectId: "walkingbuddy-f8712",
  storageBucket: "walkingbuddy-f8712.firebasestorage.app",
  messagingSenderId: "289829473388",
  appId: "1:289829473388:web:bcedd3ab00f9ffeebd5c49",
  measurementId: "G-8P4E09TSYB",
  databaseURL: "https://walkingbuddy-f8712-default-rtdb.firebaseio.com/" // URL de tu base de datos
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Instancia de la base de datos de Firebase Realtime

// Exporta las funciones necesarias
export { database, ref, get, set, push };
