const io = require("socket.io")({
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"],
    },
});

// const dotenv = require("dotenv");
// const mongoose = require("mongoose");
// dotenv.config();
// const message = require("./model/message");

// // database connection
// mongoose
//     .connect(process.env.MONGO_CONNECTION_STRING)
//     .then(() => console.log("database connection successful!"))
//     .catch((err) => console.log(err));

const users = {};

io.on("connection", (socket) => {
    console.log("current");
    //   socket.emit("chat-message", "Hello world");
    socket.on("new-user", (userName) => {
        console.log(socket.id, userName);
        users[socket.id] = userName;

        // add this user to database
        // qq

        socket.broadcast.emit("user-connected", userName);
    });
    socket.on("send-chat-message", (message) => {
        console.log(message);
        socket.broadcast.emit("chat-message", {
            message: message,
            userName: users[socket.id],
        });
    });
});

const port = 3000;

io.listen(port);
