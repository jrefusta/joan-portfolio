import {
  Color,
  WebGLRenderer,
  Vector2,
  WebGLRenderTarget,
  LinearFilter,
} from "three";
import Experience from "./Experience.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";

export default class Renderer {
  constructor(_options = {}) {
    this.experience = new Experience();
    this.webglElement = this.experience.webglElement;
    this.cssArcadeMachine = this.experience.cssArcadeMachine;
    this.cssLeftMonitor = this.experience.cssLeftMonitor;
    this.cssRightMonitor = this.experience.cssRightMonitor;
    this.config = this.experience.config;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.cssArcadeMachineScene = this.experience.cssArcadeMachineScene;
    this.cssLeftMonitorScene = this.experience.cssLeftMonitorScene;
    this.cssRightMonitorScene = this.experience.cssRightMonitorScene;
    this.usePostprocess = true;

    this.setInstance();
    this.setPostProcess();
  }

  setInstance() {
    // Renderer
    this.clearColor = new Color(0x072446).convertSRGBToLinear();
    this.instance = new WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    this.instance.domElement.style.position = "absolute";
    this.instance.domElement.style.top = 0;
    this.instance.domElement.style.left = 0;
    this.instance.domElement.style.width = "100%";
    this.instance.domElement.style.height = "100%";

    this.instance.setClearColor(this.clearColor, 1);
    this.instance.setSize(this.config.width, this.config.height);
    this.instance.setPixelRatio(this.config.pixelRatio);
    this.instance.localClippingEnabled = true;
    this.instance.outputColorSpace = "srgb";

    this.webglElement.appendChild(this.instance.domElement);

    this.cssArcadeMachineInstance = new CSS3DRenderer();
    this.cssArcadeMachineInstance.setSize(this.sizes.width, this.sizes.height);
    this.cssArcadeMachineInstance.domElement.style.position = "absolute";
    this.cssArcadeMachineInstance.domElement.style.top = "0px";

    this.cssLeftMonitorInstance = new CSS3DRenderer();
    this.cssLeftMonitorInstance.setSize(this.sizes.width, this.sizes.height);
    this.cssLeftMonitorInstance.domElement.style.position = "absolute";
    this.cssLeftMonitorInstance.domElement.style.top = "0px";

    this.cssRightMonitorInstance = new CSS3DRenderer();
    this.cssRightMonitorInstance.setSize(this.sizes.width, this.sizes.height);
    this.cssRightMonitorInstance.domElement.style.position = "absolute";
    this.cssRightMonitorInstance.domElement.style.top = "0px";

    this.cssArcadeMachine.appendChild(this.cssArcadeMachineInstance.domElement);
    this.cssLeftMonitor.appendChild(this.cssLeftMonitorInstance.domElement);
    this.cssRightMonitor.appendChild(this.cssRightMonitorInstance.domElement);
  }

  setPostProcess() {
    this.postProcess = {};
    this.postProcess.renderPass = new RenderPass(
      this.scene,
      this.camera.instance
    );
    this.postProcess.outlinePass = new OutlinePass(
      new Vector2(window.innerWidth, window.innerHeight),
      this.scene,
      this.camera.instance
    );
    this.postProcess.outlinePass.visibleEdgeColor.set(0xffffff);
    this.postProcess.outlinePass.hiddenEdgeColor.set(0xffffff);
    this.postProcess.outlinePass.edgeThickness = 3;
    this.postProcess.outlinePass.edgeStrength = 6;
    const gpu =
      navigator.gpu || navigator.userAgent.indexOf("Intel") > -1
        ? "integrated"
        : "dedicated";

    this.renderTarget = new WebGLRenderTarget(
      this.config.width,
      this.config.height,
      {
        samples: this.instance.getPixelRatio() >= 2 ? 8 : 4,
        generateMipmaps: false,
        minFilter: LinearFilter,
        magFilter: LinearFilter,
        colorSpace: "srgb",
      }
    );

    this.postProcess.composer = new EffectComposer(
      this.instance,
      this.renderTarget
    );

    this.postProcess.composer.setSize(this.config.width, this.config.height);
    this.postProcess.composer.setPixelRatio(this.config.pixelRatio);
    this.gammaCorrectionShader = new ShaderPass(GammaCorrectionShader);
    this.postProcess.composer.addPass(this.postProcess.renderPass);
    this.postProcess.composer.addPass(this.postProcess.outlinePass);
    this.postProcess.composer.addPass(this.gammaCorrectionShader);
    if (this.instance.capabilities.isWebGL2) {
      const smaaPass = new SMAAPass();
      this.postProcess.composer.addPass(smaaPass);
    }
  }

  resize() {
    // Instance
    this.instance.setSize(this.config.width, this.config.height);
    this.instance.setPixelRatio(this.config.pixelRatio);
    this.cssArcadeMachineInstance.setSize(
      this.config.width,
      this.config.height
    );
    this.cssLeftMonitorInstance.setSize(this.config.width, this.config.height);
    this.cssRightMonitorInstance.setSize(this.config.width, this.config.height);

    // Post process
    this.postProcess.composer.setSize(this.config.width, this.config.height);
    this.postProcess.composer.setPixelRatio(this.config.pixelRatio);
  }

  update() {
    if (this.usePostprocess) {
      this.postProcess.composer.render();
    } else {
      this.instance.render(this.scene, this.camera.instance);
    }
    this.cssArcadeMachineInstance.render(
      this.cssArcadeMachineScene,
      this.camera.instance
    );
    this.cssLeftMonitorInstance.render(
      this.cssLeftMonitorScene,
      this.camera.instance
    );
    this.cssRightMonitorInstance.render(
      this.cssRightMonitorScene,
      this.camera.instance
    );
  }

  destroy() {
    this.instance.renderLists.dispose();
    this.instance.dispose();
    this.renderTarget.dispose();
    this.postProcess.composer.renderTarget1.dispose();
    this.postProcess.composer.renderTarget2.dispose();
  }
}
