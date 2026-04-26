import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBbJsUUrXWgbizflKkfWeSgrs8GeRxjxgk',
  authDomain: 'mobile-programming-ed154.firebaseapp.com',
  databaseURL: 'https://mobile-programming-ed154-default-rtdb.firebaseio.com',
  projectId: 'mobile-programming-ed154',
  storageBucket: 'mobile-programming-ed154.firebasestorage.app',
  messagingSenderId: '524985634079',
  appId: '1:524985634079:web:c05d9f67d13567448ef42a',
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app, firebaseConfig.databaseURL);
export const auth = getAuth(app);
