# E-Commerce Environmental Impact Dashboard: Development Blueprint

## Project Overview

We're creating an interactive dashboard that visualizes the environmental impact of e-commerce through sophisticated data visualizations and engaging UI components. The dashboard will feature a modular, component-based architecture with extensive interactivity to engage users with the content.

## Core Principles

1. **Fully Interactive UI**: All elements that visually suggest interactivity must be functional
2. **Responsive Design**: Fluid layout working across all viewport sizes
3. **Performance Optimization**: Lazy-loading for off-screen content, optimized animations
4. **Accessibility**: ARIA compliance, keyboard navigation, focus management
5. **Theming**: Robust dark/light mode implementation

## Project Structure

```
e-commerce-impact/
├── index.html
├── css/
│   ├── main.css
│   ├── components/
│   │   ├── variables.css     
│   │   ├── reset.css          
│   │   ├── typography.css     
│   │   ├── layout.css         
│   │   ├── navigation.css     
│   │   ├── hero.css           
│   │   ├── cards.css          
│   │   ├── charts.css         
│   │   ├── callouts.css       
│   │   ├── timeline.css       
│   │   ├── tables.css         
│   │   ├── buttons.css        
│   │   ├── cursor.css         
│   │   └── footer.css         
│   └── utils/                 # Utility styles
│       ├── animations.css     
│       ├── gradients.css      
│       ├── shapes.css         
│       └── utilities.css     
├── js/
│   ├── main.js                # Main application logic
│   ├── components/            # Component-specific JS
│   │   ├── navigation.js
│   │   ├── theme-switcher.js
│   │   ├── animations.js
│   │   ├── cards.js
│   │   ├── timeline.js
│   │   └── custom-cursor.js
│   ├── visualizations/        # D3.js visualization module
│   │   ├── growth-chart.js
│   │   ├── return-rates.js
│   │   ├── projection-chart.js
│   │   └── emissions-map.js
│   └── utils/
│       ├── intersection-observer.js
│       ├── animations.js
│       └── throttle-debounce.js
├── assets/
│   ├── images/
│   │   ├── growth/
│   │   ├── packaging/
│   │   ├── transport/
│   │   ├── holidays/
│   │   ├── waste/
│   │   ├── bg-textures/
│   │   ├── bg-patterns/
│   │   └── infrastructure/
│   └── fonts/
└── data/
    ├── consumption.json
    ├── packaging.json
    ├── transport.json
    └── projections.json
```

## Dependencies & Libraries

1. **D3.js** (v7.x) - For all data visualizations
2. **Intersection Observer API** - For scroll-triggered animations
3. **Topojson** - For map visualizations
4. **GSAP** (optional) - For advanced animations
5. **Vanilla JavaScript** - No framework dependency required

## Interactive Elements Implementation

### 1. Theme Toggle

```javascript
// Implementation in theme-switcher.js
function initializeThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved preferences or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateToggleState(savedTheme === 'dark');
    } else if (prefersDarkScheme.matches) {
        htmlElement.setAttribute('data-theme', 'dark');
        updateToggleState(true);
    }
    
    // Toggle functionality
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Apply theme change with transition
        htmlElement.classList.add('theme-transition');
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggleState(newTheme === 'dark');
        
        // Remove transition class after animation completes
        setTimeout(() => {
            htmlElement.classList.remove('theme-transition');
        }, 500);
    });
    
    // Update toggle visual state
    function updateToggleState(isDark) {
        const indicator = themeToggle.querySelector('.theme-toggle-indicator');
        indicator.style.transform = isDark ? 'translateX(24px)' : 'translateX(0)';
        // Optional: update ARIA attributes
        themeToggle.setAttribute('aria-pressed', isDark);
    }
}
```

### 2. Interactive Stat Cards with 3D Effect

