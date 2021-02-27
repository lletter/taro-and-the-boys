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
    this.scene.start();
    this.scene.openMenu(this.activeActor, this.run);
  }

  run(action) {
    // Ignore actions until the last one finished
    if (this.busy) return;
    this.scene.closeMenu();
    this.busy = true;
    action().then(() => {
      this.busy = false;
      this.turnCount += 1;
      this.scene.openMenu(this.activeActor, this.run);
    });
  }
}
