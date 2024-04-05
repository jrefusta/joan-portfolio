import {
  Group,
  Vector2,
  MeshBasicMaterial,
  PlaneGeometry,
  Mesh,
  CanvasTexture,
  LinearFilter,
  LinearMipmapLinearFilter,
} from "three";
import Experience from "./Experience.js";

export default class Whiteboard {
  constructor() {
    this.experience = new Experience();
    this.webglElement = this.experience.webglElement;
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.renderer = this.experience.renderer.instance;
    this.camera = this.experience.camera;
    this.audioManager = this.experience.world.audioManager;
    this.mouse = this.experience.mouse;
    this.baked = this.experience.world.baked;
    this.whiteboardGroup = new Group();
    this.drawStartPos = new Vector2(-1, -1);
    this.raycaster = this.experience.raycaster;
    this.drawColor = "black";
    this.isActive = false;
    this.positionsToDraw = [];
    this.model = {};
    this.materialWhiteboard = this.experience.world.baked.model.material;

    this.setModel();
    this.setWhiteboard();
  }

  setModel() {
    this.whiteboardButtons = document.querySelectorAll(
      ".circular-button-whiteboard"
    );
    this.whiteboardButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.changeWhiteboardColor(button.id);
        this.whiteboardButtons.forEach((btn) => {
          btn.classList.remove("whiteboard-selected");
        });

        if (button.id != "eraser") {
          this.audioManager.playSingleAudio("markerOpen", 0.8);
        } else {
          this.audioManager.playSingleAudio("eraser", 0.3);
        }
        button.classList.add("whiteboard-selected");
      });
    });
    this.model.mesh = this.resources.items.whiteboard.scene;
    this.model.mesh.traverse((child) => {
      if (child.isMesh) {
        child.material = this.materialWhiteboard;
      }
    });
    this.whiteboardGroup.add(this.model.mesh);
    this.model.mesh.name = "whiteboard";
    this.scene.add(this.model.mesh);
  }

  setWhiteboard() {
    this.whiteboardMaterial = new MeshBasicMaterial();
    const whiteboardGeom = new PlaneGeometry(2.6, 1.82);
    whiteboardGeom.computeBoundingBox();
    whiteboardGeom.computeVertexNormals();
    const planeMesh = new Mesh(whiteboardGeom, this.whiteboardMaterial);
    planeMesh.position.set(-3.3927, 3.18774, -4.61366);
    planeMesh.name = "whiteboardCanvas";
    this.model.mesh.add(planeMesh);

    const image = this.resources.items.texture_paint.source.data;
    image.src = image.src;

    this.drawingCanvas = document.getElementById("drawing-canvas");
    this.drawingContext = this.drawingCanvas.getContext("2d");
    image.onload = () => {
      this.drawingContext.drawImage(
        image,
        0,
        0,
        this.drawingCanvas.width,
        this.drawingCanvas.height
      );

      this.canvasTexture = new CanvasTexture(this.drawingCanvas);

      this.canvasTexture.anisotropy =
        this.renderer.capabilities.getMaxAnisotropy();

      this.canvasTexture.generateMipmaps = true;

      this.canvasTexture.magFilter = LinearFilter;
      this.canvasTexture.minFilter = LinearMipmapLinearFilter;

      this.whiteboardMaterial.map = this.canvasTexture;
      this.whiteboardMaterial.needsUpdate = true;
    };

    this.drawingContext.lineWidth = 8;
    this.drawingContext.lineJoin = "round";
    this.drawingContext.lineCap = "round";
    this.drawingContext.fontSmoothingEnabled = true;
    // draw white background
    this.drawingContext.fillStyle = "white";
    this.drawingContext.fillRect(0, 0, 2048, 1024);

    this.drawingCanvas.needsUpdate = true;
    this.canvasTexture = new CanvasTexture(this.drawingCanvas);

    this.whiteboardMaterial.map = this.canvasTexture;
    this.whiteboardMaterial.map.needsUpdate = true;
  }

  throttle(func, delay) {
    let timeoutId;
    return (...args) => {
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          timeoutId = null;
        }, delay);
      }
    };
  }

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

  draw(x, y) {
    this.drawingContext.strokeStyle = this.drawColor;

    this.drawingContext.moveTo(this.drawStartPos.x, this.drawStartPos.y);
    this.drawingContext.lineTo(x, y);
    this.drawingContext.stroke();
    // reset drawing start position to current position.
    this.drawStartPos.set(x, y);
    // need to flag the map as needing updating.
    this.whiteboardMaterial.map.needsUpdate = true;
  }

  onMouseDown = () => {
    if (
      this.objectRaycasted &&
      this.objectRaycasted.uv &&
      this.objectRaycasted.object.name == "whiteboardCanvas"
    ) {
      this.drawing = true;
      this.drawStartPos.set(
        this.objectRaycasted.uv.x * 2048,
        1024 - this.objectRaycasted.uv.y * 1024
      );
      this.drawingContext.beginPath();
    }
  };

  onMouseMove = () => {
    if (
      this.objectRaycasted &&
      this.objectRaycasted.object &&
      this.objectRaycasted.object.name == "whiteboardCanvas"
    ) {
      this.experience.navigation.orbitControls.enableDamping = false;
      this.experience.navigation.orbitControls.enabled = false;
      this.webglElement.style.pointerEvents = "none";
    } else {
      this.experience.navigation.orbitControls.enableDamping = true;
      this.experience.navigation.orbitControls.enabled = true;
      this.webglElement.style.pointerEvents = "auto";
    }

    if (
      this.drawing &&
      this.objectRaycasted &&
      this.objectRaycasted.uv &&
      this.objectRaycasted.object.name == "whiteboardCanvas"
    ) {
      this.draw(
        this.objectRaycasted.uv.x * 2048,
        1024 - this.objectRaycasted.uv.y * 1024
      );
    } else {
      this.drawing = false;
    }
  };

  onMouseUp = () => {
    this.drawing = false;
    this.drawingContext.closePath();
  };

  activateControls() {
    window.addEventListener("pointerdown", this.onMouseDown, false);
    window.addEventListener("pointermove", this.throttledMouseMove, false);
    window.addEventListener("pointerup", this.onMouseUp, false);
    this.onMouseMove();
    this.isActive = true;
  }

  deactivateControls() {
    window.removeEventListener("pointerdown", this.onMouseDown, false);
    window.removeEventListener("pointermove", this.throttledMouseMove, false);
    window.removeEventListener("pointerup", this.onMouseUp, false);
    this.isActive = false;
  }

  throttledMouseMove = this.throttle(this.onMouseMove, 15);

  changeWhiteboardColor = (key) => {
    const config = {
      "black-marker": { color: "black", lineWidth: 8 },
      "red-marker": { color: "red", lineWidth: 8 },
      "green-marker": { color: "darkgreen", lineWidth: 8 },
      "blue-marker": { color: "blue", lineWidth: 8 },
      eraser: { color: "white", lineWidth: 50 },
    };

    const { color, lineWidth } = config[key] || config["black-marker"];

    this.drawColor = color;
    this.drawingContext.lineWidth = lineWidth;
  };
}
