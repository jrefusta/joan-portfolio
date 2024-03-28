import * as THREE from "three";
import Experience from "./Experience.js";

export default class Baked {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.renderer = this.experience.renderer.instance;
    this.setModel();
  }

  setMaterial = (object, material) => {
    object.traverse((_child) => {
      if (_child instanceof THREE.Mesh) {
        _child.material = material;
      }
    });
  };

  setModel = () => {
    this.model = {};
    this.model.room1 = this.resources.items._roomModel.scene;
    this.model.baked1 = this.resources.items._baked1;

    this.model.baked1.anisotropic =
      this.renderer.capabilities.getMaxAnisotropy();
    this.model.baked1.colorSpace = "srgb";
    this.model.baked1.needsUpdate = true;
    this.model.material = new THREE.MeshBasicMaterial({
      map: this.model.baked1,
      side: THREE.DoubleSide,
    });

    this.model.room2 = this.resources.items._roomModel2.scene;
    this.model.baked2 = this.resources.items._baked2;

    this.model.baked2.anisotropic =
      this.renderer.capabilities.getMaxAnisotropy();
    this.model.baked2.colorSpace = "srgb";
    this.model.baked2.needsUpdate = true;
    this.model.material2 = new THREE.MeshBasicMaterial({
      map: this.model.baked2,
    });

    this.model.room3 = this.resources.items._roomModel3.scene;
    this.model.baked3 = this.resources.items._baked3;

    this.model.baked3.anisotropic =
      this.renderer.capabilities.getMaxAnisotropy();
    this.model.baked3.colorSpace = "srgb";
    this.model.baked3.needsUpdate = true;
    this.model.material3 = new THREE.MeshBasicMaterial({
      map: this.model.baked3,
    });

    this.model.linkedin = this.resources.items.linkedin.scene;
    this.model.linkedin.name = "linkedin";
    this.model.github = this.resources.items.github.scene;
    this.model.github.name = "github";
    this.model.itchio = this.resources.items.itchio.scene;
    this.model.itchio.name = "itchio";
    this.setMaterial(this.model.room1, this.model.material);
    this.setMaterial(this.model.room2, this.model.material2);
    this.setMaterial(this.model.room3, this.model.material3);
    this.setMaterial(this.model.linkedin, this.model.material3);
    this.setMaterial(this.model.github, this.model.material3);
    this.setMaterial(this.model.itchio, this.model.material3);

    this.scene.add(this.model.room1);

    this.scene.add(this.model.room2);

    this.scene.add(this.model.room3);
    this.scene.add(this.model.linkedin);
    this.scene.add(this.model.github);
    this.scene.add(this.model.itchio);
  };
}
