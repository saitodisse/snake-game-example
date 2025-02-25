export default class CPUSnake {
  constructor(game) {
    this.game = game;
    this.size = 20; // size of each segment
    this.speed = 200; // pixels per second
    this.movementTimer = 0;
    this.moveInterval = 180; // slightly slower than player

    // Starting with 3 segments at a different location
    this.segments = [
      { x: 100, y: 100 },
      { x: 100, y: 120 },
      { x: 100, y: 140 },
    ];

    this.direction = { x: 0, y: -1 }; // moving up initially
  }

  update(deltaTime) {
    if (this.game.gameOver || this.game.paused || this.game.roundOver) return;

    this.movementTimer += deltaTime;

    // Move the snake at fixed intervals
    if (this.movementTimer >= this.moveInterval) {
      this.movementTimer = 0;

      // Find the food
      const food = this.game.gameObjects.find(
        (obj) => obj.constructor.name === "Food"
      );

      if (food) {
        this.chaseFood(food);
      }

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
        this.game.endRound("player");
        return;
      }

      // Check for self-collision
      for (let i = 0; i < this.segments.length; i++) {
        if (head.x === this.segments[i].x && head.y === this.segments[i].y) {
          this.game.endRound("player");
          return;
        }
      }

      // Check for collision with player snake
      const playerSnake = this.game.gameObjects.find(
        (obj) => obj.constructor.name === "Snake"
      );
      if (playerSnake) {
        for (const segment of playerSnake.segments) {
          if (head.x === segment.x && head.y === segment.y) {
            this.game.endRound("player");
            return;
          }
        }
      }

      // Add new head to the beginning
      this.segments.unshift(head);

      // Check if snake ate food
      if (food && head.x === food.position.x && head.y === food.position.y) {
        this.game.cpuScore++;
        food.relocate();
      } else {
        // Remove tail if no food was eaten
        this.segments.pop();
      }
    }
  }

  chaseFood(food) {
    const head = this.segments[0];
    const distX = food.position.x - head.x;
    const distY = food.position.y - head.y;

    // Determine primary direction to move (horizontal or vertical)
    let possibleDirections = [];

    // Simple AI that tries to move toward food
    // First check if we can move horizontally toward food
    if (distX > 0 && this.isSafeDirection(1, 0)) {
      possibleDirections.push({ x: 1, y: 0 });
    } else if (distX < 0 && this.isSafeDirection(-1, 0)) {
      possibleDirections.push({ x: -1, y: 0 });
    }

    // Then check if we can move vertically toward food
    if (distY > 0 && this.isSafeDirection(0, 1)) {
      possibleDirections.push({ x: 0, y: 1 });
    } else if (distY < 0 && this.isSafeDirection(0, -1)) {
      possibleDirections.push({ x: 0, y: -1 });
    }

    // If we have safe directions that move toward food, choose the best one
    if (possibleDirections.length > 0) {
      // Prefer the direction that gets us closer to food
      if (Math.abs(distX) > Math.abs(distY)) {
        // Horizontal distance is greater, prefer horizontal movement
        const horizontalDir = possibleDirections.find((dir) => dir.x !== 0);
        if (horizontalDir) {
          this.direction = horizontalDir;
          return;
        }
      } else {
        // Vertical distance is greater, prefer vertical movement
        const verticalDir = possibleDirections.find((dir) => dir.y !== 0);
        if (verticalDir) {
          this.direction = verticalDir;
          return;
        }
      }

      // If we can't move in the preferred direction, use any safe direction
      this.direction = possibleDirections[0];
    } else {
      // If we can't move directly toward food, try any safe direction
      const allDirections = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
      ];

      for (const dir of allDirections) {
        if (this.isSafeDirection(dir.x, dir.y)) {
          this.direction = dir;
          return;
        }
      }
    }
  }

  isSafeDirection(dirX, dirY) {
    // Don't allow 180-degree turns
    if (this.direction.x === -dirX && this.direction.y === -dirY) {
      return false;
    }

    const head = this.segments[0];
    const newX = head.x + dirX * this.size;
    const newY = head.y + dirY * this.size;

    // Check wall collision
    if (
      newX < 0 ||
      newX >= this.game.canvas.width ||
      newY < 0 ||
      newY >= this.game.canvas.height
    ) {
      return false;
    }

    // Check self collision
    for (const segment of this.segments) {
      if (newX === segment.x && newY === segment.y) {
        return false;
      }
    }

    // Check player snake collision
    const playerSnake = this.game.gameObjects.find(
      (obj) => obj.constructor.name === "Snake"
    );
    if (playerSnake) {
      for (const segment of playerSnake.segments) {
        if (newX === segment.x && newY === segment.y) {
          return false;
        }
      }
    }

    return true;
  }

  draw(context) {
    context.fillStyle = "blue";

    // Draw the head
    context.fillStyle = "darkblue";
    context.fillRect(
      this.segments[0].x,
      this.segments[0].y,
      this.size,
      this.size
    );

    // Draw the body
    context.fillStyle = "blue";
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
      { x: 100, y: 100 },
      { x: 100, y: 120 },
      { x: 100, y: 140 },
    ];
    this.direction = { x: 0, y: -1 };
  }
}
