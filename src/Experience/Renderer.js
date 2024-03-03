import * as THREE from "three";
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
    this.cssElement = this.experience.cssElement;
    this.cssElement1 = this.experience.cssElement1;
    this.cssElement2 = this.experience.cssElement2;
    this.config = this.experience.config;
    this.stats = this.experience.stats;
    this.time = this.experience.time;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.cssScene = this.experience.cssScene;
    this.cssScene1 = this.experience.cssScene1;
    this.cssScene2 = this.experience.cssScene2;
    this.usePostprocess = true;

    this.setInstance();
    this.setPostProcess();
  }

  setInstance() {
    this.clearColor = new THREE.Color(0x072446).convertSRGBToLinear();
    //this.clearColor = new THREE.Color(0xeda72d).convertSRGBToLinear();
    // Renderer
    this.instance = new THREE.WebGLRenderer({
      alpha: false,
      antialias: true,
    });
    this.instance.domElement.style.position = "absolute";
    this.instance.domElement.style.top = 0;
    this.instance.domElement.style.left = 0;
    this.instance.domElement.style.width = "100%";
    this.instance.domElement.style.height = "100%";

    // this.instance.setClearColor(0x414141, 1)
    this.instance.setClearColor(this.clearColor, 1);
    this.instance.setSize(this.config.width, this.config.height);
    this.instance.setPixelRatio(this.config.pixelRatio);
    this.instance.localClippingEnabled = true;

    // this.instance.physicallyCorrectLights = true
    // this.instance.gammaOutPut = true
    this.instance.outputColorSpace = "srgb";
    this.webglElement.appendChild(this.instance.domElement);
    // this.instance.shadowMap.type = THREE.PCFSoftShadowMap
    // this.instance.shadowMap.enabled = false
    //this.instance.toneMapping = THREE.ReinhardToneMapping;
    //this.instance.toneMappingExposure = 0.3;
    this.rubiksInstance = new THREE.WebGLRenderer({
      alpha: false,
      antialias: true,
    });
    this.cssInstance = new CSS3DRenderer();
    this.cssInstance.setSize(this.sizes.width, this.sizes.height);
    this.cssInstance.domElement.style.position = "absolute";
    this.cssInstance.domElement.style.top = "0px";
    this.cssInstance1 = new CSS3DRenderer();
    this.cssInstance1.setSize(this.sizes.width, this.sizes.height);
    this.cssInstance1.domElement.style.position = "absolute";
    this.cssInstance1.domElement.style.top = "0px";
    /*     this.cssElement1.style.pointerEvents = "auto";
    this.webglElement.style.pointerEvents = "none"; */

    this.cssInstance2 = new CSS3DRenderer();
    this.cssInstance2.setSize(this.sizes.width, this.sizes.height);
    this.cssInstance2.domElement.style.position = "absolute";
    this.cssInstance2.domElement.style.top = "0px";

    this.cssElement.appendChild(this.cssInstance.domElement);
    this.cssElement1.appendChild(this.cssInstance1.domElement);
    this.cssElement2.appendChild(this.cssInstance2.domElement);
    // Add stats panel
    this.context = this.instance.getContext();

    if (this.stats) {
      this.stats.setRenderPanel(this.context);
    }
  }

  setPostProcess() {
    this.postProcess = {};
    this.postProcess.renderPass = new RenderPass(
      this.scene,
      this.camera.instance
    );
    this.postProcess.outlinePass = new OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      this.scene,
      this.camera.instance
    );
    this.postProcess.outlinePass.visibleEdgeColor.set(0xffffff);
    this.postProcess.outlinePass.hiddenEdgeColor.set(0xffffff);
    this.postProcess.outlinePass.edgeThickness = 3;
    this.postProcess.outlinePass.edgeStrength = 6;

    /*    const RenderTargetClass =
      this.config.pixelRatio >= 2
        ? THREE.WebGLRenderTarget
        : THREE.WebGLMultisampleRenderTarget; */
    // const RenderTargetClass = THREE.WebGLRenderTarget
    this.renderTarget = new THREE.RenderTarget(
      this.config.width,
      this.config.height,
      {
        samples: this.instance.getPixelRatio() === 1 ? 2 : 0,
        generateMipmaps: false,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
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
    if (
      this.instance.getPixelRatio() === 1 &&
      !this.instance.capabilities.isWebGL2
    ) {
      const smaaPass = new SMAAPass();
      this.postProcess.composer.addPass(smaaPass);
    }
  }

  resize() {
    // Instance
    this.instance.setSize(this.config.width, this.config.height);
    this.instance.setPixelRatio(this.config.pixelRatio);
    this.rubiksInstance.setSize(this.config.width, this.config.height);
    this.rubiksInstance.setPixelRatio(this.config.pixelRatio);
    this.cssInstance.setSize(this.config.width, this.config.height);
    this.cssInstance1.setSize(this.config.width, this.config.height);
    this.cssInstance2.setSize(this.config.width, this.config.height);

    // Post process
    this.postProcess.composer.setSize(this.config.width, this.config.height);
    this.postProcess.composer.setPixelRatio(this.config.pixelRatio);
  }

  update() {
    if (this.stats) {
      this.stats.beforeRender();
    }

    if (this.usePostprocess) {
      this.postProcess.composer.render();
    } else {
      this.instance.render(this.scene, this.camera.instance);
    }
    this.cssInstance.render(this.cssScene, this.camera.instance);
    this.cssInstance1.render(this.cssScene1, this.camera.instance);
    this.cssInstance2.render(this.cssScene2, this.camera.instance);

    if (this.stats) {
      this.stats.afterRender();
    }
  }

  destroy() {
    this.instance.renderLists.dispose();
    this.instance.dispose();
    this.renderTarget.dispose();
    this.postProcess.composer.renderTarget1.dispose();
    this.postProcess.composer.renderTarget2.dispose();
  }
}
