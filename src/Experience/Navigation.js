import { Vector2 } from "three";
import Experience from "./Experience.js";
import OrbitControlsCustom from "./OrbitControlsCustom.js";
import gsap from "gsap";
import {
  ELEMENTS_TO_RAYCAST,
  ORBIT_CONTROLS_CONFIG,
  CAMERA_POSITION,
  CAMERA_QUATERNION,
  CAMERA_TARGET,
  ARCADE_MACHINE_CAMERA_POSITION,
  ARCADE_MACHINE_CAMERA_QUATERNION,
  ARCADE_MACHINE_CAMERA_TARGET,
  LEFT_MONITOR_CAMERA_POSITION,
  LEFT_MONITOR_CAMERA_QUATERNION,
  LEFT_MONITOR_CAMERA_TARGET,
  RIGHT_MONITOR_CAMERA_TARGET,
  RIGHT_MONITOR_CAMERA_POSITION,
  WHITEBOARD_CAMERA_POSITION,
  WHITEBOARD_CAMERA_QUATERNION,
  WHITEBOARD_CAMERA_TARGET,
  RIGHT_MONITOR_CAMERA_QUATERNION,
  RUBIK_TARGET,
  LINKEDIN_URL,
  GITHUB_URL,
  ITCHIO_URL,
} from "./constants.js";

export default class Navigation {
  constructor() {
    this.experience = new Experience();
    this.bannerLinks = document.querySelectorAll(".banner-link");
    this.backButton = document.getElementById("back-button");
    this.whiteboardButons = document.getElementById("whiteboard-buttons");
    this.banner = document.querySelector(".banner");
    this.rubikMessage = document.querySelector(".rubik-message");
    this.webglElement = this.experience.webglElement;
    this.camera = this.experience.camera;
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.mouse = this.experience.mouse;
    this.currentStage = null;
    this.outlinePass = this.experience.renderer.postProcess.outlinePass;
    this.raycaster = this.experience.raycaster;
    this.selectedObjects = [];
    this.startClick = new Vector2(null, null);
    this.isCameraMoving = false;
    this.setNavigation();
    this.activateControls();
  }

