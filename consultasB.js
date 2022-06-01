const conexion = require('./conexion')

const consultasB = async () => {
    const cnx = await conexion()
    // METODO insertar nuevo usuario
    const insertarUsuario = async (nombre, balance) => {
        const SQLQuery = {
            text: 'INSERT INTO usuarios(nombre, balance) VALUES ($1, $2) RETURNING *',
            values: [nombre, balance]
        }
        try {
            const datos = await cnx.client.query(SQLQuery)
            //cnx.release()
            //cnx.pool.end()
            return datos

        } catch (err) {
            throw new Error(err)
        }

    }
    // METODO obtener todos los usuarios 
    const obtenerUsuarios = async () => {
        const SQLQuery = {
            text: 'SELECT * FROM usuarios',
        }
        try {
            const datos = await cnx.client.query(SQLQuery)
            //cnx.release()
           // cnx.pool.end()
            return datos.rows
        } catch (err) {
            throw new Error(err)
        }

    }

    const modificarUsuario = async (nombre, balance, id) => {
        const SQLQuery = {
            text: 'UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3',
            values: [nombre, balance, id]
        }
        try {
            console.log(SQLQuery)
            const datos = await cnx.client.query(SQLQuery)
            //cnx.release()
            //cnx.pool.end()
            return datos
        } catch (err) {
            throw new Error(err)
        }

    }

    return { insertarUsuario, obtenerUsuarios, modificarUsuario }
}

module.exports = consultasB