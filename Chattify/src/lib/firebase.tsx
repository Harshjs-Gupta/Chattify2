import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
  apiKey: "AIzaSyDm1ThjPIWnCvMJ_uTceOcPLtLrWRW_Qjg",
  authDomain: "chattify-7174d.firebaseapp.com",
  projectId: "chattify-7174d",
  storageBucket: "chattify-7174d.appspot.com",
  messagingSenderId: "850052492435",
  appId: "1:850052492435:web:ade059c6245f34db1e7166",
  measurementId: "G-GET407LTWT",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getFirestore(app);
export const storage = getStorage(app);
