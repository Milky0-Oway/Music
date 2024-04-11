const id = localStorage.getItem('userId');
const token = localStorage.getItem('token');
const ip = localStorage.getItem('ip');

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
                ref.onclick = () => loadSongs(playlist.id);
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
    document.getElementById("new-playlist").style.display = "none";
    document.getElementById("playlists").style.display = "inline";
}

async function loadSongs(playlistId) {
    await fetch('http://'+ ip +':5285/Library/GetSongsByPlaylist?id=' + playlistId, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            const songList = document.getElementById('song-list');
            data.forEach(song => {
                const listItem = document.createElement('li');
                const songButton = document.createElement('button');
                songButton.textContent = song.name;
                songButton.onclick = () => playSong(song.pathToSong);
                songButton.className = "song-button";
                listItem.appendChild(songButton);
                songList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Ошибка при загрузке песен:', error);
        });
}

async function loadFavouriteSongs(){
    await fetch('http://'+ ip +':5285/Library/GetFavouriteSongs?id=' + id, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            const songList = document.getElementById('song-list');
            data.forEach(song => {
                const listItem = document.createElement('li');
                const songButton = document.createElement('button');
                songButton.textContent = song.name;
                songButton.onclick = () => playSong(song.pathToSong);
                songButton.className = "song-button";
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

async function playSong(name){
    try {
        const response = await fetch('http://'+ ip +':5285/Library/GetAudio?PathToSong=' + name);
        const blob = await response.blob();
        const audioURL = URL.createObjectURL(blob);

        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.src = audioURL;
        audioPlayer.play();
    } catch (error) {
        console.error('Ошибка при воспроизведении аудио:', error);
    }
}

window.onload = loadPlaylists;