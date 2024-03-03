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
    planeMesh.receiveShadow = true;
    planeMesh.castShadow = true;
    planeMesh.name = "whiteboardCanvas";
    this.model.mesh.add(planeMesh);
    /* this.scene.add(this.whiteboardGroup); */

    //const drawingCanvas = document.getElementById("drawing-canvas");
    const drawingCanvas = document.getElementById("drawing-canvas");
    this.drawingContext = drawingCanvas.getContext("2d");
    this.drawingContext.lineWidth = 8;
    this.drawingContext.imageSmoothingQuality = "high";
    // draw white background

    this.drawingContext.fillStyle = "white";
    this.drawingContext.fillRect(0, 0, 2048, 1024);

    // set canvas as material.map (this could be done to any map, bump, displacement etc.)
    drawingCanvas.needsUpdate = true;
    const canvasTexture = new THREE.CanvasTexture(drawingCanvas);
    canvasTexture.minFilter = THREE.LinearMipmapNearestFilter; // O podrías usar THREE.LinearMipmapNearestFilter según tus necesidades

    this.whiteboardMaterial.map = canvasTexture;
    this.whiteboardMaterial.map.needsUpdate = true;
  }

  throttle(func, delay) {
    let timeoutId;
    return function (...args) {
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

    this.drawingContext.beginPath();
    this.drawingContext.moveTo(this.drawStartPos.x, this.drawStartPos.y);
    //this.positionsToDraw.push(this.drawStartPos.x, this.drawStartPos.y, x, y);
    //const bufferArray = new Float32Array(this.positionsToDraw);
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
    window.removeEventListener("keydown", this.onKeyDown, false);
    this.isActive = false;
  }

  throttledMouseMove = this.throttle(this.onMouseMove, 15);

  onKeyDown = (event) => {
    if (event.key == "0") {
      this.drawColor = "black";
    } else if (event.key == "1") {
      this.drawColor = "red";
    } else if (event.key == "2") {
      this.drawColor = "darkgreen";
    } else if (event.key == "3") {
      this.drawColor = "blue";
    }
  };
}
