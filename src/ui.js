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
    context.fillText(
      `Player: ${this.game.playerScore}/${this.game.winningScore}`,
      20,
      30
    );

    // CPU score
    context.fillStyle = "darkblue";
    context.fillText(
      `CPU: ${this.game.cpuScore}/${this.game.winningScore}`,
      this.game.canvas.width - 160,
      30
    );

    // Sound status indicator
    context.font = "16px Arial";
    context.fillStyle = "black";
    const soundText = this.game.soundManager.isMuted()
      ? "🔇 Muted (M)"
      : "🔊 Sound On (M)";
    context.fillText(
      soundText,
      this.game.canvas.width - 120,
      this.game.canvas.height - 20
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
        this.game.canvas.height / 2 - 80
      );

      // Determine winner
      let resultText = "It's a tie!";
      if (this.game.gameWinner === "player") {
        resultText = "Player wins the game!";
      } else if (this.game.gameWinner === "cpu") {
        resultText = "CPU wins the game!";
      }

      context.font = "40px Arial";
      context.fillText(
        resultText,
        this.game.canvas.width / 2,
        this.game.canvas.height / 2 - 20
      );

      // Score display
      context.font = "30px Arial";
      context.fillText(
        `Final Score: Player ${this.game.playerScore} - CPU ${this.game.cpuScore}`,
        this.game.canvas.width / 2,
        this.game.canvas.height / 2 + 30
      );

      context.font = "24px Arial";
      context.fillText(
        "First to 10 points wins!",
        this.game.canvas.width / 2,
        this.game.canvas.height / 2 + 70
      );

      context.fillText(
        "Press Start/Enter to play again",
        this.game.canvas.width / 2,
        this.game.canvas.height / 2 + 110
      );

      context.textAlign = "left";
    }
  }
}
