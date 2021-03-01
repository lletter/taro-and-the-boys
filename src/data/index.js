import { Box3, Group, Vector3 } from 'three';
import { loadSprite, loadSpriteSheet, createHealthBar } from './util';
import gsap from 'gsap';
import TaroImg from './Taro/taro-Sheet.png';
import ChickenImg from './Chicken/chickfila-Sheet.png';
import DoggyImg from './Doggy/shibe-Sheet.png';
import MonkeImg from './Monke/monke-Sheet.png';
import BeeboImg from './Beebo/beebort-Sheet.png';
import BoobaImg from './Booba/booband-Sheet.png';
import ShadowImg from './shadow.png';
import GodImg from './God/God-Sheet.png';
import PointerImg from './Pointer.png';
import StunSheet from './Stun_effect-1-Sheet.png';
import SlimeImg from './Slime/slimeboi-Sheet.png';

export const animation = (object, options) => {
  const { onComplete, ...other } = options;
  return new Promise((resolve) => {
    gsap.to(object, {
      ...other,
      onComplete: () => {
        onComplete && onComplete();
        resolve();
      },
    });
  });
};

class View extends Group {
  constructor(sprite, healthbar, frames) {
    super();
    this.health = healthbar;
    this.sprite = loadSpriteSheet(sprite, frames);
    this.sprite.onload.push(() => this.updateSize());
    this.add(this.sprite);
    this.add(healthbar);
    const shadow = Shadow();
    shadow.renderOrder = -1;
    shadow.material.depthTest = false;
    this.add(shadow);
    this.stunIndicator = loadSpriteSheet(StunSheet, 8, 10);
    this.stunIndicator.scale.set(0.2, 0.2, 1);
    this.stunIndicator.visible = false;
    this.add(this.stunIndicator);
    this.updateSize();
  }

  setHealth(current, max) {
    gsap.to(this.health, { duration: 1, percent: current / max });
  }

  onHit(duration) {
    let val = { t: 0 };
    return animation(val, {
      duration: duration / 3,
      t: 1,
      onUpdate: () => {
        this.sprite.position.x = (Math.random() - 0.5) * (1 - val.t);
        this.sprite.position.y = (Math.random() - 0.5) * (1 - val.t);
      },
      onComplete: () => {
        this.sprite.position.x = 0;
        this.sprite.position.y = 0;
      },
    });
  }

  onStun(duration) {
    const start = {
      x: this.position.x,
      y: this.position.y,
      z: this.position.z,
    };
    const v = { t: 0 };
    return animation(v, {
      duration,
      t: 1,
      onUpdate: () => {
        this.position.x =
          start.x +
          (Math.cos(v.t * Math.PI * 4) * (1 - Math.abs(v.t - 0.5))) / 10;
        this.position.z =
          start.z +
          (Math.sin(v.t * Math.PI * 4) * (1 - Math.abs(v.t - 0.5))) / 10;
      },
      onComplete: () => {
        this.position.copy(start);
      },
    });
  }

  /**
   * Trigger an attack animation.
   * @param {*} target the view of the enemy
   */
  attackAnimation(target, duration) {
    const time = duration || 1;
    const start = new Vector3().copy(this.position); // Start position of animation
    return new Promise((resolve) => {
      const a = new Vector3();
      const b = new Vector3();
      this.getWorldPosition(a);
      target.view.getWorldPosition(b);
      const d = b.sub(a); // The delta distance to move
      if (d.x > 0) d.x -= this.size.x;
      else d.x += this.size.x;
      const end = new Vector3().copy(this.position).add(d); // End poisition
      // Move towards enemy
      return animation(this.position, {
        duration: time / 3,
        ...end,
        ease: 'power1.in',
      })
        .then(() => target.updateView())
        .then(() => target.view.onHit(time / 3))
        .then(() =>
          animation(this.position, {
            duration: time / 3,
            ...start,
            ease: 'power1.in',
          })
        )
        .then(() => {
          resolve();
        });
    });
  }

  updateSize() {
    this.bbox = new Box3().setFromObject(this);
    this.size = new Vector3();
    this.bbox.getSize(this.size);
    this.health.position.y = this.bbox.max.y + 0.1;
    this.stunIndicator.position.y = this.bbox.max.y - 0.1;
    this.onload && this.onload.forEach((handler) => handler());
  }
}

export const instantiate = (options) => {
  const { url, scale, frames } = options;

  const health = createHealthBar();
  const group = new View(url, health, frames);
  scale && group.sprite.scale.multiplyScalar(scale);
  return group;
};

export const Shadow = () => loadSprite(ShadowImg);
export const Poo = () => loadSprite(ChickenImg);
export const Arrow = () => loadSprite(PointerImg);
export const Taro = () => instantiate({ url: TaroImg, frames: 2 });
export const Chicken = () => instantiate({ url: ChickenImg, frames: 2 });
export const Doggy = () => instantiate({ url: DoggyImg, frames: 2 });
export const Monke = () => instantiate({ url: MonkeImg, frames: 2 });
export const Beebo = () => instantiate({ url: BeeboImg, frames: 2 });
export const Booba = () => instantiate({ url: BoobaImg, frames: 2 });
export const God = () => instantiate({ url: GodImg, frames: 2 });
export const Slime = () => instantiate({ url: SlimeImg, frames: 2 });
