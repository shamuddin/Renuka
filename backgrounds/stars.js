// ===== Starry Night Sky =====
// Twinkling stars with shooting stars and constellations

class StarsBackground {
    constructor(canvas, ctx, svg) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.svg = d3.select(svg);
        this.isActive = false;
        this.stars = [];
        this.shootingStars = [];
        this.mousePos = { x: 0, y: 0 };
        this.time = 0;
    }

    init() {
        this.isActive = true;
        this.createStars();
    }

    createStars() {
        const starCount = Math.min(200, Math.floor(this.canvas.width * this.canvas.height / 5000));
        this.stars = [];

        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2.5 + 0.5,
                twinklePhase: Math.random() * Math.PI * 2,
                twinkleSpeed: 0.02 + Math.random() * 0.03,
                brightness: 0.3 + Math.random() * 0.7,
                color: this.getStarColor()
            });
        }
    }

    getStarColor() {
        const colors = [
            '#ffffff',
            '#e6f2ff',
            '#fff5e6',
            '#f0e6ff',
            '#cce6ff'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    createShootingStar() {
        const startX = Math.random() * this.canvas.width;
        const startY = Math.random() * this.canvas.height * 0.5;
        const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5;
        const speed = 8 + Math.random() * 4;

        this.shootingStars.push({
            x: startX,
            y: startY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            length: 40 + Math.random() * 40,
            life: 1,
            brightness: 0.8 + Math.random() * 0.2
        });
    }

    update(mousePos) {
        this.mousePos = mousePos;
        this.time += 0.01;

        // Update star brightness based on mouse proximity
        this.stars.forEach(star => {
            const dx = this.mousePos.x - star.x;
            const dy = this.mousePos.y - star.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                star.brightness = Math.min(1, star.brightness + 0.02);
            } else {
                star.brightness = Math.max(0.3, star.brightness - 0.01);
            }
        });

        // Update shooting stars
        this.shootingStars.forEach((star, index) => {
            star.x += star.vx;
            star.y += star.vy;
            star.life -= 0.015;

            if (star.life <= 0 || star.y > this.canvas.height) {
                this.shootingStars.splice(index, 1);
            }
        });

        // Randomly create shooting stars
        if (Math.random() < 0.01) {
            this.createShootingStar();
        }
    }

    draw() {
        // Night sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#0a0a1f');
        gradient.addColorStop(0.5, '#191970');
        gradient.addColorStop(1, '#2e1a47');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw constellation lines near mouse
        this.ctx.strokeStyle = 'rgba(230, 242, 255, 0.2)';
        this.ctx.lineWidth = 1;

        this.stars.forEach((star, i) => {
            const dx1 = this.mousePos.x - star.x;
            const dy1 = this.mousePos.y - star.y;
            const dist1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

            if (dist1 < 120) {
                this.stars.forEach((otherStar, j) => {
                    if (j > i) {
                        const dx2 = this.mousePos.x - otherStar.x;
                        const dy2 = this.mousePos.y - otherStar.y;
                        const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                        if (dist2 < 120) {
                            const dx3 = star.x - otherStar.x;
                            const dy3 = star.y - otherStar.y;
                            const dist3 = Math.sqrt(dx3 * dx3 + dy3 * dy3);

                            if (dist3 < 100) {
                                this.ctx.save();
                                this.ctx.globalAlpha = (1 - Math.max(dist1, dist2) / 120) * 0.3;
                                this.ctx.beginPath();
                                this.ctx.moveTo(star.x, star.y);
                                this.ctx.lineTo(otherStar.x, otherStar.y);
                                this.ctx.stroke();
                                this.ctx.restore();
                            }
                        }
                    }
                });
            }
        });

        // Draw stars
        this.stars.forEach(star => {
            const twinkle = 0.5 + Math.sin(this.time * 2 + star.twinklePhase) * 0.5;
            const brightness = star.brightness * twinkle;

            this.ctx.save();
            this.ctx.globalAlpha = brightness;
            this.ctx.fillStyle = star.color;
            this.ctx.shadowBlur = star.size * 3;
            this.ctx.shadowColor = star.color;

            // Draw star with points
            if (star.size > 1.5) {
                this.drawStar(star.x, star.y, 5, star.size, star.size / 2);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                this.ctx.fill();
            }

            this.ctx.restore();
        });

        // Draw shooting stars
        this.shootingStars.forEach(star => {
            this.ctx.save();
            this.ctx.globalAlpha = star.life * star.brightness;

            // Trail
            const gradient = this.ctx.createLinearGradient(
                star.x, star.y,
                star.x - star.vx * 5, star.y - star.vy * 5
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 2;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = '#ffffff';

            this.ctx.beginPath();
            this.ctx.moveTo(star.x, star.y);
            this.ctx.lineTo(star.x - star.vx * 5, star.y - star.vy * 5);
            this.ctx.stroke();

            this.ctx.restore();
        });
    }

    drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - outerRadius);

        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            this.ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
        }

        this.ctx.lineTo(cx, cy - outerRadius);
        this.ctx.closePath();
        this.ctx.fill();
    }

    stop() {
        this.isActive = false;
        this.svg.selectAll('*').remove();
    }

    resize(width, height) {
        this.createStars();
    }
}

window.StarsBackground = StarsBackground;
