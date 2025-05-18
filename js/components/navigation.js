// navigation.js - Implementation for the primary navigation component
// This handles mobile menu toggling, smooth scrolling, and scroll-based behavior

/**
 * Initializes the primary navigation functionality
 * Handles mobile menu, scroll behavior, and section highlighting
 */
function initializeNavigation() {
    // Get navigation DOM elements
    const header = document.querySelector('.primary-header');
    const nav = document.querySelector('.primary-navigation');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Track scroll position for header behavior
    let lastScrollTop = 0;
    let scrollTimeout;
    
    // Mobile menu toggle functionality
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            // Toggle active classes for menu and toggle button
            mobileMenuToggle.classList.toggle('active');
            nav.classList.toggle('mobile-active');
            
            // Update ARIA attributes for accessibility
            const isExpanded = nav.classList.contains('mobile-active');
            mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
            
            // Prevent body scrolling when menu is open
            document.body.classList.toggle('nav-open');
            
            // If menu is being closed, restore focus to toggle button
            if (!isExpanded && document.activeElement !== mobileMenuToggle) {
                mobileMenuToggle.focus();
            }
        });
        
        // Setup proper ARIA attributes
        mobileMenuToggle.setAttribute('aria-controls', 'primary-nav');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
    
    // Highlight active section in navigation based on scroll position
    const highlightActiveNavLink = () => {
        // Get current scroll position with some offset to trigger earlier
        const scrollPosition = window.scrollY + 100;
        
        // Find all sections that could be highlighted
        const sections = document.querySelectorAll('section[id]');
        
        // Check which section is currently in view
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // If we're within this section's range
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        // Update nav links to highlight the current section
        navLinks.forEach(link => {
            // Remove active class from all links
            link.classList.remove('active');
            
            // Add active class to the link matching current section
            const href = link.getAttribute('href').substring(1); // Remove '#'
            if (href === currentSectionId) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };
    
    // Implement scroll-aware header behavior
    // (hide on scroll down, show on scroll up)
    const handleScroll = () => {
        const currentScrollTop = window.scrollY;
        
        // Don't process header behavior if we're near the top of the page
        if (currentScrollTop <= 50) {
            header.classList.remove('scrolled', 'hidden');
            return;
        }
        
        // Add 'scrolled' class once we scroll past the initial threshold
        header.classList.add('scrolled');
        
        // Determine scroll direction
        if (currentScrollTop > lastScrollTop) {
            // Scrolling down
            if (currentScrollTop > 200) {
                header.classList.add('hidden');
            }
        } else {
            // Scrolling up
            header.classList.remove('hidden');
        }
        
        // Update last scroll position
        lastScrollTop = currentScrollTop;
        
        // Update active section highlighting
        highlightActiveNavLink();
        
        // Clear and set a new timeout to add 'scrolled-paused' class
        clearTimeout(scrollTimeout);
        header.classList.remove('scroll-paused');
        
        scrollTimeout = setTimeout(() => {
            header.classList.add('scroll-paused');
        }, 500);
    };
    
    // Implement smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            // Get the target section id from the link href
            const targetId = link.getAttribute('href');
            
            // Only process if it's an internal anchor link
            if (targetId.startsWith('#') && targetId.length > 1) {
                e.preventDefault();
                
                // Find the target element
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile menu if it's open
                    if (nav.classList.contains('mobile-active')) {
                        mobileMenuToggle.click();
                    }
                    
                    // Calculate scroll position (with header offset)
                    const headerOffset = header.offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    // Smooth scroll to target
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL hash without scrolling (using history API)
                    history.pushState(null, null, targetId);
                    
                    // Update active state manually since we prevented default behavior
                    navLinks.forEach(navLink => {
                        navLink.classList.remove('active');
                        navLink.removeAttribute('aria-current');
                    });
                    
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                }
            }
        });
    });
    
    // Add scroll event listener with throttling for performance
    window.addEventListener('scroll', throttle(handleScroll, 100));
    
    // Initial call to highlight the current section
    highlightActiveNavLink();
    
    // Check if URL has a hash on load and scroll to that section
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
            // Delay the scroll to ensure the page is fully loaded
            setTimeout(() => {
                const headerOffset = header.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 500);
        }
    }
}

/**
 * Simple throttle function to limit execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Throttle time in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export the function for use in main.js
export { initializeNavigation };