const express = require('express');
const connectMongo = require('./config/db');

//crear el servidor
const app = express();

//conectar a la base de datos
connectMongo();

//habilitar express.json
app.use(express.json({extend: true}));

//puerto de la app
const PORT = process.env.PORT || 4000;

//importar rutas
app.use('/api/usuarios', require('./routes/user'));
app.use('/api/auth', require('./routes/auth'));



app.listen(PORT, ()=> {
    console.log(`El puerto esta funcionando ${PORT}`);
});
