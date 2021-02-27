import { PerspectiveCamera, WebGLRenderer } from 'three';
import { BattleScene } from './Battle';
import './style.css';
import config from './config';

const scene = new BattleScene();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 6;
camera.position.y = 2;
camera.lookAt(0, 0, 0);

const renderer = new WebGLRenderer();
document.getElementById('root').appendChild(renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function resize(dim) {
  let width, height;
  if (!dim || !dim.width || !dim.height) {
    width = window.innerWidth;
    height = window.innerHeight;
  } else {
    width = dim.width;
    height = dim.height;
  }
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

scene.start(config);
resize(config);
animate();

// window.addEventListener('resize', resize);
