document.addEventListener('DOMContentLoaded', () => {
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
});
