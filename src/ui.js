export default class UI {
  constructor(game) {
    this.game = game;
  }

  update() {
    // UI doesn't need frequent updates
  }

  draw(context) {
    // Draw scores
    context.font = "24px Arial";
    context.fillStyle = "black";

    // Player score
    context.fillStyle = "darkgreen";
    context.fillText(`Player: ${this.game.playerScore}`, 20, 30);

    // CPU score
    context.fillStyle = "darkblue";
    context.fillText(
      `CPU: ${this.game.cpuScore}`,
      this.game.canvas.width - 120,
      30
    );

    // Draw pause indicator
    if (this.game.paused && !this.game.gameOver) {
      context.fillStyle = "rgba(0, 0, 0, 0.7)"; // Make background darker for better visibility
      context.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

      context.font = "48px Arial"; // Increase font size
      context.fillStyle = "white";
      context.textAlign = "center";
      context.fillText(
        "PAUSED",
        this.game.canvas.width / 2,
        this.game.canvas.height / 2
      );
      context.font = "24px Arial";
      context.fillText(
        "Press Start/Enter to continue",
        this.game.canvas.width / 2,
        this.game.canvas.height / 2 + 40
      );
      context.textAlign = "left";
    }

    // Draw game over screen
    if (this.game.gameOver) {
      context.fillStyle = "rgba(0, 0, 0, 0.7)";
      context.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

      context.font = "48px Arial";
      context.fillStyle = "white";
      context.textAlign = "center";
      context.fillText(
        "GAME OVER",
        this.game.canvas.width / 2,
        this.game.canvas.height / 2 - 50
      );

      // Determine winner
      let resultText = "It's a tie!";
      if (this.game.playerScore > this.game.cpuScore) {
        resultText = "Player wins!";
      } else if (this.game.cpuScore > this.game.playerScore) {
        resultText = "CPU wins!";
      }

      context.font = "36px Arial";
      context.fillText(
        resultText,
        this.game.canvas.width / 2,
        this.game.canvas.height / 2
      );

      // Score display
      context.font = "24px Arial";
      context.fillText(
        `Player: ${this.game.playerScore} - CPU: ${this.game.cpuScore}`,
        this.game.canvas.width / 2,
        this.game.canvas.height / 2 + 40
      );

      context.fillText(
        "Press Start/Enter to restart",
        this.game.canvas.width / 2,
        this.game.canvas.height / 2 + 80
      );

      context.textAlign = "left";
    }
  }
}
