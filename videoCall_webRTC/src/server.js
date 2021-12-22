import http from "http";
import socketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));
const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = socketIO(server);

wss.on("connection", (socket) => {
  socket.onAny((eventName) => console.log(`event:${eventName}`));
  socket.on("enterRoom", (roomName) => {
    console.log(`enter ${roomName}`);
    socket.join(roomName);
    socket.to(roomName).emit("joinRoom");
  });
  socket.on("offer", (offer, roomName) => {
    console.log("serveroffer");
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });
});

server.listen(3000, handleListen);
