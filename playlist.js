const urlParams = new URLSearchParams(window.location.search);
const playlistId = urlParams.get('id');

async function loadSongs() {
    await fetch('http://192.168.1.106:5285/Library/GetSongsByPlaylist?id=' + playlistId, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            const songList = document.getElementById('song-list');
            data.forEach(song => {
                const listItem = document.createElement('li');
                const songButton = document.createElement('button');
                songButton.textContent = song.name;
                songButton.onclick = () =>playSong(song.pathToSong);
                songButton.className="song-button";
                listItem.appendChild(songButton);
                songList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Ошибка при загрузке песен:', error);
        });
}

async function playSong(name){
    try {
        const response = await fetch('http://192.168.1.106:5285/Library/GetAudio?PathToSong=' + name);
        const blob = await response.blob();
        const audioURL = URL.createObjectURL(blob);

        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.src = audioURL;
        audioPlayer.play();
    } catch (error) {
        console.error('Ошибка при воспроизведении аудио:', error);
    }
}

window.onload = loadSongs;