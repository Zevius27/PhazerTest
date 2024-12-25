let boxSize = 37;

// we shall be able to upgrade towers
// we shall be able to sell towers
// we shall be able to buy towers

const config = {
  type: Phaser.AUTO,
  width: boxSize * 10,
  height: boxSize * 10,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

let paused = true;
let TogglePause = () => {
  paused = !paused;
  let pauseButton = document.getElementById("pause-button");
  pauseButton.innerHTML = paused ? "▶️" : "⏸️"; // Play and Pause emojis
};
let enemies = [];
let towers = [];
let bullets = [];
let graphics;
let squareHighlight = { value: false, x: 0, y: 0 };
let bug = squareHighlight.x <= 100 ? -(boxSize * 1) : +boxSize;
let gridSize = boxSize;
let highlightSquare = (x, y) => {
  squareHighlight.value = true;
  graphics.fillStyle(0xffff00, 0.5); // Yellow color with some transparency
  graphics.fillRect(x, y, 37, 37); // Draw the highlight
  // console.log("highlightSquare", x, y);
  graphics.lineStyle(2, 0xff0000, 1);
  graphics.strokeCircle(
    squareHighlight.x + 18.5 + bug,
    squareHighlight.y + 18.5,
    100
  );
};

let createGrid;
let clickCheck = { value: false, x: 0, y: 0 };

function preload() {}

function create() {
  graphics = this.add.graphics();

  // Set the ID for the existing canvas
  const canvas = this.game.canvas;
  canvas.id = "ImGame"; // Added ID to the existing canvas

  // Move the canvas to the game-container
  document.getElementById("game-container").appendChild(canvas);

  createGrid = () => {
    for (let i = 0; i < canvas.width; i += boxSize) {
      for (let j = 0; j < canvas.height; j += boxSize) {
        graphics.lineStyle(2, 0xffffff, 1); // Set line style for white stroke
        graphics.strokeRect(i, j, boxSize, boxSize); // Draw the grid box with white stroke
      }
    }
  };

  class Tower {
    constructor(x, y, name) {
      this.x = x + bug;
      this.y = y;
      this.range = 100;
      this.attackSpeed = 1;
      this.attackDamage = 10;
      this.name = name;
      towers.push(this);
      this.update();
    }

    draw() {
      graphics.fillStyle(0x0000ff, 1);
      graphics.fillRect(this.x - 18.5, this.y - 18.5, 37, 37);
      if (
        clickCheck.value &&
        this.x === clickCheck.x &&
        this.y === clickCheck.y
      ) {
        graphics.fillStyle(0xff00ff, 0.5); // Magenta color with some transparency
        graphics.fillRect(this.x + 37, this.y - 37, 74, 74); // Draw the larger rectangle
      }
    }
    isInRange(enemy) {
      if (!enemy) {
        return;
      }
      let dx = enemy.x - this.x;
      let dy = enemy.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= this.range) {
        let bullet = new Bullet(this.x, this.y, enemy);
        for (let i = 0; i < bullets.length; i++) {
          bullets[i].update();
        }
        return true;
      }
      return false;
    }
    update(enemy) {
      this.draw();
      this.isInRange(enemy);
    }
    drawRange() {
      graphics.lineStyle(2, 0xff0000, 1);
      graphics.strokeCircle(this.x, this.y, 100);
    }
  }

  class Enemy {
    constructor(x, y, name, scene) {
      this.x = x;
      this.y = y;
      this.speed = 1;
      this.health = 100;
      this.name = name;
      this.scene = scene;
      enemies.push(this);
    }

    draw() {
      graphics.fillStyle(0x00ff00, 1); // green
      graphics.fillRect(
        this.x - gridSize / 2,
        this.y - gridSize / 2,
        gridSize,
        gridSize
      );
      const healthText = `${this.health}`;
      // Draw health above the goblin
      this.healthText =
        this.healthText ||
        this.scene.add.text(this.x - 10, this.y - 90, healthText, {
          fontSize: "9px",
          fill: "#ffffff",
        });
      this.healthText.setText(healthText);
      this.healthText.setPosition(this.x - 10, this.y - 30);

      if (this.health <= 0 && !paused) {
        this.healthText.destroy();
        return;
      }
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

    update(dir) {
      this.move(dir);
      if (this.health <= 0) {
        enemies.splice(enemies.indexOf(this), 1); // remove the enemy from the array
      }
    }
  }

  class Bullet {
    constructor(x, y, target) {
      this.x = x;
      this.y = y;
      this.target = target;
      this.speed = 10;
      this.damage = 10;
      bullets.push(this);
    }
    draw() {
      graphics.fillStyle(0xff0000, 1);
      graphics.fillRect(this.x - 5, this.y - 5, 10, 10);
    }

    move() {
      this.draw();
      let dx = this.target.x - this.x;
      let dy = this.target.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
      if (distance <= 30) {
        this.target.health -= this.damage;
        bullets.splice(bullets.indexOf(this), 1);
      }
    }
    update() {
      this.move();
    }
  }

  const towerIcons = document.querySelectorAll(".tower-icon");
  towerIcons.forEach((icon) => {
    icon.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData(
        "text/plain",
        event.target.style.backgroundColor
      );
    });
  });
  const gameContainer = document.getElementById("ImGame");
  gameContainer.addEventListener("dragover", (event) => {
    createGrid();
    squareHighlight.value = true;
    squareHighlight.x =
      Math.floor((event.clientX - gameContainer.offsetLeft) / gridSize) *
      gridSize;
    squareHighlight.y =
      Math.floor((event.clientY - gameContainer.offsetTop) / gridSize) *
      gridSize;
    highlightSquare(squareHighlight.x, squareHighlight.y);

    event.preventDefault(); // Allow drop
  });
  gameContainer.addEventListener("drop", (event) => {
    event.preventDefault();
    const color = event.dataTransfer.getData("text/plain");

    const x =
      Math.floor((event.clientX - gameContainer.offsetLeft) / gridSize) *
        gridSize +
      gridSize / 2;
    const y =
      Math.floor((event.clientY - gameContainer.offsetTop) / gridSize) *
        gridSize +
      gridSize / 2;
    const newTower = new Tower(x, y, color); // Create a new tower at the snapped grid location
    newTower.draw(); // Ensure the new tower is drawn immediately
  });
  gameContainer.addEventListener("click", (event) => {
    clickCheck.value = true;
    clickCheck.x =
      Math.floor((event.clientX - gameContainer.offsetLeft) / gridSize) *
        gridSize +
      gridSize / 2;
    clickCheck.y =
      Math.floor((event.clientY - gameContainer.offsetTop) / gridSize) *
        gridSize +
      gridSize / 2;
  });
  new Enemy(37 * 3, -37, "enemy", this);
}

function update() {
  graphics.clear();

  if (paused) {
    createGrid();
    if (squareHighlight.value) {
      for (let i = 0; i < 10 && squareHighlight.value; i++) {
        highlightSquare(squareHighlight.x + bug, squareHighlight.y);
      }
    }
    enemies.forEach((enemy) => {
      enemy.draw();
    });
    towers.forEach((tower) => {
      tower.draw();
      tower.drawRange();
    });
  }
  if (!paused) {
    enemies.forEach((enemy) => {
      enemy.update("down");
      for (let i = 0; i < towers.length; i++) {
        towers[i].update(enemy);
      }
    });
    towers.forEach((tower) => {
      tower.update();
    });
  }
}
