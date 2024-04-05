const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    text: {
        type: [String],
        required: false,
    },
    socketId: {
        type: String,
        required: true,
    }
});

const messageModel = mongoose.model("Message", messageSchema);

module.exports = {
    messageModel,
    messageSchema
};
