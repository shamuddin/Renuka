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
        this.isInitialized = false;

        this.backgrounds = {
            aurora: null,
            hearts: null,
            flowers: null,
            stars: null,
            bts: null,
            lanterns: null,
            loveletters: null,
            anniversary: null,
        };

        this.init();
    }

    init() {
        console.log('App initializing...');
        this.setupCanvas();
        this.setupInteractions();
        this.setupBackgroundSwitcher();
        
        // Start with aurora background
        this.switchBackground('aurora');
        
        this.animate();
        this.isInitialized = true;
        console.log('App initialized successfully');

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
        console.log('Setting up background buttons:', buttons.length);

        buttons.forEach((button) => {
            // Use direct binding without cloning to preserve DOM structure
            const bgName = button.getAttribute('data-bg');
            
            // Remove any existing listeners first
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Add click listener with proper binding
            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const clickedBg = newButton.getAttribute('data-bg');
                console.log('Button clicked:', clickedBg);
                
                this.switchBackground(clickedBg);
                this.updateActiveButton(clickedBg);
            });
        });
        
        console.log('Background switcher setup complete');
    }
    
    updateActiveButton(activeBg) {
        document.querySelectorAll('.bg-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-bg') === activeBg) {
                btn.classList.add('active');
            }
        });
    }

    switchBackground(name) {
        console.log('Switching background to:', name);
        
        // Validate background class exists
        const backgroundClasses = {
            'aurora': typeof AuroraBackground !== 'undefined' ? AuroraBackground : null,
            'hearts': typeof HeartsBackground !== 'undefined' ? HeartsBackground : null,
            'flowers': typeof FlowersBackground !== 'undefined' ? FlowersBackground : null,
            'stars': typeof StarsBackground !== 'undefined' ? StarsBackground : null,
            'bts': typeof BTSBackground !== 'undefined' ? BTSBackground : null,
            'lanterns': typeof LanternsBackground !== 'undefined' ? LanternsBackground : null,
            'loveletters': typeof LoveLettersBackground !== 'undefined' ? LoveLettersBackground : null,
            'anniversary': typeof AnniversaryBackground !== 'undefined' ? AnniversaryBackground : null,
        };
        
        if (!backgroundClasses[name]) {
            console.error('Background class not found for:', name);
            return;
        }
        
        // Stop current background
        if (this.currentBackground) {
            this.currentBackground.stop();
        }

        // Clear canvas and SVG
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (typeof d3 !== 'undefined') {
            d3.select(this.svg).selectAll('*').remove();
        }

        // Create new background if not exists
        if (!this.backgrounds[name]) {
            try {
                this.backgrounds[name] = new backgroundClasses[name](this.canvas, this.ctx, this.svg);
            } catch (err) {
                console.error('Error creating background:', name, err);
                return;
            }
        }

        // Initialize and set as current
        this.currentBackground = this.backgrounds[name];
        if (this.currentBackground) {
            try {
                this.currentBackground.init();
                console.log('Background initialized:', name);
            } catch (err) {
                console.error('Error initializing background:', name, err);
            }
        }

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
            const mousePos = this.interactions ? this.interactions.getMousePos() : { x: 0, y: 0 };
            this.currentBackground.update(mousePos);
            this.currentBackground.draw();
        }

        // Update and draw interactions (cursor trail and bloom effects)
        if (this.interactions) {
            this.interactions.update();
            this.interactions.draw();
        }

        // Continue animation loop
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
}

// Start the app when DOM is ready
function startApp() {
    console.log('Starting app...');
    window.app = new App();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    startApp();
}
