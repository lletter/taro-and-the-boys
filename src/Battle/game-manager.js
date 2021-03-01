import { StayAliveTask, EndWhenEnemiesDie } from './tasks';
import MainMenu from '../MainMenu';
import { gameState } from '../game-data';
import { Levels } from './actor-prefabs';

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
    return this.actors[this.turnCount];
  }

  constructor(level, scene) {
    this.gameOver = false;

    this.scene = scene;
    this.turnCount = 0;
    this.run = this.run.bind(this);

    // Get the level data and load the level
    const data = Levels[level];
    this.actors = [...gameState.alive, ...data.enemies.map((a) => a())];
    this.actors.forEach((a) => {
      a.HP = a.maxHP;
      a.updateView();
    });

    // Load tasks
    this.tasks = [
      new StayAliveTask(this.actors[0]),
      new EndWhenEnemiesDie(this.actors.filter((a) => a.enemy)),
    ];

    for (const [name, tasks] of Object.entries(data.tasks)) {
      if (name === 'any') {
        tasks.forEach((task) =>
          this.tasks.push(new task.type(this, task.options))
        );
      } else {
        const actor = this.actors.find((a) => a.name === name);
        if (actor) {
          tasks.forEach((task) => {
            this.tasks.push(new task.type(actor, task.options));
          });
        }
      }
    }
  }

  start() {
    this.scene.start(this);
    this.scene.openMenu(this, this.activeActor, this.run);
  }

  run(action) {
    this.scene.closeMenu();
    action.execute().then(() => {
      this.turnCount = (this.turnCount + 1) % this.actors.length;
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
    // Remove DEAD actors
    for (let i = 0; i < this.actors.length; i++) {
      const actor = this.actors[i];
      if (actor.HP <= 0) {
        actor.view.sprite.animation.free();
        this.actors.splice(i, 1);
        const index = gameState.alive.indexOf(actor);
        index > -1 && gameState.alive.splice(index, 1);
      }
    }

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
