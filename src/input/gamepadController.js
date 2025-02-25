export default class GamepadController {
  constructor(game) {
    this.game = game;
    this.gamepad = null;
    this.prevButtons = {};
    this.startButtonPressed = false;
    this.buttonCooldown = 0; // Add cooldown to prevent multiple toggles
  }

  update(deltaTime) {
    // Get the gamepad
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    this.gamepad = gamepads[0];

    // Reduce cooldown if active
    if (this.buttonCooldown > 0) {
      this.buttonCooldown -= deltaTime;
    }

    if (this.gamepad) {
      // Handle gamepad input
      const snake = this.game.gameObjects.find(
        (obj) => obj.constructor.name === "Snake"
      );

      if (snake) {
        // D-pad controls
        if (this.gamepad.buttons[12].pressed && snake.direction.y !== 1) {
          snake.nextDirection = { x: 0, y: -1 }; // Up
        } else if (
          this.gamepad.buttons[13].pressed &&
          snake.direction.y !== -1
        ) {
          snake.nextDirection = { x: 0, y: 1 }; // Down
        } else if (
          this.gamepad.buttons[14].pressed &&
          snake.direction.x !== 1
        ) {
          snake.nextDirection = { x: -1, y: 0 }; // Left
        } else if (
          this.gamepad.buttons[15].pressed &&
          snake.direction.x !== -1
        ) {
          snake.nextDirection = { x: 1, y: 0 }; // Right
        }

        // Analog stick controls
        const threshold = 0.5;
        if (
          Math.abs(this.gamepad.axes[0]) > threshold ||
          Math.abs(this.gamepad.axes[1]) > threshold
        ) {
          if (Math.abs(this.gamepad.axes[0]) > Math.abs(this.gamepad.axes[1])) {
            // Horizontal movement is stronger
            if (this.gamepad.axes[0] < -threshold && snake.direction.x !== 1) {
              snake.nextDirection = { x: -1, y: 0 }; // Left
            } else if (
              this.gamepad.axes[0] > threshold &&
              snake.direction.x !== -1
            ) {
              snake.nextDirection = { x: 1, y: 0 }; // Right
            }
          } else {
            // Vertical movement is stronger
            if (this.gamepad.axes[1] < -threshold && snake.direction.y !== 1) {
              snake.nextDirection = { x: 0, y: -1 }; // Up
            } else if (
              this.gamepad.axes[1] > threshold &&
              snake.direction.y !== -1
            ) {
              snake.nextDirection = { x: 0, y: 1 }; // Down
            }
          }
        }

        // Start button for pause/restart
        // Button 9 is typically the "start" button
        if (
          this.gamepad.buttons[9].pressed &&
          !this.startButtonPressed &&
          this.buttonCooldown <= 0
        ) {
          this.startButtonPressed = true;
          this.buttonCooldown = 300; // 300ms cooldown to prevent multiple toggles

          if (this.game.gameOver) {
            this.game.restart();
            console.log("Game restarted via gamepad");
          } else {
            this.game.paused = !this.game.paused;
            console.log("Game paused via gamepad:", this.game.paused);
          }
        } else if (!this.gamepad.buttons[9].pressed) {
          this.startButtonPressed = false;
        }
      }
    }
  }
}
