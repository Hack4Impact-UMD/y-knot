// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { getFunctions } from 'firebase/functions';

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: 'AIzaSyBAA0V0otIUg8PeDLvQZ9ZNY-uPClC9PMM',
  authDomain: 'yknot-42027.firebaseapp.com',
  projectId: 'yknot-42027',
  storageBucket: 'yknot-42027.appspot.com',
  messagingSenderId: '528529630192',
  appId: '1:528529630192:web:5626a8be7e750283feb335',
  measurementId: 'G-VW2RYV6N7K',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export default app;
