const io = require("socket.io")({
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"],
    },
});

const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
// database connection
mongoose
    .connect(process.env.MONGO_CONNECTION_STRING)
    .then(() => console.log("database connection successful!"))
    .catch((err) => console.log(err));

const {messageSchema} = require("./model/messageModel");
const messageModel = mongoose.model("Message", messageSchema);


async function saveDb(data) {
  const newData = new messageModel(data);
  try{
    await newData.save();
  } catch (err) {
    console.log(err);
  }
}

async function collectMsg(socketId){
  let userName, message;

  try {

    const pullDataFromServer = await messageModel.findOne({
      socketId
    });
    userName = pullDataFromServer.name;
    message = pullDataFromServer.text[pullDataFromServer.text.length - 1];
  } catch (err) {
    console.log('Error hewre\n', err);
  }

  return {
    userName, message
  }
}

async function pushMsg(socketId, message) {
  
  try{
    await messageModel.updateOne(
      {socketId},
      {$push: {text: message}}
    );
  } catch (err){
      console.log(err);
  }
}


io.on("connection", (socket) => {
    console.log("currently at connection event");
    //   socket.emit("chat-message", "Hello world");
    socket.on("new-user", async (userName) => {
        const curData = {
          name: userName,
          socketId: socket.id,
        }
        await saveDb(curData);
        socket.broadcast.emit("user-connected", userName);
    });
    socket.on("send-chat-message", async (message) => {
        
        await pushMsg(socket.id, message);

        const data = await collectMsg(socket.id);

        socket.broadcast.emit("chat-message", data);
    });
});

const port = 3000;

io.listen(port);
