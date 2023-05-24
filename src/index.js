import Phaser from 'phaser'

// Resolution setting for the game
const resolution = {
    width: 1024,
    height: 700
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
    physics: {
        default: 'arcade' 
    }    
};

// Initialize the game with the defined configuration
const game = new Phaser.Game(config);
const paddleSpeed = 400;
let upButton, downButton, wButton, sButton;
let ball;


// Game variables
let paddles, player1Paddle, player2Paddle;

// Load all necessary resources before game starts
function preload () {
    upButton = this.input.keyboard.addKey('UP');
    downButton = this.input.keyboard.addKey('DOWN');
    wButton = this.input.keyboard.addKey('W');
    sButton = this.input.keyboard.addKey('S');

    this.load.image('ball', 'assets/ball.png');
    this.load.image('dotted-line', 'assets/dotted-line.png');
    this.load.image('paddle', 'assets/paddle.png');


}

// Create game objects at start of game
function create () {
    this.add.image(resolution.width * 0.5, resolution.height * 0.5, 'dotted-line');

    paddles = this.physics.add.group();
    player1Paddle = paddles.create(resolution.width * 0.05, resolution.height * 0.5, 'paddle');
    player2Paddle = paddles.create(resolution.width * 0.95, resolution.height * 0.5, 'paddle');
    player1Paddle.setCollideWorldBounds(true);
    player2Paddle.setCollideWorldBounds(true);

    ball = this.physics.add.sprite(resolution.width * 0.5, resolution.height * 0.5, 'ball');
    ball.setCollideWorldBounds(true);
    ball.setBounce(1, 1);
    ball.body.onWorldBounds = true;
    ball.body.world.on('worldbounds', ballWallCollision);

    launchBall();

    this.physics.add.collider(ball, paddles, ballPaddleCollision);


}

// Game logic while running the game
function update () {
    updatePlayerControls();
}

function launchBall () {
    let velocity = {x:-300, y:0};

    ball.setVelocity(velocity.x, velocity.y);
}

function resetBall () {
    ball.setPosition(resolution.width * 0.5, resolution.height * 0.5);

    launchBall();
}

function ballWallCollision (ball, up, down, left, right) {
    if(left || right) {
        resetBall();
    }
}

function ballPaddleCollision (ballRef, paddleRef) {
    let yDiff = ballRef.y - paddleRef.y;

    ballRef.body.velocity.y += yDiff * 5;
}

function updatePlayerControls () {
    // Player 1 controls
    if (wButton.isDown)
    {
        // Player 1 going up
        player1Paddle.setVelocityY(-paddleSpeed);
    }
    else if (sButton.isDown) {
        // Player 1 going down
        player1Paddle.setVelocityY(paddleSpeed);
    }
    else {
        // Player 1 stopping
        player1Paddle.setVelocityY(0);
    }

    // Player 2 controls
    if (upButton.isDown)
    {
        // Player 2 going up
        player2Paddle.setVelocityY(-paddleSpeed);
    }
    else if (downButton.isDown) {
        // Player 2 going down
        player2Paddle.setVelocityY(paddleSpeed);
    }
    else {
        // Player 2 stopping
        player2Paddle.setVelocityY(0);
    }
}




