import * as THREE from "three";
import Experience from "./Experience.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";

export default class Renderer {
  constructor(_options = {}) {
    this.experience = new Experience();
    this.webglElement = this.experience.webglElement;
    this.cssElement = this.experience.cssElement;
    this.config = this.experience.config;
    this.debug = this.experience.debug;
    this.stats = this.experience.stats;
    this.time = this.experience.time;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.cssScene = this.experience.cssScene;
    this.usePostprocess = false;

    this.setInstance();
    //this.setPostProcess();
  }

  setInstance() {
    this.clearColor = "#010101";

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

    // this.instance.physicallyCorrectLights = true
    // this.instance.gammaOutPut = true
    this.instance.outputColorSpace = THREE.SRGBColorSpace;
    this.webglElement.appendChild(this.instance.domElement);
    // this.instance.shadowMap.type = THREE.PCFSoftShadowMap
    // this.instance.shadowMap.enabled = false
    // this.instance.toneMapping = THREE.ReinhardToneMapping
    // this.instance.toneMappingExposure = 1.3
    this.cssInstance = new CSS3DRenderer();
    this.cssInstance.setSize(this.sizes.width, this.sizes.height);
    this.cssInstance.domElement.style.position = "absolute";
    this.cssInstance.domElement.style.top = "0px";

    this.cssElement.appendChild(this.cssInstance.domElement);
    // Add stats panel
    this.context = this.instance.getContext();

    if (this.stats) {
      this.stats.setRenderPanel(this.context);
    }
  }

  /*setPostProcess() {
    this.postProcess = {};

    
    this.postProcess.renderPass = new RenderPass(
      this.scene,
      this.camera.instance
    );

    const RenderTargetClass =
      this.config.pixelRatio >= 2
        ? THREE.WebGLRenderTarget
        : THREE.WebGLMultisampleRenderTarget;
    // const RenderTargetClass = THREE.WebGLRenderTarget
    this.renderTarget = new THREE.RenderTarget(
      this.config.width,
      this.config.height,
      {
        generateMipmaps: true,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        encoding: THREE.SRGBColorSpace,
      }
    );
    this.postProcess.composer = new EffectComposer(
      this.instance,
      this.renderTarget
    );
    this.postProcess.composer.setSize(this.config.width, this.config.height);
    this.postProcess.composer.setPixelRatio(this.config.pixelRatio);

    this.postProcess.composer.addPass(this.postProcess.renderPass);
  }*/

  resize() {
    // Instance
    this.instance.setSize(this.config.width, this.config.height);
    this.instance.setPixelRatio(this.config.pixelRatio);
    this.cssInstance.setSize(this.config.width, this.config.height);

    // Post process
    //this.postProcess.composer.setSize(this.config.width, this.config.height);
    //this.postProcess.composer.setPixelRatio(this.config.pixelRatio);
  }

  update() {
    if (this.stats) {
      this.stats.beforeRender();
    }

    if (this.usePostprocess) {
      this.postProcess.composer.render();
    } else {
      this.instance.render(this.scene, this.camera.instance);
      this.cssInstance.render(this.cssScene, this.camera.instance);
    }

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
