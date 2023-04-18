import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB0zwV6AYo2JxDWxZkbzciNwGTLA35bEM4",
  authDomain: "carrito-xyz.firebaseapp.com",
  projectId: "carrito-xyz",
  storageBucket: "carrito-xyz.appspot.com",
  messagingSenderId: "150680900614",
  appId: "1:150680900614:web:4719b9b214109cb5755f87"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
export {db}