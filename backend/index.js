import express from "express";
import { Server } from "socket.io";

const app = express();
const PORT = 4000;
import cors from "cors";

app.use(cors());

const server = app.listen(PORT, () => {
    console.log('server listening at', server.address())
})

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

const connections = new Set();

io.on('connection', (socket) => {
    console.log('a user connected');

    connections.add(socket);

    socket.on('disconnect', () => {
        connections.delete(socket);
        console.log('a user disconnected');
        console.log('connected users', connections.size);
    });
});