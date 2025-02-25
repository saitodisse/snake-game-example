export default class SoundManager {
  constructor() {
    this.sounds = {};
    this.muted = false;

    this.loadSounds();
  }

  loadSounds() {
    // Define all the sounds used in the game
    this.load("eat", "assets/sounds/smack.wav");
    this.load("collision", "assets/sounds/incorrect_sfx.wav");
    this.load("gameOver-happy", "assets/sounds/crowd_cheer_sfx.wav");
    this.load("gameOver-sad", "assets/sounds/oh_no.wav");
    this.load("roundWin", "assets/sounds/victory_confetti.wav");
    this.load("roundLose", "assets/sounds/windowBreak.wav");
    this.load("pause", "assets/sounds/donk.wav");
    this.load("gameStart", "assets/sounds/chime1.wav");
    this.load("menuSelect", "assets/sounds/click_error.wav");
  }

  load(name, path) {
    this.sounds[name] = new Audio(path);
  }

  play(name) {
    if (!this.muted && this.sounds[name]) {
      // Clone the audio object to allow overlapping sounds
      const sound = this.sounds[name].cloneNode();
      sound.volume = 0.5; // Set a reasonable volume
      sound.play().catch((e) => console.log("Sound play error:", e));
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }
}
