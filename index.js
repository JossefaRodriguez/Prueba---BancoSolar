const fs = require('fs')
const url = require('url')
const http = require('http')
const consultasB = require('./consultasB')
const conexion = require('./conexion')

const servidor = http.createServer(async (req, res) => {
    const method = req.method
    const urlb = req.url
    const consults = await consultasB()

    if (urlb === '/' && method === 'GET') {
        res.setHeader('Content-Type', 'text/html')
        res.end(fs.readFileSync('index.html', 'utf-8'))
    }
    else if (urlb === '/usuario' && method === 'POST') {
        try {
            let body
            req.on('data', (chunk) => {
                body = chunk.toString()
            })
            req.on('end', async () => {
                const datos = JSON.parse(body)
                const resp = await consults.insertarUsuario(datos.nombre, datos.balance)
                res.setHeader('Content-Type', 'application/json')
                res.statusCode = 201
                res.end(JSON.stringify(resp))
            })
        } catch (error) {
            res.statusCode = 500
            res.end(`message: ${error}`)
        }

    }
    else if (urlb.startsWith('/usuarios') && method === 'GET') {
        try {
            const resp = await consults.obtenerUsuarios()
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = 200
            res.end(JSON.stringify(resp))

        } catch (error) {
            res.statusCode = 500
            res.end(`message: ${error}`)
        }

    }
    else if (urlb.startsWith('/usuario') && method === 'PUT') {
        try {
            const id = url.parse(urlb, true).query
            let body
            req.on('data', (chunk) => {
                body = chunk.toString()
            })
            req.on('end', async () => {
                const datos = JSON.parse(body)
                const resp = await consults.modificarUsuario(datos.name, datos.balance, id.id)

                res.setHeader('Content-Type', 'application/json')
                res.statusCode = 200
                res.end(JSON.stringify(resp))
            })
        } catch (error) {
            res.statusCode = 500
            res.end(`message: ${error}`)
        }
    }
    else if (urlb.startsWith('/usuario') && method === 'DELETE') {
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 200
        res.end('{}')
    }
    else if (urlb === '/transferencia' && method === 'POST') {
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 200
        res.end('{}')
    }
    else if (urlb === '/transferencias' && method === 'GET') {
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 200
        res.end('{}')
    }
    else {
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 404
        res.end('{"message": "NOT FOUND"}')
    }


})
servidor.listen(3000, () => console.log('Servidor iniciado en http://localhost:3000'))


