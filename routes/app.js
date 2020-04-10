let express = require('express');
let app = express();

app.get('/', (req, res, next) => {

    res.status(403).json({
        ok: true,
        mensaje: 'Realizado correctamente'
    })
})

module.exports = app;