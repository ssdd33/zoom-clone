import http, { get } from "http";
import WebSocket from "ws";
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

const publicRooms = () => {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wss;
  const publicrooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicrooms;
};

wss.on("connection", (socket) => {
  socket["nickname"] = "Anonymous";
  console.log(socket.id);
  socket.onAny((event) => console.log(`socket event : ${event} `));
  socket.on("enter_room", (roomname, done) => {
    console.log(socket.rooms);
    socket.join(roomname);
    done();
    socket.to(roomname).emit("welcome", socket["nickname"]);
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket["nickname"])
    );
  });
  socket.on("newMessage", (msg, roomname) => {
    socket.to(roomname).emit("newMessage", `${socket["nickname"]} : ${msg}`);
  });
  socket.on("nickname", (nickname) => {
    socket["nickname"] = nickname;
  });
});

server.listen(3000, handleListen);

// wss.on("connection", (socket) => {
//   socket["nickname"] = "Anonymous";

//   socket.on("nickname", (nickname) => {
//     socket["nickname"] = nickname;
//   });

//   socket.on("enterRoom", (roomname, done) => {
//     console.log(roomname);
//     done();
//   });

//   socket.on("message", (msg, room, done) => {
//     done();
//     socket.to(room).emit("message", msg);
//   });

//   socket.on("disconnect", (reason) => console.log(`disconnect`, reason));
// });
