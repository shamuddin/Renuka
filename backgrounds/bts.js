// ===== BTS (Korean Kpop) Theme Background =====
// Purple/pink aesthetic with lights and choreography-inspired effects - Pink/Cream Theme

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

        // Pink/Purple romantic colors
        this.colors = [
            { r: 255, g: 105, b: 180 },   // Hot pink
            { r: 255, g: 133, b: 162 },   // Light pink
            { r: 186, g: 85, b: 211 },    // Medium orchid
            { r: 221, g: 160, b: 221 },   // Plum
            { r: 255, g: 182, b: 193 }    // Light pink
        ];
    }

    init() {
        this.isActive = true;
        this.createStarField();
        this.createStageLights();
        this.createFloatingParticles();
    }

    createStarField() {
        const starCount = 80;
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
                color: this.colors[i % this.colors.length],
                intensity: 0.5 + Math.random() * 0.4,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }

    createFloatingParticles() {
        for (let i = 0; i < 35; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 5 + 2,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                opacity: Math.random() * 0.4 + 0.4
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
            light.intensity = 0.4 + Math.sin(light.pulsePhase) * 0.25;
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
        // Light cream/pink gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#fff8f1');
        gradient.addColorStop(0.4, '#ffe4e6');
        gradient.addColorStop(0.8, '#fff0f3');
        gradient.addColorStop(1, '#f8e8f8');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw star field
        this.stars.forEach(star => {
            const brightness = 0.4 + Math.sin(star.twinkle) * 0.4;
            this.ctx.save();
            this.ctx.globalAlpha = brightness;
            this.ctx.fillStyle = '#ffd700';
            this.ctx.shadowBlur = 4;
            this.ctx.shadowColor = 'rgba(255, 105, 180, 0.6)';
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });

        // Draw stage lights (spotlight beams)
        this.lights.forEach(light => {
            this.ctx.save();
            this.ctx.globalAlpha = light.intensity * 0.12;
            this.ctx.globalCompositeOperation = 'screen';

            const gradient = this.ctx.createLinearGradient(
                light.x, light.y,
                light.x, this.canvas.height
            );
            gradient.addColorStop(0, `rgba(${light.color.r}, ${light.color.g}, ${light.color.b}, 0.7)`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

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

        // Draw heart logo in center (behind text)
        this.drawHeartLogo();

        // Draw floating particles
        this.particles.forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = p.opacity;

            const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
            gradient.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.9)`);
            gradient.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);

            this.ctx.fillStyle = gradient;
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.5)`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });

        // Draw romantic orbiting hearts
        const heartCount = 8;
        for (let i = 0; i < heartCount; i++) {
            const angle = (Math.PI * 2 * i) / heartCount + this.time * 0.3;
            const radius = Math.min(this.canvas.width, this.canvas.height) * 0.35;
            const x = this.canvas.width / 2 + Math.cos(angle) * radius;
            const y = this.canvas.height / 2 + Math.sin(angle) * radius;

            this.ctx.save();
            this.ctx.globalAlpha = 0.5;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = '#ff69b4';
            this.ctx.fillStyle = '#ff85a2';
            
            const size = 8;
            this.ctx.translate(x, y);
            this.ctx.beginPath();
            this.ctx.moveTo(0, size * 0.3);
            this.ctx.bezierCurveTo(-size * 0.5, -size * 0.3, -size, size * 0.1, 0, size);
            this.ctx.bezierCurveTo(size, size * 0.1, size * 0.5, -size * 0.3, 0, size * 0.3);
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    drawHeartLogo() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const logoSize = Math.min(this.canvas.width, this.canvas.height) * 0.2;

        this.ctx.save();
        this.ctx.globalAlpha = 0.15 + Math.sin(this.time * 0.5) * 0.05;
        this.ctx.translate(centerX, centerY);

        // Heart gradient
        const gradient = this.ctx.createLinearGradient(-logoSize, -logoSize, logoSize, logoSize);
        gradient.addColorStop(0, '#ff69b4');
        gradient.addColorStop(0.5, '#ff85a2');
        gradient.addColorStop(1, '#ffc4d6');

        this.ctx.fillStyle = gradient;
        this.ctx.shadowBlur = 30;
        this.ctx.shadowColor = 'rgba(255, 105, 180, 0.5)';

        // Draw large heart shape
        const size = logoSize;
        this.ctx.beginPath();
        this.ctx.moveTo(0, size * 0.3);
        this.ctx.bezierCurveTo(-size * 0.5, -size * 0.3, -size, size * 0.1, 0, size);
        this.ctx.bezierCurveTo(size, size * 0.1, size * 0.5, -size * 0.3, 0, size * 0.3);
        this.ctx.fill();

        // Decorative orbiting sparkles
        const numDots = 8;
        for (let i = 0; i < numDots; i++) {
            const angle = (Math.PI * 2 * i) / numDots + this.time * 0.3;
            const radius = logoSize * 1.3;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            this.ctx.fillStyle = '#ffd700';
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = '#ffd700';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, Math.PI * 2);
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
