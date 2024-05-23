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
const searchButton = document.getElementById("search-button");
const favouriteButton = document.getElementById("favouriteButton");
const songName = document.getElementById("song-name");
const songAuthor = document.getElementById("song-author");
const uploadButton = document.getElementById("upload-music-button");
const buttons = document.getElementById("audio-buttons");

let songNames = [];
let sondId = -1;
let playlists = new Map();
let keys = [];
let favouriteSongs = [];

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
                playlists.set(playlist.id, playlist.name);
                keys.push(playlist.id);
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
            playlists.set(data.id, data.name);
            keys.push(data.id);
        })
        .catch(error => {
            console.error('Ошибка:', error);
            errorContainer.textContent = "Произошла ошибка";
        });
    cancelPlaylist();
}

function cancelPlaylist(){
    const playlists = document.querySelector("#playlists");
    const newPlaylist = document.querySelector("#new-playlist");
    const search = document.querySelector("#search");
    const uploadMusic = document.querySelector("#upload-music");
    newPlaylist.style.display = "none";
    playlists.style.display = "block";
    search.style.display = "none";
    uploadMusic.style.display = "none";
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
                songButton.textContent = song.authors + ' - ' + song.song.name;
                songButton.onclick = () => playSong(song.song.pathToSong, song.song.id-1, song.song.name, song.authors);
                songButton.className = "song-button";
                songNames.push(song.song.pathToSong);
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
    favouriteSongs = [];

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
                songButton.textContent = song.authors + ' - ' + song.song.name;
                songButton.onclick = () => playSong(song.song.pathToSong, song.song.id-1, song.song.name, song.authors);
                songButton.className = "song-button";
                songNames.push(song.song.pathToSong);
                favouriteSongs.push(song.song);
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
    document.getElementById("search").style.display = "none";
    document.getElementById("upload-music").style.display = "none";
}

searchButton.addEventListener("click", () => {
    document.getElementById("search").style.display = "inline";
    document.getElementById("playlists").style.display = "none";
    document.getElementById("new-playlist").style.display = "none";
    document.getElementById("upload-music").style.display = "none";
});

uploadButton.addEventListener("click", () => {
    document.getElementById("upload-music").style.display = "inline";
    document.getElementById("playlists").style.display = "none";
    document.getElementById("search").style.display = "none";
    document.getElementById("new-playlist").style.display = "none";
});

document.getElementById('uploadForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(document.getElementById('uploadForm'));
    formData.append('authorId', id);
    formData.append('albumName', 'Nevermind');
    const uploadUrl = `http://${ip}:5285/Library/UploadMusic`;

    fetch(uploadUrl, {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Ошибка при загрузке музыки');
            }
        })
        .then(data => {
            console.log('Музыка успешно загружена:', data);
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
});

async function playSong(path, id, name, author){
    sondId = id;
    try {
        const response = await fetch('http://'+ ip +':5285/Library/GetAudio?PathToSong=' + path);
        const blob = await response.blob();
        const audioURL = URL.createObjectURL(blob);

        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.src = audioURL;
        audioPlayer.play();
        songName.textContent = name;
        console.log(name);
        console.log(author);
        songAuthor.textContent = author;
        playButton.style.display = "none";
        pauseButton.style.display = "inline";

        const addToPlaylistButton = document.createElement('button');
        addToPlaylistButton.textContent = "+";
        addToPlaylistButton.className = "add-to-playlist-button";
        addToPlaylistButton.onclick = () => addToPlaylist(sondId+1, buttons);
        buttons.appendChild(addToPlaylistButton);

        updateFavouriteButton(id);
    } catch (error) {
        console.error('Ошибка при воспроизведении аудио:', error);
    }
}

function updateFavouriteButton(songId){
    const isFavourite = favouriteSongs.some(song => song.id === songId+1);
    if (isFavourite) {
        favouriteButton.innerHTML = '<ion-icon name="heart"></ion-icon>'; // Залитое сердечко
    } else {
        favouriteButton.innerHTML = '<ion-icon name="heart-outline"></ion-icon>'; // Незалитое сердечко
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

playForwardButton.addEventListener("click", function(event){
    playSong(songNames[(sondId + 1) % songNames.length], (sondId + 1) % songNames.length);
});

playBackButton.addEventListener("click", function(event){
    playSong(songNames[(sondId - 1 + songNames.length) % songNames.length], (sondId - 1 + songNames.length) % songNames.length);
});

favouriteButton.addEventListener("click", function(event){
    const isFavourite = favouriteSongs.some(song => song.id === sondId + 1);

    if (isFavourite) {
        removeFromFavourite(sondId);
    } else {
        addToFavourite(sondId);
    }
});

function searchMusic() {
    const searchInput = document.getElementById("searchInput").value;
    const searchResults = document.getElementById("searchResults");

    searchResults.innerHTML = "";

    fetch(`http://${ip}:5285/Library/FindSongByName?name=${encodeURIComponent(searchInput)}`, {
        method: 'GET'
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Ошибка при поиске музыки');
            }
        })
        .then(data => {
            data.data.forEach(song => {
                const resultItem = document.createElement('div');
                resultItem.innerHTML = `
                <p>${song.name}</p>
                <button onclick="addToPlaylist(${song.id}, this.parentNode)">+</button>
            `;
                searchResults.appendChild(resultItem);
            });
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
}

function addToPlaylist(songId, song) {
    const select = document.createElement('select');
    const item0 = document.createElement('option');
    item0.text = "Выберите плейлист";
    select.appendChild(item0);
    for (let [key, value] of playlists) {
        const item = document.createElement('option');
        item.text = value;
        select.appendChild(item);
    }

    select.addEventListener('change', function() {
        const selectedOption = this.selectedIndex;
        hideDropdown();
        const formData = new FormData();
        console.log(keys[selectedOption]);
        formData.append('playlistId', (keys[selectedOption]+keys.length-1)%keys.length);
        formData.append('songId', songId);
        fetch('http://'+ ip +':5285/Library/AddSongToPlaylist', {
            method: 'PUT',
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Ошибка при поиске музыки');
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
            });
    });


    song.appendChild(select);
}

function hideDropdown() {
    const select = document.querySelector('select');
    select.remove();
}

function addToFavourite(songId) {
    const formData = new FormData();
    formData.append('userId', id);
    formData.append('songId', songId + 1);
    fetch('http://' + ip + ':5285/Library/AddSongToFavouriteSongs', {
        method: 'PUT',
        body: formData
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Ошибка при добавлении музыки в любимое:', error);
        });
    favouriteSongs.push({ id: songId + 1 });
    updateFavouriteButton(songId);
}

function removeFromFavourite(songId){
    const formData = new FormData();
    formData.append('userId', id);
    formData.append('songId', songId+1);
    fetch('http://'+ ip +':5285/Library/DeleteSongFromFavourite', {
        method: 'DELETE',
        body: formData
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Ошибка при удалении музыки из любимого:', error);
        });
    favouriteSongs = favouriteSongs.filter(song => song.id !== songId + 1);
    updateFavouriteButton(songId);
}

window.onload = loadPlaylists;