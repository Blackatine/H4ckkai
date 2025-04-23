class MatrixAnimation {
    constructor() {
        this.canvas = document.getElementById('matrix-bg');
        this.ctx = this.canvas.getContext('2d');
        this.initialize();
        
        // Matrix rain properties
        this.fontSize = 16;
        this.columns = Math.floor(window.innerWidth / 15);
        this.drops = new Array(this.columns).fill(1);
        this.characters = "01";
        
        // Animation properties
        this.lastTime = 0;
        this.dropSpeed = 0.6;
        this.minSpeed = 0.5;
        this.maxSpeed = 1.5;
        
        // Visual properties
        this.baseColor = "#00ff9d";
        this.glowColor = "rgba(0, 255, 157, 0.8)";
        this.fadeColor = "rgba(0, 0, 0, 0.15)";  // Increased opacity
        
        // Start animation
        this.animate();
        
        // Handle resize
        window.addEventListener('resize', () => this.initialize());
    }
    
    initialize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(window.innerWidth / 15);
        this.drops = new Array(this.columns).fill(1);
        
        // Clear the canvas on initialization
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    generateCharacter() {
        return this.characters[Math.floor(Math.random() * this.characters.length)];
    }
    
    draw(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // Create fade effect with increased opacity
        this.ctx.fillStyle = this.fadeColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Set text properties
        this.ctx.font = `${this.fontSize}px 'Share Tech Mono'`;
        
        // Draw each column
        for(let i = 0; i < this.drops.length; i++) {
            // Skip random columns occasionally to create gaps
            if (Math.random() > 0.98) continue;
            
            // Generate random character
            const char = this.generateCharacter();
            
            // Calculate glow intensity based on position
            const intensity = Math.sin(this.drops[i] / 20) * 0.3 + 0.7;  // Reduced glow variation
            this.ctx.fillStyle = this.glowColor;
            this.ctx.shadowBlur = 5 * intensity;  // Reduced shadow blur
            this.ctx.shadowColor = this.baseColor;
            
            // Draw character
            this.ctx.fillText(
                char,
                i * 15,
                this.drops[i] * this.fontSize
            );
            
            // Update drop position with more randomness
            if(this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.95) {
                this.drops[i] = 0;
            }
            this.drops[i] += (Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed) * (deltaTime / 16);
        }
        
        // Reset shadow properties
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = "transparent";
        
        requestAnimationFrame((timestamp) => this.draw(timestamp));
    }
    
    animate() {
        requestAnimationFrame((timestamp) => this.draw(timestamp));
    }
}

// Initialize animation when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MatrixAnimation();
}); 