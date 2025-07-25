// Configurações do jogo
const GAME_CONFIG = {
    GRAVITY: -9.82,
    BALL_SPEED: 5,
    GAME_DURATION: 60, // segundos
    BALL_SPAWN_INTERVAL: 1000, // milissegundos
    PHYSICS_TIMESTEP: 1/60
};

// Configurações da câmera
const CAMERA_CONFIG = {
    FOV: 75,
    NEAR: 0.1,
    FAR: 1000,
    POSITION: { x: 0, y: 4, z: 10 },
    LOOK_AT: { x: 0, y: 0, z: 0 }
};

// Configurações do chão
const GROUND_CONFIG = {
    SIZE: 100,
    COLOR: 0x808080,
    ROTATION: -Math.PI / 2
};

// Configurações da cesta
const BASKET_CONFIG = {
    POSITION: { x: 0, y: 0.5, z: 0 },
    SIZE: { width: 1, height: 0.5, depth: 1 },
    WALL_THICKNESS: 0.1,
    BOTTOM_THICKNESS: 0.1,
    COLOR: 0x4444ff,
    MASS: 1
};

// Configurações da zona de pontuação
const TRIGGER_CONFIG = {
    POSITION: { x: 0, y: 1, z: 0 },
    SIZE: { width: 0.9, height: 0.1, depth: 0.9 }
};

// Configurações das bolas
const BALL_CONFIG = {
    RADIUS: 0.2,
    MASS: 1,
    SPAWN_HEIGHT: 10,
    SPAWN_RANGE: 10, // largura da área de spawn
    GEOMETRY_SEGMENTS: 32,
    STOP_VELOCITY_THRESHOLD: 0.1,
    GROUND_HEIGHT_THRESHOLD: 0.25
};

// Configurações de materiais físicos
const PHYSICS_MATERIALS = {
    BALL_BASKET: {
        friction: 0.1,
        restitution: 0.4
    },
    BALL_GROUND: {
        friction: 0.5,
        restitution: 0.7
    }
};

// Configurações de iluminação
const LIGHTING_CONFIG = {
    AMBIENT: {
        color: 0xffffff,
        intensity: 0.5
    },
    DIRECTIONAL: {
        color: 0xffffff,
        intensity: 0.5,
        position: { x: 0, y: 10, z: 5 }
    }
};

// Configurações de áudio
const AUDIO_CONFIG = {
    PING_FREQUENCY: 440,
    PING_DURATION: 1
};

// Configurações da GUI
const GUI_CONFIG = {
    GRAVITY_MIN: -20,
    GRAVITY_MAX: 0
};

// Implementação do jogo
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    CAMERA_CONFIG.FOV, 
    window.innerWidth / window.innerHeight, 
    CAMERA_CONFIG.NEAR, 
    CAMERA_CONFIG.FAR
);
camera.position.set(CAMERA_CONFIG.POSITION.x, CAMERA_CONFIG.POSITION.y, CAMERA_CONFIG.POSITION.z);
camera.lookAt(CAMERA_CONFIG.LOOK_AT.x, CAMERA_CONFIG.LOOK_AT.y, CAMERA_CONFIG.LOOK_AT.z);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const world = new CANNON.World();
world.gravity.set(0, GAME_CONFIG.GRAVITY, 0);

const groundMaterial = new CANNON.Material("groundMaterial");
const groundBody = new CANNON.Body({
    mass: 0,
    material: groundMaterial
});
const groundShape = new CANNON.Plane();
groundBody.addShape(groundShape);
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), GROUND_CONFIG.ROTATION);
world.addBody(groundBody);

const groundMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(GROUND_CONFIG.SIZE, GROUND_CONFIG.SIZE),
    new THREE.MeshStandardMaterial({ color: GROUND_CONFIG.COLOR, side: THREE.DoubleSide })
);
groundMesh.rotation.x = GROUND_CONFIG.ROTATION;
groundMesh.receiveShadow = true;
scene.add(groundMesh);

// Cesta
const basketMaterial = new CANNON.Material("basketMaterial");
const basketBody = new CANNON.Body({
    mass: BASKET_CONFIG.MASS,
    material: basketMaterial,
    position: new CANNON.Vec3(BASKET_CONFIG.POSITION.x, BASKET_CONFIG.POSITION.y, BASKET_CONFIG.POSITION.z),
    fixedRotation: true
});

