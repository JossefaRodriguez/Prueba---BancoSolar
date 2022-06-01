const conexion = require ('./conexion')

const consultasB = async() => {
    const cnx = await conexion()

    const insertarUsuario = async(nombre, balance) => {
        const SQLQuery = {
            text: 'INSERT INTO usuarios(nombre, balance) VALUES ($1, $2) RETURNING *',
            values: [nombre, balance]
        }
        try {
            const data = await cnx.client.query(SQLQuery)
            return data
            
        } catch (err) {
            console.error(err)
            
        }
    }

    return {insertarUsuario}
}