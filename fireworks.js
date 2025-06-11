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
            // Create explosion particles - OPTIMIZED
            const particleCount = Math.min(Math.random() * 40 + 30, 50); // Fewer particles
            for (let i = 0; i < particleCount; i++) {
                const angle = (Math.PI * 2 * i) / particleCount;
                const velocity = Math.random() * 8 + 2;
                
                this.particles.push({
                    x: this.rocket.x,
                    y: this.rocket.y,
                    vx: Math.cos(angle) * velocity,
                    vy: Math.sin(angle) * velocity,
                    life: Math.random() * 50 + 35, // Shorter life for performance
                    maxLife: Math.random() * 50 + 35,
                    color: this.color,
                    size: Math.random() * 2.5 + 1.5
                });
            }
            
            // Add fewer sparkles
            for (let i = 0; i < 12; i++) {
                this.particles.push({
                    x: this.rocket.x + (Math.random() - 0.5) * 20,
                    y: this.rocket.y + (Math.random() - 0.5) * 20,
                    vx: (Math.random() - 0.5) * 3,
                    vy: (Math.random() - 0.5) * 3,
                    life: Math.random() * 25 + 15,
                    maxLife: Math.random() * 25 + 15,
                    color: '#ffffff',
                    size: Math.random() * 1.5 + 0.8
                });
            }
        }
    }
    
    createAnimalShape() {
        const animals = ['butterfly', 'bird', 'fish', 'star', 'heart'];
        const animal = animals[Math.floor(Math.random() * animals.length)];
        const scale = 1.4 + Math.random() * 0.4; // Much bigger for better visibility
        
        let outlinePoints = [];
        let fillPoints = [];
        
        switch(animal) {
            case 'butterfly':
                const butterflyData = this.getButterflyShape();
                outlinePoints = butterflyData.outline;
                fillPoints = butterflyData.fill;
                break;
            case 'bird':
                const birdData = this.getBirdShape();
                outlinePoints = birdData.outline;
                fillPoints = birdData.fill;
                break;
            case 'fish':
                const fishData = this.getFishShape();
                outlinePoints = fishData.outline;
                fillPoints = fishData.fill;
                break;
            case 'star':
                const starData = this.getStarShape();
                outlinePoints = starData.outline;
                fillPoints = starData.fill;
                break;
            case 'heart':
                const heartData = this.getHeartShape();
                outlinePoints = heartData.outline;
                fillPoints = heartData.fill;
                break;
        }
        
        const animalColor = this.getAnimalColor();
        const outlineColor = this.getBrightOutlineColor();
        
        // Create bright outline particles - OPTIMIZED and STATIONARY
        const maxOutlineParticles = Math.min(outlinePoints.length, 300); // Limit outline particles
        for (let i = 0; i < maxOutlineParticles; i++) {
            const point = outlinePoints[Math.floor(i * outlinePoints.length / maxOutlineParticles)];
            this.particles.push({
                x: this.rocket.x + point.x * scale,
                y: this.rocket.y + point.y * scale,
                vx: (Math.random() - 0.5) * 0.1, // Even less movement for performance
                vy: (Math.random() - 0.5) * 0.1,
                life: Math.random() * 180 + 120, // Slightly shorter for performance
                maxLife: Math.random() * 180 + 120,
                color: outlineColor,
                size: Math.random() * 0.3 + 3.2, // Consistent bigger size
                isOutline: true
            });
        }
        
        // Create fill particles (much fewer for performance)
        const maxFillParticles = Math.min(fillPoints.length, 60); // Limit fill particles
        for (let i = 0; i < maxFillParticles; i++) {
            if (Math.random() < 0.5) { // Only 50% of already limited fill points
                const point = fillPoints[Math.floor(i * fillPoints.length / maxFillParticles)];
                this.particles.push({
                    x: this.rocket.x + point.x * scale,
                    y: this.rocket.y + point.y * scale,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    life: Math.random() * 100 + 80,
                    maxLife: Math.random() * 100 + 80,
                    color: animalColor,
                    size: Math.random() * 0.4 + 1.8,
                    isOutline: false
                });
            }
        }
        
        // Add fewer sparkles for performance
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: this.rocket.x + (Math.random() - 0.5) * 100 * scale,
                y: this.rocket.y + (Math.random() - 0.5) * 100 * scale,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                life: Math.random() * 50 + 30,
                maxLife: Math.random() * 50 + 30,
                color: '#ffffff',
                size: Math.random() * 0.8 + 0.8
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
    
    getBrightOutlineColor() {
        const colors = [
            '#ffffff', '#ffff00', '#00ffff', '#ff69b4', '#00ff00',
            '#ffa500', '#ff1493', '#7fff00', '#ff4500', '#1e90ff'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    getButterflyShape() {
        const outline = [];
        const fill = [];
        
        // Butterfly body outline - OPTIMIZED density
        for (let i = -22; i <= 22; i += 1) {
            outline.push({x: -1, y: i});
            outline.push({x: 0, y: i});
            outline.push({x: 1, y: i});
        }
        
        // Left upper wing outline - optimized curved line
        for (let i = 0; i <= 40; i++) {
            const t = i / 40;
            const angle = t * Math.PI;
            const x = -Math.sin(angle) * 30;
            const y = -Math.cos(angle) * 20 - 8;
            outline.push({x: x, y: y});
            outline.push({x: x + 1, y: y}); // Thicker line
            outline.push({x: x - 1, y: y});
        }
        
        // Right upper wing outline
        for (let i = 0; i <= 40; i++) {
            const t = i / 40;
            const angle = t * Math.PI;
            const x = Math.sin(angle) * 30;
            const y = -Math.cos(angle) * 20 - 8;
            outline.push({x: x, y: y});
            outline.push({x: x + 1, y: y}); // Thicker line
            outline.push({x: x - 1, y: y});
        }
        
        // Left lower wing outline
        for (let i = 0; i <= 35; i++) {
            const t = i / 35;
            const angle = t * Math.PI;
            const x = -Math.sin(angle) * 24;
            const y = Math.cos(angle) * 16 + 12;
            outline.push({x: x, y: y});
            outline.push({x: x + 1, y: y}); // Thicker line
            outline.push({x: x - 1, y: y});
        }
        
        // Right lower wing outline  
        for (let i = 0; i <= 35; i++) {
            const t = i / 35;
            const angle = t * Math.PI;
            const x = Math.sin(angle) * 24;
            const y = Math.cos(angle) * 16 + 12;
            outline.push({x: x, y: y});
            outline.push({x: x + 1, y: y}); // Thicker line
            outline.push({x: x - 1, y: y});
        }
        
        // Wing connection lines - thick
        for (let i = -8; i <= 8; i += 1) {
            outline.push({x: i, y: -8}); // horizontal line
            outline.push({x: i, y: 12}); // horizontal line
        }
        
        // Antennae
        for (let i = 0; i <= 10; i++) {
            outline.push({x: -3 - i * 0.5, y: -22 - i});
            outline.push({x: 3 + i * 0.5, y: -22 - i});
        }
        
        // Minimal fill - just body center
        for (let x = -2; x <= 2; x += 2) {
            for (let y = -15; y <= 15; y += 3) {
                fill.push({x: x, y: y});
            }
        }
        
        return {outline, fill};
    }
    
    isInsideButterfly(x, y) {
        // Simple butterfly shape detection
        if (Math.abs(x) < 2 && y >= -20 && y <= 20) return true; // body
        
        // Upper wings
        if (y < -5 && y > -25) {
            const wingWidth = Math.sin(Math.abs(y + 5) / 18 * Math.PI) * 25;
            if (Math.abs(x) < wingWidth) return true;
        }
        
        // Lower wings
        if (y > 5 && y < 25) {
            const wingWidth = Math.sin((25 - y) / 15 * Math.PI) * 20;
            if (Math.abs(x) < wingWidth) return true;
        }
        
        return false;
    }
    
    getBirdShape() {
        const outline = [];
        const fill = [];
        
        // Bird body outline - thick line
        for (let i = -15; i <= 15; i += 0.5) {
            outline.push({x: i, y: 3});
            outline.push({x: i, y: 2});
            outline.push({x: i, y: 1});
            outline.push({x: i, y: 0});
            outline.push({x: i, y: -1});
            outline.push({x: i, y: -2});
            outline.push({x: i, y: -3});
        }
        
        // Left wing outline - detailed
        for (let i = 0; i <= 40; i++) {
            const x = -18 + i * 0.8;
            const y = -Math.abs(x + 2) * 0.5 - 10;
            outline.push({x: x, y: y});
            outline.push({x: x, y: y + 1}); // Thicker
            outline.push({x: x, y: y - 1});
        }
        
        // Right wing outline  
        for (let i = 0; i <= 40; i++) {
            const x = -2 + i * 0.8;
            const y = -Math.abs(x - 2) * 0.5 - 10;
            outline.push({x: x, y: y});
            outline.push({x: x, y: y + 1}); // Thicker
            outline.push({x: x, y: y - 1});
        }
        
        // Head outline - thick circle
        for (let i = 0; i <= 40; i++) {
            const angle = (i / 40) * Math.PI * 2;
            const x = Math.cos(angle) * 7 + 18;
            const y = Math.sin(angle) * 7;
            outline.push({x: x, y: y});
            outline.push({x: x + 1, y: y}); // Thicker
            outline.push({x: x - 1, y: y});
        }
        
        // Beak - thick triangle
        const beakPoints = [
            {x: 25, y: 0}, {x: 26, y: 0}, {x: 27, y: 0},
            {x: 24, y: 1}, {x: 25, y: 1}, {x: 26, y: 1},
            {x: 24, y: -1}, {x: 25, y: -1}, {x: 26, y: -1}
        ];
        beakPoints.forEach(p => outline.push(p));
        
        // Tail feathers - defined lines
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 3; j++) {
                outline.push({x: -18 - i * 1.5, y: (i * 0.8) - 3 + j});
                outline.push({x: -18 - i * 1.5, y: -(i * 0.8) + 3 - j});
            }
        }
        
        // Eye
        outline.push({x: 20, y: 2});
        outline.push({x: 20, y: 1});
        outline.push({x: 19, y: 2});
        
        // Minimal fill - just body center
        for (let x = -10; x <= 10; x += 4) {
            for (let y = -1; y <= 1; y += 1) {
                fill.push({x: x, y: y});
            }
        }
        
        return {outline, fill};
    }
    
    isInsideBird(x, y) {
        // Body
        if (x >= -12 && x <= 12 && Math.abs(y) <= 2) return true;
        
        // Head
        const headDist = Math.sqrt((x - 15) * (x - 15) + y * y);
        if (headDist <= 5) return true;
        
        // Wings
        if (x >= -15 && x <= 15 && y <= -4 && y >= -Math.abs(x) * 0.4 - 8) return true;
        
        return false;
    }
    
    getFishShape() {
        const outline = [];
        const fill = [];
        
        // Fish body outline - top
        for (let i = -15; i <= 15; i += 1) {
            const width = 8 - Math.abs(i) * 0.25;
            outline.push({x: i, y: width});
            outline.push({x: i, y: -width});
        }
        
        // Tail outline
        const tailPoints = [
            {x: -20, y: 8}, {x: -25, y: 12}, {x: -28, y: 8}, {x: -30, y: 0},
            {x: -28, y: -8}, {x: -25, y: -12}, {x: -20, y: -8}
        ];
        tailPoints.forEach(point => outline.push(point));
        
        // Head (rounded)
        for (let i = 0; i <= 15; i++) {
            const angle = (i / 15) * Math.PI;
            const radius = 8;
            outline.push({x: 15 + Math.cos(angle) * radius, y: Math.sin(angle) * radius});
            outline.push({x: 15 + Math.cos(angle) * radius, y: -Math.sin(angle) * radius});
        }
        
        // Fins
        const finPoints = [
            {x: 5, y: 12}, {x: 8, y: 15}, {x: 10, y: 12},
            {x: 5, y: -12}, {x: 8, y: -15}, {x: 10, y: -12},
            {x: -5, y: 10}, {x: -8, y: 13}, {x: -10, y: 10},
            {x: -5, y: -10}, {x: -8, y: -13}, {x: -10, y: -10}
        ];
        finPoints.forEach(point => outline.push(point));
        
        // Fill points
        for (let x = -25; x <= 20; x += 3) {
            for (let y = -12; y <= 12; y += 3) {
                if (this.isInsideFish(x, y)) {
                    fill.push({x: x, y: y});
                }
            }
        }
        
        return {outline, fill};
    }
    
    isInsideFish(x, y) {
        // Main body
        if (x >= -15 && x <= 15) {
            const width = 8 - Math.abs(x) * 0.25;
            if (Math.abs(y) <= width) return true;
        }
        
        // Head
        const headDist = Math.sqrt((x - 15) * (x - 15) + y * y);
        if (headDist <= 7) return true;
        
        // Tail area
        if (x >= -25 && x <= -15 && Math.abs(y) <= 8) return true;
        
        return false;
    }
    
    getStarShape() {
        const outline = [];
        const fill = [];
        const points = 5;
        const outerRadius = 22;
        const innerRadius = 9;
        
        // Star outline - connect all points
        for (let i = 0; i <= points * 2; i++) {
            const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            outline.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius
            });
        }
        
        // Add more density to outline by interpolating between points
        for (let i = 0; i < points * 2; i++) {
            const angle1 = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
            const angle2 = ((i + 1) / (points * 2)) * Math.PI * 2 - Math.PI / 2;
            const radius1 = i % 2 === 0 ? outerRadius : innerRadius;
            const radius2 = (i + 1) % 2 === 0 ? outerRadius : innerRadius;
            
            for (let t = 0.1; t < 1; t += 0.1) {
                const angle = angle1 + (angle2 - angle1) * t;
                const radius = radius1 + (radius2 - radius1) * t;
                outline.push({
                    x: Math.cos(angle) * radius,
                    y: Math.sin(angle) * radius
                });
            }
        }
        
        // Fill points
        for (let x = -20; x <= 20; x += 3) {
            for (let y = -20; y <= 20; y += 3) {
                if (this.isInsideStar(x, y, outerRadius, innerRadius)) {
                    fill.push({x: x, y: y});
                }
            }
        }
        
        return {outline, fill};
    }
    
    isInsideStar(x, y, outerRadius, innerRadius) {
        const distance = Math.sqrt(x * x + y * y);
        let angle = Math.atan2(y, x) + Math.PI / 2;
        if (angle < 0) angle += Math.PI * 2;
        
        const segmentAngle = (Math.PI * 2) / 10; // 10 segments (5 points * 2)
        const segmentIndex = Math.floor(angle / segmentAngle);
        const localAngle = angle - segmentIndex * segmentAngle;
        
        const isOuterSegment = segmentIndex % 2 === 0;
        const maxRadius = isOuterSegment ? outerRadius : 
            innerRadius + (outerRadius - innerRadius) * (1 - Math.abs(localAngle - segmentAngle / 2) / (segmentAngle / 2));
        
        return distance <= maxRadius;
    }
    
    getHeartShape() {
        const outline = [];
        const fill = [];
        const scale = 0.8;
        
        // Heart outline - more detailed
        for (let i = 0; i <= 150; i++) {
            const t = (i / 150) * Math.PI * 2;
            const x = 16 * Math.pow(Math.sin(t), 3) * scale;
            const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * scale;
            outline.push({x: x, y: y});
        }
        
        // Fill points
        for (let x = -15; x <= 15; x += 2) {
            for (let y = -8; y <= 12; y += 2) {
                if (this.isInsideHeart(x, y, scale)) {
                    fill.push({x: x, y: y});
                }
            }
        }
        
        return {outline, fill};
    }
    
    isInsideHeart(x, y, scale) {
        // Heart equation: ((x/a)^2 + (y/b)^2 - 1)^3 - (x/a)^2 * (y/b)^3 = 0
        // Simplified approximation for our purposes
        const normalizedX = x / scale;
        const normalizedY = y / scale;
        
        // Check if point is inside heart shape bounds
        if (normalizedY > 15 || normalizedY < -10) return false;
        
        // Upper part (two circles)
        if (normalizedY > 0) {
            const leftCircle = (normalizedX + 6) * (normalizedX + 6) + (normalizedY - 6) * (normalizedY - 6);
            const rightCircle = (normalizedX - 6) * (normalizedX - 6) + (normalizedY - 6) * (normalizedY - 6);
            return leftCircle <= 36 || rightCircle <= 36;
        }
        
        // Lower part (triangle-like)
        const bottomWidth = 16 - Math.abs(normalizedY) * 1.2;
        return Math.abs(normalizedX) <= bottomWidth;
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
                
                // Much stronger glow for outline particles
                if (particle.isOutline) {
                    ctx.shadowBlur = 25;
                    ctx.shadowColor = particle.color;
                    ctx.globalCompositeOperation = 'screen'; // Brighter blend mode
                } else {
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = particle.color;
                    ctx.globalCompositeOperation = 'source-over';
                }
                
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

// Performance settings
const MAX_TOTAL_PARTICLES = 2000; // Global particle limit
const MAX_FIREWORKS = 8; // Maximum fireworks on screen
let totalParticleCount = 0;

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Animation loop with performance monitoring
function animate() {
    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(12, 12, 12, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Count total particles for performance monitoring
    totalParticleCount = 0;
    for (let firework of fireworks) {
        totalParticleCount += firework.particles.length;
    }
    
    // Remove oldest fireworks if we exceed limits
    while (fireworks.length > MAX_FIREWORKS || totalParticleCount > MAX_TOTAL_PARTICLES) {
        if (fireworks.length > 0) {
            fireworks.shift(); // Remove oldest firework
            totalParticleCount = 0;
            for (let firework of fireworks) {
                totalParticleCount += firework.particles.length;
            }
        } else {
            break;
        }
    }
    
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

// Create firework function with performance check
function createFirework(x, y, type = 'normal') {
    // Performance check - don't create if too many particles
    if (totalParticleCount > MAX_TOTAL_PARTICLES * 0.8) {
        return; // Skip creating new firework if approaching limit
    }
    
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