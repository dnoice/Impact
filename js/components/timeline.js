// timeline.js - Implementation for interactive timeline components
// This file contains two timeline implementations:
// 1. Standard interactive timeline with animated markers
// 2. Material degradation timeline visualization

/**
 * Initializes the standard timeline component with
 * animated track, interactive markers, and expandable content
 */
function initializeTimeline() {
    const timeline = document.querySelector('.timeline-container');
    if (!timeline) return;
    
    // Create the timeline elements if they don't exist yet
    if (!timeline.querySelector('.timeline-track')) {
        createTimelineStructure(timeline);
    }
    
    // Set up intersection observer for scroll-based animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                timeline.classList.add('animated');
                
                // Animate the timeline markers sequentially
                const timelinePoints = timeline.querySelectorAll('.timeline-point');
                timelinePoints.forEach((point, index) => {
                    setTimeout(() => {
                        point.classList.add('appear');
                    }, 800 + (index * 300)); // Staggered animation
                });
                
                // Animate the particle flow after track appears
                setTimeout(() => {
                    const track = timeline.querySelector('.timeline-track');
                    if (track) {
                        const particle = document.createElement('div');
                        particle.classList.add('timeline-particle');
                        track.appendChild(particle);
                        
                        // When particle animation completes, create a new one
                        particle.addEventListener('animationend', () => {
                            particle.remove();
                            
                            // Create new particle if timeline is still in viewport
                            if (timeline.classList.contains('animated')) {
                                const newParticle = document.createElement('div');
                                newParticle.classList.add('timeline-particle');
                                track.appendChild(newParticle);
                            }
                        });
                    }
                }, 1200);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(timeline);
    
    // Set up interactive behavior for timeline points
    const timelinePoints = timeline.querySelectorAll('.timeline-point');
    timelinePoints.forEach(point => {
        // Hover effects
        point.addEventListener('mouseenter', () => {
            point.classList.add('hovered');
        });
        
        point.addEventListener('mouseleave', () => {
            point.classList.remove('hovered');
        });
        
        // Make points clickable to show/hide content
        point.addEventListener('click', () => {
            // Toggle expanded state
            const wasExpanded = point.classList.contains('expanded');
            
            // Close all other expanded points
            timelinePoints.forEach(p => {
                if (p !== point) p.classList.remove('expanded');
            });
            
            // Toggle this point
            point.classList.toggle('expanded');
            
            // Scroll expanded content into view if needed
            if (!wasExpanded && point.classList.contains('expanded')) {
                const content = point.querySelector('.timeline-content');
                if (content) {
                    // Use smooth scrolling to bring content into view
                    setTimeout(() => {
                        const rect = content.getBoundingClientRect();
                        const isInViewport = rect.top >= 0 && 
                                            rect.left >= 0 && 
                                            rect.bottom <= window.innerHeight && 
                                            rect.right <= window.innerWidth;
                                            
                        if (!isInViewport) {
                            content.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'nearest' 
                            });
                        }
                    }, 300); // Wait for expansion animation
                }
            }
        });
        
        // Add keyboard accessibility
        point.setAttribute('tabindex', '0');
        point.setAttribute('role', 'button');
        point.setAttribute('aria-expanded', 'false');
        
        point.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                point.click();
                point.setAttribute('aria-expanded', point.classList.contains('expanded'));
            }
        });
    });
}

/**
 * Creates the timeline structure with track, points, and content
 * @param {HTMLElement} container - The timeline container element
 */
