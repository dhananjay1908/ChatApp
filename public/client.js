const socket = io();

let username;
let sendbtn = document.querySelector("#btn-sender");
let sendtxt = document.querySelector("#text-sender");
let messageArea = document.querySelector(".chat-messages");


do {
  username = prompt("Enter your name: ");
} while (!username);

if(username){
  socket.emit("user", username);
}

sendtxt.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage(sendtxt.value);
    sendtxt.value = "";
  }
});

sendbtn.addEventListener("click",()=>{
  sendMessage(sendtxt.value);
  sendtxt.value = "";
})

function sendMessage(message) {
  let msg = {
    user: username,
    message: message.trim(),
  };
  appendMessage(msg, "chat-message-right");
  sendtxt.value = "";
  scroll();
  socket.emit("message", msg);
}

function activeUsers(id,user,command){
  let markup = `
    <div id="${id}" class="d-flex align-items-start">
      <div class="flex-grow-1 ml-3">
          ${user}
      </div>
    </div>
  `
  if(command === "add"){
    document.getElementById("side-panel").innerHTML += markup;
  }
  else if(command === "remove"){
    let elem = document.getElementById(id);
    elem.parentNode.removeChild(elem);
  }
}

function appendMessage(msg, type) {
  let mainDiv = document.createElement("div");
  let className = type;
  mainDiv.classList.add("small","pb-4",className);
  let date = new Date()
  let user = "You";
  if (msg.user !== username){
    user = msg.user
  }
  else{
    user = "You";
  }

  let markup = `<div class="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
                  <div class="font-weight-bold mb-1">${user}</div>
                  ${msg.message}
                  <div class="text-muted small text-nowrap mt-2">${date}</div>
                </div>`

  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
}

socket.on("message", (msg) => {
  appendMessage(msg, "chat-message-left");
  socket.emit("refresh");
  scroll();
});

socket.on("userList",(userArr) => {
  let id = 1;
  document.getElementById("side-panel").innerHTML = "";
  userArr.forEach(element => {
    activeUsers(id,element,"add"); //add all users to the
    id++;
  });
})

function scroll() {
  messageArea.scrollTop = messageArea.scrollHeight;
}
