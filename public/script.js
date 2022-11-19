

//const { Socket } = require("engine.io");
const socket = io('/')
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

var peer = new Peer(undefined, {
    path: "/peerjs",
    host: "/",
    port: "443"
});

let myVideoStream;
//accessing camera and mic
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", call => {
        //console.log("peer is called");
        call.answer(stream)
        const video = document.createElement("video")
        call.on("stream", userVideoStream => {
            console.log("peer is being called on stream");
            addVideoStream(video, userVideoStream)
        })
    })
    socket.emit("ready");



    socket.on("user-connected", (userId) => {
        connecToNewUser(userId, stream);
    })

//     let text = $("input")

//     $("html").keydown((e) => {
//         if (e.which == 13 && text.val().length !== 0) {

//             socket.emit("message", text.val());
//             text.val("")
//         }
//     });

//     socket.on("createMessage", message => {
//         console.log("comning ffrom server", message);
//         $(".messages").append(`<li class="message"><b>user</b><br/>${message}</li>`);
//         scrollToBottom()
//     })
})

// this generates automatic id's
peer.on("open", id => {
    //console.log(id);
    socket.emit("join-room", ROOM_ID, id);

})

// socket.on("user-connected", (userId) => {
//     connecToNewUser(userId,stream);
// })

const connecToNewUser = (userId, stream) => {
    //console.log(userId);
    //we are calling the user here
    const call = peer.call(userId, stream)
    const video = document.createElement("video")
    call.on("stream", userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}

//displaying user data
const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
    })
    videoGrid.append(video);
}

//adding it
let text = $("input")

    $("html").keydown((e) => {
        if (e.which == 13 && text.val().length !== 0) {

            socket.emit("message", text.val());
            text.val("")
        }
    });

    socket.on("createMessage", message => {
        console.log("comning ffrom server", message);
        $(".messages").append(`<li class="message"><b>user</b><br/>${message}</li>`);
        scrollToBottom()
    })


const scrollToBottom = () => {
    let d = $(".main__chat__window");
    d.scrollTop(d.prop("scrollHeight"));
}

const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }
    else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `
    <i class="fa-solid fa-microphone"></i>
    <span>Mute</span>
    `
    document.querySelector(".main__mute__button").innerHTML = html;
}
const setUnmuteButton = () => {
    const html = `
    <i class="unmute fa-solid fa-microphone-slash"></i>
    <span>Unute</span>
    `
    document.querySelector(".main__mute__button").innerHTML = html;
}

const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo()
    }
    else {
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}


const setStopVideo = () => {
    const html = `
    <i class="fa-solid fa-video"></i>
    <span>Stop Video</span>
    `
    document.querySelector(".main__video__button").innerHTML = html;

}
const setPlayVideo = () => {
    const html = `
    <i class="stop fa-solid fa-video-slash"></i>
    <span>Play Video</span>
    `
    document.querySelector(".main__video__button").innerHTML = html;

}
