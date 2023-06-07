
import { initializeApp } from "firebase/app";
import { getFirestore, collection} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "process.env.REACT_APP_API_KEY",
  authDomain: "filmyverse-e19ee.firebaseapp.com",
  projectId: "filmyverse-e19ee",
  storageBucket: "filmyverse-e19ee.appspot.com",
  messagingSenderId: "452602998380",
  appId: "1:452602998380:web:f1de219b8ea0c98dbd3249"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 export const db = getFirestore(app);
 export const moviesRef = collection(db, "movies");
 export const reviewsRef = collection(db, "reviews");
 export const usersRef = collection(db, "users");

export default app;
