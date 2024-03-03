import * as THREE from "three";

import Time from "./Utils/Time.js";
import Sizes from "./Utils/Sizes.js";
import Stats from "./Utils/Stats.js";

import Resources from "./Resources.js";
import Renderer from "./Renderer.js";
import Camera from "./Camera.js";
import World from "./World.js";
import Navigation from "./Navigation.js";

import assets from "./assets.js";

export default class Experience {
  static instance;

  constructor(_options = {}) {
    if (Experience.instance) {
      return Experience.instance;
    }
    Experience.instance = this;

    // Options
    this.webglElement = _options.webglElement;
    this.cssElement = _options.cssElement;
    this.cssElement1 = _options.cssElement1;
    this.cssElement2 = _options.cssElement2;

    if (!this.webglElement) {
      console.warn("Missing 'webglElement' property");
      return;
    }

    this.time = new Time();
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.sizes = new Sizes();
    this.mouse = new THREE.Vector2();
    this.setConfig();
    this.setStats();
    this.setScene();
    this.setCamera();
    this.setRenderer();
    this.setResources();
    this.setWorld();
    this.setNavigation();

    this.sizes.on("resize", () => {
      this.resize();
    });

    this.update();
  }

  setConfig() {
    this.config = {};

    // Pixel ratio
    this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2);

    // Width and height
    const boundings = this.webglElement.getBoundingClientRect();
    this.config.width = boundings.width;
    this.config.height = boundings.height || window.innerHeight;
    this.config.smallestSide = Math.min(this.config.width, this.config.height);
    this.config.largestSide = Math.max(this.config.width, this.config.height);
  }

  setStats() {
    this.stats = new Stats(true);
  }

  setScene() {
    this.scene = new THREE.Scene();
    this.cssScene = new THREE.Scene();
    this.cssScene1 = new THREE.Scene();
    this.cssScene2 = new THREE.Scene();
  }

  setCamera() {
    this.camera = new Camera();
  }

  setRenderer() {
    this.renderer = new Renderer({ rendererInstance: this.rendererInstance });
  }

  setResources() {
    this.resources = new Resources(assets);
  }

  setWorld() {
    this.world = new World();
  }

  setNavigation() {
    this.navigation = new Navigation();
  }

  update() {
    if (this.stats) this.stats.update();

    if (this.navigation) this.navigation.update();
    this.camera.update();

    if (this.renderer) this.renderer.update();

    if (this.world) this.world.update();

    window.requestAnimationFrame(() => {
      this.update();
    });
  }

  resize() {
    // Config
    const boundings = this.webglElement.getBoundingClientRect();
    this.config.width = boundings.width;
    this.config.height = boundings.height;
    this.config.smallestSide = Math.min(this.config.width, this.config.height);
    this.config.largestSide = Math.max(this.config.width, this.config.height);

    this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2);

    if (this.camera) this.camera.resize();

    if (this.renderer) this.renderer.resize();

    if (this.world) this.world.resize();
  }

  destroy() {}
}
