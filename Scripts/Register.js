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
firebase.initializeApp(firebaseConfig);

function crearUsuario() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    if (!password) {
        // Si no hay contraseña, enviar correo de verificación
        firebase.auth().createUserWithEmailAndPassword(email, 'passwordPorDefecto')
            .then((userCredential) => {
                // Usuario creado exitosamente
                const user = userCredential.user;
                console.log('Usuario creado:', user);
            })
            .catch((error) => {
                // Manejar errores
                console.error('Error al crear usuario:', error);
            });
    } else {
        // Si hay contraseña, crear usuario directamente
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Usuario creado exitosamente
                const user = userCredential.user;
                console.log('Usuario creado:', user);
            })
            .catch((error) => {
                // Manejar errores
                console.error('Error al crear usuario:', error);
            });
    }
}

function enviarCorreoVerificacion() {
    const user = firebase.auth().currentUser;

    user.sendEmailVerification()
        .then(() => {
            // Correo de verificación enviado exitosamente
            console.log('Correo de verificación enviado');
            // Mostrar campo de contraseña
            document.getElementById('passwordInputGroup').style.display = 'block';
            // Cambiar la función del botón para crear usuario
            document.getElementById('createUserBtn').setAttribute('onclick', 'crearUsuario()');
        })
        .catch((error) => {
            // Manejar errores
            console.error('Error al enviar correo de verificación:', error);
        });
}

firebase.auth().onAuthStateChanged((user) => {
    if (user && !user.emailVerified) {
        // Si el usuario está autenticado pero el correo no está verificado, enviar correo de verificación
        enviarCorreoVerificacion();
    }
});
