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
  }

  start() {
    this.scene.start(this.actors);
    this.scene.openMenu(this, this.activeActor, this.run);
  }

  run(action) {
    // Ignore actions until the last one finished
    console.log('It is ' + this.activeActor.name + "'s turn. ");
    this.scene.closeMenu();
    action().then(() => {
      this.turnCount += 1;
      this.activeActor.updateView();
      this.actors.forEach((a) => a.updateView());

      if (this.activeActor.enemy) {
        let randomTarget = Math.floor(Math.random() * this.actors.length);
        while (this.actors[randomTarget].enemy) {
          randomTarget = Math.floor(Math.random() * this.actors.length);
        }
        this.run(
          this.activeActor.moves[Math.floor(Math.random())].create(
            this.actors[randomTarget]
          )
        );
      } else {
        this.scene.openMenu(this, this.activeActor, this.run);
      }
    });
  }
}
