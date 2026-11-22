const firebaseConfig = {
  apiKey: "AIzaSyCCXIuHcIZLF6UAE_S38H82KjCcCdxuKxM",
  authDomain: "yarisma-oyunu-b82ae.firebaseapp.com",
  databaseURL: "https://yarisma-oyunu-b82ae-default-rtdb.firebaseio.com",
  projectId: "yarisma-oyunu-b82ae",
  storageBucket: "yarisma-oyunu-b82ae.firebasestorage.app",
  messagingSenderId: "935329913031",
  appId: "1:935329913031:web:9af2bd941d296dc3c306e2",
  measurementId: "G-T67SEK54RG"
};

let db = null;
let isDemoMode = false;

function initFirebase() {
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "BURAYA_API_KEY_YAZIN") {
    console.warn("Firebase yapılandırılmamış! Demo (Yerel Tarayıcı) modu aktif ediliyor.");
    isDemoMode = true;
    return false;
  }
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    db = firebase.database();
    return true;
  } catch (err) {
    console.error("Firebase başlatma hatası:", err);
    isDemoMode = true;
    return false;
  }
}
