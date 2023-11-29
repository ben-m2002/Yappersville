module.export = function (io) {
    io.on('connection', function (socket) {
        console.log('a user connected');

        socket.on("join", function (room) {
            socket.join(room);
        });

        socket.on('chat message', function (msg) {
            socket.to(msg.room).broadcast.emit('chat message', msg);
        });

         socket.on('disconnect', function () {
            console.log('user disconnected');
        });
    });
}