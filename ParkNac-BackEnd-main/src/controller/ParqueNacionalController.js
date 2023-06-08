const db = require('../config/database.js');
const { Respuestas } = require('../respuestas.js');

this.respuesta = new Respuestas();

const pool = new db.sql.ConnectionPool(db.config);

exports.getParqueNacional = async (req, res) => {

    try {
        await pool.connect(); // Abrir conexión
        const result = await pool.query("SELECT * FROM Parques;");
        await pool.close(); // Cerrar conexión

        res.json(result.recordset)

        console.log(result.recordset);

    } catch (err) {
        this.respuesta.error_500();

        res.json(this.respuesta);
    }
}


exports.addParqueNacional = async (req, res) => {
    const { Nombre, Provincia, Tarifa_Extranjeros_dolares,
        Tarifa_Nacionales_colones, Area_de_Conservacion, maxVisitantes, horario } = req.body

    console.log("EXEC sp_insertPark '" + Nombre + "','" + Area_de_Conservacion + "','" + Provincia + "'," + Tarifa_Nacionales_colones + "," + Tarifa_Extranjeros_dolares + "," + maxVisitantes + "," + horario + ";");

    try {
        await pool.connect(); // Abrir conexión

        const result = await pool.query("EXEC sp_insertPark '" + Nombre + "','" + Area_de_Conservacion + "','" + Provincia + "'," + Tarifa_Nacionales_colones + "," + Tarifa_Extranjeros_dolares + "," + maxVisitantes + "," + horario + ";");

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


exports.updateParqueNacional = async (req, res) => {

    const { Id, Nombre, Provincia, Tarifa_Extranjeros_dolares,
        Tarifa_Nacionales_colones, Area_de_Conservacion, maxVisitantes, horario } = req.body


    console.log(req.body);

    try {
        await pool.connect(); // Abrir conexión
        const result = await pool.query("EXEC sp_editPark " + Id + " ,'" + Nombre + "','" + Area_de_Conservacion + "','" + Provincia + "'," + Tarifa_Nacionales_colones + "," +
            Tarifa_Extranjeros_dolares + "," + maxVisitantes + "," + horario + ";");

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

exports.deleteParqueNacional = async (req, res) => {

    console.log(req.params);

    this.respuesta.response.result = req.params;

    try {
        await pool.connect(); // Abrir conexión

        const result = await pool.query("EXEC sp_deletePark '" + req.params.Id + "';");

        this.respuesta.response.result = result;

        await res.json(this.respuesta);

        await pool.close(); // Cerrar conexión

    } catch (error) {

        res.json(this.respuesta.error_500(err));

    }

}