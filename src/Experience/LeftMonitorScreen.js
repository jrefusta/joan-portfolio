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
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.raycaster = this.experience.raycaster;
    this.mouse = this.experience.mouse;
    this.isActive = false;
    this.renderer = this.experience.renderer;
    this.camera = this.experience.camera;
    this.objectRaycasted = null;
    this.screenMonitorSize = new THREE.Vector2(1370.1780000000001, 764.798);
    this.model = {};
    this.setModel();
    this.setLeftMonitorScreen();
  }

  setModel() {
    this.model.mesh = this.resources.items.leftMonitor.scene;

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
    this.model.mesh.name = "leftMonitor";
    this.scene.add(this.model.mesh);
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

    const material = new THREE.MeshLambertMaterial({ color: "black" });
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

    const screen = new THREE.Mesh(geometry1, material);
    screen.position.copy(css3dobject1.position);
    screen.rotation.copy(css3dobject1.rotation);
    screen.scale.copy(css3dobject1.scale);
    screen.name = "leftMonitorScreen";
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
      this.objectRaycasted.object.name == "leftMonitorScreen"
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
