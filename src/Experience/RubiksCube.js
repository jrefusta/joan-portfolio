import * as THREE from "three";
import Experience from "./Experience";
import cubeInfo from "../../static/assets/cubeInfo.json";
import { gsap } from "gsap";

class RubiksCube {
  static layers = ["row", "col", "depth"];

  constructor(position, scale) {
    this.experience = new Experience();
    this.position = this.originalPos = position;
    this.scale = this.originalScale = scale;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera.instance;
    this.resources = this.experience.resources;
    this.rubikGroup = new THREE.Group();
    this.rubikCubes = [];
    this.childrensToRotate = [];
    this.sideToRotate;
    this.layerToRotate;
    this.movesCompletedStack = [];
    this.currentMove;
    this.movementsStack = [];
    this.pivot = new THREE.Object3D();
    this.objectRaycasted;
    this.firstClickPosition;
    this.firstClickNormal;
    this.dragging = false;
    this.objectClicked;
    this.isMoving = false;
    this.allCubies = [];
    this.isActive = false;
    this.pointer = new THREE.Vector2();
    this.raycaster = this.experience.raycaster;
    this.setRubiksCube();
  }
  setRubiksCube() {
    const object = this.resources.items.rubiksCube.scene;
    for (let i = object.children.length - 1; i >= 0; i--) {
      const currentChild = object.children[i];
      if (!currentChild.isMesh) {
        for (var j = 0; j < currentChild.children.length; j++) {
          let currentMesh = currentChild.children[j];
          /* if (currentMesh.isMesh) {
              currentMesh.material.envMap = envMapo;
            } */
        }
      }
      const currentInfo = cubeInfo[i];
      currentChild.row = currentInfo.row;
      currentChild.col = currentInfo.col;
      currentChild.depth = currentInfo.depth;
      currentChild.colors = currentInfo.colors;
      currentChild.isRubik = true;

      currentChild.position.set(
        this.position.x,
        this.position.y,
        this.position.z
      );
      this.rubikCubes.push(currentChild);
      this.rubikGroup.add(currentChild);
    }
    this.rubikGroup.position.set(
      this.position.x,
      this.position.y,
      this.position.z
    );
    this.rubikGroup.scale.set(this.scale, this.scale, this.scale);
    this.rubikGroup.name = "rubikGroup";
    this.rubikGroup.rotateY((-152.484 * Math.PI) / 180);
    this.scene.add(this.rubikGroup);

    const light = new THREE.AmbientLight(0xffffff, 1);
    const lightD = new THREE.DirectionalLight(0xffffff);
    lightD.position.y = 40;
    lightD.position.z = 5;
    5;
    this.scene.add(light);
    this.scene.add(lightD);
    //});
    /*  let numMap = 0;
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    let envMapo = cubeTextureLoader.load([
      "/environmentMaps/" + numMap + "/px.jpg",
      "/environmentMaps/" + numMap + "/nx.jpg",
      "/environmentMaps/" + numMap + "/py.jpg",
      "/environmentMaps/" + numMap + "/ny.jpg",
      "/environmentMaps/" + numMap + "/pz.jpg",
      "/environmentMaps/" + numMap + "/nz.jpg",
    ]); */

    this.startNextMove();
  }

  activateControls() {
    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerdown", this.onPointerDown);
    window.addEventListener("pointerup", this.onPointerUp);
    this.isActive = true;
  }

  deactivateControls() {
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerdown", this.onPointerDown);
    window.removeEventListener("pointerup", this.onPointerUp);
    this.isActive = false;
  }

  reubicateCube() {
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
    this.position = new THREE.Vector3(0, 0, 0);
  }

  resetOriginalConfig() {
    this.rubikGroup.traverse((child) => {
      if (child.isMesh) {
        child.renderOrder = 0;
        child.material.transparent = false;
        child.material.depthTest = true;
      }
    });
    this.rubikGroup.children.forEach((child) => {
      gsap.to(child.position, {
        x: this.originalPos.x,
        y: this.originalPos.y,
        z: this.originalPos.z,
        duration: 1,
        ease: "sine.out",
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
    this.position = new THREE.Vector3(
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
      this.firstClickPosition = new THREE.Vector2(
        this.pointer.x,
        this.pointer.y
      );
    }
  };
  onPointerUp = (event) => {
    if (this.draggingg) {
      const currentClickPosition = new THREE.Vector2(
        this.pointer.x,
        this.pointer.y
      );
      const distanceVector = new THREE.Vector2(
        currentClickPosition.x - this.firstClickPosition.x,
        currentClickPosition.y - this.firstClickPosition.y
      );
      const verticalMovement =
        Math.abs(distanceVector.x) <= Math.abs(distanceVector.y);
      const isPositiveX = distanceVector.x >= 0;
      const isPositiveY = distanceVector.y >= 0;
      const isLayerX = this.firstClickNormal.layer === "x";
      const isLayerY = this.firstClickNormal.layer === "y";
      const isLayerZ = this.firstClickNormal.layer === "z";

      if (verticalMovement) {
        if (isLayerX) {
          if (this.objectClicked.depth !== 2) {
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
          }
        } else if (isLayerY) {
          if (this.objectClicked.col !== 2) {
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
        } else if (isLayerZ) {
          if (this.objectClicked.col !== 2) {
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
        }
      } else {
        if (isLayerX) {
          if (this.objectClicked.row !== 2) {
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
        } else if (isLayerY) {
          if (this.objectClicked.depth !== 2) {
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
          }
        } else if (isLayerZ) {
          if (this.objectClicked.row !== 2) {
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
  checkCubieEquality(obj1, obj2) {
    return (
      obj1.col === obj2.col &&
      obj1.depth === obj2.depth &&
      obj1.row === obj2.row &&
      this.checkCubieColorEquality(obj1.colors, obj2.colors)
    );
  }

  // Función para comparar dos objetos de la propiedad 'colors'
  checkCubieColorEquality(colors1, colors2) {
    for (const key in colors1) {
      if (colors1[key] !== colors2[key]) {
        return false;
      }
    }
    return true;
  }
  checkIfCubeIsSolved(allCubies) {
    const sonIgualesTodos = allCubies.every((element, i) =>
      this.checkCubieEquality(element, cubeInfo[i])
    );

    if (sonIgualesTodos) {
      console.log("SOLUCION!!!!!!!!!!!!!!!!!!!!!!!!!");
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
    order.forEach((currentColor, i) => {
      const nextColor = order[(i + 1) % order.length];
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
            "R",
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
        const duration = 0.5;
        const easingFunction = "power1.inOut";
        gsap.to(this.pivot.rotation, {
          [this.layerToRotate]: targetRotation,
          duration: duration,
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
