// ===== BTS (Korean Kpop) Theme Background =====
// Purple aesthetic with BTS logo, lights, and choreography-inspired effects

class BTSBackground {
    constructor(canvas, ctx, svg) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.svg = d3.select(svg);
        this.isActive = false;
        this.particles = [];
        this.lights = [];
        this.stars = [];
        this.mousePos = { x: 0, y: 0 };
        this.time = 0;

        // BTS Purple colors
        this.purples = [
            { r: 95, g: 39, b: 205 },    // BTS Purple
            { r: 138, g: 43, b: 226 },   // Blue Violet
            { r: 147, g: 112, b: 219 },  // Medium Purple
            { r: 186, g: 85, b: 211 }    // Medium Orchid
        ];
    }

    init() {
        this.isActive = true;
        this.createStarField();
        this.createStageLights();
        this.createFloatingParticles();
    }

    createStarField() {
        const starCount = 100;
        this.stars = [];

        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                twinkle: Math.random() * Math.PI * 2,
                speed: 0.02 + Math.random() * 0.03
            });
        }
    }

    createStageLights() {
        const lightCount = 6;
        this.lights = [];

        for (let i = 0; i < lightCount; i++) {
            this.lights.push({
                x: (this.canvas.width / (lightCount + 1)) * (i + 1),
                y: 0,
                angle: Math.PI / 2,
                spread: Math.PI / 6,
                color: this.purples[i % this.purples.length],
                intensity: 0.6 + Math.random() * 0.4,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }

    createFloatingParticles() {
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 4 + 2,
                color: this.purples[Math.floor(Math.random() * this.purples.length)],
                opacity: Math.random() * 0.5 + 0.5
            });
        }
    }

    update(mousePos) {
        this.mousePos = mousePos;
        this.time += 0.01;

        // Update twinkling stars
        this.stars.forEach(star => {
            star.twinkle += star.speed;
        });

        // Update stage lights
        this.lights.forEach(light => {
            light.pulsePhase += 0.02;
            light.intensity = 0.5 + Math.sin(light.pulsePhase) * 0.3;
        });

        // Update floating particles
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            // Mouse interaction
            const dx = this.mousePos.x - p.x;
            const dy = this.mousePos.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 100) {
                p.vx -= (dx / dist) * 0.05;
                p.vy -= (dy / dist) * 0.05;
            }

            // Damping
            p.vx *= 0.99;
            p.vy *= 0.99;
        });
    }

    draw() {
        // Dark purple gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#0d0221');
        gradient.addColorStop(0.5, '#1a0933');
        gradient.addColorStop(1, '#2e1f47');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw star field
        this.stars.forEach(star => {
            const brightness = 0.3 + Math.sin(star.twinkle) * 0.7;
            this.ctx.save();
            this.ctx.globalAlpha = brightness;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.shadowBlur = 4;
            this.ctx.shadowColor = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });

        // Draw stage lights (spotlight beams)
        this.lights.forEach(light => {
            this.ctx.save();
            this.ctx.globalAlpha = light.intensity * 0.15;
            this.ctx.globalCompositeOperation = 'screen';

            const gradient = this.ctx.createLinearGradient(
                light.x, light.y,
                light.x, this.canvas.height
            );
            gradient.addColorStop(0, `rgba(${light.color.r}, ${light.color.g}, ${light.color.b}, 0.8)`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.moveTo(light.x, light.y);

            const spread = 150;
            this.ctx.lineTo(light.x - spread, this.canvas.height);
            this.ctx.lineTo(light.x + spread, this.canvas.height);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.restore();
        });

        // Draw BTS Logo in center (behind text)
        this.drawBTSLogo();

        // Draw floating purple particles
        this.particles.forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = p.opacity;

            const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
            gradient.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 1)`);
            gradient.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);

            this.ctx.fillStyle = gradient;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = `rgb(${p.color.r}, ${p.color.g}, ${p.color.b})`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });

        // Draw BTS Army Bomb light sticks (simplified)
        const bombCount = 8;
        for (let i = 0; i < bombCount; i++) {
            const angle = (Math.PI * 2 * i) / bombCount + this.time;
            const radius = Math.min(this.canvas.width, this.canvas.height) * 0.35;
            const x = this.canvas.width / 2 + Math.cos(angle) * radius;
            const y = this.canvas.height / 2 + Math.sin(angle) * radius;

            this.ctx.save();
            this.ctx.globalAlpha = 0.6;
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = '#5f27cd';
            this.ctx.fillStyle = '#8a2be2';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 8, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    drawBTSLogo() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const logoSize = Math.min(this.canvas.width, this.canvas.height) * 0.25;

        this.ctx.save();
        this.ctx.globalAlpha = 0.18 + Math.sin(this.time * 0.5) * 0.07;
        this.ctx.translate(centerX, centerY);

        // BTS Logo gradient
        const gradient = this.ctx.createLinearGradient(-logoSize, -logoSize, logoSize, logoSize);
        gradient.addColorStop(0, '#8a2be2');
        gradient.addColorStop(0.5, '#a855f7');
        gradient.addColorStop(1, '#c084fc');

        this.ctx.fillStyle = gradient;
        this.ctx.shadowBlur = 30;
        this.ctx.shadowColor = '#8a2be2';

        // Draw official BTS Door Logo - tall vertical doors
        const doorHeight = logoSize * 1.8;
        const doorTopWidth = logoSize * 0.4;
        const doorBottomWidth = logoSize * 0.55;
        const doorGap = logoSize * 0.12;

        // Left door - trapezoid (wider at bottom)
        this.ctx.beginPath();
        this.ctx.moveTo(-doorGap - doorTopWidth, -doorHeight / 2);
        this.ctx.lineTo(-doorGap, -doorHeight / 2);
        this.ctx.lineTo(-doorGap, doorHeight / 2);
        this.ctx.lineTo(-doorGap - doorBottomWidth, doorHeight / 2);
        this.ctx.closePath();
        this.ctx.fill();

        // Right door - trapezoid (wider at bottom)
        this.ctx.beginPath();
        this.ctx.moveTo(doorGap + doorTopWidth, -doorHeight / 2);
        this.ctx.lineTo(doorGap, -doorHeight / 2);
        this.ctx.lineTo(doorGap, doorHeight / 2);
        this.ctx.lineTo(doorGap + doorBottomWidth, doorHeight / 2);
        this.ctx.closePath();
        this.ctx.fill();

        // Draw bold "BTS" text
        this.ctx.font = `900 ${logoSize * 0.6}px Arial Black, Arial, sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';

        const textY = doorHeight / 2 + logoSize * 0.25;
        this.ctx.shadowBlur = 40;
        this.ctx.fillText('BTS', 0, textY);

        // Decorative orbiting dots
        const numDots = 8;
        for (let i = 0; i < numDots; i++) {
            const angle = (Math.PI * 2 * i) / numDots + this.time * 0.3;
            const radius = logoSize * 1.4;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            this.ctx.fillStyle = '#c084fc';
            this.ctx.shadowBlur = 15;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 5, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    stop() {
        this.isActive = false;
        this.svg.selectAll('*').remove();
    }

    resize(width, height) {
        this.createStarField();
        this.createStageLights();
        this.createFloatingParticles();
    }
}

window.BTSBackground = BTSBackground;