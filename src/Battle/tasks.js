import { Guard, Heal, Throw, Fling } from './action-generators';

/**
 * @param {Task[]} tasks
 */
export class TaskManager {
  constructor() {
    this.enemiesDead = false;
    this.protaganistAlive = true;
    this.allySacrified = false;
    this.list = [];
    this.allyGuard_X_Times = 10;
  }

  checkConditions() {
    return (
      !this.enemiesDead &&
      this.protaganistAlive &&
      !this.allySacrified &&
      this.allyGuard_X_Times == 0
    );
  }

  update(action) {
    this.tasks.forEach((t) => t.update(action));
  }
}

export class Task {
  /**
   *
   * @param {Actor} actor the actor this applies to.
   * @param {Object} options
   * @param {boolean} options.visible does this show in task list
   * @param {boolean} options.valid if a task becomes invalid, the round will
   * end immediately.
   */
  constructor(actor, options = {}) {
    this.actor = actor;
    this.visible = options.visible !== undefined ? options.visible : true;
    this.loseCondition = false;
  }

  get valid() {
    return true;
  }

  fulfilled() {
    return true;
  }

  update() {}
}

export class GuardInRowTask extends Task {
  constructor(actor, options) {
    super(actor, options);
    this.guarded = 0;
    this.times = 2;
  }

  get description() {
    return (
      `${this.actor.name}: Guard ${this.times} times in a row.` +
      ` (${this.guarded}/${this.times})`
    );
  }

  get fulfilled() {
    return this.guarded === this.times;
  }

  update(action) {
    if (this.fulfilled) return;
    if (action.generator.owner == this.actor) {
      if (action.generator instanceof Guard) {
        this.guarded += 1;
      } else {
        this.guarded = 0;
      }
    }
  }
}

/**
 * The actor must die
 */
export class MustDieTask extends Task {
  get description() {
    return `${this.actor.name}: Must Die`;
  }

  get fulfilled() {
    return this.actor.HP <= 0;
  }

  update() {}
}

/**
 * The enemyActor must die
 */
export class EnemyMustDieTask extends Task {
  get description() {
    return `${this.actor.name}: Must Die`;
  }

  get fulfilled() {
    return this.actor.HP <= 0;
  }

  update() {}
}

/**
 * The actor must be alive
 */
export class StayAliveTask extends Task {
  constructor(actor, options) {
    super(actor, options);
    this.visible = false;
    this.description = 'Hero Alive';
  }

  get fulfilled() {
    return this.actor.HP > 0;
  }

  get valid() {
    return this.actor.HP > 0;
  }
}

export class EndWhenEnemiesDie extends Task {
  constructor(actors, options) {
    super(undefined, options);
    this.visible = false;
    this.actors = actors;
    this.description = 'End on Enemies Dead';
  }

  get fulfilled() {
    return true;
  }

  get valid() {
    return this.actors.some((a) => a.HP > 0);
  }
}

export class AtLeastOneAllyDead extends Task {
  constructor(gm, options = {}) {
    super(undefined, options);
    this.actors = gm.actors.filter((a) => !a.enemy && a.name !== 'Taro');
    this.howMany = options.howMany || 1;
    console.log(this.howMany);
    this.description = `${this.howMany} animal${
      this.howMany > 1 ? 's' : ''
    } must die this round.`;
  }

  get fulfilled() {
    const length = this.actors.filter((a) => a.HP < 0).length;
    return length >= this.howMany;
  }

  get valid() {
    return true;
  }
}

export class ThrowAllyTimes extends Task {
  constructor(actor, options = {}) {
    super(actor, options);
    this.times = options.times || 3;
    this.thrown = 0;
  }

  get description() {
    return `Throw an ally ${this.times} times. (${this.thrown}/${this.times})`;
  }

  get fulfilled() {
    return this.thrown >= this.times;
  }

  get valid() {
    return true;
  }

  update(action) {
    if (action.generator instanceof Throw) {
      this.thrown++;
    }
  }
}

export class CannotHeal extends Task {
  constructor(actor, options = {}) {
    super(actor, options);
    this.times = options.times || 3;
    this.thrown = 0;
    this._valid = true;
    this._fulfilled = true;
    this.loseCondition = true;
  }

  get valid() {
    return this._valid;
  }

  get fulfilled() {
    return this._fulfilled;
  }

  get description() {
    return `Chicken: Do not heal.`;
  }

  update(action) {
    if (action.generator instanceof Heal) {
      this._fulfilled = false;
      this._valid = false;
    }
  }
}

export class MustThrow extends Task {
  constructor(actor, options = {}) {
    super(actor, options);
    this.times = options.times || 3;
    this.thrown = 0;
    this._valid = true;
    this._fulfilled = true;
    this.loseCondition = true;
  }

  get valid() {
    return this._valid;
  }

  get fulfilled() {
    return this._fulfilled;
  }

  get description() {
    return `TARO ONLY THROW.`;
  }

  update(action) {
    if (action.generator.owner === this.actor) {
      if (!(action.generator instanceof Throw)) {
        this._fulfilled = false;
        this._valid = false;
      }
    }
  }
}

export class FlingAllEnemies extends Task {
  constructor(actor, options = {}, gm) {
    super(actor, options);
    this.enemies = gm.actors.filter((a) => a.enemy !== actor.enemy);
    this._fulfilled = false;
    this.description = 'Fling at all enemies at least once.';
    this.flung = {};
    this.enemies.forEach((e) => (this.flung[e.name] = false));
  }

  get valid() {
    return true;
  }
  get fulfilled() {
    return this._fulfilled;
  }

  update(action) {
    if (action.generator.owner === this.actor) {
      if (action.generator instanceof Fling) {
        this.flung[action.target.name] = true;

        console.log(this.flung);
        this._fulfilled = Object.values(this.flung).every((v) => v);
      }
    }
  }
}
