import * as THREE from "three";

import Experience from "./Experience.js";

export default class TopChair {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.time = this.experience.time;

    this.setModel();
  }

  setModel() {
    this.model = {};

    this.model.group = this.resources.items.topChairModel.scene;
    this.model.group.position.set(1.4027, 0.496728, -1.21048);
    this.scene.add(this.model.group);

    this.model.group.traverse((_child) => {
      if (_child instanceof THREE.Mesh) {
        _child.material = this.world.baked.model.material2;
      }
    });
  }

  update() {
    this.model.group.rotation.y = Math.sin(this.time.elapsed * 0.0003) * 0.5;
  }
}
