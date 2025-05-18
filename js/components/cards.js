// cards.js - Implementation of interactive stat cards with 3D effect
// This component provides visually engaging statistic cards with hover interactions,
// 3D tilt effects, and animated counters.

/**
 * Initializes all statistic cards with 3D tilt effect, particle animations,
 * and counter animations when they become visible
 */
function initializeStatCards() {
    // Select all stat and transport cards
    const cards = document.querySelectorAll('.stat-card, .transport-card');
    
    // Populate cards with data if available
    populateCardData();
    
    cards.forEach(card => {
        // Add 3D tilt effect on mouse move
        card.addEventListener('mousemove', e => {
            // Get mouse position relative to card
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation values based on mouse position
            const cardWidth = card.offsetWidth;
            const cardHeight = card.offsetHeight;
            const rotateY = ((x / cardWidth) - 0.5) * 10; // -5 to 5 degrees
            const rotateX = ((y / cardHeight) - 0.5) * -10; // 5 to -5 degrees
            
            // Apply 3D transform with perspective
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            
            // Update light reflection effect using CSS variables
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            // Create dynamic shadow based on tilt
            const shadowX = rotateY * 0.5;
            const shadowY = rotateX * -0.5;
            card.style.boxShadow = `
                ${shadowX}px ${shadowY}px 15px rgba(0, 0, 0, 0.1),
                0 4px 6px rgba(0, 0, 0, 0.05),
                0 1px 3px rgba(0, 0, 0, 0.1),
                inset 0 0 3px rgba(255, 255, 255, 0.2)
            `;
        });
        
        // Reset on mouse leave with smooth transition
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)';
            
            // Clear transition after animation completes
            setTimeout(() => {
                card.style.transition = '';
            }, 500);
        });
        
        // Add particle effects for hover state
        addParticlesToCard(card);
        
        // Check if card contains counter element and initialize it
        const counterElement = card.querySelector('.counter');
        if (counterElement) {
            observeCounter(counterElement);
        }
        
        // Add focus accessibility for keyboard users
        card.setAttribute('tabindex', '0');
        card.addEventListener('focus', () => {
            card.classList.add('focused');
        });
        
        card.addEventListener('blur', () => {
            card.classList.remove('focused');
        });
        
        // Handle click for mobile users (toggle active state)
        card.addEventListener('click', () => {
            // Remove active class from all other cards
            cards.forEach(c => {
                if (c !== card) c.classList.remove('active');
            });
            
            // Toggle active class on this card
            card.classList.toggle('active');
        });
    });
}

/**
 * Creates and adds particle elements to a card for visual effect
 * @param {HTMLElement} card - The card element to add particles to
 */
function addParticlesToCard(card) {
    // Create particles container if it doesn't exist
    let particlesContainer = card.querySelector('.particles');
    if (!particlesContainer) {
        particlesContainer = document.createElement('div');
        particlesContainer.classList.add('particles');
        card.appendChild(particlesContainer);
    }
    
    // Determine particle type based on card content/class
    let particleType = 'default';
    if (card.classList.contains('packaging-card')) {
        particleType = 'packaging';
    } else if (card.classList.contains('transport-card')) {
        particleType = 'transport';
    } else if (card.classList.contains('waste-card')) {
        particleType = 'waste';
    }
    
    // Create individual particles with random properties
    const particleCount = card.classList.contains('large-card') ? 30 : 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle', `particle-${particleType}`);
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random movement direction using CSS variables
        particle.style.setProperty('--x', Math.random() * 2 - 1);
        particle.style.setProperty('--y', Math.random() * 2 - 1);
        
        // Random size
        const size = Math.random() * 6 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random opacity
        particle.style.opacity = (Math.random() * 0.6 + 0.2).toString();
        
        // Random animation delay and duration
        particle.style.animationDelay = `${Math.random() * 2}s`;
        particle.style.animationDuration = `${Math.random() * 8 + 4}s`;
        
        particlesContainer.appendChild(particle);
    }
}

/**
 * Sets up intersection observer to animate counter when it becomes visible
 * @param {HTMLElement} counterElement - The counter element to observe
 */
function observeCounter(counterElement) {
    if (!counterElement) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(counterElement);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(counterElement);
}

/**
 * Animates a counter from 0 to its target value
 * @param {HTMLElement} counterElement - The element to animate
 */
