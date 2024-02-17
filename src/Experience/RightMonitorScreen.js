import * as THREE from "three";
import Experience from "./Experience.js";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";

export default class RightMonitorScreen {
  constructor() {
    this.experience = new Experience();
    this.webglElement = this.experience.webglElement;
    this.cssScene = this.experience.cssScene;
    this.cssScene1 = this.experience.cssScene1;
    this.cssScene2 = this.experience.cssScene2;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.renderer = this.experience.renderer;
    this.time = this.experience.time;
    this.camera = this.experience.camera;
    this.mouse = new THREE.Vector2(-1, -1);
    this.drawStartPos = new THREE.Vector2(-1, -1);
    this.raycaster = new THREE.Raycaster();
    this.drawColor = "black";
    this.positionsToDraw = [];
    this.screenMonitorSize = new THREE.Vector2(1370.1780000000001, 764.798);
    this.setRightMonitorScreen();
  }

  setRightMonitorScreen() {
    const container2 = document.createElement("div");
    container2.style.width = this.screenMonitorSize.width + "px";
    container2.style.height = this.screenMonitorSize.height + "px";
    container2.style.opacity = "1";

    const iframe2 = document.createElement("iframe");

    iframe2.src = "https://www.cobayaunchained.com/";
    iframe2.style.width = this.screenMonitorSize.width + "px";
    iframe2.style.height = this.screenMonitorSize.height + "px";
    iframe2.style.padding = 8 + "px";

    iframe2.style.opacity = "1";
    iframe2.style.transparent = true;
    iframe2.id = "computer-screen";
    iframe2.style.boxSizing = "border-box";
    iframe2.style.background = "black";
    container2.appendChild(iframe2);

    const css3dobject2 = new CSS3DObject(container2);

    css3dobject2.scale.set(0.00101, 0.00101, 0.00101);
    css3dobject2.position.set(2.47898, 2.50716, -4.14566);
    css3dobject2.rotateY((-7.406 * Math.PI) / 180);
    this.cssScene2.add(css3dobject2);

    const material = new THREE.MeshLambertMaterial({ color: "red" });
    material.side = THREE.DoubleSide;
    material.opacity = 0;
    material.transparent = true;
    // NoBlending allows the GL plane to occlude the CSS plane
    material.blending = THREE.NoBlending;

    // Create plane geometry
    const geometry1 = new THREE.PlaneGeometry(
      this.screenMonitorSize.width,
      this.screenMonitorSize.height
    );
    // Create the GL plane mesh

    const mesh2 = new THREE.Mesh(geometry1, material);
    mesh2.position.copy(css3dobject2.position);
    mesh2.rotation.copy(css3dobject2.rotation);
    mesh2.scale.copy(css3dobject2.scale);

    // Add to gl scene
    this.scene.add(mesh2);
  }
  update() {}
}
