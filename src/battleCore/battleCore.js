// TODO
// In the future, create a more modular moveslist

// Global Moves List
const moves = {
    ATTACK: 'attack',
    DEFEND: 'defend',
    SPELLS: 'spells' 
}

// Global Status List
const status = {
    ALIVE: 'alive',
    DEAD: 'dead',
    DEFEND: 'defend',
    STUNNED: 'stunned'
}

// Character Specific Moves List
const heroMoves = {
    ATTACK: 'attack',
    DEFEND: 'defend',
    SPELLS: 'spells' 
    // At the moment SPELLS simply stuns the target
}
const enemyMoves = {
    ATTACK: 'attack',
    DEFEND: 'defend'
}


class Actor {

    constructor(name = "", HP = 100, MP = 100, movesList, damageMod = 1, defenseMod = 1) {
        this.name = name;
        this.HP = HP;
        this.MP = MP;
        this.movesList = movesList;

        this.damageMod = damageMod;
        this.defenseMod = defenseMod;

        this.status = status.ALIVE;

        this.target = null;
        this.action = null;
    }

    setActionTarget(action, target) {

        // Clear Previous Action
        this.target = null;
        this.action = null;

        // Check if valid action
        if (moves.action != null) {
            this.action = action;
            return 0;
        }

        for (let i = 0; i < actors.length; i++) {
            if (actors[i].name == target) {
                this.target = i;
                return 0;
            }
        }

        // Error
        return -1;
    }


}

let actors = [];
let turnCount = 0;

function gameManager() {

    let activeActor = turnCount % actors.length;

    // Wait for action
    let validAction = false;

    while (!validAction && actors.status != status.STUNNED) {

        // Get action from UI
        // 
        // TODO: getUIaction();
        actors[activeActor].setActionTarget(getUIaction());

        if (actors[activeActor].action != null && actors[activeActor].target != null) {
            validAction = true;
        }

    }

    // Execute Action
    actionManager(actors[activeActor]);

    // Reflect Status of Actors back to UI
    updateUI();

    // Next turn
    turnCount++;

    // Loop
    gameManager();
}


function actionManager(actor) {
    switch (actor.action) {
        case moves.ATTACK:
            var DAMAGE = (actors[actor.target].status == status.DEFEND) ? 25 : 50;
            actors[actor.target].HP -= DAMAGE;
            break;
        case moves.DEFEND:
            actor.status = status.DEFEND;
            break;
        case moves.SPELLS:
            actors[actor.target].STATUS = status.STUNNED;
            break;
        default:
            // code block
    }
}

function init() {
    // Add in actors
    actors.push(new Actor("Hero", 150, 150, heroMoves, 1.1, 0.9));
    actors.push(new Actor("Enemy", 50, 50, enemyMoves));

    gameManager();
}

function updateUI() {
    // Check for HP changes
    for (let i = 0; i < actors.length; i++) {
        if(actors[i].HP < 0 ){
            actors[i].status = status.DEAD;
        }
    }

    // Draw actors status
    for (let i = 0; i < actors.length; i++) {
        switch (actors[i].status) {
            case moves.ALIVE:
                // Play IDLE animation

                break;
            case moves.DEAD:
                // Play DEAD animation

                break;
            case moves.STUNNED:
                // Play STUNNED animation

                break;
            default:
                // code block
        }
    }

    // Remove DEAD actors
    for (let i = 0; i < actors.length; i++) {
        if(actors[i].status == status.DEAD) {
            actors.remove(actors[i]);
            i--;
        }
    }
}

function getUIaction() {
    // TODO
    return 0;
}

init();