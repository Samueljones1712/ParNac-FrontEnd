const sql = require('mssql')
/* //Local
const config = {
    user: 'informatica123',
    password: 'informatica123',
    server: 'PC-LAPTOP',
    database: 'ParNac',
    options: {
        trustedconection: false,
        enableArithAbort: true,
        encrypt: false,
    }
}
*/

const config = {
    user: 'user1',
    password: 'Parnac2023',
    server: 'parnac-server.database.windows.net',
    database: 'ParNac',
    options: {
        trustedconection: false,
        enableArithAbort: true,
        encrypt: true,
    }
}

async function loginDB(correo, contrasena) {

    const pool = new sql.ConnectionPool(config);

    try {

        await pool.connect(); // Abrir conexión
        const result = await pool.request().input('Correo', sql.NVarChar(50), correo)
            .input('Contrasena', sql.NVarChar(50), contrasena).output('IsMatch', sql.VarChar).execute('spVerifyPassword');
        const isMatchValue = result.output.IsMatch;

        return isMatchValue;

        await pool.close(); // Cerrar conexión


    } catch (err) {
        console.log("Error del server: " + err);

        return err;

    }
}

exports.loginDB = loginDB;
exports.config = config;
exports.sql = sql