//
// ─── CONFIGURACAO INICIAL DO SERVIDOR ───────────────────────────────────────────
//
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
let middleware = require('./middleware.js');
let expressValidator  = require('express-validator');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
//
// ─── CORS - HABILITAR A APLICACAO PARA SER USADA EXTERNAMENTE ───────────────────
//
app.use(cors());
//
// ─── EXPRESSVALIDATOR - USADO PARA VALIDAR OS CAMPOS DE ENTRADA DAS REQUISICOES ─
//
app.use(expressValidator());
 //
 // ─── HELMET - SEGURANCA CONTRA ATAQUES EXTERNOS ─────────────────────────────────
 //
app.use(helmet());

// Usar o IO para criar eventos 
app.use((req, res, next) => {
    req.io = io;
    return next();
});

module.exports = {
    app: app,
    middleware: middleware
}

//
// ─── LISTANDO A PORTA E INICIANDO UM SERVIDOR ───────────────────────────────────
//
http.listen(process.env.PORT || 4000, () => console.log('Server Rodando'))