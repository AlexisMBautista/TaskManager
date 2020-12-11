const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {

    //revisar si hay errores
    const error = validationResult(req);

    if(!error.isEmpty()){
        return res.status(400).json({ error : error.array() });
    }


    //extraer el email y el password de request 
    const {email, password} = req.body;

    try {
        //Revisa que el usuario sea unico
        let user = await User.findOne({email});

        if(user){
            return res.status(400).send({msg: 'El usuario ya existe'});
        }

        //crea el nuevo usuario
        user = new User(req.body);

        //Heshear el password

        const salt = await bcryptjs.genSalt(10);

        user.password = await bcryptjs.hash(password, salt);

        await user.save();

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
        return res.status(400).send({msg: 'Hubo un error al crear el usuario'});
    }
}