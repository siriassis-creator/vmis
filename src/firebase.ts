import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAyuEF4fDU65TpeVDDnw8l91fwLaYypWXo',
  authDomain: 'vmis-eeca8.firebaseapp.com',
  projectId: 'vmis-eeca8',
  storageBucket: 'vmis-eeca8.firebasestorage.app',
  messagingSenderId: '602652412992',
  appId: '1:602652412992:web:b52d0a2d82a96b33f863a5',
  measurementId: 'G-41PQJWS30E',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app); // Export db เตรียมไว้สำหรับทำฟีเจอร์อื่นๆ
