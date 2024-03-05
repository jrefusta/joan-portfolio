import * as THREE from "three";

import Experience from "./Experience.js";
import vertexShader from "./shaders/coffeeSteam/vertex.glsl";
import fragmentShader from "./shaders/coffeeSteam/fragment.glsl";

export default class CoffeeSteam {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.setModel();
  }

  setModel = () => {
    this.model = {};

    this.model.color = "#d1d1d1";
    this.model.perlinTexture = this.resources.items.perlin;
    this.model.perlinTexture.wrapS = THREE.RepeatWrapping;
    this.model.perlinTexture.wrapT = THREE.RepeatWrapping;
    // Material
    this.model.material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPerlinTexture: { value: this.resources.items.perlin },
      },
    });

    // Mesh
    this.planeGeom = new THREE.PlaneGeometry(0.15, 0.6, 16, 64);
    this.model.mesh = new THREE.Mesh(this.planeGeom, this.model.material);
    this.model.mesh.position.set(0.230979, 2.3, -3.64951);
    this.model.mesh2 = new THREE.Mesh(this.planeGeom, this.model.material);
    this.model.mesh2.rotateY(-Math.PI / 2);
    this.model.mesh2.position.set(0.234979, 2.1, -3.64951);
    this.scene.add(this.model.mesh);
    //this.scene.add(this.model.mesh2);
  };

  update = () => {
    const elapsedTime = this.experience.clock.getElapsedTime();
    this.model.material.uniforms.uTime.value = elapsedTime;
  };
}
