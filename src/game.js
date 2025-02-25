import GamepadController from "./input/gamepadController.js";
import Snake from "./snake.js";
import Food from "./food.js";

export default class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    this.gamepadController = new GamepadController(this);
    this.lastTime = 0;
    this.gameObjects = [];
    this.init();
  }

  init() {
    // Initialize game objects
    const snake = new Snake(this);
    const food = new Food(this);

    this.gameObjects.push(snake);
    this.gameObjects.push(food);
  }

  update(deltaTime) {
    this.gameObjects.forEach((object) => object.update(deltaTime));
    this.gamepadController.update();
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
}
