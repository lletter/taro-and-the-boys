import { PerspectiveCamera, WebGLRenderer } from 'three';
import { BattleScene } from './Battle/scene';
import { GameManager } from './Battle/game-manager';
import { Actor } from './Battle/battleCore';
import * as generators from './Battle/action-generators';
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

const actors = [];
actors.push(
  new Actor({
    name: 'Taro',
    moves: [generators.attack({ damage: 10 })],
  })
);
actors.push(
  new Actor({
    name: 'Booba',
    moves: [generators.attack({ damage: 10 })],
    enemy: true,
  })
);
actors.push(
  new Actor({
    name: 'Beebo',
    moves: [generators.attack({ damage: 10 })],
    enemy: true,
  })
);
const manager = new GameManager(actors, scene);
manager.start();
resize(config);
animate();

// window.addEventListener('resize', resize);
