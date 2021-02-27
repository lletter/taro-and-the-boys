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

// actors.push(new Actor('Hero', 150, 150, moves, 1.1, 0.9));
// actors.push(new Actor('Monke', 150, 150, moves, 1.1, 0.9));
// actors.push(new Actor('Chicken', 150, 150, moves, 1.1, 0.9));
// actors.push(new Actor('Doggy', 150, 150, moves, 1.1, 0.9));

actors.push(
  new Actor({
    name: 'Hero',
    HP: 150,
    MP: 150,
    moves: [generators.attack({ damage: 20 * 1 }), generators.defend({})],
    defenseMod: 0.8,
    enemy: false,
  })
)

actors.push(
  new Actor({
    name: 'Monke',
    HP: 90,
    MP: 50,
    moves: [generators.attack({ damage: 10}), generators.flingPoo({damage : 50}), generators.defend({})],
    defenseMod: 1,
    enemy: false,
  })
)

actors.push(
  new Actor({
    name: 'Chicken',
    HP: 75,
    MP: 200,
    moves: [generators.attack({ damage: 20 * 0.8}), generators.defend({})],
    defenseMod: 0.7,
    enemy: false,
  })
)

actors.push(
  new Actor({
    name: 'Doggy',
    HP: 75,
    MP: 200,
    moves: [generators.attack({ damage: 20 * 0.5}), generators.defend({})],
    defenseMod: 0.5,
    enemy: false,
  })
)

actors.push(
  new Actor({
    name: 'Booba',
    moves: [generators.enemyAttack({ damage: 10 })],
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
