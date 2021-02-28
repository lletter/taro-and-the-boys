import { Guard } from './action-generators';

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
   * @param {boolean} options.cannotBreak does this have to stay fulfilled
   * for the entire round?
   */
  constructor(actor, options = {}) {
    console.log(options);
    this.actor = actor;
    this.visible = options.visible !== undefined ? options.visible : true;
    this.cannotBreak =
      options.cannotBreak !== undefined ? options.cannotBreak : false;
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
 * The actor must be alive
 */
export class StayAliveTask extends Task {
  constructor(actor, options) {
    super(actor, options);
    this.visible = false;
    this.cannotBreak = true;
  }

  get fulfilled() {
    return this.actor.HP > 0;
  }
}
