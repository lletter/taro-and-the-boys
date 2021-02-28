import {
  // MustDieTask,
  // GuardInRowTask,
  StayAliveTask,
  EndWhenEnemiesDie,
  // EnemyMustDieTask,
  AtLeastOneAllyDead,
} from './tasks';
import MainMenu from '../MainMenu';
import { gameState } from '../game-data';

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
    this.gameOver = false;

    this.scene = scene;
    this.actors = actors;
    this.turnCount = 0;
    this.run = this.run.bind(this);

    this.tasks = [
      //new GuardInRowTask(actors[0]),
      new StayAliveTask(actors[0]),
      new EndWhenEnemiesDie(actors.filter((a) => a.enemy)),
      new AtLeastOneAllyDead(
        actors.filter((a) => !a.enemy && a.name !== actors[0].name)
      ),
    ];
  }

  start() {
    this.scene.start(this);
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
        this.scene.close();
        MainMenu.show();
        if (current === GameState.WON) {
          MainMenu.setHeader('YOU WON');
          MainMenu.setButtonText('Next Round');
        } else {
          MainMenu.setHeader('YOU LOST');
          const failedTasks = this.tasks.filter((t) => !t.fulfilled);
          const str = failedTasks.reduce(
            (acc, val) => acc + val.description + '<br/>',
            ''
          );
          MainMenu.setDescription(`You failed at these tasks<br/>
            ${str}
          `);
        }
        return;
      }

      this.scene.update(this);
      this.activeActor.doMove(this.scene, this);
    });
  }

  // Check and updates status of all Actors
  statusCheck() {
    // // Remove DEAD actors
    this.actors = this.actors.filter(
      (a) => !(a.HP <= 0 || a.status === status.DEAD)
    );

    // We should continue if a task becomes invalid
    const shouldContinue = this.tasks.every((t) => t.valid);
    const won = this.tasks.every((t) => t.fulfilled);

    if (shouldContinue) return GameState.CONTINUE;
    if (won) {
      gameState.level++;
      gameState.alive = gameState.alive.filter(
        (a) => !(a.HP <= 0 || a.status === status.DEAD)
      );
      return GameState.WON;
    } else {
      gameState.over = true;
      return GameState.LOST;
    }
  }
}
