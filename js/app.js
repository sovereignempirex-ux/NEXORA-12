/* ===================== NEXORA APP =====================
 * Main Application Logic
 * PWA, Search, Animations, Interactions
 * ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    initParticles();
    initNavigation();
    initSearch();
    initServices();
    initStats();
    initScrollReveal();
    initContactForm();
    initPWA();
    initSmoothScroll();
}

// ====== PARTICLES ======
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 4 + 2;
        const left = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 15;
        const opacity = Math.random() * 0.5 + 0.2;

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            animation-duration: ${duration}s;
            animation-delay: ${delay}s;
            opacity: ${opacity};
            background: ${Math.random() > 0.5 ? 'rgba(99, 102, 241, 0.5)' : 'rgba(236, 72, 153, 0.4)'};
        `;

        container.appendChild(particle);
    }
}

// ====== NAVIGATION ======
function initNavigation() {
    const nav = document.querySelector('.glass-nav');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Update active link
        updateActiveLink();
    });

    // Mobile menu
    menuToggle?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Close menu on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuToggle?.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });
}

function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ====== SEARCH ======
function initSearch() {
    const searchInput = document.getElementById('mainSearch');
    const searchBtn = document.getElementById('searchBtn');
    const tags = document.querySelectorAll('.tag');
    const resultsSection = document.getElementById('searchResultsSection');
    const resultsGrid = document.getElementById('searchResultsGrid');
    const searchQuery = document.getElementById('searchQuery');
    const clearBtn = document.getElementById('clearSearch');

    let searchTimeout;

    // Input search with debounce
    searchInput?.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => performSearch(e.target.value), 300);
    });

    // Button search
    searchBtn?.addEventListener('click', () => {
        performSearch(searchInput.value);
    });

    // Enter key
    searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });

    // Tag click
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            const searchTerm = tag.dataset.search;
            searchInput.value = searchTerm;
            performSearch(searchTerm);
        });
    });

    // Clear search
    clearBtn?.addEventListener('click', () => {
        searchInput.value = '';
        resultsSection.style.display = 'none';
        document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
    });
}

function performSearch(query) {
    const resultsSection = document.getElementById('searchResultsSection');
    const resultsGrid = document.getElementById('searchResultsGrid');
    const searchQuery = document.getElementById('searchQuery');

    if (!query || query.trim().length < 2) {
        resultsSection.style.display = 'none';
        return;
    }

    const results = NEXORA_DB.search(query);

    searchQuery.textContent = query;
    resultsGrid.innerHTML = '';

    if (results.length === 0) {
        resultsGrid.innerHTML = `
            <div class="result-card glass" style="grid-column: 1/-1; text-align:center;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                <h4>لا توجد نتائج</h4>
                <p>جرب كلمات مختلفة مثل: برمجة، أنمي، معلومات</p>
            </div>
        `;
    } else {
        results.forEach(result => {
            const card = document.createElement('div');
            card.className = 'result-card glass fade-in';

            if (result.type === 'خدمة') {
                card.innerHTML = `
                    <div style="display:flex; align-items:center; gap:0.8rem; margin-bottom:0.8rem;">
                        <div style="width:40px;height:40px;border-radius:8px;background:${result.color};display:flex;align-items:center;justify-content:center;color:white;">
                            <i class="fas ${result.icon}"></i>
                        </div>
                        <div>
                            <h4>${result.title}</h4>
                            <span class="result-type">${result.category}</span>
                        </div>
                    </div>
                    <p>${result.description}</p>
                `;
            } else {
                card.innerHTML = `
                    <div style="display:flex; align-items:center; gap:0.8rem; margin-bottom:0.8rem;">
                        <div style="width:40px;height:40px;border-radius:8px;background:linear-gradient(135deg, var(--primary), var(--secondary));display:flex;align-items:center;justify-content:center;color:white;">
                            <i class="fas fa-link"></i>
                        </div>
                        <div>
                            <h4>${result.title}</h4>
                            <span class="result-type">رابط</span>
                        </div>
                    </div>
                    <p>${result.desc}</p>
                    <a href="${result.url}" target="_blank" style="color:var(--primary-light);text-decoration:none;font-size:0.85rem;margin-top:0.5rem;display:inline-block;">
                        زيارة <i class="fas fa-arrow-left" style="margin-right:0.3rem;"></i>
                    </a>
                `;
            }

            resultsGrid.appendChild(card);
        });
    }

    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ====== SERVICES ======
function initServices() {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;

    const services = NEXORA_DB.data.services;

    services.forEach((service, index) => {
        const card = document.createElement('div');
        card.className = 'service-card glass reveal';
        card.style.transitionDelay = `${index * 50}ms`;

        card.innerHTML = `
            <span class="service-category">${service.category}</span>
            <div class="service-icon" style="background: linear-gradient(135deg, ${service.color}, ${service.color}88);">
                <i class="fas ${service.icon}"></i>
            </div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
        `;

        grid.appendChild(card);
    });
}

// ====== STATS COUNTER ======
function initStats() {
    const statNumbers = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);

        element.textContent = current.toLocaleString('ar-SA');

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString('ar-SA') + '+';
        }
    }

    requestAnimationFrame(update);
}

// ====== SCROLL REVEAL ======
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));

    // Also observe stat cards and about cards
    document.querySelectorAll('.stat-card, .about-card, .link-card').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

// ====== CONTACT FORM ======
function initContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const subject = document.getElementById('contactSubject').value;
        const message = document.getElementById('contactMessage').value.trim();

        if (!name || !email || !message) {
            showFormStatus('error', 'يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        // Save to DB
        const contact = { name, email, subject, message };
        NEXORA_DB.saveContact(contact);

        // Show success
        showFormStatus('success', 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً');
        showToast('تم إرسال الرسالة بنجاح!', 'success');

        // Reset form
        form.reset();

        // Also send to external service (example)
        // await sendToExternalAPI(contact);
    });
}

function showFormStatus(type, message) {
    const status = document.getElementById('formStatus');
    status.className = `form-status ${type}`;
    status.textContent = message;
    status.style.display = 'block';

    setTimeout(() => {
        status.style.display = 'none';
    }, 5000);
}

// ====== TOAST ======
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };

    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ====== PWA ======
function initPWA() {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('[PWA] Service Worker registered'))
            .catch(err => console.warn('[PWA] Service Worker failed:', err));
    }

    // Install prompt
    let deferredPrompt;
    const installBtn = document.getElementById('installPwa');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installBtn.style.display = 'flex';
    });

    installBtn?.addEventListener('click', async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            showToast('تم تثبيت التطبيق بنجاح!', 'success');
        }

        deferredPrompt = null;
        installBtn.style.display = 'none';
    });

    window.addEventListener('appinstalled', () => {
        showToast('شكراً لتثبيت NEXORA!', 'success');
        installBtn.style.display = 'none';
        deferredPrompt = null;
    });
}

// ====== SMOOTH SCROLL ======
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ====== EXTERNAL API EXAMPLE ======
/*
async function sendToExternalAPI(data) {
    try {
        const response = await fetch('https://api.nexora.netlify.app/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
    }
}
*/

// ====== KEYBOARD SHORTCUTS ======
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('mainSearch')?.focus();
    }

    // Escape to clear search
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('mainSearch');
        if (searchInput && searchInput.value) {
            searchInput.value = '';
            document.getElementById('searchResultsSection').style.display = 'none';
        }
    }
});
