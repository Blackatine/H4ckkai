let currentSlide = 0;
let newsItems = [];
let autoSlideInterval;

// Cache DOM elements
const newsGrid = document.querySelector('.news-grid');
let newsCache = new Map();
let lastFetch = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// News handling functionality
const NEWS_REFRESH_INTERVAL = 1800000; // 30 minutes

// Loading spinner HTML
const LOADING_HTML = `
    <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Fetching latest cybersecurity news...</p>
    </div>
`;

// Error message HTML
const ERROR_HTML = `
    <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Unable to load latest news. Please try again later.</p>
        <button onclick="fetchNews()" class="retry-btn">Retry</button>
    </div>
`;

// Format the published date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // Convert milliseconds to hours
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    if (hours < 48) return 'Yesterday';
    return date.toLocaleDateString();
}

// Create HTML for a news card
function createNewsCard(article) {
    return `
        <div class="news-card">
            <div class="card-image">
                <img src="${article.image}" 
                     alt="${article.title}" 
                     loading="lazy"
                     onerror="this.src='https://images.unsplash.com/photo-1550751827-4bd374c3f58b'">
            </div>
            <div class="card-content">
                <h3 class="card-title">${article.title}</h3>
                <p class="card-description">${article.description || ''}</p>
                <div class="card-meta">
                    <span class="publish-date">${formatDate(article.published_at)}</span>
                    <span class="source">${article.source}</span>
                </div>
                <a href="${article.url}" target="_blank" class="read-more-btn">Read Full Article</a>
            </div>
        </div>
    `;
}

// Fetch and display news
async function fetchNews() {
    const newsGrid = document.querySelector('.news-grid');
    if (!newsGrid) return;
    
    // Show loading state
    newsGrid.innerHTML = LOADING_HTML;
    
    try {
        const response = await fetch('/api/news');
        if (!response.ok) throw new Error('Failed to fetch news');
        
        const data = await response.json();
        if (!data.success) throw new Error(data.error || 'Failed to fetch news');
        
        // Generate HTML for all articles
        const newsHTML = data.articles
            .map(article => createNewsCard(article))
            .join('');
        
        // Update the grid
        newsGrid.innerHTML = newsHTML || ERROR_HTML;
        
        // Store in localStorage
        localStorage.setItem('cybersecurity_news', JSON.stringify({
            articles: data.articles,
            timestamp: new Date().getTime()
        }));
        
    } catch (error) {
        console.error('Error fetching news:', error);
        newsGrid.innerHTML = ERROR_HTML;
    }
}

// Initialize news section
function initNews() {
    // Try to load from localStorage first
    const cached = localStorage.getItem('cybersecurity_news');
    if (cached) {
        const { articles, timestamp } = JSON.parse(cached);
        const age = new Date().getTime() - timestamp;
        
        // If cache is less than 30 minutes old, use it
        if (age < NEWS_REFRESH_INTERVAL) {
            const newsGrid = document.querySelector('.news-grid');
            if (newsGrid) {
                newsGrid.innerHTML = articles
                    .map(article => createNewsCard(article))
                    .join('');
            }
        }
    }
    
    // Fetch fresh news
    fetchNews();
    
    // Set up auto-refresh
    setInterval(fetchNews, NEWS_REFRESH_INTERVAL);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initNews);

// Optimize image loading
function loadImage(img) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                img.src = img.dataset.src;
                img.onload = () => img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, { rootMargin: '50px' });
    
    observer.observe(img);
}

// Create news card with optimized rendering
function createNewsCard(article) {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.onclick = () => card.classList.toggle('flipped');
    
    const imageUrl = article.urlToImage || 'https://via.placeholder.com/400x200';
    
    card.innerHTML = `
        <div class="card-front">
            <div class="card-image">
                <img data-src="${imageUrl}" alt="${article.title}" loading="lazy" decoding="async">
            </div>
            <h3 class="card-title">${article.title}</h3>
            <p class="card-preview">${article.description || ''}</p>
        </div>
        <div class="card-back">
            <div class="card-content">
                <p class="card-description">${article.content || article.description || ''}</p>
                <div class="card-meta">
                    <span class="publish-date">${new Date(article.publishedAt).toRelativeTime()}</span>
                    <span class="source">${article.source.name}</span>
                </div>
                <a href="${article.url}" class="read-more-btn" target="_blank" rel="noopener noreferrer">Read Full Article</a>
            </div>
        </div>
    `;
    
    // Optimize image loading
    const img = card.querySelector('img');
    loadImage(img);
    
    return card;
}

