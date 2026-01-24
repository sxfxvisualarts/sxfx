/* ============================================
   SXFX PLUGINS - INTERACTIVE JAVASCRIPT
   ============================================ */

// ============================================
// PARTICLE SYSTEM
// ============================================
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.colors = ['#a855f7', '#06b6d4', '#ec4899', '#3b82f6'];

        this.init();
        this.animate();
        this.addEventListeners();
    }

    init() {
        this.resize();
        this.createParticles();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = Math.min(100, Math.floor((this.canvas.width * this.canvas.height) / 15000));
        this.particles = [];

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    }

    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const opacity = 1 - distance / 120;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(168, 85, 247, ${opacity * 0.2})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    updateParticle(particle) {
        // Mouse interaction
        if (this.mouse.x !== null && this.mouse.y !== null) {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.mouse.radius) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                const angle = Math.atan2(dy, dx);
                particle.x -= Math.cos(angle) * force * 2;
                particle.y -= Math.sin(angle) * force * 2;
            }
        }

        // Movement
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = this.canvas.width;
        if (particle.x > this.canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = this.canvas.height;
        if (particle.y > this.canvas.height) particle.y = 0;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });

        this.connectParticles();

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// CURSOR GLOW
// ============================================
class CursorGlow {
    constructor() {
        this.glow = document.querySelector('.cursor-glow');
        if (!this.glow) return;

        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;

        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.targetX = e.clientX;
            this.targetY = e.clientY;
        });

        this.animate();
    }

    animate() {
        this.x += (this.targetX - this.x) * 0.1;
        this.y += (this.targetY - this.y) * 0.1;

        this.glow.style.left = `${this.x}px`;
        this.glow.style.top = `${this.y}px`;

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// SCROLL ANIMATIONS (Intersection Observer)
// ============================================
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');

                    // Stagger animation for grid items
                    if (entry.target.classList.contains('plugin-card')) {
                        const cards = document.querySelectorAll('.plugin-card');
                        cards.forEach((card, index) => {
                            card.style.transitionDelay = `${index * 0.1}s`;
                        });
                    }
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.plugin-card, .section-header, .about-feature').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Add visible styles
        const style = document.createElement('style');
        style.textContent = `
            .is-visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================
// 3D CARD TILT EFFECT
// ============================================
class CardTilt {
    constructor() {
        this.cards = document.querySelectorAll('.plugin-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleTilt(e, card));
            card.addEventListener('mouseleave', (e) => this.resetTilt(card));
        });
    }

    handleTilt(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;

        // Move glow
        const glow = card.querySelector('.card-glow');
        if (glow) {
            glow.style.left = `${x - rect.width}px`;
            glow.style.top = `${y - rect.height}px`;
        }
    }

    resetTilt(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.lastScroll = 0;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                this.navbar.style.background = 'rgba(10, 10, 15, 0.95)';
                this.navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
            } else {
                this.navbar.style.background = 'rgba(10, 10, 15, 0.8)';
                this.navbar.style.boxShadow = 'none';
            }

            this.lastScroll = currentScroll;
        });
    }
}

// ============================================
// TYPING EFFECT FOR HERO (Optional)
// ============================================
class TypeWriter {
    constructor(element, words, wait = 3000) {
        this.element = element;
        this.words = words;
        this.wait = parseInt(wait, 10);
        this.txt = '';
        this.wordIndex = 0;
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.element.innerHTML = `<span class="gradient-text">${this.txt}</span>`;

        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ============================================
// MAGNETIC BUTTONS
// ============================================
class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.btn-primary');
        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }
}

// ============================================
// FLOATING IMAGE GALLERY
// ============================================
class FloatingGallery {
    constructor() {
        this.cards = document.querySelectorAll('.floating-card');
        this.images = [];
        this.currentAssignments = [null, null, null]; // Which image index is assigned to each card
        this.pluginFolders = ['beatshape', 'paintflow', 'dustcloud', 'parallaxis', 'fractraveler'];

        this.init();
    }

    async init() {
        await this.loadImages();

        if (this.images.length > 0) {
            this.assignInitialImages();

            // Only start rotation if we have more than 3 images
            if (this.images.length > 3) {
                this.startRotation();
            }
        }
    }

    async loadImages() {
        // Search for images in each plugin folder
        const possibleImages = [];

        for (const plugin of this.pluginFolders) {
            for (let i = 1; i <= 10; i++) {
                possibleImages.push(`plugins/${plugin}/imgs/${i}.png`);
                possibleImages.push(`plugins/${plugin}/imgs/${i}.jpg`);
            }
        }

        // Check which images exist
        const results = await Promise.all(
            possibleImages.map(img => this.checkImage(img))
        );

        this.images = results.filter(src => src !== null);

        if (this.images.length > 0) {
            console.log(`🖼️ Found ${this.images.length} images from plugin folders`);
        }
    }

    checkImage(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => resolve(null);
            img.src = src;
        });
    }

    getAvailableImages() {
        // Return image indices that are NOT currently assigned to any card
        const available = [];
        for (let i = 0; i < this.images.length; i++) {
            if (!this.currentAssignments.includes(i)) {
                available.push(i);
            }
        }
        return available;
    }

    getRandomAvailableImage(excludeIndex) {
        // First try to get an image not currently shown
        const available = this.getAvailableImages();
        if (available.length > 0) {
            return available[Math.floor(Math.random() * available.length)];
        }

        // If all images are assigned, get any random image except the current one on this card
        const allIndices = [...Array(this.images.length).keys()];
        const filtered = allIndices.filter(i => i !== excludeIndex);
        if (filtered.length > 0) {
            return filtered[Math.floor(Math.random() * filtered.length)];
        }

        // Fallback: return any random image
        return Math.floor(Math.random() * this.images.length);
    }

    assignInitialImages() {
        // Assign unique images to each card
        const shuffled = [...Array(this.images.length).keys()].sort(() => Math.random() - 0.5);

        this.cards.forEach((card, cardIndex) => {
            if (shuffled.length > cardIndex) {
                const imageIndex = shuffled[cardIndex];
                this.currentAssignments[cardIndex] = imageIndex;

                const currentImg = card.querySelector('.card-image.current');
                if (currentImg) {
                    currentImg.src = this.images[imageIndex];
                    currentImg.style.opacity = '1';
                }

                card.classList.add('has-images');
                card.style.display = ''; // Make sure it's visible
            } else {
                // Not enough images, hide this card
                card.style.display = 'none';
            }
        });
    }

    transitionCard(cardIndex) {
        const card = this.cards[cardIndex];
        if (!card || this.images.length === 0) return;

        const currentImageIndex = this.currentAssignments[cardIndex];
        const newImageIndex = this.getRandomAvailableImage(currentImageIndex);

        // Skip if same image
        if (newImageIndex === currentImageIndex) return;

        const currentImg = card.querySelector('.card-image.current');
        const nextImg = card.querySelector('.card-image.next');

        if (!currentImg || !nextImg) return;

        // Preload next image
        const newSrc = this.images[newImageIndex];

        // Create a preload image to check if it loads
        const preloadImg = new Image();
        preloadImg.onload = () => {
            nextImg.src = newSrc;

            // Wait a frame for the src to apply
            requestAnimationFrame(() => {
                // Start fade transition
                nextImg.style.opacity = '1';
                currentImg.style.opacity = '0';

                // Update assignment
                this.currentAssignments[cardIndex] = newImageIndex;

                // After transition, swap roles
                setTimeout(() => {
                    // Swap classes
                    currentImg.classList.remove('current');
                    currentImg.classList.add('next');
                    nextImg.classList.remove('next');
                    nextImg.classList.add('current');
                }, 1200);
            });
        };

        // On error, skip this transition (keep current image)
        preloadImg.onerror = () => {
            console.log(`Failed to load image: ${newSrc}`);
        };

        preloadImg.src = newSrc;
    }

    startRotation() {
        // Each card starts at a DIFFERENT time (staggered)
        // Card 0: starts after 2-4 seconds
        // Card 1: starts after 5-7 seconds  
        // Card 2: starts after 8-10 seconds
        this.cards.forEach((card, cardIndex) => {
            const initialDelay = 2000 + (cardIndex * 3000) + (Math.random() * 2000);
            setTimeout(() => {
                this.scheduleNextRotation(cardIndex);
            }, initialDelay);
        });
    }

    scheduleNextRotation(cardIndex) {
        // Random delay between 7000ms and 10000ms
        const delay = 7000 + Math.random() * 3000;

        setTimeout(() => {
            this.transitionCard(cardIndex);
            this.scheduleNextRotation(cardIndex);
        }, delay);
    }
}

// ============================================
// IMAGE EXPANDER
// ============================================
class ImageExpander {
    constructor() {
        this.galleryImages = document.querySelectorAll('.gallery-image');
        this.init();
    }

    init() {
        this.galleryImages.forEach(image => {
            image.addEventListener('click', () => this.toggleExpand(image));
        });
    }

    toggleExpand(image) {
        // Only one image expanded at a time
        const currentlyExpanded = document.querySelector('.gallery-image.is-expanded');

        if (currentlyExpanded && currentlyExpanded !== image) {
            currentlyExpanded.classList.remove('is-expanded');
        }

        image.classList.toggle('is-expanded');

        // Smooth scroll to image if expanding
        if (image.classList.contains('is-expanded')) {
            setTimeout(() => {
                image.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }
    }
}

// ============================================
// INITIALIZE EVERYTHING
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Particles
    const canvas = document.getElementById('particles');
    if (canvas) {
        new ParticleSystem(canvas);
    }

    // Cursor Glow
    new CursorGlow();

    // Scroll Animations
    new ScrollAnimations();

    // Card Tilt
    new CardTilt();

    // Smooth Scroll
    new SmoothScroll();

    // Navbar
    new NavbarScroll();

    // Magnetic Buttons
    new MagneticButtons();

    // Floating Image Gallery
    new FloatingGallery();

    // Image Expander
    new ImageExpander();

    // Auto-update copyright year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    console.log('🚀 SXFX Website Initialized');
});

// ============================================
// PRELOADER (Optional)
// ============================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
