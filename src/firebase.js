// src/firebase.js
import { initializeApp }              from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            "AIzaSyCYoYD0kbnTp1AW957nLJDnthuPI9tHHeU",
  authDomain:        "whispr-app-1ff02.firebaseapp.com",
  projectId:         "whispr-app-1ff02",
  storageBucket:     "whispr-app-1ff02.appspot.com",
  messagingSenderId: "883223704898",
  appId:             "1:883223704898:web:cf89a42bb31dada97304db",
  measurementId:     "G-ZQR122Z1Q4",
};

const app       = initializeApp(firebaseConfig);
export const db = getFirestore(app);

function encodeKey(key) {
  return key.replace(/\//g, "__").replace(/\s+/g, "_");
}

export async function storageGet(key) {
  try {
    const snap = await getDoc(doc(db, "whispr", encodeKey(key)));
    if (!snap.exists()) return null;
    return JSON.parse(snap.data().value);
  } catch (e) {
    console.error("storageGet failed:", key, e.message);
    return null;
  }
}

export async function storageSet(key, val) {
  try {
    await setDoc(doc(db, "whispr", encodeKey(key)), {
      value:     JSON.stringify(val),
      updatedAt: Date.now(),
    });
    return true;
  } catch (e) {
    console.error("storageSet failed:", key, e.message);
    return false;
  }
}