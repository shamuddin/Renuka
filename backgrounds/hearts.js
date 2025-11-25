// ===== Floating Heart Constellation =====
// Hearts connected in a constellation with force simulation

class HeartsBackground {
    constructor(canvas, ctx, svg) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.svg = d3.select(svg);
        this.isActive = false;
        this.hearts = [];
        this.simulation = null;
        this.mousePos = { x: 0, y: 0 };
        this.time = 0;
    }

    init() {
        this.isActive = true;
        this.svg.selectAll('*').remove();
        this.createHearts();
        this.setupForceSimulation();
    }

    createHearts() {
        const heartCount = Math.min(40, Math.floor(this.canvas.width * this.canvas.height / 30000));
        this.hearts = [];

        for (let i = 0; i < heartCount; i++) {
            this.hearts.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: 0,
                vy: 0,
                size: Math.random() * 15 + 10,
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: 0.02 + Math.random() * 0.02,
                color: this.getHeartColor()
            });
        }
    }

    getHeartColor() {
        const colors = [
            '#f7cac9', // Rose gold
            '#ff6b9d', // Pink
            '#c44569', // Deep pink
            '#ff85a2', // Light pink
            '#ffa8c5'  // Soft pink
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    setupForceSimulation() {
        this.simulation = d3.forceSimulation(this.hearts)
            .force('charge', d3.forceManyBody().strength(-50))
            .force('center', d3.forceCenter(this.canvas.width / 2, this.canvas.height / 2))
            .force('collision', d3.forceCollide().radius(d => d.size + 10))
            .alphaDecay(0.02);
    }

    update(mousePos) {
        this.mousePos = mousePos;
        this.time += 0.01;

        if (this.simulation) {
            this.simulation.alpha(0.3).restart();

            // Mouse interaction - magnetic effect
            this.hearts.forEach(heart => {
                const dx = this.mousePos.x - heart.x;
                const dy = this.mousePos.y - heart.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const force = (150 - distance) / 150 * 0.5;
                    heart.vx += (dx / distance) * force;
                    heart.vy += (dy / distance) * force;
                }
            });
        }
    }

    draw() {
        // Dark gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1a0a1e');
        gradient.addColorStop(1, '#3d1e4f');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connection lines
        this.ctx.strokeStyle = 'rgba(255, 182, 193, 0.15)';
        this.ctx.lineWidth = 1;

        for (let i = 0; i < this.hearts.length; i++) {
            for (let j = i + 1; j < this.hearts.length; j++) {
                const h1 = this.hearts[i];
                const h2 = this.hearts[j];
                const dx = h1.x - h2.x;
                const dy = h1.y - h2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    this.ctx.save();
                    this.ctx.globalAlpha = (1 - distance / 150) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(h1.x, h1.y);
                    this.ctx.lineTo(h2.x, h2.y);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            }
        }

        // Draw hearts
        this.hearts.forEach(heart => {
            const pulse = 1 + Math.sin(this.time * 2 + heart.pulsePhase) * 0.1;
            const size = heart.size * pulse;

            this.ctx.save();
            this.ctx.translate(heart.x, heart.y);
            this.ctx.fillStyle = heart.color;
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = heart.color;

            // Draw heart shape
            this.ctx.beginPath();
            this.ctx.moveTo(0, size * 0.3);
            this.ctx.bezierCurveTo(-size * 0.5, -size * 0.3, -size, size * 0.1, 0, size);
            this.ctx.bezierCurveTo(size, size * 0.1, size * 0.5, -size * 0.3, 0, size * 0.3);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    stop() {
        this.isActive = false;
        if (this.simulation) {
            this.simulation.stop();
        }
        this.svg.selectAll('*').remove();
    }

    resize(width, height) {
        this.createHearts();
        this.setupForceSimulation();
    }
}

window.HeartsBackground = HeartsBackground;
