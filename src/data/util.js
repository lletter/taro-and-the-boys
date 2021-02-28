import {
  SpriteMaterial,
  Group,
  Sprite,
  TextureLoader,
  NearestFilter,
} from 'three';

const loader = new TextureLoader();
export function loadSprite(url) {
  const sprite = new Group();
  sprite.onload = [];

  function onload(data) {
    s.scale.y = data.image.height / data.image.width;
    s.position.y = s.scale.y / 2;
    sprite.onload.forEach((handler) => handler());
  }

  const map = loader.load(url, onload);
  map.magFilter = NearestFilter;
  const mat = new SpriteMaterial({ map: map });
  mat.map;
  const s = new Sprite(mat);
  sprite.add(s);
  sprite.material = mat;
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