```javascript
// Implementation in cards.js
function initializeStatCards() {
    const cards = document.querySelectorAll('.stat-card, .transport-card');
    
    cards.forEach(card => {
        // 3D tilt effect on mouse move
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation values
            const cardWidth = card.offsetWidth;
            const cardHeight = card.offsetHeight;
            const rotateY = ((x / cardWidth) - 0.5) * 10; // -5 to 5 degrees
            const rotateX = ((y / cardHeight) - 0.5) * -10; // 5 to -5 degrees
            
            // Apply 3D transform
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            
            // Update light reflection effect
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
        
        // Reset on mouse leave with smooth transition
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s ease';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            
            // Clear transition after animation completes
            setTimeout(() => {
                card.style.transition = '';
            }, 500);
        });
        
        // Add particle effects for hover state
        addParticlesToCard(card);
        
        // Initialize counter animation when card becomes visible
        initializeCounter(card.querySelector('.counter'));
    });
}

// Particle effect helper function
function addParticlesToCard(card) {
    const particlesContainer = document.createElement('div');
    particlesContainer.classList.add('particles');
    card.appendChild(particlesContainer);
    
    // Create individual particles with random properties
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random position and direction
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.setProperty('--x', Math.random() * 2 - 1);
        particle.style.setProperty('--y', Math.random() * 2 - 1);
        
        particlesContainer.appendChild(particle);
    }
}

// Counter animation 
function initializeCounter(counterElement) {
    if (!counterElement) return;
    
    const targetValue = parseFloat(counterElement.dataset.target);
    const decimalPlaces = (targetValue % 1 !== 0) ? 2 : 0;
    let currentValue = 0;
    const duration = 2000; // ms
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounterAnimation();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(counterElement);
    
    function startCounterAnimation() {
        const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            currentValue = progress * targetValue;
            
            counterElement.textContent = currentValue.toFixed(decimalPlaces);
            
            if (frame === totalFrames) {
                clearInterval(counter);
                counterElement.textContent = targetValue.toFixed(decimalPlaces);
            }
        }, frameDuration);
    }
}
```

### 3. Interactive Timeline

```javascript
// Implementation in timeline.js
function initializeTimeline() {
    const timeline = document.querySelector('.timeline-container');
    if (!timeline) return;
    
    // Animated timeline track with flowing particle
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                timeline.classList.add('animated');
                
                // Animate the particle flow after track appears
                setTimeout(() => {
                    const track = timeline.querySelector('.timeline-track');
                    if (track) {
                        const particle = document.createElement('div');
                        particle.classList.add('timeline-particle');
                        track.appendChild(particle);
                        
                        // Animate particle along the track
                        particle.style.animation = 'trackParticle 3s cubic-bezier(0.23, 1, 0.32, 1) forwards';
                    }
                }, 1200);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(timeline);
    
    // Interactive timeline markers with hover effects
    const timelinePoints = timeline.querySelectorAll('.timeline-point');
    timelinePoints.forEach(point => {
        point.addEventListener('mouseenter', () => {
            point.classList.add('hovered');
        });
        
        point.addEventListener('mouseleave', () => {
            point.classList.remove('hovered');
        });
        
        // Make entire point area clickable to show more information
        point.addEventListener('click', () => {
            // Toggle expanded state
            timelinePoints.forEach(p => {
                if (p !== point) p.classList.remove('expanded');
            });
            point.classList.toggle('expanded');
            
            // Scroll expanded content into view if needed
            if (point.classList.contains('expanded')) {
                const content = point.querySelector('.timeline-content');
                if (content) {
                    content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        });
    });
}
```

### 4. Material Degradation Timeline (Waste Visualization)

