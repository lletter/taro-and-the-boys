import TaroImg from './Taro/taro.png';
import ChickenImg from './Chicken/chicken.png';
import DoggyImg from './Doggy/doggy.png';
import MonkeImg from './Monke/monke.png';
import BearImg from './Bear/bear.png';
import PandaImg from './Panda/panda.png';
import { Box3, Group } from 'three';
import { loadSprite, createHealthBar } from './util';
import gsap from 'gsap';

class View extends Group {
  constructor(sprite, healthbar) {
    super();
    this.sprite = sprite;
    this.health = healthbar;
    this.add(sprite);
    this.add(healthbar);
  }

  setHealth(num) {
    this.health.setHealth(num);
  }

  onHit(time) {
    return new Promise((resolve) => {
      let val = { t: 0 };
      gsap.to(val, {
        duration: time,
        t: 1,
        onUpdate: () => {
          this.sprite.position.x = Math.random() - 0.5;
          this.sprite.position.y = Math.random() - 0.5;
        },
        onComplete: () => {
          this.sprite.position.x = 0;
          this.sprite.position.y = 0;
          resolve();
        },
      });
    });
  }

  handleSpriteLoaded() {
    const box = new Box3().setFromObject(this);
    this.health.position.y = box.max.y + 0.1;
  }
}

export const instantiate = (options) => {
  const { url, scale } = options;

  const sprite = loadSprite(url);
  const health = createHealthBar();
  const group = new View(sprite, health);
  sprite.onload = () => group.handleSpriteLoaded();

  scale && sprite.scale.multiplyScalar(scale);
  return group;
};
export const Taro = () => instantiate({ url: TaroImg, scale: 0.7 });
export const Chicken = () => instantiate({ url: ChickenImg });
export const Doggy = () => instantiate({ url: DoggyImg });
export const Monke = () => instantiate({ url: MonkeImg });
export const Bear = () => instantiate({ url: BearImg });
export const Panda = () => instantiate({ url: PandaImg });
