const express = require("express");
const app = express();
const http = require("http").createServer(app);

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

http.listen(PORT, () => {
  console.log(`sever is running on port ${PORT}`);
});

const io = require("socket.io")(http);

let userArr = [];

io.on("connection", (socket) => {
  console.log("connected...");

  socket.on("message", (msg) => {
    socket.broadcast.emit("message", msg);
  });

  socket.on("user", (user) => {
    userArr.push(user);
    socket.broadcast.emit("userList", userArr);
  });

  socket.on("refresh",()=>{
    socket.broadcast.emit("userList", userArr);
  });

  socket.on("disconnect", (user) => {
    userArr.splice(userArr.indexOf(user),1); //delete user from array
    socket.broadcast.emit("userList", userArr);
  });
});
