import { MustDieTask, GuardInRowTask, StayAliveTask } from './tasks';

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
    this.tasks = [
      new GuardInRowTask(actors[0]),
      new StayAliveTask(actors[0]),
      new MustDieTask(actors[1]),
      new MustDieTask(actors[2]),
      new MustDieTask(actors[3]),
      new MustDieTask(actors[4], { visible: false }),
      new MustDieTask(actors[5], { visible: false }),
    ];
  }

  start() {
    this.scene.start(this);

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
    this.scene.closeMenu();
    action.execute().then(() => {
      this.turnCount += 1;
      this.actors.forEach((a) => a.updateView());
      this.tasks.forEach((t) => t.update(action));
      this.scene.update(this);

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

    // We should continue if a task is not fulfilled or we've broken a cannotBreak
    const shouldContinue = this.tasks.some(
      (t) => !t.fulfilled || (t.cannotBreak && !t.fulfilled)
    );

    if (shouldContinue) return GameState.CONTINUE;
    else return GameState.ENEMIES_DEAD;
  }
}
