import {
  Group,
  Object3D,
  Vector2,
  AmbientLight,
  DirectionalLight,
  Vector3,
} from "three";
import Experience from "./Experience";
import cubeInfo from "../../static/assets/json/cubeInfo.json";
import { RUBIK_ROTATION_Y } from "./constants.js";

import { gsap } from "gsap";

class RubiksCube {
  constructor(position, scale) {
    this.experience = new Experience();
    this.position = this.originalPos = position;
    this.scale = this.originalScale = scale;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera.instance;
    this.resources = this.experience.resources;
    this.rubikGroup = new Group();
    this.rubikCubes = [];
    this.childrensToRotate = [];
    this.sideToRotate;
    this.layerToRotate;
    this.movesCompletedStack = [];
    this.currentMove;
    this.movementsStack = [];
    this.pivot = new Object3D();
    this.objectRaycasted;
    this.firstClickPosition;
    this.firstClickNormal;
    this.dragging = false;
    this.objectClicked;
    this.isMoving = false;
    this.allCubies = [];
    this.isActive = false;
    this.pointer = new Vector2();
    this.duration = 0.0;
    this.isPlaced = true;
    this.raycaster = this.experience.raycaster;
    this.audioManager = this.experience.world.audioManager;
    this.setRubiksCube();
  }

  setRubiksCube() {
    const object = this.resources.items.rubiksCube.scene;
    object.traverse((child) => {
      if (child.isMesh) {
        child.material.envMap = this.resources.items.cubeTexture;
      }
    });
    for (let i = object.children.length - 1; i >= 0; i--) {
      const currentChild = object.children[i];
      const currentInfo = cubeInfo[i];
      Object.assign(currentChild, currentInfo);
      currentChild.isRubik = true;
      currentChild.position.copy(this.position);
      this.rubikCubes.push(currentChild);
      this.rubikGroup.add(currentChild);
    }
    this.rubikGroup.name = "rubikGroup";
    this.scene.add(this.rubikGroup);
    this.movementsStack.push(
      {
        layer: "col",
        number: 1,
        orientation: 1,
      },
      {
        layer: "row",
        number: 3,
        orientation: -1,
      },
      {
        layer: "depth",
        number: 3,
        orientation: 1,
      },
      {
        layer: "col",
        number: 1,
        orientation: -1,
      }
    );
    this.startNextMove();
    this.hasBeenSolved = false;
    this.rubikGroup.position.set(
      this.position.x,
      this.position.y,
      this.position.z
    );
    this.rubikGroup.scale.set(this.scale, this.scale, this.scale);
    this.rubikGroup.rotation.y = RUBIK_ROTATION_Y;

    const light = new AmbientLight(0xffffff, 1);
    const lightD = new DirectionalLight(0xffffff, 1);
    lightD.position.y = 40;
    lightD.position.z = 40;
    lightD.position.x = 40;
    this.scene.add(light);
    this.scene.add(lightD);
  }

  activateControls() {
    this.duration = 0.5;
    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerdown", this.onPointerDown);
    window.addEventListener("pointerup", this.onPointerUp);
    this.isActive = true;
  }

  deactivateControls() {
    this.duration = 0.0;
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerdown", this.onPointerDown);
    window.removeEventListener("pointerup", this.onPointerUp);
    this.isActive = false;
  }

