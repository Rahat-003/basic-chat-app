const mongoose = require('mongoose');

const socket = io("http://localhost:3000");
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");

const userName = prompt("What is your userName?");

appendMessage("You joined");

socket.emit("new-user", userName);

socket.on("chat-message", (data) => {
    appendMessage(`${data.userName}: ${data.message}`);
});

socket.on("user-connected", (userName) => {
    appendMessage(`${userName} connected`);
});

messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`You: ${message}`);
    socket.emit("send-chat-message", message);
    messageInput.value = "";
});


// appendMessage function here
function appendMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageContainer.append(messageElement);
}
