import "./style.css";
import Experience from "./Experience/Experience.js";

window.experience = new Experience({
  webglElement: document.querySelector("#webgl"),
  cssElement: document.querySelector("#css"),
});
console.log("test");
