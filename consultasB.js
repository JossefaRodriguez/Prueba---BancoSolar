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
            return datos
        } catch (err) {
            console.error(err)
        }
        cnx.release()
        cnx.pool.end()

    }
    // METODO obtener todos los usuarios 
    const obtenerUsuarios = async () => {
        const SQLQuery = {
            text: 'SELECT * FROM usuarios',
        }
        try {
            const datos = await cnx.client.query(SQLQuery)
            return datos.rows
        } catch (err) {
            console.error(err)
        }
        cnx.release()
        cnx.pool.end()

    }
    // METODO Modificar usuarios
    const modificarUsuario = async (nombre, balance, id) => {
        const SQLQuery = {
            text: 'UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3',
            values: [nombre, balance, id]
        }
        try {
            const datos = await cnx.client.query(SQLQuery)
            return datos
        } catch (err) {
            console.error(err)
        }
        cnx.release()
        cnx.pool.end()

    }
    // METODO eliminar usuarios
    const eliminarUsuario = async (id) => {
        const SQLQuery = {
            text: 'DELETE FROM usuarios WHERE id = $1',
            values: [id]
        }
        try {
            const datos = await cnx.client.query(SQLQuery)
            return datos
        }
        catch (err) {
            console.error(err)
        }
        cnx.release()
        cnx.pool.end()
    }

    // TRANSFERENCIAS 

    const insertTransferencias = async (emisor, receptor, monto, fecha) => {
        try {
            const SQLQuery = {
                text: 'INSERT INTO transferencias(emisor, receptor, monto, fecha) VALUES ($1, $2, $3, $4) RETURNING *',
                values: [emisor, receptor, monto, fecha]
            }
            await cnx.client.query('BEGIN')
           const resp = await cnx.client.query(SQLQuery)
            await cnx.client.query('COMMIT')
            return(resp.rows)
        }
        catch (err) {
            await cnx.client.query('ROLLBACK')
            console.error(err)
        }
        cnx.release()
        cnx.pool.end()
    }

    const obtenerTransferencias = async () => {
        const SQLQuery = {
            text: 'SELECT t.id, t.monto, u.nombre AS emisor, us.nombre AS receptor, t.fecha FROM transferencias t INNER JOIN usuarios u ON t.emisor = u.id INNER JOIN usuarios us ON t.receptor = us.id',
        }
        try {
            const datos = await cnx.client.query(SQLQuery)
            return datos.rows
        } catch (err) {
            console.error(err)
        }
        cnx.release()
        cnx.pool.end()

    }

    return { insertarUsuario, obtenerUsuarios, modificarUsuario, eliminarUsuario, insertTransferencias, obtenerTransferencias }
}

module.exports = consultasB