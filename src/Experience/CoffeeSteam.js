import { ShaderMaterial, Mesh, RepeatWrapping, DoubleSide } from "three";

import Experience from "./Experience.js";
import vertexShader from "./shaders/coffeeSteam/vertex.glsl";
import fragmentShader from "./shaders/coffeeSteam/fragment.glsl";

import { COFFEE_GEOMETRY, COFFEE_POSITION } from "./constants.js";

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
    this.model.perlinTexture = this.resources.items.perlin;
    this.model.perlinTexture.wrapS = RepeatWrapping;
    this.model.perlinTexture.wrapT = RepeatWrapping;

    // Material
    this.model.material = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPerlinTexture: { value: this.resources.items.perlin },
      },
    });

    // Mesh
    this.planeGeom = COFFEE_GEOMETRY;
    this.model.mesh = new Mesh(this.planeGeom, this.model.material);
    this.model.mesh.position.copy(COFFEE_POSITION);
    this.model.mesh.name = "coffeeSteam";
    this.scene.add(this.model.mesh);
  };

  update = () => {
    const elapsedTime = this.experience.clock.getElapsedTime();
    this.model.material.uniforms.uTime.value = elapsedTime;
  };
}
