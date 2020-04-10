
let express = require("express");
let bcrypt = require("bcryptjs");
let jwt = require('jsonwebtoken');

let SEED = require('../config/config').SEED;

let app = express();
let Usuario = require("../models/usuario");


app.post('/', (req, res) => {

    let body = req.body;

    Usuario.findOne({email: body.email}, (err, userDB) => {

        if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error al buscar usuarios",
              errors: err,
            });
          }

          if(!userDB){
            return res.status(500).json({
                ok: false,
                mensaje: "Credenciales incorrectas -email",
                errors: err,
              });
          }

          if( !bcrypt.compareSync(body.password, userDB.password)){
            return res.status(500).json({
                ok: false,
                mensaje: "Credenciales incorrectas -pass",
                errors: err,
              });
          }
          
            // CREAR TOKEN
            userDB.password = ':)'
            let token = jwt.sign({ usuario: userDB}, SEED, { expiresIn: 14400})
          
          res.status(200).json({
            ok: true,
            usuarios: userDB,
            id: userDB._id,
            token
          });
    })

   
})

module.exports = app;