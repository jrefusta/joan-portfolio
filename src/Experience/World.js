import * as THREE from "three";
import Experience from "./Experience.js";
import Baked from "./Baked.js";
import Baked2 from "./Baked2.js";
import Baked3 from "./Baked3.js";
import CoffeeSteam from "./CoffeeSteam.js";
import TopChair from "./TopChair.js";
import Screen from "./Screen.js";
import Whiteboard from "./Whiteboard.js";
import Carpet from "./Carpet.js";
import ArcadeScreen from "./ArcadeScreen.js";
import LeftMonitorScreen from "./LeftMonitorScreen.js";
import RightMonitorScreen from "./RightMonitorScreen.js";
import RubiksCube from "./RubiksCube.js";
import Skybox from "./Skybox.js";

export default class World {
  constructor(_options) {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.sceneRubik = this.experience.sceneRubik;
    this.resources = this.experience.resources;

    this.resources.on("groupEnd", (_group) => {
      if (_group.name === "base") {
        this.setBaked();
        this.setBaked2();
        this.setBaked3();
        this.setWhiteboard();
        this.setCarpet();
        this.setArcadeScreen();
        this.setLeftMonitorScreen();
        this.setRightMonitorScreen();
        this.setRubiksCube();
        this.setSkybox();
        //this.setGoogleLeds()
        //this.setLoupedeckButtons()
        this.setCoffeeSteam();
        //this.setTopChair()
        //this.setElgatoLight()
        //this.setBouncingLogo()
        //this.setScreens()
      }
    });
  }

  setBaked() {
    this.baked = new Baked();
  }

  setBaked2() {
    this.baked2 = new Baked2();
  }

  setBaked3() {
    this.baked3 = new Baked3();
  }

  setRubiksCube() {
    this.rubiksCube = new RubiksCube(
      //new THREE.Vector3(-0.62668, 1.52897, -3.85849),
      new THREE.Vector3(-0.67868, 1.499, -3.92849),
      //new THREE.Vector3(0, 0, 0),
      this.sceneRubik,
      this.experience.camera.instance
    );
    this.rubiksCube.newRubik.scale.set(0.021432, 0.021432, 0.021432);
  }

  setSkybox() {
    this.skybox = new Skybox();
  }

  setGoogleLeds() {
    this.googleLeds = new GoogleLeds();
  }

  setLoupedeckButtons() {
    this.loupedeckButtons = new LoupedeckButtons();
  }

  setCoffeeSteam() {
    this.coffeeSteam = new CoffeeSteam();
  }

  setTopChair() {
    this.topChair = new TopChair();
  }

  setElgatoLight() {
    this.elgatoLight = new ElgatoLight();
  }

  setBouncingLogo() {
    this.bouncingLogo = new BouncingLogo();
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

  setScreens() {
    this.pcScreen = new Screen(
      this.resources.items.pcScreenModel.scene.children[0],
      "/assets/videoPortfolio.mp4"
    );
    this.macScreen = new Screen(
      this.resources.items.macScreenModel.scene.children[0],
      "/assets/videoStream.mp4"
    );
  }

  resize() {}

  update() {
    if (this.googleLeds) this.googleLeds.update();

    if (this.loupedeckButtons) this.loupedeckButtons.update();

    if (this.coffeeSteam) this.coffeeSteam.update();

    if (this.topChair) this.topChair.update();
    if (this.rubiksCube) this.rubiksCube.update();
    if (this.skybox) this.skybox.update();

    if (this.bouncingLogo) this.bouncingLogo.update();
    if (this.whiteboard) this.whiteboard.update();
  }

  destroy() {}
}
