import * as THREE from "three";
import Experience from "./Experience.js";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import fragmentShader from "./shaders/screenEffect/fragment.glsl";
import vertexShader from "./shaders/screenEffect/vertex.glsl";

export default class ArcadeScreen {
  constructor() {
    this.experience = new Experience();
    this.cssScene = this.experience.cssScene;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.screenSize = new THREE.Vector2(1006.986, 1210.1182617331252);
    this.model = {};
    this.setModel();
    this.setArcadeScreen();
  }

  setModel() {
    this.model.arcadeMachineModel = this.resources.items.arcadeMachine.scene;

    this.model.bakedTexture = this.resources.items._baked2;
    this.model.bakedTexture.flipY = false;
    this.model.bakedTexture.colorSpace = THREE.SRGBColorSpace;
    this.model.material = new THREE.MeshBasicMaterial({
      map: this.model.bakedTexture,
    });
    this.model.arcadeMachineModel.traverse((_child) => {
      if (_child instanceof THREE.Mesh) {
        _child.material = this.model.material;
      }
    });
    this.model.arcadeMachineModel.name = "arcadeMachine";
    this.scene.add(this.model.arcadeMachineModel);
  }

  setArcadeScreen() {
    const container = document.createElement("div");
    container.style.width = this.screenSize.width + "px";
    container.style.height = this.screenSize.height + "px";
    container.style.opacity = "1";

    const iframe = document.createElement("iframe");

    iframe.src = "http://192.168.1.72:8081/";
    iframe.style.width = this.screenSize.width + "px";
    iframe.style.height = this.screenSize.height + "px";
    iframe.style.padding = 16 + "px";

    iframe.style.opacity = "1";
    iframe.style.transparent = true;
    iframe.id = "arcade-screen";
    iframe.style.boxSizing = "border-box";
    iframe.style.background = "black";
    container.appendChild(iframe);
    iframe.addEventListener("load", () => {
      this.iframeWindow = iframe.contentWindow;
    });

    // Add iframe to container
    const css3dobject = new CSS3DObject(container);

    css3dobject.scale.set(0.00102, 0.00102, 0.00102);
    css3dobject.position.set(3.24776, 2.7421, 2.3009);
    css3dobject.rotateY(-Math.PI / 2);
    css3dobject.rotateX(-Math.PI / 7);
    this.cssScene.add(css3dobject);
    const materialCRT = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.NoBlending,
      opacity: 0,
      side: THREE.DoubleSide,
      uniforms: {
        curvature: { value: new THREE.Vector2(3, 3) },
        screenResolution: {
          value: new THREE.Vector2(
            this.screenSize.width / 5,
            this.screenSize.height / 5
          ),
        },
        scanLineOpacity: {
          value: new THREE.Vector2(0.5, 0.5),
        },
        uBaseColor: {
          value: new THREE.Color(0.1, 0.1, 0.1).convertSRGBToLinear(),
        },
        uColor: {
          value: new THREE.Color(0.0, 0.0, 0.0).convertSRGBToLinear(),
        },
        vignetteOpacity: {
          value: 1,
        },
        brightness: { value: 2.5 },
        vignetteRoundness: {
          value: 1,
        },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
    // Create plane geometry
    const geometry = new THREE.PlaneGeometry(
      this.screenSize.width,
      this.screenSize.height
    );
    // Create the GL plane mesh
    this.model.screen = new THREE.Mesh(geometry, materialCRT);

    // Copy the position, rotation and scale of the CSS plane to the GL plane
    this.model.screen.position.copy(css3dobject.position);
    this.model.screen.rotation.copy(css3dobject.rotation);
    this.model.screen.scale.copy(css3dobject.scale);
    this.model.screen.name = "arcadeMachineScreen";

    // Add to gl scene
    this.model.arcadeMachineModel.add(this.model.screen);
  }

  handleKeyDownParent = (event) => {
    this.iframeWindow.postMessage(
      { type: "keyDownParent", key: event.key },
      "*"
    );
  };
  handleKeyUpParent = (event) => {
    this.iframeWindow.postMessage({ type: "keyUpParent", key: event.key }, "*");
  };

  activateControls() {
    window.addEventListener("keydown", this.handleKeyDownParent);
    window.addEventListener("keyup", this.handleKeyUpParent);
  }
  deactivateControls() {
    window.removeEventListener("keydown", this.handleKeyDownParent);
    window.removeEventListener("keyup", this.handleKeyUpParent);
  }
  update() {}
}
