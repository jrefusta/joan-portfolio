import * as THREE from "three";
import Experience from "./Experience.js";

export default class Whiteboard {
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
    this.mouse = this.experience.mouse;
    this.whiteboardGroup = new THREE.Group();
    this.drawStartPos = new THREE.Vector2(-1, -1);
    this.raycaster = this.experience.raycaster;
    this.drawColor = "black";
    this.isActive = false;
    this.positionsToDraw = [];
    this.model = {};
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
      });
    });
    this.model.mesh = this.resources.items.whiteboard.scene;
    this.model.bakedDayTexture = this.resources.items._baked1;
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
    this.whiteboardGroup.add(this.model.mesh);
    this.model.mesh.name = "whiteboard";
    this.scene.add(this.model.mesh);
  }

  setWhiteboard() {
    this.whiteboardMaterial = new THREE.MeshBasicMaterial();
    const whiteboardGeom = new THREE.PlaneGeometry(2.6, 1.82);
    whiteboardGeom.computeBoundingBox();
    whiteboardGeom.computeVertexNormals();
    const planeMesh = new THREE.Mesh(whiteboardGeom, this.whiteboardMaterial);
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

      // Convertir el canvas en una CanvasTexture de Three.js
      this.canvasTexture = new THREE.CanvasTexture(this.drawingCanvas);

      this.canvasTexture.anisotropy =
        this.renderer.instance.capabilities.getMaxAnisotropy();

      this.canvasTexture.generateMipmaps = true;

      this.canvasTexture.magFilter = THREE.LinearFilter;
      this.canvasTexture.minFilter = THREE.LinearMipmapLinearFilter;

      // Configurar la textura como map del material
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
    this.canvasTexture = new THREE.CanvasTexture(this.drawingCanvas);

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
    this.positionsToDraw.push(this.drawStartPos.x, this.drawStartPos.y, x, y);
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
      this.experience.navigation.orbitControls.enabled = false;
      this.webglElement.style.pointerEvents = "none";
    } else {
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
    // Configurar eventos del mouse
    window.addEventListener("pointerdown", this.onMouseDown, false);
    window.addEventListener("pointermove", this.throttledMouseMove, false);
    window.addEventListener("pointerup", this.onMouseUp, false);
    window.addEventListener("keydown", this.onKeyDown, false);
    this.isActive = true;
  }

  deactivateControls() {
    // Configurar eventos del mouse
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

  onKeyDown = (e) => {
    // Crear un enlace de descarga
    const a = document.createElement("a");

    // Convertir el canvas en una URL de datos (Data URL)
    const dataURL = this.drawingCanvas.toDataURL("image/png");

    // Establecer la URL de datos como el href del enlace
    a.href = dataURL;
    a.download = "texture_paint.png"; // Nombre del archivo que se descargará

    // Agregar el enlace al DOM y simular un clic para iniciar la descarga
    document.body.appendChild(a);
    a.click();

    // Eliminar el enlace del DOM después de la descarga
    document.body.removeChild(a);
  };
}
