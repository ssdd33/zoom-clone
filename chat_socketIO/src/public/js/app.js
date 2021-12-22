/*
TODO: 
1. enter room, leave room
2. room notification ("someone join room","someone left room")
3. send message with nickname
*/
const socket = io();

const nicknameForm = document.getElementById("nickname");
const enterRoomForm = document.getElementById("enterRoom");
const messageForm = document.getElementById("message");
const room = document.getElementById("room");
let roomname;
room.hidden = true;

const assignRoomTitle = () => {
  const h3 = room.querySelector("h3");
  h3.innerText = `room ${roomname}`;
};
const showRoom = () => {
  const welcome = document.getElementById("welcome");
  welcome.hidden = true;
  room.hidden = false;
};
const addMessage = (msg) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = msg;
  ul.appendChild(li);
};

const handleNicknameForm = (e) => {
  e.preventDefault();
  const input = nicknameForm.querySelector("input");
  socket.emit("nickname", input.value);
  input.value = "";
};
const handleEnterRoomForm = (e) => {
  /*
  TODO:
  1.hide #welcome
  2.show #room
  3.give room title
  4.client:emit "enter" with roomname , server : on "enter" socket join roomname
  5.server: emit "roomNotification" with msg,  client: on "room notification", addMessage
  */
  e.preventDefault();
  const input = enterRoomForm.querySelector("input");
  roomname = input.value;
  assignRoomTitle();
  socket.emit("enter", input.value, showRoom);
  input.value = "";
};
const handleMessageForm = (e) => {
  /*
  TODO:
  1.addMessage "you: msg"
  2.client: emit "message" with msg roomname, server: on "message" to roomname emit "message" with "nickname:msg"
  3.client: on "message" addMessage :msg
  */
  e.preventDefault();
  const input = messageForm.querySelector("input");
  addMessage(`you : ${input.value}`);
  socket.emit("message", input.value, roomname);
  input.value = "";
};
nicknameForm.addEventListener("submit", handleNicknameForm);
enterRoomForm.addEventListener("submit", handleEnterRoomForm);
messageForm.addEventListener("submit", handleMessageForm);

/*
socket event listener
*/

socket.on("roomNoti", addMessage);
socket.on("message", addMessage);
