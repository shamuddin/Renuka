// ===== Sky Lantern Festival =====
// Floating lanterns with realistic physics and warm glow - Pink/Cream Theme

class LanternsBackground {
    constructor(canvas, ctx, svg) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.svg = d3.select(svg);
        this.isActive = false;
        this.lanterns = [];
        this.mousePos = { x: 0, y: 0 };
        this.time = 0;
    }

    init() {
        this.isActive = true;
        this.createLanterns();
    }

    createLanterns() {
        const lanternCount = Math.min(20, Math.floor(this.canvas.width * this.canvas.height / 50000));
        this.lanterns = [];

        for (let i = 0; i < lanternCount; i++) {
            this.lanterns.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height + Math.random() * 200,
                vx: (Math.random() - 0.5) * 0.8,
                vy: -(Math.random() * 1.2 + 0.8),
                size: Math.random() * 30 + 25,
                swayPhase: Math.random() * Math.PI * 2,
                swaySpeed: 0.02 + Math.random() * 0.02,
                flickerPhase: Math.random() * Math.PI * 2,
                flickerSpeed: 0.1 + Math.random() * 0.1,
                depth: Math.random(),
                rotation: (Math.random() - 0.5) * 0.2,
                color: this.getLanternColor()
            });
        }
    }

    getLanternColor() {
        const colors = [
            { body: '#ffb3c6', glow: '#ff69b4' },      // Pink
            { body: '#ffc4d6', glow: '#ff85a2' },      // Light pink
            { body: '#ffd4c4', glow: '#ff9966' },      // Peach
            { body: '#ffe4e6', glow: '#ffb3c6' },      // Rose
            { body: '#fff0f3', glow: '#ffc4d6' }       // Cream pink
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update(mousePos) {
        this.mousePos = mousePos;
        this.time += 0.01;

        this.lanterns.forEach((lantern, index) => {
            // Upward drift
            lantern.y += lantern.vy;

            // Horizontal sway
            lantern.x += lantern.vx + Math.sin(this.time * lantern.swaySpeed + lantern.swayPhase) * 0.3;

            // Mouse avoidance
            const dx = lantern.x - this.mousePos.x;
            const dy = lantern.y - this.mousePos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150 && distance > 0) {
                const force = (150 - distance) / 150 * 0.2;
                lantern.vx += (dx / distance) * force;
                lantern.vy += (dy / distance) * force * 0.5;
            }

            // Damping
            lantern.vx *= 0.98;
            lantern.vy = Math.max(-1.5, lantern.vy * 0.99);

            // Wrap around sides
            if (lantern.x < -lantern.size) {
                lantern.x = this.canvas.width + lantern.size;
            }
            if (lantern.x > this.canvas.width + lantern.size) {
                lantern.x = -lantern.size;
            }

            // Reset from bottom when reaching top
            if (lantern.y < -lantern.size * 2) {
                lantern.y = this.canvas.height + lantern.size;
                lantern.x = Math.random() * this.canvas.width;
            }
        });

        // Sort by depth for correct rendering order
        this.lanterns.sort((a, b) => a.depth - b.depth);
    }

    draw() {
        // Light cream/pink gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#fff8f1');
        gradient.addColorStop(0.3, '#ffe4e6');
        gradient.addColorStop(0.7, '#fff0f3');
        gradient.addColorStop(1, '#ffe8e8');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw lanterns
        this.lanterns.forEach(lantern => {
            this.ctx.save();

            // Depth-based scaling and opacity
            const scale = 0.5 + lantern.depth * 0.5;
            const opacity = 0.5 + lantern.depth * 0.5;
            this.ctx.globalAlpha = opacity;

            this.ctx.translate(lantern.x, lantern.y);
            this.ctx.rotate(lantern.rotation);
            this.ctx.scale(scale, scale);

            const size = lantern.size;
            const color = lantern.color;

            // Lantern body (paper)
            const bodyGradient = this.ctx.createLinearGradient(-size, 0, size, 0);
            bodyGradient.addColorStop(0, color.body);
            bodyGradient.addColorStop(0.5, '#fff8f8');
            bodyGradient.addColorStop(1, color.body);

            this.ctx.fillStyle = bodyGradient;
            this.ctx.strokeStyle = '#ffb3c6';
            this.ctx.lineWidth = 1;

            // Main lantern shape
            this.ctx.beginPath();
            this.ctx.moveTo(-size * 0.6, -size * 0.8);
            this.ctx.lineTo(-size * 0.7, -size * 0.3);
            this.ctx.lineTo(-size * 0.6, size * 0.3);
            this.ctx.lineTo(-size * 0.4, size * 0.8);
            this.ctx.lineTo(size * 0.4, size * 0.8);
            this.ctx.lineTo(size * 0.6, size * 0.3);
            this.ctx.lineTo(size * 0.7, -size * 0.3);
            this.ctx.lineTo(size * 0.6, -size * 0.8);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();

            // Horizontal ribs
            this.ctx.strokeStyle = 'rgba(255, 179, 198, 0.5)';
            this.ctx.lineWidth = 1;
            for (let i = -0.6; i <= 0.6; i += 0.4) {
                this.ctx.beginPath();
                this.ctx.moveTo(-size * 0.65, size * i);
                this.ctx.lineTo(size * 0.65, size * i);
                this.ctx.stroke();
            }

            // Flame glow (flickering)
            const flicker = 0.7 + Math.sin(this.time * lantern.flickerSpeed + lantern.flickerPhase) * 0.3;
            const glowGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.5);
            glowGradient.addColorStop(0, `rgba(255, 105, 180, ${0.6 * flicker})`);
            glowGradient.addColorStop(0.3, `rgba(255, 133, 162, ${0.35 * flicker})`);
            glowGradient.addColorStop(0.7, `rgba(255, 182, 193, ${0.15 * flicker})`);
            glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            this.ctx.fillStyle = glowGradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, size * 1.5, 0, Math.PI * 2);
            this.ctx.fill();

            // Flame inside
            this.ctx.fillStyle = `rgba(255, 182, 193, ${flicker})`;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = '#ffb3c6';
            this.ctx.beginPath();
            this.ctx.ellipse(0, size * 0.1, size * 0.15, size * 0.25, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // Flame tip
            this.ctx.fillStyle = `rgba(255, 133, 162, ${flicker})`;
            this.ctx.shadowBlur = 12;
            this.ctx.shadowColor = '#ff85a2';
            this.ctx.beginPath();
            this.ctx.ellipse(0, -size * 0.05, size * 0.1, size * 0.2, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // Top cap
            this.ctx.fillStyle = '#d4849c';
            this.ctx.shadowBlur = 0;
            this.ctx.beginPath();
            this.ctx.rect(-size * 0.6, -size * 0.85, size * 1.2, size * 0.1);
            this.ctx.fill();

            // Bottom cap
            this.ctx.beginPath();
            this.ctx.rect(-size * 0.4, size * 0.8, size * 0.8, size * 0.08);
            this.ctx.fill();

            this.ctx.restore();
        });
    }

    stop() {
        this.isActive = false;
        this.svg.selectAll('*').remove();
    }

    resize(width, height) {
        this.createLanterns();
    }
}

window.LanternsBackground = LanternsBackground;
