import * as THREE from "three";
import Experience from "./Experience.js";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.time = this.experience.time;
    this.sizes = this.experience.sizes;
    this.webglElement = this.experience.webglElement;
    this.scene = this.experience.scene;
    this.setInstance();
  }

  setInstance = () => {
    // Set up
    this.instance = new THREE.PerspectiveCamera(
      20,
      this.config.width / this.config.height,
      0.1,
      1000
    );
    this.instance.rotation.reorder("YXZ");
    this.instance.position.set(-23, 17, 23);

    this.scene.add(this.instance);
  };

  resize = () => {
    this.instance.aspect = this.config.width / this.config.height;
    this.instance.updateProjectionMatrix();
  };

  update = () => {
    this.instance.updateProjectionMatrix();
  };
}
