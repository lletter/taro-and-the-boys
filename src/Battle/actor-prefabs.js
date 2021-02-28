import * as models from '../data';
import { Actor } from './actor';
import { Attack, Guard, Fling, Throw, Heal, Multi } from './action-generators';

export const Taro = () =>
  new Actor({
    name: 'Taro',
    HP: 100,
    MP: 150,
    defenseMod: 0.8,
    view: models.Taro(),
  })
    .addMove(Attack, { name: 'Slash', damage: 50 })
    .addMove(Guard)
    .addMove(Throw);

export const Monke = () =>
  new Actor({
    name: 'Monke',
    HP: 100,
    MP: 50,
    defenseMod: 1,
    view: models.Monke(),
    enemy: false,
  })
    .addMove(Attack, { damage: 10 })
    .addMove(Fling, { damage: 5 })
    .addMove(Guard);

export const Chicken = () =>
  new Actor({
    name: 'Chicken',
    HP: 70,
    MP: 200,
    defenseMod: 0.7,
    enemy: false,
    view: models.Chicken(),
  })
    .addMove(Attack, { damage: 10 })
    .addMove(Guard, { damage: 10 })
    .addMove(Heal, { restore: 30 });

export const Doggy = () =>
  new Actor({
    name: 'Doggy',
    HP: 100,
    MP: 200,
    defenseMod: 0.5,
    enemy: false,
    view: models.Doggy(),
  })
    .addMove(Attack, { damage: 10 })
    .addMove(Guard, { damage: 10 });

export const Booba = () =>
  new Actor({
    name: 'Booba',
    enemy: true,
    view: models.Bear(),
  })
    .addMove(Attack, { damage: 60 })
    .addMove(Guard);

export const Beebo = () =>
  new Actor({
    name: 'Beebo',
    enemy: true,
    view: models.Panda(),
  })
    .addMove(Multi, { damage: 20 })
    .addMove(Attack, { damage: 30 })
    .addMove(Guard);
