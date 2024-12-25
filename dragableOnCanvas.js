// Create a draggable tower representation
const towerIcon = this.add.rectangle(40, 200, 37, 37, 0x0000ff).setInteractive();
  
// Enable dragging
this.input.setDraggable(towerIcon);

// Handle drag events
towerIcon.on('drag', function (pointer) {
  this.x = pointer.x;
  this.y = pointer.y;
});

// Handle drop event
towerIcon.on('dragend', function (pointer) {
  // Create a new Tower instance at the drop position
  const newTower = new Tower(pointer.x, pointer.y, `tower_${towers.length + 1}`);
  towers.push(newTower); // Store the new tower in the towers array
});






















function create() {
  // ... existing code ...

  // Add drag-and-drop functionality for tower icons
  const towerIcons = document.querySelectorAll('.tower-icon');
  towerIcons.forEach(icon => {
    icon.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', event.target.style.backgroundColor);
    });
  });

  // Add a listener for the canvas to handle drop events
  const gameContainer = document.getElementById('game-container');
  gameContainer.addEventListener('dragover', (event) => {
    event.preventDefault(); // Allow drop
  });

  gameContainer.addEventListener('drop', (event) => {
    event.preventDefault();
    const color = event.dataTransfer.getData('text/plain');
    const x = event.clientX - gameContainer.offsetLeft;
    const y = event.clientY - gameContainer.offsetTop;
    const newTower = new Tower(x, y, color); // Create a new tower at the drop location
    newTower.draw(); // Ensure the new tower is drawn immediately
  });

  // ... existing code ...
}

function update() {
  graphics.clear();
  towers.forEach(tower => {
    tower.update(); // Update each tower
  });
  enemies.forEach(enemy => {
    enemy.update("right"); // Update enemies (you can adjust direction as needed)
  });
}