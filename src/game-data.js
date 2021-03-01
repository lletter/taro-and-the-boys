import { Levels } from './Battle/actor-prefabs';

export const gameState = {
  alive: [],
  init() {
    this.over = false;
    this.level = 1;
    this.alive = [];
    Object.values(Levels[1].actors).forEach((createActor) => {
      const a = createActor();
      this.alive.push(a);
    });
  },
};
