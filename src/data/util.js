import { SpriteMaterial, Group, Sprite, TextureLoader } from 'three';

const loader = new TextureLoader();
export function loadSprite(url) {
  const g = new Group();
  const map = loader.load(url, onload);
  const mat = new SpriteMaterial({ map: map });
  const s = new Sprite(mat);
  function onload(data) {
    s.scale.y = data.image.height / data.image.width;
    s.position.y = s.scale.y / 2;
  }
  g.add(s);
  return g;
}
