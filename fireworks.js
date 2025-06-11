class Firework {
    constructor(x, y, type = 'normal') {
        this.x = x;
        this.y = y;
        this.sx = Math.random() * 3 - 1.5;
        this.sy = Math.random() * 3 - 1.5;
        this.size = Math.random() * 2 + 1;
        this.shouldExplode = false;
        this.type = type;
        
        // Rocket properties
        this.rocket = {
            x: x,
            y: canvas.height,
            vx: Math.random() * 4 - 2,
            vy: Math.random() * -12 - 8,
            size: 3,
            trail: []
        };
        
        this.exploded = false;
        this.particles = [];
        this.color = this.getRandomColor();
    }
    
    getRandomColor() {
        const colors = [
            '#ff0000', '#ff4500', '#ffa500', '#ffff00', '#00ff00',
            '#00ffff', '#0000ff', '#8a2be2', '#ff1493', '#ff69b4'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
        if (!this.exploded) {
            // Update rocket
            this.rocket.trail.push({x: this.rocket.x, y: this.rocket.y});
            if (this.rocket.trail.length > 10) {
                this.rocket.trail.shift();
            }
            
            this.rocket.x += this.rocket.vx;
            this.rocket.y += this.rocket.vy;
            this.rocket.vy += 0.1; // gravity
            
            // Check if rocket should explode
            if (this.rocket.vy > -2 || this.rocket.y < 200) {
                this.explode();
            }
        } else {
            // Update particles
            for (let i = this.particles.length - 1; i >= 0; i--) {
                let p = this.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.02; // gravity
                p.vx *= 0.99; // air resistance
                p.vy *= 0.99;
                p.life--;
                
                if (p.life <= 0) {
                    this.particles.splice(i, 1);
                }
            }
        }
    }
    
    explode() {
        this.exploded = true;
        
        if (this.type === 'animal') {
            this.createAnimalShape();
        } else {
            // Create explosion particles
            const particleCount = Math.random() * 50 + 50;
            for (let i = 0; i < particleCount; i++) {
                const angle = (Math.PI * 2 * i) / particleCount;
                const velocity = Math.random() * 8 + 2;
                
                this.particles.push({
                    x: this.rocket.x,
                    y: this.rocket.y,
                    vx: Math.cos(angle) * velocity,
                    vy: Math.sin(angle) * velocity,
                    life: Math.random() * 60 + 40,
                    maxLife: Math.random() * 60 + 40,
                    color: this.color,
                    size: Math.random() * 3 + 1
                });
            }
            
            // Add some sparkles
            for (let i = 0; i < 20; i++) {
                this.particles.push({
                    x: this.rocket.x + (Math.random() - 0.5) * 20,
                    y: this.rocket.y + (Math.random() - 0.5) * 20,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    life: Math.random() * 30 + 20,
                    maxLife: Math.random() * 30 + 20,
                    color: '#ffffff',
                    size: Math.random() * 2 + 0.5
                });
            }
        }
    }
    
    createAnimalShape() {
        const animals = ['butterfly', 'bird', 'fish', 'star', 'heart'];
        const animal = animals[Math.floor(Math.random() * animals.length)];
        const scale = 0.8 + Math.random() * 0.4; // Random size between 0.8 and 1.2
        
        let shape = [];
        switch(animal) {
            case 'butterfly':
                shape = this.getButterflyShape();
                break;
            case 'bird':
                shape = this.getBirdShape();
                break;
            case 'fish':
                shape = this.getFishShape();
                break;
            case 'star':
                shape = this.getStarShape();
                break;
            case 'heart':
                shape = this.getHeartShape();
                break;
        }
        
        // Create particles for each point in the shape
        shape.forEach(point => {
            this.particles.push({
                x: this.rocket.x + point.x * scale,
                y: this.rocket.y + point.y * scale,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: Math.random() * 120 + 100, // Longer life for animals
                maxLife: Math.random() * 120 + 100,
                color: this.getAnimalColor(),
                size: Math.random() * 2 + 1.5
            });
        });
        
        // Add some sparkles around the animal
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: this.rocket.x + (Math.random() - 0.5) * 100,
                y: this.rocket.y + (Math.random() - 0.5) * 100,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                life: Math.random() * 60 + 40,
                maxLife: Math.random() * 60 + 40,
                color: '#ffffff',
                size: Math.random() * 1.5 + 0.5
            });
        }
    }
    
    getAnimalColor() {
        const colors = [
            '#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff',
            '#ffd1dc', '#e6e6fa', '#f0fff0', '#ffe4e1', '#f5f5dc'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    getButterflyShape() {
        const shape = [];
        // Butterfly body
        for (let i = -15; i <= 15; i += 3) {
            shape.push({x: 0, y: i});
        }
        
        // Left wing (upper)
        for (let i = 0; i < 20; i++) {
            const angle = (i / 19) * Math.PI;
            shape.push({x: -Math.sin(angle) * 25, y: -Math.cos(angle) * 15 - 5});
        }
        
        // Right wing (upper)
        for (let i = 0; i < 20; i++) {
            const angle = (i / 19) * Math.PI;
            shape.push({x: Math.sin(angle) * 25, y: -Math.cos(angle) * 15 - 5});
        }
        
        // Left wing (lower)
        for (let i = 0; i < 15; i++) {
            const angle = (i / 14) * Math.PI;
            shape.push({x: -Math.sin(angle) * 20, y: Math.cos(angle) * 12 + 8});
        }
        
        // Right wing (lower)
        for (let i = 0; i < 15; i++) {
            const angle = (i / 14) * Math.PI;
            shape.push({x: Math.sin(angle) * 20, y: Math.cos(angle) * 12 + 8});
        }
        
        return shape;
    }
    
    getBirdShape() {
        const shape = [];
        // Bird body
        for (let i = -10; i <= 10; i += 2) {
            shape.push({x: i, y: 0});
        }
        
        // Wings
        for (let i = 0; i < 15; i++) {
            const x = i * 2 - 15;
            const y = -Math.abs(x) * 0.3 - 5;
            shape.push({x: x, y: y});
            shape.push({x: -x, y: y});
        }
        
        // Head
        for (let i = 0; i < 8; i++) {
            const angle = (i / 7) * Math.PI * 2;
            shape.push({x: Math.cos(angle) * 5 + 12, y: Math.sin(angle) * 5});
        }
        
        return shape;
    }
    
    getFishShape() {
        const shape = [];
        // Fish body
        for (let i = -15; i <= 15; i += 2) {
            const width = 8 - Math.abs(i) * 0.3;
            for (let j = -width; j <= width; j += 3) {
                shape.push({x: i, y: j});
            }
        }
        
        // Tail
        for (let i = 0; i < 10; i++) {
            shape.push({x: -20 - i, y: -8 + i * 1.6});
            shape.push({x: -20 - i, y: 8 - i * 1.6});
        }
        
        return shape;
    }
    
    getStarShape() {
        const shape = [];
        const points = 5;
        const outerRadius = 20;
        const innerRadius = 8;
        
        for (let i = 0; i < points * 2; i++) {
            const angle = (i / (points * 2)) * Math.PI * 2;
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            
            // Fill the star shape
            for (let r = 0; r <= radius; r += 2) {
                shape.push({
                    x: Math.cos(angle) * r,
                    y: Math.sin(angle) * r
                });
            }
        }
        
        return shape;
    }
    
    getHeartShape() {
        const shape = [];
        const scale = 0.5;
        
        for (let i = 0; i < 100; i++) {
            const t = (i / 99) * Math.PI * 2;
            const x = 16 * Math.pow(Math.sin(t), 3) * scale;
            const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * scale;
            shape.push({x: x, y: y});
        }
        
        return shape;
    }
    
    draw(ctx) {
        if (!this.exploded) {
            // Draw rocket trail
            ctx.save();
            for (let i = 0; i < this.rocket.trail.length; i++) {
                const point = this.rocket.trail[i];
                const alpha = i / this.rocket.trail.length;
                ctx.globalAlpha = alpha * 0.8;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
            
            // Draw rocket
            ctx.save();
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.rocket.x, this.rocket.y, this.rocket.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else {
            // Draw explosion particles
            ctx.save();
            for (let particle of this.particles) {
                const alpha = particle.life / particle.maxLife;
                ctx.globalAlpha = alpha;
                ctx.fillStyle = particle.color;
                ctx.shadowBlur = 5;
                ctx.shadowColor = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }
    
    isDead() {
        return this.exploded && this.particles.length === 0;
    }
}

// Main application
const canvas = document.getElementById('fireworkCanvas');
const ctx = canvas.getContext('2d');
const fireworks = [];

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Animation loop
function animate() {
    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(12, 12, 12, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw fireworks
    for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].draw(ctx);
        
        if (fireworks[i].isDead()) {
            fireworks.splice(i, 1);
        }
    }
    
    requestAnimationFrame(animate);
}

// Create firework function
function createFirework(x, y, type = 'normal') {
    if (!x || !y) {
        x = Math.random() * canvas.width;
        y = Math.random() * canvas.height * 0.5 + canvas.height * 0.1;
    }
    
    const firework = new Firework(x, y, type);
    fireworks.push(firework);
    
    // Add sound effect (if you want to add audio later)
    // playSound('launch');
}

// Event listeners
document.getElementById('fireworkButton').addEventListener('click', () => {
    createFirework();
});

document.getElementById('multiFireButton').addEventListener('click', () => {
    // Create multiple fireworks with delays
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createFirework();
        }, i * 200);
    }
});

document.getElementById('animalButton').addEventListener('click', () => {
    // Create light animals
    createFirework(Math.random() * canvas.width, Math.random() * canvas.height * 0.5 + canvas.height * 0.1, 'animal');
});

document.getElementById('clearButton').addEventListener('click', () => {
    fireworks.length = 0;
    ctx.fillStyle = 'rgba(12, 12, 12, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// Click anywhere on canvas to create firework
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createFirework(x, y);
});

// Auto-fireworks every few seconds
setInterval(() => {
    if (Math.random() < 0.3) { // 30% chance every 3 seconds
        createFirework();
    }
}, 3000);

// Start animation
animate();

// Welcome firework
setTimeout(() => {
    createFirework(canvas.width / 2, canvas.height / 3);
}, 1000); 