const EventEmitter = require('events');


const multer = require('multer');
const path = require('path');
const emitter = new EventEmitter()
// or 0 to turn off the limit
emitter.setMaxListeners(0)

const { Router } = require('express');
const express = require('express');
const router = express.Router();



const controllerUser = require('../controller/UserController');
const controllerParque = require('../controller/ParqueNacionalController');
const controllerEntradas = require('../controller/EntradasController');
const validateToken = require('./validate-token');

const controllerIMG = require('../controller/controllerIMG');

/* Session */
router.post('/login', controllerUser.login);
router.post('/token', controllerUser.generateToken);
router.post('/register', controllerUser.registerUser);


/* Parque Nacional */
router.get('/ParqueNacional', validateToken, controllerParque.getParqueNacional);
router.post('/ParqueNacional/add', validateToken, controllerParque.addParqueNacional);
router.put('/ParqueNacional/add', validateToken, controllerParque.updateParqueNacional);
router.delete('/ParqueNacional/delete/:Id', validateToken, controllerParque.deleteParqueNacional);

/* Tarifa */
router.get('/Entradas/', validateToken, controllerEntradas.getEntradas);
router.post('/Entradas/add', validateToken, controllerEntradas.addEntradas);
router.put('/Entradas/actualizar', validateToken, controllerEntradas.updateEntradas);
router.delete('/Entradas/delete/:Id', validateToken, controllerEntradas.deleteEntradas);

/* Usuario */
router.get('/user', validateToken, controllerUser.index);
router.post('/user/add', validateToken, controllerUser.add);
router.post('/user/delete', validateToken, controllerUser.deleteUser);
router.put('/user/changePassword/', validateToken, controllerUser.changePassword);
router.put('/user/editar', validateToken, controllerUser.editUser)


router.get('/user/administradores', validateToken, controllerUser.administradores);
router.get('/user/view_administradores', validateToken, controllerUser.view_administradores);
router.get('/user/padron/:Id', controllerUser.padron);

router.post('/api/upload', controllerIMG.uploadImg);


module.exports = router;
