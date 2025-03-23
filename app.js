// Инициализация приложения
function initApp() {
    renderMovies(movies);
    initFilters();
    initSearch();
    initModal();
    initMobileMenu();
}

// Мобильное меню
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const filters = document.querySelector('.filters');
    const overlay = document.querySelector('.filters-overlay');

    if (menuBtn && filters && overlay) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            filters.classList.toggle('active');
            overlay.style.display = 'block';
        });

        overlay.addEventListener('click', () => {
            filters.classList.remove('active');
            overlay.style.display = 'none';
        });
    }
}

// Фильтрация
function initFilters() {
    const filtersContainer = document.querySelector('.filters');
    
    filtersContainer.innerHTML = Object.entries(categories)
        .map(([key, value]) => `
            <div class="filter" data-filter="${key}">${value.label}</div>
        `).join('');

    const firstFilter = filtersContainer.querySelector('.filter');
    if (firstFilter) firstFilter.classList.add('active');

    filtersContainer.addEventListener('click', (e) => {
        const filter = e.target.closest('.filter');
        if (!filter) return;

        const activeFilter = document.querySelector('.filter.active');
        if (activeFilter) activeFilter.classList.remove('active');
        
        filter.classList.add('active');
        const category = filter.dataset.filter;
        const filtered = category === 'all' ? movies : movies.filter(m => m.category === category);
        renderMovies(filtered);
    });
}

// Рендер карточек
function renderMovies(data) {
    const content = document.getElementById('content');
    if (!content) return;

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

// Поиск
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');

    if (searchInput && clearBtn) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = movies.filter(m => m.title.toLowerCase().includes(searchTerm));
            renderMovies(filtered);
        });

        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            renderMovies(movies);
        });
    }
}

// Модальное окно
function initModal() {
    const content = document.getElementById('content');
    const modalOverlay = document.getElementById('modalOverlay');

    if (content && modalOverlay) {
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
}

function showModal(movie) {
    const modalContent = document.getElementById('modalContent');
    const modalOverlay = document.getElementById('modalOverlay');
    if (!modalContent || !modalOverlay) return;

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
            <div class="category-label ${getCategoryClass(movie.category)}">
                ${getCategoryLabel(movie.category)}
            </div>
            ${movie.description.map(p => `<p>${p}</p>`).join('')}
    `;

    if (movie.type === 'riser') {
        html += `<div class="release-date-label">Дата выхода: ${movie.releaseDate}</div>`;
    }

    if (movie.type === 'single') {
        html += `<button class="watch-button" onclick="window.open('${movie.link}', '_blank')">Смотреть</button>`;
    } else if (movie.type === 'seasons') {
        html += '<div class="seasons-container">';
        movie.seasons.forEach(season => {
            html += `
                <div class="season">
                    <h4>Сезон ${season.season}</h4>
                    <div class="episodes">
                        ${season.episodes.map(ep => `
                            <button class="episode-button" 
                                onclick="window.open('${ep.link}', '_blank')">
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
                        onclick="window.open('${part.link}', '_blank')">
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

// Вспомогательные функции
function getCategoryLabel(category) {
    return categories[category]?.label || '';
}

function getCategoryClass(category) {
    return categories[category]?.class || '';
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', initApp);

// Глобальные обработчики
window.handlePlay = function(url) {
    if (url) window.open(url, '_blank');
};
