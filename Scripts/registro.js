import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js';
import {
    getAuth, createUserWithEmailAndPassword, sendEmailVerification
} from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDbr4HoEt4xNlMAeb3ITBCLcG10dW3e4Jg",
    authDomain: "proyectotfg-36244.firebaseapp.com",
    projectId: "proyectotfg-36244",
    storageBucket: "proyectotfg-36244.appspot.com",
    messagingSenderId: "769270297853",
    appId: "1:769270297853:web:eaa979fa67be27be5cfa94",
    measurementId: "G-431XXE4MES"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('registro').addEventListener('click', (e) => {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    createUserWithEmailAndPassword(auth, email, password).then(cred => {
        alert('usuario creado');
        sendEmailVerification(auth.currentUser).then(() => {
            alert("Se ha enviado el correo de verificación");
        });
        auth.signOut();
    }).catch(error => {
        const errorCode = error.code;

        if (errorCode == 'auth/email-already-in-use') {
            alert('El correo ya está en uso');
        } else if (errorCode == 'auth/invalid-email') {
            alert('El correo no es válido');
        } else if (errorCode == 'auth/weak-password') {
            alert('La contraseña debe tener al menos 6 caracteres');
        } else {
            alert('Error: ' + error.message);
        }
    });
});