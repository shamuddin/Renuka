// ===== Blooming Flower Field =====
// Flowers that bloom and petals that fall - Pink/Cream Theme

class FlowersBackground {
    constructor(canvas, ctx, svg) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.svg = d3.select(svg);
        this.isActive = false;
        this.flowers = [];
        this.fallingPetals = [];
        this.mousePos = { x: 0, y: 0 };
        this.time = 0;
    }

    init() {
        this.isActive = true;
        this.createFlowers();
    }

    createFlowers() {
        const flowerCount = Math.min(25, Math.floor(this.canvas.width * this.canvas.height / 50000));
        this.flowers = [];

        for (let i = 0; i < flowerCount; i++) {
            this.flowers.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height * 0.6 + Math.random() * this.canvas.height * 0.4,
                size: Math.random() * 30 + 20,
                petalCount: 5 + Math.floor(Math.random() * 3),
                bloomProgress: Math.random(),
                bloomSpeed: 0.003 + Math.random() * 0.002,
                rotation: Math.random() * Math.PI * 2,
                color: this.getFlowerColor(),
                swayPhase: Math.random() * Math.PI * 2
            });
        }

        // Create initial falling petals
        for (let i = 0; i < 20; i++) {
            this.createFallingPetal();
        }
    }

    getFlowerColor() {
        const colors = [
            { primary: '#ff69b4', secondary: '#ffb3d9' },
            { primary: '#ff85a2', secondary: '#ffc4d6' },
            { primary: '#ffb3c6', secondary: '#ffe4e6' },
            { primary: '#ffa8c5', secondary: '#ffd4e5' },
            { primary: '#ff6b9d', secondary: '#ff8fab' }
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    createFallingPetal() {
        this.fallingPetals.push({
            x: Math.random() * this.canvas.width,
            y: -20,
            vx: (Math.random() - 0.5) * 0.8,
            vy: Math.random() * 1.5 + 0.8,
            size: Math.random() * 8 + 4,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.05,
            color: this.getFlowerColor().primary,
            swayAmplitude: Math.random() * 2 + 1,
            swaySpeed: Math.random() * 0.05 + 0.02
        });
    }

    update(mousePos) {
        this.mousePos = mousePos;
        this.time += 0.01;

        // Update flower bloom
        this.flowers.forEach(flower => {
            if (flower.bloomProgress < 1) {
                flower.bloomProgress += flower.bloomSpeed;
            }

            // Check for mouse interaction
            const dx = this.mousePos.x - flower.x;
            const dy = this.mousePos.y - flower.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100 && flower.bloomProgress < 0.5) {
                flower.bloomProgress = Math.min(1, flower.bloomProgress + 0.05);
            }
        });

        // Update falling petals
        this.fallingPetals.forEach((petal, index) => {
            petal.x += petal.vx + Math.sin(this.time * petal.swaySpeed) * petal.swayAmplitude;
            petal.y += petal.vy;
            petal.rotation += petal.rotationSpeed;

            // Mouse scatter effect
            const dx = this.mousePos.x - petal.x;
            const dy = this.mousePos.y - petal.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 80) {
                petal.vx += (petal.x - this.mousePos.x) / distance * 0.5;
                petal.vy += (petal.y - this.mousePos.y) / distance * 0.3;
            }

            // Remove and recreate petals
            if (petal.y > this.canvas.height + 20) {
                this.fallingPetals.splice(index, 1);
                this.createFallingPetal();
            }
        });
    }

    draw() {
        // Cream/pink gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#fff8f1');
        gradient.addColorStop(0.4, '#ffe4e6');
        gradient.addColorStop(0.8, '#fff0f3');
        gradient.addColorStop(1, '#ffe8e8');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw flowers
        this.flowers.forEach(flower => {
            this.ctx.save();
            this.ctx.translate(flower.x, flower.y);

            // Gentle sway
            const sway = Math.sin(this.time + flower.swayPhase) * 0.05;
            this.ctx.rotate(sway);

            // Draw stem
            this.ctx.strokeStyle = '#7fb069';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(0, 30);
            this.ctx.stroke();

            // Draw petals
            const petalSize = flower.size * flower.bloomProgress;
            for (let i = 0; i < flower.petalCount; i++) {
                const angle = (Math.PI * 2 * i) / flower.petalCount + flower.rotation;
                this.ctx.save();
                this.ctx.rotate(angle);
                this.ctx.fillStyle = flower.color.primary;
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = flower.color.primary;

                // Petal shape
                this.ctx.beginPath();
                this.ctx.ellipse(0, -petalSize * 0.5, petalSize * 0.4, petalSize * 0.6, 0, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            }

            // Draw center
            this.ctx.fillStyle = flower.color.secondary;
            this.ctx.shadowBlur = 5;
            this.ctx.shadowColor = flower.color.secondary;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, petalSize * 0.3, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.restore();
        });

        // Draw falling petals
        this.fallingPetals.forEach(petal => {
            this.ctx.save();
            this.ctx.translate(petal.x, petal.y);
            this.ctx.rotate(petal.rotation);
            this.ctx.fillStyle = petal.color;
            this.ctx.globalAlpha = 0.7;

            // Petal shape
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, petal.size, petal.size * 1.5, 0, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    stop() {
        this.isActive = false;
        this.svg.selectAll('*').remove();
    }

    resize(width, height) {
        this.createFlowers();
    }
}

window.FlowersBackground = FlowersBackground;
