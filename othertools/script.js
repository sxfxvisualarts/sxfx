document.addEventListener('DOMContentLoaded', () => {
    // Info Accordion Toggle
    const infoButtons = document.querySelectorAll('.btn-info');

    infoButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const card = this.closest('.tool-card');
            const details = card.querySelector('.tool-details');

            // Toggle active class
            details.classList.toggle('active');

            // Update button text
            if (details.classList.contains('active')) {
                this.textContent = '- Info';
            } else {
                this.textContent = '+ Info';
            }
        });
    });

    // Image Lightbox Modal
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('image-modal-img');
    const closeBtn = document.getElementById('image-modal-close');
    const toolImages = document.querySelectorAll('.tool-image');

    const openModal = (src, alt) => {
        if (!modal || !modalImg) return;
        modalImg.src = src;
        modalImg.alt = alt || 'Preview';
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    toolImages.forEach(img => {
        img.addEventListener('click', () => {
            openModal(img.currentSrc || img.src, img.alt);
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeModal();
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            // Close when clicking the backdrop or close button, not the image itself
            if (e.target !== modalImg) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });
});
