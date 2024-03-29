import "./style.css";
import Experience from "./Experience/Experience.js";

const isMobile =
  /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || navigator.userAgentData?.mobile;

if (window.innerWidth > 768 && !isMobile) {
  window.experience = new Experience({
    webglElement: document.querySelector("#webgl"),
    cssArcadeMachine: document.querySelector("#cssArcadeMachine"),
    cssLeftMonitor: document.querySelector("#cssLeftMonitor"),
    cssRightMonitor: document.querySelector("#cssRightMonitor"),
  });
} else {
  const mobileAdvise = document.querySelector(".mobile-text");
  mobileAdvise.style.display = "block";
}
