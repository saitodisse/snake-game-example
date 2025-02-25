export default class GamepadController {
  constructor(game) {
    this.game = game;
    this.gamepad = null;
    this.prevButtons = {};
  }

  update() {
    // Get the gamepad
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    this.gamepad = gamepads[0];

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
      }
    }
  }
}
