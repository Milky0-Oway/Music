const id = localStorage.getItem('userId');
const token = localStorage.getItem('token');

async function loadPlaylists() {
    await fetch('http://192.168.1.106:5285/Library/GetPlaylistsByUser?id=' + id, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(async data => {
            const playlistList = document.getElementById('playlist-list');
            for (const playlist of data) {
                const listItem = document.createElement('li');
                const ref = document.createElement('a');
                const img = document.createElement('img');
                const text = document.createElement('p');
                await fetch('http://192.168.1.106:5285/Library/GetImage?PathToImage=' + playlist.pathToImage, {
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
                ref.href = 'playlist.html?id=' + playlist.id;
                listItem.appendChild(ref);
                listItem.className = "playlist-ref";
                playlistList.appendChild(listItem);
            }
        })
        .catch(error => {
            console.error('Ошибка при загрузке плейлистов:', error);
        });
}

window.onload = loadPlaylists;