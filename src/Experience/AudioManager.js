import * as THREE from "three";
import Experience from "./Experience.js";

export default class AudioManager {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera.instance;
    this.audioButton = document.querySelector(".audio-button");
    this.isMuted = false;
    this.hasStarted = false;
    this.audioListeners = [];
    this.setAudioManager();
  }
  setAudioManager() {
    this.audioButton.addEventListener("click", () => {
      if (this.audioButton.classList.contains("audio-button-muted")) {
        this.isMuted = false;
        this.unmuteAudios();
        this.audioButton.classList.remove("audio-button-muted");
      } else {
        this.isMuted = true;
        this.muteAudios();
        this.audioButton.classList.add("audio-button-muted");
      }
    });
  }
  muteAudios() {
    this.audioListeners.forEach((audioListener) => {
      const sound = audioListener.sound;
      sound.setVolume(0);
    });
  }

  unmuteAudios() {
    this.audioListeners.forEach((audioListener) => {
      const sound = audioListener.sound;
      sound.setVolume(audioListener.volume);
    });
  }

  playSingleAudio(audioName, volume) {
    if (this.isMuted) {
      return;
    }
    const buffer = this.resources.items[audioName];
    const listener = new THREE.AudioListener();
    this.camera.add(listener);

    const sound = new THREE.Audio(listener);
    sound.setBuffer(buffer);
    sound.setLoop(false);
    sound.setVolume(volume);
    sound.play();
    const audioElement = { sound, volume };
    this.audioListeners.push(audioElement);
    sound.source.onended = () => {
      const index = this.audioListeners.indexOf(audioElement);
      if (index !== -1) {
        this.audioListeners.splice(index, 1);
      }
      const indexCamera = this.camera.children.indexOf(listener);
      if (indexCamera !== -1) {
        this.camera.children.splice(indexCamera, 1);
      }
    };
  }
  playLoopAudio(audioName, volume) {
    const buffer = this.resources.items[audioName];
    const listener = new THREE.AudioListener();
    this.camera.add(listener);

    const sound = new THREE.Audio(listener);
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(volume);
    sound.play();
    const audioElement = { sound, volume };
    this.audioListeners.push(audioElement);
    sound.source.onended = () => {
      const index = this.audioListeners.indexOf(audioElement);
      if (index !== -1) {
        this.audioListeners.splice(index, 1);
      }
      const indexCamera = this.camera.children.indexOf(listener);
      if (indexCamera !== -1) {
        this.camera.children.splice(indexCamera, 1);
      }
    };
  }
}
