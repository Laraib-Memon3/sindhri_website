document.addEventListener('DOMContentLoaded', function () {
    const toggler = document.querySelector('.navbar-toggler');
    const closeIcon = toggler?.querySelector('.close-icon');
    const hamburgerIcon = toggler?.querySelector('.navbar-toggler-icon');
    const navbarCollapse = document.getElementById('navbarNav');

    function updateIcons(isOpen) {
        hamburgerIcon?.classList.toggle('d-none', isOpen);
        closeIcon?.classList.toggle('d-none', !isOpen);
    }

    if (toggler && closeIcon && hamburgerIcon && navbarCollapse) {
        navbarCollapse.addEventListener('shown.bs.collapse', () => {
            updateIcons(true);  
        });

        navbarCollapse.addEventListener('hidden.bs.collapse', () => {
            updateIcons(false);
        });

        updateIcons(navbarCollapse.classList.contains('show'));
    }
});
