const status = {
  ALIVE: 'alive',
  DEAD: 'dead',
  DEFEND: 'defend',
  STUNNED: 'stunned',
};

import { Tasks } from 'tasks';

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
    this.tasks = Tasks();

  }

  start() {
    this.scene.start();

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
      console.log("GAME OVER");
    }

    // Ignore actions until the last one finished
    console.log("It is " + this.activeActor.name + "'s turn. ")
    this.scene.closeMenu();

    // If stunned, skip move

    action().then(() => {
      this.turnCount += 1;

      if (this.activeActor.status == status.STUNNED) {
        console.log(this.activeActor.name + " is stunned!");
        this.activeActor.status = status.ALIVE;

        // Skips turn
        this.turnCount += 1;
      }

      if (this.activeActor.enemy) {
        let randomTarget = Math.floor(Math.random() * this.actors.length);
        while (this.actors[randomTarget].enemy) {

          // Check statuses of all actors and end conditons
          this.statusCheck();
          if (this.end != 0) {
            this.scene.closeMenu();
            console.log("GAME OVER");
          } else {
            randomTarget = Math.floor(Math.random() * this.actors.length);
          }
        }
        this.run(this.activeActor.moves[Math.floor(Math.random())].create(this.actors[randomTarget]));
      } else {

        // Check statuses of all actors and end conditons
        this.statusCheck();
        if (this.end != 0) {
          this.scene.closeMenu();
          console.log("GAME OVER");
        } else {
          this.scene.openMenu(this, this.activeActor, this.run);
        }
      }

    });



  }

  // Check and updates status of all Actors
  statusCheck() {
    // console.log(" THIS IS A STATUS CHECK ");

    for (let i = 0; i < this.actors.length; i++) {
      if (this.actors[i].HP <= 0) {
        this.actors[i].status = status.DEAD;
      }
    }


    // Draw actors status
    for (let i = 0; i < this.actors.length; i++) {

      // console.log(this.actors[i].name + " is " + this.actors[i].status)

      switch (this.actors[i].status) {
        case (status.ALIVE):
          // Play IDLE animation
          // console.log(this.actors[i].name + " is alive!")

          break;
        case (status.DEAD):
          // Play DEAD animation
          // console.log(this.actors[i].name + " has died!")

          break;
        case (status.STUNNED):
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

        console.log("Removing " + this.actors[i].name);
        this.actors.splice(i, 1);
        i--;
      }
    }



    // Check victory / defeat 
    if (this.playerCount == 0) {
      console.log("You lose!");
      this.end = -1;
    }

    if (this.enemyCount == 0) {
      this.tasks.enemiesDead = true;
    }

    // Tasks check
    if(this.tasks.checkVictory()) {
      console.log("You win!!!");
      this.end = 1;
    }



  }

}