// ===== Modern Elegant Love Letters =====
// Luxurious design with hearts and roses, mobile responsive - Pink/Cream Theme

class LoveLettersBackground {
    constructor(canvas, ctx, svg) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.svg = svg;
        this.active = false;
        this.letters = [];
        this.rosePetals = [];
        this.hearts = [];
        this.particles = [];
        this.time = 0;

        this.colors = {
            envelope: {
                white: ['#ffffff', '#fff8f1'],
                cream: ['#fef9f3', '#fdf5eb'],
                rose: ['#fff5f7', '#ffe8ee']
            },
            accent: {
                deepRose: '#ff6b9d',
                burgundy: '#c44569',
                gold: '#d4af37',
                blush: '#ffb3c6',
                crimson: '#ff85a2'
            },
            background: {
                light1: '#fff8f1',
                light2: '#ffe4e6',
                light3: '#fff0f3'
            }
        };

        this.messages = [
            "You are the poetry my heart writes every day 📖💕\nEvery moment with you is a verse I never want to end.",
            "In your arms, I found my home 🏡❤️\nWith you, I'm exactly where I belong.",
            "I crave you in the most innocent form 🌹\nYour love, your presence, your everything.",
            "Hey beautiful! You still give me butterflies 🦋💕\nEven after all this time, you're my forever crush.",
            "You're the dream I never want to wake up from ✨💖\nMy reality is better because you're in it.",
            "Your smile is my favorite work of art 🎨😊\nI could admire it forever and never get tired.",
            "I'm completely, madly, deeply in love with you 💘\nYou've captured my heart and I don't want it back.",
            "We go together like coffee and mornings ☕💕\nPerfectly paired, absolutely essential.",
            "You are my sun, my moon, and all my stars 🌟🌙\nMy entire universe revolves around you.",
            "Life with you is my favorite adventure 🗺️❤️\nEvery day is a new journey when you're by my side.",
            "I fall more in love with you every single day 💕\nYou make forever feel like not long enough.",
            "You're the reason I believe in soulmates 💫💖\nWe were written in the stars, destined to be.",
            "Your laugh is my favorite sound in the world 😄💕\nIt's the melody my heart dances to.",
            "I choose you, again and again, always 💍❤️\nIn every lifetime, in every way, it's you.",
            "You're my happy place in this chaotic world 🌈💖\nWith you, everything just makes sense.",
            "Loving you is as easy as breathing 💨💕\nNatural, effortless, and absolutely necessary.",
            "You make my heart skip and my soul sing 🎵💖\nYou're the rhythm to my every heartbeat.",
            "Forever isn't long enough with you, babe 🌹\nI'd choose an eternity and still want more.",
            "You're not just my love, you're my best friend 👫💕\nMy partner in crime, my everything.",
            "Every love song reminds me of you 🎶❤️\nYou're the lyrics to every romantic melody.",
            "I'm addicted to your love and I never want rehab 💘\nYou're my favorite kind of addiction.",
            "You turn my ordinary days into magic ✨💖\nWith you, even mundane feels extraordinary.",
            "Distance means nothing when you mean everything 🌍💕\nYou're worth every mile, every second apart.",
            "You're the missing piece I didn't know I needed 🧩❤️\nNow that I found you, I'm finally complete.",
            "I love you more than pizza, and that's saying a lot 🍕💕\nYou're literally better than my favorite food!"
        ];
    }

    init() {
        this.active = true;
        this.letters = [];
        this.rosePetals = [];
        this.hearts = [];
        this.createLetters();
        this.createRosePetals();
        this.createFloatingHearts();
        this.setupInteractions();
        this.animateElements();
    }

    createLetters() {
        const numLetters = 25;

        // Mobile responsive
        const isMobile = window.innerWidth < 768;
        const cols = isMobile ? 4 : 5;
        const rows = isMobile ? 7 : 5;
        const cellWidth = this.canvas.width / cols;
        const cellHeight = this.canvas.height / rows;
        const minSize = isMobile ? 45 : 75;
        const sizeRange = isMobile ? 20 : 35;

        const positions = [];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (positions.length >= numLetters) break;
                positions.push({
                    x: col * cellWidth + cellWidth / 2 + (Math.random() - 0.5) * cellWidth * 0.3,
                    y: row * cellHeight + cellHeight / 2 + (Math.random() - 0.5) * cellHeight * 0.3
                });
            }
        }

        positions.sort(() => Math.random() - 0.5);

        for (let i = 0; i < numLetters; i++) {
            const pos = positions[i];
            this.letters.push({
                x: pos.x,
                y: pos.y,
                z: Math.random() * 300 + 100,
                size: Math.random() * sizeRange + minSize,
                rotation: (Math.random() - 0.5) * 20,
                type: ['white', 'cream', 'rose'][i % 3],
                floatSpeed: Math.random() * 0.3 + 0.2,
                floatOffset: Math.random() * Math.PI * 2,
                message: this.messages[i],
                isOpen: false,
                hasRose: Math.random() > 0.5,
                heartSticker: true
            });
        }
    }

    createRosePetals() {
        for (let i = 0; i < 40; i++) {
            this.rosePetals.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height - this.canvas.height,
                size: Math.random() * 15 + 10,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 2,
                speed: Math.random() * 1 + 0.5,
                sway: Math.random() * 2,
                swayOffset: Math.random() * Math.PI * 2,
                color: Math.random() > 0.5 ? this.colors.accent.deepRose : this.colors.accent.crimson,
                opacity: Math.random() * 0.4 + 0.6
            });
        }
    }

    createFloatingHearts() {
        for (let i = 0; i < 25; i++) {
            this.hearts.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 12 + 8,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 1,
                speed: Math.random() * 0.8 + 0.3,
                floatOffset: Math.random() * Math.PI * 2,
                color: [this.colors.accent.blush, this.colors.accent.deepRose, this.colors.accent.gold][i % 3],
                opacity: Math.random() * 0.3 + 0.4
            });
        }
    }

    setupInteractions() {
        this.canvas.addEventListener('click', (e) => {
            if (!this.active) return;
            const clickX = e.clientX;
            const clickY = e.clientY;

            this.letters.forEach(letter => {
                const scale = 800 / (letter.z + 800);
                const screenX = letter.x * scale + (this.canvas.width * (1 - scale)) / 2;
                const screenY = letter.y * scale + (this.canvas.height * (1 - scale)) / 2;
                const screenSize = letter.size * scale;
                const dx = clickX - screenX;
                const dy = clickY - screenY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < screenSize * 0.7) {
                    this.openLetter(letter);
                }
            });
        });
    }

    openLetter(letter) {
        if (letter.isOpen) return;
        letter.isOpen = true;

        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const speed = Math.random() * 5 + 3;
            this.particles.push({
                x: letter.x,
                y: letter.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 10 + 5,
                life: 1,
                color: this.colors.accent.deepRose,
                isHeart: i % 2 === 0
            });
        }

        this.showMessage(letter);
        gsap.to(letter, { duration: 0.7, rotation: letter.rotation + 15, ease: "back.out(1.4)" });
    }

    showMessage(letter) {
        const isMobile = window.innerWidth < 768;
        const fontSize = isMobile ? '24px' : '36px';
        const padding = isMobile ? '25px 35px' : '50px 70px';
        const btnSize = isMobile ? '30px' : '35px';
        const btnFontSize = isMobile ? '24px' : '28px';

        const msg = document.createElement('div');
        msg.textContent = letter.message;
        msg.style.cssText = `position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);background:linear-gradient(135deg,#fff8f1 0%,#fff0f3 100%);border:4px solid ${this.colors.accent.deepRose};padding:${padding};border-radius:20px;color:${this.colors.accent.burgundy};font-family:'Great Vibes',cursive;font-size:${fontSize};text-align:center;z-index:1000;white-space:pre-line;line-height:1.8;opacity:0;pointer-events:auto;max-width:${isMobile ? '85vw' : '600px'};max-height:${isMobile ? '70vh' : '80vh'};overflow-y:auto`;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `position:absolute;top:15px;right:20px;background:${this.colors.accent.deepRose};color:white;border:none;width:${btnSize};height:${btnSize};border-radius:50%;font-size:${btnFontSize};font-weight:bold;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.3s;line-height:1;padding:0`;

        closeBtn.onmouseover = () => { closeBtn.style.background = this.colors.accent.burgundy; closeBtn.style.transform = 'scale(1.1)'; };
        closeBtn.onmouseout = () => { closeBtn.style.background = this.colors.accent.deepRose; closeBtn.style.transform = 'scale(1)'; };
        closeBtn.onclick = () => {
            gsap.to(msg, {
                duration: 0.3, opacity: 0, scale: 0.9,
                onComplete: () => {
                    msg.remove();
                    letter.isOpen = false;
                    gsap.to(letter, { duration: 0.5, rotation: letter.rotation });
                }
            });
        };

        msg.appendChild(closeBtn);
        document.body.appendChild(msg);
        gsap.to(msg, { duration: 0.5, opacity: 1, scale: 1.05, ease: "back.out(1.2)" });
    }

    animateElements() {
        if (!this.active) return;
        this.letters.forEach((letter, i) => {
            gsap.to(letter, {
                duration: letter.floatSpeed * 6,
                y: letter.y + Math.sin(letter.floatOffset) * 50,
                rotation: letter.rotation + Math.sin(i) * 10,
                repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.15
            });
        });
    }

    update(mousePos) {
        if (!this.active) return;
        this.time += 0.01;

        this.rosePetals.forEach(petal => {
            petal.y += petal.speed;
            petal.x += Math.sin(this.time * 2 + petal.swayOffset) * petal.sway;
            petal.rotation += petal.rotSpeed;
            if (petal.y > this.canvas.height + 50) {
                petal.y = -50;
                petal.x = Math.random() * this.canvas.width;
            }
        });

        this.hearts.forEach(heart => {
            heart.y -= heart.speed;
            heart.x += Math.sin(this.time * 3 + heart.floatOffset) * 0.5;
            heart.rotation += heart.rotSpeed;
            if (heart.y < -50) {
                heart.y = this.canvas.height + 50;
                heart.x = Math.random() * this.canvas.width;
            }
        });

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.vx *= 0.98; p.vy *= 0.98; p.life -= 0.02;
            if (p.life <= 0) this.particles.splice(i, 1);
        }
    }

    draw() {
        if (!this.active) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Light cream/pink gradient background
        const bg = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        bg.addColorStop(0, this.colors.background.light1);
        bg.addColorStop(0.5, this.colors.background.light2);
        bg.addColorStop(1, this.colors.background.light3);
        this.ctx.fillStyle = bg;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.hearts.forEach(heart => {
            this.ctx.save();
            this.ctx.globalAlpha = heart.opacity;
            this.ctx.translate(heart.x, heart.y);
            this.ctx.rotate((heart.rotation * Math.PI) / 180);
            this.ctx.fillStyle = heart.color;
            this.ctx.beginPath();
            this.ctx.moveTo(0, heart.size * 0.3);
            this.ctx.bezierCurveTo(-heart.size * 0.5, -heart.size * 0.3, -heart.size, heart.size * 0.1, 0, heart.size);
            this.ctx.bezierCurveTo(heart.size, heart.size * 0.1, heart.size * 0.5, -heart.size * 0.3, 0, heart.size * 0.3);
            this.ctx.fill();
            this.ctx.restore();
        });

        this.rosePetals.forEach(petal => {
            this.ctx.save();
            this.ctx.globalAlpha = petal.opacity;
            this.ctx.translate(petal.x, petal.y);
            this.ctx.rotate((petal.rotation * Math.PI) / 180);
            this.ctx.fillStyle = petal.color;
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, petal.size * 0.7, petal.size, 0, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });

        const sorted = [...this.letters].sort((a, b) => b.z - a.z);
        sorted.forEach(letter => this.drawEnvelope(letter));

        this.particles.forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.translate(p.x, p.y);
            if (p.isHeart) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, p.size * 0.3);
                this.ctx.bezierCurveTo(-p.size * 0.5, -p.size * 0.3, -p.size, p.size * 0.1, 0, p.size);
                this.ctx.bezierCurveTo(p.size, p.size * 0.1, p.size * 0.5, -p.size * 0.3, 0, p.size * 0.3);
                this.ctx.fill();
            } else {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
            this.ctx.restore();
        });
    }

    drawEnvelope(letter) {
        const scale = 800 / (letter.z + 800);
        const x = letter.x * scale + (this.canvas.width * (1 - scale)) / 2;
        const y = letter.y * scale + (this.canvas.height * (1 - scale)) / 2;
        const size = letter.size * scale;
        const w = size * 1.6;
        const h = size;

        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate((letter.rotation * Math.PI) / 180);

        const colors = this.colors.envelope[letter.type];
        const bodyGrad = this.ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
        bodyGrad.addColorStop(0, colors[0]);
        bodyGrad.addColorStop(1, colors[1]);
        this.ctx.fillStyle = bodyGrad;
        this.ctx.strokeStyle = this.colors.accent.gold;
        this.ctx.lineWidth = 2 * scale;
        this.ctx.beginPath();
        this.ctx.roundRect(-w / 2, -h / 2.5, w, h * 0.8, 8 * scale);
        this.ctx.fill();
        this.ctx.stroke();

        const flapGrad = this.ctx.createLinearGradient(-w / 2, -h / 2.5, 0, h / 5);
        flapGrad.addColorStop(0, colors[1]);
        flapGrad.addColorStop(1, this.colors.accent.blush);
        this.ctx.fillStyle = flapGrad;
        this.ctx.beginPath();
        this.ctx.moveTo(-w / 2, -h / 2.5);
        this.ctx.lineTo(0, h / 8);
        this.ctx.lineTo(w / 2, -h / 2.5);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.setLineDash([5 * scale, 3 * scale]);
        this.ctx.strokeRect(-w / 2 + 8, -h / 2.5 + 8, w - 16, h * 0.8 - 16);
        this.ctx.setLineDash([]);

        if (letter.hasRose) {
            const roseX = -w * 0.35, roseY = h * 0.15, roseSize = size * 0.2;
            this.ctx.save();
            this.ctx.translate(roseX, roseY);
            this.ctx.fillStyle = this.colors.accent.deepRose;
            for (let i = 0; i < 5; i++) {
                this.ctx.save();
                this.ctx.rotate((Math.PI * 2 * i) / 5);
                this.ctx.beginPath();
                this.ctx.ellipse(0, -roseSize * 0.4, roseSize * 0.5, roseSize * 0.3, 0, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            }
            this.ctx.fillStyle = this.colors.accent.burgundy;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, roseSize * 0.25, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }

        if (letter.heartSticker && !letter.isOpen) {
            const sealSize = size * 0.18;
            this.ctx.fillStyle = this.colors.accent.deepRose;
            this.ctx.strokeStyle = this.colors.accent.gold;
            this.ctx.lineWidth = 2 * scale;
            this.ctx.beginPath();
            this.ctx.moveTo(0, sealSize * 0.3);
            this.ctx.bezierCurveTo(-sealSize * 0.5, -sealSize * 0.3, -sealSize, sealSize * 0.1, 0, sealSize);
            this.ctx.bezierCurveTo(sealSize, sealSize * 0.1, sealSize * 0.5, -sealSize * 0.3, 0, sealSize * 0.3);
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = `${sealSize * 0.6}px "Great Vibes"`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('RS', 0, sealSize * 0.3);
        }

        this.ctx.restore();
    }

    resize(width, height) {
        this.letters.forEach(l => {
            if (l.x > width) l.x = width - 100;
            if (l.y > height) l.y = height - 100;
        });
    }

    stop() {
        this.active = false;
        gsap.killTweensOf(this.letters);
    }
}

window.LoveLettersBackground = LoveLettersBackground;
