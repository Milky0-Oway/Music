const id = localStorage.getItem('userId');
const token = localStorage.getItem('token');

function loadPlaylists() {
    fetch('http://localhost:5285/Library/GetPlaylistsByUser?id=' + id, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            const playlistList = document.getElementById('playlist-list');
            data.forEach(playlist => {
                const listItem = document.createElement('li');
                const ref = document.createElement('a');
                const img = document.createElement('img');
                const text = document.createElement('p');
                img.src=playlist.pathToImage;
                img.alt='playlist image';
                img.className='playlist-image';
                ref.appendChild(img);
                text.textContent = playlist.name;
                text.className='playlist-name';
                ref.appendChild(text);
                ref.href = 'playlist.html?id=' + playlist.id;
                listItem.appendChild(ref);
                listItem.className = "playlist-ref";
                playlistList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Ошибка при загрузке плейлистов:', error);
        });
}

window.onload = loadPlaylists;