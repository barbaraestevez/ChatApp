const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const readLine = require('readline');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST", "DELETE"]
    }
});

const users = {};
const rooms = [];

io.on('connection', (socket) => {
    console.log(`Usuario ${socket.id} conectado`);

    socket.on('join', (data) => {
        const { username, room } = data;
        users[socket.id] = { username, room };
        socket.join(room);
        rooms.push(room);

        socket.emit('join', `¡Bienvenido ${username}!`);
        io.to(room).emit('chat', `${username} se ha unido a la sala ${room}`);
    })

    socket.on ('chat', (msg) => {
        const user = users[socket.id];
        const room = user.room;

        io.to(room).emit('chat', { msg: `${user.username} >> ${msg}`, room: room });
        //io.emit('chat', msg);

       // getMsg();
    }) 
}
/*
    socket.on ('disconnect', () => {
        const user = users[socket.id];
        if(user){
            const room = user.room;
            io.to(room).emit('chat', `${user.username} se ha ido de la sala ${room}`)
        }
        console.log(`Usuario ${socket.id} desconectado`);
    })
});

server.listen(3000, () => {
    console.log('Servidor ejecutándose');
})

const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
})
*/
/*
function getMsg(){
    rl.question('Respuesta: ',(msg) => {
        io.emit('chat', `Server: ${msg}`);
        getMsg();
    })
}
*/)