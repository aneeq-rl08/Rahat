import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCyCq-57UxKGdEAiqIoQkFM6WQaxDLuv1U",
    authDomain: "the-rahat.firebaseapp.com",
    projectId: "the-rahat",
    storageBucket: "the-rahat.firebasestorage.app",
    messagingSenderId: "562772675180",
    appId: "1:562772675180:web:7317807e50f7ce179d6649"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
