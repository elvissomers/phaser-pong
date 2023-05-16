import Phaser from 'phaser'

// Resolution setting for the game
const resolution = {
    width: 1024,
    height: 800
};

// Configuration for phaser
const config = {
    type: Phaser.AUTO,
    width: resolution.width,
    height:  resolution.height,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
};

// Initialize the game with the defined configuration
const game = new Phaser.Game(config);

// Load all necessary resources before game starts
function preload () {

}

// Create game objects at start of game
function create () {

}

// Game logic while running the game
function update () {

}
