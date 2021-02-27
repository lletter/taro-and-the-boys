import { Tasks } from './tasks';

const status = {
  ALIVE: 'alive',
  DEAD: 'dead',
  DEFEND: 'defend',
  STUNNED: 'stunned',
};
const GameState = {
  CONTINUE: 0,
  PLAYERS_DEAD: 1,
  ENEMIES_DEAD: 2,
};

export class GameManager {
  get activeActor() {
    return this.actors[this.turnCount % this.actors.length];
  }

  constructor(actors, scene) {
    this.scene = scene;
    this.actors = actors;
    this.turnCount = 0;
    this.busy = false;
    this.run = this.run.bind(this);
    this.playerCount = 0;
    this.enemyCount = 0;
    this.end = 0;

    // TODO: Add in customization parameters
    this.tasks = new Tasks();
  }

  start() {
    this.scene.start(this.actors);

    for (let i = 0; i < this.actors.length; i++) {
      if (this.actors[i].enemy) {
        this.enemyCount++;
      } else {
        this.playerCount++;
      }
    }

    this.scene.openMenu(this, this.activeActor, this.run);
  }

  run(action) {
    // Check statuses of all actors and end conditons
    this.statusCheck();

    if (this.end != 0) {
      this.scene.closeMenu();
      console.log('GAME OVER');
    }

    // Ignore actions until the last one finished
    console.log('It is ' + this.activeActor.name + "'s turn. ");
    this.scene.closeMenu();

    // If stunned, skip move

    action().then(() => {
      this.turnCount += 1;
      this.scene.update(this);
      this.actors.forEach((a) => a.updateView());

      // Update our state and check if the match is over
      if (this.statusCheck() != GameState.CONTINUE) {
        this.scene.closeMenu();
        return;
      }

      // Skip over all stunned actors
      while (this.activeActor.status === status.STUNNED) {
        console.log(this.activeActor.name + ' is stunned!');
        this.activeActor.status = status.ALIVE;
        this.turnCount++;
      }

      // Either generate our next action or open a menu to run it.
      if (this.activeActor.enemy) {
        this.run(this.activeActor.getAIAction(this));
        return;
      } else {
        this.scene.openMenu(this, this.activeActor, this.run);
      }
    });
  }

  // Check and updates status of all Actors
  statusCheck() {
    for (let i = 0; i < this.actors.length; i++) {
      if (this.actors[i].HP <= 0) {
        this.actors[i].status = status.DEAD;
      }
    }

    // Draw actors status
    for (let i = 0; i < this.actors.length; i++) {
      // console.log(this.actors[i].name + " is " + this.actors[i].status)

      switch (this.actors[i].status) {
        case status.ALIVE:
          // Play IDLE animation
          // console.log(this.actors[i].name + " is alive!")

          break;
        case status.DEAD:
          // Play DEAD animation
          // console.log(this.actors[i].name + " has died!")

          break;
        case status.STUNNED:
          // Play STUNNED animation
          // console.log(this.actors[i].name + " has been stunned!")

          break;
        default:
        // code block
      }
    }

    // Remove DEAD actors
    for (let i = 0; i < this.actors.length; i++) {
      if (this.actors[i].status == status.DEAD) {
        if (this.actors[i].enemy) {
          this.enemyCount--;
        } else {
          this.players--;
        }

        console.log('Removing ' + this.actors[i].name);
        this.actors.splice(i, 1);
        i--;
      }
    }

    // Check victory / defeat
    if (this.playerCount == 0) {
      console.log('You lose!');
      return GameState.PLAYERS_DEAD;
    }

    if (this.enemyCount == 0) {
      console.log('You win!!!');
      this.tasks.enemiesDead = true;
      return GameState.ENEMIES_DEAD;
    }

    return GameState.CONTINUE;
    // // Tasks check
    // if (this.tasks.checkConditions()) {
    //   return 1;
    // }
  }
}
