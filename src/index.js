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
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Other game constants
const scoreMarginFromCenter = 20;
const paddleDistFromSides = 100;
const paddleSpeed = 400;

// Game variables
let scoreTextLeft, scoreTextRight;
let scoreLeft = 0, scoreRight = 0;
let paddles, player1Paddle, player2Paddle;
let ball;

// Initialize the game with the defined configuration
const game = new Phaser.Game(config);
let upButton, downButton, wButton, sButton;

// Load all necessary resources before game starts
function preload () {
    // Load images
    this.load.image('paddle', 'assets/paddle.png');
    this.load.image('ball', 'assets/ball.png');
    this.load.image('dotted-line', 'assets/dotted-line.png');

    // Initialize button listeners
    upButton = this.input.keyboard.addKey('UP');
    downButton = this.input.keyboard.addKey('DOWN');
    wButton = this.input.keyboard.addKey('W');
    sButton = this.input.keyboard.addKey('S');

    // Negate gravity settings
    this.physics.world.gravity.y = 0;
}

// Create game objects at start of game
function create () {
    // Create dotted line in the middle of the screen
    this.add.image(resolution.width * 0.5, resolution.height * 0.5, 'dotted-line');

    // Create the score text and align it
    scoreTextLeft = this.add.text(resolution.width * 0.5 - scoreMarginFromCenter, resolution.height * 0.5, "0", { font: "65px Arial", fill: "#878787" });
    scoreTextLeft.setOrigin(1, 0.5); // Align left score to the left of the position
    scoreTextRight = this.add.text(resolution.width * 0.5 + scoreMarginFromCenter, resolution.height * 0.5, "0", { font: "65px Arial", fill: "#878787" });
    scoreTextRight.setOrigin(0, 0.5); // Align left score to the left of the position

    // Create player paddles
    paddles = this.physics.add.group();
    player1Paddle = paddles.create(paddleDistFromSides, resolution.height * 0.5, 'paddle');
    player2Paddle = paddles.create(resolution.width - paddleDistFromSides, resolution.height * 0.5, 'paddle');

    // Activate paddle collision with window boundaries
    player1Paddle.setCollideWorldBounds(true);
    player2Paddle.setCollideWorldBounds(true);

    // Prevent paddle to be moved by collision with ball
    player1Paddle.body.immovable = true;
    player2Paddle.body.immovable = true;

    // Create ball, initialize it and launch it
    ball = this.physics.add.sprite(resolution.width * 0.5, resolution.height * 0.5, 'ball');
    ball.setCollideWorldBounds(true); // This means the ball will collide with the window edges
    ball.setBounce(1, 1);
    ball.body.stopVelocityOnCollide = false;
    launchBall();

    // Add collision response for when ball collides with a paddle
    this.physics.add.collider(ball, paddles, ballPaddleCollision);
}

// Game logic while running the game
function update () {
    // Check player controls and update paddle movement if necessary
    updatePlayerControls();

    // Launch new ball when old one is gone
    if(ball.active === false) {
        resetBall();
    }

    // Check ball collision
    checkBallWallCollision();
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

function resetBall () {
    // Reset the ball by enabling the it again and resetting the position
    ball.enableBody(true, resolution.width * 0.5, resolution.height * 0.5, true, true);

    // Launch the newely reset ball
    launchBall();
}

function launchBall () {
    // Set random ball velocity
    let randomVelocity = {x:0, y:0};
    randomVelocity = Phaser.Math.RandomXY(randomVelocity, 200); // Get random velocity values between -200 and 200
    randomVelocity.x = (randomVelocity.x < 0) ? -200 : 200; // Set velocity x to a fixed starting value of -200 or 200

    ball.setVelocity(randomVelocity.x, randomVelocity.y);
}

function ballPaddleCollision (ballRef, paddleRef) {
    // Determine difference in angle between center of paddle and center of ball
    let yDiff = ballRef.y - paddleRef.y;

    // Add vertical velocity to ball based on the place it hit the paddle
    ballRef.body.velocity.y += yDiff * 5; // Multiply with a factor to enlarge the velocity change

    // Increase horizontal velocity with each paddle hit just for fun, with a max of 500
    if(ballRef.body.velocity.x < 500) {
        ballRef.body.velocity.x += (ballRef.body.velocity.x < 0) ? -10 : 10;
    }
}

function checkBallWallCollision () {
    // Reset ball if it is hitting left or right walls
    if(ball.body.onWall()) {
        // If ball hits left wall
        if(ball.body.left <= 0) {
            scoreRight += 1;
            scoreTextRight.setText(scoreRight);
        }
        // If ball hits right wall
        else {
            scoreLeft += 1;
            scoreTextLeft.setText(scoreLeft);
        }

        resetBall();
    }
}