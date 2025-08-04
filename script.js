const songName = document.getElementById("name__music");
const bandName = document.getElementById("band__music");
const song = document.getElementById("music");
const cover = document.getElementById("cover");
const play = document.getElementById("play");
const next = document.getElementById("next");
const previous = document.getElementById("previous");
const currentProgress = document.getElementById("current__progress");
const progressContainer = document.getElementById("progress__container");
const shuffleButton = document.getElementById("shuffle");
const repeatButton = document.getElementById("repeat");
const likeButton = document.getElementById("like__button");
const currentTimeElement = document.getElementById("current-time");
const totalTimeElement = document.getElementById("total-time");

const shapeOfYou = {
    songName: "Shape Of You",
    artist: "Ed Sheeran",
    file: "shape of you",
    liked: false
};
const uptownFunk = {
    songName: "Uptown Funk",
    artist: "Bruno Mars",
    file: "uptown funk",
    liked: false
};
const cantStopTheFeeling = {
    songName: "Can't Stop the Feeling",
    artist: "Justin Timberlake",
    file: "cant stop the feeling",
    liked: false
};

const originalPlaylist = JSON.parse(localStorage.getItem("playlist")) ?? [shapeOfYou, uptownFunk, cantStopTheFeeling];
let sortedPlaylist = [...originalPlaylist];
let index = 0;
let isPlaying = false;
let isShuffled = false;
let repeatOn = false;

function playMusic() {
    play.querySelector("i").classList.remove("bi-play-circle-fill");
    play.querySelector("i").classList.add("bi-pause-circle-fill");
    song.play();
    isPlaying = true;
}

function pauseMusic() {
    play.querySelector("i").classList.add("bi-play-circle-fill");
    play.querySelector("i").classList.remove("bi-pause-circle-fill");
    song.pause();
    isPlaying = false;
}

function playPauseDecider() {
    isPlaying ? pauseMusic() : playMusic();
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${minutes}:${formattedSeconds}`;
}

function initializeSong() {
    cover.src = `images/${sortedPlaylist[index].file}.webp`;
    song.src = `songs/${sortedPlaylist[index].file}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist;
    likeButtonRender();

    song.addEventListener("loadedmetadata", () => {
        totalTimeElement.innerText = formatTime(song.duration);
    });
    if (song.readyState >= 2) {
        totalTimeElement.innerText = formatTime(song.duration);
    }
    currentTimeElement.innerText = "0:00";
}

function previousSong() {
    index = index === 0 ? sortedPlaylist.length - 1 : index - 1;
    initializeSong();
    playMusic();
}

function nextSong() {
    index = index === sortedPlaylist.length - 1 ? 0 : index + 1;
    initializeSong();
    playMusic();
}

function updateProgressBar() {
    const barWidth = (song.currentTime / song.duration) * 100;
    currentProgress.style.setProperty("--progress", `${barWidth}%`);
    currentTimeElement.innerText = formatTime(song.currentTime);
}

function jumpto(event) {
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition / width) * song.duration;
    song.currentTime = jumpToTime;
}

function shuffleButtonClicked() {
    isShuffled = !isShuffled;
    if (isShuffled) {
        shufflePlaylist(sortedPlaylist);
        shuffleButton.classList.add("button-active");
    } else {
        sortedPlaylist = [...originalPlaylist];
        shuffleButton.classList.remove("button-active");
    }
    index = 0;
    initializeSong();
    if (isPlaying) playMusic();
}

function shufflePlaylist(list) {
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }
}

function repeatButtonClicked() {
    repeatOn = !repeatOn;
    repeatButton.classList.toggle("button-active", repeatOn);
}

function nextOrRepeat() {
    repeatOn ? playMusic() : nextSong();
}

function likeButtonRender() {
    const liked = sortedPlaylist[index].liked;
    likeButton.querySelector("i").classList.toggle("bi-heart", !liked);
    likeButton.querySelector("i").classList.toggle("bi-heart-fill", liked);
    likeButton.classList.toggle("button-active", liked);
}

function likeButtonClicked() {
    sortedPlaylist[index].liked = !sortedPlaylist[index].liked;
    likeButtonRender();
    const updatedOriginal = originalPlaylist.map(song => {
        const match = sortedPlaylist.find(s => s.file === song.file);
        return match ? { ...song, liked: match.liked } : song;
    });
    localStorage.setItem("playlist", JSON.stringify(updatedOriginal));
}

initializeSong();

play.addEventListener("click", playPauseDecider);
previous.addEventListener("click", previousSong);
next.addEventListener("click", nextSong);
song.addEventListener("timeupdate", updateProgressBar);
song.addEventListener("ended", nextOrRepeat);
progressContainer.addEventListener("click", jumpto);
shuffleButton.addEventListener("click", shuffleButtonClicked);
repeatButton.addEventListener("click", repeatButtonClicked);
likeButton.addEventListener("click", likeButtonClicked);
