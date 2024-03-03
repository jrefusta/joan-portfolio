import EventEmitter from "./EventEmitter.js";
import Experience from "../Experience.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { CubeTextureLoader } from "three";

export default class Resources extends EventEmitter {
  /**
   * Constructor
   */
  constructor() {
    super();

    this.experience = new Experience();
    this.renderer = this.experience.renderer.instance;

    this.setLoaders();

    this.toLoad = 0;
    this.loaded = 0;
    this.items = {};
  }

  /**
   * Set loaders
   */
  setLoaders() {
    this.loaders = [];

    // Images
    this.loaders.push({
      extensions: ["jpg", "png"],
      action: (_resource) => {
        const image = new Image();

        image.addEventListener("load", () => {
          this.fileLoadEnd(_resource, image);
        });

        image.addEventListener("error", () => {
          this.fileLoadEnd(_resource, image);
        });

        image.src = _resource.source;
      },
    });
    // CubeTexture
    this.loaders.push({
      extensions: ["cubeTexture"],
      action: (_resource) => {
        const cubeTextureLoader = new CubeTextureLoader();
        cubeTextureLoader.load(_resource.source, (_data) => {
          this.fileLoadEnd(_resource, _data);
        });
      },
    });

    // Basis images
    const basisLoader = new KTX2Loader();
    basisLoader.setTranscoderPath("basis/");
    basisLoader.detectSupport(this.renderer);

    this.loaders.push({
      extensions: ["ktx2"],
      action: (_resource) => {
        basisLoader.load(_resource.source, (_data) => {
          this.fileLoadEnd(_resource, _data);
        });
      },
    });

    // Draco
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("draco/");
    dracoLoader.setDecoderConfig({ type: "js" });

    this.loaders.push({
      extensions: ["drc"],
      action: (_resource) => {
        dracoLoader.load(_resource.source, (_data) => {
          this.fileLoadEnd(_resource, _data);

          DRACOLoader.releaseDecoderModule();
        });
      },
    });

    // GLTF
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    this.loaders.push({
      extensions: ["glb", "gltf"],
      action: (_resource) => {
        gltfLoader.load(_resource.source, (_data) => {
          this.fileLoadEnd(_resource, _data);
        });
      },
    });

    // FBX
    const fbxLoader = new FBXLoader();

    this.loaders.push({
      extensions: ["fbx"],
      action: (_resource) => {
        fbxLoader.load(_resource.source, (_data) => {
          this.fileLoadEnd(_resource, _data);
        });
      },
    });

    // RGBE | HDR
    const rgbeLoader = new RGBELoader();

    this.loaders.push({
      extensions: ["hdr"],
      action: (_resource) => {
        rgbeLoader.load(_resource.source, (_data) => {
          this.fileLoadEnd(_resource, _data);
        });
      },
    });
  }

  /**
   * Load
   */
  load(_resources = []) {
    for (const _resource of _resources) {
      this.toLoad++;

      const loader = this.loaders.find((_loader) => {
        if (_resource.type === "cubeTexture") {
          return _loader.extensions.includes("cubeTexture");
        } else {
          const extensionMatch = _resource.source.match(/\.([a-zA-Z0-9]+)$/);
          const extension = extensionMatch ? extensionMatch[1] : null;
          return extension && _loader.extensions.includes(extension);
        }
      });

      if (loader) {
        loader.action(_resource);
      } else {
        if (_resource.type === "cubeTexture") {
          console.warn("Cannot found loader for cubeTexture");
        } else {
          const extensionMatch = _resource.source.match(/\.([a-zA-Z0-9]+)$/);
          const extension = extensionMatch ? extensionMatch[1] : null;
          if (extension) {
            console.warn(`Cannot found loader for ${extension}`);
          } else {
            console.warn("Cannot found extension");
          }
        }
      }
    }
  }

  /**
   * File load end
   */
  fileLoadEnd(_resource, _data) {
    this.loaded++;
    this.items[_resource.name] = _data;

    this.trigger("fileEnd", [_resource, _data]);

    if (this.loaded === this.toLoad) {
      this.trigger("end");
    }
  }
}
