const socketio = require('socket.io');
const Chat = require('../models/Chat'); // import your message model

module.exports = (server) => {
    const io = socketio(server); // create a Socket.IO instance with your server

    io.on('connection', (socket) => {
        console.log(`Socket ${socket.id} connected`);

        socket.on('join', (userId) => {
            socket.join(userId);
        });

        // send a message to another user
        socket.on('sendMessage', async (data) => {
            const { senderId, receiverId, content, type } = data; // get the sender, receiver and content from the data object
            try {
                // save the message to the database
                const message = await Chat.create({ senderId, receiverId, content, type });

                // emit the message to both the sender and receiver using their ids
                io.to(senderId).emit('message', message);
                io.to(receiverId).emit('message', message);
            } catch (error) {
                console.error(error);
            }
        });

        // disconnect from the socket
        socket.on('disconnect', () => {
            console.log(`Socket ${socket.id} disconnected`);
        });
    });
};