function animateCounter(counterElement) {
    const targetValue = parseFloat(counterElement.dataset.target);
    const decimalPlaces = (targetValue % 1 !== 0) ? 2 : 0;
    let currentValue = 0;
    const duration = 2000; // ms
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;
    
    const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        
        // Use easing function for more natural animation
        // easeOutExpo provides a quick start and gradual end
        const easing = 1 - Math.pow(2, -10 * progress);
        currentValue = easing * targetValue;
        
        // Format number with appropriate commas and decimal places
        counterElement.textContent = formatNumber(currentValue, decimalPlaces);
        
        if (frame === totalFrames) {
            clearInterval(counter);
            counterElement.textContent = formatNumber(targetValue, decimalPlaces);
            
            // Add emphasis class when counter finishes
            counterElement.classList.add('counter-complete');
        }
    }, frameDuration);
}

/**
 * Formats a number with commas as thousands separators and specified decimal places
 * @param {number} number - The number to format
 * @param {number} decimalPlaces - Number of decimal places to show
 * @returns {string} Formatted number string
 */
function formatNumber(number, decimalPlaces) {
    return number.toLocaleString('en-US', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces
    });
}

/**
 * Populates stat cards with actual data from the global dashboard data object
 */
// Add this to the populateCardData function in cards.js

function populateCardData() {
    // Check if dashboard data is available
    if (!window.dashboardData) {
        // If data isn't loaded yet, use placeholder data
        const placeholderData = {
            consumption: {
                salesGlobal: [4.98, 5.29, 5.82, 6.33, 6.86, 7.41, 7.96],
                growth: [17.42, 6.22, 9.07, 8.76, 8.37, 7.99, 7.42]
            },
            packaging: {
                plastic: {
                    amounts: [1.0, 1.3, 1.5, 1.76, 1.45, 3.11]
                }
            },
            transport: {
                totalCO2: {
                    lastMile: 65
                },
                emissionsFactors: {
                    lastMile: 100
                }
            },
            returns: {
                totalWaste: 4.3,
                notResold: 0.44
            }
        };
        
        window.dashboardData = placeholderData;
    }
    
    const data = window.dashboardData;
    
    // Create cards dynamically based on available data
    const cardsContainer = document.querySelector('.stat-cards');
    if (!cardsContainer) return;
    
    // Clear existing content
    cardsContainer.innerHTML = '';
    
    // Create main statistics cards
    const cards = [
        {
            title: 'Global E-Commerce Sales',
            value: data.consumption.salesGlobal[data.consumption.salesGlobal.length - 1],
            unit: 'Trillion USD',
            trend: `+${data.consumption.growth[data.consumption.growth.length - 1]}% YoY`,
            trendUp: true,
            icon: 'shopping-cart',
            class: 'sales-card'
        },
        {
            title: 'Packaging Waste',
            value: data.packaging.plastic.amounts[data.packaging.plastic.amounts.length - 1],
            unit: 'Million Metric Tons',
            trend: 'Plastic packaging waste',
            trendUp: true,
            icon: 'package',
            class: 'packaging-card'
        },
        {
            title: 'CO₂ from Last-Mile',
            value: data.transport.totalCO2.lastMile,
            unit: 'Million Tons CO₂',
            trend: `${data.transport.emissionsFactors.lastMile}g CO₂ per parcel`,
            trendUp: true,
            icon: 'truck',
            class: 'transport-card'
        },
        {
            title: 'Returns to Landfill',
            value: data.returns.totalWaste,
            unit: 'Million Metric Tons',
            trend: `${Math.round(data.returns.notResold * 100)}% of returns never resold`,
            trendUp: true,
            icon: 'trash',
            class: 'waste-card'
        }
    ];
    
    // Create and append each card
    cards.forEach(cardData => {
        const card = createStatCard(cardData);
        cardsContainer.appendChild(card);
    });
}
/**
 * Creates a stat card element based on provided data
 * @param {Object} data - Card data including title, value, unit, trend, etc.
 * @returns {HTMLElement} The created card element
 */
function createStatCard(data) {
    const card = document.createElement('div');
    card.className = `stat-card ${data.class || ''}`;
    
    // Create icon based on type
    let iconSvg;
    switch (data.icon) {
        case 'shopping-cart':
            iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>';
            break;
        case 'package':
            iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>';
            break;
        case 'truck':
            iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>';
            break;
        case 'trash':
            iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
            break;
        default:
            iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
    }
    
    card.innerHTML = `
        <div class="card-icon">
            ${iconSvg}
        </div>
        <div class="card-content">
            <h3 class="card-title">${data.title}</h3>
            <div class="stat-number">
                <span class="counter" data-target="${data.value}">${data.value}</span>
                <span class="unit">${data.unit}</span>
            </div>
            <div class="trend ${data.trendUp ? 'trend-up' : 'trend-down'}">
                <span class="trend-icon">${data.trendUp ? '↑' : '↓'}</span>
                <span class="trend-text">${data.trend}</span>
            </div>
        </div>
        <div class="card-background"></div>
    `;
    
    return card;
}

// Export the functions for use in other modules
export { initializeStatCards, animateCounter };