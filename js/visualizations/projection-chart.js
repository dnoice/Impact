/**
 * projection-chart.js
 * Creates an interactive visualization system showing projected environmental impacts
 * based on different e-commerce growth rates with advanced features and educational components
 */

// Main function to create the projection chart system
function createProjectionChart() {
    // Base data setup - our starting point metrics for the current year
    const baselineYear = 2025;
    const baselineData = {
        'plastic': 1.45, // Million Metric Tons of plastic packaging 
        'co2': 65, // Million tons CO2 from last-mile delivery
        'cardboard': 165, // Million Metric Tons of corrugated board
        'energy': 120 // Arbitrary digital infrastructure energy units
    };
    
    // Units for each metric for display purposes
    const metricUnits = {
        'plastic': 'million metric tons',
        'co2': 'million tons',
        'cardboard': 'million metric tons',
        'energy': 'units'
    };
    
    // Environmental context data for each metric
    const environmentalContext = {
        'plastic': {
            equivalent: value => `${(value * 36.7).toFixed(1)} million trees needed to offset`,
            info: 'Each ton of plastic produces approximately 2.5 tons of CO2 in production',
            reduction: '30% reduction possible through sustainable packaging alternatives'
        },
        'co2': {
            equivalent: value => `${(value * 21.6).toFixed(1)} million cars on the road for a year`,
            info: 'Last-mile delivery accounts for 53% of total shipping costs and contributes a large portion of delivery emissions',
            reduction: '45% reduction possible through route optimization and EV adoption'
        },
        'cardboard': {
            equivalent: value => `${(value * 17).toFixed(1)} million trees consumed`,
            info: 'E-commerce uses 7x more cardboard per dollar spent than traditional retail',
            reduction: '25% reduction possible through right-sized packaging optimization'
        },
        'energy': {
            equivalent: value => `${(value * 0.83).toFixed(1)} million homes powered for a year`,
            info: 'Data centers account for approximately 1% of global electricity use',
            reduction: '40% reduction possible through efficient algorithms and green energy'
        }
    };
    
    // Growth rates that users can select between
    const growthRates = {
        '2': 0.02, // 2% annual growth
        '5': 0.05, // 5% annual growth
        '10': 0.10 // 10% annual growth
    };
    
    // Years to project for (fixed points on our x-axis)
    const years = [2025, 2030, 2035, 2050];
    const chartContainer = document.getElementById('projection-chart');
    
    // State tracking variables
    let activeRate = '5'; // Default selected growth rate
    let activeMetric = null; // For highlighting a specific metric
    let showCumulative = false; // Toggle for cumulative impact view
    let currentProjection = null; // Current projection data
    
    // Initialize the UI components
    initializeUI();
    
    // Create initial chart with default rate
    createChart(activeRate);
    
    /**
     * Sets up all UI components and event listeners
     */
    function initializeUI() {
        // Set up the growth rate toggle buttons
        const toggles = document.querySelectorAll('.growth-toggle');
        
        toggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                // Update visual active state
                toggles.forEach(t => t.classList.remove('active'));
                toggle.classList.add('active');
                
                // Get selected rate from data attribute
                activeRate = toggle.getAttribute('data-rate');
                
                // Update chart with new rate
                updateChart(activeRate);
            });
        });
        
        // Create additional UI controls if they don't exist
        createAdditionalControls();
        
        // Add touch-friendly interaction for mobile
        enableTouchInteractions();
    }
    
    /**
     * Creates additional UI controls for enhanced functionality
     */
    function createAdditionalControls() {
        // Create container for additional controls if it doesn't exist
        let controlsContainer = document.querySelector('.chart-controls');
        if (!controlsContainer) {
            controlsContainer = document.createElement('div');
            controlsContainer.className = 'chart-controls';
            chartContainer.parentNode.insertBefore(controlsContainer, chartContainer.nextSibling);
        }
        
        // Create visualization type toggle
        let viewToggle = document.querySelector('.view-toggle');
        if (!viewToggle) {
            viewToggle = document.createElement('div');
            viewToggle.className = 'view-toggle';
            viewToggle.innerHTML = `
                <span>View Mode:</span>
                <button class="view-button active" data-view="annual">Annual Impact</button>
                <button class="view-button" data-view="cumulative">Cumulative Impact</button>
            `;
            controlsContainer.appendChild(viewToggle);
            
            // Add event listeners to view toggle buttons
            const viewButtons = viewToggle.querySelectorAll('.view-button');
            viewButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Update active state
                    viewButtons.forEach(b => b.classList.remove('active'));
                    button.classList.add('active');
                    
                    // Update view based on selection
                    showCumulative = button.getAttribute('data-view') === 'cumulative';
                    updateChart(activeRate);
                });
            });
        }
        
        // Create metric focus buttons
        let metricFocus = document.querySelector('.metric-focus');
        if (!metricFocus) {
            metricFocus = document.createElement('div');
            metricFocus.className = 'metric-focus';
            metricFocus.innerHTML = `
                <span>Focus on:</span>
                <button class="metric-button" data-metric="all">All Metrics</button>
                <button class="metric-button" data-metric="plastic">Plastic</button>
                <button class="metric-button" data-metric="co2">CO₂</button>
                <button class="metric-button" data-metric="cardboard">Cardboard</button>
                <button class="metric-button" data-metric="energy">Energy</button>
            `;
            controlsContainer.appendChild(metricFocus);
            
            // Add event listeners to metric focus buttons
            const metricButtons = metricFocus.querySelectorAll('.metric-button');
            metricButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Update active state
                    metricButtons.forEach(b => b.classList.remove('active'));
                    button.classList.add('active');
                    
                    // Update focus based on selection
                    activeMetric = button.getAttribute('data-metric');
                    if (activeMetric === 'all') activeMetric = null;
                    
                    // Update chart highlighting
                    updateMetricFocus(activeMetric);
                });
            });
            
            // Start with "All Metrics" selected
            metricButtons[0].classList.add('active');
        }
        
        // Create container for impact insights
        let insightsContainer = document.querySelector('.impact-insights');
        if (!insightsContainer) {
            insightsContainer = document.createElement('div');
            insightsContainer.className = 'impact-insights';
            insightsContainer.innerHTML = `
                <h3>Environmental Impact Insights</h3>
                <div class="insights-content">
                    <p>Select a growth rate and metric to see detailed environmental context.</p>
                </div>
            `;
            chartContainer.parentNode.insertBefore(insightsContainer, chartContainer.nextSibling.nextSibling);
        }
        
        // Create comparison container
        let comparisonContainer = document.querySelector('.scenarios-comparison');
        if (!comparisonContainer) {
            comparisonContainer = document.createElement('div');
            comparisonContainer.className = 'scenarios-comparison';
            comparisonContainer.innerHTML = `
                <h3>Scenario Impact Comparison</h3>
                <div class="scenario-table">
                    <div class="scenario-header">
                        <div class="scenario-cell">Growth Rate</div>
                        <div class="scenario-cell">Plastic by 2050</div>
                        <div class="scenario-cell">CO₂ by 2050</div>
                        <div class="scenario-cell">Cardboard by 2050</div>
                        <div class="scenario-cell">Energy by 2050</div>
                    </div>
                    <div class="scenario-row" data-rate="2">
                        <div class="scenario-cell">2% Annual</div>
                        <div class="scenario-cell plastic-cell">-</div>
                        <div class="scenario-cell co2-cell">-</div>
                        <div class="scenario-cell cardboard-cell">-</div>
                        <div class="scenario-cell energy-cell">-</div>
                    </div>
                    <div class="scenario-row" data-rate="5">
                        <div class="scenario-cell">5% Annual</div>
                        <div class="scenario-cell plastic-cell">-</div>
                        <div class="scenario-cell co2-cell">-</div>
                        <div class="scenario-cell cardboard-cell">-</div>
                        <div class="scenario-cell energy-cell">-</div>
                    </div>
                    <div class="scenario-row" data-rate="10">
                        <div class="scenario-cell">10% Annual</div>
                        <div class="scenario-cell plastic-cell">-</div>
                        <div class="scenario-cell co2-cell">-</div>
                        <div class="scenario-cell cardboard-cell">-</div>
                        <div class="scenario-cell energy-cell">-</div>
                    </div>
                </div>
            `;
            chartContainer.parentNode.insertBefore(comparisonContainer, chartContainer.nextSibling.nextSibling.nextSibling);
        }
        
        // Create mitigation strategies container
        let mitigationContainer = document.querySelector('.mitigation-strategies');
        if (!mitigationContainer) {
            mitigationContainer = document.createElement('div');
            mitigationContainer.className = 'mitigation-strategies';
            mitigationContainer.innerHTML = `
                <h3>Impact Mitigation Strategies</h3>
                <div class="strategies-grid">
                    <div class="strategy-card">
                        <h4>Packaging Reduction</h4>
                        <p>Lightweight materials and right-sized packaging can reduce waste by up to 30%</p>
                        <div class="strategy-impact">
                            <div class="strategy-bar" style="width: 30%;"></div>
                            <span>30% reduction potential</span>
                        </div>
                    </div>
                    <div class="strategy-card">
                        <h4>Efficient Logistics</h4>
                        <p>Route optimization and electric vehicles could reduce emissions by 45%</p>
                        <div class="strategy-impact">
                            <div class="strategy-bar" style="width: 45%;"></div>
                            <span>45% reduction potential</span>
                        </div>
                    </div>
                    <div class="strategy-card">
                        <h4>Energy Efficiency</h4>
                        <p>Green data centers and efficient algorithms can lower energy use by 40%</p>
                        <div class="strategy-impact">
                            <div class="strategy-bar" style="width: 40%;"></div>
                            <span>40% reduction potential</span>
                        </div>
                    </div>
                </div>
            `;
            chartContainer.parentNode.insertBefore(mitigationContainer, chartContainer.nextSibling.nextSibling.nextSibling.nextSibling);
        }
        
        // Initialize scenario comparison table
        updateAllScenarios();
    }
    
    /**
     * Enables touch-friendly interactions for mobile devices
     */
    function enableTouchInteractions() {
        // Replace hover-based interactions with tap/touch events
        const chart = document.getElementById('projection-chart');
        
        // Add touch event listeners (will work alongside mouse events)
        chart.addEventListener('touchstart', handleTouch, { passive: true });
        chart.addEventListener('touchmove', handleTouch, { passive: true });
        chart.addEventListener('touchend', hideTooltip, { passive: true });
        
        // Touch event handler
        function handleTouch(event) {
            // Get the touch position
            const touch = event.touches[0];
            if (!touch) return;
            
            // Find element under touch point
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            
            // If touching a bar, show its tooltip
            if (element && element.classList.contains('impact-bar')) {
                // Create a synthetic event object for the tooltip
                const syntheticEvent = {
                    pageX: touch.pageX,
                    pageY: touch.pageY
                };
                
                // Get corresponding data and trigger tooltip
                const barType = element.getAttribute('class').split(' ')[1].split('-')[0];
                const yearGroup = element.parentNode;
                const yearData = d3.select(yearGroup).datum();
                
                showTooltip(syntheticEvent, yearData, barType);
            }
        }
        
        // Hide tooltip function
        function hideTooltip() {
            const tooltip = d3.select('.chart-tooltip');
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        }
        
        // Custom tooltip show function for touch events
        function showTooltip(event, d, barType) {
            const tooltip = d3.select('.chart-tooltip');
            const impacts = ['plastic', 'co2', 'cardboard', 'energy'];
            const impactLabels = ['Plastic Waste', 'CO₂ Emissions', 'Cardboard Waste', 'Energy Use'];
            
            const year = d.year;
            const value = d[barType];
            const label = impactLabels[impacts.indexOf(barType)];
            
            // Show tooltip
            tooltip.transition()
                .duration(200)
                .style('opacity', 1);
            
            // Set content and position
            tooltip.html(`<strong>${year}</strong><br>${label}: ${value.toFixed(1)} ${metricUnits[barType]}`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 15) + 'px');
        }
    }
    
    /**
     * Creates the initial chart with all elements and structure
     * @param {string} rate - The growth rate to use (key from growthRates object)
     */
    function createChart(rate) {
        // Calculate projections data based on the selected rate
        const projectedData = calculateProjections(rate);
        currentProjection = projectedData;
        
        // Set dimensions and margins for the chart
        const margin = { top: 40, right: 80, bottom: 60, left: 60 };
        const width = chartContainer.clientWidth - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
        
        // Remove any existing SVG to prevent duplicates on updates
        d3.select(chartContainer).select('svg').remove();
        
        // Create the main SVG container
        const svg = d3.select(chartContainer)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
            
        // Create x-scale (categorical, for years)
        const x = d3.scaleBand()
            .domain(years)
            .range([0, width])
            .padding(0.2);
            
        // Find max value for y-scale
        let maxValue;
        if (showCumulative) {
            // For cumulative view, sum all metrics for each year
            maxValue = d3.max(projectedData, d => d.plastic + d.co2 + d.cardboard + d.energy);
        } else {
            // For regular view, find max of any individual metric
            maxValue = d3.max(projectedData, d => Math.max(d.plastic, d.co2, d.cardboard, d.energy));
        }
        
        // Create y-scale (linear, for values)
        const y = d3.scaleLinear()
            .domain([0, maxValue * 1.1]) // Add 10% padding
            .range([height, 0]);
            
        // Create color scale for different impact types
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
            
        // Add Y axis with units
        svg.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(y).ticks(5).tickFormat(d => {
                // Abbreviate large numbers
                if (d >= 1000) return (d/1000) + 'k';
                return d;
            }))
            .selectAll('text')
            .style('font-size', '12px');
            
        // Add Y axis label
        svg.append('text')
            .attr('class', 'y-axis-label')
            .attr('transform', 'rotate(-90)')
            .attr('y', -40)
            .attr('x', -(height / 2))
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .text(showCumulative ? 'Cumulative Impact' : 'Annual Impact');
            
        // Add horizontal grid lines
        svg.append('g')
            .attr('class', 'grid')
            .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(''))
            .style('opacity', 0.1);
            
        if (showCumulative) {
            // Create stacked bar chart for cumulative view
            createStackedBars(svg, projectedData, x, y, height, color);
        } else {
            // Create grouped bar chart for annual view
            createGroupedBars(svg, projectedData, x, y, height, color);
        }
            
        // Add legend for the different metrics
        const legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${width - 120}, 0)`);
            
        // Define impacts and their human-readable labels
        const impacts = ['plastic', 'co2', 'cardboard', 'energy'];
        const impactLabels = ['Plastic Waste', 'CO₂ Emissions', 'Cardboard Waste', 'Energy Use'];
        
        // Create legend items for each impact type
        impacts.forEach((impact, i) => {
            const legendItem = legend.append('g')
                .attr('class', `legend-item ${impact}-legend`)
                .attr('transform', `translate(0, ${i * 25})`)
                .style('cursor', 'pointer')
                .on('click', () => {
                    // Toggle focus on this metric when legend item is clicked
                    const metricButtons = document.querySelectorAll('.metric-button');
                    metricButtons.forEach(button => {
                        if (button.getAttribute('data-metric') === impact) {
                            button.click();
                        }
                    });
                });
                
            // Color swatch
            legendItem.append('rect')
                .attr('width', 15)
                .attr('height', 15)
                .attr('fill', color(impact))
                .attr('rx', 2);
                
            // Label text
            legendItem.append('text')
                .attr('x', 20)
                .attr('y', 12)
                .style('font-size', '12px')
                .text(impactLabels[i]);
        });
        
        // Add tooltip for interactive data display
        let tooltip = d3.select(chartContainer).select('.chart-tooltip');
        if (tooltip.empty()) {
            tooltip = d3.select(chartContainer)
                .append('div')
                .attr('class', 'chart-tooltip')
                .style('opacity', 0);
        }
        
        // Add annotation for highest impact year
        addHighImpactAnnotation(svg, projectedData, x, y);
        
        // Handle responsiveness
        function updateChartSize() {
            // Get new container width
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
                
            // Update bars
            if (showCumulative) {
                // Update stacked bars
                updateStackedBars(svg, updatedWidth, x);
            } else {
                // Update grouped bars
                updateGroupedBars(svg, updatedWidth, x);
            }
                
            // Update legend position
            legend.attr('transform', `translate(${updatedWidth - 120}, 0)`);
            
            // Update annotation position
            updateAnnotationPosition(svg, updatedWidth, x);
        }
        
        // Add window resize listener with debounce for performance
        window.addEventListener('resize', debounce(updateChartSize, 250));
        
        // Update UI elements with current data
        updateInsights(projectedData, rate);
        updateScenarioRow(rate, projectedData);
    }
    
    /**
     * Creates grouped bars for the annual impact view
     */
    function createGroupedBars(svg, data, x, y, height, color) {
        // Create groups for each year (x-position)
        const yearGroups = svg.selectAll('.year-group')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'year-group')
            .attr('transform', d => `translate(${x(d.year)},0)`);
            
        // Calculate width for each bar (divided evenly among 4 metrics)
        const barWidth = x.bandwidth() / 4;
        
        // Create plastic bars (first of 4 bars in each year group)
        yearGroups.append('rect')
            .attr('class', 'impact-bar plastic-bar')
            .attr('data-metric', 'plastic')
            .attr('x', 0)
            .attr('y', d => y(d.plastic))
            .attr('width', barWidth)
            .attr('height', d => height - y(d.plastic))
            .attr('fill', color('plastic'))
            .attr('rx', 2) // rounded corners
            .style('opacity', 0) // start invisible for animation
            .transition() // animate in
            .duration(800)
            .delay((d, i) => i * 100) // stagger by year
            .style('opacity', 1);
            
        // Create CO2 bars (second bar in each year group)
        yearGroups.append('rect')
            .attr('class', 'impact-bar co2-bar')
            .attr('data-metric', 'co2')
            .attr('x', barWidth) // position after first bar
            .attr('y', d => y(d.co2))
            .attr('width', barWidth)
            .attr('height', d => height - y(d.co2))
            .attr('fill', color('co2'))
            .attr('rx', 2)
            .style('opacity', 0)
            .transition()
            .duration(800)
            .delay((d, i) => i * 100 + 100) // stagger + offset
            .style('opacity', 1);
            
        // Create cardboard bars (third bar in each year group)
        yearGroups.append('rect')
            .attr('class', 'impact-bar cardboard-bar')
            .attr('data-metric', 'cardboard')
            .attr('x', barWidth * 2) // position after second bar
            .attr('y', d => y(d.cardboard))
            .attr('width', barWidth)
            .attr('height', d => height - y(d.cardboard))
            .attr('fill', color('cardboard'))
            .attr('rx', 2)
            .style('opacity', 0)
            .transition()
            .duration(800)
            .delay((d, i) => i * 100 + 200) // stagger + offset
            .style('opacity', 1);
            
        // Create energy bars (fourth bar in each year group)
        yearGroups.append('rect')
            .attr('class', 'impact-bar energy-bar')
            .attr('data-metric', 'energy')
            .attr('x', barWidth * 3) // position after third bar
            .attr('y', d => y(d.energy))
            .attr('width', barWidth)
            .attr('height', d => height - y(d.energy))
            .attr('fill', color('energy'))
            .attr('rx', 2)
            .style('opacity', 0)
            .transition()
            .duration(800)
            .delay((d, i) => i * 100 + 300) // stagger + offset
            .style('opacity', 1);
        
        // Add mouse event listeners for interactivity
        addBarInteractivity(svg);
    }
    
    /**
     * Updates grouped bars positions and sizes when resizing
     */
    function updateGroupedBars(svg, width, x) {
        // Update bar positions and widths
        const newBarWidth = x.bandwidth() / 4;
        
        // Update year group positions
        svg.selectAll('.year-group')
            .attr('transform', d => `translate(${x(d.year)},0)`);
            
        // Update bar widths and positions
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
    }
    
    /**
     * Creates stacked bars for cumulative impact view
     */
    function createStackedBars(svg, data, x, y, height, color) {
        // Process data to get cumulative stacks
        const stackedData = data.map(d => {
            // Create a copy with running total
            return {
                year: d.year,
                plastic: d.plastic,
                plastic_top: d.plastic, // Top of plastic bar
                co2: d.co2,
                co2_top: d.plastic + d.co2, // Top of CO2 bar
                cardboard: d.cardboard,
                cardboard_top: d.plastic + d.co2 + d.cardboard, // Top of cardboard bar
                energy: d.energy,
                energy_top: d.plastic + d.co2 + d.cardboard + d.energy // Top of energy bar
            };
        });
        
        // Create groups for each year
        const yearGroups = svg.selectAll('.year-group')
            .data(stackedData)
            .enter()
            .append('g')
            .attr('class', 'year-group')
            .attr('transform', d => `translate(${x(d.year)},0)`);
            
        // Create plastic bars (bottom of stack)
        yearGroups.append('rect')
            .attr('class', 'impact-bar plastic-bar')
            .attr('data-metric', 'plastic')
            .attr('x', 0)
            .attr('y', d => y(d.plastic_top))
            .attr('width', x.bandwidth())
            .attr('height', d => height - y(d.plastic))
            .attr('fill', color('plastic'))
            .attr('rx', 2)
            .style('opacity', 0)
            .transition()
            .duration(800)
            .delay(100)
            .style('opacity', 1);
            
        // Create CO2 bars (second in stack)
        yearGroups.append('rect')
            .attr('class', 'impact-bar co2-bar')
            .attr('data-metric', 'co2')
            .attr('x', 0)
            .attr('y', d => y(d.co2_top))
            .attr('width', x.bandwidth())
            .attr('height', d => y(d.plastic_top) - y(d.co2))
            .attr('fill', color('co2'))
            .attr('rx', 2)
            .style('opacity', 0)
            .transition()
            .duration(800)
            .delay(200)
            .style('opacity', 1);
            
        // Create cardboard bars (third in stack)
        yearGroups.append('rect')
            .attr('class', 'impact-bar cardboard-bar')
            .attr('data-metric', 'cardboard')
            .attr('x', 0)
            .attr('y', d => y(d.cardboard_top))
            .attr('width', x.bandwidth())
            .attr('height', d => y(d.co2_top) - y(d.cardboard))
            .attr('fill', color('cardboard'))
            .attr('rx', 2)
            .style('opacity', 0)
            .transition()
            .duration(800)
            .delay(300)
            .style('opacity', 1);
            
        // Create energy bars (top of stack)
        yearGroups.append('rect')
            .attr('class', 'impact-bar energy-bar')
            .attr('data-metric', 'energy')
            .attr('x', 0)
            .attr('y', d => y(d.energy_top))
            .attr('width', x.bandwidth())
            .attr('height', d => y(d.cardboard_top) - y(d.energy))
            .attr('fill', color('energy'))
            .attr('rx', 2)
            .style('opacity', 0)
            .transition()
            .duration(800)
            .delay(400)
            .style('opacity', 1);
        
        // Add mouse event listeners for interactivity
        addBarInteractivity(svg);
        
        // Add dividing lines between stacked sections
        yearGroups.append('line')
            .attr('class', 'stack-divider')
            .attr('x1', 0)
            .attr('x2', x.bandwidth())
            .attr('y1', d => y(d.plastic_top))
            .attr('y2', d => y(d.plastic_top))
            .attr('stroke', 'var(--color-bg-primary)')
            .attr('stroke-width', 1)
            .attr('opacity', 0.5);
            
        yearGroups.append('line')
            .attr('class', 'stack-divider')
            .attr('x1', 0)
            .attr('x2', x.bandwidth())
            .attr('y1', d => y(d.co2_top))
            .attr('y2', d => y(d.co2_top))
            .attr('stroke', 'var(--color-bg-primary)')
            .attr('stroke-width', 1)
            .attr('opacity', 0.5);
            
        yearGroups.append('line')
            .attr('class', 'stack-divider')
            .attr('x1', 0)
            .attr('x2', x.bandwidth())
            .attr('y1', d => y(d.cardboard_top))
            .attr('y2', d => y(d.cardboard_top))
            .attr('stroke', 'var(--color-bg-primary)')
            .attr('stroke-width', 1)
            .attr('opacity', 0.5);
    }
    
    /**
     * Updates stacked bars positions when resizing
     */
    function updateStackedBars(svg, width, x) {
        // Update year group positions
        svg.selectAll('.year-group')
            .attr('transform', d => `translate(${x(d.year)},0)`);
            
        // Update bar widths
        svg.selectAll('.impact-bar')
            .attr('width', x.bandwidth());
            
        // Update divider lines
        svg.selectAll('.stack-divider')
            .attr('x2', x.bandwidth());
    }
    
    /**
     * Adds interactivity to chart bars
     */
    function addBarInteractivity(svg) {
        // Get tooltip element
        const tooltip = d3.select('.chart-tooltip');
        
        // Define impacts and their human-readable labels
        const impacts = ['plastic', 'co2', 'cardboard', 'energy'];
        const impactLabels = ['Plastic Waste', 'CO₂ Emissions', 'Cardboard Waste', 'Energy Use'];
        
        // Add interactivity to all bars
        svg.selectAll('.impact-bar')
            .on('mouseover', function(event, d) {
                // Determine which type of bar was hovered from class name
                const barType = this.getAttribute('data-metric');
                const year = d.year;
                const value = d[barType];
                const label = impactLabels[impacts.indexOf(barType)];
                
                // Create tooltip content
                let tooltipContent = `<strong>${year}</strong><br>${label}: ${value.toFixed(1)} ${metricUnits[barType]}`;
                
                // Add percentage increase from baseline if not the first year
                if (year > baselineYear) {
                    const baselineValue = baselineData[barType];
                    const percentIncrease = ((value - baselineValue) / baselineValue * 100).toFixed(1);
                    tooltipContent += `<br><span class="tooltip-percent">+${percentIncrease}% from ${baselineYear}</span>`;
                }
                
                // Add environmental context
                if (environmentalContext[barType]) {
                    tooltipContent += `<br><span class="tooltip-context">${environmentalContext[barType].equivalent(value)}</span>`;
                }
                
                // Highlight the bar
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('opacity', 0.8)
                    .attr('stroke', 'var(--color-text-primary)')
                    .attr('stroke-width', 2);
                    
                // Show tooltip
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 1);
                    
                // Set tooltip content and position
                tooltip.html(tooltipContent)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 15) + 'px');
                
                // Update insights panel with specific metric
                if (environmentalContext[barType]) {
                    const insights = document.querySelector('.insights-content');
                    if (insights) {
                        insights.innerHTML = `
                            <h4>${impactLabels[impacts.indexOf(barType)]}</h4>
                            <p class="insight-value">${value.toFixed(1)} ${metricUnits[barType]} in ${year}</p>
                            <p class="insight-equivalent">${environmentalContext[barType].equivalent(value)}</p>
                            <p class="insight-info">${environmentalContext[barType].info}</p>
                            <p class="insight-reduction">${environmentalContext[barType].reduction}</p>
                        `;
                    }
                }
            })
            .on('mouseout', function() {
                // Restore bar appearance
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('opacity', 1)
                    .attr('stroke', 'none');
                    
                // Hide tooltip
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            })
            .on('click', function() {
                // Get metric from the bar
                const metric = this.getAttribute('data-metric');
                
                // Toggle focus on this metric
                const metricButtons = document.querySelectorAll('.metric-button');
                metricButtons.forEach(button => {
                    if (button.getAttribute('data-metric') === metric) {
                        button.click();
                    }
                });
            });
    }
    
    /**
     * Adds annotation for the highest impact point
     */
    function addHighImpactAnnotation(svg, data, x, y) {
        // Find the highest value in the dataset
        let maxValue = 0;
        let maxMetric = '';
        let maxYear = null;
        
        const impacts = ['plastic', 'co2', 'cardboard', 'energy'];
        
        // Find maximum value across all years and metrics
        data.forEach(d => {
            impacts.forEach(impact => {
                if (d[impact] > maxValue) {
                    maxValue = d[impact];
                    maxMetric = impact;
                    maxYear = d.year;
                }
            });
        });
        
        // Only add annotation if we found a maximum
        if (maxYear) {
            // Get position for the annotation
            const yearData = data.find(d => d.year === maxYear);
            let xPos, yPos;
            
            if (showCumulative) {
                // For stacked view, position at the top of the stack
                xPos = x(maxYear) + x.bandwidth()/2;
                yPos = y(yearData.plastic + yearData.co2 + yearData.cardboard + yearData.energy) - 15;
            } else {
                // For grouped view, position above the specific bar
                const barWidth = x.bandwidth() / 4;
                const barIndex = impacts.indexOf(maxMetric);
                xPos = x(maxYear) + barWidth * barIndex + barWidth/2;
                yPos = y(yearData[maxMetric]) - 15;
            }
            
            // Create annotation group
            const annotation = svg.append('g')
                .attr('class', 'impact-annotation')
                .attr('transform', `translate(${xPos}, ${yPos})`);
                
            // Add annotation marker (circle)
            annotation.append('circle')
                .attr('r', 10)
                .attr('fill', 'var(--color-warning)')
                .attr('stroke', 'var(--color-text-primary)')
                .attr('stroke-width', 1)
                .attr('opacity', 0.8);
                
            // Add exclamation mark
            annotation.append('text')
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'central')
                .attr('font-weight', 'bold')
                .attr('fill', 'var(--color-text-primary)')
                .text('!');
                
            // Add annotation text (positioned above the circle)
            annotation.append('text')
                .attr('class', 'annotation-text')
                .attr('text-anchor', 'middle')
                .attr('y', -20)
                .style('font-size', '12px')
                .style('font-weight', 'bold')
                .text('Highest Impact Point');
        }
    }
    
    /**
     * Updates annotation position when chart resizes
     */
    function updateAnnotationPosition(svg, width, x) {
        // Find the annotation
        const annotation = svg.select('.impact-annotation');
        
        if (!annotation.empty() && currentProjection) {
            // Recalculate position based on current data
            let maxValue = 0;
            let maxMetric = '';
            let maxYear = null;
            
            const impacts = ['plastic', 'co2', 'cardboard', 'energy'];
            
            // Find maximum value again
            currentProjection.forEach(d => {
                impacts.forEach(impact => {
                    if (d[impact] > maxValue) {
                        maxValue = d[impact];
                        maxMetric = impact;
                        maxYear = d.year;
                    }
                });
            });
            
            if (maxYear) {
                // Get position for the annotation
                const yearData = currentProjection.find(d => d.year === maxYear);
                let xPos;
                
                if (showCumulative) {
                    // For stacked view
                    xPos = x(maxYear) + x.bandwidth()/2;
                } else {
                    // For grouped view
                    const barWidth = x.bandwidth() / 4;
                    const barIndex = impacts.indexOf(maxMetric);
                    xPos = x(maxYear) + barWidth * barIndex + barWidth/2;
                }
                
                // Update annotation position
                annotation.attr('transform', function() {
                    const currentTransform = d3.select(this).attr('transform');
                    const match = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
                    if (match) {
                        return `translate(${xPos}, ${match[2]})`;
                    }
                    return currentTransform;
                });
            }
        }
    }
    
    /**
     * Updates the chart with new growth rate
     * @param {string} rate - The growth rate to use (key from growthRates object)
     */
    function updateChart(rate) {
        // Calculate new projections with updated rate
        const projectedData = calculateProjections(rate);
        currentProjection = projectedData;
        
        // Get the chart container
        const chartContainer = document.getElementById('projection-chart');
        
        // Complete redraw for view type changes
        if (d3.select(chartContainer).select('.year-group').size() === 0 ||
            (showCumulative && d3.select(chartContainer).select('.co2-bar').attr('x') !== null)) {
            // Create new chart if structure changed
            createChart(rate);
            return;
        }
        
        // Get existing chart elements
        const svg = d3.select(chartContainer).select('svg g');
        const height = 400 - 40 - 60; // same as in createChart
        
        // Find max value for y-scale
        let maxValue;
        if (showCumulative) {
            // For cumulative view, sum all metrics for each year
            maxValue = d3.max(projectedData, d => d.plastic + d.co2 + d.cardboard + d.energy);
        } else {
            // For regular view, find max of any individual metric
            maxValue = d3.max(projectedData, d => Math.max(d.plastic, d.co2, d.cardboard, d.energy));
        }
        
        // Update Y scale with new data range
        const y = d3.scaleLinear()
            .domain([0, maxValue * 1.1])
            .range([height, 0]);
            
        // Update Y axis
        svg.select('.y-axis')
            .transition()
            .duration(500)
            .call(d3.axisLeft(y).ticks(5).tickFormat(d => {
                // Abbreviate large numbers
                if (d >= 1000) return (d/1000) + 'k';
                return d;
            }));
            
        // Update grid
        svg.select('.grid')
            .transition()
            .duration(500)
            .call(d3.axisLeft(y).ticks(5).tickSize(-(chartContainer.clientWidth - 60 - 80)).tickFormat(''));
            
        if (showCumulative) {
            // Update stacked bar heights
            updateStackedBarHeights(svg, projectedData, y, height);
        } else {
            // Update grouped bar heights
            updateGroupedBarHeights(svg, projectedData, y, height);
        }
        
        // Update annotation position
        updateHighImpactAnnotation(svg, projectedData, y);
        
        // Update UI elements with new data
        updateInsights(projectedData, rate);
        updateScenarioRow(rate, projectedData);
    }
    
    /**
     * Updates grouped bar heights with new data
     */
    function updateGroupedBarHeights(svg, data, y, height) {
        // Update plastic bars
        svg.selectAll('.plastic-bar')
            .data(data)
            .transition()
            .duration(800)
            .attr('y', d => y(d.plastic))
            .attr('height', d => height - y(d.plastic));
            
        // Update CO2 bars
        svg.selectAll('.co2-bar')
            .data(data)
            .transition()
            .duration(800)
            .attr('y', d => y(d.co2))
            .attr('height', d => height - y(d.co2));
            
        // Update cardboard bars
        svg.selectAll('.cardboard-bar')
            .data(data)
            .transition()
            .duration(800)
            .attr('y', d => y(d.cardboard))
            .attr('height', d => height - y(d.cardboard));
            
        // Update energy bars
        svg.selectAll('.energy-bar')
            .data(data)
            .transition()
            .duration(800)
            .attr('y', d => y(d.energy))
            .attr('height', d => height - y(d.energy));
    }
    
    /**
     * Updates stacked bar heights with new data
     */
    function updateStackedBarHeights(svg, rawData, y, height) {
        // Process data to get stacked values
        const data = rawData.map(d => {
            return {
                year: d.year,
                plastic: d.plastic,
                plastic_top: d.plastic,
                co2: d.co2,
                co2_top: d.plastic + d.co2,
                cardboard: d.cardboard,
                cardboard_top: d.plastic + d.co2 + d.cardboard,
                energy: d.energy,
                energy_top: d.plastic + d.co2 + d.cardboard + d.energy
            };
        });
        
        // Update plastic bars (bottom of stack)
        svg.selectAll('.plastic-bar')
            .data(data)
            .transition()
            .duration(800)
            .attr('y', d => y(d.plastic_top))
            .attr('height', d => height - y(d.plastic));
            
        // Update CO2 bars (second in stack)
        svg.selectAll('.co2-bar')
            .data(data)
            .transition()
            .duration(800)
            .attr('y', d => y(d.co2_top))
            .attr('height', d => y(d.plastic_top) - y(d.co2));
            
        // Update cardboard bars (third in stack)
        svg.selectAll('.cardboard-bar')
            .data(data)
            .transition()
            .duration(800)
            .attr('y', d => y(d.cardboard_top))
            .attr('height', d => y(d.co2_top) - y(d.cardboard));
            
        // Update energy bars (top of stack)
        svg.selectAll('.energy-bar')
            .data(data)
            .transition()
            .duration(800)
            .attr('y', d => y(d.energy_top))
            .attr('height', d => y(d.cardboard_top) - y(d.energy));
            
        // Update divider lines
        svg.selectAll('.stack-divider')
            .data(data)
            .transition()
            .duration(800)
            .attr('y1', function(d, i) {
                // Determine which divider this is
                const dividerIndex = i % 3; // 0, 1, or 2
                switch(dividerIndex) {
                    case 0: return y(d.plastic_top);
                    case 1: return y(d.co2_top);
                    case 2: return y(d.cardboard_top);
                }
            })
            .attr('y2', function(d, i) {
                // Determine which divider this is
                const dividerIndex = i % 3; // 0, 1, or 2
                switch(dividerIndex) {
                    case 0: return y(d.plastic_top);
                    case 1: return y(d.co2_top);
                    case 2: return y(d.cardboard_top);
                }
            });
    }
    
    /**
     * Updates the high impact annotation position
     */
    function updateHighImpactAnnotation(svg, data, y) {
        // Find the annotation
        const annotation = svg.select('.impact-annotation');
        
        if (!annotation.empty()) {
            // Find the highest value in the new dataset
            let maxValue = 0;
            let maxMetric = '';
            let maxYear = null;
            
            const impacts = ['plastic', 'co2', 'cardboard', 'energy'];
            
            data.forEach(d => {
                impacts.forEach(impact => {
                    if (d[impact] > maxValue) {
                        maxValue = d[impact];
                        maxMetric = impact;
                        maxYear = d.year;
                    }
                });
            });
            
            if (maxYear) {
                // Get the year data with the maximum value
                const yearData = data.find(d => d.year === maxYear);
                let yPos;
                
                if (showCumulative) {
                    // For stacked view
                    yPos = y(yearData.plastic + yearData.co2 + yearData.cardboard + yearData.energy) - 15;
                } else {
                    // For grouped view
                    yPos = y(yearData[maxMetric]) - 15;
                }
                
                // Update annotation position
                annotation.transition()
                    .duration(800)
                    .attr('transform', function() {
                        const currentTransform = d3.select(this).attr('transform');
                        const match = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
                        if (match) {
                            return `translate(${match[1]}, ${yPos})`;
                        }
                        return currentTransform;
                    });
            }
        }
    }
    
    /**
     * Updates metric focus based on user selection
     */
    function updateMetricFocus(metric) {
        // Get all impact bars
        const bars = document.querySelectorAll('.impact-bar');
        
        // If no specific metric is selected, show all
        if (!metric) {
            bars.forEach(bar => {
                bar.style.opacity = '1';
            });
            
            // Reset legend styles
            document.querySelectorAll('.legend-item').forEach(item => {
                item.style.opacity = '1';
            });
            
            return;
        }
        
        // Highlight selected metric, fade others
        bars.forEach(bar => {
            if (bar.getAttribute('data-metric') === metric) {
                bar.style.opacity = '1';
                bar.style.stroke = 'var(--color-text-primary)';
                bar.style.strokeWidth = '2px';
            } else {
                bar.style.opacity = '0.3';
                bar.style.stroke = 'none';
            }
        });
        
        // Update legend styles
        document.querySelectorAll('.legend-item').forEach(item => {
            if (item.classList.contains(`${metric}-legend`)) {
                item.style.opacity = '1';
                item.style.fontWeight = 'bold';
            } else {
                item.style.opacity = '0.5';
                item.style.fontWeight = 'normal';
            }
        });
        
        // Update insights panel for selected metric
        updateInsightsForMetric(metric);
    }
    
    /**
     * Updates insights panel based on selected metric
     */
    function updateInsightsForMetric(metric) {
        if (!metric || !currentProjection || !environmentalContext[metric]) return;
        
        const impacts = ['plastic', 'co2', 'cardboard', 'energy'];
        const impactLabels = ['Plastic Waste', 'CO₂ Emissions', 'Cardboard Waste', 'Energy Use'];
        
        // Get the final year data for the selected metric
        const finalYearData = currentProjection[currentProjection.length - 1];
        const metricValue = finalYearData[metric];
        
        // Update insights content
        const insights = document.querySelector('.insights-content');
        if (insights) {
            insights.innerHTML = `
                <h4>${impactLabels[impacts.indexOf(metric)]}</h4>
                <p class="insight-value">${metricValue.toFixed(1)} ${metricUnits[metric]} by ${finalYearData.year}</p>
                <p class="insight-equivalent">${environmentalContext[metric].equivalent(metricValue)}</p>
                <p class="insight-info">${environmentalContext[metric].info}</p>
                <p class="insight-reduction">${environmentalContext[metric].reduction}</p>
            `;
        }
    }
    
    /**
     * Updates insights panel with full data perspective
     */
    function updateInsights(data, rate) {
        const insights = document.querySelector('.insights-content');
        if (!insights) return;
        
        // Get the final year data (2050)
        const finalYearData = data[data.length - 1];
        
        // Calculate total impact across all metrics
        const totalPlastic = data.reduce((sum, d) => sum + d.plastic, 0);
        const totalCO2 = data.reduce((sum, d) => sum + d.co2, 0);
        
        // Create insights content
        insights.innerHTML = `
            <h4>${rate}% Annual Growth Scenario</h4>
            <div class="insight-highlights">
                <div class="insight-highlight">
                    <span class="highlight-value">${finalYearData.plastic.toFixed(1)}</span>
                    <span class="highlight-label">Million metric tons of plastic by ${finalYearData.year}</span>
                </div>
                <div class="insight-highlight">
                    <span class="highlight-value">${finalYearData.co2.toFixed(1)}</span>
                    <span class="highlight-label">Million tons of CO₂ emissions by ${finalYearData.year}</span>
                </div>
            </div>
            <p class="insight-summary">This growth scenario would result in <strong>${totalPlastic.toFixed(1)} million tons</strong> of accumulated plastic waste and <strong>${totalCO2.toFixed(1)} million tons</strong> of CO₂ emissions over the 25-year period.</p>
            <p class="insight-equivalent">The CO₂ emissions are equivalent to <strong>${(finalYearData.co2 * 21.6).toFixed(1)} million cars</strong> on the road for a year.</p>
            <p class="insight-context">Select a specific metric by clicking on the chart bars or legend items to see more detailed information.</p>
        `;
    }
    
    /**
     * Updates a specific scenario row in the comparison table
     */
    function updateScenarioRow(rate, data) {
        const row = document.querySelector(`.scenario-row[data-rate="${rate}"]`);
        if (!row) return;
        
        // Get the final year data (2050)
        const finalYearData = data[data.length - 1];
        
        // Update each cell with final values
        row.querySelector('.plastic-cell').textContent = finalYearData.plastic.toFixed(1);
        row.querySelector('.co2-cell').textContent = finalYearData.co2.toFixed(1);
        row.querySelector('.cardboard-cell').textContent = finalYearData.cardboard.toFixed(1);
        row.querySelector('.energy-cell').textContent = finalYearData.energy.toFixed(1);
        
        // Highlight the active row
        document.querySelectorAll('.scenario-row').forEach(r => {
            r.classList.remove('active-scenario');
        });
        row.classList.add('active-scenario');
    }
    
    /**
     * Updates all scenario rows in the comparison table
     */
    function updateAllScenarios() {
        // Calculate projections for each growth rate
        Object.keys(growthRates).forEach(rate => {
            const projections = calculateProjections(rate);
            updateScenarioRow(rate, projections);
        });
    }
    
    /**
     * Calculates projected values based on compound growth
     * @param {string} rate - The growth rate to use (key from growthRates object)
     * @returns {Array} Array of data points for each year
     */
    function calculateProjections(rate) {
        const growthRate = growthRates[rate];
        const projectedData = [];
        
        years.forEach(year => {
            // Calculate years from baseline
            const yearDiff = year - baselineYear;
            // Apply compound growth formula
            const multiplier = Math.pow(1 + growthRate, yearDiff);
            
            // Add data point with all metrics
            projectedData.push({
                year: year,
                plastic: roundToOne(baselineData.plastic * multiplier),
                co2: roundToOne(baselineData.co2 * multiplier),
                cardboard: roundToOne(baselineData.cardboard * multiplier),
                energy: roundToOne(baselineData.energy * multiplier)
            });
        });
        
        return projectedData;
    }
    
    /**
     * Helper function to round to one decimal place
     * @param {number} value - The value to round
     * @returns {number} The rounded value
     */
    function roundToOne(value) {
        return Math.round(value * 10) / 10;
    }
}

/**
 * Utility function to debounce function calls
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce wait time in ms
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 200) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Export the function for use in main.js
export { createProjectionChart };