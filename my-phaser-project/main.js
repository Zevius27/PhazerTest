// we are making a tower defense game
// time to add towers with shooting ablity
// the towers will be placed on the map and will shoot at the enemies
// we shall be able to delete towers
// we shall be able to add towers
// we shall be able to upgrade towers
// we shall be able to sell towers
// we shall be able to buy towers

const config = {
  type: Phaser.AUTO,
  width: 370,
  height: 370,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 40 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);
let boxSize = 37;
let enemy = [];
let tower = [];
let graphics;
let towerInstance;
let enemyInstance;

function preload() {}

function create() {
  graphics = this.add.graphics(); // Set a higher z index using depth

  class Tower {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.range = 100;
    }

    draw() {
      graphics.fillStyle(0x0000ff, 1);
      graphics.fillRect(this.x - 18.5, this.y - 18.5, 37, 37);

      graphics.lineStyle(2, 0xff0000, 1);
      graphics.strokeCircle(this.x, this.y, this.range);

      graphics.setInteractive();
    }
    isInRange(enemy) {
      return (
        Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y) <=
        this.range
      );
    }
    update() {
      this.draw();
    }
  }

  class Enemy {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.speed = 1;
      this.direction = 1; // 1 for right, -1 for left
    }

    draw(x, y) {
      graphics.fillStyle(0x00ff00, 1); // green
      graphics.fillRect(x - 18.5, y - 18.5, 37, 37);
    }
    
    move(dir) {
    this.draw(this.x, this.y);
    switch (dir) {
      case "left":
        this.x -= this.speed;
        break;
      case "right":
        this.x += this.speed;
        break;
      case "up":
        this.y -= this.speed;
        break;
      case "down":
        this.y += this.speed;
        break;
    }
    }
    update() {
      this.move("right");
    }
    clear() {
      graphics.clear();
    }
  }

  towerInstance = new Tower(185, 185);
  

  enemyInstance = new Enemy(0, 260);
  
}

function update() {
  graphics.clear();
  towerInstance.update();
  enemyInstance.update();
  enemyInstance.move("right");
}
