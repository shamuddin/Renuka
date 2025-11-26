// ===== Main Application =====
// Manages backgrounds, interactions, and UI

class App {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.svg = document.getElementById('svg-layer');
        this.currentBackground = null;
        this.interactions = null;
        this.animationFrame = null;

        this.backgrounds = {
            aurora: null,
            hearts: null,
            flowers: null,
            stars: null,
            bts: null,
            lanterns: null,
            loveletters: null,

        };

        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupInteractions();
        this.setupBackgroundSwitcher();
        this.switchBackground('aurora'); // Start with Aurora
        this.animate();

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    setupCanvas() {
        this.resizeCanvas();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Notify current background of resize
        if (this.currentBackground) {
            this.currentBackground.resize(this.canvas.width, this.canvas.height);
        }
    }

    setupInteractions() {
        this.interactions = new InteractionSystem();
    }

    setupBackgroundSwitcher() {
        const buttons = document.querySelectorAll('.bg-btn');

        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const bgName = button.getAttribute('data-bg');
                this.switchBackground(bgName);

                // Update active state
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    switchBackground(name) {
        // Stop current background
        if (this.currentBackground) {
            this.currentBackground.stop();
        }

        // Clear canvas and SVG
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        d3.select(this.svg).selectAll('*').remove();

        // Create new background if not exists
        if (!this.backgrounds[name]) {
            switch (name) {
                case 'aurora':
                    this.backgrounds[name] = new AuroraBackground(this.canvas, this.ctx, this.svg);
                    break;
                case 'hearts':
                    this.backgrounds[name] = new HeartsBackground(this.canvas, this.ctx, this.svg);
                    break;
                case 'flowers':
                    this.backgrounds[name] = new FlowersBackground(this.canvas, this.ctx, this.svg);
                    break;
                case 'stars':
                    this.backgrounds[name] = new StarsBackground(this.canvas, this.ctx, this.svg);
                    break;
                case 'bts':
                    this.backgrounds[name] = new BTSBackground(this.canvas, this.ctx, this.svg);
                    break;
                case 'lanterns':
                    this.backgrounds[name] = new LanternsBackground(this.canvas, this.ctx, this.svg);
                    break;
                case 'loveletters':
                    this.backgrounds[name] = new LoveLettersBackground(this.canvas, this.ctx, this.svg);
                    break;
            }
        }

        // Initialize and set as current
        this.currentBackground = this.backgrounds[name];
        this.currentBackground.init();

        // Notify interactions system of background change
        if (this.interactions) {
            this.interactions.setBackground(name);
        }
    }

    handleResize() {
        this.resizeCanvas();
    }

    animate() {
        // Update and draw current background
        if (this.currentBackground) {
            const mousePos = this.interactions.getMousePos();
            this.currentBackground.update(mousePos);
            this.currentBackground.draw();
        }

        // Update and draw interactions (cursor trail and bloom effects)
        this.interactions.update();
        this.interactions.draw();

        // Continue animation loop
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new App();
    });
} else {
    new App();
}
