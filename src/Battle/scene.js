import { Scene, Vector3 } from 'three';
import { Arrow } from '../data';
import { Day, Night } from '../data/Ground';
import BattleMP3 from '../data/battle1.mp3';
import { gameState } from '../game-data';

const BattleMusic = new Audio(BattleMP3);
BattleMusic.volume = 0.05;

const config = {
  allyPositions: [
    new Vector3(-1.9, 0, 4),
    new Vector3(-1.6, 0, 3),
    new Vector3(-1.3, 0, 2),
    new Vector3(-1, 0, 1),
  ],
  enemyPositions: [
    new Vector3(1.9, 0, 3.5),
    new Vector3(1.6, 0, 2.5),
    new Vector3(1.3, 0, 1.5),
    new Vector3(1, 0, 0.5),
  ],
  levelBackgrounds: {
    1: Day,
    2: Night,
  },
};

export class BattleScene extends Scene {
  get menuClosed() {
    return this.menus[0].style.visibility === 'hidden';
  }

  /**
   * Set up the scene.
   */
  constructor() {
    super();
    this.background = config.levelBackgrounds[gameState.level];
    this.arrow = Arrow();
    this.arrow.scale.multiplyScalar(0.5);
    this.arrow.material.depthWrite = false;
    this.add(this.arrow);

    // The menu stack. Don't remove the root menu, it's buggy.
    // Sub-menu adds menus onto the menu stack
    this.menus = [];
    this.menus.push(document.querySelector('.actions-menu'));

    // The task list.
    this.taskList = document.getElementById('task-items');
    this.taskList.innerHTML = '';

    this.profileBox = document.getElementById('profile');

    /**
     * Maybe put this somewhere else haah
     * Remove a menu from the menu stack on click.
     * The mouse-handler div is the game window.
     */
    document.querySelector('.mouse-handler').addEventListener('click', () => {
      if (this.menus.length > 1) {
        this.menus.pop().remove();
        this.setActive(this.menus[this.menus.length - 1], true);
      }
    });
  }

  /**
   * Update the view of the scene based on gamemanager state
   * Move the current arrow indicator, etc
   */
  update(gm) {
    // if the sprite is loaded
    gm.activeActor.view.getWorldPosition(this.arrow.position);
    this.arrow.position.y = 1.2;
    this.taskList.innerHTML = '';
    gm.tasks
      .filter((t) => t.visible)
      .forEach((t) => {
        if (t.fulfilled)
          this.taskList.innerHTML += `<strike>${t.description}</strike><br/>`;
        else this.taskList.innerHTML += `${t.description}<br/>`;
      });
    this.changeProfile(gm.activeActor.profile);
  }

  /**
   * The main hook to open a menu and choose one of the actor's actions.
   */
  openMenu(gm, actor) {
    this.menus[0].style.visibility = 'visible';
    this.menus[0].style.pointerEvents = 'auto';

    actor.moves.forEach((move) => {
      this.createMenuItem(this.menus[0], move, () => {
        if (move.onChosen) {
          move.onChosen(this, gm);
          return;
        }
      });
    });
  }

  changeProfile(profile) {
    this.profileBox.innerHTML = '';
    this.profileBox.appendChild(profile);
  }

  /**
   * Open a sub-menu for targeting enemies and such.
   * @param {function} callback takes a callback function to execute with one
   * of the choices in the choices param.
   * @param {array} choices a list of actors. other choices aren't supported I think.
   */
  subMenu(choices, callback) {
    const root = this.menus[this.menus.length - 1];
    const menu = document.createElement('div');
    menu.classList.add('menu', 'submenu');
    menu.style.transform = 'translateY(-8px)';

    // Create a menu item for each of our choices
    choices.forEach((choice) => {
      // If our choice is an Actor,
      const onHover = () =>
        choice.profile && this.changeProfile(choice.profile);
      const onClick = () => callback(choice);
      this.createMenuItem(menu, choice, onClick, onHover);
    });
    root.appendChild(menu);
    this.menus.push(menu);
  }

  /**
   * Creates a menu item. Uses choice.name and choice.description
   */
  createMenuItem(menu, choice, onClick, onHover) {
    const item = document.createElement('div');
    item.classList.add('action-item');

    if (choice.name) {
      const label = document.createElement('div');
      item.appendChild(label);
      label.classList.add('action-item-label');
      label.innerHTML = choice.name;
    }

    if (choice.description) {
      const description = document.createElement('div');
      item.appendChild(description);
      description.classList.add('action-item-description');
      description.innerHTML = choice.description;
    }
    menu.appendChild(item);
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      this.setActive(item.parentElement, false); // Disable interactions on our menu
      onClick(e);
    });
    item.addEventListener('mouseover', onHover);
    return item;
  }

  closeMenu() {
    while (this.menus.length > 1) {
      this.menus.pop().remove();
    }
    this.menus[0].style.visibility = 'hidden';
    this.menus[0].innerHTML = '';
  }

  setActive(menu, isActive) {
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

  start(gm) {
    BattleMusic.currentTime = 0;
    BattleMusic.play();

    let allies = 0;
    let enemies = 0;
    for (let i = 0; i < gm.actors.length; i++) {
      const actor = gm.actors[i];

      // if (i < 4 && !aliveList[i]) {
      //   actor.HP = 0;
      // } else {
      // console.log(actor.name + " has " + actor.HP + " HP")

      if (actor.enemy) {
        actor.view.position.copy(config.enemyPositions[enemies]);
        this.add(actor.view);
        enemies += 1;
      } else {
        actor.view.position.copy(config.allyPositions[allies]);
        this.add(actor.view);
        allies += 1;
      }
      // }
    }
    this.initialActors = [...gm.actors];

    this.update(gm);
  }

  close() {
    this.initialActors.forEach((actor) => actor.view.sprite.animation.free());
    BattleMusic.pause();
  }
}
