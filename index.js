var express = require("express");
var app = express();
app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(6969);

user = [];

io.on("connection", function(socket) {
  socket.on("client-send-username", function(msg) {
    console.log(msg);
    if (user.indexOf(msg) >= 0) {
        socket.emit("server-register-fail");
    } else {
        user.push(msg);
        socket.username = msg;
        socket.emit("server-send-register-success", msg);
        io.sockets.emit("server-send-listuserol", user);
    }
  }); 
  
  socket.on("logout", function() {
    user.splice(user.indexOf(socket.username), 1);
    socket.broadcast.emit("server-send-listuserol", user);
  });

  socket.on("user-send-message", function(data) {
    io.sockets.emit("server-send-message", {username: socket.username, message: data});
  });

  socket.on("user-typing", function() {
    var u = socket.username + " is typing";
    io.sockets.emit("someone-typing", u);
  });
  
  socket.on("user-not-typing", function() {
    io.sockets.emit("someone-not-typing");
  });

  
});

app.get("/", (req, res) => {
  res.render("home");
});