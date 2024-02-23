import * as THREE from "three";
import Experience from "./Experience.js";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";

export default class ArcadeScreen {
  constructor() {
    this.experience = new Experience();
    this.cssScene = this.experience.cssScene;
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.renderer = this.experience.renderer;
    this.time = this.experience.time;
    this.camera = this.experience.camera;
    this.screenSize = new THREE.Vector2(1006.986, 1210.1182617331252);
    this.setArcadeScreen();
  }

  setArcadeScreen() {
    const container = document.createElement("div");
    container.style.width = this.screenSize.width + "px";
    container.style.height = this.screenSize.height + "px";
    container.style.opacity = "1";

    const iframe = document.createElement("iframe");

    iframe.src = "http://192.168.1.72:8080/";
    iframe.style.width = this.screenSize.width + "px";
    iframe.style.height = this.screenSize.height + "px";
    iframe.style.padding = 32 + "px";

    iframe.style.opacity = "1";
    iframe.style.transparent = true;
    iframe.id = "arcade-screen";
    iframe.style.boxSizing = "border-box";
    iframe.style.background = "black";
    container.appendChild(iframe);
    iframe.addEventListener("load", () => {
      this.iframeWindow = iframe.contentWindow;
      window.addEventListener("keydown", (event) => {
        this.camera.instance.lookAt(new THREE.Vector3(0, 0, 0));
        this.camera.instance.updateProjectionMatrix();
        console.log("asadsdasasd");
        this.iframeWindow.postMessage(
          { type: "keyDownParent", key: event.key },
          "*"
        );
      });
      window.addEventListener("keyup", (event) => {
        this.iframeWindow.postMessage(
          { type: "keyUpParent", key: event.key },
          "*"
        );
      });
    });

    // Add iframe to container
    const css3dobject = new CSS3DObject(container);

    css3dobject.scale.set(0.00101, 0.00101, 0.00101);
    css3dobject.position.set(3.25776, 2.7421, 2.3009);
    css3dobject.rotateY(-Math.PI / 2);
    css3dobject.rotateX(-Math.PI / 7);
    this.cssScene.add(css3dobject);

    const material = new THREE.MeshLambertMaterial();
    material.side = THREE.DoubleSide;
    material.opacity = 0;
    material.transparent = true;
    // NoBlending allows the GL plane to occlude the CSS plane
    material.blending = THREE.NoBlending;

    // Create plane geometry
    const geometry = new THREE.PlaneGeometry(
      this.screenSize.width,
      this.screenSize.height
    );
    // Create the GL plane mesh
    const mesh = new THREE.Mesh(geometry, material);

    // Copy the position, rotation and scale of the CSS plane to the GL plane
    mesh.position.copy(css3dobject.position);
    mesh.rotation.copy(css3dobject.rotation);
    mesh.scale.copy(css3dobject.scale);

    // Add to gl scene
    this.scene.add(mesh);
  }
  update() {}
}
