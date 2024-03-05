import * as THREE from "three";

import Experience from "./Experience.js";

export default class Confetti {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.world = this.experience.world;
    this.amount = 500;
    this.radius = 300;
    this.areaWidth = 50;
    this.areaHeight = 10;
    this.fallingHeight = 10;
    this.fallingFloor = -10;
    this.fallingSpeed = 1;
    this.infoParticles = [];
    this.dummy = new THREE.Object3D();
    this.isExploded = false;
    this.colors = [0xf03559, 0xf272b3, 0x9be4f2, 0xffeb5e, 0xffb300, 0x7bff8b];
    this.setConfetti();
  }

  setConfetti() {
    this.geometry = new THREE.PlaneGeometry(0.05, 0.05);
    this.material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    this.particles = new THREE.InstancedMesh(
      this.geometry,
      this.material,
      this.amount
    );
    this.particles.visible = false;
    this.scene.add(this.particles);
  }

  randomFromTo(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  randomPlusMinus(range) {
    return Math.random() < 0.5 ? -Math.random() * range : Math.random() * range;
  }

  getRandomColor() {
    var randIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randIndex];
  }

  explode() {
    this.particles.visible = true;
    this.isExploded = true;
    setTimeout(() => {
      this.destroy();
    }, 5000);
    for (var i = 0; i < this.amount; i++) {
      const info = {};
      const destination = {};
      destination.x = (Math.random() - 0.5) * (this.radius * 2) * Math.random();
      destination.y = (Math.random() - 0.5) * (this.radius * 2) * Math.random();
      destination.z = (Math.random() - 0.5) * (this.radius * 2) * Math.random();
      info.destination = destination;
      const rotateSpeed = {};
      rotateSpeed.x = this.randomPlusMinus(0.4);
      rotateSpeed.y = this.randomPlusMinus(0.4);
      rotateSpeed.z = this.randomPlusMinus(0.4);
      info.rotateSpeed = rotateSpeed;
      this.infoParticles.push(info);
      this.particles.setColorAt(i, new THREE.Color(this.getRandomColor()));
    }
    const dummy = new THREE.Object3D();
    for (var i = 0; i < this.amount; i++) {
      dummy.position.y = 7.5;
      dummy.rotation.x = Math.random() * Math.PI * 2;
      dummy.rotation.y = Math.random() * Math.PI * 2;
      dummy.rotation.z = Math.random() * Math.PI * 2;
      const size = this.randomFromTo(2, 5);
      dummy.scale.x = size;
      dummy.scale.y = size;
      dummy.updateMatrix();
      this.particles.setMatrixAt(i, dummy.matrix);
    }
  }

  update = () => {
    if (!this.isExploded) {
      return;
    }

    for (var h = 0; h < this.amount; h++) {
      this.infoParticles[h].destination.y -= this.randomFromTo(3, 6);
      const matrixparticles = new THREE.Matrix4();
      this.particles.getMatrixAt(h, matrixparticles);
      const currentparticlesPosition =
        new THREE.Vector3().setFromMatrixPosition(matrixparticles);
      const currentparticlesEuler = new THREE.Euler().setFromRotationMatrix(
        matrixparticles
      );
      var speedX =
        (this.infoParticles[h].destination.x - currentparticlesPosition.x) /
        8000;
      var speedY =
        (this.infoParticles[h].destination.y - currentparticlesPosition.y) /
        10000;
      var speedZ =
        (this.infoParticles[h].destination.z - currentparticlesPosition.z) /
        8000;
      this.dummy.position.x = currentparticlesPosition.x + speedX;
      this.dummy.position.y = currentparticlesPosition.y + speedY;
      this.dummy.position.z = currentparticlesPosition.z + speedZ;

      this.dummy.rotation.x =
        currentparticlesEuler.x + this.infoParticles[h].rotateSpeed.x;
      this.dummy.rotation.y =
        currentparticlesEuler.y + this.infoParticles[h].rotateSpeed.y;
      this.dummy.rotation.z =
        currentparticlesEuler.z + this.infoParticles[h].rotateSpeed.z;
      this.dummy.updateMatrix();
      this.particles.setMatrixAt(h, this.dummy.matrix);
      this.particles.instanceMatrix.needsUpdate = true;
    }
  };

  destroy = () => {
    this.particles.material.dispose();
    this.particles.geometry.dispose();
    this.scene.remove(this.particles);
    this.particles = null;
    this.isExploded = false;
  };
}
