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

const pool = new sql.ConnectionPool(config)


async function login(correo, contrasena) {

    try {

        await pool.connect(); // Abrir conexión
        const result = await pool.request().input('Correo', sql.NVarChar(50), correo)
            .input('Contrasena', sql.NVarChar(50), contrasena).output('IsMatch', sql.VarChar).execute('spVerifyPassword');
        const isMatchValue = result.output.IsMatch;
        console.log(isMatchValue);

        await pool.close(); // Cerrar conexión

        return isMatchValue;

    } catch (err) {
        console.log("Error del server: " + err);

        return err;

    }
}


exports.login = loginfunction;

