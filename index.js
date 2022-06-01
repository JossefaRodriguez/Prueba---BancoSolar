const fs = require ('fs')
const url = require ('url')
const http = require ('http')
//const conexion = require ('./conexion')

const servidor = http.createServer(async (req, res) => {
 const method = req.method
 const urlb = req.url

    if(urlb === '/' && method === 'GET') {
        res.setHeader('Content-Type', 'text/html')
        res.end(fs.readFileSync('index.html', 'utf-8'))
    }
    else if(urlb === '/usuario' && method === 'POST') {
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 201
        res.end('{}')
    }
    else if(urlb.startsWith('/usuarios') && method === 'GET') {
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 200
        res.end('{}')
    }
    else if(urlb.startsWith('/usuario') && method === 'PUT') {
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 200
        res.end('{}')
    }
    else if(urlb.startsWith('/usuario') && method === 'DELETE') {
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 200
        res.end('{}')
    }
    else if(urlb === '/transferencia' && method === 'POST') {
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = 200
        res.end('{}')
    }
    else if(urlb === '/transferencias' && method === 'GET') {
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

  
