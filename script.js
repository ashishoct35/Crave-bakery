document.addEventListener('DOMContentLoaded', async () => {
    // 1. Fetch Content
    let content = {};
    try {
        const response = await fetch('content.json');
        content = await response.json();
    } catch (error) {
        console.error('Failed to load content.json', error);
        return;
    }

    // 2. Global Setup (Nav, Footer, Title)
    document.title = content.site_title;
    setupNavigation(content);
    setupFooter(content);

    // 3. Page Specific Content
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';

    if (page === 'index.html' || page === '') {
        loadHomePage(content);
    } else if (page === 'menu.html') {
        loadMenuPage(content);
    } else if (page === 'locations.html') {
        loadLocationsPage(content);
    } else if (page === 'gallery.html') {
        loadGalleryPage(content);
    } else if (page === 'contact.html') {
        loadContactPage(content);
    }

    // 4. Page Transitions
    setupPageTransitions();
});

function setupNavigation(content) {
    const nav = document.querySelector('nav');
    if (!nav) return;

    // Logo
    const logoContainer = nav.querySelector('.nav-logo');
    if (logoContainer) {
        logoContainer.innerHTML = `
            <a href="index.html" style="display: flex; align-items: center; gap: 1rem;">
                <img src="${content.brand.logo}" alt="${content.site_title}">
                <span class="brand-name" style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 700; color: var(--primary-color);">${content.site_title}</span>
            </a>
        `;
    }

    // Links (Static for now, could be dynamic)
    // We assume HTML has the links structure, or we could inject them.
    // Let's inject them to be safe and consistent.
    const linksContainer = nav.querySelector('.nav-links');
    if (linksContainer) {
        linksContainer.innerHTML = `
            <a href="index.html">Home</a>
            <a href="menu.html">Menu</a>
            <a href="locations.html">Locations</a>
            <a href="gallery.html">Gallery</a>
            <a href="about.html">About</a>
            <a href="contact.html">Contact</a>
        `;
    }

    // Sticky Navbar Logic
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'var(--bg-color)';
                navLinks.style.padding = '1rem';
                navLinks.style.boxShadow = 'var(--shadow)';
            }
        });
    }
}

function setupFooter(content) {
    const footer = document.querySelector('footer');
    if (!footer) return;
    footer.innerHTML = `
        <div class="footer-content">
            <h3>${content.site_title}</h3>
            <p>${content.brand.tagline}</p>
            <div class="social-links">
                ${content.social.facebook ? `<a href="${content.social.facebook}">Facebook</a>` : ''}
                ${content.social.instagram ? `<a href="${content.social.instagram}">Instagram</a>` : ''}
            </div>
            <p>&copy; ${new Date().getFullYear()} ${content.site_title}. All rights reserved.</p>
        </div>
    `;
}

function loadHomePage(content) {
    // Hero
    const featuredOutlet = content.outlets.find(o => o.is_featured) || content.outlets[0];
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroImage = document.getElementById('hero-image');

    if (heroTitle) heroTitle.textContent = featuredOutlet.hero_title;
    if (heroSubtitle) heroSubtitle.textContent = featuredOutlet.hero_subtitle;
    if (heroImage) heroImage.src = featuredOutlet.hero_image;

    // Specials
    const specialsContainer = document.getElementById('specials-grid');
    if (specialsContainer) {
        specialsContainer.innerHTML = content.specials.map(item => `
            <div class="card">
                <div style="position:relative;">
                    <img src="${item.image}" alt="${item.name}" class="card-image">
                    ${item.badge ? `<span class="badge">${item.badge}</span>` : ''}
                </div>
                <div class="card-content">
                    <h3 class="card-title">${item.name}</h3>
                    <p>${item.description}</p>
                    <p class="card-price">${item.price}</p>
                </div>
            </div>
        `).join('');
    }

    // Reviews
    const reviewsContainer = document.getElementById('reviews-grid');
    if (reviewsContainer) {
        reviewsContainer.innerHTML = content.reviews.slice(0, 3).map(review => `
            <div class="review-card" style="background: #fff; padding: 2rem; border-radius: 12px; box-shadow: var(--shadow); font-style: italic;">
                <p>${review}</p>
            </div>
        `).join('');
    }
}

function loadMenuPage(content) {
    // Implementation for menu page
    const menuContainer = document.getElementById('menu-container');
    if (!menuContainer) return;

    // Categories
    const categoriesContainer = document.getElementById('menu-categories');
    if (categoriesContainer) {
        categoriesContainer.innerHTML = content.menu_categories.map(cat => `
            <button class="category-btn" onclick="filterMenu('${cat.slug}')">${cat.name}</button>
        `).join('');
    }

    // Items
    renderMenuItems(content.menu_categories);
}

function renderMenuItems(categories) {
    const grid = document.getElementById('menu-grid');
    if (!grid) return;

    let allItems = [];
    categories.forEach(cat => {
        cat.items.forEach(item => {
            allItems.push({ ...item, category: cat.slug });
        });
    });

    grid.innerHTML = allItems.map(item => `
        <div class="card menu-item" data-category="${item.category}">
            <img src="${item.image}" alt="${item.name}" class="card-image">
            <div class="card-content">
                <h3 class="card-title">${item.name}</h3>
                <p class="card-price">${item.price}</p>
                ${item.tags.map(tag => `<span style="font-size:0.8rem; background:#eee; padding:2px 6px; border-radius:4px; margin-right:4px;">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

window.filterMenu = function (slug) {
    const items = document.querySelectorAll('.menu-item');
    items.forEach(item => {
        if (slug === 'all' || item.dataset.category === slug) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function loadLocationsPage(content) {
    const list = document.getElementById('outlets-list');
    if (!list) return;

    list.innerHTML = content.outlets.map(outlet => `
        <div class="card" style="margin-bottom: 2rem;">
            <div class="card-content">
                <h3 class="card-title">${outlet.name}</h3>
                <p>${outlet.address}</p>
                <p>${outlet.phone}</p>
                <div style="margin-top: 1rem;">
                    ${outlet.google_map_embed.startsWith('<iframe') ? outlet.google_map_embed : `<iframe src="${outlet.google_map_embed}" width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`}
                </div>
            </div>
        </div>
    `).join('');
}

function loadGalleryPage(content) {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    grid.innerHTML = content.gallery.map(item => `
        <div class="gallery-item" onclick="openLightbox('${item.image}', '${item.caption}')" style="cursor:pointer;">
            <img src="${item.image}" alt="${item.caption}" style="width:100%; border-radius:12px;">
        </div>
    `).join('');
}

window.openLightbox = function (src, caption) {
    // Simple lightbox implementation
    const lightbox = document.createElement('div');
    lightbox.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:10000;display:flex;justify-content:center;align-items:center;flex-direction:column;';
    lightbox.innerHTML = `
        <img src="${src}" style="max-width:90%;max-height:80vh;border-radius:8px;">
        <p style="color:white;margin-top:1rem;">${caption}</p>
        <button onclick="this.parentElement.remove()" style="position:absolute;top:20px;right:20px;background:none;border:none;color:white;font-size:2rem;cursor:pointer;">&times;</button>
    `;
    document.body.appendChild(lightbox);
}


// Image Error Handling
window.addEventListener('error', function (e) {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'https://placehold.co/600x400?text=Crave+Bakery';
        e.target.alt = 'Image not found';
    }
}, true);
