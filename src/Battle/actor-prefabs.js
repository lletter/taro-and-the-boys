import * as models from '../data';
import { Actor } from './actor';
import { Attack, Guard, Fling, Throw, Heal, Multi } from './action-generators';

export const Taro = () =>
  new Actor({
    name: 'Taro',
    HP: 80,
    MP: 150,
    defenseMod: 0.3,
    view: models.Taro(),
  })
    .addMove(Attack, { name: 'Slash', damage: 20 })
    .addMove(Guard)
    .addMove(Throw, { damage: 70 });

export const Monke = () =>
  new Actor({
    name: 'Monke',
    HP: 110,
    MP: 50,
    defenseMod: 0.5,
    view: models.Monke(),
    enemy: false,
  })
    .addMove(Attack, { name: 'Swipe', damage: 45 })
    .addMove(Fling, { damage: 25 })
    .addMove(Guard);

export const Chicken = () =>
  new Actor({
    name: 'Chicken',
    HP: 120,
    MP: 200,
    defenseMod: 0.5,
    enemy: false,
    view: models.Chicken(),
  })
    .addMove(Attack, { damage: 10 })
    .addMove(Guard)
    .addMove(Heal, { name: 'Feed Eggs', restore: 30 });

export const Doggy = () =>
  new Actor({
    name: 'Doggy',
    HP: 80,
    MP: 200,
    defenseMod: 0.3,
    enemy: false,
    view: models.Doggy(),
  })
    .addMove(Attack, { name: 'Bite', damage: 110 })
    .addMove(Guard);

export const Booba = () =>
  new Actor({
    name: 'Booba',
    enemy: true,
    view: models.Bear(),
    defenseMod: 0.5,
    HP: 250,
  })
    .addMove(Attack, { damage: 70 })
    .addMove(Guard)
    .addMove(Heal, { restore: 30 });

export const Beebo = () =>
  new Actor({
    name: 'Beebo',
    enemy: true,
    view: models.Panda(),
    defenseMod: 0.5,
    HP: 200,
  })
    .addMove(Multi, { damage: 20 })
    .addMove(Attack, { damage: 35 })
    .addMove(Guard);

export const Dada = () =>
  new Actor({
    name: 'Dingalo',
    enemy: true,
    view: models.Panda(),
    defenseMod: 0.5,
    HP: 200,
  })
    .addMove(Multi, { damage: 20 })
    .addMove(Attack, { damage: 30 })
    .addMove(Guard);

export const Deba = Beebo;
export const Didi = Booba;
export const Dodo = Beebo;

export const Levels = {
  1: {
    actors: [Taro, Chicken, Doggy, Monke],
    enemies: [Booba, Beebo],
  },
  2: {
    actors: [],
    enemies: [Dada, Deba],
  },
  3: {
    actors: [],
    enemies: [Didi, Dodo],
  },
};
