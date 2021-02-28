import {
  MustDieTask,
  GuardInRowTask,
  StayAliveTask,
  EndWhenEnemiesDie,
} from './tasks';
import MainMenu from '../MainMenu';

const status = {
  ALIVE: 'alive',
  DEAD: 'dead',
  DEFEND: 'defend',
  STUNNED: 'stunned',
};

const GameState = {
  CONTINUE: 0,
  LOST: 1,
  WON: 2,
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
      new EndWhenEnemiesDie(actors.filter((a) => a.enemy)),
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

      // Update our state and check if the match is over
      const current = this.statusCheck();
      if (current !== GameState.CONTINUE) {
        MainMenu.show();
        if (current === GameState.WON) {
          MainMenu.setHeader('YOU WON');
          MainMenu.setButtonText('Next Round');
        } else {
          MainMenu.setHeader('YOU LOST');
          const failedTasks = this.tasks.filter((t) => !t.fulfilled);
          const str = failedTasks.reduce(
            (acc, val) => acc + val.description + '\n',
            ''
          );
          MainMenu.setDescription(`Next time, try to: \n
            ${str}
          `);
        }
        return;
      }

      // Skip over all stunned actors
      while (this.activeActor.status === status.STUNNED) {
        this.activeActor.status = status.ALIVE;
        this.turnCount++;
      }

      this.scene.update(this);

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

    // We should continue if a task becomes invalid
    const shouldContinue = this.tasks.every((t) => t.valid);
    const won = this.tasks.every((t) => t.fulfilled);

    console.log(this.tasks.filter((t) => !t.valid));
    console.log(this.tasks.filter((t) => !t.fulfilled));

    if (shouldContinue) return GameState.CONTINUE;
    if (won) return GameState.WON;
    else return GameState.LOST;
  }
}
