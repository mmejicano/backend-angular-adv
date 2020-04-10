let express = require("express");
let Usuario = require("../models/usuario");
let bcrypt = require("bcryptjs");

let mdAuth = require('../midleware/auth');

let app = express();

// READ USUARIOS
// ========================================
app.get("/", (req, res, next) => {
  Usuario.find({}, "nombre email role img").exec((err, usuarios) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error cargando usuarios",
        errors: err,
      });
    }

    res.status(200).json({
      ok: true,
      usuarios: usuarios,
    });
  });
});


// CREAR USUARIO
// ========================================
app.post("/", mdAuth.verificaToken , (req, res) => {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role,
  });

  usuario.save((err, userSaved) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error guardar usuarios",
        errors: err,
      });
    }

    res.status(201).json({
      ok: true,
      usuario: userSaved,
    });
  });
});

// UPDATE USUARIOS
// ========================================
app.put("/:id", mdAuth.verificaToken , (req, res) => {
  let id = req.params.id;
  let body = req.body;

  Usuario.findById(id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error buscar usuarios",
        errors: err,
      });
    }

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error id usuarios no existe",
        errors: { message: "no existe usuario" },
      });
    }

    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = body.role;

    usuario.save((err, userSaved) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error actualizar usuarios",
          errors: err,
        });
      }
      userSaved.password = ':)';

      res.status(200).json({
        ok: true,
        usuario: userSaved,
      });
    });

  });
});

// DELETE USUARIOS
// ========================================
app.delete('/:id', mdAuth.verificaToken , (req, res) => {

    let id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error borrar usuarios",
              errors: err,
            });
          }

          if (!usuarioBorrado) {
            return res.status(500).json({
              ok: false,
              mensaje: "No existe usuario con ese id",
              errors: {message: 'No existe usuario'},
            });
          }
    
          res.status(200).json({
            ok: true,
            usuario: usuarioBorrado,
          });
    })
})

module.exports = app;
