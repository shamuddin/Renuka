// ===== Our Journey - 6 Month Anniversary Scene =====
// Beautiful image-based scene with interactive bottom timeline

class AnniversaryBackground {
    constructor(canvas, ctx, svg) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.svg = d3.select(svg);
        this.isActive = false;

        // Day/Night state
        this.isDayMode = true;
        this.transitionProgress = 0;

        // Background images
        this.dayImage = new Image();
        this.nightImage = new Image();
        this.imagesLoaded = 0;

        // Animation time
        this.time = 0;
        this.mousePos = { x: 0, y: 0 };

        // Animated elements
        this.stars = [];
        this.shootingStars = [];
        this.petals = [];
        this.sparkles = [];

        // Journey milestones - with love messages (icons match themes)
        this.milestones = [
            {
                month: 'July',
                icon: '💕',
                title: 'Fell in Love',
                message: 'The moment our eyes met, my heart knew you were the one. We confessed our love under the stars, and my world changed forever. You became my everything, my reason to smile every day. 💕'
            },
            {
                month: 'August',
                icon: '🌱',
                title: 'Growing Together',
                message: 'Every conversation brought us closer. We shared our dreams, our hopes, and our secrets. Learning about you was like reading the most beautiful book, each page revealing more reasons to love you. 🌹'
            },
            {
                month: 'September',
                icon: '🤝',
                title: 'Understanding Each Other',
                message: 'We faced our fears and doubts together. You held my hand through uncertainties and I held yours. Clarifying our worries only made our bond stronger, proving true love conquers all doubts. 💫'
            },
            {
                month: 'October',
                icon: '💝',
                title: 'Deepening Love',
                message: 'Like autumn leaves transforming into beautiful colors, our love blossomed into something extraordinary. Every moment together felt magical, every memory we created became a treasure in my heart forever. 🧡'
            },
            {
                month: 'November',
                icon: '💪',
                title: 'Stronger Together',
                message: 'Standing as one, unshakeable and true. Our souls connected in ways words cannot describe. You are my strength, my comfort, my safe place. Together we can face anything life brings. 💖'
            },
            {
                month: 'December',
                icon: '🏰',
                title: 'Our Fairy Tale',
                message: 'Happy 6 Months, My Love! Our journey has been nothing short of magical. You are my fairy tale come true, my forever partner. Here\'s to countless more months of love and happiness! 🏰💕'
            }
        ];

        this.selectedMilestone = -1;
        this.messageOpacity = 0;
        this.iconAnimations = [];

        // Constellation data
        this.libraStars = [
            { x: 0.12, y: 0.15, size: 3 },
            { x: 0.15, y: 0.12, size: 2.5 },
            { x: 0.19, y: 0.10, size: 3.5 },
            { x: 0.17, y: 0.18, size: 2 },
            { x: 0.22, y: 0.16, size: 2.5 }
        ];
        this.libraLines = [[0, 1], [1, 2], [2, 4], [3, 0]];

        this.scorpioStars = [
            { x: 0.80, y: 0.12, size: 3 },
            { x: 0.83, y: 0.10, size: 2.5 },
            { x: 0.87, y: 0.08, size: 4 },
            { x: 0.90, y: 0.12, size: 2.5 },
            { x: 0.92, y: 0.16, size: 2 }
        ];
        this.scorpioLines = [[0, 1], [1, 2], [2, 3], [3, 4]];

