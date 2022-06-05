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
    }
    // METODO eliminar usuarios
    const eliminarUsuario = async (id) => {
        const SQLQuery = {
            text: 'DELETE FROM usuarios WHERE id = $1',
            values: [id]
        }
        try {
            await cnx.client.query(SQLQuery, (errorConsulta) => {
                if (errorConsulta) {
                    console.error('No se pudo eliminar el usuario')
                }
            })
        }
        catch (err) {
            console.error(err)
        }
        cnx.release()
    }

    // TRANSFERENCIAS 

    const insertTransferencias = async (emisor, receptor, monto, fecha) => {
        try {
            const SQLQuery = {
                text: 'INSERT INTO transferencias(emisor, receptor, monto, fecha) VALUES ($1, $2, $3, $4) RETURNING *',
                values: [emisor, receptor, monto, fecha]
            }
            const SQLQueryDescontar = {
                text: 'UPDATE usuarios SET balance = balance - $1 WHERE id = $2 RETURNING *',
                values: [monto, emisor]
            }
            const SQLQueryAumentar = {
                text: 'UPDATE usuarios SET balance = balance + $1 WHERE id = $2 RETURNING *',
                values: [monto, receptor]
            }
            await cnx.client.query('BEGIN')
            const resp = await cnx.client.query(SQLQuery)
            await cnx.client.query(SQLQueryDescontar),
            await cnx.client.query(SQLQueryAumentar)
            await cnx.client.query('COMMIT')
            cnx.release()
            return (resp.rows)

        }
        catch (err) {
            await cnx.client.query('ROLLBACK')
            console.error(`error código: ${err.code}`)
            console.log(`Detalle del error: ${err.detail}`)
            console.log(`Tabla originaria del error: ${err.table}`)
            console.log(`Restricción violada en el campo: ${err.constraint}`)
            cnx.release()
            return []
        }

    }

    const obtenerTransferencias = async () => {
        const SQLQuery = {
            text: `SELECT t.id, u.nombre AS emisor, us.nombre AS receptor, t.monto, t.fecha 
                FROM transferencias t 
                INNER JOIN usuarios u ON t.emisor = u.id 
                INNER JOIN usuarios us ON t.receptor = us.id`,
            rowMode: 'array'
        }
        try {
            const datos = await cnx.client.query(SQLQuery)
            return datos.rows
        } catch (err) {
            console.error(err)
        }
        cnx.release()
    }

    return { insertarUsuario, obtenerUsuarios, modificarUsuario, eliminarUsuario, insertTransferencias, obtenerTransferencias }
}

module.exports = consultasB