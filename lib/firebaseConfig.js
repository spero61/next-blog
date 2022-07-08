import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// it's safe to expose firebase public key here
// as it is only used to identify firebase app from google server
const config = {
  apiKey: "AIzaSyA_1rMyuYUyadFnA87SotzK91H5ApHHKfs",
  authDomain: "next-blog-18f7f.firebaseapp.com",
  projectId: "next-blog-18f7f",
  storageBucket: "next-blog-18f7f.appspot.com",
  messagingSenderId: "280969433089",
  appId: "1:280969433089:web:13df12d5755dc7ed6f7000",
  measurementId: "G-9KY2288K89"
};

function createFirebaseApp(config) {
    try {
      return getApp();
    } catch {
      return initializeApp(config);
    }
  }

// Initialize Firebase
const app = createFirebaseApp(config);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, googleAuthProvider, db, analytics };

