import { TARGETED } from './action-types';

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * @param {Object} options options object
 * @param {Actor} options.damage the amount of damage
 */
export function attackAction(options) {
  let damage = options.damage || 1;
  // Return a move object
  return {
    name: 'Attack',
    type: TARGETED,
    create(target) {
      return async () => {
        console.log(`running attack on ${target.name}...`);
        target.HP -= damage;
        await delay(1000);
      };
    },
  };
}