```javascript
// Implementation in timeline.js
function initializeWasteTimeline() {
    const wasteTimeline = document.querySelector('.waste-timeline .wide-image');
    if (!wasteTimeline) return;
    
    // Add year indicator element
    const yearIndicator = document.createElement('div');
    yearIndicator.classList.add('timeline-year-indicator');
    yearIndicator.textContent = 'Present Day';
    wasteTimeline.appendChild(yearIndicator);
    
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
        wasteTimeline.appendChild(markerEl);
    });
    
    // Interactive hover effect to show year progression
    wasteTimeline.addEventListener('mousemove', e => {
        const rect = wasteTimeline.getBoundingClientRect();
        const x = e.clientX - rect.left;
        
        // Calculate position as percentage of width
        const xPercent = (x / rect.width) * 100;
        
        // Map position to year (non-linear mapping)
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
    
    // Function to update the visual state of materials based on timeline position
    function updateMaterialState(percentPosition) {
        // This would interact with the visualization to show degradation states
        // For the real implementation, we'll need to work with the actual image
        // or create an overlay system that changes based on position
        
        // Example concept: adjust opacity of degradation overlays
        const degradationLayers = wasteTimeline.querySelectorAll('.degradation-layer');
        if (degradationLayers.length) {
            degradationLayers.forEach(layer => {
                const startVisible = parseFloat(layer.dataset.startPercent || 0);
                const fullVisible = parseFloat(layer.dataset.fullPercent || 100);
                
                if (percentPosition < startVisible) {
                    layer.style.opacity = 0;
                } else if (percentPosition > fullVisible) {
                    layer.style.opacity = 1;
                } else {
                    layer.style.opacity = (percentPosition - startVisible) / (fullVisible - startVisible);
                }
            });
        }
    }
}
```

### 5. D3.js Visualizations - Growth Chart Example

```javascript
// Implementation in growth-chart.js
function createGrowthChart() {
    // E-commerce growth data
    const data = [
        { year: 2021, sales: 4.98 },
        { year: 2022, sales: 5.29 },
        { year: 2023, sales: 5.82 },
        { year: 2024, sales: 6.33 },
        { year: 2025, sales: 6.86 },
        { year: 2026, sales: 7.41 },
        { year: 2027, sales: 7.96 }
    ];

    // Set dimensions and margins
    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const width = document.getElementById('growth-chart').clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Remove any existing SVG
    d3.select('#growth-chart').select('svg').remove();
    
    // Create SVG element
    const svg = d3.select('#growth-chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create X scale
    const x = d3.scaleLinear()
        .domain([2021, 2027])
        .range([0, width]);

    // Create Y scale
    const y = d3.scaleLinear()
        .domain([0, 10])
        .range([height, 0]);

    // Create the line generator
    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.sales))
        .curve(d3.curveMonotoneX);

    // Add X axis
    svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format('d')))
        .selectAll('text')
        .style('font-size', '12px');

    // Add Y axis
    svg.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(y).tickFormat(d => `$${d}T`))
        .selectAll('text')
        .style('font-size', '12px');

    // Add grid lines
    svg.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSize(-height).tickFormat(''))
        .style('opacity', 0.1);

    svg.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y).tickSize(-width).tickFormat(''))
        .style('opacity', 0.1);

    // Create gradient for line
    const gradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', 'line-gradient')
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0)
        .attr('y1', y(4))
        .attr('x2', 0)
        .attr('y2', y(10));
        
    gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', 'var(--color-primary-500)');
        
    gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', 'var(--color-accent-500)');

    // Add path with animated reveal
    const path = svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'url(#line-gradient)')
        .attr('stroke-width', 3)
        .attr('d', line)
        .attr('stroke-dasharray', function() {
            const totalLength = this.getTotalLength();
            return `${totalLength} ${totalLength}`;
        })
        .attr('stroke-dashoffset', function() {
            return this.getTotalLength();
        });

    // Animate path on scroll into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                path.transition()
                    .duration(2000)
                    .ease(d3.easeCubicOut)
                    .attr('stroke-dashoffset', 0);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(document.getElementById('growth-chart'));

    // Add data points with animation
    const points = svg.selectAll('.data-point')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'data-point')
        .attr('cx', d => x(d.year))
        .attr('cy', d => y(d.sales))
        .attr('r', 0)
        .attr('fill', 'var(--color-accent-500)')
        .attr('stroke', 'var(--color-bg-primary)')
        .attr('stroke-width', 2);
    
    // Animate points
    const pointObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                points.transition()
                    .delay((d, i) => 2000 + i * 200)
                    .duration(500)
                    .attr('r', 6);
                
                pointObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    pointObserver.observe(document.getElementById('growth-chart'));

    // Add tooltips
    const tooltip = d3.select('#growth-chart')
        .append('div')
        .attr('class', 'chart-tooltip')
        .style('opacity', 0);

    points.on('mouseover', function(event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr('r', 8);
            
        tooltip.transition()
            .duration(200)
            .style('opacity', 1);
            
        tooltip.html(`<strong>${d.year}</strong><br>$${d.sales} trillion`)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 15) + 'px');
    })
    .on('mouseout', function() {
        d3.select(this)
            .transition()
            .duration(200)
            .attr('r', 6);
            
        tooltip.transition()
            .duration(500)
            .style('opacity', 0);
    });

    // Make chart responsive
    function updateChart() {
        const updatedWidth = document.getElementById('growth-chart').clientWidth - margin.left - margin.right;
        
        // Update scales
        x.range([0, updatedWidth]);
        
        // Update axes
        svg.select('.x-axis')
            .call(d3.axisBottom(x).tickFormat(d3.format('d')));
            
        svg.select('.y-axis')
            .call(d3.axisLeft(y).tickFormat(d => `$${d}T`));
            
        // Update grid
        svg.selectAll('.grid')
            .remove();
            
        svg.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x).tickSize(-height).tickFormat(''))
            .style('opacity', 0.1);
            
        svg.append('g')
            .attr('class', 'grid')
            .call(d3.axisLeft(y).tickSize(-updatedWidth).tickFormat(''))
            .style('opacity', 0.1);
            
        // Update line and points
        svg.select('path')
            .attr('d', line);
            
        svg.selectAll('.data-point')
            .attr('cx', d => x(d.year))
            .attr('cy', d => y(d.sales));
    }
    
    // Add window resize listener
    window.addEventListener('resize', debounce(updateChart, 250));
}

// Debounce function to limit resize events
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}
```

