import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));
const handleListen = () => console.log(`Listening on http://localhost:3000`);

//websocket을 만들기위해 서버 접근 경로를 만듬
const server = http.createServer(app);

/*
http 서버 위에 webSocket 서버 만들기:
인자를 전달하는 것이 필수는 아님(ws서버만 구동하도록 만들수도 있음),
 이렇게 인자로 http서버를 전달해 줌으로써 http서버, webSocket서버 둘 다 돌릴 수 있다.
-> localhost는 동일한 포트에서 http,ws request 두개를 다 처리할 수 있다.
*/
const wss = new WebSocket.Server({ server });

//연결된 브라우저 목록
const sockets = [];

//ws서버 이벤트 리스너
// on 메소드에서 받는 cb 함수는 socket을 인자로 받는다. socket:연결된 브라우저와의 contact라인(연결된 사용자), socket을 이용해 메세지 주고 받기등 이벤트 핸들링가능
wss.on("connection", (socket) => {
  sockets.push(socket);
  console.log("connected to browser");
  socket.on("close", () => console.log("disconnected from browser"));
  socket["nickname"] = "anon";
  //브라우저로부터 메세지 받기
  socket.on("message", (message) => {
    const messageObject = JSON.parse(message);
    switch (messageObject.type) {
      case "nickName":
        socket["nickname"] = messageObject.payload;
        break;
      case "message":
        sockets.forEach((aSocket) =>
          aSocket.send(socket.nickname + ":" + messageObject.payload)
        );
    }
  });
});
server.listen(3000, handleListen);
