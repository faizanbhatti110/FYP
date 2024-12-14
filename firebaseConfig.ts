

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from 'firebase/storage';
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCXjhfPdtECvN_qIaf0yb8HKGRg0CN-re8",
  authDomain: "advanced-supermart.firebaseapp.com",
  projectId: "advanced-supermart",
  storageBucket: "advanced-supermart.appspot.com",
  messagingSenderId: "102813193508",
  appId: "1:102813193508:web:fe0d567174b70c93804fb1",
  measurementId: "G-CM3FNW33YE"
};


const app = initializeApp(firebaseConfig);


const db = getFirestore(app); 


const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db ,storage, auth};
