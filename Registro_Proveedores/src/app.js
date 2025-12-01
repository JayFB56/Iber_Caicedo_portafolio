
// Importación de módulos principales
const express = require('express'), // Framework principal para servidor web
      path = require('path'), // Utilidad para rutas de archivos
      morgan = require('morgan'), // Middleware para logs HTTP
      mysql = require('mysql2'), // Cliente MySQL moderno
      myConnection = require('express-myconnection'); // Middleware para conexión a BD

const app = express(); // Inicializa la aplicación Express

// Importa las rutas del sistema de proveedores
const customerRoutes = require('./routes/customer');

// Configuraciones de la aplicación
app.set('port', process.env.PORT || 3001); // Puerto de escucha
app.set('views', path.join(__dirname, 'views')); // Carpeta de vistas
app.set('view engine', 'ejs'); // Motor de plantillas EJS

// Middleware para logs de peticiones HTTP
app.use(morgan('dev'));

// Configuración de la base de datos MySQL
const dbConfig = {
  host: '127.0.0.1', // Host de la base de datos
  user: 'root',      // Usuario de la base de datos
  password: 'root',  // Contraseña de la base de datos
  port: 3306,        // Puerto de MySQL
  database: 'db_ControlProveedoresbeta' // Nombre de la base de datos
};

// Inicializa la base de datos (crea si no existe) y luego agrega el middleware de conexión
const initDB = require('./init-db');

initDB(dbConfig)
  .then(() => {
    // Conexión única a la base de datos para todas las peticiones
    app.use(myConnection(mysql, dbConfig, 'single'));
    // Permite recibir datos de formularios (POST)
    app.use(express.urlencoded({extended: false}));

    // Rutas principales del sistema
    app.use('/', customerRoutes);

    // Archivos estáticos (CSS, imágenes, JS)
    app.use(express.static(path.join(__dirname, 'public')));

    // Inicia el servidor en el puerto configurado
    app.listen(app.get('port'), () => {
      console.log(`Servidor iniciado en el puerto ${app.get('port')}`);
    });
  })
  .catch(err => {
    // Si falla la inicialización de la BD, muestra error y termina el proceso
    console.error('Error al inicializar la base de datos. Saliendo...');
    process.exit(1);
  });

// NOTA: El servidor inicia después de la inicialización de la base de datos
