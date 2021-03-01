import {
  SpriteMaterial,
  Group,
  Sprite,
  TextureLoader,
  NearestFilter,
} from 'three';
import { LoopedAnimation } from '../lib/SpriteAnimator';

const spriteScale = 100;

const loader = new TextureLoader();
export function loadSprite(url) {
  const sprite = new Group();
  sprite.onload = [];

  function onload(data) {
    s.scale.y = data.image.height / spriteScale;
    s.scale.x = data.image.width / spriteScale;
    s.position.y = s.scale.y / 2;
    sprite.onload.forEach((handler) => handler());
  }

  const map = loader.load(url, onload);
  map.magFilter = NearestFilter;
  const mat = new SpriteMaterial({ map: map });
  const s = new Sprite(mat);
  sprite.add(s);
  sprite.material = mat;
  return sprite;
}

export function loadSpriteSheet(url, frames, fps) {
  let s;
  const sprite = new Group();
  sprite.onload = [];
  const onload = (map) => {
    s.scale.y = (map.image.height / spriteScale) * frames;
    s.scale.x = map.image.width / spriteScale;
    // s.scale.y = map.image.height / (map.image.width / frames);
    s.position.y = s.scale.y / 2;
    sprite.add(s);
    sprite.onload.forEach((h) => h());
  };

  const map = loader.load(url, onload);
  map.magFilter = NearestFilter;
  const mat = new SpriteMaterial({ map });
  mat.depthWrite = false;
  s = new Sprite(mat);
  sprite.material = mat;
  const animation = new LoopedAnimation(map, frames, fps);
  sprite.animation = animation;
  return sprite;
}

export function createHealthBar() {
  const g = new Group();
  const white = new SpriteMaterial({ color: 'white' });
  const red = new SpriteMaterial({ color: 'red' });
  const outerBar = new Sprite(white);
  const innerBar = new Sprite(red);
  outerBar.scale.y = 0.05;
  innerBar.scale.y = 0.05;
  innerBar.renderOrder = 1.5;
  g.scale.x = 0.5;
  g.add(outerBar);
  g.add(innerBar);

  // Bigger HP Pools have bigger healthbars
  g.setMax = (maxHP) => {
    g.scale.x = maxHP / 200;
  };

  Object.defineProperty(g, 'percent', {
    set: function (x) {
      const v = Math.max(0, x);
      innerBar.scale.x = v;
      innerBar.position.x = x / 2 - 0.5;
    },
    get: function () {
      return innerBar.scale.x;
    },
  });
  return g;
}

function makeLabelCanvas(size, name) {
  const ctx = document.createElement('canvas').getContext('2d');
  const font = `bold sans-serif`;
  ctx.font = font;
}
