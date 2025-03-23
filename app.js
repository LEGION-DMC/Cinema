let hlsInstance = null;

function initVideoPlayer() {
    const videoPlayer = document.getElementById('videoPlayer');
    const video = document.getElementById('hlsVideo');
    const closeBtn = document.querySelector('.close-player');

    closeBtn.addEventListener('click', () => {
        videoPlayer.style.display = 'none';
        if (hlsInstance) {
            hlsInstance.destroy();
            hlsInstance = null;
        }
    });
}

function playHLS(url) {
    const video = document.getElementById('hlsVideo');
    const videoPlayer = document.getElementById('videoPlayer');
    
    if (hlsInstance) {
        hlsInstance.destroy();
    }

    if (Hls.isSupported()) {
        hlsInstance = new Hls();
        hlsInstance.loadSource(url);
        hlsInstance.attachMedia(video);
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
            videoPlayer.style.display = 'block';
            video.play();
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        videoPlayer.style.display = 'block';
        video.play();
    }
}

window.handlePlay = function(url) {
    if (url.endsWith('.m3u8')) {
        playHLS(url);
    } else {
        window.open(url, '_blank');
    }
};

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    renderMovies(movies);
    initFilters();
    initSearch();
    initModal();
	initVideoPlayer(); // Добавить эту строку
});

// Рендер карточек
function renderMovies(data) {
    const content = document.getElementById('content');
    content.innerHTML = data.map(movie => `
        <div class="movie-card ${movie.type === 'riser' ? 'riser' : ''}" data-id="${movie.id}">
            <img src="${movie.poster}" class="movie-poster" alt="${movie.title}">
            ${movie.type === 'riser' ? `
                <div class="poster-overlay">
                    <div class="coming-soon">Скоро</div>
                </div>
            ` : ''}
            <div class="titles">
                <div class="movie-title">${movie.title}</div>
                ${movie.subtitle ? `<div class="movie-subtitle">${movie.subtitle}</div>` : ''}
            </div>
        </div>
    `).join('');
}

// Фильтрация
function initFilters() {
    document.querySelectorAll('.filter').forEach(filter => {
        filter.addEventListener('click', () => {
            document.querySelector('.filter.active').classList.remove('active');
            filter.classList.add('active');
            const category = filter.dataset.filter;
            const filtered = category === 'all' 
                ? movies 
                : movies.filter(m => m.category === category);
            renderMovies(filtered);
        });
    });
}

// Поиск
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = movies.filter(m => 
            m.title.toLowerCase().includes(searchTerm)
        );
        renderMovies(filtered);
    });

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        renderMovies(movies);
    });
}

// Модальное окно
function initModal() {
    const content = document.getElementById('content');
    const modalOverlay = document.getElementById('modalOverlay');

    content.addEventListener('click', (e) => {
        const card = e.target.closest('.movie-card');
        if (card) {
            const movieId = card.dataset.id;
            const movie = movies.find(m => m.id == movieId);
            showModal(movie);
        }
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay || e.target.classList.contains('modal-close')) {
            modalOverlay.style.display = 'none';
        }
    });
}

function showModal(movie) {
    const modalContent = document.getElementById('modalContent');
    let html = `
        <div class="modal-close">&times;</div>
        <div class="modal-media">
            <img src="${movie.poster}" class="modal-poster">
            ${movie.trailer ? `
                <a href="${movie.trailer}" 
                   target="_blank" 
                   class="trailer-button">
                    ▶ Трейлер
                </a>
            ` : ''}
        </div>
        <div class="info">
            <div class="titles">
                <h2>${movie.title}</h2>
                ${movie.subtitle ? `<div class="modal-subtitle">${movie.subtitle}</div>` : ''}
            </div>
            <div class="category-label">${getCategoryLabel(movie.category)}</div>
    `;

    // Описание
    html += movie.description.map(p => `<p>${p}</p>`).join('');

    if (movie.type === 'riser') {
        html += `<div class="release-date-label">Дата выхода: ${movie.releaseDate}</div>`;
    }

    // Кнопки просмотра
    if (movie.type === 'single') {
        html += `<button class="watch-button" onclick="handlePlay('${movie.link}')">Смотреть</button>`;
    } else if (movie.type === 'seasons') {
        html += '<div class="seasons-container">';
        movie.seasons.forEach(season => {
            html += `
                <div class="season">
                    <h4>Сезон ${season.season}</h4>
                    <div class="episodes">
                        ${season.episodes.map(ep => `
                            <button class="episode-button" 
                                onclick="handlePlay('${ep.link}')">
                                ${ep.num}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        html += '</div>';
    } else if (movie.type === 'franchise') {
        html += `
            <div class="franchise-container">
                ${movie.parts.map(part => `
                    <button class="part-button" 
                        onclick="handlePlay('${part.link}')">
                        ${part.name}
                    </button>
                `).join('')}
            </div>
        `;
    }

    html += '</div>';
    modalContent.innerHTML = html;
    modalOverlay.style.display = 'flex';
}
