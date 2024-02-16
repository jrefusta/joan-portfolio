import "./style.css";
import Experience from "./Experience/Experience.js";

window.experience = new Experience({
  webglElement: document.querySelector("#webgl"),
  cssElement: document.querySelector("#css"),
  cssElement1: document.querySelector("#css1"),
  cssElement2: document.querySelector("#css2"),
});
