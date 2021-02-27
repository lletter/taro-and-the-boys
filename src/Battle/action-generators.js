import { TARGETED, SELF_TARGETED } from './action-types';
import { Poo, animation as createAnimation } from '../data';
import { Vector3 } from 'three';

// Global Status List
const status = {
  ALIVE: 'alive',
  DEAD: 'dead',
  DEFEND: 'defend',
  STUNNED: 'stunned',
};

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * Create a "Move" - an object that holds the move's data (damage, etc)
 * and other parameters defined per options object.
 */
class Move {
  /**
   * @param {Object} owner The object doing the move - typically the move's owner
   * @param {string} type The type of targeting the move uses see action-types.js
   */
  constructor(owner, options) {
    this.owner = owner;
    this.name = (options && options.name) || undefined;
    this.type = SELF_TARGETED;
  }

  /**
   * Create an "action", a callable function for the game manager that
   * is run. Takes parameters based on type defined in constructor.
   */
  generateAction() {
    return async function action() {
      console.log(
        'No move returned. Did you forget to extend generateAction()?'
      );
    };
  }
}

export class Attack extends Move {
  /**
   * @param {Object} config options object
   * @param {Actor} config.damage The raw damage value
   */
  constructor(owner, config) {
    super(owner, config);
    this.type = TARGETED;
    this.damage = config.damage;
    this.name = this.name || 'Attack';
  }

  /**
   * See Move class.
   * @param {Actor} target the target to attack
   */
  generateAction(target) {
    return async () => {
      if (target.status == status.DEFEND) {
        target.HP -= this.damage * target.defenseMod;
      } else {
        target.HP -= this.damage;
      }
      await this.owner.view.attackAnimation(target);
      console.log(`${target.name} has ${target.HP} health`);
    };
  }
}

export class Guard extends Move {
  constructor(owner, options) {
    super(owner, options);
    this.type = SELF_TARGETED;
    this.name = this.name || 'Guard';
  }

  generateAction() {
    return async () => {
      this.owner.status = status.DEFEND;

      // animation
      const y = this.owner.view.position.y;
      await createAnimation(this.owner.view.position, {
        y: '+0.2',
        duration: 0.2,
        ease: 'circ.out',
      });
      await createAnimation(this.owner.view.position, {
        y: y,
        duration: 0.2,
        ease: 'circ.in',
      });
    };
  }
}

export class Fling extends Move {
  constructor(owner, config) {
    super(owner, config);
    this.type = TARGETED;
    this.damage = config.damage;
    this.name = this.name || 'Fling';
  }

  generateAction(target) {
    return async () => {
      target.status = status.STUNNED;
      target.HP -= this.damage;
      console.log(`${target.name} has ${target.HP} health`);

      // Animation
      const projectile = Poo();
      this.owner.view.add(projectile);
      projectile.scale.multiplyScalar(0.3);
      projectile.position.y = this.owner.view.size.y / 2;
      const a = new Vector3();
      let b = new Vector3();
      projectile.getWorldPosition(a);
      target.view.getWorldPosition(b);
      b = b.sub(a);
      b.y = target.view.size.y / 2;
      await createAnimation(projectile.position, {
        duration: 0.3,
        x: `${b.x}`,
        y: `${b.y}`,
        z: `${b.z}`,
        ease: 'none',
      });
      this.owner.view.remove(projectile);
      await target.view.onHit(0.3);
    };
  }
}

export class Stunned extends Move {
  generateAction() {
    return async () => {
      await delay(1000);
    };
  }
}
