const socket = io();

let name;
let textarea = document.querySelector("#textMsg");
let messageArea = document.querySelector(".chatArea");
do {
  name = prompt("Enter your name: ");
} while (!name);

textarea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage(e.target.value);
  }
});

function sendMessage(message) {
  let msg = {
    user: name,
    message: message.trim(),
  };
  appendMessage(msg, "outgoingMessage");
  textarea.value = "";
  scroll();
  socket.emit("message", msg);
}

function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  let className = type;
  mainDiv.classList.add(className);

  let markup = `
    <h4>${msg.user}</h4>
    <p>${msg.message}</p>`;

  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

socket.on("message", (msg) => {
  appendMessage(msg, "incomingMessage");
  scroll();
});

function scroll() {
  messageArea.scrollTop = messageArea.scrollHeight;
}
