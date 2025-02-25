export default class Snake {
  constructor(game) {
    this.game = game;
    this.size = 20; // size of each segment
    this.speed = 200; // pixels per second
    this.movementTimer = 0;
    this.moveInterval = 150; // move every 150ms

    // Starting with 3 segments at the center
    this.segments = [
      { x: 300, y: 300 },
      { x: 280, y: 300 },
      { x: 260, y: 300 },
    ];

    this.direction = { x: 1, y: 0 }; // moving right initially
    this.nextDirection = { x: 1, y: 0 };

    // Set up keyboard controls
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  handleKeyDown(event) {
    switch (event.key) {
      case "ArrowUp":
        if (this.direction.y !== 1) this.nextDirection = { x: 0, y: -1 };
        break;
      case "ArrowDown":
        if (this.direction.y !== -1) this.nextDirection = { x: 0, y: 1 };
        break;
      case "ArrowLeft":
        if (this.direction.x !== 1) this.nextDirection = { x: -1, y: 0 };
        break;
      case "ArrowRight":
        if (this.direction.x !== -1) this.nextDirection = { x: 1, y: 0 };
        break;
    }
  }

  update(deltaTime) {
    this.movementTimer += deltaTime;

    // Move the snake at fixed intervals
    if (this.movementTimer >= this.moveInterval) {
      this.movementTimer = 0;

      // Update direction
      this.direction = this.nextDirection;

      // Create new head position
      const head = { ...this.segments[0] };
      head.x += this.direction.x * this.size;
      head.y += this.direction.y * this.size;

      // Check for collisions with walls
      if (
        head.x < 0 ||
        head.x >= this.game.canvas.width ||
        head.y < 0 ||
        head.y >= this.game.canvas.height
      ) {
        this.reset();
        return;
      }

      // Check for self-collision
      for (let i = 0; i < this.segments.length; i++) {
        if (head.x === this.segments[i].x && head.y === this.segments[i].y) {
          this.reset();
          return;
        }
      }

      // Add new head to the beginning
      this.segments.unshift(head);

      // Check if snake ate food
      const food = this.game.gameObjects.find(
        (obj) => obj.constructor.name === "Food"
      );
      if (food && head.x === food.position.x && head.y === food.position.y) {
        food.relocate();
      } else {
        // Remove tail if no food was eaten
        this.segments.pop();
      }
    }
  }

  draw(context) {
    context.fillStyle = "green";

    // Draw the head
    context.fillStyle = "darkgreen";
    context.fillRect(
      this.segments[0].x,
      this.segments[0].y,
      this.size,
      this.size
    );

    // Draw the body
    context.fillStyle = "green";
    for (let i = 1; i < this.segments.length; i++) {
      context.fillRect(
        this.segments[i].x,
        this.segments[i].y,
        this.size,
        this.size
      );
    }
  }

  reset() {
    this.segments = [
      { x: 300, y: 300 },
      { x: 280, y: 300 },
      { x: 260, y: 300 },
    ];
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
  }
}
