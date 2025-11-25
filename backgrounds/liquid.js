// ===== Liquid Love (Fluid Simulation) =====
// Flowing liquid with metaball effect

class LiquidBackground {
    constructor(canvas, ctx, svg) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.svg = d3.select(svg);
        this.isActive = false;
        this.blobs = [];
        this.mousePos = { x: 0, y: 0 };
        this.time = 0;
        this.ripples = [];
    }

    init() {
        this.isActive = true;
        this.createBlobs();
    }

    createBlobs() {
        const blobCount = Math.min(15, Math.floor(this.canvas.width * this.canvas.height / 80000));
        this.blobs = [];

        for (let i = 0; i < blobCount; i++) {
            this.blobs.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 60 + 40,
                phase: Math.random() * Math.PI * 2,
                speed: 0.02 + Math.random() * 0.02,
                colorPhase: Math.random() * Math.PI * 2
            });
        }
    }

    update(mousePos) {
        this.mousePos = mousePos;
        this.time += 0.01;

        // Update blobs
        this.blobs.forEach(blob => {
            // Smooth organic movement
            blob.x += blob.vx + Math.sin(this.time + blob.phase) * 0.5;
            blob.y += blob.vy + Math.cos(this.time + blob.phase) * 0.5;

            // Mouse ripple effect
            const dx = this.mousePos.x - blob.x;
            const dy = this.mousePos.y - blob.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 200 && distance > 0) {
                const force = (200 - distance) / 200 * 0.3;
                blob.vx -= (dx / distance) * force;
                blob.vy -= (dy / distance) * force;
            }

            // Damping
            blob.vx *= 0.98;
            blob.vy *= 0.98;

            // Boundary wrapping
            if (blob.x < -blob.size) blob.x = this.canvas.width + blob.size;
            if (blob.x > this.canvas.width + blob.size) blob.x = -blob.size;
            if (blob.y < -blob.size) blob.y = this.canvas.height + blob.size;
            if (blob.y > this.canvas.height + blob.size) blob.y = -blob.size;
        });

        // Update ripples
        this.ripples.forEach((ripple, index) => {
            ripple.radius += ripple.speed;
            ripple.life -= 0.02;

            if (ripple.life <= 0) {
                this.ripples.splice(index, 1);
            }
        });
    }

    draw() {
        // Liquid gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#1a0a2e');
        gradient.addColorStop(0.5, '#16213e');
        gradient.addColorStop(1, '#0f3460');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw ripples
        this.ripples.forEach(ripple => {
            this.ctx.save();
            this.ctx.globalAlpha = ripple.life * 0.3;
            this.ctx.strokeStyle = 'rgba(255, 182, 193, 0.8)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.restore();
        });

        // Draw blobs with metaball effect
        this.blobs.forEach((blob, index) => {
            // Color cycling
            const hue = (this.time * 20 + blob.colorPhase * 180) % 60 + 300;
            const color = `hsl(${hue}, 100%, 65%)`;

            // Pulsing size
            const pulse = 1 + Math.sin(this.time * 2 + blob.phase) * 0.15;
            const size = blob.size * pulse;

            // Draw main blob
            const gradient = this.ctx.createRadialGradient(
                blob.x, blob.y, 0,
                blob.x, blob.y, size
            );
            gradient.addColorStop(0, color);
            gradient.addColorStop(0.5, `${color.slice(0, -1)}, 0.8)`);
            gradient.addColorStop(1, 'rgba(255, 0, 110, 0)');

            this.ctx.save();
            this.ctx.fillStyle = gradient;
            this.ctx.globalCompositeOperation = 'screen';
            this.ctx.shadowBlur = 30;
            this.ctx.shadowColor = color;
            this.ctx.beginPath();
            this.ctx.arc(blob.x, blob.y, size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();

            // Draw heart-shaped particles inside blobs
            if (index % 2 === 0) {
                this.ctx.save();
                this.ctx.translate(blob.x, blob.y);
                this.ctx.rotate(this.time + blob.phase);
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';

                const heartSize = size * 0.3;
                this.ctx.beginPath();
                this.ctx.moveTo(0, heartSize * 0.3);
                this.ctx.bezierCurveTo(-heartSize * 0.5, -heartSize * 0.3, -heartSize, heartSize * 0.1, 0, heartSize);
                this.ctx.bezierCurveTo(heartSize, heartSize * 0.1, heartSize * 0.5, -heartSize * 0.3, 0, heartSize * 0.3);
                this.ctx.fill();
                this.ctx.restore();
            }
        });

        // Metaball merging effect
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';

        for (let i = 0; i < this.blobs.length; i++) {
            for (let j = i + 1; j < this.blobs.length; j++) {
                const b1 = this.blobs[i];
                const b2 = this.blobs[j];
                const dx = b2.x - b1.x;
                const dy = b2.y - b1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const threshold = b1.size + b2.size;

                if (distance < threshold) {
                    const midX = (b1.x + b2.x) / 2;
                    const midY = (b1.y + b2.y) / 2;
                    const mergeSize = (threshold - distance) / 2;

                    const gradient = this.ctx.createRadialGradient(
                        midX, midY, 0,
                        midX, midY, mergeSize
                    );
                    gradient.addColorStop(0, 'rgba(255, 107, 157, 0.4)');
                    gradient.addColorStop(1, 'rgba(255, 107, 157, 0)');

                    this.ctx.fillStyle = gradient;
                    this.ctx.beginPath();
                    this.ctx.arc(midX, midY, mergeSize, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }

        this.ctx.restore();
    }

    createRipple(x, y) {
        this.ripples.push({
            x: x,
            y: y,
            radius: 0,
            speed: 3,
            life: 1
        });
    }

    stop() {
        this.isActive = false;
        this.svg.selectAll('*').remove();
    }

    resize(width, height) {
        this.createBlobs();
    }
}

window.LiquidBackground = LiquidBackground;
