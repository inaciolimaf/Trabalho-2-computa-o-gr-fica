// game.js

let scene, camera, renderer, world, gui;
let groundMaterial, groundBody, groundMesh;
let basketMaterial, basketBody, basketMesh, basketTriggerBody;
let balls = [];
let ballMaterial;
let score = 0;
let scoreElement, timerElement;
let timeLeft = GAME_CONFIG.GAME_DURATION;
let ballInterval, timerInterval;
let ambientLight, directionalLight;
let audioContext;
let params;
let animationFrameId;

// Função principal
function initGame() {
    scoreElement = document.getElementById('score');
    timerElement = document.getElementById('timer');

    // Cena, câmera, renderizador
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        CAMERA_CONFIG.FOV,
        window.innerWidth / window.innerHeight,
        CAMERA_CONFIG.NEAR,
        CAMERA_CONFIG.FAR
    );
    camera.position.set(
        CAMERA_CONFIG.POSITION.x,
        CAMERA_CONFIG.POSITION.y,
        CAMERA_CONFIG.POSITION.z
    );
    camera.lookAt(
        CAMERA_CONFIG.LOOK_AT.x,
        CAMERA_CONFIG.LOOK_AT.y,
        CAMERA_CONFIG.LOOK_AT.z
    );
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Mundo físico
    world = new CANNON.World();
    world.gravity.set(0, GAME_CONFIG.GRAVITY, 0);

    // Chão
    let ground = createGround(world, scene);
    groundMaterial = ground.groundMaterial;
    groundBody = ground.groundBody;
    groundMesh = ground.groundMesh;

    // Cesta
    let basket = createBasket(world, scene);
    basketMaterial = basket.basketMaterial;
    basketBody = basket.basketBody;
    basketMesh = basket.basketMesh;

    // Trigger da cesta
    basketTriggerBody = createBasketTrigger(world);

    // Bolas
    balls = [];
    ballMaterial = new CANNON.Material("ballMaterial");

    // GUI params
    params = {
        gravity: GAME_CONFIG.GRAVITY,
        ballSpeed: GAME_CONFIG.BALL_SPEED,
    };
    gui = new dat.GUI();
    gui.add(params, 'gravity', GUI_CONFIG.GRAVITY_MIN, GUI_CONFIG.GRAVITY_MAX).onChange(value => world.gravity.y = value);

    // Materiais de contato
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

    // Áudio
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Iluminação
    ambientLight = new THREE.AmbientLight(LIGHTING_CONFIG.AMBIENT.color, LIGHTING_CONFIG.AMBIENT.intensity);
    scene.add(ambientLight);
    directionalLight = new THREE.DirectionalLight(LIGHTING_CONFIG.DIRECTIONAL.color, LIGHTING_CONFIG.DIRECTIONAL.intensity);
    directionalLight.position.set(
        LIGHTING_CONFIG.DIRECTIONAL.position.x,
        LIGHTING_CONFIG.DIRECTIONAL.position.y,
        LIGHTING_CONFIG.DIRECTIONAL.position.z
    );
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Eventos
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    basketTriggerBody.addEventListener("collide", onBasketTriggerCollide);

    // Timers
    startIntervals();

    // Loop de animação
    animate();
}

// Criação de bolas, usando objects.js
function createBallAndAdd() {
    const ball = createBall(world, scene, ballMaterial);
    balls.push({ body: ball.ballBody, mesh: ball.ballMesh });
}

// Som ao pontuar
function playPingSound() {
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

// Colisão trigger
function onBasketTriggerCollide(e) {
    const ballIndex = balls.findIndex(b => b.body === e.body);
    if (ballIndex > -1) {
        playPingSound();
        score++;
        scoreElement.innerText = `Pontos: ${score}`;
        world.remove(balls[ballIndex].body);
        scene.remove(balls[ballIndex].mesh);
        balls.splice(ballIndex, 1);
    }
}

// Resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Movimento da cesta
function onDocumentMouseMove(event) {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const vector = new THREE.Vector3(mouseX, 0, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));
    basketBody.position.x = pos.x;
}

// Animação
function animate() {
    animationFrameId = requestAnimationFrame(animate);
    world.step(GAME_CONFIG.PHYSICS_TIMESTEP);

    basketMesh.position.copy(basketBody.position);
    basketMesh.quaternion.copy(basketBody.quaternion);

    basketTriggerBody.position.x = basketBody.position.x;
    basketTriggerBody.position.z = basketBody.position.z;

    for (let i = 0; i < balls.length; i++) {
        balls[i].mesh.position.copy(balls[i].body.position);
        balls[i].mesh.quaternion.copy(balls[i].body.quaternion);
        if (
            balls[i].body.position.y < BALL_CONFIG.GROUND_HEIGHT_THRESHOLD &&
            balls[i].body.velocity.length() < BALL_CONFIG.STOP_VELOCITY_THRESHOLD
        ) {
            balls[i].body.angularVelocity.set(0, 0, 0);
            balls[i].body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 0), 0);
        }
    }
    renderer.render(scene, camera);
}

// Timers
function startIntervals() {
    ballInterval = setInterval(createBallAndAdd, GAME_CONFIG.BALL_SPAWN_INTERVAL);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.innerText = `Tempo: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(ballInterval);
            clearInterval(timerInterval);
            cancelAnimationFrame(animationFrameId);
            alert("Fim de jogo! Pontuação final: " + score);
        }
    }, 1000);
}

// Exporta initGame
window.initGame = initGame;