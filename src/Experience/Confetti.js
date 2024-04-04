import {
  Object3D,
  PlaneGeometry,
  MeshBasicMaterial,
  InstancedMesh,
  Color,
  Matrix4,
  Vector3,
  Euler,
  DoubleSide,
} from "three";
import Experience from "./Experience.js";
import {
  CONFETTI_AMOUNT,
  CONFETTI_EXPLOSION_RADIUS,
  CONFETTI_COLORS,
} from "./constants.js";

export default class Confetti {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.infoParticles = [];
    this.dummy = new Object3D();
    this.hasExploded = false;
    this.audioManager = this.experience.world.audioManager;
    this.setConfetti();
  }

  setConfetti() {
    this.geometry = new PlaneGeometry(0.05, 0.05);
    this.material = new MeshBasicMaterial({
      color: 0xffffff,
      side: DoubleSide,
    });
    this.particles = new InstancedMesh(
      this.geometry,
      this.material,
      CONFETTI_AMOUNT
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
    var randIndex = Math.floor(Math.random() * CONFETTI_COLORS.length);
    return CONFETTI_COLORS[randIndex];
  }

  explode() {
    this.audioManager.playSingleAudio("confetti", 0.5);
    this.audioManager.playSingleAudio("partyblower", 0.3);
    this.particles.visible = true;
    this.hasExploded = true;
    setTimeout(() => {
      this.destroy();
    }, 2000);
    for (var i = 0; i < CONFETTI_AMOUNT; i++) {
      const info = {};
      const destination = {};
      destination.x =
        (Math.random() - 0.5) * (CONFETTI_EXPLOSION_RADIUS * 2) * Math.random();
      destination.y =
        (Math.random() - 0.5) * (CONFETTI_EXPLOSION_RADIUS * 2) * Math.random();
      destination.z =
        (Math.random() - 0.5) * (CONFETTI_EXPLOSION_RADIUS * 2) * Math.random();
      info.destination = destination;
      const rotateSpeed = {};
      rotateSpeed.x = this.randomPlusMinus(0.4);
      rotateSpeed.y = this.randomPlusMinus(0.4);
      rotateSpeed.z = this.randomPlusMinus(0.4);
      info.rotateSpeed = rotateSpeed;
      this.infoParticles.push(info);
      this.particles.setColorAt(i, new Color(this.getRandomColor()));
    }
    const dummy = new Object3D();
    for (var i = 0; i < CONFETTI_AMOUNT; i++) {
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
    if (!this.hasExploded) {
      return;
    }

    const { particles, infoParticles, dummy } = this;

    for (let i = 0; i < CONFETTI_AMOUNT; i++) {
      const { destination, rotateSpeed } = infoParticles[i];

      destination.y -= this.randomFromTo(3, 6);

      const matrixparticles = new Matrix4();
      particles.getMatrixAt(i, matrixparticles);

      const currentparticlesPosition = new Vector3().setFromMatrixPosition(
        matrixparticles
      );
      const currentparticlesEuler = new Euler().setFromRotationMatrix(
        matrixparticles
      );

      const speedX = (destination.x - currentparticlesPosition.x) / 8000;
      const speedY = (destination.y - currentparticlesPosition.y) / 10000;
      const speedZ = (destination.z - currentparticlesPosition.z) / 8000;

      dummy.position.copy(
        currentparticlesPosition.add(new Vector3(speedX, speedY, speedZ))
      );
      dummy.rotation.set(
        currentparticlesEuler.x + rotateSpeed.x,
        currentparticlesEuler.y + rotateSpeed.y,
        currentparticlesEuler.z + rotateSpeed.z
      );
      dummy.updateMatrix();
      particles.setMatrixAt(i, dummy.matrix);
    }
    particles.instanceMatrix.needsUpdate = true;
  };

  destroy = () => {
    this.particles.material.dispose();
    this.particles.geometry.dispose();
    this.scene.remove(this.particles);
    this.particles = null;
    this.hasExploded = false;
  };
}
