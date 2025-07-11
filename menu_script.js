document.addEventListener('DOMContentLoaded', function () {
    // Hero Slider Functionality
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    let currentSlide = 0;
    let autoSlide;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlideFunc() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function startAutoSlide() {
        autoSlide = setInterval(nextSlide, 4000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlide);
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });

        prevBtn.addEventListener('click', () => {
            prevSlideFunc();
            stopAutoSlide();
            startAutoSlide();
        });
    }

    // Start Hero Slider
    if (slides.length > 0) {
        showSlide(currentSlide);
        startAutoSlide();
    }

    // Category Navigation Functionality
    const categoryBtns = document.querySelectorAll('.category-btn');
    const categoryNav = document.getElementById('categoryNav');
    const menuCategories = document.querySelectorAll('.menu-category');

    // Set default active state - show "All" category
    const allButton = document.querySelector('[data-category="all"]');
    if (allButton) {
        allButton.classList.add('active');
        showAllCategories();
    }

    // Function to show all categories
    function showAllCategories() {
        menuCategories.forEach(category => {
            category.style.display = 'block';
            category.classList.add('show-all');
            category.classList.remove('active');
        });
    }

    // Function to filter menu by category
    function filterMenuByCategory(category) {
        if (category === 'all') {
            showAllCategories();
        } else {
            // Hide all categories first
            menuCategories.forEach(cat => {
                cat.style.display = 'none';
                cat.classList.remove('show-all', 'active');
            });

            // Show only the selected category
            const selectedCategory = document.getElementById(category + '-section');
            if (selectedCategory) {
                selectedCategory.style.display = 'block';
                selectedCategory.classList.add('active');

                // Smooth scroll to the category
                setTimeout(() => {
                    selectedCategory.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
        }
    }

    // Function to update URL hash
    function updateURLHash(category) {
        if (category === 'all') {
            history.pushState(null, null, window.location.pathname);
        } else {
            history.pushState(null, null, `#${category}`);
        }
    }

    // Enhanced category button click handler
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Get category data
            const category = this.getAttribute('data-category');

            // Filter menu items based on category
            filterMenuByCategory(category);

            // Update URL hash
            updateURLHash(category);
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.substring(1);
        const category = hash || 'all';

        // Update button states
        categoryBtns.forEach(btn => btn.classList.remove('active'));
        const activeButton = document.querySelector(`[data-category="${category}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // Filter menu
        filterMenuByCategory(category);
    });

    // Check URL hash on page load
    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        const initialCategory = initialHash || 'all';
        const initialButton = document.querySelector(`[data-category="${initialCategory}"]`);
        if (initialButton) {
            // Remove active from all buttons
            categoryBtns.forEach(btn => btn.classList.remove('active'));
            // Add active to initial button
            initialButton.classList.add('active');
            // Filter menu
            filterMenuByCategory(initialCategory);
        }
    }

    // Check for scroll indicators on mobile
    function checkScrollIndicators() {
        if (categoryNav && categoryNav.scrollWidth > categoryNav.clientWidth) {
            categoryNav.classList.add('scrollable');
        } else if (categoryNav) {
            categoryNav.classList.remove('scrollable');
        }
    }

    // Check on load and resize
    checkScrollIndicators();
    window.addEventListener('resize', checkScrollIndicators);

    // Smooth scroll for mobile touch
    if (categoryNav) {
        let isScrolling = false;
        let startX = 0;
        let scrollLeft = 0;

        categoryNav.addEventListener('touchstart', (e) => {
            isScrolling = true;
            startX = e.touches[0].pageX - categoryNav.offsetLeft;
            scrollLeft = categoryNav.scrollLeft;
        });

        categoryNav.addEventListener('touchmove', (e) => {
            if (!isScrolling) return;
            e.preventDefault();
            const x = e.touches[0].pageX - categoryNav.offsetLeft;
            const walk = (x - startX) * 2;
            categoryNav.scrollLeft = scrollLeft - walk;
        });

        categoryNav.addEventListener('touchend', () => {
            isScrolling = false;
        });
    }

    // Keyboard navigation for category buttons
    document.addEventListener('keydown', (e) => {
        const activeBtn = document.querySelector('.category-btn.active');
        if (!activeBtn) return;

        const currentIndex = Array.from(categoryBtns).indexOf(activeBtn);
        let nextIndex;

        if (e.key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % categoryBtns.length;
        } else if (e.key === 'ArrowLeft') {
            nextIndex = (currentIndex - 1 + categoryBtns.length) % categoryBtns.length;
        } else {
            return;
        }

        categoryBtns[nextIndex].click();
        categoryBtns[nextIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    });

    console.log('Menu page loaded successfully with category filtering!');

    // === Add to Cart Modal Logic ===
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const item = btn.closest('.menu-item');
            document.getElementById('cartModalImg').src = item.querySelector('.item-image').src;
            document.getElementById('cartModalTitle').textContent = item.querySelector('.item-title').textContent;
            document.getElementById('cartModalDesc').textContent = item.querySelector('.item-description').textContent;
            document.getElementById('cartModalPrice').textContent = item.querySelector('.item-price').textContent;
            document.getElementById('cartQty').textContent = 1;
            document.getElementById('cartModalSuccess').style.display = 'none';
            document.getElementById('cartModal').style.display = 'flex';
        });
    });
    document.getElementById('cartModalClose').onclick = () => {
        document.getElementById('cartModal').style.display = 'none';
    };
    document.getElementById('qtyMinus').onclick = () => {
        let qty = parseInt(document.getElementById('cartQty').textContent);
        if (qty > 1) document.getElementById('cartQty').textContent = qty - 1;
    };
    document.getElementById('qtyPlus').onclick = () => {
        let qty = parseInt(document.getElementById('cartQty').textContent);
        document.getElementById('cartQty').textContent = qty + 1;
    };
    document.getElementById('cartModalConfirm').onclick = () => {
        document.getElementById('cartModalSuccess').style.display = 'flex';
        setTimeout(() => {
            document.getElementById('cartModal').style.display = 'none';
        }, 1500);
    };

    // === Loader for Images ===
    const loader = document.getElementById('globalLoader');
    const images = document.querySelectorAll('img');
    let loaded = 0;

    if (images.length === 0) {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 400);
        return;
    }

    images.forEach(img => {
        if (img.complete) {
            loaded++;
            if (loaded === images.length) {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 400);
            }
        } else {
            img.addEventListener('load', () => {
                loaded++;
                if (loaded === images.length) {
                    loader.style.opacity = '0';
                    setTimeout(() => loader.style.display = 'none', 400);
                }
            });
            img.addEventListener('error', () => {
                loaded++;
                if (loaded === images.length) {
                    loader.style.opacity = '0';
                    setTimeout(() => loader.style.display = 'none', 400);
                }
            });
        }
    });
});

// Back to top button
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
backToTopBtn.className = 'btn btn-danger back-to-top';
backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: none;
    z-index: 1000;
    box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
`;

document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
