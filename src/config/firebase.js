import { AsyncStorage } from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence,  } from 'firebase/auth';

/**
 * Config fireb
 */
const firebaseConfig = {
  apiKey: "AIzaSyAg9yyCUwQ_ZTgaoT3y_36PQ2nKLwi4UTI",
  authDomain: "shoppingapp-364d4.firebaseapp.com",
  databaseURL: "https://shoppingapp-364d4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shoppingapp-364d4",
  storageBucket: "shoppingapp-364d4.appspot.com",
  messagingSenderId: "1070555700532",
  appId: "1:1070555700532:web:0335baa7dad40eff5dd961",
  measurementId: "G-J2JFW51E8X"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);

