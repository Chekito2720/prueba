import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyARffyTovBe1rkXSlIlrDmwcc-nPlTwsLk",
  authDomain: "practica8-347d6.firebaseapp.com",
  projectId: "practica8-347d6",
  storageBucket: "practica8-347d6.firebasestorage.app",
  messagingSenderId: "1095691841925",
  appId: "1:1095691841925:web:f861dc148dad0d06f5d4ec",
  measurementId: "G-7S3Q2SH0KG",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
