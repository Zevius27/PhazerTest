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

let graphics;

function preload() {}

function create() {
  graphics = this.add.graphics();
  let scene = this;
  const circle = scene.physics.add.sprite(185, 185, null); // Create a circular sprite at the specified position
  circle.setDisplaySize(boxSize, boxSize); // Set the display size to make it a circle
  circle.setBounce(0.5); // bounce off other objects
  circle.setCollideWorldBounds(true); // prevent it from going out of bounds

  class Circle {
    constructor(physicsSprite) {
      this.sprite = physicsSprite;
      this.size = boxSize; // Divide by 2 since size is radius for graphics circle
    }
    
    draw() {
      graphics.clear(); // Clear previous frame
      graphics.fillStyle(0x0000ff, 1);
      graphics.fillCircle(this.sprite.x, this.sprite.y, this.size);
    }
  }
  
  // Create circle instance
  const graphicsCircle = new Circle(circle);
  
  // Add keyboard controls
  scene.input.keyboard.on("keydown-SPACE", () => {
    if (circle.body.touching.down) {
      circle.setVelocityY(-200);
    }
  });
  
  // Add to update loop
  scene.events.on('update', () => {
    graphicsCircle.draw();
  });
}

function update() {
  // Update loop is handled by the event listener above
}
