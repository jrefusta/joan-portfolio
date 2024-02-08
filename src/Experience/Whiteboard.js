import * as THREE from "three";
import Experience from "./Experience.js";
import {
  CSS3DObject,
  CSS3DRenderer,
} from "three/examples/jsm/renderers/CSS3DRenderer.js";

export default class Whiteboard {
  constructor() {
    // this.cssRenderer = new CSS3DRenderer();
    this.cssScene = new THREE.Scene();
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.renderer = this.experience.renderer;
    this.time = this.experience.time;
    this.camera = this.experience.camera;
    this.mouse = new THREE.Vector2(-1, -1);
    this.drawStartPos = new THREE.Vector2(-1, -1);
    this.raycaster = new THREE.Raycaster();
    this.drawColor = "black";
    this.positionsToDraw = [];
    this.setWhiteboard();
  }

  setWhiteboard() {
    /* const container = document.createElement("div");
    container.style.width = "1920px";
    container.style.height = "1080px";
    container.style.opacity = "1";
    const iframe = document.createElement("iframe");
    iframe.onload = () => {
      if (iframe.contentWindow) {
        window.addEventListener("message", (event) => {
          var evt = new CustomEvent(event.data.type, {
            bubbles: true,
            cancelable: false,
          });

          // @ts-ignore
          evt.inComputer = true;
          if (event.data.type === "mousemove") {
            var clRect = iframe.getBoundingClientRect();
            const { top, left, width, height } = clRect;
            const widthRatio = width / IFRAME_SIZE.w;
            const heightRatio = height / IFRAME_SIZE.h;

            // @ts-ignore
            evt.clientX = Math.round(event.data.clientX * widthRatio + left);
            //@ts-ignore
            evt.clientY = Math.round(event.data.clientY * heightRatio + top);
          } else if (event.data.type === "keydown") {
            // @ts-ignore
            evt.key = event.data.key;
          } else if (event.data.type === "keyup") {
            // @ts-ignore
            evt.key = event.data.key;
          }

          iframe.dispatchEvent(evt);
        });
      }
    };
    iframe.src = "https://cobayaunchained.com/";

    iframe.style.width = "1920px";
    iframe.style.height = "1080px";
    iframe.style.padding = 32 + "px";
    iframe.style.boxSizing = "border-box";

    iframe.style.opacity = "1";
    iframe.className = "jitter";
    iframe.id = "computer-screen";
    iframe.name = "TEST";
    iframe.title = "HeffernanOS";

    container.appendChild(iframe);
    // Add iframe to container
    const css3dobject = new CSS3DObject(container);
    css3dobject.scale.set(0.002, 0.002, 0.002);
    //this.cssScene.add(css3dobject);

    this.cssRenderer = new CSS3DRenderer();
    this.cssRenderer.setSize(window.innerWidth, window.innerHeight);
    this.cssRenderer.domElement.style.position = "absolute";
    this.cssRenderer.domElement.style.top = 0;
    // document.querySelector("#css")?.appendChild(this.cssRenderer.domElement);

    const material = new THREE.MeshLambertMaterial();
    material.side = THREE.DoubleSide;
    material.opacity = 0;
    material.transparent = true;
    // NoBlending allows the GL plane to occlude the CSS plane
    material.blending = THREE.NoBlending;

    // Create plane geometry
    const geometry = new THREE.PlaneGeometry(0.8, 0.6);

    // Create the GL plane mesh
    const mesh = new THREE.Mesh(geometry, material);

    // Copy the position, rotation and scale of the CSS plane to the GL plane
    mesh.position.copy(css3dobject.position);
    mesh.rotation.copy(css3dobject.rotation);
    mesh.scale.copy(css3dobject.scale); */
    // Add to gl scene
    //this.scene.add(mesh);

    this.whiteboardMaterial = new THREE.MeshBasicMaterial();
    const whiteboardGeom = new THREE.PlaneGeometry(2.6, 1.82);
    whiteboardGeom.computeBoundingBox();
    whiteboardGeom.computeVertexNormals();
    const planeMesh = new THREE.Mesh(whiteboardGeom, this.whiteboardMaterial);
    planeMesh.position.set(-3.3927, 3.18774, -4.61366);
    planeMesh.receiveShadow = true;
    planeMesh.castShadow = true;
    planeMesh.name = "whiteboard";
    this.scene.add(planeMesh);

    //const drawingCanvas = document.getElementById("drawing-canvas");
    const drawingCanvas = document.getElementById("drawing-canvas");
    this.drawingContext = drawingCanvas.getContext("2d");
    this.drawingContext.lineWidth = 13;
    this.drawingContext.imageSmoothingQuality = "high";
    // draw white background

    this.drawingContext.fillStyle = "white";
    this.drawingContext.fillRect(0, 0, 2048, 1024);

    // set canvas as material.map (this could be done to any map, bump, displacement etc.)
    drawingCanvas.needsUpdate = true;
    this.whiteboardMaterial.map = new THREE.CanvasTexture(drawingCanvas);
    this.whiteboardMaterial.map.needsUpdate = true;

    // Configurar eventos del mouse
    document.addEventListener("mousedown", this.onMouseDown, false);
    document.addEventListener(
      "mousemove",
      this.throttle(this.onMouseMove, 15),
      false
    );
    document.addEventListener("mouseup", this.onMouseUp, false);
    document.addEventListener("keydown", this.onKeyDown, false);
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
    if (!this.camera.instance) {
      return;
    }
    this.raycaster.setFromCamera(this.mouse, this.camera.instance);
    const intersects = this.raycaster.intersectObjects(
      this.scene.children,
      true
    );
    this.objectRaycasted = intersects.length > 0 ? intersects[0] : null;
    // this.cssRenderer.render(this.cssScene, this.camera.instance);
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
      this.objectRaycasted.object.name == "whiteboard"
    ) {
      this.drawing = true;
      this.drawStartPos.set(
        this.objectRaycasted.uv.x * 2048,
        1024 - this.objectRaycasted.uv.y * 1024
      );
    }
  };

  onMouseMove = (event) => {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    if (
      this.drawing &&
      this.objectRaycasted &&
      this.objectRaycasted.uv &&
      this.objectRaycasted.object.name == "whiteboard"
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
