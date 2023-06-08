const jwt = require('jsonwebtoken');
const db = require('../config/database.js');
const { Respuestas } = require('../respuestas.js');
const mailer = require('../nodemailer.js');
const { setTimeout } = require('timers/promises');

this.respuesta = new Respuestas();

const pool = new db.sql.ConnectionPool(db.config);




exports.registerUser = async (req, res) => {

    const { identificacion, nombre, apellido, contrasena, correo } = req.body;



    try {
        await pool.connect(); // Abrir conexión
        const result = await pool.query("EXEC spRegistro '" + nombre + "','" + apellido + "','" + contrasena + "','" + correo + "', '" + identificacion + "';");

        console.log("EXEC spRegistro '" + nombre + "','" + apellido + "','" + contrasena + "','" + correo + "', '" + identificacion + "';");

        console.log(result.rowsAffected); // número de filas afectadas

        this.respuesta.response.result = result.rowsAffected;

        console.log(this.respuesta);

        await pool.close(); // Cerrar conexión

        await res.json(this.respuesta);

    } catch (err) {
        console.log(err);
        res.json(this.respuesta.error_500(err));
    }
}

exports.generateToken = (req, res) => {

    const { correo } = req.body;

    const token = jwt.sign({
        correo: correo
    }, process.env.SECRET_KEY || 'pepito123',
        { expiresIn: '9990000' })
    console.log(token)
    res.json({ token });
}



exports.login = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {

        const resultado = await db.loginDB(correo, contrasena);

        if (resultado == "Correcto") {

            const numeroAleatorio = Math.floor(Math.random() * 90000) + 10000;
            this.respuesta.verifyCode(numeroAleatorio, correo);
            const msg = `Tu código de autenticación es: ${numeroAleatorio}`;
            mailer.sendAuthenticationCode(correo, msg, res, this.respuesta)

        } else {
            this.respuesta.error_500("El Correo o la Contrasena es incorrecto.");
            res.json(this.respuesta);
        }

    } catch (err) {
        this.respuesta.error_500(err);
        res.json(this.respuesta);
    }
}

exports.index = async (req, res) => {
    try {
        await pool.connect(); // Abrir conexión
        const result = await pool.query('SELECT * FROM usuarios');
        console.log(result.recordset);
        await res.json(result.recordset)
        await pool.close(); // Cerrar conexión
    } catch (err) {
        console.error('Error al consultar usuarios', err);
        res.send(err)
    }
}

exports.administradores = async (req, res) => {
    try {
        await pool.connect(); // Abrir conexión
        const result = await pool.query('SELECT * FROM Administradores');
        console.log(result.recordset);
        await res.json(result.recordset)
        await pool.close(); // Cerrar conexión
    } catch (err) {
        console.error('Error al consultar los administradores', err);
        res.send(err)
    }
}

exports.padron = async (req, res) => {

    const { Id } = req.params;

    try {
        await pool.connect(); // Abrir conexión

        const result = await pool.query("SELECT * FROM Padron where cedula='" + Id + "';");
        console.log(result.recordset);

        await res.json(result.recordset)
        await pool.close(); // Cerrar conexión
    } catch (err) {
        console.error('Error al consultar el Padron', err);
        res.send(err)
    }
}


exports.view_administradores = async (req, res) => {


    try {
        await pool.connect(); // Abrir conexión

        const result = await pool.query("SELECT * FROM view_administradores;");
        console.log(result.recordset);

        await res.json(result.recordset)
        await pool.close(); // Cerrar conexión
    } catch (err) {
        console.error('Error al consultar los administradores', err);
        res.send(err)
    }
}



exports.edit = async (req, res) => {
    console.log(req.body);
    this.respuesta.response.result = req.body;
    res.json(this.respuesta);
}

exports.changePassword = async (req, res) => {

    const { id, contrasena } = req.body;

    try {
        await pool.connect(); // Abrir conexión
        console.log("EXEC sp_changePass " + id + ", '" + contrasena + "';");
        const result = await pool.query("EXEC sp_changePass " + id + ", '" + contrasena + "';");

        this.respuesta.response.result = result.rowsAffected;
        console.log(this.respuesta);
        await pool.close(); // Cerrar conexión
        await res.json(this.respuesta);

    } catch (err) {
        console.error('Error al cambiar la contrasena usuarios', err);
        res.send(err)
    }
}


exports.add = async (req, res) => {
    console.log(req.body);
    this.respuesta.response.result = req.body;
    res.json(this.respuesta);
}


exports.deleteUser = async (req, res) => {

    const { id, tipo } = req.body;

    console.log("EXEC sp_deleteUsuario " + id + ", '" + tipo + "';");

    try {
        await pool.connect(); // Abrir conexión

        const result = await pool.query("EXEC sp_deleteUsuario " + id + ", '" + tipo + "';");

        this.respuesta.response.result = result.rowsAffected;
        console.log(this.respuesta);

        await pool.close(); // Cerrar conexión
        await res.json(this.respuesta);

    } catch (err) {
        console.error('Error al eliminar el usuario', err);
        res.send(err)
    }

}

exports.editUser = async (req, res) => {

    const { id, nombre, apellido } = req.body;

    try {
        await pool.connect(); // Abrir conexión

        console.log("EXEC sp_editUser " + id + ", '" + nombre + "','" + apellido + "';");

        const result = await pool.query("EXEC sp_editUser " + id + ", '" + nombre + "','" + apellido + "';");

        this.respuesta.response.result = result.rowsAffected;
        console.log(this.respuesta);
        await pool.close(); // Cerrar conexión
        await res.json(this.respuesta);

    } catch (err) {
        console.error('Error al eliminar el usuario', err);
        res.send(err)
    }
}