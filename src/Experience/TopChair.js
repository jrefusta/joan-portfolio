import Experience from "./Experience.js";
import { TOP_CHAIR_POSITION } from "./constants.js";
export default class TopChair {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.time = this.experience.time;
    this.materialTopChair = this.experience.world.baked.model.material2;
    this.setModel();
    this.startAnimation();
  }

  setModel() {
    this.model = {};

    this.model.group = this.resources.items.topChairModel.scene;
    this.model.group.position.copy(TOP_CHAIR_POSITION);
    this.scene.add(this.model.group);

    this.model.group.traverse((child) => {
      if (child.isMesh) {
        child.material = this.materialTopChair;
      }
    });
  }

  startAnimation() {
    this.startTime = Date.now();
    this.update();
  }
  
  update() {
    if (!this.startTime) {
      return;
    }
    const currentTime = Date.now();
    const elapsedTime = currentTime - this.startTime;
    this.model.group.rotation.y = Math.sin(elapsedTime * 0.0003) * 0.5;
  }
}
