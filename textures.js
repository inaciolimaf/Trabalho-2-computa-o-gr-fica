// textures.js

function createSpikyTexture(size = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r0 = size * 0.45;
        const r1 = size * 0.48 + Math.random() * size * 0.04;
        const x0 = size / 2 + Math.cos(angle) * r0;
        const y0 = size / 2 + Math.sin(angle) * r0;
        const x1 = size / 2 + Math.cos(angle) * r1;
        const y1 = size / 2 + Math.sin(angle) * r1;
        ctx.strokeStyle = '#aa0000';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = '#FFE66D';
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
}

function createGeoidTexture(size = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#4488ff';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        const offset = Math.random() * size * 0.2;
        for (let x = 0; x < size; x += 8) {
            let y = Math.sin((x / size) * Math.PI * 2 + i) * size * 0.1 + size * (i + 1) / 8 + offset;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size * 0.35, 0, Math.PI * 2);
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.globalAlpha = 1;
    return new THREE.CanvasTexture(canvas);
}

function createStripedTexture(size = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, size, size);
    const colors = ['#e74c3c', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];
    const stripeWidth = size / colors.length;
    for (let i = 0; i < colors.length; i++) {
        ctx.fillStyle = colors[i];
        ctx.fillRect(i * stripeWidth, 0, stripeWidth, size);
    }
    ctx.beginPath();
    ctx.arc(size/2, size/2, size*0.4, 0, Math.PI*2);
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.globalAlpha = 1;
    return new THREE.CanvasTexture(canvas);
}

function createPolkaDotTexture(size = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f7fa4d';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#e67e22';
    const r = size * 0.06;
    for (let x = r; x < size; x += r*3) {
        for (let y = r; y < size; y += r*3) {
            ctx.beginPath();
            ctx.arc(x + ((y/r)%2)*r*1.5, y, r, 0, Math.PI*2);
            ctx.fill();
        }
    }
    return new THREE.CanvasTexture(canvas);
}

function createCheckerTexture(size = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    const colors = ['#fff', '#444'];
    const count = 8;
    const s = size / count;
    for (let y = 0; y < count; y++) {
        for (let x = 0; x < count; x++) {
            ctx.fillStyle = colors[(x + y) % 2];
            ctx.fillRect(x * s, y * s, s, s);
        }
    }
    ctx.beginPath();
    ctx.arc(size/2, size/2, size*0.45, 0, Math.PI*2);
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.globalAlpha = 1;
    return new THREE.CanvasTexture(canvas);
}

function createStarTexture(size = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#23235b';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const r = Math.random() * size * 0.03 + 2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.save();
    ctx.translate(size/2, size/2);
    ctx.rotate(Math.random()*Math.PI);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        ctx.lineTo(0, -size*0.25);
        ctx.rotate(Math.PI/5);
        ctx.lineTo(0, -size*0.12);
        ctx.rotate(Math.PI/5);
    }
    ctx.closePath();
    ctx.fillStyle = '#ffeb3b';
    ctx.globalAlpha = 0.7;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
    return new THREE.CanvasTexture(canvas);
}

function createRadialGradientTexture(size = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(size/2, size/2, size*0.1, size/2, size/2, size*0.45);
    grad.addColorStop(0, "#7ef");
    grad.addColorStop(0.5, "#0ae");
    grad.addColorStop(1, "#00334d");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    ctx.beginPath();
    ctx.arc(size/2, size/2, size*0.33, 0, Math.PI*2);
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.globalAlpha = 1;
    return new THREE.CanvasTexture(canvas);
}

// Array global de funções de textura
window.BALL_TEXTURE_FUNCTIONS = [
    createSpikyTexture,
    createGeoidTexture,
    createStripedTexture,
    createPolkaDotTexture,
    createCheckerTexture,
    createStarTexture,
    createRadialGradientTexture
];