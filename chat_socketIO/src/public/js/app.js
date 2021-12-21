/*
TODO: 1. enter room, leave room
TODO: 2. room notification ("someone join room","someone left room")
TODO: 3. count rooms, users in room
*/

const socket = io();

const welcome = document.getElementById("welcome");
const roomnameForm = document.getElementById("roomname");
const messageForm = document.getElementById("message");
const nicknameForm = document.getElementById("nickname");
const room = document.getElementById("room");

let roomname;

room.hidden = true;

const showRoom = () => {
  welcome.hidden = true;
  room.hidden = false;
  const roomTitle = room.querySelector("h3");
  roomTitle.innerText = `Room ${roomname} `;
};
const addMessage = (msg) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = msg;
  ul.appendChild(li);
};
const handleRoomSubmit = (e) => {
  e.preventDefault();
  const input = roomnameForm.querySelector("input");
  roomname = input.value;
  socket.emit("enter_room", input.value, showRoom);
  input.value = "";
};
const handleMessageSend = (e) => {
  e.preventDefault();
  const input = messageForm.querySelector("input");
  socket.emit("newMessage", input.value, roomname);
  addMessage(`you : ${input.value}`);
  input.value = "";
};
const handleNicknameSave = (e) => {
  e.preventDefault();
  const input = nicknameForm.querySelector("input");
  socket.emit("nickname", input.value);
  input.value = "";
};
roomnameForm.addEventListener("submit", handleRoomSubmit);
messageForm.addEventListener("submit", handleMessageSend);
nicknameForm.addEventListener("submit", handleNicknameSave);

socket.on("welcome", (nickname) => {
  addMessage(`${nickname} join!`);
});

socket.on("bye", (nickname) => {
  addMessage(`${nickname} left`);
});

socket.on("newMessage", addMessage);

// const socket = io();

// const welcome = document.getElementById("welcome");
// const room = document.getElementById("room");
// const nicknameForm = document.getElementById("nickname");
// const roomnameForm = document.getElementById("roomname");
// const messageForm = document.getElementById("message");
// const roomList = document.getElementById("roomList");

// room.hidden = true;
// let currentRoom;

// const enterRoom = (roomname) => {
//   welcome.hidden = true;
//   room.hidden = false;

//   const roomTitle = document.getElementById("roomtitle");
//   roomTitle.innerText = `${roomname} room`;
// };

// const sendMsg = (msg) => {
//   const chatLog = document.getElementById("chatLog");
//   const li = document.createElement("li");
//   li.innerText = msg;
//   chatLog.appendChild(li);
// };
// nicknameForm.addEventListener("submit", (e) => {
//   e.preventDefault();
//   const input = nicknameForm.querySelector("input");
//   socket.emit("nickname", input.value);
//   input.value = "";
// });
// roomnameForm.addEventListener("submit", (e) => {
//   e.preventDefault();
//   const input = roomnameForm.querySelector("input");
//   currentRoom = input.value;
//   input.value = "";
//   socket.emit("enterRoom", input.value, enterRoom(currentRoom));
// });
// messageForm.addEventListener("submit", (e) => {
//   e.preventDefault();
//   const input = messageForm.querySelector("input");
//   const value = input.value;
//   socket.emit("message", value, currentRoom, () => {
//     sendMsg(`you: ${value}`);
//   });
//   input.value = "";
// });

// socket.on("message", sendMsg);
