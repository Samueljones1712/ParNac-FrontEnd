const express = require('express');
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const port = (process.env.port || 4000);//hacer el puerto constante
// Settings

app.set('port', port);
// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());


// Routes
app.get("/", (req, res) => {
    res.json({ message: "Inicio del BackEnd" });
});

app.use(require('./src/routes/Router'));


app.listen(app.get('port'), (error) => {

    if (error) {

        console.log('Error al iniciar servidor');

    } else {
        console.log('Servidor iniciado en http://localhost:' + port);
    }
});