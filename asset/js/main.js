import songs from "./songs.js";
// console.log(songs);


// Get elemet DOM
const wrapper = document.querySelector('.wrapper');
const musicImg = wrapper.querySelector('.img-area img');
const musicName = wrapper.querySelector('.song-details .name');
const musicAtrist = wrapper.querySelector('.song-details .atrist');
const playPauseBtn = wrapper.querySelector('.play-pause');
const prevBtn = wrapper.querySelector('#prev');
const nextBtn = wrapper.querySelector('#next');
const mainAudio = wrapper.querySelector('#main-audio');
const progressArea = wrapper.querySelector('.progress-area');
const progressBar = progressArea.querySelector('.progress-bar');
const musicList = wrapper.querySelector('.music-list');
const moreMusicBtn = wrapper.querySelector('#more-music');
const closeMoreMusic = musicList.querySelector('#close');

//
let lengthSongs = songs.length;
let musicIndex = Math.floor((Math.random() * lengthSongs) + 1);
let isMusicPause = true;

window.addEventListener('load', function () {
    loadMusic(musicIndex);
    playingSong();
})

function loadMusic(indexNumb) {
    musicName.innerText = songs[indexNumb - 1].name;
    musicAtrist.innerText = songs[indexNumb - 1].artist;
    musicImg.src = songs[indexNumb - 1].image;
    mainAudio.src = songs[indexNumb - 1].src;
}
// Play music
function playMusic() {
    wrapper.classList.add('paused');
    playPauseBtn.querySelector('i').innerText = 'pause';
    mainAudio.play();
}

// Pause music
function pauseMusic() {
    wrapper.classList.remove('paused');
    playPauseBtn.querySelector('i').innerText = 'play_arrow';
    mainAudio.pause();
}

// Prev song
function prevMusic() {
    musicIndex--;
    musicIndex < 1 ? musicIndex = lengthSongs : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

// Next song
function nextMusic() {
    musicIndex++;
    musicIndex > lengthSongs ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

// event click Pause btn
playPauseBtn.addEventListener('click', function () {
    const isMusicPlay = wrapper.classList.contains('paused');
    isMusicPlay ? pauseMusic() : playMusic();
    // isMusicPlay ? playMusic() : pauseMusic();
    playingSong();

})

// event click prev btn
prevBtn.addEventListener('click', function () {
    prevMusic();
})
// event click next btn
nextBtn.addEventListener('click', function () {
    nextMusic();
})

// update time when song playing
mainAudio.addEventListener('timeupdate', function (e) {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;
    console.log(duration)

    let musicCurrentTime = wrapper.querySelector('.current-time');
    let musicDurationTime = wrapper.querySelector('.max-duration');
    // time duration
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if (totalSec < 10) {
        totalSec = `0${totalSec}`;
    }
    if (mainAdDuration) {
        musicDurationTime.innerText = `${totalMin}:${totalSec}`;
    } else {
        musicDurationTime.innerText = `0:00`;
    }
    // time current will change
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        currentSec = `0${currentSec}`;

    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
})

progressArea.addEventListener('click', function (e) {
    let progressWidth = progressArea.clientWidth;
    let clickedOffsetX = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;

    playMusic();
    playingSong();
})

const repeatBtn = wrapper.querySelector('#repeat-list');
repeatBtn.addEventListener('click', function () {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case 'repeat':
            repeatBtn.innerText = 'repeat_one';
            repeatBtn.setAttribute('title', 'Song looped');
            break;
        case 'repeat_one':
            repeatBtn.innerText = 'shuffle';
            repeatBtn.setAttribute('title', 'Playback shuffled');
            break;
        case 'shuffle':
            repeatBtn.innerText = 'repeat';
            repeatBtn.setAttribute('title', 'Playlist looped');
            break;
    }
})

mainAudio.addEventListener('ended', function () {
    let getText = repeatBtn.innerText;
    switch (getText) {
        case 'repeat':
            nextMusic();
            break;
        case 'repeat_one':
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case 'shuffle':
            let randIndex = Math.floor((Math.random() * lengthSongs) + 1);
            do {
                let randIndex = Math.floor((Math.random() * lengthSongs) + 1);
            } while (musicIndex == randIndex);
            musicIndex = randIndex;
            loadMusic(musicIndex);
            playMusic();
            playingSong();
            break;
    }
});

moreMusicBtn.addEventListener('click', function () {
    musicList.classList.toggle('show');
});
closeMoreMusic.addEventListener('click', function () {
    moreMusicBtn.click();
});

const ulTag = wrapper.querySelector('ul');

for (let i = 0; i < lengthSongs; i++) {
    let liTag = `<li li-index="${i + 1}">
        <div class="row">
            <span>${songs[i].name}</span>
            <p>${songs[i].artist}</p>
        </div>
        <span id="song-${songs[i].id}" class="audio-duration">3:40</span>
        <audio class="song-${songs[i].id}" src="${songs[i].src}"></audio>
    </li>
    `;
    ulTag.insertAdjacentHTML('beforeend', liTag);

    let liAudioDurationTag = ulTag.querySelector(`#song-${songs[i].id}`);
    let liAudioTag = ulTag.querySelector(`.song-${songs[i].id}`);

    liAudioTag.addEventListener('loadeddata', function () {
        let duration = liAudioTag.duration;
        let totalMin = Math.floor(duration / 60);
        let totalSec = Math.floor(duration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        liAudioDurationTag.innerText = `${totalMin}: ${totalSec}`;
        liAudioDurationTag.setAttribute('t-duration', `${totalMin}: ${totalSec}`);
    });
};
function playingSong() {
    const allLiTag = ulTag.querySelectorAll('li');

    for (let j = 0; j < allLiTag.length; j++) {
        let audioTag = allLiTag[j].querySelector('.audio-duration')
        if (allLiTag[j].classList.contains('playing')) {
            allLiTag[j].classList.remove('playing');
            let adDuration = audioTag.getAttribute('t-duration');
            audioTag.innerText = adDuration;
        }
        if (allLiTag[j].getAttribute('li-index') == musicIndex) {
            allLiTag[j].classList.add('playing');
            audioTag.innerText = 'playing';
        }
        // allLiTag[j].setAttribute('onclick', 'clicked(this)');
        allLiTag[j].onclick = function () {
            let getLiIndex = allLiTag[j].getAttribute('li-index');
            musicIndex = getLiIndex;
            loadMusic(getLiIndex);
            playMusic();
            playingSong();
        };
    }
};
