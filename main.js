import * as THREE from "https://cdn.skypack.dev/three@0.150.1";
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/OBJLoader";

let scene, camera, renderer, controls;
let selectedObject = null;

init();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe0e0e0);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7.5);
  scene.add(light);

  animate();

  document.getElementById('fileInput').addEventListener('change', handleFile);
}

function handleFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const contents = e.target.result;

    const loader = new OBJLoader();
    const object = loader.parse(contents);
    object.traverse(child => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({ color: 0x99ccff });
      }
    });
    object.name = 'editableObject';
    selectedObject = object;
    scene.add(object);
  };
  reader.readAsText(file);
}

function deleteSelected() {
  if (selectedObject) {
    scene.remove(selectedObject);
    selectedObject = null;
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}