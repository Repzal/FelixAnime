const animeList = window.ANIME_LIST;
const animeListDiv = document.getElementById('animeList');
const animeDetailDiv = document.getElementById('animeDetail');
const searchBar = document.getElementById('searchBar');

function renderAnimeList(filter = '') {
  animeListDiv.innerHTML = '';
  animeDetailDiv.style.display = 'none';
  animeListDiv.style.display = 'flex';

  let filtered = animeList.map(anime => ({
    ...anime,
    episodes: anime.episodes.filter(ep =>
      ep.title.toLowerCase().includes(filter.toLowerCase())
    )
  }));

  // Filter by anime title OR episode title
  filtered = filtered.filter(anime =>
    anime.title.toLowerCase().includes(filter.toLowerCase()) ||
    anime.episodes.length > 0
  );

  if (filtered.length === 0) {
    animeListDiv.innerHTML = "<p>No anime found.</p>";
    return;
  }

  filtered.forEach(anime => {
    const card = document.createElement('div');
    card.className = 'anime-card';
    card.onclick = () => renderAnimeDetail(anime, filter);

    const img = document.createElement('img');
    img.src = anime.image;
    img.alt = anime.title;
    card.appendChild(img);

    const info = document.createElement('div');
    info.innerHTML = `<h3>${anime.title}</h3><p>${anime.description}</p>`;
    card.appendChild(info);

    animeListDiv.appendChild(card);
  });
}

function renderAnimeDetail(anime, filter = '') {
  animeListDiv.style.display = 'none';
  animeDetailDiv.style.display = 'block';

  let episodes = anime.episodes
    .filter(ep =>
      ep.title.toLowerCase().includes(filter.toLowerCase()) ||
      anime.title.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => a.episodeNumber - b.episodeNumber);

  animeDetailDiv.innerHTML = `
    <button class="back-btn" onclick="window.location.reload()">Back</button>
    <h2>${anime.title}</h2>
    <img src="${anime.image}" alt="${anime.title}" style="width:120px;height:170px;border-radius:6px;">
    <p>${anime.description}</p>
    <h3>Episodes</h3>
    <ul id="episodeList">
      ${episodes.map(ep => `
        <li>
          Episode ${ep.episodeNumber}: ${ep.title} <br>
          <button class="play-btn" data-video="${ep.videoUrl}" data-title="${ep.title}">Play</button>
        </li>
      `).join('')}
    </ul>
    <div id="videoPlayerContainer"></div>
  `;

  // Add event listeners for play buttons
  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const videoUrl = this.getAttribute('data-video');
      const epTitle = this.getAttribute('data-title');
      showVideoPlayer(videoUrl, anime.title, epTitle);
    });
  });
}

// Show/hide video player
function showVideoPlayer(url, animeTitle, epTitle) {
  const container = document.getElementById('videoPlayerContainer');
  container.innerHTML = `
    <div class="video-player-box">
      <h4>${animeTitle} - ${epTitle}</h4>
      <video controls autoplay width="100%" height="auto" class="video-player">
        <source src="${url}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <button class="close-video-btn" onclick="document.getElementById('videoPlayerContainer').innerHTML = '';">Close Player</button>
    </div>
  `;
}

// Search functionality
searchBar.addEventListener('input', e => {
  renderAnimeList(e.target.value);
});

// Initial render
renderAnimeList();
