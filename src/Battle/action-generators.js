import { TARGETED, SELF_TARGETED } from './action-types';
import gsap from 'gsap';

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
  constructor(owner, config) {
    this.owner = owner;
    this.config = config;
    this.name = 'NULL';
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
    this.name = 'Attack';
    this.generateAction = this.generateAction.bind(this);
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
      await target.view.onHit(0.5);
      console.log(`${target.name} has ${target.HP} health`);
    };
  }
}

export function attack(options) {
  let damage = options.damage || 1;
  // Return a move object
  return {
    name: 'Attack',
    type: TARGETED,
    create(source, target) {
      return async () => {
        if (target.status == status.DEFEND) {
          target.HP -= damage * target.defenseMod;
        } else {
          target.HP -= damage;
        }
        await target.view.onHit(0.5);
      };
    },
  };
}

export function enemyAttack(options) {
  let damage = options.damage || 1;
  // Return a move object
  return {
    name: 'Enemy Attack',
    type: TARGETED,
    create(target) {
      return async () => {
        if (target.status == status.DEFEND) {
          target.HP -= damage * target.defenseMod;
        } else {
          // target.HP -= damage * this.damageMod;
          target.HP -= damage;
        }
        console.log(`${target.name} has ${target.HP} health`);
        console.log(' THIS IS AN ENEMY ATTACK ');
        await target.view.onHit(0.5);
      };
    },
  };
}

export function defend() {
  // Return a move object
  return {
    name: 'Defend',
    type: SELF_TARGETED,
    create(target) {
      return async () => {
        target.status = status.DEFEND;
        await delay(1000); // Will be replaced by some animation
      };
    },
  };
}

export function flingPoo(options) {
  let damage = options.damage || 1;
  // Return a move object
  return {
    name: 'Fling Poo',
    type: TARGETED,
    create(target) {
      return async () => {
        target.status = status.STUNNED;
        target.HP -= damage;
        console.log(`${target.name} has ${target.HP} health`);
        await target.view.onHit(1.5);
      };
    },
  };
}
