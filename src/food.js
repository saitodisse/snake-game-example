export default class Food {
  constructor(game) {
    this.game = game;
    this.size = 20;
    this.position = { x: 0, y: 0 };
    this.relocate();
  }

  relocate() {
    // Calculate grid positions based on canvas and food size
    const gridWidth = Math.floor(this.game.canvas.width / this.size);
    const gridHeight = Math.floor(this.game.canvas.height / this.size);

    // Choose random position on the grid
    const x = Math.floor(Math.random() * gridWidth) * this.size;
    const y = Math.floor(Math.random() * gridHeight) * this.size;

    this.position = { x, y };

    // Make sure food doesn't appear on the snake
    const snake = this.game.gameObjects.find(
      (obj) => obj.constructor.name === "Snake"
    );
    if (snake) {
      const isOnSnake = snake.segments.some(
        (segment) =>
          segment.x === this.position.x && segment.y === this.position.y
      );

      if (isOnSnake) {
        this.relocate(); // try again if it spawned on the snake
      }
    }
  }

  update() {
    // Food doesn't need to update every frame
  }

  draw(context) {
    context.fillStyle = "red";
    context.fillRect(this.position.x, this.position.y, this.size, this.size);
  }
}
