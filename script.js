const songName = document.getElementById("name__music");
const bandName = document.getElementById("band__music");
const song = document.getElementById("song");
const cover = document.getElementById("cover");
const play = document.getElementById("play");
const next = document.getElementById("next");
const previous = document.getElementById("previous");


const shapeOfYou = {
    songName: "Shape Of You",
    artist: "Ed Sheeran",
    file: "shape of you"
};
const uptownFunk = {
    songName: "Uptown Funk",
    artist: "Bruno Mars",
    file: "uptown funk"
};
const cantStopTheFeeling = {
    songName: "Can't Stop the Feeling",
    artist: "Justin Timberlake",
    file: "cant stop the feeling"
};

const playlist = [shapeOfYou, uptownFunk, cantStopTheFeeling];
let index = 0;
let isPlaying = false;

function playMusic() {
    play.querySelector(".bi").classList.remove("bi-play-circle-fill");
    play.querySelector(".bi").classList.add("bi-pause-circle-fill");
    song.play();
    isPlaying = true;
}

function pauseMusic() {
    play.querySelector(".bi").classList.add("bi-play-circle-fill");
    play.querySelector(".bi").classList.remove("bi-pause-circle-fill");
    song.pause();
    isPlaying = false;
}

function playPauseDecider() {
    if (isPlaying === true) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function initializeSong() {
    cover.src = `images/${playlist[index].file}.webp`;
    song.src = `songs/${playlist[index].file}.mp3`;
    songName.innerText = playlist[index].songName;
    bandName.innerText = playlist[index].artist;
}

function previousSong(){
    if(index === 0){
        index = playlist.length - 1;
    }
    else{
        index = index -1;
    }
    initializeSong();
    playMusic(); 
}
function nextSong(){
    if(index === playlist.length - 1){
        index = 0;
    }
    else{
    index = index + 1;
    }
    initializeSong();
    playMusic(); 
}


initializeSong();

play.addEventListener("click", playPauseDecider);
previous.addEventListener("click", previousSong);
next.addEventListener("click", nextSong);
song.addEventListener("timeupdate", updateprogressbar);
