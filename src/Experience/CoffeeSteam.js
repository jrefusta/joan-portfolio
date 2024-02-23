import * as THREE from "three";

import Experience from "./Experience.js";
import vertexShader from "./shaders/coffeeSteam/vertex.glsl";
import fragmentShader from "./shaders/coffeeSteam/fragment.glsl";

export default class CoffeeSteam {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.setModel();
  }

  setModel() {
    this.model = {};

    this.model.color = "#d1d1d1";

    // Material
    this.model.material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uTimeFrequency: { value: 0.001 },
        uUvFrequency: { value: new THREE.Vector2(3, 5) },
        uColor: { value: new THREE.Color(this.model.color) },
      },
    });

    // Mesh
    this.planeGeom = new THREE.PlaneGeometry(0.2, 0.7);
    this.model.mesh = new THREE.Mesh(this.planeGeom, this.model.material);
    this.model.mesh.position.set(0.234979, 2.1, -3.64951);
    this.model.mesh2 = new THREE.Mesh(this.planeGeom, this.model.material);
    this.model.mesh2.rotateY(-Math.PI / 2);
    this.model.mesh2.position.set(0.234979, 2.1, -3.64951);
    this.scene.add(this.model.mesh2);
    this.scene.add(this.model.mesh);
  }

  update() {
    this.model.material.uniforms.uTime.value = this.time.elapsed;
  }
}
