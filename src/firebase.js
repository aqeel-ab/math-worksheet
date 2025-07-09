import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0IEQ-vMFMkGWx-OpIb5r9xM5VDooCJpE",
  authDomain: "math-worksheet-f83fe.firebaseapp.com",
  projectId: "math-worksheet-f83fe",
  storageBucket: "math-worksheet-f83fe.firebasestorage.app",
  messagingSenderId: "890902652491",
  appId: "1:890902652491:web:2f5ffb296d66311bd8cfce"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
