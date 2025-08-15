// ✅ Updated Firebase.js with safer Google Redirect login and forced account switch

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithCustomToken,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔧 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyByg3N6LdCCmC48oeRdbCbUMPHtA6EpHt8",
  authDomain: "retronix-auth.firebaseapp.com",
  projectId: "retronix-auth",
  storageBucket: "retronix-auth.appspot.com",
  messagingSenderId: "241986714763",
  appId: "1:241986714763:web:10a3fed332e411f9f4688e",
  measurementId: "G-B1JZG3MG5Y",
};

// 🔌 Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 🔐 Firebase services
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" }); // ✅ Force Google to show account chooser

export const db = getFirestore(app);
export { app, analytics };

// 🟣 Discord custom token login
export const loginWithDiscordToken = async (token) => {
  if (!token) {
    console.error("Missing Firebase custom token from Discord flow");
    return;
  }

  try {
    const userCredential = await signInWithCustomToken(auth, token);
    console.log("✅ Logged in with Discord!", userCredential.user);
    return userCredential.user;
  } catch (err) {
    console.error("❌ Discord Firebase login failed:", err);
    throw err;
  }
};

// ✉️ Register user with email + send verification
export const registerWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    alert("✅ Verification email sent. Please check your inbox.");
    return userCredential.user;
  } catch (err) {
    console.error("❌ Email registration failed:", err);
    throw err;
  }
};

// 🔐 Login user and check email verification
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      alert("⚠️ Please verify your email before logging in.");
      throw new Error("Email not verified");
    }

    return user;
  } catch (err) {
    console.error("❌ Email login failed:", err);
    throw err;
  }
};

// ✅ Google Redirect login
export const loginWithGoogleRedirect = () => {
  return signInWithRedirect(auth, provider);
};

export const handleGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      console.log("✅ Google Redirect Success:", result.user);
      return result.user;
    }
  } catch (error) {
    console.error("❌ Google Redirect failed:", error);
    throw error;
  }
};