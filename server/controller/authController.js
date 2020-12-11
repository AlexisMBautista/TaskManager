const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');


exports.authUser = async (req, res) => {
    //revisar si hay errores
    const error = validationResult(req);

    if(!error.isEmpty()){
        return res.status(400).json({ error : error.array() });
    }

    //extraer email y password desde la request del usuario
    const {email, password} = req.body;


    try {
        //revisar que exita un usuario por su email
        let user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({ msg: 'El usuario no existe' });
        }

        //revisar su password
        const correctPassword = await bcryptjs.compare(password, user.password);

        if(!correctPassword) {
            return res.status(400).json({ msg: 'password incorrecto'})
        }

        //crear el JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        //firmar el JWT
        jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 3600
        }, (error, token) => {
            if(error) throw error;

            //mensaje de confirmacion
            res.json({ token });
        });


    } catch (error) {
        console.log(error);
    }


}