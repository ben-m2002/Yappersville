const cookie = require('cookie');
let userRooms = {}; // map a user to all their rooms


module.exports = function (io, db) {
    io.on('connection', function (socket) {
        console.log('a user connected');

        socket.on("join", function (room) {
            if (socket.handshake.headers && socket.handshake.headers.cookie) {
                const cookies = cookie.parse(socket.handshake.headers.cookie);
                const token = cookies["auth"];
                const users = db.get("users");
                // were going to map a user to a room, we dont need to map to a socker since all users already have a socket
                if (users){
                    const user = users.findOne({token: token}).value();
                    if (user) {
                        if (userRooms[user.id]) {
                            userRooms[user.id].push(room);
                        } else {
                            userRooms[user.id] = [room];
                        }
                    }
                }
            }
            console.log("A user joined the room: " + room);
            socket.join(room);
        });

        socket.on("leave", function (room) {
             if (socket.handshake.headers && socket.handshake.headers.cookie) {
                const cookies = cookie.parse(socket.handshake.headers.cookie);
                const token = cookies["auth"];
                const users = db.get("users");
                if (users){
                    const user = users.findOne({token: token}).value();
                    if (user) {
                        if (userRooms[user.id]) {
                            userRooms[user.id] = userRooms[user.id].filter(r => r !== room);
                        }
                    }
                }
            }
            console.log("A user left the room: " + room);
            socket.leave(room);
        });

        socket.on("leave all", function() {
            if (socket.handshake.headers && socket.handshake.headers.cookie) {
                const cookies = cookie.parse(socket.handshake.headers.cookie);
                const token = cookies["auth"];
                const users = db.get("users");
                if (users){
                    const user = users.findOne({token: token}).value();
                    if (user) {
                        if (userRooms[user.id]) {
                            for (let room of userRooms[user.id]){
                                socket.leave(room);
                            }
                        }
                    }
                }
            }
            console.log("A user left all rooms");
        });

        socket.on('chat message', function (msg) {
            console.log('message: ' + msg.text);
            socket.to(msg.room).emit('chat message', msg);
        });

         socket.on('disconnect', function () {
             if (socket.handshake.headers && socket.handshake.headers.cookie) {
                const cookies = cookie.parse(socket.handshake.headers.cookie);
                const token = cookies["auth"];
                const users = db.get("users");
                if (users){
                    const user = users.findOne({token: token}).value();
                    if (user) {
                        if (userRooms[user.id]) {
                            userRooms[user.id] = [];
                        }
                    }
                }
            }
            console.log('user disconnected');
        });
    });
}