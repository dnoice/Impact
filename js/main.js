// main.js - Main application orchestration file
// This file serves as the central coordinator for all dashboard components,
// handling initialization, event coordination, and data management.

// Import component initializers
import { initializeThemeToggle } from './components/theme-switcher.js';
import { initializeStatCards, animateCounter } from './components/cards.js';
import { initializeTimeline, initializeWasteTimeline } from './components/timeline.js';
import { initializeCustomCursor } from './components/custom-cursor.js';
import { initializeNavigation } from './components/navigation.js';

// Import visualization modules
import { createGrowthChart } from './visualizations/growth-chart.js';
import { createReturnRatesChart } from './visualizations/return-rates.js';
import { createProjectionChart } from './visualizations/projection-chart.js';
import { createEmissionsMap } from './visualizations/emissions-map.js';
import { createPackagingChart } from './visualizations/packaging-chart.js';

// Import utility functions
import { setupLazyLoading, adaptToDeviceCapabilities } from './utils/performance.js';
import { createScrollObserver } from './utils/intersection-observer.js';
import { debounce, throttle } from './utils/throttle-debounce.js';
import { loadDashboardData } from './utils/data-loader.js';

// Application initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing E-Commerce Environmental Impact Dashboard');
    
    // First, check for device capabilities and adapt accordingly
    // This allows us to optimize performance based on the user's device
    adaptToDeviceCapabilities();
    
    // Set up performance optimizations like lazy loading for off-screen content
    setupLazyLoading();
    
    // Initialize core UI components that should be active immediately
    initializeThemeToggle();
    initializeNavigation();
    initializeCustomCursor();
    
    // Create scroll observers for animation triggers
    // This sets up the intersection observers that trigger animations as content scrolls into view
    initializeScrollAnimations();
    
    // Load data before initializing visualizations
    // This ensures we have the environmental impact data before rendering charts
    loadDashboardData()
        .then(dashboardData => {
            // Store data for global access
            window.dashboardData = dashboardData;
            
            // Initialize interactive components
            initializeStatCards();
            initializeTimeline();
            initializeWasteTimeline();
            
            // Create data visualizations
            createGrowthChart();
            createReturnRatesChart();
            createProjectionChart();
            createEmissionsMap();
            createPackagingChart();
            
            // Initialize growth rate toggle buttons
            initializeGrowthToggles();
            
            // Create global update function for charts
            // This allows us to update all visualizations when data or dimensions change
            window.updateAllCharts = function() {
                createGrowthChart();
                createReturnRatesChart();
                createProjectionChart();
                createEmissionsMap();
                createPackagingChart();
            };
            
            // Show success message in console
            console.log('Dashboard initialized successfully with data:', dashboardData);
        })
        .catch(error => {
            console.error('Error initializing dashboard:', error);
            
            // Fallback to mock data if loading fails
            // This ensures the dashboard can still function even if the data API is down
            const mockData = generateMockData();
            window.dashboardData = mockData;
            
            // Initialize with mock data
            initializeStatCards();
            initializeTimeline();
            initializeWasteTimeline();
            
            createGrowthChart();
            createReturnRatesChart();
            createProjectionChart();
            createEmissionsMap();
            createPackagingChart();
            
            initializeGrowthToggles();
            
            // Show warning message to user
            const errorBanner = document.createElement('div');
            errorBanner.classList.add('error-banner');
            errorBanner.innerHTML = `
                <p>Unable to load live data. Displaying sample data for demonstration purposes.</p>
                <button class="close-btn">&times;</button>
            `;
            document.body.prepend(errorBanner);
            
            // Add close functionality to error banner
            errorBanner.querySelector('.close-btn').addEventListener('click', () => {
                errorBanner.remove();
            });
        });
    
    // Set up window resize handler with debounce to avoid performance issues
    // This ensures our visualizations adapt to screen size changes
    window.addEventListener('resize', debounce(() => {
        if (window.updateAllCharts) {
            window.updateAllCharts();
        }
    }, 250));
});