### 6. Custom Cursor Implementation

```javascript
// Implementation in custom-cursor.js
function initializeCustomCursor() {
    const cursor = document.querySelector('.cursor-follower');
    if (!cursor) return;
    
    // Initial setup - hide cursor until mouse moves
    cursor.style.opacity = '0';
    
    // Follow mouse position
    document.addEventListener('mousemove', e => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        
        // Show cursor if it was hidden
        if (cursor.style.opacity === '0') {
            cursor.style.opacity = '1';
        }
    });
    
    // Hide when mouse leaves the document
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    // Enhanced interactivity for clickable elements
    const interactiveElements = document.querySelectorAll('a, button, .nav-link, .theme-toggle, .timeline-point, .stat-card, .transport-card');
    
    interactiveElements.forEach(element => {
        // Expand cursor on hover
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-expanded');
        });
        
        // Return to normal on leave
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-expanded');
        });
        
        // Add click effect
        element.addEventListener('mousedown', () => {
            cursor.classList.add('cursor-clicked');
        });
        
        element.addEventListener('mouseup', () => {
            cursor.classList.remove('cursor-clicked');
        });
    });
    
    // Special effects for specific elements
    const accentElements = document.querySelectorAll('.accent, .key-stat-number, .stat-number, .holiday-card-stat');
    
    accentElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-accent');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-accent');
        });
    });
}
```

### 7. Projection Chart with Interactive Growth Rate Toggles

