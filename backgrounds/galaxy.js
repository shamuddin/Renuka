// ===== Galaxy Spiral Background =====
// Spiral galaxy with rotating stars and nebula clouds

class GalaxyBackground {
    constructor(canvas, ctx, svg) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.svg = d3.select(svg);
        this.isActive = false;
        this.stars = [];
        this.nebulaClouds = [];
        this.mousePos = { x: 0, y: 0 };
        this.time = 0;
        this.centerX = 0;
        this.centerY = 0;
    }

    init() {
        this.isActive = true;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.createStars();
        this.createNebulaClouds();
    }

    createStars() {
        const starCount = Math.min(150, Math.floor(this.canvas.width * this.canvas.height / 8000));
        this.stars = [];

        for (let i = 0; i < starCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * Math.min(this.canvas.width, this.canvas.height) * 0.45;

            this.stars.push({
                angle: angle,
                distance: distance,
                size: Math.random() * 2 + 0.5,
                speed: 0.001 + Math.random() * 0.002,
                brightness: Math.random() * 0.5 + 0.5,
                color: this.getStarColor()
            });
        }
    }

    getStarColor() {
        const colors = [
            { r: 147, g: 112, b: 219 }, // Purple
            { r: 138, g: 43, b: 226 },  // Blue Violet
            { r: 255, g: 182, b: 193 }, // Light Pink
            { r: 135, g: 206, b: 250 }, // Light Sky Blue
            { r: 255, g: 255, b: 255 }  // White
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    createNebulaClouds() {
        const cloudCount = 8;
        this.nebulaClouds = [];

        for (let i = 0; i < cloudCount; i++) {
            const angle = (Math.PI * 2 * i) / cloudCount;
            const distance = Math.random() * 150 + 100;

            this.nebulaClouds.push({
                angle: angle,
                distance: distance,
                size: Math.random() * 150 + 100,
                speed: 0.0008 + Math.random() * 0.0006,
                opacity: Math.random() * 0.3 + 0.2,
                color: i % 2 === 0 ?
                    { r: 147, g: 112, b: 219 } :
                    { r: 255, g: 182, b: 193 }
            });
        }
    }

    update(mousePos) {
        this.mousePos = mousePos;
        this.time += 0.005; // Faster rotation

        // Update star positions (spiral rotation)
        this.stars.forEach(star => {
            star.angle += star.speed;

            // Mouse interaction - stars drift outward near cursor
            const x = this.centerX + Math.cos(star.angle) * star.distance;
            const y = this.centerY + Math.sin(star.angle) * star.distance;
            const dx = this.mousePos.x - x;
            const dy = this.mousePos.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                star.distance += 0.5;
            } else if (star.distance > 50) {
                star.distance *= 0.998; // Slowly return
            }
        });

        // Update nebula clouds
        this.nebulaClouds.forEach(cloud => {
            cloud.angle += cloud.speed;
        });
    }

    draw() {
        // Deep space gradient
        const gradient = this.ctx.createRadialGradient(
            this.centerX, this.centerY, 0,
            this.centerX, this.centerY, Math.max(this.canvas.width, this.canvas.height) * 0.7
        );
        gradient.addColorStop(0, '#1a0033');
        gradient.addColorStop(0.5, '#0d001a');
        gradient.addColorStop(1, '#000000');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw nebula clouds
        this.nebulaClouds.forEach(cloud => {
            const x = this.centerX + Math.cos(cloud.angle) * cloud.distance;
            const y = this.centerY + Math.sin(cloud.angle) * cloud.distance;

            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, cloud.size);
            gradient.addColorStop(0, `rgba(${cloud.color.r}, ${cloud.color.g}, ${cloud.color.b}, ${cloud.opacity})`);
            gradient.addColorStop(0.5, `rgba(${cloud.color.r}, ${cloud.color.g}, ${cloud.color.b}, ${cloud.opacity * 0.5})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            this.ctx.save();
            this.ctx.globalCompositeOperation = 'screen';
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, cloud.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });

        // Draw spiral arms (connecting lines)
        this.ctx.save();
        this.ctx.globalAlpha = 0.15;
        this.ctx.strokeStyle = 'rgba(147, 112, 219, 0.5)';
        this.ctx.lineWidth = 2;

        for (let arm = 0; arm < 3; arm++) {
            this.ctx.beginPath();
            const armAngle = (Math.PI * 2 * arm) / 3 + this.time;

            for (let i = 0; i < 100; i++) {
                const t = i / 100;
                const angle = armAngle + t * Math.PI * 4;
                const distance = t * Math.min(this.canvas.width, this.canvas.height) * 0.45;
                const x = this.centerX + Math.cos(angle) * distance;
                const y = this.centerY + Math.sin(angle) * distance;

                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.stroke();
        }
        this.ctx.restore();

        // Draw stars
        this.stars.forEach(star => {
            const x = this.centerX + Math.cos(star.angle) * star.distance;
            const y = this.centerY + Math.sin(star.angle) * star.distance;

            this.ctx.save();
            this.ctx.globalAlpha = star.brightness;
            this.ctx.fillStyle = `rgb(${star.color.r}, ${star.color.g}, ${star.color.b})`;
            this.ctx.shadowBlur = star.size * 3;
            this.ctx.shadowColor = `rgb(${star.color.r}, ${star.color.g}, ${star.color.b})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });

        // Draw center glow
        const centerGlow = this.ctx.createRadialGradient(
            this.centerX, this.centerY, 0,
            this.centerX, this.centerY, 80
        );
        centerGlow.addColorStop(0, 'rgba(255, 182, 193, 0.4)');
        centerGlow.addColorStop(0.5, 'rgba(147, 112, 219, 0.2)');
        centerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

        this.ctx.fillStyle = centerGlow;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 80, 0, Math.PI * 2);
        this.ctx.fill();
    }

    stop() {
        this.isActive = false;
        this.svg.selectAll('*').remove();
    }

    resize(width, height) {
        this.centerX = width / 2;
        this.centerY = height / 2;
        this.createStars();
        this.createNebulaClouds();
    }
}

window.GalaxyBackground = GalaxyBackground;