  setNavigation() {
    this.orbitControls = new OrbitControlsCustom(
      this.camera.instance,
      this.webglElement
    );

    this.orbitControls.enabled = ORBIT_CONTROLS_CONFIG.enabled;
    this.orbitControls.screenSpacePanning =
      ORBIT_CONTROLS_CONFIG.screenSpacePanning;
    this.orbitControls.enableKeys = ORBIT_CONTROLS_CONFIG.enableKeys;
    this.orbitControls.zoomSpeed = ORBIT_CONTROLS_CONFIG.zoomSpeed;
    this.orbitControls.enableDamping = ORBIT_CONTROLS_CONFIG.enableDamping;
    this.orbitControls.dampingFactor = ORBIT_CONTROLS_CONFIG.dampingFactor;
    this.orbitControls.rotateSpeed = ORBIT_CONTROLS_CONFIG.rotateSpeed;
    this.orbitControls.maxAzimuthAngle = ORBIT_CONTROLS_CONFIG.maxAzimuthAngle;
    this.orbitControls.minAzimuthAngle = ORBIT_CONTROLS_CONFIG.minAzimuthAngle;
    this.orbitControls.minPolarAngle = ORBIT_CONTROLS_CONFIG.minPolarAngle;
    this.orbitControls.maxPolarAngle = ORBIT_CONTROLS_CONFIG.maxPolarAngle;
    this.orbitControls.minDistance = ORBIT_CONTROLS_CONFIG.minDistance;
    this.orbitControls.maxDistance = ORBIT_CONTROLS_CONFIG.maxDistance;
    this.orbitControls.target.y = ORBIT_CONTROLS_CONFIG.target.y;
    this.orbitControls.update();
    this.orbitControls.addEventListener("change", this.handleBannerVisibility);
    this.bannerLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (
          this.currentStage == "rubikGroup" &&
          this.experience.world.rubiksCube.isMoving
        ) {
          return;
        }
        if (!this.isCameraMoving && this.currentStage !== link.id) {
          this.flyToPosition(link.id);
        }
      });
    });

    this.backButton.addEventListener("click", () => {
      if (this.isCameraMoving) {
        return;
      }
      if (
        this.currentStage == "rubikGroup" &&
        !this.experience.world.rubiksCube.isMoving
      ) {
        this.bringSceneBack();
        this.experience.world.rubiksCube.resetOriginalConfig();
        this.activateScene();
      } else if (
        this.currentStage !== null &&
        this.currentStage !== "rubikGroup"
      ) {
        if (this.whiteboardButons.classList.contains("show-button-row")) {
          this.whiteboardButons.classList.remove("show-button-row");
        }
        this.orbitControls.enableDamping = false;
        this.orbitControls.enabled = false;
        const audioManager = this.experience.world.audioManager;
        audioManager.playSingleAudio("whoosh", 0.2);
        this.moveCamera(
          CAMERA_POSITION.x,
          CAMERA_POSITION.y,
          CAMERA_POSITION.z,
          1
        );
        this.rotateCamera(
          CAMERA_QUATERNION.x,
          CAMERA_QUATERNION.y,
          CAMERA_QUATERNION.z,
          CAMERA_QUATERNION.w,
          1.15,
          null
        );
        this.changeTarget(CAMERA_TARGET.x, CAMERA_TARGET.y, CAMERA_TARGET.z, 1);
        this.backButton.classList.remove("show-back-button");
      }
    });
  }

  rubikWon = () => {
    this.bringSceneBack();
    this.activateScene();
  };

  bringSceneBack = () => {
    const audioManager = this.experience.world.audioManager;
    audioManager.playSingleAudio("whoosh", 0.2);
    if (this.rubikMessage.classList.contains("show-rubik-message")) {
      this.rubikMessage.classList.remove("show-rubik-message");
    }
    this.orbitControls.enableDamping = false;
    this.orbitControls.enabled = false;
    this.expandScene(this.experience.scene, this.sceneResult);
    this.expandScene(
      this.experience.cssArcadeMachineScene,
      this.cssArcadeMachineSceneResult
    );
    this.expandScene(
      this.experience.cssLeftMonitorScene,
      this.cssLeftMonitorSceneResult
    );
    this.expandScene(
      this.experience.cssRightMonitorScene,
      this.cssRightMonitorSceneResult
    );
    this.changeTarget(CAMERA_TARGET.x, CAMERA_TARGET.y, CAMERA_TARGET.z, 1);
    this.backButton.classList.remove("show-back-button");
  };
  activateControls() {
    window.addEventListener("keydown", this.onKeyDown, false);
    window.addEventListener("pointermove", this.onMouseMove, false);
    window.addEventListener("pointerdown", this.onMouseDown, false);
    window.addEventListener("pointerup", this.onMouseUp, false);
  }

  deactivateControls() {
    window.removeEventListener("keydown", this.onKeyDown, false);
    window.removeEventListener("pointerdown", this.onMouseDown, false);
    window.removeEventListener("pointerup", this.onMouseUp, false);
  }

  checkIntersection() {
    this.raycaster.setFromCamera(this.mouse, this.camera.instance);

    const sceneToRaycast = this.scene.children.filter((child) => {
      return ELEMENTS_TO_RAYCAST.includes(child.name);
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
    if (
      this.currentStage == null &&
      !this.isCameraMoving &&
      this.experience.world?.rubiksCube?.isPlaced &&
      !this.experience.world?.confetti?.hasExploded &&
      this.experience.world.resources.loader.resourcesLoaded
    ) {
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
    const audioManager = this.experience.world.audioManager;
    if (key !== "rubikGroup" && this.currentStage == "rubikGroup") {
      this.rubikMessage.classList.remove("show-rubik-message");
      this.bringSceneBack();
      this.experience.world.rubiksCube.resetOriginalConfig();
      this.activateScene();
    }
    if (key != "whiteboard") {
      if (this.whiteboardButons.classList.contains("show-button-row")) {
        this.whiteboardButons.classList.remove("show-button-row");
      }
    }
    if (this.currentStage) {
      this.deactivateActivityControls();
    }
    switch (key) {
      case "arcadeMachine":
        audioManager.playSingleAudio("whoosh", 0.2);
        this.backButton.classList.add("show-back-button");
        this.orbitControls.enableDamping = false;
        this.orbitControls.enabled = false;
        this.moveCamera(
          ARCADE_MACHINE_CAMERA_POSITION.x,
          ARCADE_MACHINE_CAMERA_POSITION.y,
          ARCADE_MACHINE_CAMERA_POSITION.z,
          1
        );
        this.rotateCamera(
          ARCADE_MACHINE_CAMERA_QUATERNION.x,
          ARCADE_MACHINE_CAMERA_QUATERNION.y,
          ARCADE_MACHINE_CAMERA_QUATERNION.z,
          ARCADE_MACHINE_CAMERA_QUATERNION.w,
          1.15,
          key
        );
        this.changeTarget(
          ARCADE_MACHINE_CAMERA_TARGET.x,
          ARCADE_MACHINE_CAMERA_TARGET.y,
          ARCADE_MACHINE_CAMERA_TARGET.z,
          1
        );
        this.clickOnActivity();
        break;
      case "leftMonitor":
        audioManager.playSingleAudio("whoosh", 0.2);
        this.backButton.classList.add("show-back-button");
        this.orbitControls.enableDamping = false;
        this.orbitControls.enabled = false;
        this.moveCamera(
          LEFT_MONITOR_CAMERA_POSITION.x,
          LEFT_MONITOR_CAMERA_POSITION.y,
          LEFT_MONITOR_CAMERA_POSITION.z,
          1
        );
        this.rotateCamera(
          LEFT_MONITOR_CAMERA_QUATERNION.x,
          LEFT_MONITOR_CAMERA_QUATERNION.y,
          LEFT_MONITOR_CAMERA_QUATERNION.z,
          LEFT_MONITOR_CAMERA_QUATERNION.w,
          1.15,
          key
        );
        this.changeTarget(
          LEFT_MONITOR_CAMERA_TARGET.x,
          LEFT_MONITOR_CAMERA_TARGET.y,
          LEFT_MONITOR_CAMERA_TARGET.z,
          1
        );
        this.clickOnActivity();
        break;
      case "rightMonitor":
        audioManager.playSingleAudio("whoosh", 0.2);
        this.backButton.classList.add("show-back-button");
        this.orbitControls.enableDamping = false;
        this.orbitControls.enabled = false;

        this.moveCamera(
          RIGHT_MONITOR_CAMERA_POSITION.x,
          RIGHT_MONITOR_CAMERA_POSITION.y,
          RIGHT_MONITOR_CAMERA_POSITION.z,
          1
        );
        this.rotateCamera(
          RIGHT_MONITOR_CAMERA_QUATERNION.x,
          RIGHT_MONITOR_CAMERA_QUATERNION.y,
          RIGHT_MONITOR_CAMERA_QUATERNION.z,
          RIGHT_MONITOR_CAMERA_QUATERNION.w,
          1.15,
          key
        );
        this.changeTarget(
          RIGHT_MONITOR_CAMERA_TARGET.x,
          RIGHT_MONITOR_CAMERA_TARGET.y,
          RIGHT_MONITOR_CAMERA_TARGET.z,
          1
        );
        this.clickOnActivity();
        break;
      case "whiteboard":
        audioManager.playSingleAudio("whoosh", 0.2);
        this.backButton.classList.add("show-back-button");
        this.whiteboardButons.classList.add("show-button-row");
        this.orbitControls.enableDamping = false;
        this.orbitControls.enabled = false;
        this.moveCamera(
          WHITEBOARD_CAMERA_POSITION.x,
          WHITEBOARD_CAMERA_POSITION.y,
          WHITEBOARD_CAMERA_POSITION.z,
          1
        );
        this.rotateCamera(
          WHITEBOARD_CAMERA_QUATERNION.x,
          WHITEBOARD_CAMERA_QUATERNION.y,
          WHITEBOARD_CAMERA_QUATERNION.z,
          WHITEBOARD_CAMERA_QUATERNION.w,
          1.15,
          key
        );
        this.changeTarget(
          WHITEBOARD_CAMERA_TARGET.x,
          WHITEBOARD_CAMERA_TARGET.y,
          WHITEBOARD_CAMERA_TARGET.z,
          1
        );
        this.clickOnActivity();
        break;
      case "rubikGroup":
        audioManager.playSingleAudio("whoosh", 0.2);
        this.rubikMessage.classList.add("show-rubik-message");
        this.backButton.classList.add("show-back-button");
        this.orbitControls.enableDamping = false;
        this.orbitControls.enabled = false;
        this.experience.world.rubiksCube.reubicateCube();
        this.sceneResult = this.shrinkScene(this.experience.scene);
        this.cssArcadeMachineSceneResult = this.shrinkScene(
          this.experience.cssArcadeMachineScene
        );
        this.cssLeftMonitorSceneResult = this.shrinkScene(
          this.experience.cssLeftMonitorScene
        );
        this.cssRightMonitorSceneResult = this.shrinkScene(
          this.experience.cssRightMonitorScene
        );
        this.moveCamera(
          CAMERA_POSITION.x,
          CAMERA_POSITION.y,
          CAMERA_POSITION.z,
          0.3
        );
        this.rotateCamera(
          CAMERA_QUATERNION.x,
          CAMERA_QUATERNION.y,
          CAMERA_QUATERNION.z,
          CAMERA_QUATERNION.w,
          1.15,
          key
        );
        this.changeTarget(RUBIK_TARGET.x, RUBIK_TARGET.y, RUBIK_TARGET.z, 1);
        this.clickOnActivity();
        break;
      case "linkedin":
        window.open(LINKEDIN_URL);
        break;
      case "github":
        window.open(GITHUB_URL);
        break;
      case "itchio":
        window.open(ITCHIO_URL);
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
        this.flyToPosition(this.objectRaycasted);
      }
    }
    this.startClick.set(null, null);
  };

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
        this.currentStage = stage;
        if (this.currentStage === null) {
          this.orbitControls.enableDamping = true;
          this.orbitControls.enabled = true;
        }
        this.isCameraMoving = false;
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
        child.type != "DirectionalLight" &&
        child.type != "AmbientLight" &&
        child.name != "rubikPivot"
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
        child.type != "AmbientLight" &&
        child.name != "rubikPivot"
      ) {
        if (result.originalPos[i] !== null) {
          gsap.to(child.position, {
            x: result.originalPos[i].x,
            y: result.originalPos[i].y,
            z: result.originalPos[i].z,
            duration: 1,
            ease: "sine.out",
            onComplete: () => {
              this.orbitControls.enableDamping = true;
              this.orbitControls.enabled = true;
            },
          });
        }
        if (result.originalScale[i] !== null) {
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
    if (this.currentStage != null && this.orbitControls.enabled) {
      if (
        !this.isCameraMoving &&
        this.whiteboardButons.classList.contains("show-button-row")
      ) {
        this.whiteboardButons.classList.remove("show-button-row");
      }
      if (
        !this.isCameraMoving &&
        this.backButton.classList.contains("show-back-button")
      ) {
        this.backButton.classList.remove("show-back-button");
      }
      this.activateScene();
      this.orbitControls.removeEventListener("change", this.handleChangeEvent);
    }
  };

  activateScene() {
    this.deactivateActivityControls();
    this.currentStage = null;
    this.activateControls();
  }

  deactivateActivityControls = () => {
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
  };

  handleBannerVisibility = () => {
    if (!this.experience.world.resources.loader.resourcesLoaded) {
      return;
    }
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
