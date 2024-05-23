import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/9.6.6/firebase-auth.js';

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

document.getElementById('login').addEventListener('click', (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario si existe

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password).then(cred => {
        if (cred.user.emailVerified) {
            alert('Usuario logueado');
            console.log(cred.user);

            // Guardar el uid en sessionStorage
            sessionStorage.setItem('uid', cred.user.uid);
        } else {
            alert('Usuario no verificado');
            auth.signOut(); // Cerrar sesión si el usuario no está verificado
        }
    }).catch(error => {
        const errorCode = error.code;

        if (errorCode === 'auth/invalid-email') {
            alert('El correo no es válido');
        } else if (errorCode === 'auth/user-disabled') {
            alert('El usuario ha sido deshabilitado');
        } else if (errorCode === 'auth/user-not-found') {
            alert('El correo no está registrado');
        } else if (errorCode === 'auth/wrong-password') {
            alert('Contraseña incorrecta');
        } else {
            alert('Error al iniciar sesión: ' + error.message);
        }
    });

});

auth.onAuthStateChanged(user => {
    if (user) {
        console.log('Usuario Activo');
        var emailVerified = user.emailVerified;
        if (emailVerified) {
            window.location.href = "/Map";
        } else {
            auth.signOut();
        }

    } else {
        console.log('usuario inactivo');
    }
});

document.getElementById('google-sign-in').addEventListener('click', signInWithGoogle);

function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' }); // Mostrar todas las cuentas disponibles

    signInWithPopup(auth, provider)
        .then((result) => {
            // Autenticación exitosa
            const user = result.user;
            console.log("Usuario autenticado:", user);

            // Guardar el uid en sessionStorage
            sessionStorage.setItem('uid', user.uid);

            // Redireccionar a Map.cshtml
            window.location.href = "/Map";
        })
        .catch((error) => {
            // Manejar errores
            console.error("Error al autenticar con Google:", error);
        });
}
