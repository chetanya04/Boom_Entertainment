
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBJAywopjp7u28c6bBlHX2_n8r2MCWvLtY",
  authDomain: "student-login-c06b7.firebaseapp.com",
  projectId: "student-login-c06b7",
  storageBucket: "student-login-c06b7.appspot.com",
  messagingSenderId: "753948386914",
  appId: "1:753948386914:web:2ccdc40ffcb5ef1a71133b"
};

const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
