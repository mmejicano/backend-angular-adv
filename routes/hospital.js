let express = require("express");

let mdAuth = require("../midleware/auth");

let app = express();

let Hospital = require("../models/hospital");

// READ
// ========================================
app.get("/", (req, res, next) => {

  let desde = req.query.desde || 0;
  desde = Number(desde);

  Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate("usuario", "nombre email")
    .exec((err, hospitales) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: "Error cargando hospitales",
          errors: err,
        });
      }

      Hospital.count({}, (err, conteo) => {
        res.status(200).json({
          ok: true,
          total: conteo,
          hospitales: hospitales,
        });
      });
    });
});

// CREAR
// ========================================
app.post("/", mdAuth.verificaToken, (req, res) => {
  let body = req.body;

  let hospital = new Hospital({
    nombre: body.nombre,
    usuario: req.usuario._id,
  });

  hospital.save((err, hospitalGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error guardar hospitales",
        errors: err,
      });
    }

    res.status(201).json({
      ok: true,
      hospital: hospitalGuardado,
    });
  });
});

// UPDATE
// ========================================
app.put("/:id", mdAuth.verificaToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error buscar hospitales",
        errors: err,
      });
    }

    if (!hospital) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error id hospitales no existe",
        errors: { message: "no existe hospital" },
      });
    }

    hospital.nombre = body.nombre;
    hospital.usuario = req.usuario.id;

    hospital.save((err, hospitalGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error actualizar hospital",
          errors: err,
        });
      }

      res.status(200).json({
        ok: true,
        hospital: hospitalGuardado,
      });
    });
  });
});

// DELETE
// ========================================
app.delete("/:id", mdAuth.verificaToken, (req, res) => {
  let id = req.params.id;
  Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error borrar hospital",
        errors: err,
      });
    }

    if (!hospitalBorrado) {
      return res.status(500).json({
        ok: false,
        mensaje: "No existe hospital con ese id",
        errors: { message: "No existe hospital" },
      });
    }

    res.status(200).json({
      ok: true,
      hospital: hospitalBorrado,
    });
  });
});

module.exports = app;
