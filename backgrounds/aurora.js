// ===== Aurora Borealis with Mountains =====
// Northern lights over mountain landscape - Pink/Cream Theme

class AuroraBackground {
    constructor(canvas, ctx, svg) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.svg = d3.select(svg);
        this.isActive = false;
        this.time = 0;
        this.mountains = [];
        this.auroraWaves = [];
        this.stars = [];
        this.petals = [];
        this.mousePos = { x: 0, y: 0 };

        this.colors = {
            aurora: [
                { r: 255, g: 182, b: 193 },    // Light pink
                { r: 255, g: 105, b: 180 },    // Hot pink
                { r: 221, g: 160, b: 221 },    // Plum
                { r: 255, g: 218, b: 185 },    // Peach
                { r: 255, g: 192, b: 203 }     // Pink
            ]
        };
    }

    init() {
        this.isActive = true;
        this.createStars();
        this.createMountains();
        this.createAuroraWaves();
        this.createPetals();
    }

    createStars() {
        const starCount = 100;
        this.stars = [];

        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height * 0.6,
                size: Math.random() * 2 + 0.5,
                twinkle: Math.random() * Math.PI * 2,
                speed: 0.02 + Math.random() * 0.03
            });
        }
    }

    createMountains() {
        this.mountains = [
            {
                peaks: this.generateMountainPath(0.85, 0.15),
                color: '#ffc4d6',
                opacity: 0.6
            },
            {
                peaks: this.generateMountainPath(0.75, 0.12),
                color: '#ffb3c6',
                opacity: 0.5
            },
            {
                peaks: this.generateMountainPath(0.65, 0.1),
                color: '#ffa8c5',
                opacity: 0.4
            }
        ];
    }

    generateMountainPath(heightFactor, variance) {
        const points = [];
        const segments = 20;

        for (let i = 0; i <= segments; i++) {
            const x = (this.canvas.width / segments) * i;
            const baseHeight = this.canvas.height * heightFactor;
            const variation = (Math.random() - 0.5) * this.canvas.height * variance;
            const y = baseHeight + variation + Math.sin(i * 0.5) * 50;
            points.push({ x, y });
        }

        return points;
    }

    createAuroraWaves() {
        for (let i = 0; i < 5; i++) {
            this.auroraWaves.push({
                y: this.canvas.height * 0.2 + i * 60,
                amplitude: 80 + i * 15,
                frequency: 0.002 + i * 0.0005,
                speed: 0.5 + i * 0.2,
                opacity: 0.25 - i * 0.04,
                colorIndex: i % this.colors.aurora.length,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    createPetals() {
        for (let i = 0; i < 30; i++) {
            this.petals.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 6 + 3,
                speed: Math.random() * 0.8 + 0.3,
                drift: (Math.random() - 0.5) * 0.5,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                color: ['#ffb3c6', '#ffc4d6', '#ffd4e5', '#ffa8c5'][Math.floor(Math.random() * 4)]
            });
        }
    }

    update(mousePos) {
        this.mousePos = mousePos;
        this.time += 0.01;

        // Update stars
        this.stars.forEach(star => {
            star.twinkle += star.speed;
        });

        // Update petals
        this.petals.forEach(petal => {
            petal.y += petal.speed;
            petal.x += petal.drift;
            petal.rotation += petal.rotationSpeed;

            if (petal.y > this.canvas.height) {
                petal.y = -20;
                petal.x = Math.random() * this.canvas.width;
            }

            if (petal.x < 0) petal.x = this.canvas.width;
            if (petal.x > this.canvas.width) petal.x = 0;
        });
    }

    draw() {
        // Light cream/pink gradient background
        const skyGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        skyGradient.addColorStop(0, '#fff8f1');
        skyGradient.addColorStop(0.4, '#ffe4e6');
        skyGradient.addColorStop(0.8, '#fff0f3');
        skyGradient.addColorStop(1, '#ffe8e8');
        this.ctx.fillStyle = skyGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw stars (soft gold/pink sparkles)
        this.stars.forEach(star => {
            const brightness = 0.4 + Math.sin(star.twinkle) * 0.4;
            this.ctx.save();
            this.ctx.globalAlpha = brightness;
            this.ctx.fillStyle = '#ffd700';
            this.ctx.shadowBlur = 6;
            this.ctx.shadowColor = 'rgba(255, 182, 193, 0.8)';
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });

        // Draw aurora waves
        this.auroraWaves.forEach(wave => {
            const color = this.colors.aurora[wave.colorIndex];

            this.ctx.save();
            this.ctx.globalAlpha = wave.opacity;
            this.ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.25)`;
            this.ctx.shadowBlur = 30;
            this.ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`;

            this.ctx.beginPath();
            this.ctx.moveTo(0, this.canvas.height);

            for (let x = 0; x <= this.canvas.width; x += 5) {
                const mouseInfluence = this.calculateMouseInfluence(x, wave.y);
                const y = wave.y +
                    Math.sin(x * wave.frequency + this.time * wave.speed + wave.phase) * wave.amplitude +
                    mouseInfluence;
                this.ctx.lineTo(x, y);
            }

            this.ctx.lineTo(this.canvas.width, this.canvas.height);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.restore();
        });

        // Draw mountains (back to front)
        this.mountains.forEach(mountain => {
            this.ctx.save();
            this.ctx.globalAlpha = mountain.opacity;
            this.ctx.fillStyle = mountain.color;

            this.ctx.beginPath();
            this.ctx.moveTo(0, this.canvas.height);

            mountain.peaks.forEach((point, i) => {
                if (i === 0) {
                    this.ctx.lineTo(point.x, point.y);
                } else {
                    this.ctx.lineTo(point.x, point.y);
                }
            });

            this.ctx.lineTo(this.canvas.width, this.canvas.height);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.restore();
        });

        // Draw floating petals
        this.petals.forEach(petal => {
            this.ctx.save();
            this.ctx.translate(petal.x, petal.y);
            this.ctx.rotate(petal.rotation);
            this.ctx.fillStyle = petal.color;
            this.ctx.globalAlpha = 0.6;
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, petal.size, petal.size * 0.6, 0, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });

        // Soft reflection on surface
        const reflectionGradient = this.ctx.createLinearGradient(
            0, this.canvas.height * 0.85,
            0, this.canvas.height
        );
        reflectionGradient.addColorStop(0, 'rgba(255, 182, 193, 0.15)');
        reflectionGradient.addColorStop(1, 'rgba(255, 182, 193, 0.05)');
        this.ctx.fillStyle = reflectionGradient;
        this.ctx.fillRect(0, this.canvas.height * 0.85, this.canvas.width, this.canvas.height * 0.15);
    }

    calculateMouseInfluence(x, y) {
        const dx = x - this.mousePos.x;
        const dy = y - this.mousePos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;

        if (distance < maxDistance) {
            const influence = (1 - distance / maxDistance) * 25;
            return influence * (dy / Math.abs(dy) || 1);
        }
        return 0;
    }

    stop() {
        this.isActive = false;
        this.svg.selectAll('*').remove();
    }

    resize(width, height) {
        this.createStars();
        this.createMountains();
        this.createAuroraWaves();
        this.createPetals();
    }
}

window.AuroraBackground = AuroraBackground;
