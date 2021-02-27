import * as models from '../data';
import { Actor } from './battleCore';
import * as generators from './action-generators';

export const Taro = new Actor({
  name: 'Hero',
  HP: 100,
  MP: 150,
  moves: [generators.attack({ damage: 20 * 1 }), generators.defend({})],
  defenseMod: 0.8,
  enemy: false,
  view: models.Taro(),
});

export const Monke = new Actor({
  name: 'Monke',
  HP: 100,
  MP: 50,
  moves: [
    generators.attack({ damage: 10 }),
    generators.flingPoo({ damage: 50 }),
    generators.defend(),
  ],
  defenseMod: 1,
  view: models.Monke(),
  enemy: false,
});

export const Chicken = new Actor({
  name: 'Chicken',
  HP: 100,
  MP: 200,
  moves: [generators.attack({ damage: 20 * 0.8 }), generators.defend({})],
  defenseMod: 0.7,
  enemy: false,
  view: models.Chicken(),
});

export const Doggy = new Actor({
  name: 'Doggy',
  HP: 100,
  MP: 200,
  moves: [generators.attack({ damage: 20 * 0.5 }), generators.defend({})],
  defenseMod: 0.5,
  enemy: false,
  view: models.Doggy(),
});

export const Booba = new Actor({
  name: 'Booba',
  moves: [generators.enemyAttack({ damage: 10 })],
  enemy: true,
  view: models.Bear(),
});

export const Beebo = new Actor({
  name: 'Beebo',
  moves: [generators.attack({ damage: 10 })],
  enemy: true,
  view: models.Panda(),
});
