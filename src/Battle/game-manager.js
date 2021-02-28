import {
  MustDieTask,
  GuardInRowTask,
  StayAliveTask,
  EndWhenEnemiesDie,
  EnemyMustDieTask,
} from './tasks';
import MainMenu from '../MainMenu';
import {
  aliveList
} from '..';

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

export let gameOver = false;
export let whoIsDead = [];


export class GameManager {
  get activeActor() {
    return this.actors[this.turnCount % this.actors.length];
  }

  constructor(actors, scene, level) {
    this.gameOver = false;
    this.level = level;
    
    this.scene = scene;
    this.actors = actors;
    this.turnCount = 0;
    this.run = this.run.bind(this);

    // TODO: Add in customization parameters
    this.tasks = [
      //new GuardInRowTask(actors[0]),
      new StayAliveTask(actors[0]),
      new EndWhenEnemiesDie(actors.filter((a) => a.enemy)),
    ];

    let removeList = [];
    // Scan for dead actors and add tasks accordingly
    for (let i = 0; i < actors.length; i++) {
      if (!aliveList[i] && i < 3) {
        // Mark dead allies for removal from actor array
        removeList.push(i);
      } else if (i != 0) {
        // Add MustDieTask to all other actors
        if (actors[i].enemy) {
          this.tasks.push(new EnemyMustDieTask(actors[i]));
        } else {
          this.tasks.push(new MustDieTask(actors[i]));
        }
      }
    }

    // Remove dead actors
    for (let i = 0; i < removeList.length; i++) {
      actors.splice(removeList[i], 1);
    }


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
        whoIsDead.push(this.actors[i].name);
      }
    }

    // // Remove DEAD actors
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


    // Checks if all tasks are done and AT least one ally is dead
    let win = true;
    let oneDied = false;
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i] instanceof MustDieTask && this.tasks[i].fulfilled) {
        oneDied = true;
        console.log("one has died")
      } else if (!(this.tasks[i] instanceof MustDieTask)) {
        win = win && this.tasks[i].fulfilled;
        console.log("win " + win);
        console.log(this.tasks[i].description + " : " + this.tasks[i].fulfilled);
      }
    }
    win = win && oneDied;

    console.log("shouldContinue :" + shouldContinue);
    console.log("win :" + win);


    console.log(this.tasks.filter((t) => !t.valid));
    console.log(this.tasks.filter((t) => !t.fulfilled));

    if (shouldContinue) return GameState.CONTINUE;
    if (win) {
      this.level++;
      console.log("Next Level");
      return GameState.WON;
    } else {
      gameOver = true;
      return GameState.LOST;
    }
  }
}