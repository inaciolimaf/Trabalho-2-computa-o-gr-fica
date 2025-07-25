const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 4, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
document.body.appendChild( renderer.domElement );

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

const groundMaterial = new CANNON.Material("groundMaterial");
const groundBody = new CANNON.Body({
    mass: 0,
    material: groundMaterial
});
const groundShape = new CANNON.Plane();
groundBody.addShape(groundShape);
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -Math.PI/2);
world.addBody(groundBody);

const groundMesh = new THREE.Mesh(
    new THREE.PlaneGeometry( 100, 100 ),
    new THREE.MeshStandardMaterial( { color: 0x808080, side: THREE.DoubleSide } )
);
groundMesh.rotation.x = -Math.PI / 2;
groundMesh.receiveShadow = true;
scene.add( groundMesh );

// Cesta
const basketMaterial = new CANNON.Material("basketMaterial");
const basketBody = new CANNON.Body({
    mass: 1,
    material: basketMaterial,
    position: new CANNON.Vec3(0, 0.5, 0),
    fixedRotation: true
});

const bottom = new CANNON.Box(new CANNON.Vec3(1, 0.1, 1));
const leftWall = new CANNON.Box(new CANNON.Vec3(0.1, 0.5, 1));
const rightWall = new CANNON.Box(new CANNON.Vec3(0.1, 0.5, 1));
const backWall = new CANNON.Box(new CANNON.Vec3(1, 0.5, 0.1));
const frontWall = new CANNON.Box(new CANNON.Vec3(1, 0.5, 0.1));

basketBody.addShape(bottom, new CANNON.Vec3(0, -0.5, 0));
basketBody.addShape(leftWall, new CANNON.Vec3(-1, 0, 0));
basketBody.addShape(rightWall, new CANNON.Vec3(1, 0, 0));
basketBody.addShape(backWall, new CANNON.Vec3(0, 0, -1));
basketBody.addShape(frontWall, new CANNON.Vec3(0, 0, 1));

world.addBody(basketBody);

const basketMesh = new THREE.Group();
const bottomMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 0.2, 2), new THREE.MeshStandardMaterial({ color: 0x4444ff }));
const leftWallMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1, 2), new THREE.MeshStandardMaterial({ color: 0x4444ff }));
const rightWallMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1, 2), new THREE.MeshStandardMaterial({ color: 0x4444ff }));
const backWallMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 0.2), new THREE.MeshStandardMaterial({ color: 0x4444ff }));
const frontWallMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 0.2), new THREE.MeshStandardMaterial({ color: 0x4444ff }));

bottomMesh.position.set(0, -0.5, 0);
leftWallMesh.position.set(-1, 0, 0);
rightWallMesh.position.set(1, 0, 0);
backWallMesh.position.set(0, 0, -1);
frontWallMesh.position.set(0, 0, 1);

basketMesh.add(bottomMesh, leftWallMesh, rightWallMesh, backWallMesh, frontWallMesh);
scene.add(basketMesh);

const basketTriggerBody = new CANNON.Body({
    isTrigger: true,
    mass: 0,
    position: new CANNON.Vec3(0, 1, 0)
});
const basketTriggerShape = new CANNON.Box(new CANNON.Vec3(0.9, 0.1, 0.9));
basketTriggerBody.addShape(basketTriggerShape);
world.addBody(basketTriggerBody);


const balls = [];
const ballMaterial = new CANNON.Material("ballMaterial");
const ballMeshes = [];

let score = 0;
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
let timeLeft = 60;

const params = {
    gravity: -9.82,
    ballSpeed: 5,
};

const gui = new dat.GUI();
gui.add(params, 'gravity', -20, 0).onChange(value => world.gravity.y = value);


const ballBasketContactMaterial = new CANNON.ContactMaterial(ballMaterial, basketMaterial, {
    friction: 0.1,
    restitution: 0.4
});
world.addContactMaterial(ballBasketContactMaterial);

const ballGroundContactMaterial = new CANNON.ContactMaterial(ballMaterial, groundMaterial, {
    friction: 0.5,
    restitution: 0.7
});
world.addContactMaterial(ballGroundContactMaterial);

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playPingSound(){
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    gainNode.gain.setValueAtTime(1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
}

function createBall() {
    const radius = 0.2;
    const ballBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3((Math.random() - 0.5) * 10, 10, 0),
        shape: new CANNON.Sphere(radius),
        material: ballMaterial
    });
    world.addBody(ballBody);

    const ballMesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 32, 32),
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

const ballInterval = setInterval(createBall, 1000);

const timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.innerText = `Tempo: ${timeLeft}`;
    if (timeLeft <= 0) {
        clearInterval(ballInterval);
        clearInterval(timerInterval);
        alert("Fim de jogo! Pontuação final: " + score);
    }
}, 1000);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);


function animate() {
	requestAnimationFrame( animate );
    world.step(1/60);

    basketMesh.position.copy(basketBody.position);
    basketMesh.quaternion.copy(basketBody.quaternion);

    basketTriggerBody.position.x = basketBody.position.x;
    basketTriggerBody.position.z = basketBody.position.z;

    for (let i = 0; i < balls.length; i++) {
        balls[i].mesh.position.copy(balls[i].body.position);
        balls[i].mesh.quaternion.copy(balls[i].body.quaternion);

        if (balls[i].body.position.y < 0.25 && balls[i].body.velocity.length() < 0.1) {
            balls[i].body.angularVelocity.set(0, 0, 0);
            balls[i].body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 0), 0);
        }
    }

	renderer.render( scene, camera );
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