function createTimelineStructure(container) {
    // Create timeline track
    const track = document.createElement('div');
    track.classList.add('timeline-track');
    container.appendChild(track);
    
    // Define timeline data points
    // In a real implementation, this would come from your data source
    const timelineData = [
        {
            year: 2015,
            title: 'E-Commerce Growth Acceleration',
            content: 'Global e-commerce sales reached $1.55 trillion, marking the beginning of rapid growth in the sector. This period saw a 25% year-over-year growth in e-commerce market size globally.',
            icon: 'chart-line'
        },
        {
            year: 2019,
            title: 'Peak Single-Use Packaging',
            content: 'E-commerce operations used approximately 2.1 billion pounds of plastic packaging. Single-use plastic packaging in e-commerce reached historic highs, with over 1 million metric tons used annually.',
            icon: 'package'
        },
        {
            year: 2020,
            title: 'Pandemic Acceleration',
            content: 'COVID-19 caused an unprecedented surge in online shopping. E-commerce sales grew by over 27.6% globally in a single year, with corresponding increases in packaging waste and delivery emissions.',
            icon: 'virus'
        },
        {
            year: 2023,
            title: 'Sustainable Packaging Initiatives',
            content: 'Major retailers began transitioning to more sustainable packaging options. Amazon reported eliminating over 1 million tons of packaging materials by 2023 through its Frustration-Free Packaging program.',
            icon: 'leaf'
        },
        {
            year: 2025,
            title: 'Current State',
            content: 'E-commerce represents 21% of global retail, with $6.86 trillion in annual sales. Packaging waste from online shopping exceeds 1.45 million metric tons of plastic annually, with projections showing continued growth.',
            icon: 'shopping-cart'
        }
    ];
    
    // Create timeline points and content
    timelineData.forEach((point, index) => {
        const timelinePoint = document.createElement('div');
        timelinePoint.classList.add('timeline-point');
        timelinePoint.style.left = `${(index / (timelineData.length - 1)) * 100}%`;
        
        // Create marker with icon
        const marker = document.createElement('div');
        marker.classList.add('timeline-marker');
        
        // Add icon based on type
        let iconSvg;
        switch (point.icon) {
            case 'chart-line':
                iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"></path><path d="m3 10 5 5 4-4 5 5"></path><path d="m14 10 7 7"></path></svg>';
                break;
            case 'package':
                iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><path d="M3.29 7 12 12l8.71-5"></path><path d="M12 22V12"></path></svg>';
                break;
            case 'virus':
                iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle><circle cx="5" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><path d="m8.5 8.5 7 7"></path><path d="m15.5 8.5-7 7"></path></svg>';
                break;
            case 'leaf':
                iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10s3-3 3-8c0 0 10 1 14 6-1 3-5 5-8 5s-7-2-7-2"></path><path d="M4 16c0 2 2 4 4 4s3-2 4-4"></path><path d="M12 12c-2 2-4 3-6 4"></path></svg>';
                break;
            case 'shopping-cart':
                iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>';
                break;
            default:
                iconSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>';
        }
        
        marker.innerHTML = iconSvg;
        timelinePoint.appendChild(marker);
        
        // Create year label
        const yearLabel = document.createElement('div');
        yearLabel.classList.add('timeline-year');
        yearLabel.textContent = point.year;
        timelinePoint.appendChild(yearLabel);
        
        // Create content area
        const content = document.createElement('div');
        content.classList.add('timeline-content');
        content.innerHTML = `
            <h4>${point.title}</h4>
            <p>${point.content}</p>
        `;
        timelinePoint.appendChild(content);
        
        // Add to timeline
        container.appendChild(timelinePoint);
    });
}

/**
 * Initializes the waste/material degradation timeline visualization
 * Shows how different e-commerce packaging materials degrade over time
 */
