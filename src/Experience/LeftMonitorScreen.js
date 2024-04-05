import {
  Mesh,
  PlaneGeometry,
  NoBlending,
  Vector2,
  MeshLambertMaterial,
} from "three";
import Experience from "./Experience.js";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import {
  MONITOR_SCREEN_WIDTH,
  MONITOR_SCREEN_HEIGHT,
  MONITOR_IFRAME_PADDING,
  LEFT_MONITOR_IFRAME_SRC,
  LEFT_MONITOR_CSS_OBJECT_POSITION,
  LEFT_MONITOR_CSS_OBJECT_SCALE,
} from "./constants.js";

export default class LeftMonitorScreen {
  constructor() {
    this.experience = new Experience();
    this.webglElement = this.experience.webglElement;
    this.cssLeftMonitor = this.experience.cssLeftMonitor;
    this.cssLeftMonitorScene = this.experience.cssLeftMonitorScene;
    this.resources = this.experience.resources;
    this.renderer = this.experience.renderer.instance;
    this.scene = this.experience.scene;
    this.raycaster = this.experience.raycaster;
    this.mouse = this.experience.mouse;
    this.navigation = this.experience.navigation;
    this.materialLeftMonitor = this.experience.world.baked.model.material2;
    this.isActive = false;
    this.camera = this.experience.camera;
    this.audioManager = this.experience.world.audioManager;
    this.objectRaycasted = null;
    this.screenMonitorSize = new Vector2(
      MONITOR_SCREEN_WIDTH,
      MONITOR_SCREEN_HEIGHT
    );
    this.model = {};
    this.setModel();
    this.setLeftMonitorScreen();
  }

  setModel() {
    this.model.mesh = this.resources.items.leftMonitor.scene;

    this.model.mesh.traverse((child) => {
      if (child.isMesh) {
        child.material = this.materialLeftMonitor;
      }
    });
    this.model.mesh.name = "leftMonitor";
    this.scene.add(this.model.mesh);
  }

  setLeftMonitorScreen() {
    const container = document.createElement("div");
    container.style.width = this.screenMonitorSize.width + "px";
    container.style.height = this.screenMonitorSize.height + "px";

    const iframe = document.createElement("iframe");

    iframe.src = LEFT_MONITOR_IFRAME_SRC;
    iframe.style.width = this.screenMonitorSize.width + "px";
    iframe.style.height = this.screenMonitorSize.height + "px";
    iframe.style.padding = MONITOR_IFRAME_PADDING;

    iframe.style.transparent = true;
    iframe.id = "left-monitor-screen";
    iframe.style.boxSizing = "border-box";
    iframe.style.background = "black";
    container.appendChild(iframe);

    const css3dobject = new CSS3DObject(container);

    css3dobject.position.copy(LEFT_MONITOR_CSS_OBJECT_POSITION);
    css3dobject.scale.copy(LEFT_MONITOR_CSS_OBJECT_SCALE);
    this.cssLeftMonitorScene.add(css3dobject);

    const material = new MeshLambertMaterial({
      color: "black",
      opacity: 0,
      transparent: true,
      blending: NoBlending,
    });

    const geometry = new PlaneGeometry(
      this.screenMonitorSize.width,
      this.screenMonitorSize.height
    );

    const screen = new Mesh(geometry, material);
    screen.position.copy(css3dobject.position);
    screen.rotation.copy(css3dobject.rotation);
    screen.scale.copy(css3dobject.scale);
    screen.name = "leftMonitorScreen";
    this.model.mesh.add(screen);
  }

  activateControls() {
    window.addEventListener("pointermove", this.onMouseMove, false);
    window.addEventListener("message", this.receiveMessage, false);
    this.onMouseMove();
    this.isActive = true;
  }

  deactivateControls() {
    window.removeEventListener("pointermove", this.onMouseMove, false);
    window.removeEventListener("message", this.receiveMessage, false);
    this.isActive = false;
  }

  receiveMessage = (event) => {
    if (event.data == "Projects") {
      this.navigation.flyToPosition("rightMonitor");
    } else if (event.data == "mousedown") {
      this.audioManager.playSingleAudio("mouseclick", 1);
    } else if (event.data == "mouseup") {
      this.audioManager.playSingleAudio("mouserelease", 1);
    }
  };

  onMouseMove = () => {
    if (
      this.objectRaycasted &&
      this.objectRaycasted.object &&
      this.objectRaycasted.object.name == "leftMonitorScreen"
    ) {
      this.experience.navigation.orbitControls.enableDamping = false;
      this.experience.navigation.orbitControls.enabled = false;
      this.webglElement.style.pointerEvents = "none";
    } else {
      this.experience.navigation.orbitControls.enableDamping = true;
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
