export class Tasks{

    constructor() {
      this.enemiesDead = false;
      this.protaganistAlive = true;
      this.allySacrified = false;
      this.allyGuard_X_Times = 10;
    }

    checkConditions(){
        return (!this.enemiesDead && this.protaganistAlive && !this.allySacrified && (this.allyGuard_X_Times == 0))
    }

}
