const id = localStorage.getItem('userId');
const token = localStorage.getItem('token');
const ip = localStorage.getItem('ip');

const audioPlayer = document.getElementById("audioPlayer");
const playButton = document.getElementById("playButton");
const pauseButton = document.getElementById("pauseButton");
const progressBar = document.getElementById("progressBar");
const progressBarContainer = document.getElementById("progressBarContainer");
const playForwardButton = document.getElementById("playForwardButton");
const playBackButton = document.getElementById("playBackButton");
const playlistName = document.getElementById("playlistname");

let songNames = [];
let sondId = -1;

async function loadPlaylists() {
    await fetch('http://'+ ip +':5285/Library/GetPlaylistsByUser?id=' + id, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(async data => {
            const playlistList = document.getElementById('playlist-list');
            const listItemFav = document.createElement('li');
            const refFav = document.createElement('button');
            const imgFav = document.createElement('img');
            const textFav = document.createElement('p');
            imgFav.src="heart.jpg";
            imgFav.alt='playlist image';
            imgFav.className='playlist-image';
            refFav.appendChild(imgFav);
            textFav.textContent = "Любимое";
            textFav.className='playlist-name';
            refFav.appendChild(textFav);
            refFav.onclick = () =>  loadFavouriteSongs();
            listItemFav.appendChild(refFav);
            listItemFav.className = "playlist-ref";
            playlistList.appendChild(listItemFav);

            const listItem = document.createElement('li');
            const ref = document.createElement('button');
            const img = document.createElement('img');
            img.src="plus.png";
            img.alt='playlist image';
            img.className='playlist-image';
            ref.appendChild(img);
            ref.onclick = () => loadBase();
            listItem.appendChild(ref);
            listItem.className = "playlist-ref";
            playlistList.appendChild(listItem);

            for (const playlist of data) {
                const listItem = document.createElement('li');
                const ref = document.createElement('button');
                const img = document.createElement('img');
                const text = document.createElement('p');
                await fetch('http://'+ ip +':5285/Library/GetImage?PathToImage=' + playlist.pathToImage, {
                    method: 'GET'
                })
                    .then(async response => {
                        const blob = await response.blob();
                        img.src = URL.createObjectURL(await blob);
                    })
                    .catch(error => {
                        console.error('Ошибка при загрузке плейлистов:', error);
                    });
                img.alt='playlist image';
                img.className='playlist-image';
                ref.appendChild(img);
                text.textContent = playlist.name;
                text.className='playlist-name';
                ref.appendChild(text);
                ref.onclick = () => loadSongs(playlist.id, playlist.name);
                listItem.appendChild(ref);
                listItem.className = "playlist-ref";
                playlistList.appendChild(listItem);
            }
        })
        .catch(error => {
            console.error('Ошибка при загрузке плейлистов:', error);
        });
}

function createPlaylist(){
    const name = playlistName.value;
    const formData = new FormData();
    formData.append('userId', id);
    formData.append('name', name);
    fetch('http://'+ ip +':5285/Library/AddPlaylist', {
        method: 'PUT',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            const playlistList = document.getElementById('playlist-list');
            const listItem = document.createElement('li');
            const ref = document.createElement('button');
            const img = document.createElement('img');
            const text = document.createElement('p');
            fetch('http://'+ ip +':5285/Library/GetImage?PathToImage=' + data.pathToImage, {
                method: 'GET'
            })
                .then(async response => {
                    const blob = await response.blob();
                    img.src = URL.createObjectURL(await blob);
                })
                .catch(error => {
                    console.error('Ошибка при загрузке плейлистов:', error);
                });
            img.alt='playlist image';
            img.className='playlist-image';
            ref.appendChild(img);
            text.textContent = data.name;
            text.className='playlist-name';
            ref.appendChild(text);
            ref.onclick = () => loadSongs(data.id, data.name);
            listItem.appendChild(ref);
            listItem.className = "playlist-ref";
            playlistList.appendChild(listItem);
        })
        .catch(error => {
            console.error('Ошибка:', error);
            errorContainer.textContent = "Произошла ошибка";
        });
    cancelPlaylist();
}

function cancelPlaylist(){
    document.getElementById("new-playlist").style.display = "none";
    document.getElementById("playlists").style.display = "inline";
}

async function loadSongs(playlistId, name) {
    let songList = document.getElementById("song-list");
    let songs = songList.querySelectorAll('li');
    for(let i = 0; i < songs.length; i++){
        songs[i].remove();
    }

    const playlistName = document.getElementById("playlist-name");
    playlistName.textContent = name;

    songNames = [];

    await fetch('http://'+ ip +':5285/Library/GetSongsByPlaylist?id=' + playlistId, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(song => {
                const listItem = document.createElement('li');
                const songButton = document.createElement('button');
                songButton.textContent = song.name;
                songButton.onclick = () => playSong(song.pathToSong, song.id-1);
                songButton.className = "song-button";
                songNames.push(song.pathToSong);
                listItem.appendChild(songButton);
                songList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Ошибка при загрузке песен:', error);
        });
}

async function loadFavouriteSongs(){
    let songList = document.getElementById("song-list");
    let songs = songList.querySelectorAll('li');
    for(let i = 0; i < songs.length; i++){
        songs[i].remove();
    }

    const playlistName = document.getElementById("playlist-name");
    playlistName.textContent = "Любимое";

    songNames = [];

    await fetch('http://'+ ip +':5285/Library/GetFavouriteSongs?id=' + id, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(song => {
                const listItem = document.createElement('li');
                const songButton = document.createElement('button');
                songButton.textContent = song.name;
                songButton.onclick = () => playSong(song.pathToSong, song.id-1);
                songButton.className = "song-button";
                songNames.push(song.pathToSong);
                listItem.appendChild(songButton);
                songList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Ошибка при загрузке песен:', error);
        });
}

function loadBase(){
    document.getElementById("new-playlist").style.display = "inline";
    document.getElementById("playlists").style.display = "none";
}

async function playSong(name, id){
    sondId = id;
    try {
        const response = await fetch('http://'+ ip +':5285/Library/GetAudio?PathToSong=' + name);
        const blob = await response.blob();
        const audioURL = URL.createObjectURL(blob);

        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.src = audioURL;
        audioPlayer.play();
        playButton.style.display = "none";
        pauseButton.style.display = "inline";
    } catch (error) {
        console.error('Ошибка при воспроизведении аудио:', error);
    }
}

playButton.addEventListener("click", function() {
    audioPlayer.play();
    playButton.style.display = "none";
    pauseButton.style.display = "inline";
});

pauseButton.addEventListener("click", function() {
    audioPlayer.pause();
    pauseButton.style.display = "none";
    playButton.style.display = "inline";
});

audioPlayer.addEventListener("timeupdate", function() {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = progress + "%";
});

progressBarContainer.addEventListener("click", function(event) {
    const boundingRect = progressBarContainer.getBoundingClientRect();
    const offsetX = event.clientX - boundingRect.left;
    const percent = offsetX / boundingRect.width;
    const newTime = percent * audioPlayer.duration;
    audioPlayer.currentTime = newTime;
});

audioPlayer.addEventListener("timeupdate", function() {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = progress + "%";
});

//рассмотреть проблему разных плейлистов
playForwardButton.addEventListener("click", function(event){
    playSong(songNames[(sondId + 1) % songNames.length], (sondId + 1) % songNames.length);
});

playBackButton.addEventListener("click", function(event){
    playSong(songNames[(sondId - 1 + songNames.length) % songNames.length], (sondId - 1 + songNames.length) % songNames.length);
});

window.onload = loadPlaylists;