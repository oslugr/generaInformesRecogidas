#!/usr/bin/env nodejs

// Dependencias
var express = require('express');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var debug = require('debug')('generaInformesRecogidas:server');
var favicon = require('serve-favicon');
var http = require('http');
var logger = require('morgan');
var path = require('path');
global.appRoot = path.resolve(__dirname);

// Rutas
var index = require(__dirname + '/routes/index');

// Crea aplicación web con Express
var app = express();

// Variables de entorno (puerto de escucha y dirección IP)
app.set('port', process.env.PORT || 3000);
app.set('ip', process.env.IP || '127.0.0.1');
// Directorio con las plantillas
app.set('views', path.join(__dirname, 'views'));
// Motor de visualización
app.set('view engine', 'jade');

// Favicon
// app.use(favicon(__dirname + '/public/images/favicon.ico'));
// Logger de solicitudes HTTP
app.use(logger('dev'));
// Parseadores
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
//Manejador de enrutado
app.use(express.static(path.join(__dirname, 'public')));

// Funcionalidades
app.get('/', index.index);

// Captura errores 404 y los reenvia al manejador de errores
app.use(function(req, res, next) {
  var err = new Error('Error 404: Página no encontrada.');
  err.status = 404;
  next(err);
});

// Manejador de errores:
app.use(function(err, req, res, next) {
  res.status(err.status).render('error', {
    message: err.message,
    error: err
  });
});

// Creación del servidor
var server = http.createServer(app);
server.listen(app.get('port'));
server.on('listening', onListening);

// Escuchador de eventos de peticiones al servidor HTTP
function onListening() {
  debug('Servidor Express escuchando localmente en el puerto ' + server.address().port);
}

module.exports = app;
