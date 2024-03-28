import * as THREE from "three";
import Experience from "./Experience.js";
import fragmentShader from "./shaders/sky/fragment.glsl";
import vertexShader from "./shaders/sky/vertex.glsl";
export default class Skybox {
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
    this.drawStartPos = new THREE.Vector2(-1, -1);
    this.drawColor = "black";
    this.offset = new THREE.Vector3(0.765921, -0.121864, -1.42433);
    this.vertices = [
      new THREE.Vector3(4.275921, 5.3, 0.8),
      new THREE.Vector3(4.275921, 1.8, -2.1),
    ];
    this.limitationPlane = [];
    this.setSkybox();
  }

  setSkybox() {
    this.planeSkybox = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 7);
    this.vertices.forEach((v) => {
      this.intersectLinePlane(this.camera.instance.position, v);
    });
    const planeGeom = new THREE.PlaneGeometry(320, 200);
    const textureSky = this.resources.items.sky4;
    textureSky.colorSpace = THREE.SRGBColorSpace;
    textureSky.wrapS = THREE.MirroredRepeatWrapping;
    textureSky.wrapT = THREE.MirroredRepeatWrapping;
    this.planeMat = new THREE.ShaderMaterial({
      uniforms: {
        sky: { value: textureSky },
        minY: { value: this.limitationPlane[1].x },
        maxY: { value: this.limitationPlane[0].x },
        minZ: { value: this.limitationPlane[1].y },
        maxZ: { value: this.limitationPlane[0].y },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
    const plane = new THREE.Mesh(planeGeom, this.planeMat);
    plane.rotateY(-Math.PI / 2);
    plane.position.x = 7;
    //plane.position.y = 10;
    this.scene.add(plane);
  }

  intersectLinePlane(p1, p2) {
    const direction = new THREE.Vector3().subVectors(p2, p1);
    const plane_normal = this.planeSkybox.normal;
    const plane_constant = this.planeSkybox.constant;
    const t =
      -(plane_normal.dot(p1) + plane_constant) / plane_normal.dot(direction);
    const intersection_point = new THREE.Vector3()
      .copy(p1)
      .add(direction.multiplyScalar(t));
    this.limitationPlane.push(
      new THREE.Vector2(intersection_point.y, intersection_point.z)
    );
  }
  update() {
    if (this.planeMat) {
      this.limitationPlane = [];
      this.vertices.forEach((v) => {
        this.intersectLinePlane(this.camera.instance.position, v);
      });
      this.planeMat.uniforms.minY.value = this.limitationPlane[1].x;
      this.planeMat.uniforms.minZ.value = this.limitationPlane[1].y;
      this.planeMat.uniforms.maxY.value = this.limitationPlane[0].x;
      this.planeMat.uniforms.maxZ.value = this.limitationPlane[0].y;
    }
  }
}
