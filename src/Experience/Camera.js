import { PerspectiveCamera } from "three";
import Experience from "./Experience.js";
import { CAMERA_POSITION } from "./constants.js";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.setInstance();
  }

  setInstance = () => {
    // Set up
    this.instance = new PerspectiveCamera(
      20,
      this.config.width / this.config.height,
      0.1,
      1000
    );
    this.instance.rotation.reorder("YXZ");
    this.instance.position.copy(CAMERA_POSITION);

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
