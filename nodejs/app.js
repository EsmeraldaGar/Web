//para importar a express
const express = require('express');
const app = express();
exports.app = app;

//set a unreadable para capturar los datos del formulario
app.use(express.urlencoded({ extended:false }));
app.use(express.json());

//invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'}); //vaya a la raiz del proyecto, busque la carpeta env y que las variables de entorno en env

//para importar el directorio public
app.use('/resourses',express.static('public'));//llamemos a resourses vamos a invocar todo lo public css, imagenes
app.use('/resourses',express.static(__dirname + '/public'));

//para plantillas, no se para que 
app.set('view engine', 'ejs');



//variables para el inicion de sesion
const session = require('express-session');
app.use(session ({
    secret: 'secret', //crear una clave
    resave: true, //parametros forma de almacenamiento
    saveUninitialized: true, 
    /*cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }*/
}));




//mandamos a llamar nuestras rutas paginas
app.get('/index.ejs', (req, res) => {
    res.render('index');
})
app.get('/login.ejs', (req, res) => {
    res.render('login');
})

app.get('/registro.ejs', (req, res) => {
    res.render('registro');
})

app.get('/registro-evento.ejs', (req, res) => {
    res.render('registro-evento');
})


app.listen(3006, (req,res)=> {
    console.log("Server is running in http://localhost:3006");
    })

//conexion a la base de datos
const bcryptjs = require('bcryptjs');
const connection = require('./database/db.js');

//resgistar en el formulario
app.post('/registro', async (req, res) => {
    const nombre = req.body.nombre;
    const usuario = req.body.usuario;
    const apellido = req.body.apellido;
    const email = req.body.email;
    const contraseña = req.body.contraseña;
    let passwordHaash = await bcryptjs.hash(contraseña, 8);
    connection.query('INSERT INTO users SET ?', { nombre: nombre, usuario: usuario, apellido: apellido, email: email, contraseña: passwordHaash }, async (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.send('REGISTRO EXITOSO');
        }
    });
});


//para el inicio de sesion
app.post('/auth', async (req, res) => {
    const usuario = req.body.usuario;
    const contraseña = req.body.contraseña;

    if (usuario && contraseña) {
        connection.query('SELECT * FROM users WHERE usuario = ?', [usuario], async (error, results) => {
            if (error) {
                console.log(error);
                res.send('Ocurrió un error durante la consulta');
                return;
            }
            if (results.length == 0) {
                 // El usuario no existe en la base de datos, necesita registrarse
                 res.send('<script>alert("El usuario no existe, por favor regístrese"); window.location.href = "/registro.ejs";</script>');
                 return;
            }
            if (!(await bcryptjs.compare(contraseña, results[0].contraseña))) {
                res.send('<script>alert("Contraseña incorrecta, Intentelo de nuevo"); window.location.href = "/login.ejs";</script>');
                return;
            }
            else {
                req.session.loggedin = true;
                res.send('<script>alert("Ha iniciado sesion"); window.location.href = "/registro-evento.ejs";</script>');
            }
        });
    }
});


//para cerrar sesion
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) {
            return res.redirect('/dashboard');
        }
        res.redirect('/login.ejs');
    })
});

