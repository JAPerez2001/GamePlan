// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCArw7zt_xvRumjn8hf-STa_erJP9uANBw",
    authDomain: "gameplan-a1480.firebaseapp.com",
    projectId: "gameplan-a1480",
    storageBucket: "gameplan-a1480.appspot.com",
    messagingSenderId: "54868719228",
    appId: "1:54868719228:web:2c4067c780ff29ef5dfbf9"
  };
  

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };