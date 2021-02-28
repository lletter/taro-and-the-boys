import { Poo, animation as createAnimation } from '../data';
import { Vector3 } from 'three';

import SPLAT from '../data/SFX/splat.wav';
import SWING from '../data/SFX/sword.wav';
import GUARD from '../data/SFX/guard.wav';
import GRUNT from '../data/SFX/grunt.wav';
import SMOOCH from '../data/SFX/smooch.wav';

const SplatSound = new Audio(SPLAT);
const SwingSound = new Audio(SWING);
const GuardSound = new Audio(GUARD);
const GruntSound = new Audio(GRUNT);
const SmoochSound = new Audio(SMOOCH);

// Global Status List
const status = {
  ALIVE: 'alive',
  DEAD: 'dead',
  DEFEND: 'defend',
  STUNNED: 'stunned',
};

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time * 1000));
}

/**
 * Create a "Move" - an object that holds the move's data (damage, etc)
 * and other parameters defined per options object.
 */
class Move {
  /**
   * @param {Object} owner The object doing the move - typically the move's owner
   * @param {string} type The type of targeting the move uses see action-types.js
   */
  constructor(owner, options) {
    this.owner = owner;
    this.name = (options && options.name) || undefined;
  }

  /**
   * Create an "action", a callable function for the game manager that
   * is run. Takes parameters based on type defined in constructor.
   */
  generateAction() {
    return {
      generator: this,
      execute: async function action() {
        console.log(
          'No move returned. Did you forget to extend generateAction()?'
        );
      },
    };
  }

  onChosen(scene, gm) {
    gm.run(this.generateAction());
  }

  doRandom(gm) {
    gm.run(this.generateAction());
  }
}

export class Attack extends Move {
  /**
   * @param {Object} config options object
   * @param {Actor} config.damage The raw damage value
   */
  constructor(owner, config) {
    super(owner, config);
    this.damage = config.damage;
    this.name = this.name || 'Attack';
  }

  /**
   * See Move class.
   * @param {Actor} target the target to attack
   */
  generateAction(target) {
    return {
      generator: this,
      target: target,
      execute: async () => {
        if (target.status == status.DEFEND) {
          target.HP -= this.damage * target.defenseMod;
        } else {
          target.HP -= this.damage;
        }

        // ANIMATION
        const time = 1;
        const start = new Vector3().copy(this.owner.view.position); // Start position of animation
        const a = new Vector3();
        const b = new Vector3();
        this.owner.view.getWorldPosition(a);
        target.view.getWorldPosition(b);
        const d = b.sub(a); // The delta distance to move
        if (d.x > 0) d.x -= this.owner.view.size.x;
        else d.x += this.owner.view.size.x;
        const end = new Vector3().copy(this.owner.view.position).add(d); // End poisition
        // Move towards enemy
        await createAnimation(this.owner.view.position, {
          duration: time / 3,
          ...end,
          ease: 'power1.in',
        });
        target.updateView();
        SwingSound.play();
        await target.view.onHit(time / 3);
        await createAnimation(this.owner.view.position, {
          duration: time / 3,
          ...start,
          ease: 'power1.in',
        });
        console.log(`${target.name} has ${target.HP} health`);
      },
    };
  }

  onChosen(scene, gm) {
    const enemies = gm.actors.filter((a) => a.enemy !== this.owner.enemy);
    const callback = (enemy) => gm.run(this.generateAction(enemy));
    scene.subMenu(enemies, callback, scene.menus[scene.menus.length - 1]);
  }

  doRandom(gm) {
    const enemies = gm.actors.filter((a) => a.enemy !== this.owner.enemy);
    const target = enemies[Math.floor(Math.random() * enemies.length)];
    gm.run(this.generateAction(target));
  }
}

export class Guard extends Move {
  constructor(owner, options) {
    super(owner, options);
    this.name = this.name || 'Guard';
  }

  generateAction() {
    return {
      generator: this,
      execute: async () => {
        this.owner.status = status.DEFEND;

        // animation
        const y = this.owner.view.position.y;
        GuardSound.play();
        await createAnimation(this.owner.view.sprite.position, {
          y: '+0.2',
          duration: 0.2,
          ease: 'circ.out',
        });
        await createAnimation(this.owner.view.sprite.position, {
          y: y,
          duration: 0.2,
          ease: 'circ.in',
        });
      },
    };
  }

  onChosen(scene, gm) {
    gm.run(this.generateAction());
  }

  doRandom(gm) {
    gm.run(this.generateAction());
  }
}

export class Fling extends Move {
  constructor(owner, config) {
    super(owner, config);
    this.damage = config.damage;
    this.name = this.name || 'Fling';
  }

  generateAction(target) {
    return {
      generator: this,
      target: this,
      execute: async () => {
        target.status = status.STUNNED;
        target.HP -= this.damage;

        // Animation
        const projectile = Poo();
        this.owner.view.add(projectile);
        projectile.scale.multiplyScalar(0.3);
        projectile.position.y = this.owner.view.size.y / 2;
        const a = new Vector3();
        let b = new Vector3();
        projectile.getWorldPosition(a);
        target.view.getWorldPosition(b);
        b = b.sub(a);
        b.y = target.view.size.y / 2;
        await createAnimation(projectile.position, {
          duration: 0.3,
          x: `${b.x}`,
          y: `${b.y}`,
          z: `${b.z}`,
          ease: 'none',
        });
        this.owner.view.remove(projectile);
        SplatSound.play();
        await target.view.onHit(0.3);
      },
    };
  }

  onChosen(scene, gm) {
    const enemies = gm.actors.filter((a) => a.enemy !== this.owner.enemy);
    const callback = (enemy) => gm.run(this.generateAction(enemy));
    scene.subMenu(enemies, callback, scene.menus[scene.menus.length - 1]);
  }

  doRandom(gm) {
    const enemies = gm.actors.filter((a) => a.enemy !== this.owner.enemy);
    const target = enemies[Math.floor(Math.random() * enemies.length)];
    gm.run(this.generateAction(target));
  }
}

export class Pass extends Move {
  generateAction() {
    return {
      generator: this,
      execute: async () => {
        const start = {
          x: this.owner.view.position.x,
          y: this.owner.view.position.y,
          z: this.owner.view.position.z,
        };
        const v = { t: 0 };
        await createAnimation(v, {
          duration: 1,
          t: 1,
          onUpdate: () => {
            this.owner.view.position.x =
              start.x +
              (Math.cos(v.t * Math.PI * 4) * (1 - Math.abs(v.t - 0.5))) / 4;
            this.owner.view.position.z =
              start.z +
              (Math.sin(v.t * Math.PI * 4) * (1 - Math.abs(v.t - 0.5))) / 4;
          },
        });
        this.owner.view.position.copy(start);
      },
    };
  }

  doRandom(gm) {
    gm.run(this.generateAction());
  }
}

export class Throw extends Move {
  constructor(owner, config = {}) {
    super(owner, config);
    this.damage = config.damage || 20;
    this.name = this.name || 'Throw Ally';
  }

  generateAction(ally, enemy) {
    return {
      generator: this,
      ally,
      enemy,
      execute: async () => {
        ally.HP -= this.damage;
        enemy.HP -= this.damage;

        // Animation
        const start = new Vector3().copy(ally.view.position);
        const enemyWorld = new Vector3().copy(enemy.view.position);
        ally.view.position.copy(this.owner.view.position);
        GruntSound.currentTime = 0;
        GruntSound.play();
        await delay(0.75);
        await createAnimation(ally.view.position, {
          duration: 0.07,
          x: enemyWorld.x,
          y: enemyWorld.y,
          z: enemyWorld.z,
          ease: 'power4.in',
        });
        SplatSound.play();
        enemy.updateView();
        ally.updateView();
        enemy.view.onHit(1);
        await delay(0.2);
        GruntSound.pause();
        await createAnimation(ally.view.position, {
          duration: 1,
          ...start,
        });
        console.log(start);
      },
    };
  }

  onChosen(scene, gm) {
    const allies = gm.actors.filter(
      (a) => a.enemy === this.owner.enemy && a !== this.owner
    );
    const enemies = gm.actors.filter((a) => a.enemy !== this.owner.enemy);
    let ally;
    const onAllyChosen = (chosen) => {
      ally = chosen;
      scene.subMenu(enemies, onEnemyChosen);
    };
    const onEnemyChosen = (enemy) => {
      gm.run(this.generateAction(ally, enemy));
    };
    scene.subMenu(allies, onAllyChosen);
  }

  doRandom(gm) {
    const allies = gm.actors.filter(
      (a) => a.enemy === this.owner.enemy && a !== this.owner
    );
    const enemies = gm.actors.filter((a) => a.enemy !== this.owner.enemy);
    const randomAlly = allies[Math.floor(Math.random() * allies.length)];
    const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
    gm.run(this.generateAction(randomAlly, randomEnemy));
  }
}

export class Heal extends Move {
  constructor(owner, config = {}) {
    super(owner, config);
    this.restore = config.restore || 20;
    this.name = this.name || 'Feed Egg';
  }

  generateAction(ally) {
    return {
      generator: this,
      execute: async () => {
        ally.HP += this.restore;

        // ANIMATION
        const start = new Vector3().copy(this.owner.view.position);
        const allyPos = new Vector3().copy(ally.view.position);
        await createAnimation(this.owner.view.position, {
          duration: 0.2,
          x: allyPos.x,
          y: allyPos.y,
          z: allyPos.z,
        });
        SmoochSound.currentTime = 0;
        SmoochSound.play();
        ally.updateView();
        await ally.view.onHit(0.8);
        await createAnimation(this.owner.view.position, {
          duration: 0.8,
          ...start,
        });
      },
    };
  }

  onChosen(scene, gm) {
    const allies = gm.actors.filter(
      (a) => a.enemy === this.owner.enemy && a !== this.owner
    );
    const callback = (chosen) => gm.run(this.generateAction(chosen));
    scene.subMenu(allies, callback, scene.menus[scene.menus.length - 1]);
  }

  doRandom(gm) {
    const allies = gm.actors.filter(
      (a) => a.enemy === this.owner.enemy && a !== this.owner
    );
    const randomAlly = allies[Math.floor(Math.random() * allies.length)];
    gm.run(this.generateAction(randomAlly));
  }
}
