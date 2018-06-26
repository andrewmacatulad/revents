import firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDyJOQFwhiIeFq86aAVIxjXkz0kp6LiZDE",
  authDomain: "eventsproj-ce0cf.firebaseapp.com",
  databaseURL: "https://eventsproj-ce0cf.firebaseio.com",
  projectId: "eventsproj-ce0cf",
  storageBucket: "eventsproj-ce0cf.appspot.com",
  messagingSenderId: "1067603433"
};

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();
const settings = {
  timestampsInSnapshots: true
};
firestore.settings(settings);

export default firebase;
