import { Color, Scene, Vector3 } from 'three';
import * as Taro from '../data/Taro';
import * as Monke from '../data/Monke';
import * as Doggy from '../data/Doggy';
import * as Chicken from '../data/Chicken';
import Ground from '../data/Ground';

const config = {
  allyPositions: [
    new Vector3(-1.8, 0, 4),
    new Vector3(-1.7, 0, 3),
    new Vector3(-1.6, 0, 2),
    new Vector3(-1.5, 0, 1),
  ],
};

export class BattleScene extends Scene {
  constructor() {
    super();
    this.background = new Color(0xe6f9ff);
  }
  start() {
    this.add(Ground);

    const t = Taro.instantiate();
    t.position.copy(config.allyPositions[0]);
    this.add(t);

    const monke = Monke.instantiate();
    monke.position.copy(config.allyPositions[1]);
    this.add(monke);

    const doggy = Doggy.instantiate();
    doggy.position.copy(config.allyPositions[2]);
    this.add(doggy);

    const chicken = Chicken.instantiate();
    chicken.position.copy(config.allyPositions[3]);
    this.add(chicken);
  }
}
