import * as THREE from "three";
import Experience from "./Experience.js";
import OrbitControlsCustom from "./OrbitControlsCustom.js";
import gsap from "gsap";

export default class Navigation {
  constructor() {
    this.experience = new Experience();
    this.webglElement = this.experience.webglElement;
    this.camera = this.experience.camera;
    this.config = this.experience.config;
    this.time = this.experience.time;
    this.cameraIsMoving = false;
    this.setNavigation();
    document.addEventListener("keydown", this.onKeyDown, false);
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
  }
  onKeyDown = (e) => {
    console.log(this.camera);
    if (e.key == "1") {
      this.cameraIsMoving = true;
      this.orbitControls.enabled = false;
      this.moveCamera(-1.7, 5.5, 2.3009, 1);
      this.rotateCamera(
        -0.17756084520729903,
        -0.6844502511134536,
        -0.17756084520729903,
        0.6844502511134535,
        1.15
      );
      this.changeTarget(3.25776, 2.74209, 2.3009, 1);
    }
    if (e.key == "2") {
      this.cameraIsMoving = true;
      this.orbitControls.enabled = false;

      this.moveCamera(-3.3927, 5.18774, 4.61366, 1);
      this.rotateCamera(-0.08802977047890838, 0, 0, 0.9961178441878403, 1.15);
      this.changeTarget(-3.3927, 3.18774, -4.61366, 1);
    }

    if (e.key == "3") {
      this.cameraIsMoving = true;
      this.orbitControls.enabled = false;
      this.moveCamera(1.06738, 2.50725, -0.5, 1);
      this.rotateCamera(0, 0, 0, 1, 1.15);
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
        1.15
      );
      this.changeTarget(2.47898, 2.50716, -4.14566, 1);
    }
    if (e.key == "Escape") {
      this.cameraIsMoving = false;
    }
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

  rotateCamera(x, y, z, w, duration) {
    gsap.to(this.camera.instance.quaternion, {
      x,
      y,
      z,
      w,
      duration,
      ease: "sine.out",
      onComplete: () => {
        this.orbitControls.enabled = true;
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

  update() {
    this.orbitControls.update();
  }
}
