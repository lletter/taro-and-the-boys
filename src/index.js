import {
  PerspectiveCamera,
  WebGLRenderer
} from 'three';
import {
  BattleScene
} from './Battle/scene';
import {
  GameManager
} from './Battle/game-manager';

import {
  whoIsDead
} from './Battle/game-manager';

import * as actors from './Battle/actor-prefabs';

import * as level_1 from './Battle/level_1';
import * as level_2 from './Battle/level_2';
import * as level_3 from './Battle/level_3';
import * as level_boss from './Battle/level_boss';

import './style.css';
import config from './config';
import MainMenu from './MainMenu';

export let aliveList = [true, true, true, true];

const name = {
  Taro: 'Taro',
  Monke: 'Monke',
  Chicken: 'Chicken',
  Doggy: 'Doggy',
};

let scene = new BattleScene();
const camera = new PerspectiveCamera(
  20,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 16;
camera.position.y = 6;
camera.lookAt(0, 0, 0);

const renderer = new WebGLRenderer();
const root = document.getElementById('root');
root.style.display = 'none';
root.appendChild(renderer.domElement);

let level = 0;
MainMenu.onclick = () => {
  let a;

  // updates alive list after each round
  let allyID;
  for (let i = 0; i < whoIsDead.length; i++) {
    console.log("whoisDead: " + whoIsDead[i] + " is dead");

    if (whoIsDead[i] == 'Monke') allyID = 1;
    else if (whoIsDead[i] == 'Chicken') allyID = 2;
    else if (whoIsDead[i] == 'Doggy') allyID = 3;

    if (allyID != 0) {
      // Set correct actor status to dead
      console.log("update aliveList");
      aliveList[allyID] = false;
    }

  }

  for (let j = 0; j < aliveList.length; j++) {
    if (!aliveList[j]) {
      console.log(j + " is dead");
    }
  }


  console.log("Loading level " + (level + 1));

  switch (level) {
    case 0:
      a = Object.values(level_1).map((a) => a());
      break;
    case 1:
      a = Object.values(level_2).map((a) => a());
      break;
    case 2:
      a = Object.values(level_3).map((a) => a());
      break;
    case 3:
      a = Object.values(level_boss).map((a) => a());
      break;
    default:
      a = Object.values(level_1).map((a) => a());
      break;
  }

  scene = new BattleScene();
  const manager = new GameManager(a, scene, level);
  manager.start();



  level++;
  root.style.display = 'block';
};

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

function importAlive(levelList) {

  let loadList = [];
  loadList.push(Object.values(level_1)[1]);

  for (let i = 1; i < Object.values(levelList).length; i++) {
    // loadList.push(Object.values(level_1)[i]);
    if (i < 4 && aliveList[i]) {
      loadList.push(Object.values(level_1)[i]);
    } else if (i < 4 && !aliveList[i]) {
      console.log(Object.values(level_1)[i].name + " is dead");
      loadList.push(Object.values(level_1)[i]);
      loadList[i].HP == 0;
    } else {
      loadList.push(Object.values(level_1)[i]);
    }
  }

  return loadList;
}

resize(config);
animate();