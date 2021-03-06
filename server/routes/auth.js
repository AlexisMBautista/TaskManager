// Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controller/authController');

//crea un usuarios
// endpoint: api/auth

router.post('',
    [
        check('email', 'Agrega un email valido').isEmail(),
        check('password', 'El password debe ser minimo de 6 caracteres').isLength({min: 6}),
    ],
    authController.authUser
);


module.exports = router