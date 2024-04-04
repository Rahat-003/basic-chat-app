const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    text: {
        type: [String],
    },
    socketId: {
        type: String,
        required: true,
    }
});

const message = mongoose.model("Message", messageSchema);

module.exports = message;
