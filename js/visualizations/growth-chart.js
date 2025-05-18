// growth-chart.js - Implementation of the e-commerce growth visualization using D3.js
// This component creates an animated, interactive line chart showing e-commerce growth trends
// with smooth animations, responsive behavior, and interactive tooltips.

/**
 * Creates and initializes the e-commerce growth chart visualization
 * Uses D3.js to render a responsive, animated line chart with tooltips
 */
function createGrowthChart() {
    // Check if the chart container exists
    const chartContainer = document.getElementById('growth-chart');
    if (!chartContainer) return;
    
    // Access e-commerce data from global object or use fallback data
    let data = [];
    
    if (window.dashboardData && window.dashboardData.consumption) {
        // Extract years and sales data from global object
        const years = window.dashboardData.consumption.years;
        const salesGlobal = window.dashboardData.consumption.salesGlobal;
        
        // Combine into series data format
        data = years.map((year, index) => ({
            year: year,
            sales: salesGlobal[index]
        }));
    } else {
        // Fallback data if global data is unavailable
        data = [
            { year: 2021, sales: 4.98 },
            { year: 2022, sales: 5.29 },
            { year: 2023, sales: 5.82 },
            { year: 2024, sales: 6.33 },
            { year: 2025, sales: 6.86 },
            { year: 2026, sales: 7.41 },
            { year: 2027, sales: 7.96 }
        ];
    }

    // Set dimensions and margins based on container size
    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const width = chartContainer.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear any existing SVG to prevent duplicates
    d3.select('#growth-chart').select('svg').remove();
    
    // Create SVG element and append a group with margins
    const svg = d3.select('#growth-chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
        
    // Add title
    svg.append('text')
        .attr('class', 'chart-title')
        .attr('x', width / 2)
        .attr('y', -15)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', '600')
        .style('fill', 'var(--color-text-primary)')
        .text('Global E-Commerce Sales (USD Trillion)');

    // Create X scale (years)
    const x = d3.scaleLinear()
        .domain([d3.min(data, d => d.year), d3.max(data, d => d.year)])
        .range([0, width]);

    // Create Y scale (sales in trillion USD)
    const y = d3.scaleLinear()
        .domain([0, Math.ceil(d3.max(data, d => d.sales) * 1.2)]) // Add 20% headroom
        .range([height, 0]);

    // Create the line generator with smooth curve
    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.sales))
        .curve(d3.curveMonotoneX); // Use monotone curve for smoother transitions

    // Add X axis with formatted ticks
    const xAxis = svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x)
            .tickFormat(d3.format('d')) // Format as integers for years
            .ticks(data.length)) // Ensure we have a tick for each year
        .call(g => g.selectAll('.tick text')
            .style('font-size', '12px')
            .style('fill', 'var(--color-text-secondary)'));
            
    // Enhance axis appearance
    xAxis.selectAll('line')
        .style('stroke', 'var(--color-border)');
    xAxis.selectAll('path')
        .style('stroke', 'var(--color-border)');

    // Add Y axis with formatted ticks
    const yAxis = svg.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(y)
            .tickFormat(d => `$${d}T`) // Format as dollars with T for trillion
            .ticks(5)) // Limit number of ticks for cleaner appearance
        .call(g => g.selectAll('.tick text')
            .style('font-size', '12px')
            .style('fill', 'var(--color-text-secondary)'));
            
    // Enhance axis appearance
    yAxis.selectAll('line')
        .style('stroke', 'var(--color-border)');
    yAxis.selectAll('path')
        .style('stroke', 'var(--color-border)');

    // Add subtle grid lines
    svg.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x)
            .tickSize(-height)
            .tickFormat('')
            .ticks(data.length))
        .style('opacity', 0.1)
        .call(g => g.selectAll('line')
            .style('stroke', 'var(--color-text-tertiary)'));

    svg.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y)
            .tickSize(-width)
            .tickFormat('')
            .ticks(5))
        .style('opacity', 0.1)
        .call(g => g.selectAll('line')
            .style('stroke', 'var(--color-text-tertiary)'));

    // Create gradient for line
    const gradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', 'line-gradient')
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0)
        .attr('y1', y(data[0].sales))
        .attr('x2', 0)
        .attr('y2', y(data[data.length - 1].sales));
        
    gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', 'var(--color-primary-500)');
        
    gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', 'var(--color-accent-500)');
        
    // Add area under the curve with gradient
    const area = d3.area()
        .x(d => x(d.year))
        .y0(height)
        .y1(d => y(d.sales))
        .curve(d3.curveMonotoneX);
        
    // Append the area path with gradient fill
    const areaPath = svg.append('path')
        .datum(data)
        .attr('class', 'area')
        .attr('fill', 'url(#area-gradient)')
        .attr('opacity', 0)
        .attr('d', area);
        
    // Create gradient for area
    const areaGradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', 'area-gradient')
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', height);
        
    areaGradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', 'var(--color-primary-500)')
        .attr('stop-opacity', 0.3);
        
    areaGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', 'var(--color-accent-500)')
        .attr('stop-opacity', 0.05);

    // Add path with animated reveal
    const path = svg.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke', 'url(#line-gradient)')
        .attr('stroke-width', 3)
        .attr('stroke-linecap', 'round')
        .attr('stroke-linejoin', 'round')
        .attr('d', line)
        .attr('stroke-dasharray', function() {
            const totalLength = this.getTotalLength();
            return `${totalLength} ${totalLength}`;
        })
        .attr('stroke-dashoffset', function() {
            return this.getTotalLength();
        });

    // Add X axis label
    svg.append('text')
        .attr('class', 'x-axis-label')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', 'var(--color-text-secondary)')
        .text('Year');

    // Add Y axis label
    svg.append('text')
        .attr('class', 'y-axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -40)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', 'var(--color-text-secondary)')
        .text('Sales (Trillion USD)');

    // Add projected area indication
    const currentYear = new Date().getFullYear();
    const projectionStartIndex = data.findIndex(d => d.year >= currentYear);
    
    if (projectionStartIndex > 0) {
        // Add projection indicator line
        svg.append('line')
            .attr('class', 'projection-line')
            .attr('x1', x(data[projectionStartIndex].year))
            .attr('y1', 0)
            .attr('x2', x(data[projectionStartIndex].year))
            .attr('y2', height)
            .attr('stroke', 'var(--color-text-tertiary)')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '5,5')
            .attr('opacity', 0);
            
        // Add projection label
        svg.append('text')
            .attr('class', 'projection-label')
            .attr('x', x(data[projectionStartIndex].year) + 5)
            .attr('y', 15)
            .attr('text-anchor', 'start')
            .style('font-size', '12px')
            .style('fill', 'var(--color-text-tertiary)')
            .text('Projected')
            .attr('opacity', 0);
    }

    // Animate path on scroll into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate line
                path.transition()
                    .duration(2000)
                    .ease(d3.easeCubicOut)
                    .attr('stroke-dashoffset', 0)
                    .on('end', () => {
                        // Animate area after line completes
                        areaPath.transition()
                            .duration(1000)
                            .attr('opacity', 1);
                            
                        // Animate projection indicators
                        svg.select('.projection-line')
                            .transition()
                            .duration(500)
                            .delay(1000)
                            .attr('opacity', 0.7);
                            
                        svg.select('.projection-label')
                            .transition()
                            .duration(500)
                            .delay(1200)
                            .attr('opacity', 1);
                    });
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(chartContainer);

    // Add data points with animation
    const points = svg.selectAll('.data-point')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'data-point')
        .attr('cx', d => x(d.year))
        .attr('cy', d => y(d.sales))
        .attr('r', 0)
        .attr('fill', (d, i) => {
            // Create color gradient effect from primary to accent
            const ratio = i / (data.length - 1);
            return i < projectionStartIndex ? 
                'var(--color-primary-500)' : 
                'var(--color-accent-500)';
        })
        .attr('stroke', 'var(--color-bg-secondary)')
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
    
    pointObserver.observe(chartContainer);

    // Create tooltip
    const tooltip = d3.select('#growth-chart')
        .append('div')
        .attr('class', 'chart-tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('background-color', 'var(--color-bg-secondary)')
        .style('color', 'var(--color-text-primary)')
        .style('padding', '8px 12px')
        .style('border-radius', '6px')
        .style('font-size', '12px')
        .style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)')
        .style('pointer-events', 'none')
        .style('z-index', '10')
        .style('transition', 'opacity 0.2s ease');

    // Add interactivity to data points
    points.on('mouseover', function(event, d) {
        // Enlarge point on hover
        d3.select(this)
            .transition()
            .duration(200)
            .attr('r', 8);
            
        // Display tooltip
        tooltip.transition()
            .duration(200)
            .style('opacity', 0.9);
            
        tooltip.html(`
            <strong>${d.year}</strong><br>
            <span style="color: var(--color-primary-500)">$${d.sales.toFixed(2)} trillion</span>
            ${d.year >= currentYear ? '<br><em>(Projected)</em>' : ''}
        `)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 15) + 'px');
    })
    .on('mouseout', function() {
        // Restore point size
        d3.select(this)
            .transition()
            .duration(200)
            .attr('r', 6);
            
        // Hide tooltip
        tooltip.transition()
            .duration(500)
            .style('opacity', 0);
    });

    // Add event listener to chart container for interactions with the chart area
    chartContainer.addEventListener('mousemove', function(event) {
        // Get mouse position relative to chart area
        const mouseX = event.offsetX - margin.left;
        
        // Only process if mouse is within chart area
        if (mouseX >= 0 && mouseX <= width) {
            // Find nearest data point to mouse position
            const xValue = x.invert(mouseX);
            const bisect = d3.bisector(d => d.year).left;
            const index = bisect(data, xValue);
            
            // Handle edge case
            if (index >= data.length) return;
            
            // Determine which point is closer
            const d0 = data[Math.max(0, index - 1)];
            const d1 = data[index];
            const d = xValue - d0.year > d1.year - xValue ? d1 : d0;
            
            // Highlight nearest point
            svg.selectAll('.data-point')
                .attr('r', 6); // Reset all points
                
            svg.selectAll('.data-point')
                .filter(function(pointData) {
                    return pointData.year === d.year;
                })
                .attr('r', 8); // Enlarge nearest point
        }
    });
    
    // Reset points when mouse leaves chart area
    chartContainer.addEventListener('mouseleave', function() {
        svg.selectAll('.data-point')
            .attr('r', 6); // Reset all points
    });

    // Make chart responsive
    function updateChart() {
        const updatedWidth = chartContainer.clientWidth - margin.left - margin.right;
        
        // Update SVG dimensions
        d3.select('#growth-chart').select('svg')
            .attr('width', updatedWidth + margin.left + margin.right);
        
        // Update scales
        x.range([0, updatedWidth]);
        
        // Update axes
        svg.select('.x-axis')
            .call(d3.axisBottom(x).tickFormat(d3.format('d')));
            
        // Update grid
        svg.selectAll('.grid').remove();
        
        svg.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x)
                .tickSize(-height)
                .tickFormat('')
                .ticks(data.length))
            .style('opacity', 0.1);
            
        svg.append('g')
            .attr('class', 'grid')
            .call(d3.axisLeft(y)
                .tickSize(-updatedWidth)
                .tickFormat('')
                .ticks(5))
            .style('opacity', 0.1);
            
        // Update line and area
        svg.select('.line')
            .attr('d', line);
            
        svg.select('.area')
            .attr('d', area);
            
        // Update points
        svg.selectAll('.data-point')
            .attr('cx', d => x(d.year));
            
        // Update axis labels
        svg.select('.x-axis-label')
            .attr('x', updatedWidth / 2);
            
        // Update title
        svg.select('.chart-title')
            .attr('x', updatedWidth / 2);
            
        // Update projection line if it exists
        if (projectionStartIndex > 0) {
            svg.select('.projection-line')
                .attr('x1', x(data[projectionStartIndex].year))
                .attr('x2', x(data[projectionStartIndex].year));
                
            svg.select('.projection-label')
                .attr('x', x(data[projectionStartIndex].year) + 5);
        }
    }
    
    // Add window resize listener with debounce
    window.addEventListener('resize', debounce(updateChart, 250));
}

/**
 * Simple debounce function to limit execution frequency
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Export the function for use in main.js
export { createGrowthChart };