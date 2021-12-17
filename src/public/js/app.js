const messageList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
const socket = new WebSocket(`ws://${window.location.host}`);
/*
frontend에서 socket : 서버로의 연결
backend에서 socket: 브라우저와의 연결
 */

const makeMessage = (type, payload) => {
  return JSON.stringify({ type, payload });
};

socket.addEventListener("open", () => {
  console.log("connected to server");
});

//서버로부터 메세지 받기
socket.addEventListener("message", (message) => {
  console.log("new message", message, " from the server");
  let messageItem = document.createElement("li");
  messageItem.style = "list-style:none";
  messageItem.innerText = message.data;
  messageList.append(messageItem);
});

nickForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = nickForm.querySelector("input");
  const nickName = makeMessage("nickName", input.value);
  socket.send(nickName);
  input.value = "";
});

//서버로 메세지 보내기
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = messageForm.querySelector("input");
  const message = makeMessage("message", input.value);
  socket.send(message);
  input.value = "";
});
