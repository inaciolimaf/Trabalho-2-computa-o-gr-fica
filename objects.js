// objects.js

// Criação do chão (corpo Cannon + mesh Three)
function createGround(world, scene) {
    const groundMaterial = new CANNON.Material("groundMaterial");
    const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial });
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

    return { groundBody, groundMesh, groundMaterial };
}

// Criação da cesta (corpo Cannon + mesh Three)
function createBasket(world, scene) {
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

    // Mesh visual
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

    return { basketBody, basketMesh, basketMaterial };
}

// Criação do trigger da cesta (corpo Cannon)
function createBasketTrigger(world) {
    const basketTriggerBody = new CANNON.Body({
        isTrigger: true,
        mass: 0,
        position: new CANNON.Vec3(TRIGGER_CONFIG.POSITION.x, TRIGGER_CONFIG.POSITION.y, TRIGGER_CONFIG.POSITION.z)
    });
    const basketTriggerShape = new CANNON.Box(new CANNON.Vec3(TRIGGER_CONFIG.SIZE.width, TRIGGER_CONFIG.SIZE.height, TRIGGER_CONFIG.SIZE.depth));
    basketTriggerBody.addShape(basketTriggerShape);
    world.addBody(basketTriggerBody);
    return basketTriggerBody;
}

// Criação de uma bola (corpo Cannon + mesh Three)
function createBall(world, scene, ballMaterial) {
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

    // Escolhe textura aleatória
    const textures = window.BALL_TEXTURE_FUNCTIONS;
    const textureFunc = textures[Math.floor(Math.random() * textures.length)];
    const texture = textureFunc();

    const ballMesh = new THREE.Mesh(
        new THREE.SphereGeometry(BALL_CONFIG.RADIUS, BALL_CONFIG.GEOMETRY_SEGMENTS, BALL_CONFIG.GEOMETRY_SEGMENTS),
        new THREE.MeshStandardMaterial({ map: texture })
    );
    ballMesh.castShadow = true;
    ballMesh.receiveShadow = true;
    scene.add(ballMesh);

    return { ballBody, ballMesh };
}