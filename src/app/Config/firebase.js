import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD1JF3g5oclUd6ajBc0bNvuS2DFwRvQJKc",
  authDomain: "app-game-5c219.firebaseapp.com",
  projectId: "app-game-5c219",
  storageBucket: "app-game-5c219.appspot.com",
  messagingSenderId: "863516791666",
  appId: "1:863516791666:web:fbec39bed4b49771ce43eb",
  measurementId: "G-T94EFF4K5V"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
