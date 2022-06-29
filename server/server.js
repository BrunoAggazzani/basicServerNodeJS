require("dotenv").config();
const express = require("express");
const path = require('path');
const morgan = require('morgan');
const cors = require("cors");
const appConfig = require('./config.js');
const router = require('./routes.js');

const app = express();

// Configuración
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

// middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: '*'}));

//rutas
app.use('/', router);

// static files
app.use(express.static(path.join(__dirname, 'public')));

// Puerto de escucha servidor
app.listen(appConfig.port, () => {
    console.log("server is running in port " + appConfig.port);
})
