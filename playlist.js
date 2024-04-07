const urlParams = new URLSearchParams(window.location.search);
const playlistId = urlParams.get('id');

function loadSongs() {
    fetch('http://localhost:5285/Library/GetSongsByPlaylist?playlistId=' + playlistId, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            const songList = document.getElementById('song-list');
            data.forEach(song => {
                const listItem = document.createElement('li');
                listItem.textContent = song.title;
                songList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Ошибка при загрузке песен:', error);
        });
}

window.onload = loadSongs;