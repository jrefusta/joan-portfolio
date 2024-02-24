import * as THREE from "three";

import Experience from "./Experience.js";
import fragmentShaderCarpet from "./shaders/shellTexturingCarpet/fragment.glsl";
import vertexShaderCarpet from "./shaders/shellTexturingCarpet/vertex.glsl";

export default class Carpet {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.time = this.experience.time;
    this.carpetGroup = new THREE.Group();
    this.setCarpet();
  }

  setCarpet() {
    const shellCount = 64;
    for (let i = 0; i < shellCount; ++i) {
      // Crear el ShaderMaterial
      const shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShaderCarpet,
        fragmentShader: fragmentShaderCarpet,
        side: THREE.DoubleSide,
        uniforms: {
          shellCount: { value: shellCount },
          shellIndex: { value: i },
          shellLength: { value: 0.16 },
          density: { value: 250 },
          thickness: { value: 5 },
        },
      });

      // Crear el plano
      const planeGeom = new THREE.PlaneGeometry(100, 100);
      const planeMesh = new THREE.Mesh(planeGeom, shaderMaterial);
      planeMesh.rotation.x = -Math.PI / 2;
      planeMesh.position.y = -10 + i * 0.05;
      planeMesh.receiveShadow = true;
      planeMesh.castShadow = true;
      this.carpetGroup.add(planeMesh);
    }
    this.carpetGroup.scale.set(0.0355, 0.0355, 0.0355);
    this.carpetGroup.position.set(-2.61408, 0.36, -0.904327);
    this.scene.add(this.carpetGroup);
  }
}
