// Conway's Game of Life - ASCII style
(function() {
  const CELL_ALIVE = '█';
  const CELL_DEAD = ' ';
  const COLS = 145;
  const ROWS = 22;
  const INTERVAL = 200; // ms between generations

  let grid = [];
  let container = null;
  let running = false;

  // Initialize with random state
  function init() {
    grid = [];
    for (let y = 0; y < ROWS; y++) {
      grid[y] = [];
      for (let x = 0; x < COLS; x++) {
        grid[y][x] = Math.random() < 0.3 ? 1 : 0;
      }
    }
  }

  // Count live neighbors (toroidal wrapping)
  function countNeighbors(x, y) {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = (x + dx + COLS) % COLS;
        const ny = (y + dy + ROWS) % ROWS;
        count += grid[ny][nx];
      }
    }
    return count;
  }

  // Compute next generation
  function step() {
    const newGrid = [];
    for (let y = 0; y < ROWS; y++) {
      newGrid[y] = [];
      for (let x = 0; x < COLS; x++) {
        const neighbors = countNeighbors(x, y);
        const alive = grid[y][x];
        // Rules: alive with 2-3 neighbors survives, dead with 3 neighbors born
        newGrid[y][x] = alive ? (neighbors === 2 || neighbors === 3 ? 1 : 0) : (neighbors === 3 ? 1 : 0);
      }
    }
    grid = newGrid;
  }

  // Render grid to ASCII
  function render() {
    if (!container) return;
    let output = '';
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        output += grid[y][x] ? CELL_ALIVE : CELL_DEAD;
      }
      if (y < ROWS - 1) output += '\n';
    }
    container.textContent = output;
  }

  // Check if grid is static or empty
  function isStagnant() {
    let alive = 0;
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        alive += grid[y][x];
      }
    }
    return alive < 5; // Reset if too few cells
  }

  // Main loop
  function loop() {
    if (!running) return;
    step();
    if (isStagnant()) init();
    render();
    setTimeout(loop, INTERVAL);
  }

  // Start when DOM ready
  function start() {
    container = document.getElementById('life-canvas');
    if (!container) return;

    init();
    render();
    running = true;
    setTimeout(loop, INTERVAL);

    // Pause when tab not visible (saves CPU)
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        running = false;
      } else {
        running = true;
        loop();
      }
    });

    // Click to reset
    container.addEventListener('click', function() {
      init();
      render();
    });

    // Mouse move to spawn cells
    container.addEventListener('mousemove', function(e) {
      const rect = container.getBoundingClientRect();
      const style = window.getComputedStyle(container);
      const fontSize = parseFloat(style.fontSize);
      const lineHeight = parseFloat(style.lineHeight) || fontSize * 0.6;
      const letterSpacing = parseFloat(style.letterSpacing) || 0;

      // Calculate character dimensions
      const charWidth = fontSize * 0.6 + letterSpacing; // Approximate monospace char width
      const charHeight = lineHeight;

      // Get mouse position relative to container
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Convert to grid coordinates
      const gridX = Math.floor(mouseX / charWidth);
      const gridY = Math.floor(mouseY / charHeight);

      // Spawn a small cluster of cells around the mouse position
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const x = (gridX + dx + COLS) % COLS;
          const y = (gridY + dy + ROWS) % ROWS;
          if (x >= 0 && x < COLS && y >= 0 && y < ROWS) {
            if (Math.random() < 0.5) { // 50% chance to spawn each cell
              grid[y][x] = 1;
            }
          }
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
