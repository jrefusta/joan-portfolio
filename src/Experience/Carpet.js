import { Group, ShaderMaterial, DoubleSide, PlaneGeometry, Mesh } from "three";

import Experience from "./Experience.js";
import fragmentShaderCarpet from "./shaders/shellTexturingCarpet/fragment.glsl";
import vertexShaderCarpet from "./shaders/shellTexturingCarpet/vertex.glsl";
import {
  CARPET_UNIFORMS,
  CARPET_SHELLCOUNT,
  CARPET_GROUP_SCALE,
  CARPET_GROUP_POSITION,
  CARPET_GROUP_ROTATION,
} from "./constants.js";

export default class Carpet {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.carpetGroup = new Group();
    this.setCarpet();
  }

  setCarpet() {
    const shellCount = CARPET_SHELLCOUNT;
    for (let i = 0; i < shellCount; ++i) {
      const shaderMaterial = new ShaderMaterial({
        vertexShader: vertexShaderCarpet,
        fragmentShader: fragmentShaderCarpet,
        side: DoubleSide,
        uniforms: {
          uColor: {
            value: CARPET_UNIFORMS.uColor,
          },
          uShellCount: { value: CARPET_UNIFORMS.uShellCount },
          uShellIndex: { value: i },
          uShellLength: { value: CARPET_UNIFORMS.uShellLength },
          uDensity: { value: CARPET_UNIFORMS.uDensity },
          uThickness: { value: CARPET_UNIFORMS.uThickness },
        },
      });

      const planeGeom = new PlaneGeometry(100, 100);
      const planeMesh = new Mesh(planeGeom, shaderMaterial);
      planeMesh.rotation.copy(CARPET_GROUP_ROTATION);
      planeMesh.position.y = -10 + i * 0.1;
      planeMesh.receiveShadow = true;
      planeMesh.castShadow = true;
      this.carpetGroup.add(planeMesh);
    }
    this.carpetGroup.name = "Carpet";
    this.carpetGroup.scale.copy(CARPET_GROUP_SCALE);
    this.carpetGroup.position.copy(CARPET_GROUP_POSITION);
    this.scene.add(this.carpetGroup);
  }
}
