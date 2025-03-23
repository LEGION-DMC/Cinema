let hlsInstance = null;
let currentMovies = [];

function initApp() {
    currentMovies = [...movies];
    renderMovies(currentMovies);
    initFilters();
    initSearch();
    initModal();
    initVideoPlayer();
    initMobileMenu();
    initEventListeners();
}

function initEventListeners() {
    document.getElementById('clearSearch').addEventListener('click', clearSearch);
}

function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const filtersMenu = document.querySelector('.filters-menu');
    const backdrop = document.createElement('div');
    backdrop.className = 'menu-backdrop';
    document.body.appendChild(backdrop);

    menuToggle.addEventListener('click', () => {
        filtersMenu.classList.add('active');
        backdrop.style.display = 'block';
    });

    backdrop.addEventListener('click', () => {
        filtersMenu.classList.remove('active');
        backdrop.style.display = 'none';
    });

    document.querySelectorAll('.filter').forEach(filter => {
        filter.addEventListener('click', () => {
            filtersMenu.classList.remove('active');
            backdrop.style.display = 'none';
        });
    });
}

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

function initFilters() {
    document.querySelectorAll('.filter').forEach(filter => {
        filter.addEventListener('click', function() {
            document.querySelector('.filter.active').classList.remove('active');
            this.classList.add('active');
            
            const category = this.dataset.filter;
            currentMovies = category === 'all' 
                ? [...movies] 
                : movies.filter(m => m.category === category);
                
            renderMovies(currentMovies);
        });
    });
}

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        currentMovies = movies.filter(m => 
            m.title.toLowerCase().includes(searchTerm) ||
            (m.subtitle && m.subtitle.toLowerCase().includes(searchTerm))
        );
        renderMovies(currentMovies);
    });
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    currentMovies = [...movies];
    renderMovies(currentMovies);
}

function initModal() {
    const content = document.getElementById('content');
    const modalOverlay = document.getElementById('modalOverlay');

    content.addEventListener('click', handleCardClick);
    modalOverlay.addEventListener('click', handleModalClose);
}

function handleCardClick(e) {
    const card = e.target.closest('.movie-card');
    if (!card) return;

    const movieId = card.dataset.id;
    const movie = movies.find(m => m.id == movieId);
    showModal(movie);
}

function showModal(movie) {
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = generateModalContent(movie);
    document.getElementById('modalOverlay').style.display = 'flex';
}

function generateModalContent(movie) {
    return `
        <div class="modal-close">&times;</div>
        <div class="modal-media">
            <img src="${movie.poster}" class="modal-poster">
            ${movie.trailer ? `
                <a href="${movie.trailer}" target="_blank" class="trailer-button">
                    ▶ Трейлер
                </a>
            ` : ''}
        </div>
        <div class="info">
            <div class="titles">
                <h2>${movie.title}</h2>
                ${movie.subtitle ? `<div class="modal-subtitle">${movie.subtitle}</div>` : ''}
            </div>
            <div class="category-label ${getCategoryClass(movie.category)}">
                ${getCategoryLabel(movie.category)}
            </div>
            ${movie.type === 'riser' ? `
                <div class="release-date-label">Дата выхода: ${movie.releaseDate}</div>
            ` : ''}
            ${movie.description.map(p => `<p>${p}</p>`).join('')}
            ${generateAdditionalContent(movie)}
        </div>
    `;
}

function generateAdditionalContent(movie) {
    switch(movie.type) {
        case 'single': 
            return `<button class="watch-button" onclick="handlePlay('${movie.link}')">Смотреть</button>`;
        case 'seasons':
            return generateSeasonsContent(movie);
        case 'franchise':
            return generateFranchiseContent(movie);
        default: 
            return '';
    }
}

function handleModalClose(e) {
    const modalOverlay = document.getElementById('modalOverlay');
    if (e.target === modalOverlay || e.target.classList.contains('modal-close')) {
        modalOverlay.style.display = 'none';
    }
}

// Video Player Functions
function initVideoPlayer() {
    const video = document.getElementById('hlsVideo');
    const videoPlayer = document.getElementById('videoPlayer');
    const closeBtn = videoPlayer.querySelector('.close-player');

    closeBtn.addEventListener('click', () => {
        videoPlayer.style.display = 'none';
        if (hlsInstance) {
            hlsInstance.destroy();
            hlsInstance = null;
        }
    });
}

window.handlePlay = function(url) {
    if (url.endsWith('.m3u8')) {
        playHLS(url);
    } else {
        window.open(url, '_blank');
    }
};

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

// Helpers
function getCategoryLabel(category) {
    const labels = {
        movie: 'Фильм',
        series: 'Сериал',
        cartoon: 'Мультфильм',
        'animated-series': 'Мультсериал',
        anime: 'Аниме'
    };
    return labels[category] || '';
}

function getCategoryClass(category) {
    const classes = {
        movie: 'category-movie',
        series: 'category-series',
        cartoon: 'category-cartoon',
        'animated-series': 'category-animated-series',
        anime: 'category-anime'
    };
    return classes[category] || '';
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', initApp);
