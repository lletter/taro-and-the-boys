import PNG from './panda.png';
import { loadSprite } from '../util';
import { Group } from 'three';

export const instantiate = () => {
  const group = new Group();
  const sprite = loadSprite(PNG);
  group.sprite = sprite;
  group.add(sprite);
  return group;
};
