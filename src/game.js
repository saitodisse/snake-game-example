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
    this.playerScore = 0;
    this.cpuScore = 0;
    this.winningScore = 10;
    this.gameWinner = null;
    
    // Adicionar estados para o power-up de velocidade
    this.playerSpeedBoost = false;
    this.cpuSpeedBoost = false;
    this.playerSpeedTimer = 0;
    this.cpuSpeedTimer = 0;
    this.speedBoostDuration = 2000; // 2 segundos em milissegundos

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
    this.gamepadController.update(deltaTime);

    // Atualizar os timers de velocidade
    if (this.playerSpeedBoost) {
      this.playerSpeedTimer += deltaTime;
      if (this.playerSpeedTimer >= this.speedBoostDuration) {
        this.playerSpeedBoost = false;
        this.playerSpeedTimer = 0;
        
        // Resetar a velocidade do jogador
        const snake = this.gameObjects.find(
          (obj) => obj.constructor.name === "Snake"
        );
        if (snake) snake.resetSpeed();
      }
    }
    
    if (this.cpuSpeedBoost) {
      this.cpuSpeedTimer += deltaTime;
      if (this.cpuSpeedTimer >= this.speedBoostDuration) {
        this.cpuSpeedBoost = false;
        this.cpuSpeedTimer = 0;
        
        // Resetar a velocidade da CPU
        const cpuSnake = this.gameObjects.find(
          (obj) => obj.constructor.name === "CPUSnake"
        );
        if (cpuSnake) cpuSnake.resetSpeed();
      }
    }

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
    if (!this.paused || this.gameOver) {
      this.gameObjects.forEach((object) => {
        if (
          object.constructor.name === "UI" ||
          this.gameOver ||
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

  endGame(winner) {
    this.gameOver = true;
    this.gameWinner = winner;

    // Play appropriate sounds
    if (winner === "player") {
      this.soundManager.play("gameOver-happy");
    } else if (winner === "cpu") {
      this.soundManager.play("gameOver-sad");
    }
  }

  restart() {
    console.log("Restarting game");
    this.gameOver = false;
    this.paused = false;
    this.playerScore = 0;
    this.cpuScore = 0;
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

  activatePlayerSpeedBoost() {
    this.playerSpeedBoost = true;
    this.playerSpeedTimer = 0;
    
    const snake = this.gameObjects.find(
      (obj) => obj.constructor.name === "Snake"
    );
    if (snake) snake.boostSpeed();
    
    // Tocar um som de power-up (opcional)
    this.soundManager.play("eat");
  }
  
  activateCPUSpeedBoost() {
    this.cpuSpeedBoost = true;
    this.cpuSpeedTimer = 0;
    
    const cpuSnake = this.gameObjects.find(
      (obj) => obj.constructor.name === "CPUSnake"
    );
    if (cpuSnake) cpuSnake.boostSpeed();
    
    // Tocar um som de power-up (opcional)
    this.soundManager.play("eat");
  }
}
