// ===== Interaction System with Background-Specific Effects =====
// Each background has its own unique click explosion effect

class InteractionSystem {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.mousePos = { x: 0, y: 0 };
        this.prevMousePos = { x: 0, y: 0 };
        this.particles = [];
        this.trailParticles = [];
        this.isTouch = false;
        this.frameCount = 0;
        this.currentBackground = 'aurora'; // Default

        this.init();
    }

    init() {
        // Track mouse position
        window.addEventListener('mousemove', (e) => {
            this.prevMousePos = { ...this.mousePos };
            this.mousePos = { x: e.clientX, y: e.clientY };
            this.isTouch = false;
        });

        // Click to bloom - background-specific
        window.addEventListener('click', (e) => {
            if (!this.isTouch) {
                this.createBackgroundSpecificEffect(e.clientX, e.clientY);
            }
        });

        // Touch support
        window.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            this.prevMousePos = { ...this.mousePos };
            this.mousePos = { x: touch.clientX, y: touch.clientY };
            this.isTouch = true;
            e.preventDefault();
        }, { passive: false });

        window.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            this.createBackgroundSpecificEffect(touch.clientX, touch.clientY);
        });
    }

    setBackground(bgName) {
        this.currentBackground = bgName;
    }

    // Create glowing trail particle
    createTrailParticle() {
        if (this.frameCount % 2 !== 0) return;

        const particle = {
            x: this.mousePos.x,
            y: this.mousePos.y,
            size: Math.random() * 5 + 3,
            life: 1,
            color: `hsla(${Math.random() * 60 + 300}, 100%, 75%, 0.9)`,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3
        };

        this.trailParticles.push(particle);

        if (this.trailParticles.length > 50) {
            this.trailParticles.shift();
        }
    }

    // Background-specific click effects
    createBackgroundSpecificEffect(x, y) {
        switch (this.currentBackground) {
            case 'aurora':
                this.createAuroraEffect(x, y);
                break;
            case 'hearts':
                this.createHeartsEffect(x, y);
                break;
            case 'flowers':
                this.createFlowersEffect(x, y);
                break;
            case 'stars':
                this.createStarsEffect(x, y);
                break;
            case 'bts':
                this.createBTSEffect(x, y);
                break;
            case 'lanterns':
                this.createLanternsEffect(x, y);
                break;
            case 'loveletters':
                this.createLoveLettersEffect(x, y);
                break;
            default:
                this.createAuroraEffect(x, y);
        }
    }

    // Aurora: Green, purple, blue waves
    createAuroraEffect(x, y) {
        const colors = [
            'hsla(150, 100%, 60%, 0.9)',
            'hsla(270, 70%, 65%, 0.9)',
            'hsla(200, 80%, 70%, 0.9)'
        ];

        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20 + Math.random() * 0.5;
            const velocity = Math.random() * 4 + 2;

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: Math.random() * 8 + 4,
                life: 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: 'circle',
                rotation: 0
            });
        }
    }

    // Hearts: Pink heart shapes
    createHeartsEffect(x, y) {
        const colors = [
            'hsla(330, 100%, 70%, 0.9)',
            'hsla(350, 100%, 75%, 0.9)',
            'hsla(310, 100%, 80%, 0.9)'
        ];

        for (let i = 0; i < 25; i++) {
            const angle = (Math.PI * 2 * i) / 25;
            const velocity = Math.random() * 4 + 3;

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: Math.random() * 5 + 2,
                life: 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: 'heart',
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.15
            });
        }
    }

    // Flowers: Petal shapes
    createFlowersEffect(x, y) {
        const colors = [
            'hsla(340, 100%, 70%, 0.9)',
            'hsla(280, 60%, 75%, 0.9)',
            'hsla(30, 100%, 80%, 0.9)'
        ];

        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 5 + 2;

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity - 1,
                size: Math.random() * 6 + 3,
                life: 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: 'petal',
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.1
            });
        }
    }

    // Stars: Star shapes with sparkles
    createStarsEffect(x, y) {
        const colors = [
            'hsla(60, 100%, 90%, 0.9)',
            'hsla(200, 100%, 85%, 0.9)',
            'hsla(0, 0%, 100%, 0.9)'
        ];

        for (let i = 0; i < 25; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 5 + 3;

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: Math.random() * 4 + 2,
                life: 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: 'star',
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.2
            });
        }
    }

    // BTS: Purple hearts and sparkles
    createBTSEffect(x, y) {
        const colors = [
            'hsla(270, 75%, 60%, 0.9)',
            'hsla(280, 70%, 70%, 0.9)',
            'hsla(290, 100%, 75%, 0.9)'
        ];

        for (let i = 0; i < 28; i++) {
            const angle = (Math.PI * 2 * i) / 28;
            const velocity = Math.random() * 5 + 3;

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: Math.random() * 6 + 3,
                life: 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: i % 2 === 0 ? 'heart' : 'circle',
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.15
            });
        }
    }

    // Lanterns: Flame-like particles
    createLanternsEffect(x, y) {
        const colors = [
            'hsla(30, 100%, 60%, 0.9)',
            'hsla(45, 100%, 70%, 0.9)',
            'hsla(15, 100%, 65%, 0.9)'
        ];

        for (let i = 0; i < 22; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 3 + 2;

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity - 2,
                size: Math.random() * 7 + 4,
                life: 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: 'flame',
                rotation: 0
            });
        }
    }

    // Love Letters: Pink hearts and envelope particles
    createLoveLettersEffect(x, y) {
        const colors = [
            'hsla(340, 100%, 70%, 0.9)',
            'hsla(320, 100%, 75%, 0.9)',
            'hsla(350, 100%, 80%, 0.9)',
            'hsla(330, 90%, 65%, 0.9)'
        ];

        for (let i = 0; i < 30; i++) {
            const angle = (Math.PI * 2 * i) / 30;
            const velocity = Math.random() * 5 + 3;

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                size: Math.random() * 6 + 3,
                life: 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                type: i % 3 === 0 ? 'heart' : 'circle',
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.15
            });
        }
    }



    // Update particles
    update() {
        this.frameCount++;
        this.createTrailParticle();

        // Update trail particles
        for (let i = this.trailParticles.length - 1; i >= 0; i--) {
            const p = this.trailParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.03;
            p.size *= 0.96;

            if (p.life <= 0) {
                this.trailParticles.splice(i, 1);
            }
        }

        // Update explosion particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.08;
            p.vx *= 0.98;
            p.vy *= 0.98;
            p.life -= 0.02;
            if (p.rotationSpeed) p.rotation += p.rotationSpeed;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    // Draw particles
    draw() {
        // Draw trail particles
        this.trailParticles.forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = p.life * 0.7;
            this.ctx.fillStyle = p.color;
            this.ctx.shadowBlur = 12;
            this.ctx.shadowColor = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });

        // Draw explosion particles based on type
        this.particles.forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = p.life;
            this.ctx.translate(p.x, p.y);
            if (p.rotation) this.ctx.rotate(p.rotation);

            this.ctx.fillStyle = p.color;
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = p.color;

            const size = p.size;

            switch (p.type) {
                case 'heart':
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, size * 0.3);
                    this.ctx.bezierCurveTo(-size * 0.5, -size * 0.3, -size, size * 0.1, 0, size);
                    this.ctx.bezierCurveTo(size, size * 0.1, size * 0.5, -size * 0.3, 0, size * 0.3);
                    this.ctx.fill();
                    break;

                case 'star':
                    this.ctx.beginPath();
                    for (let i = 0; i < 5; i++) {
                        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                        const outerX = Math.cos(angle) * size;
                        const outerY = Math.sin(angle) * size;
                        const innerAngle = angle + Math.PI / 5;
                        const innerX = Math.cos(innerAngle) * size * 0.5;
                        const innerY = Math.sin(innerAngle) * size * 0.5;

                        if (i === 0) {
                            this.ctx.moveTo(outerX, outerY);
                        } else {
                            this.ctx.lineTo(outerX, outerY);
                        }
                        this.ctx.lineTo(innerX, innerY);
                    }
                    this.ctx.closePath();
                    this.ctx.fill();
                    break;

                case 'petal':
                    this.ctx.beginPath();
                    this.ctx.ellipse(0, 0, size * 0.6, size, 0, 0, Math.PI * 2);
                    this.ctx.fill();
                    break;

                case 'flame':
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, -size);
                    this.ctx.bezierCurveTo(size * 0.5, -size * 0.5, size * 0.5, size * 0.5, 0, size);
                    this.ctx.bezierCurveTo(-size * 0.5, size * 0.5, -size * 0.5, -size * 0.5, 0, -size);
                    this.ctx.fill();
                    break;

                default:
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, size, 0, Math.PI * 2);
                    this.ctx.fill();
            }

            this.ctx.restore();
        });
    }

    getMousePos() {
        return this.mousePos;
    }
}

window.InteractionSystem = InteractionSystem;
