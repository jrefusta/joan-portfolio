import Experience from "./Experience.js";
import Baked from "./Baked.js";
import CoffeeSteam from "./CoffeeSteam.js";
import TopChair from "./TopChair.js";
import Whiteboard from "./Whiteboard.js";
import Carpet from "./Carpet.js";
import ArcadeScreen from "./ArcadeScreen.js";
import LeftMonitorScreen from "./LeftMonitorScreen.js";
import RightMonitorScreen from "./RightMonitorScreen.js";
import RubiksCube from "./RubiksCube.js";
import Skybox from "./Skybox.js";
import Confetti from "./Confetti.js";
import AudioManager from "./AudioManager.js";

import { RUBIK_POSITION, RUBIK_SCALE } from "./constants.js";

export default class World {
  constructor(_options) {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on("groupEnd", (_group) => {
      if (_group.name === "base") {
        this.setAudioManager();
        this.setBaked();
        this.setWhiteboard();
        this.setCarpet();
        this.setArcadeScreen();
        this.setLeftMonitorScreen();
        this.setRightMonitorScreen();
        this.setTopChair();
        this.setSkybox();
        this.setConfetti();
        this.setCoffeeSteam();
        this.setRubiksCube();
      }
    });
  }

  setBaked() {
    this.baked = new Baked();
  }

  setRubiksCube() {
    this.rubiksCube = new RubiksCube(RUBIK_POSITION, RUBIK_SCALE);
  }

  setSkybox() {
    this.skybox = new Skybox();
  }

  setCoffeeSteam() {
    this.coffeeSteam = new CoffeeSteam();
  }

  setTopChair() {
    this.topChair = new TopChair();
  }

  setConfetti() {
    this.confetti = new Confetti();
  }

  setWhiteboard() {
    this.whiteboard = new Whiteboard();
  }

  setCarpet() {
    this.carpet = new Carpet();
  }

  setArcadeScreen() {
    this.arcadeScreen = new ArcadeScreen();
  }

  setLeftMonitorScreen() {
    this.leftMonitorScreen = new LeftMonitorScreen();
  }

  setRightMonitorScreen() {
    this.rightMonitorScreen = new RightMonitorScreen();
  }
  setAudioManager() {
    this.audioManager = new AudioManager();
  }

  resize() {}

  update() {
    if (this.coffeeSteam) this.coffeeSteam.update();
    if (this.topChair) this.topChair.update();
    if (this.rubiksCube) this.rubiksCube.update();
    if (this.skybox) this.skybox.update();
    if (this.leftMonitorScreen) this.leftMonitorScreen.update();
    if (this.rightMonitorScreen) this.rightMonitorScreen.update();
    if (this.confetti) this.confetti.update();
    if (this.whiteboard) this.whiteboard.update();
  }

  destroy() {}
}
