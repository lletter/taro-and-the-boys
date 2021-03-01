import * as models from '../data';
import * as profiles from '../data/Profiles';
import { Actor } from './actor';
import { Attack, Guard, Fling, Throw, Heal, Multi } from './action-generators';
import { AtLeastOneAllyDead, GuardInRowTask, ThrowAllyTimes } from './tasks';

export const Taro = () =>
  new Actor({
    name: 'Taro',
    HP: 80,
    MP: 150,
    defenseMod: 0.3,
    view: models.Taro(),
    profile: profiles.TaroProfile,
  })
    .addMove(Attack, { name: 'Slash', damage: 45 })
    .addMove(Guard)
    .addMove(Throw, { damage: 70 });

export const Monke = () =>
  new Actor({
    name: 'Monke',
    HP: 110,
    MP: 50,
    defenseMod: 0.5,
    view: models.Monke(),
    profile: profiles.MonkeProfile,
    enemy: false,
  })
    .addMove(Attack, { name: 'Swipe', damage: 45 })
    .addMove(Fling, { damage: 40 })
    .addMove(Guard);

export const Chicken = () =>
  new Actor({
    name: 'Chicken',
    HP: 120,
    MP: 200,
    defenseMod: 0.5,
    enemy: false,
    view: models.Chicken(),
    profile: profiles.ChickenProfile,
  })
    .addMove(Attack, { damage: 10 })
    .addMove(Guard)
    .addMove(Heal, { name: 'Feed Eggs', restore: 20 });

export const Doggy = () =>
  new Actor({
    name: 'Doggy',
    HP: 80,
    MP: 200,
    defenseMod: 0.3,
    enemy: false,
    view: models.Doggy(),
    profile: profiles.ShibeProfile,
  })
    .addMove(Attack, { name: 'Bite', damage: 110 })
    .addMove(Guard);

export const Beebo = () =>
  new Actor({
    name: 'Beebo',
    enemy: true,
    view: models.Beebo(),
    defenseMod: 0.5,
    profile: profiles.BeeboProfile,
    HP: 250,
  })
    .addMove(Attack, { damage: 70 })
    .addMove(Guard)
    .addMove(Heal, { restore: 30 });

export const Booba = () =>
  new Actor({
    name: 'Booba',
    enemy: true,
    view: models.Booba(),
    defenseMod: 0.5,
    profile: profiles.BoobaProfile,
    HP: 200,
  })
    .addMove(Multi, { damage: 20 })
    .addMove(Attack, { damage: 35 })
    .addMove(Guard);

export const Dada = () =>
  new Actor({
    name: 'Dingalo',
    enemy: true,
    view: models.Booba(),
    defenseMod: 0.5,
    HP: 200,
  })
    .addMove(Multi, { damage: 20 })
    .addMove(Attack, { damage: 30 })
    .addMove(Guard);

export const Slime = () =>
  new Actor({
    name: 'Slime',
    enemy: true,
    view: models.Slime(),
    defenseMod: 1,
    HP: 80,
  })
    .addMove(Attack, { damage: 5 })
    .addMove(Guard);

export const God = () =>
  new Actor({
    name: '人生壊滅沈没低下天使',
    enemy: true,
    view: models.God(),
    defenseMod: 0.1,
    HP: 400,
  })
    .addMove(Multi, { damage: 50 })
    .addMove(Guard)
    .addMove(Attack, { damage: 75 });

export const Levels = {
  1: {
    actors: [Taro, Chicken, Doggy, Monke],
    enemies: [Slime, Slime, Slime, Slime],
    tasks: {
      Taro: [{ type: ThrowAllyTimes, options: { times: 2 } }],
    },
  },
  2: {
    enemies: [Beebo, Booba],
    tasks: {
      any: [{ type: AtLeastOneAllyDead }],
      Chicken: [{ type: GuardInRowTask, options: { times: 2 } }],
      Taro: [{ type: ThrowAllyTimes, options: { times: 3 } }],
    },
  },
  3: {
    actors: [],
    enemies: [God],
    tasks: {
      Taro: [{ type: ThrowAllyTimes, options: { times: 5 } }],
    },
  },
};
