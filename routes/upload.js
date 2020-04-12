let express = require("express");
let fileUpload = require("express-fileupload");
let fs = require("fs");

let app = express();

let Usuario = require("../models/usuario");
let Medico = require("../models/medico");
let Hospital = require("../models/hospital");

// default options
app.use(fileUpload());

app.put("/:tipo/:id", (req, res, next) => {
  let tipo = req.params.tipo;
  let id = req.params.id;

  // tipos validos
  let tiposValidos = ["hospitales", "medicos", "usuarios"];

  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "Tipos no validos",
      errors: { mensaje: "Seleccione una categoria valida" },
    });
  }

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mensaje: "No ha seleccionado archivos",
      errors: { mensaje: "Seleccione un archivo" },
    });
  }

  // obtener nombre archivo
  let archivo = req.files.imagen;
  let nombreParcial = archivo.name.split(".");

  let extension = nombreParcial[nombreParcial.length - 1];

  // Condicionar extensiones
  let extensionesValidas = ["png", "jpg", "gif", "jpeg"];
  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: "Extension no valida",
      errors: {
        mensaje: "Extensiones validas " + extensionesValidas.join(", "),
      },
    });
  }

  // nombre personalizado
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

  //mover el archivo del temporal a un path
  let path = `./uploads/${tipo}/${nombreArchivo}`;

  archivo.mv(path, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al mover archivo",
        errors: err,
      });
    }
    subirPorTipo(tipo, id, nombreArchivo, res);
  });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
  if (tipo === "usuarios") {
    Usuario.findById(id, (err, usuario) => {

        if(!usuario){
            return res.status(400).json({
                ok: true,
                mensaje: "Usuario no existe",
                errors: {message: 'usuario no existe'}
              });
        }
      let oldPath = "./upload/usuarios/" + usuario.img;

      // si existe elimina archivo
      if (fs.existsSync(oldPath)) {
        fs.unlink(oldPath);
      }
      usuario.img = nombreArchivo;

      usuario.save((err, userUpdate) => {

        userUpdate.password = ':)';

        return res.status(200).json({
          ok: true,
          mensaje: "Imagen actualizada",
          userUpdate,
        });
      });
    });
  }
  if (tipo === "medicos") {
    Medico.findById(id, (err, medico) => {

        if(!medico){
            return res.status(400).json({
                ok: true,
                mensaje: "medico no existe",
                errors: {message: 'medico no existe'}
              });
        }

        let oldPath = "./upload/medicos/" + medico.img;
  
        // si existe elimina archivo
        if (fs.existsSync(oldPath)) {
          fs.unlink(oldPath);
        }
        medico.img = nombreArchivo;
  
        medico.save((err, medicoUpdate) => {
          return res.status(200).json({
            ok: true,
            mensaje: "Imagen actualizada",
            medicoUpdate,
          });
        });
      });
  }
  if (tipo === "hospitales") {
    Hospital.findById(id, (err, hospital) => {

        if(!hospital){
            return res.status(400).json({
                ok: true,
                mensaje: "hospital no existe",
                errors: {message: 'hospital no existe'}
              });
        }

        let oldPath = "./upload/hospitales/" + hospital.img;
  
        // si existe elimina archivo
        if (fs.existsSync(oldPath)) {
          fs.unlink(oldPath);
        }
        hospital.img = nombreArchivo;
  
        hospital.save((err, hospitalUpdate) => {
          return res.status(200).json({
            ok: true,
            mensaje: "Imagen actualizada",
            hospitalUpdate,
          });
        });
      });
  }
}

module.exports = app;
