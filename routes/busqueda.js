let express = require("express");
let app = express();

const Hospital = require("../models/hospital");
const Medico = require("../models/medico");
const Usuario = require("../models/usuario");


//
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    let busqueda = req.params.busqueda;
    let tabla = req.params.tabla;
    const regex = new RegExp(busqueda, "i");

    let promesa;
    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
        break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
        break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
        break;
    
        default:
            res.status(400).json({
                ok: false,
                mensaje: 'tipo de busqueda: usuario, medicos, hospitales',
                error: {mensaje: 'Tipo tabla/busqueda invalido'}
              });
        
    }

    promesa.then ( data => {
        res.status(200).json({
            ok: true,
            [tabla]:data
          });
    })
})
// BUSQUEDA GENERAL
app.get("/todo/:busqueda", (req, res, next) => {
  let busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, "i");

  Promise.all( [
      buscarHospitales(busqueda, regex), 
      buscarMedicos(busqueda, regex),
      buscarUsuarios(busqueda, regex),
    ]).then(
        respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2],
              });
        }
    )


});

function buscarHospitales(busqueda, regex) {
  return new Promise((resol, rejec) => {
    Hospital.find({ nombre: regex })
    .populate('usuario', 'nombre email')
    .exec( (err, hospitales) => {
      if (err) {
        rejec("Error al cargar hospitales", err);
      } else {
        resol(hospitales);
      }
    });
  });
}

function buscarMedicos(busqueda, regex) {
  return new Promise((resol, rejec) => {
    Medico.find({ nombre: regex })
    .populate('usuario', 'nombre email')
    .populate('hospital')
    .exec( (err, medicos) => {
      if (err) {
        rejec("Error al cargar medicos", err);
      } else {
        resol(medicos);
      }
    });
  });
}

function buscarUsuarios(busqueda, regex) {
  return new Promise((resol, rejec) => {
    Usuario.find({}, 'nombre email role')
    .or([ {'nombre': regex}, {'email': regex}])
    .exec( (err, usuarios) => {
      if (err) {
        rejec("Error al cargar usuarios", err);
      } else {
        resol(usuarios);
      }
    });
  });
}
module.exports = app;
