export default class Debug {
  constructor(game) {
    this.game = game;
    this.visible = false;
    this.toggleKey = "d";

    // Add keyboard listener for debug toggle
    document.addEventListener("keydown", (event) => {
      if (event.key === this.toggleKey) {
        this.visible = !this.visible;
      }
    });
  }

  update() {
    // Debug logic here if needed
  }

  draw(context) {
    if (!this.visible) return;

    // Background for debug info
    context.fillStyle = "rgba(0, 0, 0, 0.7)";
    context.fillRect(10, 10, 200, 120);

    // Draw debug info
    context.font = "14px Courier New";
    context.fillStyle = "lime";
    context.textAlign = "left";

    let y = 30;
    context.fillText(`Game Over: ${this.game.gameOver}`, 20, y);
    context.fillText(`Game Paused: ${this.game.paused}`, 20, (y += 20));
    context.fillText(`Player Score: ${this.game.playerScore}`, 20, (y += 20));
    context.fillText(`CPU Score: ${this.game.cpuScore}`, 20, (y += 20));

    const snake = this.game.gameObjects.find(
      (obj) => obj.constructor.name === "Snake"
    );
    if (snake) {
      context.fillText(
        `Direction: ${JSON.stringify(snake.direction)}`,
        20,
        (y += 20)
      );
    }
  }
}
