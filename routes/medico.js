let express = require("express");

let mdAuth = require('../midleware/auth');

let app = express();

let Medico = require("../models/medico");

// READ 
// ========================================
app.get("/", mdAuth.verificaToken, (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('hospital')
    .exec((err, medicos) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error cargando medicos",
        errors: err,
      });
    }

    Medico.countDocuments({}, (err, conteo) => {
        res.status(200).json({
            ok: true,
            total: conteo,
            medicos: medicos,
          });
    })
    
  });
});


// CREAR 
// ========================================
app.post("/", mdAuth.verificaToken , (req, res) => {
  let body = req.body;

  let medico = new Medico({
    nombre: body.nombre,
    usuario: req.usuario._id,
    hospital: body.hospital,
  });

  medico.save((err, medicoGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error guardar medico",
        errors: err,
      });
    }

    res.status(201).json({
      ok: true,
      medico: medicoGuardado,
    });
  });
});

// UPDATE medicoS
// ========================================
app.put("/:id", mdAuth.verificaToken , (req, res) => {
  let id = req.params.id;
  let body = req.body;

  Medico.findById(id, (err, medico) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error buscar medicos",
        errors: err,
      });
    }

    if (!medico) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error id medicos no existe",
        errors: { message: "no existe medico" },
      });
    }

    medico.nombre = body.nombre;
    medico.hospital = body.hospital;
    medico.usuario = req.usuario._id;

    medico.save((err, medicoGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error actualizar medicos",
          errors: err,
        });
      }

      res.status(200).json({
        ok: true,
        medico: medicoGuardado,
      });
    });

  });
});

// DELETE medicoS
// ========================================
app.delete('/:id', mdAuth.verificaToken , (req, res) => {

    let id = req.params.id;
    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error borrar medicos",
              errors: err,
            });
          }

          if (!medicoBorrado) {
            return res.status(500).json({
              ok: false,
              mensaje: "No existe medico con ese id",
              errors: {message: 'No existe medico'},
            });
          }
    
          res.status(200).json({
            ok: true,
            medico: medicoBorrado,
          });
    })
})

module.exports = app;