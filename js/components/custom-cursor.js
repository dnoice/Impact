// custom-cursor.js - Implementation for the interactive custom cursor
// Creates a dynamic cursor that responds to different UI elements and interactions

/**
 * Initializes the custom cursor functionality
 * Replaces the default cursor with a custom interactive element
 */
function initializeCustomCursor() {
    // Get the cursor follower element
    const cursor = document.querySelector('.cursor-follower');
    if (!cursor) return;
    
    // Initial setup - hide cursor until mouse moves
    cursor.style.opacity = '0';
    
    // Detect device type - disable custom cursor on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        cursor.style.display = 'none';
        document.body.classList.add('touch-device');
        return;
    }
    
    // Track cursor position
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    // Follow mouse position with slight smoothing
    document.addEventListener('mousemove', e => {
        // Update cursor position target
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Show cursor if it was hidden
        if (cursor.style.opacity === '0') {
            cursor.style.opacity = '1';
        }
    });
    
    // Hide when mouse leaves the document
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    // Enhanced interactivity for different element types
    const setupInteractions = () => {
        // Interactive elements that expand the cursor
        const interactiveElements = document.querySelectorAll(
            'a, button, .nav-link, .theme-toggle, .timeline-point, ' + 
            '.stat-card, .transport-card, .growth-toggle, ' +
            'input, select, textarea, [role="button"]'
        );
        
        interactiveElements.forEach(element => {
            // Expand cursor on hover
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-expanded');
                
                // Add type-specific classes
                if (element.tagName === 'A') cursor.classList.add('cursor-link');
                if (element.tagName === 'BUTTON' || element.getAttribute('role') === 'button') {
                    cursor.classList.add('cursor-button');
                }
                if (element.classList.contains('nav-link')) cursor.classList.add('cursor-nav');
                if (element.classList.contains('stat-card')) cursor.classList.add('cursor-card');
                
                // Add info text if available
                const cursorText = element.getAttribute('data-cursor-text');
                if (cursorText) {
                    cursor.setAttribute('data-text', cursorText);
                    cursor.classList.add('cursor-with-text');
                }
            });
            
            // Return to normal on leave
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove(
                    'cursor-expanded', 
                    'cursor-link', 
                    'cursor-button', 
                    'cursor-nav', 
                    'cursor-card',
                    'cursor-with-text'
                );
                cursor.removeAttribute('data-text');
            });
            
            // Add click effect
            element.addEventListener('mousedown', () => {
                cursor.classList.add('cursor-clicked');
            });
            
            element.addEventListener('mouseup', () => {
                cursor.classList.remove('cursor-clicked');
            });
        });
        
        // Special effects for accent elements
        const accentElements = document.querySelectorAll(
            '.accent, .key-stat-number, .stat-number, ' + 
            '.holiday-card-stat, [data-cursor-accent]'
        );
        
        accentElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-accent');
                
                // Get custom color if specified
                const cursorColor = element.getAttribute('data-cursor-color');
                if (cursorColor) {
                    cursor.style.setProperty('--cursor-accent-color', cursorColor);
                }
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-accent');
                cursor.style.removeProperty('--cursor-accent-color');
            });
        });
        
        // Expand cursor for images and charts
        const mediaElements = document.querySelectorAll('img, .chart, [data-chart], svg');
        
        mediaElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-media');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-media');
            });
        });
    };
    
    // Run on initial load
    setupInteractions();
    
    // Animation loop with smooth following effect
    const animateCursor = () => {
        // Calculate smooth movement with easing
        const easing = 0.2;
        cursorX += (mouseX - cursorX) * easing;
        cursorY += (mouseY - cursorY) * easing;
        
        // Apply position with hardware acceleration
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        
        // Continue animation
        requestAnimationFrame(animateCursor);
    };
    
    // Start animation loop
    animateCursor();
    
    // Handle dynamic content - re-initialize interactions when DOM changes
    // Use a lightweight mutation observer
    const observer = new MutationObserver(mutations => {
        // Check if mutations added new elements we care about
        const shouldReinitialize = mutations.some(mutation => {
            return mutation.type === 'childList' && mutation.addedNodes.length > 0;
        });
        
        if (shouldReinitialize) {
            setupInteractions();
        }
    });
    
    // Start observing the document for content changes
    observer.observe(document.body, { 
        childList: true, 
        subtree: true 
    });
    
    // Expose API for programmatic cursor control
    window.customCursor = {
        /**
         * Temporarily changes cursor state
         * @param {string} state - The cursor state to apply (e.g., 'loading', 'success')
         * @param {number} duration - Duration in ms, 0 for permanent
         */
        setState: (state, duration = 2000) => {
            // Remove any previous states
            cursor.classList.remove('cursor-loading', 'cursor-success', 'cursor-error');
            
            // Add the new state
            cursor.classList.add(`cursor-${state}`);
            
            // Reset after duration (if not permanent)
            if (duration > 0) {
                setTimeout(() => {
                    cursor.classList.remove(`cursor-${state}`);
                }, duration);
            }
        }
    };
}

// Export the function for use in main.js
export { initializeCustomCursor };