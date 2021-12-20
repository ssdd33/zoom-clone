/*
TODO: 1. enter room, leave room
TODO: 2. room notification ("someone join room","someone leave room")
TODO: 3. count rooms, users in room
*/
const socket = io();

const welcome = document.getElementById("welcome");
const room = document.getElementById("room");
const nicknameForm = document.getElementById("nickname");
const roomnameForm = document.getElementById("roomname");
const messageorm = document.getElementById("message");

const nicknameInput = nicknameForm.querySelector("input");
const nicknameButton = nicknameForm.querySelector("button");
const roomnameInput = roomnameForm.querySelector("input");
const roomnameButton = roomnameForm.querySelector("button");
const messageInput = messageorm.querySelector("input");
const messageButton = messageorm.querySelector("button");

room.hidden = true;

const enterRoom = () => {
  welcome.hidden = true;
  room.hidden = false;
};
nicknameButton.addEventListener("click", () => {
  socket.emit("nickname", nicknameInput.value);
});
roomnameButton.addEventListener("click", () => {
  socket.emit("roomname", roomnameInput.value);
});
messageButton.addEventListener("click", () => {
  socket.emit("message", messageInput.value);
});