function initializeWasteTimeline() {
    const wasteTimeline = document.querySelector('.waste-timeline .wide-image');
    if (!wasteTimeline) return;
    
    // Create the waste timeline structure if it doesn't exist yet
    if (!wasteTimeline.querySelector('.timeline-track-horizontal')) {
        createWasteTimelineStructure(wasteTimeline);
    }
    
    // Add year indicator element that follows cursor
    let yearIndicator = wasteTimeline.querySelector('.timeline-year-indicator');
    if (!yearIndicator) {
        yearIndicator = document.createElement('div');
        yearIndicator.classList.add('timeline-year-indicator');
        yearIndicator.textContent = 'Present Day';
        wasteTimeline.appendChild(yearIndicator);
    }
    
    // Add timespan visualization
    const materials = ['Cardboard', 'LDPE Plastic', 'EPS Foam'];
    const materialDegradation = [
        { material: 'Cardboard', landfill: '1 year', marine: '2 months' },
        { material: 'LDPE Plastic', landfill: '500+ years', marine: '10-20 years' },
        { material: 'EPS Foam', landfill: '500+ years', marine: '50+ years' }
    ];
    
    // Interactive hover effect to show year progression
    wasteTimeline.addEventListener('mousemove', e => {
        const rect = wasteTimeline.getBoundingClientRect();
        const x = e.clientX - rect.left;
        
        // Calculate position as percentage of width
        const xPercent = (x / rect.width) * 100;
        
        // Map position to year (non-linear mapping to emphasize early changes)
        let year;
        if (xPercent < 10) {
            year = 'Present Day';
        } else if (xPercent < 25) {
            year = 'Year ' + Math.round(((xPercent - 10) / 15) * 50);
        } else if (xPercent < 50) {
            year = 'Year ' + Math.round(50 + ((xPercent - 25) / 25) * 150);
        } else if (xPercent < 75) {
            year = 'Year ' + Math.round(200 + ((xPercent - 50) / 25) * 300);
        } else {
            year = 'Year 500+';
        }
        
        // Update year indicator position and text
        yearIndicator.textContent = year;
        yearIndicator.style.left = `${xPercent}%`;
        
        // Update material state visualization based on position
        updateMaterialState(xPercent);
    });
    
    // Make it accessible via keyboard as well
    wasteTimeline.tabIndex = 0;
    wasteTimeline.setAttribute('role', 'slider');
    wasteTimeline.setAttribute('aria-valuemin', 0);
    wasteTimeline.setAttribute('aria-valuemax', 500);
    wasteTimeline.setAttribute('aria-valuenow', 0);
    wasteTimeline.setAttribute('aria-valuetext', 'Present Day');
    
    wasteTimeline.addEventListener('keydown', e => {
        let currentPosition = parseFloat(yearIndicator.style.left) || 0;
        
        // Left/right arrow keys to navigate the timeline
        if (e.key === 'ArrowLeft') {
            currentPosition = Math.max(0, currentPosition - 5);
            updateTimelinePosition(currentPosition);
        } else if (e.key === 'ArrowRight') {
            currentPosition = Math.min(100, currentPosition + 5);
            updateTimelinePosition(currentPosition);
        }
    });
    
    // Initialize the default state (present day)
    updateMaterialState(0);
    
    // Set up intersection observer to trigger animation when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                wasteTimeline.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(wasteTimeline);
    
    /**
     * Updates the timeline position and visuals based on keyboard navigation
     * @param {number} position - Position as percentage (0-100)
     */
    function updateTimelinePosition(position) {
        yearIndicator.style.left = `${position}%`;
        
        // Map position to year
        let year;
        if (position < 10) {
            year = 'Present Day';
        } else if (position < 25) {
            year = 'Year ' + Math.round(((position - 10) / 15) * 50);
        } else if (position < 50) {
            year = 'Year ' + Math.round(50 + ((position - 25) / 25) * 150);
        } else if (position < 75) {
            year = 'Year ' + Math.round(200 + ((position - 50) / 25) * 300);
        } else {
            year = 'Year 500+';
        }
        
        yearIndicator.textContent = year;
        wasteTimeline.setAttribute('aria-valuenow', Math.round(position * 5)); // 0-500 years
        wasteTimeline.setAttribute('aria-valuetext', year);
        
        // Update material state visualization
        updateMaterialState(position);
    }
    
    /**
     * Updates the visual state of materials based on timeline position
     * @param {number} percentPosition - Position as percentage (0-100)
     */
    function updateMaterialState(percentPosition) {
        // Get all material state indicators
        const materialStates = wasteTimeline.querySelectorAll('.material-state');
        
        materialStates.forEach(material => {
            const materialType = material.getAttribute('data-material');
            
            // Different degradation rates for different materials
            let degradationThreshold;
            let degradationRate;
            
            switch (materialType) {
                case 'cardboard':
                    // Cardboard degrades relatively quickly
                    degradationThreshold = 2; // Starts degrading at 2%
                    degradationRate = 10;     // Fully degraded by 12%
                    break;
                case 'plastic':
                    // Plastic degrades very slowly
                    degradationThreshold = 20;   // Starts degrading at 20%
                    degradationRate = 0.2;      // Full degradation takes a long time
                    break;
                case 'foam':
                    // Foam degrades extremely slowly
                    degradationThreshold = 30;   // Starts degrading at 30%
                    degradationRate = 0.15;     // Even slower degradation
                    break;
                default:
                    degradationThreshold = 10;
                    degradationRate = 1;
            }
            
            // Calculate degradation percentage
            let degradation = 0;
            
            if (percentPosition > degradationThreshold) {
                degradation = (percentPosition - degradationThreshold) * degradationRate;
                degradation = Math.min(100, degradation); // Cap at 100%
            }
            
            // Update visual state - change opacity of degradation layers
            const layers = material.querySelectorAll('.degradation-layer');
            layers.forEach((layer, index) => {
                const layerThreshold = parseFloat(layer.getAttribute('data-threshold') || 0);
                
                if (degradation >= layerThreshold) {
                    layer.style.opacity = 1;
                } else {
                    layer.style.opacity = 0;
                }
            });
            
            // Update text state description
            const stateText = material.querySelector('.material-state-text');
            if (stateText) {
                if (degradation < 5) {
                    stateText.textContent = 'Intact';
                } else if (degradation < 25) {
                    stateText.textContent = 'Degrading';
                } else if (degradation < 60) {
                    stateText.textContent = 'Partially Degraded';
                } else if (degradation < 90) {
                    stateText.textContent = 'Mostly Degraded';
                } else {
                    stateText.textContent = 'Fully Degraded';
                }
            }
        });
    }
}

