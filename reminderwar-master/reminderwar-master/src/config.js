import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyBmpAB2jeLv1zy45sq0HbFX9RlewpLljpY",
  authDomain: "reminder-war.firebaseapp.com",
  databaseURL: "https://reminder-war.firebaseio.com",
  projectId: "reminder-war",
  storageBucket: "reminder-war.appspot.com",
  messagingSenderId: "330428363747",
  appId: "1:330428363747:web:53a946b7fa5052ba5366d6",
  measurementId: "G-6RQP7HDJKX",
};

var database = firebase.initializeApp(firebaseConfig);

export const auth = database.auth();

export const db_user = database.firestore();
export const db_reminder = database.database();
export const db_attachment = database.storage();
