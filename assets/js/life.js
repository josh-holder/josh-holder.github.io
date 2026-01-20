// Conway's Game of Life - ASCII style with color decay
(function() {
  const CELL_ALIVE = '█';
  const CELL_DEAD = ' ';
  const COLS = 145;
  const ROWS = 22;
  const INTERVAL = 200; // ms between generations
  const MAX_AGE = 10; // generations until fully gray
  const FRESH_AGE = 1; // age for mouse-spawned cells

  // Color interpolation from muted gold to gray (slightly dimmer than theme accent)
  const COLOR_ACCENT = { r: 204, g: 163, b: 0 };   // #cca300 - dimmed from #ffcc00
  const COLOR_MUTED = { r: 128, g: 128, b: 128 };  // #808080

  let grid = [];      // stores age: 0 = dead, 1+ = alive with age
  let container = null;
  let running = false;

  // Get color for a given age (1 = freshest/most colored)
  function getColor(age) {
    if (age >= MAX_AGE) return null; // use default gray
    const t = (age - 1) / (MAX_AGE - 1); // 0 to 1
    const r = Math.round(COLOR_ACCENT.r + t * (COLOR_MUTED.r - COLOR_ACCENT.r));
    const g = Math.round(COLOR_ACCENT.g + t * (COLOR_MUTED.g - COLOR_ACCENT.g));
    const b = Math.round(COLOR_ACCENT.b + t * (COLOR_MUTED.b - COLOR_ACCENT.b));
    return `rgb(${r},${g},${b})`;
  }

  // Initialize with random state (all start at max age = gray)
  function init() {
    grid = [];
    for (let y = 0; y < ROWS; y++) {
      grid[y] = [];
      for (let x = 0; x < COLS; x++) {
        grid[y][x] = Math.random() < 0.3 ? MAX_AGE : 0;
      }
    }
  }

  // Count live neighbors and find minimum age among them (toroidal wrapping)
  function getNeighborInfo(x, y) {
    let count = 0;
    let minAge = MAX_AGE;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = (x + dx + COLS) % COLS;
        const ny = (y + dy + ROWS) % ROWS;
        const age = grid[ny][nx];
        if (age > 0) {
          count++;
          if (age < minAge) minAge = age;
        }
      }
    }
    return { count, minAge };
  }

  // Compute next generation with age tracking
  function step() {
    const newGrid = [];
    for (let y = 0; y < ROWS; y++) {
      newGrid[y] = [];
      for (let x = 0; x < COLS; x++) {
        const { count: neighbors, minAge } = getNeighborInfo(x, y);
        const currentAge = grid[y][x];
        const alive = currentAge > 0;

        if (alive && (neighbors === 2 || neighbors === 3)) {
          // Survives: age increases by 1, capped at MAX_AGE
          newGrid[y][x] = Math.min(currentAge + 1, MAX_AGE);
        } else if (!alive && neighbors === 3) {
          // Born: inherit youngest parent's age + 1, capped at MAX_AGE
          newGrid[y][x] = Math.min(minAge + 1, MAX_AGE);
        } else {
          // Dies or stays dead
          newGrid[y][x] = 0;
        }
      }
    }
    grid = newGrid;
  }

  // Render grid to ASCII with colored cells
  function render() {
    if (!container) return;
    let output = '';
    let currentColor = null;
    let currentRun = '';

    function flushRun() {
      if (currentRun.length === 0) return;
      if (currentColor) {
        output += `<span style="color:${currentColor}">${currentRun}</span>`;
      } else {
        output += currentRun;
      }
      currentRun = '';
    }

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const age = grid[y][x];
        const char = age > 0 ? CELL_ALIVE : CELL_DEAD;
        const color = age > 0 ? getColor(age) : null;

        if (color !== currentColor) {
          flushRun();
          currentColor = color;
        }
        currentRun += char;
      }
      if (y < ROWS - 1) {
        currentRun += '\n';
      }
    }
    flushRun();
    container.innerHTML = output;
  }

  // Check if grid is static or empty
  function isStagnant() {
    let alive = 0;
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (grid[y][x] > 0) alive++;
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

    // Mouse move to spawn cells with fresh color
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

      // Spawn a small cluster of cells around the mouse position with fresh age
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const x = (gridX + dx + COLS) % COLS;
          const y = (gridY + dy + ROWS) % ROWS;
          if (x >= 0 && x < COLS && y >= 0 && y < ROWS) {
            if (Math.random() < 0.75) { // 75% chance to spawn each cell
              grid[y][x] = FRESH_AGE; // Start with fresh color
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