const bottom = new CANNON.Box(new CANNON.Vec3(BASKET_CONFIG.SIZE.width, BASKET_CONFIG.BOTTOM_THICKNESS, BASKET_CONFIG.SIZE.depth));
const leftWall = new CANNON.Box(new CANNON.Vec3(BASKET_CONFIG.WALL_THICKNESS, BASKET_CONFIG.SIZE.height, BASKET_CONFIG.SIZE.depth));
const rightWall = new CANNON.Box(new CANNON.Vec3(BASKET_CONFIG.WALL_THICKNESS, BASKET_CONFIG.SIZE.height, BASKET_CONFIG.SIZE.depth));
const backWall = new CANNON.Box(new CANNON.Vec3(BASKET_CONFIG.SIZE.width, BASKET_CONFIG.SIZE.height, BASKET_CONFIG.WALL_THICKNESS));
const frontWall = new CANNON.Box(new CANNON.Vec3(BASKET_CONFIG.SIZE.width, BASKET_CONFIG.SIZE.height, BASKET_CONFIG.WALL_THICKNESS));

basketBody.addShape(bottom, new CANNON.Vec3(0, -BASKET_CONFIG.SIZE.height, 0));
basketBody.addShape(leftWall, new CANNON.Vec3(-BASKET_CONFIG.SIZE.width, 0, 0));
basketBody.addShape(rightWall, new CANNON.Vec3(BASKET_CONFIG.SIZE.width, 0, 0));
basketBody.addShape(backWall, new CANNON.Vec3(0, 0, -BASKET_CONFIG.SIZE.depth));
basketBody.addShape(frontWall, new CANNON.Vec3(0, 0, BASKET_CONFIG.SIZE.depth));

world.addBody(basketBody);

const basketMesh = new THREE.Group();
const bottomMesh = new THREE.Mesh(
    new THREE.BoxGeometry(BASKET_CONFIG.SIZE.width * 2, BASKET_CONFIG.BOTTOM_THICKNESS * 2, BASKET_CONFIG.SIZE.depth * 2), 
    new THREE.MeshStandardMaterial({ color: BASKET_CONFIG.COLOR })
);
const leftWallMesh = new THREE.Mesh(
    new THREE.BoxGeometry(BASKET_CONFIG.WALL_THICKNESS * 2, BASKET_CONFIG.SIZE.height * 2, BASKET_CONFIG.SIZE.depth * 2), 
    new THREE.MeshStandardMaterial({ color: BASKET_CONFIG.COLOR })
);
const rightWallMesh = new THREE.Mesh(
    new THREE.BoxGeometry(BASKET_CONFIG.WALL_THICKNESS * 2, BASKET_CONFIG.SIZE.height * 2, BASKET_CONFIG.SIZE.depth * 2), 
    new THREE.MeshStandardMaterial({ color: BASKET_CONFIG.COLOR })
);
const backWallMesh = new THREE.Mesh(
    new THREE.BoxGeometry(BASKET_CONFIG.SIZE.width * 2, BASKET_CONFIG.SIZE.height * 2, BASKET_CONFIG.WALL_THICKNESS * 2), 
    new THREE.MeshStandardMaterial({ color: BASKET_CONFIG.COLOR })
);
const frontWallMesh = new THREE.Mesh(
    new THREE.BoxGeometry(BASKET_CONFIG.SIZE.width * 2, BASKET_CONFIG.SIZE.height * 2, BASKET_CONFIG.WALL_THICKNESS * 2), 
    new THREE.MeshStandardMaterial({ color: BASKET_CONFIG.COLOR })
);

bottomMesh.position.set(0, -BASKET_CONFIG.SIZE.height, 0);
leftWallMesh.position.set(-BASKET_CONFIG.SIZE.width, 0, 0);
rightWallMesh.position.set(BASKET_CONFIG.SIZE.width, 0, 0);
backWallMesh.position.set(0, 0, -BASKET_CONFIG.SIZE.depth);
frontWallMesh.position.set(0, 0, BASKET_CONFIG.SIZE.depth);

basketMesh.add(bottomMesh, leftWallMesh, rightWallMesh, backWallMesh, frontWallMesh);
scene.add(basketMesh);

const basketTriggerBody = new CANNON.Body({
    isTrigger: true,
    mass: 0,
    position: new CANNON.Vec3(TRIGGER_CONFIG.POSITION.x, TRIGGER_CONFIG.POSITION.y, TRIGGER_CONFIG.POSITION.z)
});
const basketTriggerShape = new CANNON.Box(new CANNON.Vec3(TRIGGER_CONFIG.SIZE.width, TRIGGER_CONFIG.SIZE.height, TRIGGER_CONFIG.SIZE.depth));
basketTriggerBody.addShape(basketTriggerShape);
world.addBody(basketTriggerBody);

const balls = [];
const ballMaterial = new CANNON.Material("ballMaterial");
const ballMeshes = [];

let score = 0;
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
let timeLeft = GAME_CONFIG.GAME_DURATION;

