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

function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' }); // Mostrar todas las cuentas disponibles
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            // Autenticación exitosa
            const user = result.user;
            console.log("Usuario autenticado:", user);
            // Redireccionar a Map.cshtml
            window.location.href = "/Map";
        })
        .catch((error) => {
            // Manejar errores
            console.error("Error al autenticar con Google:", error);
        });
}
let tempPassword = '';

function crearUsuario() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!password) {
        alert('Debes de introducir una contraseña');
    } else {
        // Almacenar la contraseña en una variable global
        tempPassword = password;

        // Si hay contraseña, crear usuario directamente
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Usuario creado exitosamente
                const user = userCredential.user;
                console.log('Usuario creado:', user);
                sendVerificationEmail(user);
                showVerificationModal(user);

                // Vaciar campos de email y contraseña
                document.getElementById('email').value = '';
                document.getElementById('password').value = '';
            })
            .catch((error) => {
                // Manejar errores
                console.error('Error al crear usuario:', error);
            });
    }
}


function sendVerificationEmail(user) {
    user.sendEmailVerification().then(() => {
        console.log('Correo de verificación enviado');
    }).catch((error) => {
        console.error('Error al enviar el correo de verificación:', error);
    });
}

function showVerificationModal(user) {
    const modal = document.getElementById('verification-modal');
    modal.style.display = 'block';

    // Check if the email is verified every 5 seconds
    const interval = setInterval(() => {
        user.reload().then(() => {
            if (user.emailVerified) {
                clearInterval(interval);
                modal.style.display = 'none';
                alert('Correo verificado con éxito. Puedes iniciar sesión.');

                // Cifrar la contraseña almacenada en tempPassword
                const encryptedPassword = btoa(tempPassword); // Utilizando Base64 para cifrar (esto es solo un ejemplo, usa un método más seguro en producción)

                // Hacer una solicitud al servidor para insertar el usuario en la base de datos
                fetch('/Home/CreateVerifiedUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        correo: user.email,
                        contraseña: encryptedPassword
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            console.log('Usuario insertado en la base de datos.');
                        } else {
                            console.error('Error al insertar el usuario en la base de datos.');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
        });
    }, 5000);
}


function validateEmail() {
    const email = document.getElementById('email').value;
    const validDomains = ['@gmail.com', '@outlook.com', '@hotmail.com'];
    const domain = email.substring(email.lastIndexOf('@'));

    if (!validDomains.includes(domain)) {
        alert('Correo incorrecto. Debe finalizar en @gmail.com, @outlook.com, o @hotmail.com.');
        return;
    }

    // Realizar una llamada AJAX para comprobar si el correo existe en la base de datos
    checkEmailInDatabase(email);
}

function checkEmailInDatabase(email) {
    fetch(`/Home/CheckEmail?correo=${encodeURIComponent(email)}`)
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                // Correo encontrado, mostrar botón de iniciar sesión y ocultar botón de registrarse
                toggleButtons(true);
            } else {
                // Correo no encontrado, mostrar botón de registrarse y ocultar botón de iniciar sesión
                toggleButtons(false);
            }
        })
        .catch(error => console.error('Error:', error));
}

function toggleButtons(emailExists) {
    const btnIniciarSesion = document.getElementById('btn-iniciar-sesion');
    const btnRegistrarse = document.getElementById('btn-registrarse');

    if (emailExists) {
        btnIniciarSesion.style.display = 'inline-block';
        btnRegistrarse.style.display = 'none';
    } else {
        btnIniciarSesion.style.display = 'none';
        btnRegistrarse.style.display = 'inline-block';
    }
}

function signInWithEmail() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch(`/Home/VerifyCredentials?correo=${encodeURIComponent(email)}&contraseña=${encodeURIComponent(password)}`)
        .then(response => response.json())
        .then(data => {
            if (data.isValid) {
                // Autenticación exitosa
                console.log("Usuario autenticado:", email);
                window.location.href = "/Map";
            } else {
                // Manejar errores de autenticación
                console.error("Correo electrónico o contraseña incorrectos.");
                alert("Correo electrónico o contraseña incorrectos.");
            }
        })
        .catch(error => console.error('Error:', error));
}