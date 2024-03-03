import * as THREE from "three";
import Experience from "./Experience.js";
import OrbitControlsCustom from "./OrbitControlsCustom.js";
import gsap from "gsap";

const elementsToRaycast = [
  "rubikGroup",
  "linkedin",
  "github",
  "itchio",
  "arcadeMachine",
  "arcadeMachineScreen",
  "leftMonitor",
  "leftMonitorScreen",
  "rightMonitor",
  "rightMonitorScreen",
  "whiteboard",
  "whiteboardCanvas",
];
export default class Navigation {
  constructor() {
    this.experience = new Experience();
    this.bannerLinks = document.querySelectorAll(".banner-link");
    this.webglElement = this.experience.webglElement;
    this.camera = this.experience.camera;
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.mouse = this.experience.mouse;
    this.cameraIsMoving = false;
    this.rubiksMode = false;
    this.currentStage = null;
    this.outlinePass = this.experience.renderer.postProcess.outlinePass;
    this.raycaster = this.experience.raycaster;
    this.selectedObjects = [];
    this.startClick = new THREE.Vector2(null, null);
    this.isCameraMoving = false;
    this.banner = document.querySelector(".banner");
    this.setNavigation();
    this.activateControls();
  }

  setNavigation() {
    this.orbitControls = new OrbitControlsCustom(
      this.camera.instance,
      this.webglElement
    );
    this.orbitControls.enabled = true;
    this.orbitControls.screenSpacePanning = true;
    this.orbitControls.enableKeys = false;
    this.orbitControls.zoomSpeed = 1;
    this.orbitControls.enableDamping = true;
    this.orbitControls.dampingFactor = 0.05;
    this.orbitControls.rotateSpeed = 0.4;
    this.orbitControls.maxAzimuthAngle = Math.PI * 2;
    this.orbitControls.minAzimuthAngle = -Math.PI / 2;
    this.orbitControls.minPolarAngle = Math.PI / 6;
    this.orbitControls.maxPolarAngle = Math.PI / 2;
    this.orbitControls.minDistance = 2;
    this.orbitControls.maxDistance = 35;

    this.orbitControls.target.y = 2.5;
    this.orbitControls.update();
    this.orbitControls.addEventListener("change", this.handleBannerVisibility);
    this.bannerLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (!this.isCameraMoving && this.currentStage !== link.id) {
          this.flyToPosition(link.id);
        }
      });
    });
  }

  activateControls() {
    window.addEventListener("keydown", this.onKeyDown, false);
    window.addEventListener("pointermove", this.onMouseMove, false);
    window.addEventListener("pointerdown", this.onMouseDown, false);
    window.addEventListener("pointerup", this.onMouseUp, false);
  }

  deactivateControls() {
    window.removeEventListener("keydown", this.onKeyDown, false);
    //window.removeEventListener("pointermove", this.onMouseMove, false);
    window.removeEventListener("pointerdown", this.onMouseDown, false);
    window.removeEventListener("pointerup", this.onMouseUp, false);
  }

  checkIntersection() {
    this.raycaster.setFromCamera(this.mouse, this.camera.instance);

    const sceneToRaycast = this.scene.children.filter((child) => {
      return elementsToRaycast.includes(child.name);
    });
    const intersects = this.raycaster.intersectObjects(sceneToRaycast, true);
    if (intersects && intersects.length) {
      const selectedObject = intersects[0].object.parent.isRubik
        ? intersects[0].object.parent.parent
        : intersects[0].object.parent;
      const isNewSelection =
        !this.selectedObjects.length ||
        this.selectedObjects[0].name != selectedObject.name;

      this.selectedObjects = isNewSelection
        ? [selectedObject]
        : this.selectedObjects;
      this.objectRaycasted = this.selectedObjects[0].name;

      this.webglElement.style.cursor = "pointer";
    } else {
      this.objectRaycasted = null;
      this.startClick.set(null, null);
      this.selectedObjects = [];
      this.webglElement.style.cursor = "auto";
    }
    this.outlinePass.selectedObjects = this.selectedObjects;
  }

  getCurrentZoom() {
    const camPosition = this.camera.instance.position;
    const targetPosition = this.orbitControls.target;

    const distance = camPosition.distanceTo(targetPosition);

    return distance;
  }

  onMouseMove = (e) => {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    if (this.currentStage == null && !this.isCameraMoving) {
      this.checkIntersection();
    } else {
      this.objectRaycasted = null;
      this.startClick.set(null, null);
      this.selectedObjects = [];
      this.webglElement.style.cursor = "auto";
    }
    this.handleBannerVisibility();
  };

  onMouseDown = () => {
    this.startClick.x = this.mouse.x;
    this.startClick.y = this.mouse.y;
  };

  clickOnActivity() {
    this.deactivateControls();
    this.webglElement.style.cursor = "auto";
    this.isCameraMoving = true;
    this.outlinePass.selectedObjects = [];
  }

  flyToPosition = (key) => {
    if (key !== "rubikGroup" && this.sceneResult) {
      this.expandScene(this.experience.scene, this.sceneResult);
      this.expandScene(this.experience.cssScene, this.cssSceneResult);
      this.expandScene(this.experience.cssScene1, this.cssScene1Result);
      this.expandScene(this.experience.cssScene2, this.cssScene2Result);
      this.changeTarget(0, 2.5, 0, 1);
      this.experience.world.rubiksCube.resetOriginalConfig();
    }
    switch (key) {
      case "arcadeMachine":
        this.cameraIsMoving = true;
        this.orbitControls.enabled = false;
        this.moveCamera(-1.7, 5.5, 2.3009, 1);
        this.rotateCamera(
          -0.17756084520729903,
          -0.6844502511134536,
          -0.17756084520729903,
          0.6844502511134535,
          1.15,
          key
        );
        this.changeTarget(3.25776, 2.74209, 2.3009, 1);
        this.clickOnActivity();
        break;
      case "leftMonitor":
        this.cameraIsMoving = true;
        this.orbitControls.enabled = false;
        this.moveCamera(1.06738, 2.50725, -0.5, 1);
        this.rotateCamera(0, 0, 0, 1, 1.15, key);
        this.changeTarget(1.06738, 2.50725, -4.23009, 1);
        this.clickOnActivity();
        break;
      case "rightMonitor":
        this.cameraIsMoving = true;
        this.orbitControls.enabled = false;
        this.moveCamera(1, 2.50725, -0.5, 1);
        this.rotateCamera(
          -0.000011226346092707907,
          -0.19150733569303596,
          -0.000002190470652534808,
          0.9814911819496523,
          1.15,
          key
        );
        this.changeTarget(2.47898, 2.50716, -4.14566, 1);
        this.clickOnActivity();
        break;
      case "whiteboard":
        this.cameraIsMoving = true;
        this.orbitControls.enabled = false;
        this.moveCamera(-3.3927, 5.18774, 4.61366, 1);
        this.rotateCamera(
          -0.08802977047890838,
          0,
          0,
          0.9961178441878403,
          1.15,
          key
        );
        this.changeTarget(-3.3927, 3.18774, -4.61366, 1);
        this.clickOnActivity();
        break;
      case "rubikGroup":
        this.rubiksMode = true;
        this.orbitControls.enabled = false;
        this.experience.world.rubiksCube.reubicateCube();
        this.sceneResult = this.shrinkScene(this.experience.scene);
        this.cssSceneResult = this.shrinkScene(this.experience.cssScene);
        this.cssScene1Result = this.shrinkScene(this.experience.cssScene1);
        this.cssScene2Result = this.shrinkScene(this.experience.cssScene2);
        this.moveCamera(-23, 17, 23, 0.3);
        this.rotateCamera(
          -0.19229498096591757,
          -0.3743024144764491,
          -0.07965118909235921,
          0.9036459654580388,
          1.15,
          key
        );
        this.changeTarget(0, 0, 0, 1);
        this.clickOnActivity();
        break;
      case "linkedin":
        window.open("https://www.linkedin.com/in/joan-ramos-refusta/");
        break;
      case "github":
        window.open("https://github.com/jrefusta");
        break;
      case "itchio":
        window.open("https://jrefusta.itch.io/");
        break;
    }
  };
  onMouseUp = () => {
    if (
      this.startClick.x == this.mouse.x &&
      this.startClick.y == this.mouse.y
    ) {
      if (
        !this.isCameraMoving &&
        this.objectRaycasted !== null &&
        this.currentStage !== this.objectRaycasted
      ) {
        console.log(
          this.isCameraMoving,
          this.currentStage,
          this.objectRaycasted
        );
        this.flyToPosition(this.objectRaycasted);
      }
      /* switch (this.objectRaycasted) {
        case "arcadeMachine":
          this.cameraIsMoving = true;
          this.orbitControls.enabled = false;
          this.moveCamera(-1.7, 5.5, 2.3009, 1);
          this.rotateCamera(
            -0.17756084520729903,
            -0.6844502511134536,
            -0.17756084520729903,
            0.6844502511134535,
            1.15,
            this.objectRaycasted
          );
          this.changeTarget(3.25776, 2.74209, 2.3009, 1);
          this.clickOnActivity();
          break;
        case "leftMonitor":
          this.cameraIsMoving = true;
          this.orbitControls.enabled = false;
          this.moveCamera(1.06738, 2.50725, -0.5, 1);
          this.rotateCamera(0, 0, 0, 1, 1.15, this.objectRaycasted);
          this.changeTarget(1.06738, 2.50725, -4.23009, 1);
          this.clickOnActivity();
          break;
        case "rightMonitor":
          this.cameraIsMoving = true;
          this.orbitControls.enabled = false;
          this.moveCamera(1, 2.50725, -0.5, 1);
          this.rotateCamera(
            -0.000011226346092707907,
            -0.19150733569303596,
            -0.000002190470652534808,
            0.9814911819496523,
            1.15,
            this.objectRaycasted
          );
          this.changeTarget(2.47898, 2.50716, -4.14566, 1);
          this.clickOnActivity();
          break;
        case "whiteboard":
          this.cameraIsMoving = true;
          this.orbitControls.enabled = false;
          this.moveCamera(-3.3927, 5.18774, 4.61366, 1);
          this.rotateCamera(
            -0.08802977047890838,
            0,
            0,
            0.9961178441878403,
            1.15,
            this.objectRaycasted
          );
          this.changeTarget(-3.3927, 3.18774, -4.61366, 1);
          this.clickOnActivity();
          break;
        case "rubikGroup":
          this.rubiksMode = true;
          this.orbitControls.enabled = false;
          this.experience.world.rubiksCube.reubicateCube();
          this.sceneResult = this.shrinkScene(this.experience.scene);
          this.cssSceneResult = this.shrinkScene(this.experience.cssScene);
          this.cssScene1Result = this.shrinkScene(this.experience.cssScene1);
          this.cssScene2Result = this.shrinkScene(this.experience.cssScene2);
          this.moveCamera(-23, 17, 23, 0.3);
          this.rotateCamera(
            -0.19229498096591757,
            -0.3743024144764491,
            -0.07965118909235921,
            0.9036459654580388,
            1.15,
            this.objectRaycasted
          );
          this.changeTarget(0, 0, 0, 1);
          this.clickOnActivity();
          break;
        case "linkedin":
          window.open("https://www.linkedin.com/in/joan-ramos-refusta/");
          break;
        case "github":
          window.open("https://github.com/jrefusta");
          break;
        case "itchio":
          window.open("https://jrefusta.itch.io/");
          break;
      } */
    }
  };

  /* onKeyDown = (e) => {
    if (e.key == "1") {
      this.cameraIsMoving = true;
      this.orbitControls.enabled = false;
      this.moveCamera(-1.7, 5.5, 2.3009, 1);
      this.rotateCamera(
        -0.17756084520729903,
        -0.6844502511134536,
        -0.17756084520729903,
        0.6844502511134535,
        1.15,
        "Arcade"
      );
      this.changeTarget(3.25776, 2.74209, 2.3009, 1);
    }
    if (e.key == "2") {
      this.cameraIsMoving = true;
      this.orbitControls.enabled = false;

      this.moveCamera(-3.3927, 5.18774, 4.61366, 1);
      this.rotateCamera(
        -0.08802977047890838,
        0,
        0,
        0.9961178441878403,
        1.15,
        "Whiteboard"
      );
      this.changeTarget(-3.3927, 3.18774, -4.61366, 1);
    }

    if (e.key == "3") {
      this.cameraIsMoving = true;
      this.orbitControls.enabled = false;
      this.moveCamera(1.06738, 2.50725, -0.5, 1);
      this.rotateCamera(0, 0, 0, 1, 1.15, "LeftMonitor");
      this.changeTarget(1.06738, 2.50725, -4.23009, 1);
    }
    if (e.key == "4") {
      this.cameraIsMoving = true;
      this.orbitControls.enabled = false;
      this.moveCamera(1, 2.50725, -0.5, 1);
      this.rotateCamera(
        -0.000011226346092707907,
        -0.19150733569303596,
        -0.000002190470652534808,
        0.9814911819496523,
        1.15,
        "RightMonitor"
      );
      this.changeTarget(2.47898, 2.50716, -4.14566, 1);
    }
    if (e.key == "5") {
      this.rubiksMode = true;
      this.orbitControls.enabled = false;
      this.experience.world.rubiksCube.reubicateCube();
      this.sceneResult = this.shrinkScene(this.experience.scene);
      this.cssSceneResult = this.shrinkScene(this.experience.cssScene);
      this.cssScene1Result = this.shrinkScene(this.experience.cssScene1);
      this.cssScene2Result = this.shrinkScene(this.experience.cssScene2);
      this.moveCamera(-23, 17, 23, 0.3);
      this.rotateCamera(
        -0.19229498096591757,
        -0.3743024144764491,
        -0.07965118909235921,
        0.9036459654580388,
        1.15,
        "Rubik"
      );
      this.changeTarget(0, 0, 0, 1);
    }
    if (e.key == "6") {
      this.orbitControls.enabled = true;
      this.expandScene(this.experience.scene, this.sceneResult);
      this.expandScene(this.experience.cssScene, this.cssSceneResult);
      this.expandScene(this.experience.cssScene1, this.cssScene1Result);
      this.expandScene(this.experience.cssScene2, this.cssScene2Result);
      this.changeTarget(0, 2.5, 0, 1);
      this.experience.world.rubiksCube.resetOriginalConfig();
    }
    if (e.key == "Escape") {
      this.cameraIsMoving = false;
    }
  }; */

  moveCamera(x, y, z, duration) {
    gsap.to(this.camera.instance.position, {
      x,
      y,
      z,
      duration,
      ease: "sine.out",
    });
  }

  rotateCamera(x, y, z, w, duration, stage) {
    gsap.to(this.camera.instance.quaternion, {
      x,
      y,
      z,
      w,
      duration,
      ease: "sine.out",
      onComplete: () => {
        if (!this.rubiksMode) {
          this.orbitControls.enabled = true;
        }
        this.isCameraMoving = false;
        this.currentStage = stage;
        this.updateStage();
        this.orbitControls.addEventListener("change", this.handleChangeEvent);
      },
    });
  }

  changeTarget(x, y, z, duration) {
    gsap.to(this.orbitControls.target, {
      x,
      y,
      z,
      duration,
      ease: "sine.out",
    });
  }

  shrinkScene(scene) {
    const originalPos = [];
    const originalScale = [];
    scene.children.forEach((child) => {
      if (
        child.type != "PerspectiveCamera" &&
        child.name != "rubikGroup" &&
        child.type != "DirectionalLight"
      ) {
        originalPos.push(child.position.clone());
        gsap.to(child.position, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1,
          ease: "sine.out",
        });
        originalScale.push(child.scale.clone());
        gsap.to(child.scale, {
          x: 0.0001,
          y: 0.0001,
          z: 0.0001,
          duration: 1,
          ease: "sine.out",
        });
      } else {
        originalPos.push(null);
        originalScale.push(null);
      }
    });
    return { originalPos, originalScale };
  }

  expandScene(scene, result) {
    scene.children.forEach((child, i) => {
      if (
        child.type != "PerspectiveCamera" &&
        child.name != "rubikGroup" &&
        child.type != "DirectionalLight" &&
        child.name != "rubikPivot"
      ) {
        if (result.originalPos !== null) {
          gsap.to(child.position, {
            x: result.originalPos[i].x,
            y: result.originalPos[i].y,
            z: result.originalPos[i].z,
            duration: 1,
            ease: "sine.out",
          });
        }
        if (result.originalScale !== null) {
          gsap.to(child.scale, {
            x: result.originalScale[i].x,
            y: result.originalScale[i].y,
            z: result.originalScale[i].z,
            duration: 1,
            ease: "sine.out",
          });
        }
      }
    });
  }

  handleChangeEvent = () => {
    if (this.currentStage != null) {
      console.log("Deactivate", this.currentStage);
      switch (this.currentStage) {
        case "arcadeMachine":
          this.experience.world.arcadeScreen.deactivateControls();
          break;
        case "whiteboard":
          this.experience.world.whiteboard.deactivateControls();
          break;
        case "leftMonitor":
          this.experience.world.leftMonitorScreen.deactivateControls();
          break;
        case "rightMonitor":
          this.experience.world.rightMonitorScreen.deactivateControls();
          break;
        case "rubikGroup":
          this.experience.world.rubiksCube.deactivateControls();
          break;
      }
      this.currentStage = null;
      this.activateControls();
      this.orbitControls.removeEventListener("change", this.handleChangeEvent);
    }
  };

  handleBannerVisibility = () => {
    const currentZoom = this.getCurrentZoom();
    // Hide banner
    if (this.currentStage === null) {
      if (currentZoom < 25 && this.mouse.y < 0.9) {
        this.banner.style.top = "-60px";
      } else {
        this.banner.style.top = "0px";
      }
    } else {
      if (this.mouse.y < 0.9) {
        this.banner.style.top = "-60px";
      } else {
        this.banner.style.top = "0px";
      }
    }
  };

  updateStage() {
    console.log("UPDATESTAGE", this.currentStage);
    switch (this.currentStage) {
      case "arcadeMachine":
        this.experience.world.arcadeScreen.activateControls();
        break;
      case "whiteboard":
        this.experience.world.whiteboard.activateControls();
        break;
      case "leftMonitor":
        this.experience.world.leftMonitorScreen.activateControls();
        break;
      case "rightMonitor":
        this.experience.world.rightMonitorScreen.activateControls();
        break;
      case "rubikGroup":
        this.experience.world.rubiksCube.activateControls();
        break;
    }
  }
  update() {
    this.orbitControls.update();
  }
}
