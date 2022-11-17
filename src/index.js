const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use('/static', express.static(__dirname + '/views'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/public/html/menu.html');
});

app.get('/salaEspera', (req, res) => {
    res.sendFile(__dirname + '/views/public/html/sala-de-espera.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.broadcast.emit('user disconnected', 'user disconnected ' + socket.id);
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('new room', (room) => {
        socket.join(room);
        console.log('new room ' + room);
        socket.broadcast.emit('new room', room);
    });

    socket.to("room2").emit("some event", "some data");
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});