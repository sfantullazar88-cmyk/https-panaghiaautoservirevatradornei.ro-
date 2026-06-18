import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCIylVh3R-W-HYaSC9wgh3yM5GR158Fgs4",
  authDomain: "panaghia-autoservire.firebaseapp.com",
  projectId: "panaghia-autoservire",
  storageBucket: "panaghia-autoservire.firebasestorage.app",
  messagingSenderId: "4655355032",
  appId: "1:4655355032:web:763fc312796ba2a3adaced",
  measurementId: "G-DS0VX5NTZS"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };