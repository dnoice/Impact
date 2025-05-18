// theme-switcher.js - Advanced theme toggle implementation with smooth transitions
// This component provides a robust light/dark mode toggle with system preference detection,
// local storage persistence, and smooth CSS transitions between states.

/**
 * Initializes the theme toggle component with preference detection and persistence
 * Handles all theme switching logic including animations and ARIA attributes
 */
function initializeThemeToggle() {
    // Get DOM references
    const themeToggle = document.querySelector('.theme-toggle');
    const htmlElement = document.documentElement;
    const toggleIndicator = themeToggle.querySelector('.theme-toggle-indicator');
    
    // Check for saved preferences or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial theme based on saved preference or system preference
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateToggleState(savedTheme === 'dark');
    } else if (prefersDarkScheme.matches) {
        htmlElement.setAttribute('data-theme', 'dark');
        updateToggleState(true);
    } else {
        // Default to light theme if no preference
        htmlElement.setAttribute('data-theme', 'light');
        updateToggleState(false);
    }
    
    // Toggle functionality
    themeToggle.addEventListener('click', () => {
        // Get current theme
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Apply theme change with transition
        htmlElement.classList.add('theme-transition');
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update toggle visual state
        updateToggleState(newTheme === 'dark');
        
        // Remove transition class after animation completes
        setTimeout(() => {
            htmlElement.classList.remove('theme-transition');
        }, 500);
    });
    
    // Listen for system preference changes
    prefersDarkScheme.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            htmlElement.setAttribute('data-theme', newTheme);
            updateToggleState(newTheme === 'dark');
        }
    });
    
    /**
     * Updates the toggle's visual state and accessibility attributes
     * @param {boolean} isDark - Whether the current theme is dark
     */
    function updateToggleState(isDark) {
        // Update visual indicator position with smooth animation
        toggleIndicator.style.transform = isDark ? 'translateX(24px)' : 'translateX(0)';
        
        // Update accessibility attributes
        themeToggle.setAttribute('aria-pressed', isDark);
        themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
        
        // Update any theme-specific icons if present
        const sunIcon = themeToggle.querySelector('.sun-icon');
        const moonIcon = themeToggle.querySelector('.moon-icon');
        
        if (sunIcon && moonIcon) {
            sunIcon.style.opacity = isDark ? '0.5' : '1';
            moonIcon.style.opacity = isDark ? '1' : '0.5';
        }
    }
}

// Export for use in main.js
export { initializeThemeToggle };