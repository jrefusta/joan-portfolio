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

  update() {
    this.model.group.rotation.y = Math.sin(this.time.elapsed * 0.0003) * 0.5;
  }
}
