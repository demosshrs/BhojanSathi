import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Replace with your Firebase project config from console.firebase.google.com
// Project settings → General → Your apps → SDK setup and configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBbJsUUrXWgbizflKkfWeSgrs8GeRxjxgk',
  authDomain: 'mobile-programming-ed154.firebaseapp.com',
  databaseURL: 'https://mobile-programming-ed154-default-rtdb.firebaseio.com',
  projectId: 'mobile-programming-ed154',
  storageBucket: 'mobile-programming-ed154.firebasestorage.app',
  messagingSenderId: '524985634079',
  appId: '1:524985634079:web:c05d9f67d13567448ef42a',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
