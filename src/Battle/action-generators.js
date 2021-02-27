import { TARGETED } from './action-types';

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
        target.HP -= damage;
        console.log(`${target.name} has ${target.HP} health`);
        await delay(1000); // Will be replaced by some animation
      };
    },
  };
}
