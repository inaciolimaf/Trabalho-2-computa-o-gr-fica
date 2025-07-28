// config.js

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
    RADIUS: 0.5,
    MASS: 1,
    SPAWN_HEIGHT: 10,
    SPAWN_RANGE: 10,
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