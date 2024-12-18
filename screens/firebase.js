import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, get, set, push } from 'firebase/database';
import { 
    getAuth, 
    initializeAuth, 
    getReactNativePersistence 
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_KEY, AUTH_DOMAIN } from '@env';

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

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

const database = getDatabase(app);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export { database, ref, get, set, push, auth };
