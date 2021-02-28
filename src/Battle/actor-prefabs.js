import * as models from '../data';
import { Actor } from './actor';
import { Attack, Guard, Fling } from './action-generators';

export const Taro = new Actor({
  name: 'Taro',
  HP: 100000,
  MP: 150,
  defenseMod: 0.8,
  view: models.Taro(),
});
Taro.addMove(Attack, { name: 'Slash', damage: 5 });
Taro.addMove(Guard);

export const Monke = new Actor({
  name: 'Monke',
  HP: 100,
  MP: 50,
  defenseMod: 1,
  view: models.Monke(),
  enemy: false,
});
Monke.addMove(Attack, { damage: 10 });
Monke.addMove(Fling, { damage: 5 });
Monke.addMove(Guard);

export const Chicken = new Actor({
  name: 'Chicken',
  HP: 100,
  MP: 200,
  defenseMod: 0.7,
  enemy: false,
  view: models.Chicken(),
});
Chicken.addMove(Attack, { damage: 10 });
Chicken.addMove(Guard, { damage: 10 });

export const Doggy = new Actor({
  name: 'Doggy',
  HP: 100,
  MP: 200,
  defenseMod: 0.5,
  enemy: false,
  view: models.Doggy(),
});
Doggy.addMove(Attack, { damage: 10 });
Doggy.addMove(Guard, { damage: 10 });

export const Booba = new Actor({
  name: 'Booba',
  enemy: true,
  view: models.Bear(),
});
Booba.addMove(Attack, { damage: 60 });
Booba.addMove(Guard);

export const Beebo = new Actor({
  name: 'Beebo',
  enemy: true,
  view: models.Panda(),
});
Beebo.addMove(Attack, { damage: 60 });
Beebo.addMove(Guard);
