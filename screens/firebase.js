// Importa las funciones necesarias de Firebase (v9+)
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, push } from 'firebase/database';
import { getAuth } from 'firebase/auth'; // Importa getAuth
import { API_KEY, AUTH_DOMAIN } from '@env';

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: "walkingbuddy-f8712",
    storageBucket: "walkingbuddy-f8712.firebasestorage.app",
    messagingSenderId: "289829473388",
    appId: "1:289829473388:web:bcedd3ab00f9ffeebd5c49",
    measurementId: "G-8P4E09TSYB",
    databaseURL: "https://walkingbuddy-f8712-default-rtdb.firebaseio.com/" 
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app); // Inicializa la autenticación

// Exporta las funciones necesarias
export { database, ref, get, set, push, auth };