  reubicateCube() {
    this.isPlaced = false;
    this.rubikGroup.traverse((child) => {
      if (child.isMesh) {
        child.renderOrder = 999;
        child.material.transparent = true;
        child.material.depthTest = false;
      }
    });
    this.rubikGroup.children.forEach((child) => {
      gsap.to(child.position, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1,
        ease: "sine.out",
      });
    });
    gsap.to(this.rubikGroup.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1,
      ease: "sine.out",
    });
    gsap.to(this.rubikGroup.position, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1,
      ease: "sine.out",
    });
    gsap.to(this.rubikGroup.rotation, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1,
      ease: "sine.out",
      onComplete: () => {
        this.isActive = true;
      },
    });
    this.position = new Vector3(0, 0, 0);
  }

  resetOriginalConfig() {
    this.rubikGroup.children.forEach((child) => {
      gsap.to(child.position, {
        x: this.originalPos.x,
        y: this.originalPos.y,
        z: this.originalPos.z,
        duration: 1,
        ease: "sine.out",
        onComplete: () => {
          this.isPlaced = true;
          this.rubikGroup.traverse((child) => {
            if (child.isMesh) {
              child.renderOrder = 0;
              child.material.transparent = false;
              child.material.depthTest = true;
            }
          });
        },
      });
    });
    gsap.to(this.rubikGroup.scale, {
      x: this.originalScale,
      y: this.originalScale,
      z: this.originalScale,
      duration: 1,
      ease: "sine.out",
    });
    gsap.to(this.rubikGroup.position, {
      x: this.originalPos.x,
      y: this.originalPos.y,
      z: this.originalPos.z,
      duration: 1,
      ease: "sine.out",
    });
    gsap.to(this.rubikGroup.rotation, {
      x: Math.PI,
      y: -0.48024479697875944,
      z: Math.PI,
      duration: 1,
      ease: "sine.out",
    });
    this.position = new Vector3(
      this.originalPos.x,
      this.originalPos.y,
      this.originalPos.z
    );
  }

  winAnimation() {
    this.rubikGroup.children.forEach((child) => {
      gsap.to(child.position, {
        x: this.originalPos.x,
        y: this.originalPos.y,
        z: this.originalPos.z,
        duration: 2,
        ease: "elastic.in",
        onComplete: () => {
          this.isPlaced = true;
          this.rubikGroup.traverse((child) => {
            if (child.isMesh) {
              child.renderOrder = 0;
              child.material.transparent = false;
              child.material.depthTest = true;
            }
          });
        },
      });
    });
    gsap.to(this.rubikGroup.scale, {
      x: this.originalScale,
      y: this.originalScale,
      z: this.originalScale,
      duration: 2,
      ease: "circ.out",
    });
    gsap.to(this.rubikGroup.position, {
      x: this.originalPos.x,
      y: this.originalPos.y,
      z: this.originalPos.z,
      duration: 2,
      ease: "back.in",
    });
    gsap.to(this.rubikGroup.rotation, {
      x: Math.PI * 3,
      y: -0.48024479697875944 + Math.PI * 6,
      z: Math.PI * 3,
      duration: 2.2,
      ease: "back.in",
      onComplete: () => {
        this.rubikGroup.rotation.x = Math.PI;
        this.rubikGroup.rotation.y = -0.48024479697875944;
        this.rubikGroup.rotation.z = Math.PI;
        this.experience.world.confetti.explode();
      },
    });
    this.position = new Vector3(
      this.originalPos.x,
      this.originalPos.y,
      this.originalPos.z
    );
  }

  onPointerMove = (event) => {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  onPointerDown = () => {
    if (
      this.objectRaycasted &&
      this.objectRaycasted.object.parent.isRubik &&
      !this.isMoving
    ) {
      const normal = this.objectRaycasted.face.normal;
      this.firstClickNormal = this.getRealNormal(
        normal.transformDirection(
          this.objectRaycasted.object.parent.matrixWorld
        )
      );
      this.objectClicked = this.objectRaycasted.object.parent;
      this.draggingg = true;
      this.firstClickPosition = new Vector2(this.pointer.x, this.pointer.y);
    }
  };
  onPointerUp = () => {
    if (this.draggingg) {
      const currentClickPosition = new Vector2(this.pointer.x, this.pointer.y);
      const distanceVector = new Vector2(
        currentClickPosition.x - this.firstClickPosition.x,
        currentClickPosition.y - this.firstClickPosition.y
      );
      if (distanceVector.x == 0 && distanceVector.y == 0) {
        return;
      }
      const verticalMovement =
        Math.abs(distanceVector.x) <= Math.abs(distanceVector.y);
      const isPositiveX = distanceVector.x >= 0;
      const isPositiveY = distanceVector.y >= 0;
      const isLayerX = this.firstClickNormal.layer === "x";
      const isLayerY = this.firstClickNormal.layer === "y";
      const isLayerZ = this.firstClickNormal.layer === "z";

      if (verticalMovement) {
        if (isLayerX) {
          this.movementsStack.push({
            layer: "depth",
            number: this.objectClicked.depth,
            orientation:
              this.firstClickNormal.sign === 0
                ? isPositiveY
                  ? 0
                  : 1
                : isPositiveY
                ? 1
                : 0,
          });
        } else if (isLayerY) {
          this.movementsStack.push({
            layer: "col",
            number: this.objectClicked.col,
            orientation:
              this.firstClickNormal.sign === 0
                ? isPositiveY
                  ? 1
                  : 0
                : isPositiveY
                ? 0
                : 1,
          });
        } else if (isLayerZ) {
          this.movementsStack.push({
            layer: "col",
            number: this.objectClicked.col,
            orientation:
              this.firstClickNormal.sign === 0
                ? isPositiveY
                  ? 1
                  : 0
                : isPositiveY
                ? 0
                : 1,
          });
        }
      } else {
        if (isLayerX) {
          this.movementsStack.push({
            layer: "row",
            number: this.objectClicked.row,
            orientation:
              this.firstClickNormal.sign === 0
                ? isPositiveX
                  ? 1
                  : 0
                : isPositiveX
                ? 1
                : 0,
          });
        } else if (isLayerY) {
          this.movementsStack.push({
            layer: "depth",
            number: this.objectClicked.depth,
            orientation:
              this.firstClickNormal.sign === 0
                ? isPositiveX
                  ? 1
                  : 0
                : isPositiveX
                ? 0
                : 1,
          });
        } else if (isLayerZ) {
          this.movementsStack.push({
            layer: "row",
            number: this.objectClicked.row,
            orientation:
              this.firstClickNormal.sign === 0
                ? isPositiveX
                  ? 1
                  : 0
                : isPositiveX
                ? 1
                : 0,
          });
        }
      }

      this.startNextMove();

      this.draggingg = false;
      this.objectClicked = null;
    }
  };

  getRealNormal(normal) {
    if (Math.abs(normal.x) > Math.abs(normal.y)) {
      if (Math.abs(normal.z) > Math.abs(normal.x)) {
        return { layer: "z", sign: normal.z >= 0 ? 1 : 0 };
      } else {
        return { layer: "x", sign: normal.x >= 0 ? 1 : 0 };
      }
    } else {
      if (Math.abs(normal.z) > Math.abs(normal.y)) {
        return { layer: "z", sign: normal.z >= 0 ? 1 : 0 };
      } else {
        return { layer: "y", sign: normal.y >= 0 ? 1 : 0 };
      }
    }
  }

  moveComplete() {
    this.isMoving = false;
    this.pivot.updateMatrixWorld();
    this.scene.remove(this.pivot.children);
    const currentOri = this.sideToRotate == -1 ? 0 : 1;
    const currLay =
      this.layerToRotate === "x"
        ? "col"
        : this.layerToRotate === "y"
        ? "row"
        : this.layerToRotate === "z"
        ? "depth"
        : undefined;
    this.childrensToRotate.forEach((cube) => {
      cube.updateMatrixWorld();
      cube.rubikPosition = cube.position.clone();
      cube.rubikPosition.applyMatrix4(this.pivot.matrixWorld);

      this.scene.attach(cube);
      this.updateValuesAfterRotation(currLay, cube, currentOri);
      this.rubikGroup.add(cube);
    });

    this.movesCompletedStack.push(this.currentMove);
    this.startNextMove();
    this.allCubies.length = 0;
    this.checkAllCubies(this.scene);
    this.allCubies.sort((a, b) => a.name.localeCompare(b.name));
    this.checkIfCubeIsSolved(this.allCubies);
  }

  checkIfCubeIsSolved(allCubies) {
    let isSolution = true;
    const allFaces = { U: null, D: null, L: null, R: null, F: null, B: null };

    allCubies.forEach((cubie) => {
      if (cubie.depth == 1) {
        if (allFaces.F == null) {
          allFaces.F = cubie.colors.F;
        } else {
          if (allFaces.F !== cubie.colors.F) {
            isSolution = false;
            return;
          }
        }
      }
      if (cubie.depth == 3) {
        if (allFaces.B == null) {
          allFaces.B = cubie.colors.B;
        } else {
          if (allFaces.B !== cubie.colors.B) {
            isSolution = false;
            return;
          }
        }
      }
      if (cubie.row == 1) {
        if (allFaces.U == null) {
          allFaces.U = cubie.colors.U;
        } else {
          if (allFaces.U !== cubie.colors.U) {
            isSolution = false;
            return;
          }
        }
      }
      if (cubie.row == 3) {
        if (allFaces.D == null) {
          allFaces.D = cubie.colors.D;
        } else {
          if (allFaces.D !== cubie.colors.D) {
            isSolution = false;
            return;
          }
        }
      }
      if (cubie.col == 1) {
        if (allFaces.L == null) {
          allFaces.L = cubie.colors.L;
        } else {
          if (allFaces.L !== cubie.colors.L) {
            isSolution = false;
            return;
          }
        }
      }
      if (cubie.col == 3) {
        if (allFaces.R == null) {
          allFaces.R = cubie.colors.R;
        } else {
          if (allFaces.R !== cubie.colors.R) {
            isSolution = false;
            return;
          }
        }
      }
    });
    if (isSolution && !this.hasBeenSolved) {
      this.experience.navigation.rubikWon();
      this.winAnimation();
      this.hasBeenSolved = true;
    }
  }

  checkAllCubies(object) {
    if (object.hasOwnProperty("colors")) {
      this.allCubies.push(object);
    }

    if (object.children) {
      object.children.forEach((child) => {
        this.checkAllCubies(child);
      });
    }
  }

  rotateValues(value1, value2) {
    let newValue1, newValue2;
    if (value1 == 1) newValue2 = 3;
    else if (value1 == 3) newValue2 = 1;
    else newValue2 = value1;
    newValue1 = value2;
    return { newValue1, newValue2 };
  }

  updateColors(colors, order) {
    const originalColors = { ...colors };
    order.forEach((currentColor, index) => {
      const nextColor = order[(index + 1) % order.length];
      colors[nextColor] = originalColors[currentColor];
    });
    return colors;
  }

  updateValuesAfterRotation(layer, currentChild, orientation) {
    let result;
    switch (layer) {
      case "row":
        if (orientation === 1) {
          result = this.rotateValues(currentChild.depth, currentChild.col);
          currentChild.depth = result.newValue1;
          currentChild.col = result.newValue2;
          currentChild.colors = this.updateColors(currentChild.colors, [
            "F",
            "R",
            "B",
            "L",
          ]);
        } else {
          result = this.rotateValues(currentChild.col, currentChild.depth);
          currentChild.col = result.newValue1;
          currentChild.depth = result.newValue2;
          currentChild.colors = this.updateColors(currentChild.colors, [
            "F",
            "L",
            "B",
            "R",
          ]);
        }
        break;
      case "col":
        if (orientation === 1) {
          result = this.rotateValues(currentChild.depth, currentChild.row);
          currentChild.depth = result.newValue1;
          currentChild.row = result.newValue2;
          currentChild.colors = this.updateColors(currentChild.colors, [
            "F",
            "D",
            "B",
            "U",
          ]);
        } else {
          result = this.rotateValues(currentChild.row, currentChild.depth);
          currentChild.row = result.newValue1;
          currentChild.depth = result.newValue2;
          currentChild.colors = this.updateColors(currentChild.colors, [
            "F",
            "U",
            "B",
            "D",
          ]);
        }
        break;
      case "depth":
        if (orientation === 1) {
          result = this.rotateValues(currentChild.col, currentChild.row);
          currentChild.col = result.newValue1;
          currentChild.row = result.newValue2;
          currentChild.colors = this.updateColors(currentChild.colors, [
            "R",
            "U",
            "L",
            "D",
          ]);
        } else {
          result = this.rotateValues(currentChild.row, currentChild.col);
          currentChild.row = result.newValue1;
          currentChild.col = result.newValue2;
          currentChild.colors = this.updateColors(currentChild.colors, [
            "R",
            "D",
            "L",
            "U",
          ]);
        }
        break;
    }
    currentChild.updateWorldMatrix();
  }

  rotateCube(layer, number, orientation) {
    this.childrensToRotate = [];
    this.rubikCubes.forEach((cubie) => {
      if (layer === "row") {
        if (cubie.row === number) {
          this.childrensToRotate.push(cubie);
        }
      } else if (layer === "col") {
        if (cubie.col === number) {
          this.childrensToRotate.push(cubie);
        }
      } else if (layer === "depth") {
        if (cubie.depth === number) {
          this.childrensToRotate.push(cubie);
        }
      }
    });
    this.childrensToRotate.forEach((currentChild) => {
      this.sideToRotate = orientation ? 1 : -1;
      if (layer === "row") this.layerToRotate = "y";
      else if (layer === "col") this.layerToRotate = "x";
      else if (layer === "depth") this.layerToRotate = "z";
    });
  }

  startNextMove() {
    if (this.movementsStack.length) {
      if (this.duration != 0) {
        const randNum = Math.floor(Math.random() * 3) + 1;
        this.audioManager.playSingleAudio("rubik_" + randNum, 0.5);
      }
      if (!this.isMoving) {
        this.currentMove = this.movementsStack.shift();
        this.rotateCube(
          this.currentMove.layer,
          this.currentMove.number,
          this.currentMove.orientation
        );
        this.pivot.position.set(
          this.position.x,
          this.position.y,
          this.position.z
        );
        this.pivot.rotation.set(0, 0, 0);
        this.pivot.updateMatrixWorld();
        this.pivot.name = "rubikPivot";
        this.scene.add(this.pivot);
        this.childrensToRotate.forEach((cube) => {
          this.pivot.attach(cube);
        });
        this.isMoving = true;
        const targetRotation =
          this.pivot.rotation[this.layerToRotate] +
          (this.sideToRotate * Math.PI) / 2;
        const easingFunction = "power1.inOut";
        gsap.to(this.pivot.rotation, {
          [this.layerToRotate]: targetRotation,
          duration: this.duration,
          ease: easingFunction,
          onComplete: () => {
            this.moveComplete();
          },
        });
      }
    }
  }
  update() {
    if (!this.isActive) {
      return;
    }
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(
      this.scene.children,
      true
    );
    if (intersects.length) {
      this.objectRaycasted = intersects[0];
    } else this.objectRaycasted = null;
  }
}

export default RubiksCube;
