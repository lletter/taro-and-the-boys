import { TARGETED, SELF_TARGETED } from './action-types';

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
 * @param {Object} options options object
 * @param {Actor} options.damage the amount of damage
 */
export function attack(options) {
  let damage = options.damage || 1;
  // Return a move object
  return {
    name: 'Attack',
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
