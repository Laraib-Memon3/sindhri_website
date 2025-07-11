// =========================
// SIMPLE NAVBAR TOGGLER - AUTO-CLOSE ON LINK CLICK
// =========================
document.addEventListener('DOMContentLoaded', function () {
    const toggler = document.querySelector('.navbar-toggler');
    const collapse = document.getElementById('navbarNav');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    // Auto-close menu when clicking on nav links (mobile only)
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (window.innerWidth < 992 && collapse && collapse.classList.contains('show')) {
                toggler.click();
            }
        });
    });
});

// =========================
// END NAVBAR TOGGLER LOGIC
// =========================


// Authentication System
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        this.loadUserFromStorage();
        this.setupEventListeners();
        this.updateUI();
    }

    setupEventListeners() {
        // Modal triggers
        document.getElementById('authBtn').addEventListener('click', () => this.showAuthModal());

        // Form submissions
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm').addEventListener('submit', (e) => this.handleRegister(e));

        // Form switching
        document.getElementById('showSignUp').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchToSignUp();
        });
        document.getElementById('showSignIn').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchToSignIn();
        });

        // Password toggles
        document.getElementById('toggleLoginPassword').addEventListener('click', () => this.togglePassword('loginPassword'));
        document.getElementById('toggleRegisterPassword').addEventListener('click', () => this.togglePassword('registerPassword'));
        document.getElementById('toggleConfirmPassword').addEventListener('click', () => this.togglePassword('confirmPassword'));

        // Social login buttons
        document.getElementById('googleLoginBtn').addEventListener('click', () => this.handleSocialLogin('google'));
        document.getElementById('facebookLoginBtn').addEventListener('click', () => this.handleSocialLogin('facebook'));
        document.getElementById('googleSignUpBtn').addEventListener('click', () => this.handleSocialLogin('google'));
        document.getElementById('facebookSignUpBtn').addEventListener('click', () => this.handleSocialLogin('facebook'));

        // User profile dropdown
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        // Real-time validation
        this.setupRealTimeValidation();

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-profile-dropdown') && !e.target.closest('#userProfileBtn')) {
                this.hideUserDropdown();
            }
        });
    }

    showAuthModal() {
        const modal = new bootstrap.Modal(document.getElementById('authModal'));
        this.switchToSignIn();
        modal.show();
    }

    switchToSignIn() {
        document.getElementById('signInForm').classList.remove('d-none');
        document.getElementById('signUpForm').classList.add('d-none');
        document.getElementById('signInForm').classList.add('fade-in');
    }

    switchToSignUp() {
        document.getElementById('signUpForm').classList.remove('d-none');
        document.getElementById('signInForm').classList.add('d-none');
        document.getElementById('signUpForm').classList.add('fade-in');
    }

    togglePassword(inputId) {
        const input = document.getElementById(inputId);
        const button = input.nextElementSibling;
        const icon = button.querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    setupRealTimeValidation() {
        // Email validation
        document.getElementById('registerEmail').addEventListener('input', (e) => {
            this.validateEmail(e.target);
        });

        // Password validation
        document.getElementById('registerPassword').addEventListener('input', (e) => {
            this.validatePassword(e.target);
        });

        // Confirm password validation
        document.getElementById('confirmPassword').addEventListener('input', (e) => {
            this.validateConfirmPassword(e.target);
        });

        // Phone validation
        document.getElementById('registerPhone').addEventListener('input', (e) => {
            this.validatePhone(e.target);
        });
    }

    validateEmail(input) {
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            this.showFieldError(input, 'Email is required');
        } else if (!emailRegex.test(email)) {
            this.showFieldError(input, 'Please enter a valid email address');
        } else {
            this.showFieldSuccess(input);
        }
    }

    validatePassword(input) {
        const password = input.value;
        const strength = this.getPasswordStrength(password);
        const strengthElement = document.getElementById('passwordStrength');

        strengthElement.className = `password-strength ${strength}`;

        if (!password) {
            this.showFieldError(input, 'Password is required');
        } else if (password.length < 8) {
            this.showFieldError(input, 'Password must be at least 8 characters long');
        } else if (strength === 'weak') {
            this.showFieldError(input, 'Password is too weak');
        } else {
            this.showFieldSuccess(input);
        }
    }

    validateConfirmPassword(input) {
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = input.value;

        if (!confirmPassword) {
            this.showFieldError(input, 'Please confirm your password');
        } else if (password !== confirmPassword) {
            this.showFieldError(input, 'Passwords do not match');
        } else {
            this.showFieldSuccess(input);
        }
    }

    validatePhone(input) {
        const phone = input.value.replace(/\D/g, '');
        const phoneRegex = /^\d{10}$/;

        if (!phone) {
            this.showFieldError(input, 'Phone number is required');
        } else if (!phoneRegex.test(phone)) {
            this.showFieldError(input, 'Please enter a valid 10-digit phone number');
        } else {
            this.showFieldSuccess(input);
        }
    }

    getPasswordStrength(password) {
        let score = 0;

        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score < 3) return 'weak';
        if (score < 4) return 'fair';
        if (score < 5) return 'good';
        return 'strong';
    }

    showFieldError(input, message) {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        const errorElement = document.getElementById(input.id + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    showFieldSuccess(input) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }

    async handleLogin(e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validation
        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Show loading state
        const loginBtn = document.getElementById('loginBtn');
        loginBtn.classList.add('loading');

        try {
            // Simulate API call
            await this.simulateApiCall(1500);

            // Mock user data
            const user = {
                id: 1,
                firstName: 'Bushra',
                lastName: 'Shaikh',
                email: email,
                phone: '+1234567890',
                avatar: null
            };

            this.login(user, rememberMe);
            this.showNotification('Welcome back!', 'success');

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
            modal.hide();

        } catch (error) {
            this.showNotification('Invalid email or password', 'error');
        } finally {
            loginBtn.classList.remove('loading');
        }
    }

    async handleRegister(e) {
        e.preventDefault();

        const formData = {
            firstName: document.getElementById('registerFirstName').value.trim(),
            lastName: document.getElementById('registerLastName').value.trim(),
            email: document.getElementById('registerEmail').value.trim(),
            phone: document.getElementById('registerPhone').value.trim(),
            password: document.getElementById('registerPassword').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            agreeTerms: document.getElementById('agreeTerms').checked
        };

        // Validation
        if (!formData.firstName || !formData.lastName || !formData.email ||
            !formData.phone || !formData.password || !formData.confirmPassword) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!formData.agreeTerms) {
            this.showNotification('Please agree to the terms and conditions', 'error');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        if (formData.password.length < 8) {
            this.showNotification('Password must be at least 8 characters long', 'error');
            return;
        }

        // Show loading state
        const registerBtn = document.getElementById('registerBtn');
        registerBtn.classList.add('loading');

        try {
            // Simulate API call
            await this.simulateApiCall(2000);

            // Mock user data
            const user = {
                id: Date.now(),
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                avatar: null
            };

            this.login(user, true);
            this.showNotification('Account created successfully!', 'success');

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
            modal.hide();

        } catch (error) {
            this.showNotification('Registration failed. Please try again.', 'error');
        } finally {
            registerBtn.classList.remove('loading');
        }
    }

    async handleSocialLogin(provider) {
        this.showNotification(`${provider} login is not implemented yet`, 'info');
        // In a real application, you would integrate with Google/Facebook OAuth here
    }

    login(user, rememberMe = false) {
        this.currentUser = user;
        this.isAuthenticated = true;

        // Save to localStorage
        if (rememberMe) {
            localStorage.setItem('sindhri_user', JSON.stringify(user));
            localStorage.setItem('sindhri_auth', 'true');
        } else {
            sessionStorage.setItem('sindhri_user', JSON.stringify(user));
            sessionStorage.setItem('sindhri_auth', 'true');
        }

        this.updateUI();
    }

    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;

        // Clear storage
        localStorage.removeItem('sindhri_user');
        localStorage.removeItem('sindhri_auth');
        sessionStorage.removeItem('sindhri_user');
        sessionStorage.removeItem('sindhri_auth');

        this.updateUI();
        this.hideUserDropdown();
        this.showNotification('You have been signed out', 'info');
    }

    loadUserFromStorage() {
        const user = localStorage.getItem('sindhri_user') || sessionStorage.getItem('sindhri_user');
        const auth = localStorage.getItem('sindhri_auth') || sessionStorage.getItem('sindhri_auth');

        if (user && auth === 'true') {
            this.currentUser = JSON.parse(user);
            this.isAuthenticated = true;
        }
    }

    updateUI() {
        const authButtons = document.querySelector('.d-flex.gap-2');
        const userDropdown = document.getElementById('userProfileDropdown');

        if (this.isAuthenticated && this.currentUser) {
            // Hide auth buttons, show user profile
            authButtons.innerHTML = `
                <div class="dropdown">
                    <button class="btn btn-outline-danger dropdown-toggle" type="button" id="userProfileBtn" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-user me-2"></i>${this.currentUser.firstName}
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#" id="profileLink"><i class="fas fa-user-circle me-2"></i>Profile</a></li>
                        <li><a class="dropdown-item" href="#" id="reservationsLink"><i class="fas fa-calendar-alt me-2"></i>My Reservations</a></li>
                        <li><a class="dropdown-item" href="#" id="ordersLink"><i class="fas fa-utensils me-2"></i>Order History</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item text-danger" href="#" id="logoutBtn"><i class="fas fa-sign-out-alt me-2"></i>Sign Out</a></li>
                    </ul>
                </div>
            `;

            // Update user info in dropdown
            document.getElementById('userName').textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
            document.getElementById('userEmail').textContent = this.currentUser.email;

            // Re-attach event listeners
            document.getElementById('logoutBtn').addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });

        } else {
            // Show single auth button
            authButtons.innerHTML = `
                <button class="btn btn-danger" id="authBtn">Sign In</button>
            `;

            // Re-attach event listener
            document.getElementById('authBtn').addEventListener('click', () => this.showAuthModal());
        }
    }

    hideUserDropdown() {
        const dropdown = document.querySelector('.dropdown-menu.show');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }

    async simulateApiCall(delay) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('API Error'));
                }
            }, delay);
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-${this.getNotificationIcon(type)} me-2"></i>
                <span>${message}</span>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            backdrop-filter: blur(10px);
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: 'linear-gradient(45deg, #198754, #20c997)',
            error: 'linear-gradient(45deg, #dc3545, #ff6b6b)',
            warning: 'linear-gradient(45deg, #ffc107, #fd7e14)',
            info: 'linear-gradient(45deg, #0dcaf0, #6f42c1)'
        };
        return colors[type] || colors.info;
    }
}

