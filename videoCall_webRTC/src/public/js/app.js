/*
 TODO: handle devices and stream
 1. get user's mediaList
 2. controll media (on/off, change)
*/
const myFace = document.getElementById("myFace");
const cameraBtn = document.getElementById("camera");
const muteBtn = document.getElementById("mute");
const cameraSelect = document.getElementById("cameras");
const call = document.getElementById("call");

let myStream;
let muted = false;
let cameraOff = false;

const getCameras = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (currentCamera.label === camera.label) {
        option.selected = true;
      }

      cameraSelect.appendChild(option);
    });
    console.log(cameras);
  } catch (e) {
    console.log(e);
  }
};
const getMedia = async (cameraId) => {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: cameraId ? cameraId : true,
    });
    console.log(myStream);
    myFace.srcObject = myStream;
    if (!cameraId) {
      await getCameras();
    }
  } catch (e) {
    console.log(e);
  }
};

const handleCameraBtnClick = () => {
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));

  if (!cameraOff) {
    cameraBtn.innerText = "Turn Camera On";
    cameraOff = true;
  } else {
    cameraBtn.innerText = "Turn Camera Off";
    cameraOff = false;
  }
};
const handleMuteBtnClick = () => {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));

  if (!muted) {
    muteBtn.innerText = "Unmute";
    muted = true;
  } else {
    muteBtn.innerText = "Mute";
    muted = false;
  }
};
const handleCameraChange = async () => {
  await getMedia({ deviceId: cameraSelect.value });
  if (myPeerConnection) {
    const videoTrack = myStream.getVideoTracks()[0];
    const videoSender = myPeerConnection
      .getSenders()
      .find((sender) => sender.track.kind === "video");
    videoSender.replaceTrack(videoTrack);
  }
};

cameraBtn.addEventListener("click", handleCameraBtnClick);
muteBtn.addEventListener("click", handleMuteBtnClick);
cameraSelect.addEventListener("input", handleCameraChange);

//TODO:RTC connection
let myPeerConnection;

const handleIce = (data) => {
  console.log("fired Ice");
  console.log(data);
  socket.emit("ice", data.candidate, roomName);
  console.log("sent ice");
};
const handleAddStream = (data) => {
  console.log("addStream event fired");
  // const newVideo = document.createElement("video");
  // newVideo.setAttribute("autoplay", "");
  // newVideo.setAttribute("playsinline", "");
  // newVideo.attributes.width = "400";
  // newVideo.attributes.height = "400";
  // newVideo.srcObject = data.stream;
  // call.appendChild(newVideo);
  // console.log(newVideo.attributes);
  const peerFace = document.getElementById("peerFace");
  peerFace.srcObject = data.stream;
};
const makeConnection = () => {
  myPeerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          "stun.l.google.com:19302",
          "stun1.l.google.com:19302",
          "stun2.l.google.com:19302",
          "stun3.l.google.com:19302",
          "stun4.l.google.com:19302",
        ],
      },
    ],
  });
  myPeerConnection.addEventListener("icecandidate", handleIce);
  myPeerConnection.addEventListener("addstream", handleAddStream);
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
};

//TODO: handle entering Room
const socket = io();

const welcome = document.getElementById("welcome");
const roomForm = welcome.querySelector("form");

call.hidden = true;
let roomName;

const initCall = async () => {
  welcome.hidden = true;
  call.hidden = false;
  await getMedia();
  makeConnection();
};

const assignRoomTitle = () => {
  const h3 = call.querySelector("h3");
  h3.innerText = `room ${roomName}`;
};

const handleEnterRoom = async (e) => {
  e.preventDefault();
  const input = roomForm.querySelector("input");
  await initCall();
  socket.emit("enterRoom", input.value);
  roomName = input.value;
  input.value = "";
  assignRoomTitle();
};

roomForm.addEventListener("submit", handleEnterRoom);

//socket event listener

socket.on("joinRoom", async () => {
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  socket.emit("offer", offer, roomName);
  console.log("sent Offer");
});

socket.on("offer", async (offer) => {
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);
  socket.emit("answer", answer, roomName);
  console.log("sent answer");
});

socket.on("answer", (answer) => {
  myPeerConnection.setRemoteDescription(answer);
});

socket.on("ice", (ice) => {
  myPeerConnection.addIceCandidate(ice);
  console.log("recieved ice");
});