        // UI elements
        this.toggleBtn = null;
        this.timelineContainer = null;
    }

    init() {
        this.isActive = true;
        this.loadImages();
        this.createStars();
        this.createSparkles();
        this.createToggleButton();
        this.createTimelineUI();
        this.initIconAnimations();
    }

    loadImages() {
        this.dayImage.onload = () => { this.imagesLoaded++; };
        this.nightImage.onload = () => { this.imagesLoaded++; };
        this.dayImage.src = 'backgrounds/anniversary_day.png';
        this.nightImage.src = 'backgrounds/anniversary_night.png';
    }

    createToggleButton() {
        if (this.toggleBtn) this.toggleBtn.remove();

        this.toggleBtn = document.createElement('button');
        this.toggleBtn.id = 'daynight-toggle';
        this.toggleBtn.innerHTML = this.isDayMode ? '🌙' : '☀️';
        this.toggleBtn.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 20px;
            z-index: 100;
            width: 55px;
            height: 55px;
            border-radius: 50%;
            border: 2px solid rgba(255,255,255,0.4);
            background: ${this.isDayMode ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)'};
            font-size: 26px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        this.toggleBtn.addEventListener('mouseenter', () => {
            this.toggleBtn.style.transform = 'scale(1.1)';
        });
        this.toggleBtn.addEventListener('mouseleave', () => {
            this.toggleBtn.style.transform = 'scale(1)';
        });
        this.toggleBtn.addEventListener('click', () => this.toggleDayNight());
        document.body.appendChild(this.toggleBtn);
    }

    createTimelineUI() {
        if (this.timelineContainer) this.timelineContainer.remove();

        this.timelineContainer = document.createElement('div');
        this.timelineContainer.id = 'anniversary-timeline';
        this.timelineContainer.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 90;
            display: flex;
            justify-content: center;
            align-items: flex-end;
            padding: 15px 20px 20px;
            background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, transparent 100%);
            pointer-events: auto;
        `;

        // Create timeline track
        const track = document.createElement('div');
        track.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 30px;
            background: rgba(80, 40, 60, 0.8);
            border-radius: 50px;
            border: 2px solid rgba(255, 180, 200, 0.4);
            box-shadow: 0 5px 30px rgba(0,0,0,0.4);
        `;

        this.milestones.forEach((milestone, i) => {
            // Connector line (except first)
            if (i > 0) {
                const line = document.createElement('div');
                line.style.cssText = `
                    width: 40px;
                    height: 3px;
                    background: linear-gradient(90deg, rgba(255,150,180,0.8), rgba(255,200,220,0.8));
                    border-radius: 2px;
                `;
                track.appendChild(line);
            }

            // Month icon button
            const btn = document.createElement('button');
            btn.className = 'milestone-btn';
            btn.dataset.index = i;
            btn.style.cssText = `
                width: 60px;
                height: 60px;
                border-radius: 50%;
                border: 3px solid rgba(255, 180, 200, 0.6);
                background: linear-gradient(135deg, rgba(100, 50, 70, 0.9), rgba(80, 40, 60, 0.9));
                font-size: 28px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                position: relative;
                box-shadow: 0 3px 15px rgba(0,0,0,0.3);
            `;
            btn.innerHTML = `
                <span style="font-size: 24px; line-height: 1;">${milestone.icon}</span>
            `;

            // Month label below
            const label = document.createElement('span');
            label.style.cssText = `
                position: absolute;
                bottom: -22px;
                font-family: 'Parisienne', cursive;
                font-size: 12px;
                color: rgba(255, 220, 230, 0.9);
                white-space: nowrap;
            `;
            label.textContent = milestone.month.substring(0, 3);
            btn.appendChild(label);

            // Hover effects
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.15) translateY(-5px)';
                btn.style.boxShadow = '0 8px 25px rgba(255, 100, 150, 0.5)';
                btn.style.borderColor = 'rgba(255, 220, 230, 0.9)';
            });
            btn.addEventListener('mouseleave', () => {
                if (this.selectedMilestone !== i) {
                    btn.style.transform = 'scale(1)';
                    btn.style.boxShadow = '0 3px 15px rgba(0,0,0,0.3)';
                    btn.style.borderColor = 'rgba(255, 180, 200, 0.6)';
                }
            });

            // Click handler
            btn.addEventListener('click', () => this.selectMilestone(i));

            track.appendChild(btn);
        });

        this.timelineContainer.appendChild(track);
        document.body.appendChild(this.timelineContainer);
    }

    initIconAnimations() {
        this.iconAnimations = this.milestones.map(() => ({
            bounce: 0,
            glow: 0
        }));
    }

    selectMilestone(index) {
        // Deselect previous
        if (this.selectedMilestone >= 0) {
            const prevBtn = document.querySelector(`.milestone-btn[data-index="${this.selectedMilestone}"]`);
            if (prevBtn) {
                prevBtn.style.transform = 'scale(1)';
                prevBtn.style.boxShadow = '0 3px 15px rgba(0,0,0,0.3)';
                prevBtn.style.background = 'linear-gradient(135deg, rgba(100, 50, 70, 0.9), rgba(80, 40, 60, 0.9))';
            }
        }

        // If clicking same, deselect
        if (this.selectedMilestone === index) {
            this.selectedMilestone = -1;
            gsap.to(this, { messageOpacity: 0, duration: 0.3 });
            return;
        }

        this.selectedMilestone = index;

        // Highlight selected button
        const btn = document.querySelector(`.milestone-btn[data-index="${index}"]`);
        if (btn) {
            btn.style.transform = 'scale(1.2) translateY(-8px)';
            btn.style.boxShadow = '0 10px 30px rgba(255, 100, 150, 0.6)';
            btn.style.background = 'linear-gradient(135deg, rgba(200, 80, 120, 0.95), rgba(150, 60, 90, 0.95))';
        }

        // Animate message appearance (DON'T hide name - show both)
        gsap.to(this, {
            messageOpacity: 0, duration: 0.15, onComplete: () => {
                gsap.to(this, { messageOpacity: 1, duration: 0.4 });
            }
        });
    }

    toggleDayNight() {
        this.isDayMode = !this.isDayMode;
        this.toggleBtn.innerHTML = this.isDayMode ? '🌙' : '☀️';
        this.toggleBtn.style.background = this.isDayMode
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #f5af19 0%, #f12711 100%)';

        gsap.to(this, { transitionProgress: this.isDayMode ? 0 : 1, duration: 2.5, ease: "power2.inOut" });
    }

    createStars() {
        this.stars = [];
        for (let i = 0; i < 180; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height * 0.45,
                size: Math.random() * 2.5 + 0.5,
                twinkleSpeed: 0.02 + Math.random() * 0.04,
                twinklePhase: Math.random() * Math.PI * 2,
                brightness: 0.4 + Math.random() * 0.6
            });
        }
    }

    createSparkles() {
        this.sparkles = [];
        for (let i = 0; i < 25; i++) {
            this.sparkles.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height * (0.35 + Math.random() * 0.45),
                size: 2 + Math.random() * 3,
                phase: Math.random() * Math.PI * 2,
                speed: 0.03 + Math.random() * 0.03
            });
        }
    }

    update(mousePos) {
        this.mousePos = mousePos;
        this.time += 0.016;

        // Shooting stars at night
        if (this.transitionProgress > 0.5 && Math.random() < 0.006) {
            this.shootingStars.push({
                x: Math.random() * this.canvas.width * 0.6,
                y: Math.random() * this.canvas.height * 0.2,
                vx: 12 + Math.random() * 6,
                vy: 6 + Math.random() * 3,
                life: 1,
                tail: []
            });
        }

        this.shootingStars = this.shootingStars.filter(star => {
            star.x += star.vx;
            star.y += star.vy;
            star.life -= 0.012;
            star.tail.push({ x: star.x, y: star.y });
            if (star.tail.length > 30) star.tail.shift();
            return star.life > 0;
        });

        // Floating petals
        if (Math.random() < 0.025) {
            this.petals.push({
                x: Math.random() * this.canvas.width,
                y: -20,
                vy: 1 + Math.random() * 1.5,
                vx: (Math.random() - 0.5) * 2,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.1,
                size: 8 + Math.random() * 12
            });
        }

        this.petals = this.petals.filter(petal => {
            petal.x += petal.vx + Math.sin(this.time * 2 + petal.rotation) * 1;
            petal.y += petal.vy;
            petal.rotation += petal.rotationSpeed;
            return petal.y < this.canvas.height - 80; // Stop before timeline
        });
    }

    draw() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const t = this.transitionProgress;

        this.drawBackground(w, h, t);

        if (t > 0.2) {
            this.drawStars(t);
            this.drawConstellations(t);
            this.drawShootingStars(t);
        }

        this.drawPetals();
        this.drawSparkles(t);
        this.drawMessageCard(w, h);
    }

    drawBackground(w, h, t) {
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, w, h);

        if (this.imagesLoaded < 2) {
            const gradient = this.ctx.createLinearGradient(0, 0, 0, h);
            gradient.addColorStop(0, '#614385');
            gradient.addColorStop(1, '#516395');
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, w, h);

            this.ctx.fillStyle = 'rgba(255,255,255,0.8)';
            this.ctx.font = '22px "Parisienne", cursive';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Loading your fairy tale...', w / 2, h / 2);
            return;
        }

        // Calculate cover sizing for FULLSCREEN (fill entire canvas)
        const imgRatio = this.dayImage.width / this.dayImage.height;
        const canvasRatio = w / h;

        let drawW, drawH, drawX, drawY;
        if (canvasRatio > imgRatio) {
            // Canvas is wider - fill by width
            drawW = w;
            drawH = w / imgRatio;
            drawX = 0;
            drawY = (h - drawH) / 2;
        } else {
            // Canvas is taller - fill by height
            drawH = h;
            drawW = h * imgRatio;
            drawX = (w - drawW) / 2;
            drawY = 0;
        }

        // Enable high quality image rendering to prevent pixelation
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';

        if (t < 1) {
            this.ctx.globalAlpha = 1 - t;
            this.ctx.drawImage(this.dayImage, drawX, drawY, drawW, drawH);
        }
        if (t > 0) {
            this.ctx.globalAlpha = t;
            this.ctx.drawImage(this.nightImage, drawX, drawY, drawW, drawH);
        }
        this.ctx.globalAlpha = 1;
    }

    drawStars(t) {
        const opacity = Math.min(1, (t - 0.2) * 1.5);

        this.stars.forEach(star => {
            const twinkle = 0.5 + Math.sin(this.time * star.twinkleSpeed * 60 + star.twinklePhase) * 0.5;
            const alpha = opacity * star.brightness * twinkle;

            const glow = this.ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
            glow.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
            glow.addColorStop(0.4, `rgba(200, 220, 255, ${alpha * 0.3})`);
            glow.addColorStop(1, 'transparent');

            this.ctx.fillStyle = glow;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawConstellations(t) {
        const opacity = Math.min(1, (t - 0.4) * 2);
        if (opacity <= 0) return;

        const w = this.canvas.width;
        const h = this.canvas.height;

        this.drawConstellation(this.libraStars, this.libraLines, w, h, opacity, '♎ Libra', 'Her Sign');
        this.drawConstellation(this.scorpioStars, this.scorpioLines, w, h, opacity, '♏ Scorpio', 'His Sign');

        // Heart between constellations
        const midX = w * 0.5;
        const midY = h * 0.08;
        const pulse = 1 + Math.sin(this.time * 3) * 0.12;

        this.ctx.font = `${24 * pulse}px sans-serif`;
        this.ctx.fillStyle = `rgba(255, 120, 170, ${opacity * 0.9})`;
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = 'rgba(255, 100, 150, 0.8)';
        this.ctx.shadowBlur = 15;
        this.ctx.fillText('💕', midX, midY);
        this.ctx.shadowBlur = 0;
    }

    drawConstellation(stars, lines, w, h, opacity, symbol, label) {
        this.ctx.strokeStyle = `rgba(180, 220, 255, ${opacity * 0.5})`;
        this.ctx.lineWidth = 1.5;
        this.ctx.shadowColor = 'rgba(150, 200, 255, 0.6)';
        this.ctx.shadowBlur = 6;

        lines.forEach(([i, j]) => {
            this.ctx.beginPath();
            this.ctx.moveTo(stars[i].x * w, stars[i].y * h);
            this.ctx.lineTo(stars[j].x * w, stars[j].y * h);
            this.ctx.stroke();
        });
        this.ctx.shadowBlur = 0;

        stars.forEach(star => {
            const glow = this.ctx.createRadialGradient(star.x * w, star.y * h, 0, star.x * w, star.y * h, star.size * 4);
            glow.addColorStop(0, `rgba(200, 230, 255, ${opacity})`);
            glow.addColorStop(1, 'transparent');
            this.ctx.fillStyle = glow;
            this.ctx.beginPath();
            this.ctx.arc(star.x * w, star.y * h, star.size * 4, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x * w, star.y * h, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        const centerX = stars.reduce((sum, s) => sum + s.x, 0) / stars.length * w;
        const bottomY = Math.max(...stars.map(s => s.y)) * h + 30;

        this.ctx.fillStyle = `rgba(220, 240, 255, ${opacity})`;
        this.ctx.font = '16px "Parisienne", cursive';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(symbol, centerX, bottomY);
        this.ctx.font = '12px "Parisienne", cursive';
        this.ctx.fillStyle = `rgba(255, 200, 220, ${opacity * 0.8})`;
        this.ctx.fillText(label, centerX, bottomY + 16);
    }

    drawShootingStars(t) {
        const opacity = Math.min(1, (t - 0.3) * 2);

        this.shootingStars.forEach(star => {
            if (star.tail.length > 1) {
                const gradient = this.ctx.createLinearGradient(star.tail[0].x, star.tail[0].y, star.x, star.y);
                gradient.addColorStop(0, 'transparent');
                gradient.addColorStop(1, `rgba(255, 255, 255, ${star.life * opacity})`);

                this.ctx.strokeStyle = gradient;
                this.ctx.lineWidth = 2.5;
                this.ctx.lineCap = 'round';
                this.ctx.beginPath();
                this.ctx.moveTo(star.tail[0].x, star.tail[0].y);
                star.tail.forEach(p => this.ctx.lineTo(p.x, p.y));
                this.ctx.stroke();
            }

            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.life * opacity})`;
            this.ctx.shadowColor = 'white';
            this.ctx.shadowBlur = 8;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
    }

    drawPetals() {
        this.petals.forEach(petal => {
            this.ctx.save();
            this.ctx.translate(petal.x, petal.y);
            this.ctx.rotate(petal.rotation);

            const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, petal.size);
            gradient.addColorStop(0, 'rgba(255, 180, 200, 0.85)');
            gradient.addColorStop(0.6, 'rgba(255, 120, 160, 0.6)');
            gradient.addColorStop(1, 'rgba(220, 80, 120, 0.3)');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, petal.size, petal.size * 0.5, 0, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    drawSparkles(t) {
        const baseOpacity = this.isDayMode ? 0.5 : 0.7;

        this.sparkles.forEach(sparkle => {
            const glow = 0.3 + Math.sin(this.time * sparkle.speed * 60 + sparkle.phase) * 0.7;
            const color = this.isDayMode
                ? `rgba(255, 220, 150, ${glow * baseOpacity})`
                : `rgba(180, 220, 255, ${glow * baseOpacity})`;

            const gradient = this.ctx.createRadialGradient(sparkle.x, sparkle.y, 0, sparkle.x, sparkle.y, sparkle.size * 4);
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, 'transparent');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(sparkle.x, sparkle.y, sparkle.size * 4, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawMessageCard(w, h) {
        if (this.selectedMilestone < 0 || this.messageOpacity <= 0) return;

        const milestone = this.milestones[this.selectedMilestone];
        const centerX = w / 2;
        // Position at the TOP of the screen
        const centerY = h * 0.18;

        this.ctx.save();
        this.ctx.globalAlpha = this.messageOpacity;

        // Card dimensions - LARGER for better visibility
        const cardWidth = Math.min(550, w * 0.85);
        const cardHeight = 200;
        const cardX = centerX - cardWidth / 2;
        const cardY = centerY - cardHeight / 2;

        // Outer glow - stronger
        const glow = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, cardWidth * 0.7);
        glow.addColorStop(0, 'rgba(255, 150, 180, 0.35)');
        glow.addColorStop(1, 'transparent');
        this.ctx.fillStyle = glow;
        this.ctx.beginPath();
        this.ctx.ellipse(centerX, centerY, cardWidth * 0.7, cardHeight, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Card background - more opaque for better readability
        const cardGradient = this.ctx.createLinearGradient(cardX, cardY, cardX + cardWidth, cardY + cardHeight);
        cardGradient.addColorStop(0, 'rgba(60, 20, 40, 0.97)');
        cardGradient.addColorStop(0.5, 'rgba(80, 30, 50, 0.95)');
        cardGradient.addColorStop(1, 'rgba(60, 20, 40, 0.97)');

        this.ctx.fillStyle = cardGradient;
        this.ctx.beginPath();
        this.ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 25);
        this.ctx.fill();

        // Border - thicker and brighter
        const borderGrad = this.ctx.createLinearGradient(cardX, cardY, cardX + cardWidth, cardY);
        borderGrad.addColorStop(0, 'rgba(255, 180, 200, 0.6)');
        borderGrad.addColorStop(0.5, 'rgba(255, 220, 240, 0.95)');
        borderGrad.addColorStop(1, 'rgba(255, 180, 200, 0.6)');
        this.ctx.strokeStyle = borderGrad;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        // Month + Icon header - BIGGER
        this.ctx.font = '44px sans-serif';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.shadowColor = 'rgba(255, 150, 200, 0.8)';
        this.ctx.shadowBlur = 20;
        this.ctx.fillText(milestone.icon, centerX, cardY + 55);
        this.ctx.shadowBlur = 0;

        // Title - BIGGER
        this.ctx.font = '32px "Great Vibes", cursive';
        this.ctx.fillStyle = 'rgba(255, 220, 240, 1)';
        this.ctx.shadowColor = 'rgba(255, 150, 200, 0.5)';
        this.ctx.shadowBlur = 8;
        this.ctx.fillText(`${milestone.month} - ${milestone.title}`, centerX, cardY + 95);
        this.ctx.shadowBlur = 0;

        // Message - wrap text - ELEGANT SERIF FONT for visibility
        this.ctx.font = '17px Georgia, "Times New Roman", serif';
        this.ctx.fillStyle = 'rgba(255, 245, 250, 1)';

        const words = milestone.message.split(' ');
        const maxWidth = cardWidth - 50;
        let line = '';
        let lineY = cardY + 130;
        const lineHeight = 28;

        words.forEach(word => {
            const testLine = line + word + ' ';
            const metrics = this.ctx.measureText(testLine);
            if (metrics.width > maxWidth && line !== '') {
                this.ctx.fillText(line.trim(), centerX, lineY);
                line = word + ' ';
                lineY += lineHeight;
            } else {
                line = testLine;
            }
        });
        this.ctx.fillText(line.trim(), centerX, lineY);

        // Tap hint
        this.ctx.font = '11px "Parisienne", cursive';
        this.ctx.fillStyle = 'rgba(255, 200, 220, 0.6)';
        this.ctx.fillText('(tap icon again to close)', centerX, cardY + cardHeight - 12);

        this.ctx.restore();
    }

    stop() {
        this.isActive = false;
        this.svg.selectAll('*').remove();
        if (this.toggleBtn) { this.toggleBtn.remove(); this.toggleBtn = null; }
        if (this.timelineContainer) { this.timelineContainer.remove(); this.timelineContainer = null; }
        gsap.killTweensOf(this);
    }

    resize(width, height) {
        this.createStars();
        this.createSparkles();
    }
}

window.AnniversaryBackground = AnniversaryBackground;
