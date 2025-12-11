// public/js/main.js - FIXED MOBILE NAVIGATION

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Toggle icon
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Mobile Dropdown Toggle
    const dropdownToggles = document.querySelectorAll('.has-dropdown > a');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = this.parentElement;
                
                // Close other dropdowns
                document.querySelectorAll('.has-dropdown').forEach(dropdown => {
                    if (dropdown !== parent) {
                        dropdown.classList.remove('active');
                    }
                });
                
                parent.classList.toggle('active');
            }
        });
    });
    
    // Close mobile menu when window is resized to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            
            if (mobileMenuToggle) {
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            
            // Remove active class from all dropdowns
            document.querySelectorAll('.has-dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!e.target.closest('.main-nav')) {
                navMenu.classList.remove('active');
                if (mobileMenuToggle) {
                    const icon = mobileMenuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        }
    });
    
    // Smooth Scroll for Anchor Links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Back to Top Button
    const createBackToTop = () => {
        const button = document.createElement('button');
        button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        button.className = 'back-to-top';
        button.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background-color: #5800ccff;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: none;
            z-index: 999;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(button);
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                button.style.display = 'block';
            } else {
                button.style.display = 'none';
            }
        });
        
        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        button.addEventListener('mouseenter', () => {
            button.style.backgroundColor = '#ff0040ff';
            button.style.transform = 'translateY(-5px)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.backgroundColor = '#5800ccff';
            button.style.transform = 'translateY(0)';
        });
    };
    
    createBackToTop();
    
    // Search form validation
    const searchForms = document.querySelectorAll('form[action="/search"]');
    searchForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const input = this.querySelector('input[name="q"]');
            if (input && input.value.trim() === '') {
                e.preventDefault();
                alert('Please enter a search term');
                input.focus();
            }
        });
    });
    
    // Fix image error handling
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            if (this.src !== '/images/placeholder.jpg') {
                this.src = '/images/placeholder.jpg';
            }
        });
    });
});

// Price formatting helper
function formatPrice(price) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN'
    }).format(price);
}

// Console message
console.log('%c Welcome to Mabs Electronics Limited! ', 'background: #0066cc; color: white; font-size: 20px; padding: 10px;');
console.log('%c Built with Node.js, Express, and EJS ', 'background: #ff6b00; color: white; font-size: 14px; padding: 5px;');