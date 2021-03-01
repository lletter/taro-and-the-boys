import Bear from './bear.png';
import { loadSprite } from '../util';
import { Group } from 'three';

export const instantiate = () => {
  const group = new Group();
  const sprite = loadSprite(Bear);
  sprite.scale.divideScalar(1.3);
  group.sprite = sprite;
  group.add(sprite);
  return group;
};
