import TaroPNG from './taro.png';
import { loadSprite } from '../util';
import { Group } from 'three';

export const instantiate = () => {
  const group = new Group();
  const sprite = loadSprite(TaroPNG);
  sprite.scale.divideScalar(1.3);
  group.sprite = sprite;
  group.add(sprite);
  return group;
};
