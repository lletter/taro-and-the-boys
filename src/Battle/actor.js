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
    const friendlies = gm.actors.filter((a) => !a.enemy);
    const move = this.moves[Math.floor(Math.random() * this.moves.length)];
    const target = friendlies[Math.floor(Math.random() * friendlies.length)];
    console.log('executing move', move.name, target.name);
    return move.generateAction(target);
  }

  setActionTarget(action, target) {
    // Clear Previous Action
    this.target = null;
    this.action = null;

    // Check if valid action
    if (moves.action != null) {
      this.action = action;
    }

    if (target < actors.length) {
      this.target = target;
    }

    console.log('Action: ' + this.action + ' -> ' + this.target);
  }
}

let actors = [];
let turnCount = 0;
let players = 0;
let enemies = 0;

// function gameManager() {

//   for (let i = 0; i < actors.length; i++) {
//     console.log(i + " : " + actors[i].name + " : " + actors[i].status + ". HP: " + actors[i].HP);
//   }
//   console.log("Players alive: " + players);
//   console.log("Enemies alive: " + enemies);

//   let activeActor = turnCount % actors.length;

//   // Wait for action
//   let validAction = false;

//   while (!validAction && actors.status != status.STUNNED) {
//     // Get action from UI

//     actors[activeActor].setActionTarget(getUIaction());

//     if (
//       actors[activeActor].action != null &&
//       actors[activeActor].target != null
//     ) {
//       validAction = true;
//     }
//   }

//   // Execute Action
//   actionManager(actors[activeActor]);

//   // Reflect Status of Actors back to UI
//   updateUI();

//   // Check victory / defeat
//   if (players == 0) {
//     endScreen(false);
//     return;
//   }

//   if (enemies == 0) {
//     endScreen(true);
//     return;
//   }

//   // Next turn
//   turnCount++;

//   // Loop
//   gameManager();
// }

function actionManager(actor) {
  switch (actor.action) {
    case moves.ATTACK:
      var DAMAGE = actors[actor.target].status == status.DEFEND ? 25 : 50;
      actors[actor.target].HP -= DAMAGE;

      console.log(
        actor.name +
          ' attacks ' +
          actors[actor.target].name +
          ' for ' +
          DAMAGE +
          ' points!'
      );

      break;
    case moves.DEFEND:
      actor.status = status.DEFEND;

      console.log(actor + ' is defending!');

      break;
    case moves.SPELLS:
      actors[actor.target].STATUS = status.STUNNED;
      break;
    default:
    // code block
  }
}

function endScreen(win) {
  if (win) {
    console.log('You win!');
  } else {
    console.log('Game over');
  }
}

function updateUI() {
  console.log('Update');
  // Check for HP changes
  for (let i = 0; i < actors.length; i++) {
    if (actors[i].HP <= 0) {
      actors[i].status = status.DEAD;
    }
  }

  // Draw actors status
  for (let i = 0; i < this.actors.length; i++) {
    switch (this.actors[i].status) {
      case status.ALIVE:
        // Play IDLE animation
        console.log(this.actors[i].name + ' is alive!');

        break;
      case status.DEAD:
        // Play DEAD animation

        console.log(this.actors[i].name + ' has died!');

        break;
      case status.STUNNED:
        // Play STUNNED animation

        console.log(this.actors[i].name + ' has been stunned!');

        break;
      default:
      // code block
    }
  }

  // Remove DEAD actors
  for (let i = 0; i < actors.length; i++) {
    if (actors[i].status == status.DEAD) {
      if (actors[i].enemy) {
        enemies--;
      } else {
        players--;
      }

      console.log('Removing ' + actors[i].name);
      actors.splice(i, 1);
      i--;
    }
  }
}

// init();
