const sql = require('mssql')

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

async function consultarPersonas() {
    const correo = "user1@email.com";
    const contrasena = "user1";
    try {

        await pool.connect(); // Abrir conexión
        console.log("Holas");
        const result = await pool.request().input('Correo', sql.NVarChar(50), correo)
            .input('Contrasena', sql.NVarChar(50), contrasena).output('IsMatch', sql.VarChar).execute('spVerifyPassword');
        const isMatchValue = result.output.IsMatch;
        console.log(isMatchValue);

        await pool.close(); // Cerrar conexión

    } catch (err) {
        console.log("Error del server: " + err);
    }
}

consultarPersonas();

// pool.connect(err => {
//     if (err) {
//         console.error('Error de conexión:', err)
//     } else {
//         console.log('Conectado a la base de datos')

//         const request = pool.request()

//         if (pool.connected) {
//             request.query('SELECT * FROM Prueba2', (err, result) => {
//                 if (err) {
//                     console.error('Error en la consulta:', err)
//                 } else {
//                     console.log(result.recordset)
//                 }
//             })
//         } else {
//             console.error('La conexión no está abierta')
//         }
//     }
// })





