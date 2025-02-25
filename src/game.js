import GamepadController from "./input/gamepadController.js";
import Snake from "./snake.js";
import CPUSnake from "./cpuSnake.js";
import Food from "./food.js";
import UI from "./ui.js";
import SoundManager from "./soundManager.js";

export default class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    this.gamepadController = new GamepadController(this);
    this.lastTime = 0;
    this.gameObjects = [];

    // Initialize sound manager
    this.soundManager = new SoundManager();

    // Game state
    this.paused = false;
    this.gameOver = false;
    this.roundOver = false;
    this.playerScore = 0;
    this.cpuScore = 0;
    this.winningScore = 10;
    this.roundWinner = null;
    this.gameWinner = null;

    this.init();
  }

  init() {
    // Initialize game objects
    const snake = new Snake(this);
    const cpuSnake = new CPUSnake(this);
    const food = new Food(this);
    const ui = new UI(this);

    this.gameObjects.push(snake);
    this.gameObjects.push(cpuSnake);
    this.gameObjects.push(food);
    this.gameObjects.push(ui);

    // Play game start sound
    this.soundManager.play("gameStart");
  }

  update(deltaTime) {
    this.gamepadController.update(deltaTime); // Pass deltaTime to gamepadController

    // Check for winner
    if (this.playerScore >= this.winningScore) {
      if (!this.gameOver) {
        this.soundManager.play("gameOver-happy");
      }
      this.gameOver = true;
      this.gameWinner = "player";
    } else if (this.cpuScore >= this.winningScore) {
      if (!this.gameOver) {
        this.soundManager.play("gameOver-sad");
      }
      this.gameOver = true;
      this.gameWinner = "cpu";
    }

    // Only update game objects if not paused
    if (!this.paused || this.gameOver || this.roundOver) {
      this.gameObjects.forEach((object) => {
        if (
          object.constructor.name === "UI" ||
          this.gameOver ||
          this.roundOver ||
          !this.paused
        ) {
          object.update(deltaTime);
        }
      });
    }
  }

  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.gameObjects.forEach((object) => object.draw(this.context));
  }

  start() {
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  gameLoop(timestamp) {
    const deltaTime = timestamp - this.lastTime;
    this.update(deltaTime);
    this.draw();
    this.lastTime = timestamp;
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  endRound(winner) {
    this.roundOver = true;
    this.roundWinner = winner;

    // Play appropriate sounds
    if (winner === "player") {
      this.soundManager.play("roundWin");
    } else if (winner === "cpu") {
      this.soundManager.play("roundLose");
    }
  }

  startNewRound() {
    console.log("Starting new round");
    this.roundOver = false;
    this.roundWinner = null;

    // Play menu select sound
    this.soundManager.play("menuSelect");

    // Reset all game objects but keep scores
    const snake = this.gameObjects.find(
      (obj) => obj.constructor.name === "Snake"
    );
    const cpuSnake = this.gameObjects.find(
      (obj) => obj.constructor.name === "CPUSnake"
    );
    const food = this.gameObjects.find(
      (obj) => obj.constructor.name === "Food"
    );

    if (snake) snake.reset();
    if (cpuSnake) cpuSnake.reset();
    if (food) food.relocate();
  }

  restart() {
    console.log("Restarting game");
    this.gameOver = false;
    this.roundOver = false;
    this.paused = false;
    this.playerScore = 0;
    this.cpuScore = 0;
    this.roundWinner = null;
    this.gameWinner = null;

    // Play game start sound
    this.soundManager.play("gameStart");

    // Reset all game objects
    const snake = this.gameObjects.find(
      (obj) => obj.constructor.name === "Snake"
    );
    const cpuSnake = this.gameObjects.find(
      (obj) => obj.constructor.name === "CPUSnake"
    );
    const food = this.gameObjects.find(
      (obj) => obj.constructor.name === "Food"
    );

    if (snake) snake.reset();
    if (cpuSnake) cpuSnake.reset();
    if (food) food.relocate();
  }

  toggleSound() {
    return this.soundManager.toggleMute();
  }
}