```javascript
// Implementation in projection-chart.js
function createProjectionChart() {
    // Base data setup
    const baselineYear = 2025;
    const baselineData = {
        'plastic': 1.45, // Million Metric Tons of plastic packaging 
        'co2': 65, // Million tons CO2 from last-mile delivery
        'cardboard': 165, // Million Metric Tons of corrugated board
        'energy': 120 // Arbitrary digital infrastructure energy units
    };
    
    // Growth rates
    const growthRates = {
        '2': 0.02,
        '5': 0.05,
        '10': 0.10
    };
    
    // Projection periods
    const years = [2025, 2030, 2035, 2050];
    const chartContainer = document.getElementById('projection-chart');
    
    // Setup growth rate toggles
    const toggles = document.querySelectorAll('.growth-toggle');
    let activeRate = '5'; // Default
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            // Update active state
            toggles.forEach(t => t.classList.remove('active'));
            toggle.classList.add('active');
            
            // Get selected rate
            activeRate = toggle.getAttribute('data-rate');
            
            // Update chart
            updateChart(activeRate);
        });
    });
    
    // Initial chart creation with default rate
    createChart(activeRate);
    
    function createChart(rate) {
        // Calculate projections
        const projectedData = calculateProjections(rate);
        
        // Set dimensions and margins
        const margin = { top: 40, right: 80, bottom: 60, left: 60 };
        const width = chartContainer.clientWidth - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
        
        // Remove any existing SVG
        d3.select(chartContainer).select('svg').remove();
        
        // Create SVG
        const svg = d3.select(chartContainer)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
            
        // Create scales
        const x = d3.scaleBand()
            .domain(years)
            .range([0, width])
            .padding(0.2);
            
        const y = d3.scaleLinear()
            .domain([0, d3.max(projectedData, d => Math.max(d.plastic, d.co2, d.cardboard, d.energy)) * 1.1])
            .range([height, 0]);
            
        // Create color scale
        const color = d3.scaleOrdinal()
            .domain(['plastic', 'co2', 'cardboard', 'energy'])
            .range(['var(--color-accent-500)', 'var(--color-warning)', 'var(--color-primary-500)', 'var(--color-info)']);
            
        // Add X axis
        svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .style('font-size', '12px');
            
        // Add Y axis
        svg.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(y))
            .selectAll('text')
            .style('font-size', '12px');
            
        // Add grid lines
        svg.append('g')
            .attr('class', 'grid')
            .call(d3.axisLeft(y).tickSize(-width).tickFormat(''))
            .style('opacity', 0.1);
            
        // Create groups for each year
        const yearGroups = svg.selectAll('.year-group')
            .data(projectedData)
            .enter()
            .append('g')
            .attr('class', 'year-group')
            .attr('transform', d => `translate(${x(d.year)},0)`);
            
        // Create stacked bars for each impact type
        const barWidth = x.bandwidth() / 4;
        
        // Plastic bars
        yearGroups.append('rect')
            .attr('class', 'impact-bar plastic-bar')
            .attr('x', 0)
            .attr('y', d => y(d.plastic))
            .attr('width', barWidth)
            .attr('height', d => height - y(d.plastic))
            .attr('fill', color('plastic'))
            .attr('rx', 2)
            .style('opacity', 0)
            .transition()
            .duration(800)
            .delay((d, i) => i * 100)
            .style('opacity', 1);
            
        // CO2 bars
        yearGroups.append('rect')
            .attr('class', 'impact-bar co2-bar')
            .attr('x', barWidth)
            .attr('y', d => y(d.co2))
            .attr('width', barWidth)
            .attr('height', d => height - y(d.co2))
            .attr('fill', color('co2'))
            .attr('rx', 2)
            .style('opacity', 0)
            .transition()
            .duration(800)
            .delay((d, i) => i * 100 + 100)
            .style('opacity', 1);
            
        // Cardboard bars
        yearGroups.append('rect')
            .attr('class', 'impact-bar cardboard-bar')
            .attr('x', barWidth * 2)
            .attr('y', d => y(d.cardboard))
            .attr('width', barWidth)
            .attr('height', d => height - y(d.cardboard))
            .attr('fill', color('cardboard'))
            .attr('rx', 2)
            .style('opacity', 0)
            .transition()
            .duration(800)
            .delay((d, i) => i * 100 + 200)
            .style('opacity', 1);
            
        // Energy bars
        yearGroups.append('rect')
            .attr('class', 'impact-bar energy-bar')
            .attr('x', barWidth * 3)
            .attr('y', d => y(d.energy))
            .attr('width', barWidth)
            .attr('height', d => height - y(d.energy))
            .attr('fill', color('energy'))
            .attr('rx', 2)
            .style('opacity', 0)
            .transition()
            .duration(800)
            .delay((d, i) => i * 100 + 300)
            .style('opacity', 1);
            
        // Add legend
        const legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${width - 120}, 0)`);
            
        const impacts = ['plastic', 'co2', 'cardboard', 'energy'];
        const impactLabels = ['Plastic Waste', 'CO₂ Emissions', 'Cardboard Waste', 'Energy Use'];
        
        impacts.forEach((impact, i) => {
            const legendItem = legend.append('g')
                .attr('transform', `translate(0, ${i * 25})`);
                
            legendItem.append('rect')
                .attr('width', 15)
                .attr('height', 15)
                .attr('fill', color(impact))
                .attr('rx', 2);
                
            legendItem.append('text')
                .attr('x', 20)
                .attr('y', 12)
                .style('font-size', '12px')
                .text(impactLabels[i]);
        });
        
        // Add tooltip
        const tooltip = d3.select(chartContainer)
            .append('div')
            .attr('class', 'chart-tooltip')
            .style('opacity', 0);
            
        // Add interactivity to bars
        svg.selectAll('.impact-bar')
            .on('mouseover', function(event, d) {
                const barType = this.getAttribute('class').split(' ')[1].split('-')[0];
                const year = d.year;
                const value = d[barType];
                const label = impactLabels[impacts.indexOf(barType)];
                
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('opacity', 0.8);
                    
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 1);
                    
                tooltip.html(`<strong>${year}</strong><br>${label}: ${value.toFixed(1)}`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 15) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('opacity', 1);
                    
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            });
            
        // Make chart responsive
        function updateChartSize() {
            const updatedWidth = chartContainer.clientWidth - margin.left - margin.right;
            
            // Update scales
            x.range([0, updatedWidth]);
            
            // Update SVG size
            d3.select(chartContainer).select('svg')
                .attr('width', updatedWidth + margin.left + margin.right);
                
            // Update axes
            svg.select('.x-axis')
                .call(d3.axisBottom(x));
                
            // Update grid
            svg.select('.grid')
                .call(d3.axisLeft(y).tickSize(-updatedWidth).tickFormat(''));
                
            // Update bar positions
            const newBarWidth = x.bandwidth() / 4;
            
            svg.selectAll('.year-group')
                .attr('transform', d => `translate(${x(d.year)},0)`);
                
            svg.selectAll('.plastic-bar')
                .attr('width', newBarWidth);
                
            svg.selectAll('.co2-bar')
                .attr('x', newBarWidth)
                .attr('width', newBarWidth);
                
            svg.selectAll('.cardboard-bar')
                .attr('x', newBarWidth * 2)
                .attr('width', newBarWidth);
                
            svg.selectAll('.energy-bar')
                .attr('x', newBarWidth * 3)
                .attr('width', newBarWidth);
                
            // Update legend position
            legend.attr('transform', `translate(${updatedWidth - 120}, 0)`);
        }
        
        // Add window resize listener
        window.addEventListener('resize', debounce(updateChartSize, 250));
    }
    
    function updateChart(rate) {
        // Calculate new projections
        const projectedData = calculateProjections(rate);
        
        // Get existing chart elements
        const svg = d3.select(chartContainer).select('svg g');
        const height = 400 - 40 - 60; // same as in createChart
        
        // Update Y scale
        const y = d3.scaleLinear()
            .domain([0, d3.max(projectedData, d => Math.max(d.plastic, d.co2, d.cardboard, d.energy)) * 1.1])
            .range([height, 0]);
            
        // Update Y axis
        svg.select('.y-axis')
            .transition()
            .duration(500)
            .call(d3.axisLeft(y));
            
        // Update grid
        svg.select('.grid')
            .transition()
            .duration(500)
            .call(d3.axisLeft(y).tickSize(-(chartContainer.clientWidth - 60 - 80)).tickFormat(''));
            
        // Update bars
        svg.selectAll('.plastic-bar')
            .data(projectedData)
            .transition()
            .duration(800)
            .attr('y', d => y(d.plastic))
            .attr('height', d => height - y(d.plastic));
            
        svg.selectAll('.co2-bar')
            .data(projectedData)
            .transition()
            .duration(800)
            .attr('y', d => y(d.co2))
            .attr('height', d => height - y(d.co2));
            
        svg.selectAll('.cardboard-bar')
            .data(projectedData)
            .transition()
            .duration(800)
            .attr('y', d => y(d.cardboard))
            .attr('height', d => height - y(d.cardboard));
            
        svg.selectAll('.energy-bar')
            .data(projectedData)
            .transition()
            .duration(800)
            .attr('y', d => y(d.energy))
            .attr('height', d => height - y(d.energy));
    }
    
    function calculateProjections(rate) {
        const growthRate = growthRates[rate];
        const projectedData = [];
        
        years.forEach(year => {
            const yearDiff = year - baselineYear;
            const multiplier = Math.pow(1 + growthRate, yearDiff);
            
            projectedData.push({
                year: year,
                plastic: baselineData.plastic * multiplier,
                co2: baselineData.co2 * multiplier,
                cardboard: baselineData.cardboard * multiplier,
                energy: baselineData.energy * multiplier
            });
        });
        
        return projectedData;
    }
}
```

## Animation and Performance Optimization

### Intersection Observer Implementation

```javascript
// utils/intersection-observer.js
function createScrollObserver(options = {}) {
    const defaultOptions = {
        threshold: 0.1,
        triggerOnce: true,
        rootMargin: '0px'
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    return function observeElements(selector, callback) {
        const elements = document.querySelectorAll(selector);
        
        if (!elements.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    callback(entry.target);
                    
                    if (mergedOptions.triggerOnce) {
                        observer.unobserve(entry.target);
                    }
                } else if (!mergedOptions.triggerOnce) {
                    // Optional: handle exit from viewport
                    // Can be used for exit animations
                }
            });
        }, { 
            threshold: mergedOptions.threshold,
            rootMargin: mergedOptions.rootMargin
        });
        
        elements.forEach(element => {
            observer.observe(element);
        });
        
        return observer;
    };
}

