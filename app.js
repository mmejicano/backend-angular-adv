// requires
var express = require('express');
var mongoose = require('mongoose');

// Conexion DB
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if(err) throw err;

    console.log('MongoDB:27017  \x1b[32m%s\x1b[0m','online');
})

// inicializar variables
var app = express();

app.get('/', (req, res, next) => {

    res.status(403).json({
        ok: true,
        mensaje: 'Realizado correctamente'
    })
})

app.listen(3000, () => {
    console.log('Servidor localhost:3000 \x1b[32m%s\x1b[0m','online');
})
