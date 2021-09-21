const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
})
const fs = require('fs')
const configJson = fs.readFileSync('./config.json', 'utf8')
const config = JSON.parse(configJson)
const port = config.port

app.use(express.json())

app.get('/', (req, res) => {
    res.send('simple-socket')
})

io.on('connection', function (socket) {
    console.log('connection : ' + socket)
    socket.on('ioemit00', function (data) {
        io.emit('ioemit00', data)
    })
    socket.on('ioemit01', function (data) {
        io.emit('ioemit01', data)
    })
    socket.on('ioemit02', function (data) {
        io.emit('ioemit02', data)
    })
    socket.on('ioemit03', function (data) {
        io.emit('ioemit03', data)
    })
    socket.on('ioemit05', function (data) {
        io.emit('ioemit05', data)
    })

    socket.on('sbe00', function (data) {
        socket.broadcast.emit('sbe-c00', data)
    })
    socket.on('sbe01', function (data) {
        socket.broadcast.emit('sbe-c01', data)
    })
    socket.on('sbe02', function (data) {
        socket.broadcast.emit('sbe-c02', data)
    })
    socket.on('sbe03', function (data) {
        socket.broadcast.emit('sbe-c03', data)
    })
    socket.on('sbe04', function (data) {
        socket.broadcast.emit('sbe-c04', data)
    })

    socket.on('forceDisconnect', function () {
        console.log('disconnect ::: ' + socket)
        socket.disconnect()
    })
    socket.on('disconnect', function () {
        console.log('disconnected ::: ' + socket)
    })
})

//---------------------- namespace and room
const nsio = io.of('/nsio').on('connection', function (socket) {
    socket.on('nsio-msg', function (data) {
        const room = socket.room = data.room
        socket.join(room)
        nsio.to(room).emit('nsio-msg-c', data)
    })

    socket.on('forceDisconnect', function () {
        console.log('nsio disconnect ::: ' + socket)
        socket.disconnect()
    })
    socket.on('disconnect', function () {
        console.log('nsio disconnected ::: ' + socket)
    })
})

server.listen(port, () => {
    console.log(`simple-socket start port ${port}`)
})