/**
 * Initializes all scroll-based animations using Intersection Observer
 * Sets up observers for different elements that should animate when scrolled into view
 */
function initializeScrollAnimations() {
    // Create fade-in animation for sections
    const fadeInObserver = createScrollObserver({ threshold: 0.15 });
    fadeInObserver('.fade-in', element => {
        element.classList.add('visible');
    });
    
    // Animate stat numbers when they come into view
    const counterObserver = createScrollObserver({ threshold: 0.5 });
    counterObserver('.counter[data-target]', element => {
        animateCounter(element);
    });
    
    // Staggered animations for card elements
    const staggerObserver = createScrollObserver({ threshold: 0.2 });
    staggerObserver('.staggered-fade-in', section => {
        section.classList.add('visible');
    });
    
    // Add specific observer for impact cards grid
    const impactGridObserver = createScrollObserver({ threshold: 0.2 });
    impactGridObserver('.impact-grid', grid => {
        const cards = grid.querySelectorAll('.impact-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in', 'visible');
            }, index * 150); // Staggered delay for each card
        });
    });
    
    // Observer for section headers to trigger a subtle animation
    const headerObserver = createScrollObserver({ threshold: 0.5 });
    headerObserver('.section-title', element => {
        element.classList.add('animated');
    });
    
    // Observer for the charts to ensure they animate in when visible
    const chartObserver = createScrollObserver({ threshold: 0.3 });
    chartObserver('.chart-wrapper', wrapper => {
        wrapper.classList.add('visible');
        // Find the chart inside the wrapper and trigger any specific animation it might have
        const chart = wrapper.querySelector('.chart');
        if (chart) {
            chart.classList.add('animate');
        }
    });
}

/**
 * Initializes the growth toggle buttons for the projections chart
 * Sets up event listeners and default state
 */
function initializeGrowthToggles() {
    const toggles = document.querySelectorAll('.growth-toggle');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            // Update active state
            toggles.forEach(t => t.classList.remove('active'));
            toggle.classList.add('active');
            
            // Get selected rate
            const rate = toggle.getAttribute('data-rate');
            
            // Update projection chart based on selected growth rate
            if (window.dashboardData && window.dashboardData.projections) {
                const growthRate = parseFloat(rate) / 100; // Convert percentage to decimal
                window.dashboardData.projections.activeRate = growthRate;
                createProjectionChart(); // Redraw the chart with new rate
            }
        });
    });
    
    // Set default active toggle if not already set
    if (!document.querySelector('.growth-toggle.active')) {
        const defaultToggle = document.querySelector('.growth-toggle[data-rate="5"]') || toggles[0];
        if (defaultToggle) {
            defaultToggle.classList.add('active');
        }
    }
}

/**
 * Generates mock data for fallback use when data loading fails
 * @returns {Object} Mock dashboard data with realistic values
 */
function generateMockData() {
    return {
        consumption: {
            years: [2021, 2022, 2023, 2024, 2025, 2026, 2027],
            salesGlobal: [4.98, 5.29, 5.82, 6.33, 6.86, 7.41, 7.96], // in trillion USD
            growth: [17.42, 6.22, 9.07, 8.76, 8.37, 7.99, 7.42], // year-over-year %
            categories: {
                electronics: 922.5, // billions USD
                fashion: 760.0,
                food: 708.8,
                diy: 220.2,
                furniture: 220.1
            }
        },
        packaging: {
            plastic: {
                years: [2019, 2020, 2021, 2022, 2023, 2027],
                amounts: [1.0, 1.3, 1.5, 1.76, 1.45, 3.11] // million metric tons
            },
            cardboard: {
                global: 165, // million metric tons in 2023
                ecommerceShare: 0.8 // 80% of corrugated is for e-commerce
            },
            degradation: {
                cardboard: {
                    landfill: "12 months",
                    marine: "2 months"
                },
                plastic: {
                    landfill: "500 years",
                    marine: "100 years"
                },
                foam: {
                    landfill: "500+ years",
                    marine: "50+ years"
                }
            },
            materials: [
                { name: "Plastic Film", amount: 1.45, recyclable: 0.13, color: "var(--color-accent-500)" },
                { name: "Cardboard", amount: 132, recyclable: 0.69, color: "var(--color-primary-500)" },
                { name: "Foam", amount: 0.87, recyclable: 0.05, color: "var(--color-error-500)" },
                { name: "Mixed Materials", amount: 0.62, recyclable: 0.08, color: "var(--color-info-500)" }
            ]
        },
        transport: {
            emissionsFactors: {
                ocean: 19, // g CO2/ton-km
                air: 1054, // g CO2/ton-km
                truck: 85, // g CO2/ton-km
                lastMile: 100 // g CO2/parcel
            },
            totalCO2: {
                lastMile: 65, // million tonnes in 2022
                projected2030: 120 // million tonnes by 2030
            },
            vehicles: {
                electric: 0.15,
                hybrid: 0.25,
                conventional: 0.60
            },
            modes: [
                { mode: "Air Freight", emissions: 1054, share: 0.08, color: "var(--color-error-500)" },
                { mode: "Truck", emissions: 85, share: 0.22, color: "var(--color-warning-500)" },
                { mode: "Ocean", emissions: 19, share: 0.57, color: "var(--color-info-500)" },
                { mode: "Rail", emissions: 28, share: 0.13, color: "var(--color-success-500)" }
            ]
        },
        returns: {
            notResold: 0.44, // 44% of returns never resold
            landfill: 0.25, // 25% of unreturned items go to landfill
            recycled: 0.50, // 50% of unreturned items recycled
            incinerated: 0.14, // 14% of unreturned items incinerated
            totalWaste: 4.3, // million metric tons sent to landfill in 2022
            categoryRates: [
                { category: "Clothing", rate: 0.30, color: "var(--color-accent-500)" },
                { category: "Shoes", rate: 0.17, color: "var(--color-primary-500)" },
                { category: "Electronics", rate: 0.12, color: "var(--color-error-500)" },
                { category: "Home Goods", rate: 0.08, color: "var(--color-info-500)" },
                { category: "Beauty", rate: 0.05, color: "var(--color-success-500)" }
            ]
        },
        projections: {
            baselineYear: 2025,
            activeRate: 0.05, // Default active growth rate (5%)
            growth: {
                low: 0.02, // 2% annual growth
                medium: 0.05, // 5% annual growth
                high: 0.10 // 10% annual growth
            },
            baseline: {
                plastic: 1.45, // million metric tons of packaging
                co2: 65, // million tons from last-mile delivery
                cardboard: 165, // million metric tons
                energy: 120 // arbitrary digital infrastructure units
            },
            scenarios: {
                businessAsUsual: {
                    description: "Current trends continue",
                    factors: {
                        electricVehicles: 0.3,
                        sustainablePackaging: 0.25,
                        renewableEnergy: 0.4
                    }
                },
                acceleratedTransition: {
                    description: "Rapid transition to sustainable practices",
                    factors: {
                        electricVehicles: 0.8,
                        sustainablePackaging: 0.7,
                        renewableEnergy: 0.9
                    }
                },
                modestImprovements: {
                    description: "Slow but steady improvements",
                    factors: {
                        electricVehicles: 0.5,
                        sustainablePackaging: 0.4,
                        renewableEnergy: 0.6
                    }
                }
            },
            years: [2025, 2030, 2035, 2050]
        },
        infrastructure: {
            dataCenter: {
                energyUse: 240, // TWh in 2022
                renewablePercentage: 0.64,
                pue: 1.10,
                growthRate: 0.13
            },
            deviceEnergy: {
                mobileWeb: 0.0027, // Wh per page view
                desktopWeb: 0.0045, // Wh per page view
                search: 0.3, // Wh per search
                payment: 0.00649 // kWh per transaction
            }
        }
    };
}

// Export key functions that may be needed by other modules
export { animateCounter, initializeScrollAnimations };