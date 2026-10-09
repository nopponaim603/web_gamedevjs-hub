/**
 * CloudRenderer class - Handles all D3.js and SVG rendering logic.
 * Implements Facade pattern for D3.js.
 */
export class CloudRenderer {
    constructor(containerId, svgId) {
        this.container = document.getElementById(containerId);
        this.svg = d3.select(svgId);
        
        this.nodes = [];
        this.simulation = null;
        this.colors = ['#B8775D', '#F48E2E', '#E86230', '#594A41', '#533527'];
        
        // Delegates
        this.onWordClick = null;
        this.onWordContextMenu = null;
        
        this.initSimulation();
    }

    /**
     * Set active theme colors and transition existing elements
     * @param {string} theme 
     */
    setTheme(theme) {
        if (theme === 'dark') {
            this.colors = ['#f43f5e', '#38bdf8', '#a855f7', '#10b981', '#06b6d4', '#f59e0b'];
        } else if (theme === 'pastel') {
            this.colors = ['#a3c4bc', '#e8acb5', '#faedcd', '#e8a598', '#f19c79', '#ccd5ae'];
        } else {
            this.colors = ['#B8775D', '#F48E2E', '#E86230', '#594A41', '#533527'];
        }

        this.svg.selectAll("text")
            .transition()
            .duration(300)
            .style("fill", (d, i) => this.colors[i % this.colors.length]);
    }

    /**
     * Initialize D3 Force Simulation
     */
    initSimulation() {
        this.simulation = d3.forceSimulation(this.nodes)
            .force("charge", d3.forceManyBody().strength(5))
            .force("center", d3.forceCenter(this.container.offsetWidth / 2, this.container.offsetHeight / 2))
            .force("collision", d3.forceCollide().radius(d => d.radius + 5))
            .on("tick", () => this.renderTick());
    }

    /**
     * Update center and SVG dimensions on resize
     */
    handleResize() {
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;
        this.svg.attr("width", width).attr("height", height);
        this.simulation.force("center", d3.forceCenter(width / 2, height / 2));
        this.simulation.alpha(0.3).restart();
    }

    /**
     * Facade: Update the cloud with new data
     * @param {Array} words - Array of word objects {text, count, ...}
     */
    update(words) {
        this.nodes = words;
        
        const maxCount = d3.max(this.nodes, d => d.count) || 1;
        const width = this.container.offsetWidth;
        const fontSizeScale = d3.scaleSqrt()
            .domain([1, maxCount])
            .range([20, Math.min(80, width / 10)]);

        // Update radii for collision detection
        this.nodes.forEach(d => {
            d.fontSize = fontSizeScale(d.count);
            d.radius = (d.text.length * d.fontSize * 0.3) + 10;
        });

        const text = this.svg.selectAll("text")
            .data(this.nodes, d => d.text.toLowerCase());

        // ENTER
        const textEnter = text.enter()
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .style("font-family", "Outfit, sans-serif")
            .style("font-weight", "700")
            .style("cursor", "pointer")
            .on("click", (event, d) => {
                if (this.onWordClick) this.onWordClick(d.text);
                this.showVoteAnimation(event.pageX, event.pageY);
            })
            .on("contextmenu", (event, d) => {
                if (this.onWordContextMenu) {
                    this.onWordContextMenu(event, d.text);
                }
            })
            .style("opacity", 0)
            .text(d => d.text);

        // UPDATE + ENTER
        text.merge(textEnter)
            .transition()
            .duration(600)
            .style("font-size", d => `${d.fontSize}px`)
            .style("fill", (d, i) => this.colors[i % this.colors.length])
            .style("opacity", 1);

        // EXIT
        text.exit().remove();

        this.simulation.nodes(this.nodes);
        this.simulation.force("collision").radius(d => d.radius);
        this.simulation.alpha(1).restart();
    }

    /**
     * Internal: Update text positions on every simulation tick
     */
    renderTick() {
        this.svg.selectAll("text")
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    }

    /**
     * Facade: Clear all drawings
     */
    clear() {
        this.nodes = [];
        this.svg.selectAll("*").remove();
        if (this.simulation) {
            this.simulation.nodes([]);
            this.simulation.stop();
        }
    }

    /**
     * Facade: Animate a floating word (micro-interaction)
     * @param {string} word 
     */
    showFloatingWord(word) {
        const el = document.createElement('div');
        el.className = 'floating-word';
        el.textContent = word;
        this.container.appendChild(el);
        setTimeout(() => el.remove(), 1500);
    }

    /**
     * Facade: Show a +1 animation at specific coordinates
     * @param {number} x 
     * @param {number} y 
     */
    showVoteAnimation(x, y) {
        const el = document.createElement('div');
        el.className = 'vote-pop';
        el.textContent = '+1';
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1000);
    }
}
