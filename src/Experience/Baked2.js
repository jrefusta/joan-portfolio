import * as THREE from "three";

import Experience from "./Experience.js";
import vertexShader from "./shaders/baked/vertex.glsl";
import fragmentShader from "./shaders/baked/fragment.glsl";

export default class Baked2 {
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

    this.model.mesh = this.resources.items.roomModel2.scene; //.children[0];

    this.model.bakedDayTexture = this.resources.items.bakedDayTexture2;
    this.model.bakedDayTexture.flipY = false;
    this.model.bakedDayTexture.encoding = THREE.SRGBColorSpace;
    /* 
    this.model.bakedNightTexture = this.resources.items.bakedNightTexture;
    this.model.bakedNightTexture.encoding = THREE.SRGBColorSpace;
    this.model.bakedNightTexture.flipY = false;

    this.model.bakedNeutralTexture = this.resources.items.bakedNeutralTexture;
    this.model.bakedNeutralTexture.encoding = THREE.SRGBColorSpace;
    this.model.bakedNeutralTexture.flipY = false;

    this.model.lightMapTexture = this.resources.items.lightMapTexture;
    this.model.lightMapTexture.flipY = false; */

    this.colors = {};
    this.colors.tv = "#ff115e";
    this.colors.desk = "#ff6700";
    this.colors.pc = "#0082ff";

    this.model.material = new THREE.ShaderMaterial({
      uniforms: {
        uBakedDayTexture: { value: this.model.bakedDayTexture },
        uBakedNightTexture: { value: this.model.bakedNightTexture },
        uBakedNeutralTexture: { value: this.model.bakedNeutralTexture },
        uLightMapTexture: { value: this.model.lightMapTexture },

        uNightMix: { value: 1 },
        uNeutralMix: { value: 0 },

        uLightTvColor: { value: new THREE.Color(this.colors.tv) },
        uLightTvStrength: { value: 1.47 },

        uLightDeskColor: { value: new THREE.Color(this.colors.desk) },
        uLightDeskStrength: { value: 1.9 },

        uLightPcColor: { value: new THREE.Color(this.colors.pc) },
        uLightPcStrength: { value: 1.4 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
    this.model.mesh.traverse((_child) => {
      if (_child instanceof THREE.Mesh) {
        _child.material = this.model.material;
      }
    });

    this.scene.add(this.model.mesh);
  }
}