// Add relative time formatting
Date.prototype.toRelativeTime = function() {
    const now = new Date();
    const diff = now - this;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
};

// Initialize news section with performance optimization
async function initNews() {
    const fragment = document.createDocumentFragment();
    const news = await fetchNews();
    
    // Clear existing content
    while (newsGrid.firstChild) {
        newsGrid.removeChild(newsGrid.firstChild);
    }
    
    // Batch DOM updates
    news.forEach(article => {
        fragment.appendChild(createNewsCard(article));
    });
    
    newsGrid.appendChild(fragment);
}

// Update news periodically
let updateInterval;
function startNewsUpdates() {
    // Clear existing interval if any
    if (updateInterval) clearInterval(updateInterval);
    
    // Update news every 5 minutes
    updateInterval = setInterval(initNews, CACHE_DURATION);
}

// Initialize with error handling
document.addEventListener('DOMContentLoaded', () => {
    initNews().catch(console.error);
    startNewsUpdates();
});

// Cleanup on page unload
window.addEventListener('unload', () => {
    if (updateInterval) clearInterval(updateInterval);
});

// Display news in the slider
function displayNews() {
    const container = document.getElementById('newsContainer');
    container.innerHTML = '';
    
    newsItems.forEach((item, index) => {
        const newsItem = document.createElement('div');
        newsItem.className = `news-item ${index === currentSlide ? 'active' : ''}`;
        
        const publishedDate = new Date(item.publishedAt);
        const formattedDate = publishedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        newsItem.innerHTML = `
            <h3>${item.title}</h3>
            <div class="news-content">
                <p>${item.description}</p>
            </div>
            <div class="news-meta">
                <span class="source">${item.source.name}</span>
                <time>${formattedDate}</time>
            </div>
            <a href="${item.url}" target="_blank" class="read-more">
                Read Full Article <i class="fas fa-external-link-alt"></i>
            </a>
            <div class="progress-bar"></div>
        `;
        
        container.appendChild(newsItem);
    });
    
    startProgressBar();
}

function createIndicators() {
    const indicatorsContainer = document.getElementById('slideIndicators');
    indicatorsContainer.innerHTML = '';
    
    newsItems.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = `indicator ${index === currentSlide ? 'active' : ''}`;
        indicator.onclick = () => showSlide(index);
        indicatorsContainer.appendChild(indicator);
    });
}

function showSlide(index) {
    const items = document.querySelectorAll('.news-item');
    items.forEach(item => item.classList.remove('active'));
    
    currentSlide = (index + newsItems.length) % newsItems.length;
    items[currentSlide].classList.add('active');
    
    // Reset and start progress bar
    resetProgressBar();
    startProgressBar();
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function startProgressBar() {
    const progressBar = document.querySelector('.news-item.active .progress-bar');
    if (progressBar) {
        progressBar.style.width = '0%';
        setTimeout(() => {
            progressBar.style.width = '100%';
        }, 50);
    }
}

function resetProgressBar() {
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => bar.style.width = '0%');
}

function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(nextSlide, 6000); // 6 seconds per slide
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize news display
    fetchNews();
    startAutoSlide();

    // Pause auto-slide on hover
    const slider = document.querySelector('.news-slider');
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
}); 
function updateSlidePosition() {
    const container = document.getElementById('newsContainer');
    container.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update active classes
    document.querySelectorAll('.news-item').forEach((item, index) => {
        item.classList.toggle('active', index === currentSlide);
    });
    
    document.querySelectorAll('.indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

// Auto-slide with pause on hover
let slideInterval = setInterval(nextSlide, 6000);

document.querySelector('.news-slider').addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

document.querySelector('.news-slider').addEventListener('mouseleave', () => {
    slideInterval = setInterval(nextSlide, 6000);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
});

// Initialize news on page load
document.addEventListener('DOMContentLoaded', fetchNews); 