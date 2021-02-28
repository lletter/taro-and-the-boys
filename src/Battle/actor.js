export class Actor {
  /**
   * @param {Object} opts
   * @param {Number} opts.HP HP
   * @param {Number} opts.MP MP
   * @param {Object} opts.moves Movelist
   * @param {Number} opts.damageMod
   * @param {Number} opts.defenseMod
   * @param {Boolean} opts.enemy
   */
  constructor(opts) {
    this.name = opts.name || 'Actor';
    this.HP = opts.HP || 100;
    this.maxHP = this.HP;
    this.MP = opts.MP || 30;
    this.moves = opts.moves || [];
    this.damageMod = opts.damageMod || 1;
    this.defenseMod = opts.defenseMod || 1;
    this.enemy = opts.enemy || false;
    this.status = status.ALIVE;
    this.view = opts.view;
    this.target = null;
    this.action = null;
  }

  updateView() {
    // Set visibility if dead
    if (this.HP > 0) {
      this.view.setHealth(this.HP / this.maxHP);
    } else {
      this.view.visible = false;
    }
  }

  /**
   * A wrapper to instantiate a move and add it to our moves.
   * See action-generators.js, actor-prefabs for valid moves
   * and usage.
   */
  addMove(type, options) {
    this.moves.push(new type(this, options));
  }

  /**
   * Do some AI (random) and run an action.
   * @param gm the game manager, so AI can see all state.
   */
  getAIAction(gm) {
    const friendlies = gm.actors.filter((a) => a.enemy !== this.enemy);
    const move = this.moves[Math.floor(Math.random() * this.moves.length)];
    const target = friendlies[Math.floor(Math.random() * friendlies.length)];
    console.log('executing move', move.name, target.name);
    return move.generateAction(target);
  }
}
