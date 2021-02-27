import DoggyPNG from './doggy.png';
import { loadSprite } from '../util';
import { Group } from 'three';

export const instantiate = () => {
  const group = new Group();
  const sprite = loadSprite(DoggyPNG);
  sprite.scale.divideScalar(1.3);
  group.sprite = sprite;
  group.add(sprite);
  return group;
};