/**
 * Creates the structure for the waste/material degradation timeline
 * @param {HTMLElement} container - The container element
 */
function createWasteTimelineStructure(container) {
    // Create horizontal timeline track
    const track = document.createElement('div');
    track.classList.add('timeline-track-horizontal');
    container.appendChild(track);
    
    // Add year markers
    const yearMarkers = [
        { year: 'Present', position: 5, class: 'year-marker-present' },
        { year: '50 Years', position: 20, class: 'year-marker-50' },
        { year: '100 Years', position: 35, class: 'year-marker-100' },
        { year: '250 Years', position: 65, class: 'year-marker-250' },
        { year: '500+ Years', position: 95, class: 'year-marker-500' }
    ];
    
    yearMarkers.forEach(marker => {
        const markerEl = document.createElement('div');
        markerEl.classList.add('year-marker', marker.class);
        markerEl.setAttribute('data-year', marker.year);
        markerEl.style.left = `${marker.position}%`;
        markerEl.textContent = marker.year;
        track.appendChild(markerEl);
    });
    
    // Create material degradation visualization
    const materials = [
        { 
            type: 'cardboard',
            name: 'Cardboard Box',
            stages: [
                { threshold: 0, description: 'Intact' },
                { threshold: 25, description: 'Softening' },
                { threshold: 50, description: 'Breaking down' },
                { threshold: 75, description: 'Nearly gone' },
                { threshold: 100, description: 'Fully degraded' }
            ]
        },
        { 
            type: 'plastic',
            name: 'Plastic Mailer',
            stages: [
                { threshold: 0, description: 'Intact' },
                { threshold: 25, description: 'Fragmenting' },
                { threshold: 50, description: 'Microplastics' },
                { threshold: 75, description: 'Microscopic fragments' },
                { threshold: 100, description: 'Nanoplastics (still present)' }
            ]
        },
        { 
            type: 'foam',
            name: 'Foam Packaging',
            stages: [
                { threshold: 0, description: 'Intact' },
                { threshold: 25, description: 'Breaking into pieces' },
                { threshold: 50, description: 'Fragmenting' },
                { threshold: 75, description: 'Microplastics' },
                { threshold: 100, description: 'Nanoplastics (still present)' }
            ]
        }
    ];
    
    // Create material visualization container
    const materialsContainer = document.createElement('div');
    materialsContainer.classList.add('materials-container');
    container.appendChild(materialsContainer);
    
    // Create visualization for each material
    materials.forEach(material => {
        const materialEl = document.createElement('div');
        materialEl.classList.add('material-state');
        materialEl.setAttribute('data-material', material.type);
        
        // Material label
        const label = document.createElement('div');
        label.classList.add('material-label');
        label.textContent = material.name;
        materialEl.appendChild(label);
        
        // Material visualization (image or representation)
        const visual = document.createElement('div');
        visual.classList.add('material-visual');
        
        // Create base material image
        const baseImage = document.createElement('div');
        baseImage.classList.add('material-base');
        baseImage.classList.add(`${material.type}-base`);
        visual.appendChild(baseImage);
        
        // Create degradation layers
        material.stages.forEach((stage, index) => {
            if (index > 0) { // Skip the first stage (intact)
                const layer = document.createElement('div');
                layer.classList.add('degradation-layer');
                layer.classList.add(`${material.type}-degradation-${index}`);
                layer.setAttribute('data-threshold', stage.threshold);
                visual.appendChild(layer);
            }
        });
        
        materialEl.appendChild(visual);
        
        // Current state text
        const stateText = document.createElement('div');
        stateText.classList.add('material-state-text');
        stateText.textContent = 'Intact';
        materialEl.appendChild(stateText);
        
        // Degradation timeline indicator
        const timeIndicator = document.createElement('div');
        timeIndicator.classList.add('material-timeline');
        
        // Different timeline for each material
        let timeText;
        switch (material.type) {
            case 'cardboard':
                timeText = 'Degrades in ~2-12 months';
                break;
            case 'plastic':
                timeText = 'Takes 100-500+ years to degrade';
                break;
            case 'foam':
                timeText = 'May never fully degrade (500+ years)';
                break;
        }
        
        timeIndicator.textContent = timeText;
        materialEl.appendChild(timeIndicator);
        
        // Add to container
        materialsContainer.appendChild(materialEl);
    });
    
    // Add note about microplastics
    const note = document.createElement('div');
    note.classList.add('timeline-note');
    note.innerHTML = '<strong>Note:</strong> Plastic and foam materials never truly "disappear" - they break down into micro and nanoplastics that persist in the environment for centuries.';
    container.appendChild(note);
}

// Export functions for use in main.js
export { initializeTimeline, initializeWasteTimeline };