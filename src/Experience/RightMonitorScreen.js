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
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.renderer = this.experience.renderer;
    this.time = this.experience.time;
    this.camera = this.experience.camera;
    this.mouse = new THREE.Vector2(-1, -1);
    this.drawStartPos = new THREE.Vector2(-1, -1);
    this.raycaster = this.experience.raycaster;
    this.positionsToDraw = [];
    this.screenMonitorSize = new THREE.Vector2(1370.1780000000001, 764.798);
    this.model = {};
    this.setModel();
    this.setRightMonitorScreen();
  }
  setModel() {
    this.model.mesh = this.resources.items.rightMonitor.scene;

    this.model.bakedDayTexture = this.resources.items._baked2;
    this.model.bakedDayTexture.flipY = false;
    this.model.bakedDayTexture.colorSpace = THREE.SRGBColorSpace;
    this.model.material = new THREE.MeshBasicMaterial({
      map: this.model.bakedDayTexture,
    });
    this.model.mesh.traverse((_child) => {
      if (_child instanceof THREE.Mesh) {
        _child.material = this.model.material;
      }
    });
    this.model.mesh.name = "rightMonitor";
    this.scene.add(this.model.mesh);
  }

  setRightMonitorScreen() {
    const container2 = document.createElement("div");
    container2.style.width = this.screenMonitorSize.width + "px";
    container2.style.height = this.screenMonitorSize.height + "px";
    container2.style.opacity = "1";

    const iframe2 = document.createElement("iframe");

    iframe2.src = "https://joan-arcade-machine.vercel.app/";
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

    const material = new THREE.MeshBasicMaterial({ color: "black" });
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

    const screen = new THREE.Mesh(geometry1, material);
    screen.position.copy(css3dobject2.position);
    screen.rotation.copy(css3dobject2.rotation);
    screen.scale.copy(css3dobject2.scale);
    screen.name = "rightMonitorScreen";
    // Add to gl scene
    this.model.mesh.add(screen);
  }

  activateControls() {
    // Configurar eventos del mouse
    window.addEventListener("pointermove", this.onMouseMove, false);
    this.isActive = true;
  }
  deactivateControls() {
    // Configurar eventos del mouse
    window.removeEventListener("pointermove", this.onMouseMove, false);
    this.isActive = false;
  }

  onMouseMove = (event) => {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    if (
      this.objectRaycasted &&
      this.objectRaycasted.object &&
      this.objectRaycasted.object.name == "rightMonitorScreen"
    ) {
      this.experience.navigation.orbitControls.enabled = false;
      this.webglElement.style.pointerEvents = "none";
    } else {
      this.experience.navigation.orbitControls.enabled = true;
      this.webglElement.style.pointerEvents = "auto";
    }
  };

  update() {
    if (!this.isActive) {
      return;
    }
    this.raycaster.setFromCamera(this.mouse, this.camera.instance);
    const intersects = this.raycaster.intersectObjects(
      this.scene.children,
      true
    );
    this.objectRaycasted = intersects.length > 0 ? intersects[0] : null;
  }
}