const params = {
    gravity: GAME_CONFIG.GRAVITY,
    ballSpeed: GAME_CONFIG.BALL_SPEED,
};

const gui = new dat.GUI();
gui.add(params, 'gravity', GUI_CONFIG.GRAVITY_MIN, GUI_CONFIG.GRAVITY_MAX).onChange(value => world.gravity.y = value);

const ballBasketContactMaterial = new CANNON.ContactMaterial(ballMaterial, basketMaterial, {
    friction: PHYSICS_MATERIALS.BALL_BASKET.friction,
    restitution: PHYSICS_MATERIALS.BALL_BASKET.restitution
});
world.addContactMaterial(ballBasketContactMaterial);

const ballGroundContactMaterial = new CANNON.ContactMaterial(ballMaterial, groundMaterial, {
    friction: PHYSICS_MATERIALS.BALL_GROUND.friction,
    restitution: PHYSICS_MATERIALS.BALL_GROUND.restitution
});
world.addContactMaterial(ballGroundContactMaterial);

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playPingSound(){
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(AUDIO_CONFIG.PING_FREQUENCY, audioContext.currentTime);
    gainNode.gain.setValueAtTime(1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + AUDIO_CONFIG.PING_DURATION);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + AUDIO_CONFIG.PING_DURATION);
}

function createBall() {
    const ballBody = new CANNON.Body({
        mass: BALL_CONFIG.MASS,
        position: new CANNON.Vec3(
            (Math.random() - 0.5) * BALL_CONFIG.SPAWN_RANGE, 
            BALL_CONFIG.SPAWN_HEIGHT, 
            0
        ),
        shape: new CANNON.Sphere(BALL_CONFIG.RADIUS),
        material: ballMaterial
    });
    world.addBody(ballBody);

    const ballMesh = new THREE.Mesh(
        new THREE.SphereGeometry(BALL_CONFIG.RADIUS, BALL_CONFIG.GEOMETRY_SEGMENTS, BALL_CONFIG.GEOMETRY_SEGMENTS),
        new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff })
    );
    ballMesh.castShadow = true;
    ballMesh.receiveShadow = true;
    scene.add(ballMesh);

    balls.push({ body: ballBody, mesh: ballMesh });
}

basketTriggerBody.addEventListener("collide", (e) => {
    const ballIndex = balls.findIndex(b => b.body === e.body);
    if (ballIndex > -1) {
        playPingSound();
        score++;
        scoreElement.innerText = `Pontos: ${score}`;
        world.remove(balls[ballIndex].body);
        scene.remove(balls[ballIndex].mesh);
        balls.splice(ballIndex, 1);
    }
});

const ballInterval = setInterval(createBall, GAME_CONFIG.BALL_SPAWN_INTERVAL);

const timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.innerText = `Tempo: ${timeLeft}`;
    if (timeLeft <= 0) {
        clearInterval(ballInterval);
        clearInterval(timerInterval);
        alert("Fim de jogo! Pontuação final: " + score);
    }
}, 1000);

const ambientLight = new THREE.AmbientLight(LIGHTING_CONFIG.AMBIENT.color, LIGHTING_CONFIG.AMBIENT.intensity);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(LIGHTING_CONFIG.DIRECTIONAL.color, LIGHTING_CONFIG.DIRECTIONAL.intensity);
directionalLight.position.set(LIGHTING_CONFIG.DIRECTIONAL.position.x, LIGHTING_CONFIG.DIRECTIONAL.position.y, LIGHTING_CONFIG.DIRECTIONAL.position.z);
directionalLight.castShadow = true;
scene.add(directionalLight);

function animate() {
    requestAnimationFrame(animate);
    world.step(GAME_CONFIG.PHYSICS_TIMESTEP);

    basketMesh.position.copy(basketBody.position);
    basketMesh.quaternion.copy(basketBody.quaternion);

    basketTriggerBody.position.x = basketBody.position.x;
    basketTriggerBody.position.z = basketBody.position.z;

    for (let i = 0; i < balls.length; i++) {
        balls[i].mesh.position.copy(balls[i].body.position);
        balls[i].mesh.quaternion.copy(balls[i].body.quaternion);

        if (balls[i].body.position.y < BALL_CONFIG.GROUND_HEIGHT_THRESHOLD && 
            balls[i].body.velocity.length() < BALL_CONFIG.STOP_VELOCITY_THRESHOLD) {
            balls[i].body.angularVelocity.set(0, 0, 0);
            balls[i].body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 0), 0);
        }
    }

    renderer.render(scene, camera);
}
animate();

document.addEventListener('mousemove', onDocumentMouseMove, false);

function onDocumentMouseMove(event) {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const vector = new THREE.Vector3(mouseX, 0, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));
    basketBody.position.x = pos.x;
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);