// Usage examples
document.addEventListener('DOMContentLoaded', () => {
    // Fade in elements as they scroll into view
    const fadeInObserver = createScrollObserver({ threshold: 0.2 });
    fadeInObserver('.fade-in-element', element => {
        element.classList.add('visible');
    });
    
    // Animate counters when visible
    const counterObserver = createScrollObserver({ threshold: 0.5 });
    counterObserver('.counter[data-target]', element => {
        // Start counter animation (implemented elsewhere)
        initializeCounter(element);
    });
    
    // Reveal sections with staggered children
    const sectionObserver = createScrollObserver({ threshold: 0.2 });
    sectionObserver('.staggered-section', section => {
        const children = section.querySelectorAll('.stagger-item');
        children.forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('visible');
            }, index * 100);
        });
    });
    
    // Parallax effect for background elements
    const parallaxObserver = createScrollObserver({
        threshold: Array.from({ length: 11 }, (_, i) => i / 10),
        triggerOnce: false
    });
    
    parallaxObserver('.parallax-element', (element, entry) => {
        const scrollPercent = entry.intersectionRatio;
        const speed = element.dataset.parallaxSpeed || 0.5;
        const offset = (0.5 - scrollPercent) * 100 * speed;
        element.style.transform = `translateY(${offset}px)`;
    });
});
```

### Performance Optimization

```javascript
// utils/performance.js
const performanceUtils = {
    // Throttle function for scroll events
    throttle(callback, limit = 100) {
        let waiting = false;
        return function() {
            if (!waiting) {
                callback.apply(this, arguments);
                waiting = true;
                setTimeout(() => {
                    waiting = false;
                }, limit);
            }
        };
    },
    
    // Debounce function for resize events
    debounce(callback, wait = 200) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => callback.apply(context, args), wait);
        };
    },
    
    // Lazy loading for images
    setupLazyLoading() {
        const images = document.querySelectorAll('[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                        }
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => {
                img.src = img.dataset.src;
                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                }
                img.classList.add('loaded');
            });
        }
    },
    
    // Deferred non-critical CSS loading
    loadDeferredStyles() {
        const deferredStyles = document.querySelectorAll('link[rel="preload"][as="style"]');
        deferredStyles.forEach(link => {
            link.rel = 'stylesheet';
        });
    },
    
    // Reduce animation complexity for low-power devices
    adaptToDeviceCapabilities() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            document.documentElement.classList.add('reduced-motion');
        }
        
        // Check for low-end devices
        const isLowEndDevice = () => {
            const memory = navigator.deviceMemory;
            const processors = navigator.hardwareConcurrency;
            
            return (memory && memory <= 4) || (processors && processors <= 4);
        };
        
        if (isLowEndDevice()) {
            document.documentElement.classList.add('low-end-device');
        }
    }
};

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    // Setup lazy loading
    performanceUtils.setupLazyLoading();
    
    // Load deferred styles
    performanceUtils.loadDeferredStyles();
    
    // Adapt to device capabilities
    performanceUtils.adaptToDeviceCapabilities();
    
    // Set up throttled scroll handling
    const handleScroll = performanceUtils.throttle(() => {
        // Scroll-based animations or calculations
    }, 100);
    
    window.addEventListener('scroll', handleScroll);
    
    // Set up debounced resize handling
    const handleResize = performanceUtils.debounce(() => {
        // Update visualizations and layouts
        if (window.updateAllCharts) {
            window.updateAllCharts();
        }
    }, 250);
    
    window.addEventListener('resize', handleResize);
});
```

## Main Application Initialization

```javascript
// main.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing E-Commerce Environmental Impact Dashboard');
    
    // Initialize theme switcher
    initializeThemeToggle();
    
    // Initialize custom cursor
    initializeCustomCursor();
    
    // Initialize interactive components
    initializeStatCards();
    initializeTimeline();
    initializeWasteTimeline();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize D3.js visualizations
    createGrowthChart();
    createReturnRatesChart();
    createProjectionChart();
    createEmissionsMap();
    
    // Create global update function for charts
    window.updateAllCharts = function() {
        createGrowthChart();
        createReturnRatesChart();
        createProjectionChart();
        createEmissionsMap();
    };
    
    // Load data dynamically
    loadDashboardData();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Highlight active section in navigation
    window.addEventListener('scroll', performanceUtils.throttle(() => {
        let currentSection = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }, 100));
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('.primary-navigation').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Data loading
function loadDashboardData() {
    // Simulate data loading - in a real implementation, this would fetch from JSON files
    console.log('Loading dashboard data...');
    
    // Future implementation would use fetch:
    /*
    Promise.all([
        fetch('data/consumption.json').then(response => response.json()),
        fetch('data/packaging.json').then(response => response.json()),
        fetch('data/transport.json').then(response => response.json()),
        fetch('data/projections.json').then(response => response.json())
    ])
    .then(([consumptionData, packagingData, transportData, projectionsData]) => {
        // Store data for use in visualizations
        window.dashboardData = {
            consumption: consumptionData,
            packaging: packagingData,
            transport: transportData,
            projections: projectionsData
        };
        
        // Update visualizations with real data
        updateVisualizations();
    })
    .catch(error => {
        console.error('Error loading dashboard data:', error);
    });
    */
}
```

## Key Interactive Elements Checklist

- [x] Theme Toggle - Light/Dark mode switcher
- [x] Navigation Links - Active section highlighting and smooth scrolling
- [x] Stat Cards - 3D tilt effect, hover animations, counter animations
- [x] Timeline Component - Animated track, interactive markers
- [x] Material Degradation Timeline - Interactive year display with mouse movement
- [x] Interactive Charts - D3.js visualizations with hover tooltips
- [x] Growth Rate Toggle Buttons - Switch between projection scenarios
- [x] Custom Cursor - Context-aware cursor with interactive states
- [x] Scroll-Triggered Animations - Elements animate as they enter viewport
