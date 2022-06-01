const { Pool } = require('pg')

const config = {
    user: "postgres",
    host: "localhost",
    password: "120313",
    database: "bancosolar_db",
    port: 5430,
}

const pool = new Pool(config)

const conexion = () => {
    
    return new Promise((resolve, reject) => {
        pool.connect((errorConexion, client, release) => {
            if(errorConexion) {
                reject('Error, favor revisar siguiente código' + errorConexion.code)
            } else {
                const cnx = {
                    client, release, pool
                }
                resolve(cnx)
            }
        })
    })
}

module.exports = conexion