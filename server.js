const io = require("socket.io")({
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
  },
});

const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();
const message = require('./model/message');

// database connection
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => console.log("database connection successful!"))
  .catch((err) => console.log(err));


const users = {};


io.on("connection", (socket) => {
  console.log("current");
  //   socket.emit("chat-message", "Hello world");
  socket.on("new-user", (userName) => {
    users[socket.id] = userName;

    socket.broadcast.emit("user-connected", userName);
  });

  socket.on("send-chat-message", (message) => {
    // console.log(message);
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id],
    });
  });
});

const port = 3000;

io.listen(port, () => {
  console.log(`Socket is running at port ${port}`);
});
