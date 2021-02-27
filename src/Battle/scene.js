import { Color, GammaEncoding, Scene, Vector3 } from 'three';
import { createPopper } from '@popperjs/core';
import { TARGETED } from './action-types';
import * as Taro from '../data/Taro';
import * as Monke from '../data/Monke';
import * as Doggy from '../data/Doggy';
import * as Chicken from '../data/Chicken';
import Ground from '../data/Ground';

const config = {
  allyPositions: [
    new Vector3(-1.8, 0, 4),
    new Vector3(-1.7, 0, 3),
    new Vector3(-1.6, 0, 2),
    new Vector3(-1.5, 0, 1),
  ],
};

export class BattleScene extends Scene {
  get menuClosed() {
    return this.menus[0].style.visibility === 'hidden';
  }

  constructor() {
    super();
    this.background = new Color(0xe6f9ff);
    this.menus = [];
    this.menus.push(document.querySelector('.actions-menu'));

    document.querySelector('.mouse-handler').addEventListener('click', () => {
      if (this.menus.length > 1) {
        this.menus.pop().remove();
        this.setActive(this.menus[this.menus.length - 1], true);
      }
    });
  }

  createMenu(root) {
    const div = document.createElement('div');
    div.classList.add('menu');
    root.appendChild(div);
    createPopper(root, div, { placement: 'right' });
    return div;
  }

  openMenu(gm, actor, callback) {
    this.menus[0].style.visibility = 'visible';
    this.menus[0].style.pointerEvents = 'auto';

    actor.moves.forEach((move) => {
      this.createMenuItem(this.menus[0], move.name, () => {
        switch (move.type) {
          case TARGETED: {
            const enemies = gm.actors.filter((a) => a.enemy);
            const cb = (target) => callback(move.create(target));
            this.subMenu(enemies, cb, this.menus[0]);
            return;
          }
          default: {
            callback(move.create(actor));
            return;
          }
        }
      });
    });
  }

  subMenu(choices, callback, root) {
    const menu = document.createElement('div');
    menu.classList.add('menu', 'submenu');
    menu.style.transform = 'translateY(-8px)';
    choices.forEach((target) => {
      this.createMenuItem(menu, target.name, () => {
        callback(target);
      });
    });
    root.appendChild(menu);
    this.menus.push(menu);
  }

  createMenuItem(menu, label, onClick) {
    const div = document.createElement('div');
    div.classList.add('action-item');
    div.innerHTML = label;
    menu.appendChild(div);
    div.addEventListener('click', (e) => {
      e.stopPropagation();
      this.setActive(div.parentElement, false);
      onClick(e);
    });
    return div;
  }

  closeMenu() {
    while (this.menus.length > 1) {
      this.menus.pop().remove();
    }
    this.menus[0].style.visibility = 'hidden';
    this.menus[0].innerHTML = '';
  }

  setActive(menu, isActive) {
    // console.log(menu);
    if (isActive) {
      for (let child of menu.children) {
        child.style.pointerEvents = 'auto';
      }
    } else {
      for (let child of menu.children) {
        child.style.pointerEvents = 'none';
      }
    }
  }

  start() {
    this.add(Ground);

    const t = Taro.instantiate();
    t.position.copy(config.allyPositions[0]);
    this.add(t);

    const monke = Monke.instantiate();
    monke.position.copy(config.allyPositions[1]);
    this.add(monke);

    const doggy = Doggy.instantiate();
    doggy.position.copy(config.allyPositions[2]);
    this.add(doggy);

    const chicken = Chicken.instantiate();
    chicken.position.copy(config.allyPositions[3]);
    this.add(chicken);
  }

  updateUI() {}
}
