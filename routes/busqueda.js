var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');


// ======================
// Busqueda por Coleccion
// ======================

app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');
    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;

        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son: usuarios, medicos y hospitales',
                error: { message: 'Tipo de tabla/coleccion no valido' }
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
});





// ======================
// Busqueda General
// ======================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    // /norte/i la 'i' es para que pueda buscar minusculas y mayusculas
    var regex = new RegExp(busqueda, 'i');

    // Arreglos de promesas
    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        });
});

function buscarHospitales(busqueda, regex) {
    // crear una promesa
    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            // del campo usuario vamos a obtener sus datos con el metodo populate
            .populate('usuario', 'nombre email')
            // ejecutar el query
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    });

}

function buscarMedicos(busqueda, regex) {
    // crear una promesa
    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(medicos);
                }
            });
    });

}

function buscarUsuarios(busqueda, regex) {
    // crear una promesa
    return new Promise((resolve, reject) => {
        // buscar en 2 campos por emplo nombre, email
        // definir que campos quiero que encuentre
        Usuario.find({}, 'nombre email role')
            // aqui recibe arreglo de condiciones
            .or([{ 'nombre': regex }, { 'email': regex }])
            // ejecutar el query
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;