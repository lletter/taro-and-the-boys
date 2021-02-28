export class LoopedAnimation {
  constructor(texture, frames) {
    this.update = this.update.bind(this);
    this.loopHandler = window.setInterval(this.update, 1000);
    this.frames = frames;
    this.texture = texture;
    this.texture.repeat.set(1 / this.frames, 1);
  }

  update() {
    this.texture.offset.x = (this.texture.offset.x + 1 / this.frames) % 1;
  }

  free() {
    window.clearInterval(this.loopHandler);
  }
}

export default {
  animations: [],
  lastTime: 0,
  // Add a new animation
  add(options) {
    options.texture.repeat.set(
      // 1 / options.tilesHorizontal,
      // 1 / options.tilesVertical
      1 / 2,
      1
    );
    const animation = {
      fps: 60,
      duration: Infinity,
      repeat: Infinity,
      startFrame: 0,
      numberOfTiles: options.tilesHorizontal * options.tilesVertical,
      ...options,
    };

    animation.currentTile = animation.startFrame;
    animation.looped = 0;
    this.animations.push(animation);
    return animation;
  },

  // Release this sprite from our tracking and upating
  free: function (animation) {
    this.animations.splice(this.animations.indexOf(animation), 1);
    animation.onEnd && animation.onEnd();
  },

  // Update all sprites we know about
  update: function (time) {
    const delta = (time - this.lastTime) / 1000;
    var currentColumn,
      currentRow,
      complete = [];

    for (let animation of this.animations) {
      animation.duration += delta;

      if (animation.duration > 1 / animation.fps) {
        // Advance this animation to the next tile
        animation.currentTile =
          (animation.currentTile + 1) % animation.numberOfTiles;

        // Calcualte the new column and row
        currentColumn = animation.currentTile % animation.tilesHorizontal;
        currentRow = Math.floor(
          animation.currentTile / animation.tilesHorizontal
        );

        // Calculate the texture offset. The y was found through trial
        // and error and I have no idea why it works
        animation.texture.offset.x = currentColumn / animation.tilesHorizontal;
        animation.texture.offset.y = 0;

        animation.duration = 0;
        // If we're on the last frame (currentTile is 0 indexed), keep
        // track of this one for later
        if (animation.currentTile === animation.numberOfTiles - 1) {
          animation.looped++;
          complete.push(animation);
        }
      }
    }

    // Go over all completed animations. If we exceed our looping quota,
    // free it
    if (complete.length) {
      for (let animation of this.animations) {
        if (animation.looped >= animation.repeat) {
          this.free(animation);
        }
      }
    }

    this.lastTime = time;
  },
};
