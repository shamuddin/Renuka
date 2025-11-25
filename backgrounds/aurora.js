// ===== Aurora Borealis with Mountains =====
// Northern lights over mountain landscape

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
        this.snowflakes = [];
        this.mousePos = { x: 0, y: 0 };

        this.colors = {
            aurora: [
                { r: 0, g: 255, b: 136 },    // Green
                { r: 179, g: 136, b: 255 },  // Purple
                { r: 100, g: 181, b: 246 },  // Blue
                { r: 138, g: 226, b: 52 }    // Lime green
            ]
        };
    }

    init() {
        this.isActive = true;
        this.createStars();
        this.createMountains();
        this.createAuroraWaves();
        this.createSnowflakes();
    }

    createStars() {
        const starCount = 150;
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
                color: '#0a0a1a',
                opacity: 0.9
            },
            {
                peaks: this.generateMountainPath(0.75, 0.12),
                color: '#1a1a2e',
                opacity: 0.7
            },
            {
                peaks: this.generateMountainPath(0.65, 0.1),
                color: '#2a2a3e',
                opacity: 0.5
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
                opacity: 0.3 - i * 0.05,
                colorIndex: i % this.colors.aurora.length,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    createSnowflakes() {
        for (let i = 0; i < 50; i++) {
            this.snowflakes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speed: Math.random() * 0.5 + 0.2,
                drift: (Math.random() - 0.5) * 0.3
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

        // Update snowflakes
        this.snowflakes.forEach(flake => {
            flake.y += flake.speed;
            flake.x += flake.drift;

            if (flake.y > this.canvas.height) {
                flake.y = -10;
                flake.x = Math.random() * this.canvas.width;
            }

            if (flake.x < 0) flake.x = this.canvas.width;
            if (flake.x > this.canvas.width) flake.x = 0;
        });
    }

    draw() {
        // Night sky gradient
        const skyGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        skyGradient.addColorStop(0, '#0a0520');
        skyGradient.addColorStop(0.5, '#1a0f3e');
        skyGradient.addColorStop(1, '#2e1a47');
        this.ctx.fillStyle = skyGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw stars
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

        // Draw aurora waves
        this.auroraWaves.forEach(wave => {
            const color = this.colors.aurora[wave.colorIndex];

            this.ctx.save();
            this.ctx.globalAlpha = wave.opacity;
            this.ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`;
            this.ctx.shadowBlur = 40;
            this.ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`;

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

        // Draw snowflakes
        this.snowflakes.forEach(flake => {
            this.ctx.save();
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.shadowBlur = 3;
            this.ctx.shadowColor = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });

        // Reflection on "ice" surface
        const reflectionGradient = this.ctx.createLinearGradient(
            0, this.canvas.height * 0.85,
            0, this.canvas.height
        );
        reflectionGradient.addColorStop(0, 'rgba(100, 181, 246, 0.1)');
        reflectionGradient.addColorStop(1, 'rgba(100, 181, 246, 0.05)');
        this.ctx.fillStyle = reflectionGradient;
        this.ctx.fillRect(0, this.canvas.height * 0.85, this.canvas.width, this.canvas.height * 0.15);
    }

    calculateMouseInfluence(x, y) {
        const dx = x - this.mousePos.x;
        const dy = y - this.mousePos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;

        if (distance < maxDistance) {
            const influence = (1 - distance / maxDistance) * 30;
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
        this.createSnowflakes();
    }
}

window.AuroraBackground = AuroraBackground;
