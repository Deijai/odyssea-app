// firebase/config.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApps, initializeApp } from 'firebase/app';
import {
    // @ts-ignore
    getReactNativePersistence,
    initializeAuth,
} from 'firebase/auth';
import {
    getFirestore,
} from 'firebase/firestore';
import {
    getStorage,
} from 'firebase/storage';

// ⚠️ Substitua esses valores pelos do seu projeto no Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyDy5VKmTS5Sr2tqZQI6Z-KJiTldh1I1Vwg",
    authDomain: "odyssea-app.firebaseapp.com",
    projectId: "odyssea-app",
    storageBucket: "odyssea-app.firebasestorage.app",
    messagingSenderId: "538732015962",
    appId: "1:538732015962:web:0b14cc65da6127d5cc4363",
    measurementId: "G-MDZ8WHVXEM"
};

let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Auth com persistência nativa (AsyncStorage)
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

