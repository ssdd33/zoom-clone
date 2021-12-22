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
  socket["nickname"] = "Anonymous";
  socket.on("nickname", (nickname) => {
    socket["nickname"] = nickname;
  });
  socket.on("enter", (roomname, done) => {
    socket.join(roomname);
    done();
    socket.to(roomname).emit("roomNoti", `${socket["nickname"]} join!`);
    console.log("rooms : ", wss.sockets.adapter.rooms);
    console.log("sids : ", wss.sockets.adapter.sids);
  });
  socket.on("message", (msg, roomname) => {
    socket.to(roomname).emit("message", `${socket["nickname"]} : ${msg}`);
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("roomNoti", `${socket["nickname"]} left`)
    );
  });
});

// const publicRooms = () => {
//   const {
//     sockets: {
//       adapter: { sids, rooms },
//     },
//   } = wss;
//   const publicrooms = [];
//   rooms.forEach((_, key) => {
//     if (sids.get(key) === undefined) {
//       publicRooms.push(key);
//     }
//   });
//   return publicrooms;
// };

server.listen(3000, handleListen);
