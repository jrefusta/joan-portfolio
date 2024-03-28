import "./style.css";
import Experience from "./Experience/Experience.js";

const isMobile =
  /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || navigator.userAgentData?.mobile;

if (window.innerWidth > 768 && !isMobile) {
  window.experience = new Experience({
    webglElement: document.querySelector("#webgl"),
    cssElement: document.querySelector("#css"),
    cssElement1: document.querySelector("#css1"),
    cssElement2: document.querySelector("#css2"),
  });
} else {
  const mobileAdvise = document.querySelector(".mobile-text");
  mobileAdvise.style.display = "block";
}
