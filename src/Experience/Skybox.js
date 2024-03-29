import {
  Vector2,
  Vector3,
  Plane,
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  SRGBColorSpace,
  MirroredRepeatWrapping,
} from "three";
import Experience from "./Experience.js";
import fragmentShader from "./shaders/sky/fragment.glsl";
import vertexShader from "./shaders/sky/vertex.glsl";

export default class Skybox {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.drawStartPos = new Vector2(-1, -1);
    this.drawColor = "black";
    this.offset = new Vector3(0.765921, -0.121864, -1.42433);
    this.vertices = [
      new Vector3(4.275921, 5.3, 0.8),
      new Vector3(4.275921, 1.8, -2.1),
    ];
    this.limitationPlane = [];
    this.setSkybox();
  }

  setSkybox() {
    this.planeSkybox = new Plane(new Vector3(-1, 0, 0), 7);
    this.vertices.forEach((v) => {
      this.intersectLinePlane(this.camera.instance.position, v);
    });
    const planeGeom = new PlaneGeometry(320, 200);
    const textureSky = this.resources.items.skyTexture;
    textureSky.colorSpace = SRGBColorSpace;
    textureSky.wrapS = MirroredRepeatWrapping;
    textureSky.wrapT = MirroredRepeatWrapping;
    this.planeMat = new ShaderMaterial({
      uniforms: {
        uSkyTexture: { value: textureSky },
        uMinY: { value: this.limitationPlane[1].x },
        uMaxY: { value: this.limitationPlane[0].x },
        uMinZ: { value: this.limitationPlane[1].y },
        uMaxZ: { value: this.limitationPlane[0].y },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
    const plane = new Mesh(planeGeom, this.planeMat);
    plane.rotateY(-Math.PI / 2);
    plane.position.x = 7;
    //plane.position.y = 10;
    this.scene.add(plane);
  }

  intersectLinePlane(p1, p2) {
    const direction = new Vector3().subVectors(p2, p1);
    const plane_normal = this.planeSkybox.normal;
    const plane_constant = this.planeSkybox.constant;
    const t =
      -(plane_normal.dot(p1) + plane_constant) / plane_normal.dot(direction);
    const intersection_point = new Vector3()
      .copy(p1)
      .add(direction.multiplyScalar(t));
    this.limitationPlane.push(
      new Vector2(intersection_point.y, intersection_point.z)
    );
  }
  update() {
    if (this.planeMat) {
      this.limitationPlane = [];
      this.vertices.forEach((v) => {
        this.intersectLinePlane(this.camera.instance.position, v);
      });
      this.planeMat.uniforms.uMinY.value = this.limitationPlane[1].x;
      this.planeMat.uniforms.uMinZ.value = this.limitationPlane[1].y;
      this.planeMat.uniforms.uMaxY.value = this.limitationPlane[0].x;
      this.planeMat.uniforms.uMaxZ.value = this.limitationPlane[0].y;
    }
  }
}
