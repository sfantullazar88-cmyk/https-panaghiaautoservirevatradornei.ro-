importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCIylVh3R-W-HYaSC9wgh3yM5GR158Fgs4",
  authDomain: "panaghia-autoservire.firebaseapp.com",
  projectId: "panaghia-autoservire",
  storageBucket: "panaghia-autoservire.firebasestorage.app",
  messagingSenderId: "4655355032",
  appId: "1:4655355032:web:763fc312796ba2a3adaced",
  measurementId: "G-DS0VX5NTZS"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(
    payload.notification?.title || "Comandă nouă!",
    {
      body: payload.notification?.body || "Ai primit o comandă nouă.",
      icon: "/favicon.ico"
    }
  );
});