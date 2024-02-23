import * as THREE from "three";
import Experience from "./Experience.js";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";

export default class LeftMonitorScreen {
  constructor() {
    this.experience = new Experience();
    this.webglElement = this.experience.webglElement;
    this.cssScene1 = this.experience.cssScene1;
    this.cssScene2 = this.experience.cssScene2;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.renderer = this.experience.renderer;
    this.camera = this.experience.camera;
    this.screenMonitorSize = new THREE.Vector2(1370.1780000000001, 764.798);
    this.setLeftMonitorScreen();
  }

  setLeftMonitorScreen() {
    const container1 = document.createElement("div");
    container1.style.width = this.screenMonitorSize.width + "px";
    container1.style.height = this.screenMonitorSize.height + "px";
    container1.style.opacity = "1";

    const iframe1 = document.createElement("iframe");

    iframe1.src = "https://cobayaunchained.com/";
    iframe1.style.width = this.screenMonitorSize.width + "px";
    iframe1.style.height = this.screenMonitorSize.height + "px";
    iframe1.style.padding = 8 + "px";

    iframe1.style.opacity = "1";
    iframe1.style.transparent = true;
    iframe1.id = "left-monitor-screen";
    iframe1.style.boxSizing = "border-box";
    iframe1.style.background = "black";
    container1.appendChild(iframe1);

    const css3dobject1 = new CSS3DObject(container1);

    css3dobject1.scale.set(0.00101, 0.00101, 0.00101);
    css3dobject1.position.set(1.06738, 2.50725, -4.23009);
    this.cssScene1.add(css3dobject1);

    const material = new THREE.MeshLambertMaterial({ color: "red" });
    material.side = THREE.DoubleSide;
    material.opacity = 0;
    material.transparent = true;
    // NoBlending allows the GL plane to occlude the CSS plane
    material.blending = THREE.NoBlending;
    const geometry1 = new THREE.PlaneGeometry(
      this.screenMonitorSize.width,
      this.screenMonitorSize.height
    );
    // Create the GL plane mesh
    const mesh = new THREE.Mesh(geometry1, material);

    const mesh1 = new THREE.Mesh(geometry1, material);
    mesh1.position.copy(css3dobject1.position);
    mesh1.rotation.copy(css3dobject1.rotation);
    mesh1.scale.copy(css3dobject1.scale);

    // Add to gl scene
    this.scene.add(mesh1);
  }
  update() {}
}