// Initialize Authentication System
const authSystem = new AuthSystem();

// Mobile Navigation Toggle - Fixed for Bootstrap navbar
const hamburger = document.querySelector('.navbar-toggler');
const navMenu = document.querySelector('.navbar-collapse');

if (hamburger && navMenu) {
hamburger.addEventListener('click', () => {
        // Bootstrap handles the toggle automatically
        // We just need to ensure proper state
        setTimeout(() => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            if (isExpanded) {
                hamburger.classList.add('active');
            } else {
                hamburger.classList.remove('active');
            }
        }, 100);
});
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.navbar-nav .nav-link').forEach(n => n.addEventListener('click', () => {
    if (hamburger) {
    hamburger.classList.remove('active');
    }
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Menu Category Filtering
const categoryButtons = document.querySelectorAll('[data-category]');
const menuItems = document.querySelectorAll('.menu-item');

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        const category = button.getAttribute('data-category');

        menuItems.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
                item.style.display = 'block';
                item.classList.add('fade-in-up');
            } else {
                item.style.display = 'none';
                item.classList.remove('fade-in-up');
            }
        });
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(26, 26, 26, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(26, 26, 26, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Add to Order functionality
document.querySelectorAll('.btn-danger.btn-sm').forEach(button => {
    button.addEventListener('click', () => {
        const menuItem = button.closest('.menu-item');
        const itemName = menuItem.querySelector('.card-title').textContent;
        const itemPrice = menuItem.querySelector('.text-danger').textContent;

        // Check if user is authenticated
        if (!authSystem.isAuthenticated) {
            authSystem.showNotification('Please sign in to add items to your order', 'warning');
            authSystem.showAuthModal();
            return;
        }

        // Show notification
        authSystem.showNotification(`${itemName} added to order!`, 'success');

        // Animate button
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    });
});

// Contact form handling
const contactForm = document.querySelector('#contact form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const phone = contactForm.querySelector('input[type="tel"]').value;
        const service = contactForm.querySelector('select').value;
        const message = contactForm.querySelector('textarea').value;

        // Basic validation
        if (!name || !email || !service || !message) {
            authSystem.showNotification('Please fill in all required fields!', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            authSystem.showNotification('Please enter a valid email address!', 'error');
            return;
        }

        // Simulate form submission
        authSystem.showNotification('Thank you! Your message has been sent successfully.', 'success');
        contactForm.reset();
    });
}

// Newsletter form handling
const newsletterForm = document.querySelector('footer form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = newsletterForm.querySelector('input[type="email"]').value;

        if (!email) {
            authSystem.showNotification('Please enter your email address!', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            authSystem.showNotification('Please enter a valid email address!', 'error');
            return;
        }

        authSystem.showNotification('Thank you for subscribing to our newsletter!', 'success');
        newsletterForm.reset();
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.menu-item, .service-card, .testimonial-card, .feature');
    animateElements.forEach(el => {
        observer.observe(el);
    });
});

// Image loading animation
document.addEventListener('DOMContentLoaded', function () {
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

// Counter animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }

    updateCounter();
}

// Initialize counters when they come into view
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.textContent);
            animateCounter(counter, target);
            counterObserver.unobserve(counter);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        counterObserver.observe(counter);
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation to images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';

        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });

        if (img.complete) {
            img.style.opacity = '1';
        }
    });

    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Mobile-specific enhancements
    if (window.innerWidth <= 768) {
        // Add touch-friendly spacing to buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.style.minHeight = '44px'; // iOS recommended touch target size
        });

        // Improve modal touch interactions
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.addEventListener('touchstart', function (e) {
                // Prevent body scroll when modal is open on mobile
                document.body.style.overflow = 'hidden';
            });

            modal.addEventListener('touchend', function (e) {
                // Restore body scroll when modal is closed
                document.body.style.overflow = '';
            });
        }

        // Add swipe gestures for mobile navigation
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - could be used for navigation
                    console.log('Swipe left detected');
                } else {
                    // Swipe right - could be used for navigation
                    console.log('Swipe right detected');
                }
            }
        }
    }

    // Prevent zoom on input focus for iOS
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            if (window.innerWidth <= 768) {
                // Add a small delay to prevent zoom
                setTimeout(() => {
                    this.style.fontSize = '16px';
                }, 100);
            }
        });

        input.addEventListener('blur', function () {
            if (window.innerWidth <= 768) {
                this.style.fontSize = '';
            }
        });
    });

});


// Initialize menu system when DOM is loaded
let menuSystem;
document.addEventListener('DOMContentLoaded', () => {
    menuSystem = new MenuSystem();
    
    // Update cart total whenever cart changes
    const originalUpdateCartDisplay = menuSystem.updateCartDisplay;
    menuSystem.updateCartDisplay = function() {
        originalUpdateCartDisplay.call(this);
        this.updateCartTotal();
    };
});

document.addEventListener('DOMContentLoaded', function() {
    const reservationForm = document.querySelector('.reservation-form');
    const successMsg = document.querySelector('.reservation-success-msg');
    if (reservationForm && successMsg) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            successMsg.style.display = 'block';
            successMsg.classList.add('show');
            reservationForm.reset();
            setTimeout(() => {
                successMsg.style.display = 'none';
                successMsg.classList.remove('show');
            }, 4000);
        });
    }
});