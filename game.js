"use strict";

const TILE_SIZE = 48;
const GRID_COLS = 18;
const GRID_ROWS = 10;
const ARENA_WIDTH = GRID_COLS * TILE_SIZE;
const ARENA_HEIGHT = GRID_ROWS * TILE_SIZE;
const HUD_HEIGHT = 60;
const PLAYER_TEAM = "player";
const ENEMY_TEAM = "enemy";

const toolDefinitions = [
  { id: "empty", label: "Empty" },
  { id: "wall", label: "Wall" },
  { id: "hazard", label: "Hazard" },
  { id: "player", label: "Player" },
  { id: "bot", label: "Bot" },
  { id: "rival", label: "Rival" }
];

const frameCatalog = {
  saber: {
    label: "Saber",
    damage: 18,
    reach: 78,
    cooldown: 0.62,
    knockback: 1.08,
    arc: 1.38,
    speed: 1.02,
    moveScale: 1
  },
  spear: {
    label: "Spear",
    damage: 16,
    reach: 104,
    cooldown: 0.76,
    knockback: 1.14,
    arc: 0.86,
    speed: 0.92,
    moveScale: 0.96
  },
  cleaver: {
    label: "Cleaver",
    damage: 24,
    reach: 68,
    cooldown: 0.86,
    knockback: 1.34,
    arc: 1.1,
    speed: 0.86,
    moveScale: 0.93
  },
  chainblade: {
    label: "Chainblade",
    damage: 15,
    reach: 88,
    cooldown: 0.52,
    knockback: 0.94,
    arc: 1.58,
    speed: 1.18,
    moveScale: 1.04
  }
};

const materialCatalog = {
  ironwood: {
    label: "Ironwood Core",
    damage: -1,
    reach: -2,
    speed: 0.06,
    cooldown: -0.05,
    knockback: -0.08,
    moveScale: 0.03,
    color: "#89e6dc"
  },
  sunsteel: {
    label: "Sunsteel",
    damage: 3,
    reach: 2,
    speed: 0.02,
    cooldown: -0.02,
    knockback: 0.02,
    moveScale: 0,
    color: "#f0d48b"
  },
  voidglass: {
    label: "Voidglass",
    damage: 1,
    reach: 4,
    speed: 0.1,
    cooldown: -0.06,
    knockback: -0.02,
    moveScale: 0.02,
    color: "#9e84ff"
  },
  embersteel: {
    label: "Embersteel",
    damage: 5,
    reach: 0,
    speed: -0.06,
    cooldown: 0.06,
    knockback: 0.12,
    moveScale: -0.04,
    color: "#ff8752"
  }
};

const edgeCatalog = {
  needle: {
    label: "Needle Edge",
    damage: 1,
    reach: 6,
    speed: 0.08,
    cooldown: -0.04,
    knockback: -0.02,
    arc: -0.08
  },
  crescent: {
    label: "Crescent Sweep",
    damage: 0,
    reach: 2,
    speed: 0.02,
    cooldown: -0.01,
    knockback: 0.04,
    arc: 0.18
  },
  breaker: {
    label: "Breaker Face",
    damage: 4,
    reach: -4,
    speed: -0.12,
    cooldown: 0.09,
    knockback: 0.16,
    arc: -0.02
  },
  serrated: {
    label: "Serrated Bite",
    damage: 3,
    reach: 0,
    speed: -0.03,
    cooldown: 0.03,
    knockback: 0.08,
    arc: 0.06
  }
};

const arenaPresets = {
  foundry: [
    "WWWWWWWWWWWWWWWWWW",
    "W...H..........B.W",
    "W....WWW..........W",
    "W.................W",
    "W.P....H....WWW...W",
    "W.......W.........W",
    "W....WWW.....H....W",
    "W.........R.......W",
    "W.B.............B.W",
    "WWWWWWWWWWWWWWWWWW"
  ],
  ring: [
    "WWWWWWWWWWWWWWWWWW",
    "W.B.....H....R...W",
    "W....WW....WW....W",
    "W................W",
    "W...W........W...W",
    "W...W...P....W...W",
    "W................W",
    "W....WW....WW....W",
    "W.B.....H......B.W",
    "WWWWWWWWWWWWWWWWWW"
  ],
  crossfire: [
    "WWWWWWWWWWWWWWWWWW",
    "W.B...W.....W...BW",
    "W.....W..H..W....W",
    "W.....W.....W....W",
    "W.WWWWW..P..WWWW.W",
    "W.....W.....W....W",
    "W.....W..H..W....W",
    "W.B...W.....W..R.W",
    "W.................W",
    "WWWWWWWWWWWWWWWWWW"
  ]
};

const tileLegend = {
  ".": "empty",
  W: "wall",
  H: "hazard",
  P: "player",
  B: "bot",
  R: "rival"
};

const keyBindings = {
  p1: { up: "KeyW", left: "KeyA", down: "KeyS", right: "KeyD", attack: "KeyF", dash: "KeyG" },
  p2: { up: "KeyI", left: "KeyJ", down: "KeyK", right: "KeyL", attack: "KeyO", dash: "KeyP" }
};

const ui = {
  frameSelect: document.querySelector("#frame-select"),
  materialSelect: document.querySelector("#material-select"),
  edgeSelect: document.querySelector("#edge-select"),
  weaponName: document.querySelector("#weapon-name"),
  lengthRange: document.querySelector("#length-range"),
  balanceRange: document.querySelector("#balance-range"),
  temperRange: document.querySelector("#temper-range"),
  lengthValue: document.querySelector("#length-value"),
  balanceValue: document.querySelector("#balance-value"),
  temperValue: document.querySelector("#temper-value"),
  forgePreview: document.querySelector("#forge-preview"),
  weaponTitle: document.querySelector("#weapon-title"),
  weaponLore: document.querySelector("#weapon-lore"),
  forgeStats: document.querySelector("#forge-stats"),
  saveWeapon: document.querySelector("#save-weapon"),
  equipWeapon: document.querySelector("#equip-weapon"),
  armoryList: document.querySelector("#armory-list"),
  toolPalette: document.querySelector("#tool-palette"),
  arenaEditor: document.querySelector("#arena-editor"),
  clearArena: document.querySelector("#clear-arena"),
  mirrorArena: document.querySelector("#mirror-arena"),
  presetButtons: Array.from(document.querySelectorAll(".preset-button")),
  matchMode: document.querySelector("#match-mode"),
  botCount: document.querySelector("#bot-count"),
  botCountValue: document.querySelector("#bot-count-value"),
  botCountLabel: document.querySelector("#bot-count-label"),
  startMatch: document.querySelector("#start-match"),
  battlefield: document.querySelector("#battlefield"),
  hudPlayerWeapon: document.querySelector("#hud-player-weapon"),
  hudRivalWeapon: document.querySelector("#hud-rival-weapon"),
  hudArenaName: document.querySelector("#hud-arena-name"),
  hudResult: document.querySelector("#hud-result"),
  matchSummary: document.querySelector("#match-summary"),
  touchControls: document.querySelector("#touch-controls")
};

const canvas = ui.battlefield;
const ctx = canvas.getContext("2d");
const previewCtx = ui.forgePreview.getContext("2d");

const state = {
  forge: {
    name: "Ashbite",
    frame: "saber",
    material: "sunsteel",
    edge: "crescent",
    length: 62,
    balance: 4,
    temper: 76
  },
  armory: [],
  activeWeaponId: null,
  rivalWeaponId: null,
  arenaName: "Foundry",
  selectedTool: "wall",
  arenaTiles: parseArena(arenaPresets.foundry),
  pointerPainting: false,
  round: null,
  roundId: 0,
  keysDown: new Set(),
  touchState: {
    up: false,
    left: false,
    down: false,
    right: false,
    attack: false,
    dash: false
  },
  controlLatch: {
    p1Attack: false,
    p1Dash: false,
    p2Attack: false,
    p2Dash: false
  },
  lastFrameTime: 0,
  sparkId: 0
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randomChoice(values) {
  return values[Math.floor(Math.random() * values.length)];
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function makeId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function parseArena(rows) {
  return rows.flatMap((row) => row.split("").map((symbol) => tileLegend[symbol] || "empty"));
}

function cloneTiles(tiles) {
  return tiles.slice();
}

function indexFromCell(col, row) {
  return row * GRID_COLS + col;
}

function cellFromIndex(index) {
  return { col: index % GRID_COLS, row: Math.floor(index / GRID_COLS) };
}

function getTile(col, row, tiles = state.arenaTiles) {
  if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) {
    return "wall";
  }
  return tiles[indexFromCell(col, row)];
}

function cellCenter(col, row) {
  return {
    x: col * TILE_SIZE + TILE_SIZE * 0.5,
    y: row * TILE_SIZE + TILE_SIZE * 0.5
  };
}

function pointToCell(x, y) {
  return {
    col: clamp(Math.floor(x / TILE_SIZE), 0, GRID_COLS - 1),
    row: clamp(Math.floor(y / TILE_SIZE), 0, GRID_ROWS - 1)
  };
}

function populateSelect(select, catalog) {
  Object.entries(catalog).forEach(([id, entry]) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = entry.label;
    select.append(option);
  });
}

function buildWeaponFromForge(forge) {
  const frame = frameCatalog[forge.frame];
  const material = materialCatalog[forge.material];
  const edge = edgeCatalog[forge.edge];

  const lengthFactor = (forge.length - 60) * 0.48;
  const balanceFactor = forge.balance / 30;
  const temperFactor = (forge.temper - 60) / 40;

  const damage = Math.round(
    frame.damage +
      material.damage +
      edge.damage +
      lengthFactor * 0.24 +
      balanceFactor * 2 +
      temperFactor * 3
  );
  const reach = Math.round(frame.reach + material.reach + edge.reach + lengthFactor * 0.95);
  const speed = clamp(frame.speed + material.speed + edge.speed - lengthFactor * 0.004 - balanceFactor * 0.08, 0.68, 1.38);
  const cooldown = clamp(
    frame.cooldown + material.cooldown + edge.cooldown + lengthFactor * 0.003 + balanceFactor * 0.05 - temperFactor * 0.03,
    0.38,
    1.08
  );
  const knockback = clamp(
    frame.knockback + material.knockback + edge.knockback + lengthFactor * 0.003 + Math.max(balanceFactor, 0) * 0.08,
    0.84,
    1.78
  );
  const arc = clamp(frame.arc + edge.arc - balanceFactor * 0.08, 0.68, 1.78);
  const moveScale = clamp(frame.moveScale + material.moveScale - Math.max(lengthFactor, 0) * 0.0015, 0.82, 1.12);
  const staminaCost = Math.round(clamp(11 + damage * 0.42 + (1 - speed) * 14 + knockback * 2.8, 9, 26));

  const styleText =
    damage >= 24
      ? "a heavy execution piece"
      : speed >= 1.12
        ? "a twitch-fast dueling build"
        : reach >= 95
          ? "a long-control spacing weapon"
          : "a balanced arena weapon";

  return {
    id: forge.id || makeId("weapon"),
    name: forge.name.trim() || `${material.label} ${frame.label}`,
    frameId: forge.frame,
    materialId: forge.material,
    edgeId: forge.edge,
    frame: frame.label,
    material: material.label,
    edge: edge.label,
    damage,
    reach,
    speed,
    cooldown,
    knockback,
    arc,
    staminaCost,
    moveScale,
    temper: forge.temper,
    balance: forge.balance,
    length: forge.length,
    color: material.color,
    lore: `${forge.name.trim() || "This weapon"} is ${styleText}, tuned with ${edge.label.toLowerCase()} and ${material.label.toLowerCase()}.`
  };
}

function createRandomEnemyWeapon() {
  const forge = {
    name: randomChoice(["Grinder", "Wisp", "Cinder", "Vault", "Raze", "Hollow", "Shard"]),
    frame: randomChoice(Object.keys(frameCatalog)),
    material: randomChoice(Object.keys(materialCatalog)),
    edge: randomChoice(Object.keys(edgeCatalog)),
    length: Math.round(randomRange(42, 88)),
    balance: Math.round(randomRange(-22, 22)),
    temper: Math.round(randomRange(36, 96))
  };
  return buildWeaponFromForge(forge);
}

function currentBlueprint() {
  return buildWeaponFromForge(state.forge);
}

function syncForgeOutputs() {
  ui.lengthValue.textContent = `${state.forge.length}`;
  ui.balanceValue.textContent = `${state.forge.balance}`;
  ui.temperValue.textContent = `${state.forge.temper}`;
}

function renderForgeStats(weapon) {
  const stats = [
    { label: "Damage", value: weapon.damage, max: 32 },
    { label: "Reach", value: weapon.reach, max: 128 },
    { label: "Speed", value: Math.round(weapon.speed * 100), max: 140 },
    { label: "Knockback", value: Math.round(weapon.knockback * 100), max: 180 },
    { label: "Stamina", value: weapon.staminaCost, max: 28 },
    { label: "Arc", value: Math.round(weapon.arc * 100), max: 180 }
  ];

  ui.forgeStats.innerHTML = "";
  stats.forEach((stat) => {
    const card = document.createElement("div");
    card.className = "stat-card";
    card.innerHTML = `
      <span>${stat.label}</span>
      <strong>${stat.value}</strong>
      <div class="bar-track">
        <div class="bar-fill" style="width: ${Math.round((stat.value / stat.max) * 100)}%"></div>
      </div>
    `;
    ui.forgeStats.append(card);
  });
}

function renderForgePreview(weapon) {
  previewCtx.clearRect(0, 0, ui.forgePreview.width, ui.forgePreview.height);
  previewCtx.save();
  previewCtx.translate(54, ui.forgePreview.height / 2);
  previewCtx.lineCap = "round";

  previewCtx.strokeStyle = "rgba(255,255,255,0.18)";
  previewCtx.lineWidth = 2;
  for (let i = 0; i < 7; i += 1) {
    const x = i * 44;
    previewCtx.beginPath();
    previewCtx.moveTo(x, -50);
    previewCtx.lineTo(x + 10, 50);
    previewCtx.stroke();
  }

  previewCtx.strokeStyle = weapon.color;
  previewCtx.fillStyle = weapon.color;
  const shaft = clamp(weapon.reach * 0.8, 40, 120);
  const bladeSize = clamp(weapon.damage * 1.4, 20, 48);

  previewCtx.lineWidth = 10;
  previewCtx.beginPath();
  previewCtx.moveTo(0, 0);
  previewCtx.lineTo(shaft, 0);
  previewCtx.stroke();

  previewCtx.lineWidth = 6;
  previewCtx.strokeStyle = "#f4efe7";
  previewCtx.beginPath();
  previewCtx.moveTo(-16, 0);
  previewCtx.lineTo(0, 0);
  previewCtx.stroke();

  previewCtx.fillStyle = weapon.color;
  previewCtx.beginPath();
  if (weapon.frameId === "spear") {
    previewCtx.moveTo(shaft, 0);
    previewCtx.lineTo(shaft + bladeSize, -10);
    previewCtx.lineTo(shaft + bladeSize * 0.65, 0);
    previewCtx.lineTo(shaft + bladeSize, 10);
  } else if (weapon.frameId === "cleaver") {
    previewCtx.moveTo(shaft - 6, -bladeSize * 0.55);
    previewCtx.lineTo(shaft + bladeSize * 0.5, -bladeSize * 0.35);
    previewCtx.lineTo(shaft + bladeSize * 0.44, bladeSize * 0.38);
    previewCtx.lineTo(shaft - 10, bladeSize * 0.45);
  } else if (weapon.frameId === "chainblade") {
    previewCtx.arc(shaft + bladeSize * 0.2, 0, bladeSize * 0.45, 0, Math.PI * 2);
  } else {
    previewCtx.moveTo(shaft, -bladeSize * 0.48);
    previewCtx.lineTo(shaft + bladeSize * 0.8, 0);
    previewCtx.lineTo(shaft, bladeSize * 0.48);
  }
  previewCtx.closePath();
  previewCtx.fill();
  previewCtx.restore();
}

function renderForge() {
  syncForgeOutputs();
  const weapon = currentBlueprint();
  ui.weaponTitle.textContent = weapon.name;
  ui.weaponLore.textContent = weapon.lore;
  renderForgeStats(weapon);
  renderForgePreview(weapon);
}

function saveCurrentWeapon({ equip = true } = {}) {
  const blueprint = currentBlueprint();
  const existingIndex = state.armory.findIndex((weapon) => weapon.id === blueprint.id);

  if (existingIndex >= 0) {
    state.armory.splice(existingIndex, 1, blueprint);
  } else {
    state.armory.unshift(blueprint);
  }

  if (!state.rivalWeaponId) {
    state.rivalWeaponId = blueprint.id;
  }
  if (equip || !state.activeWeaponId) {
    state.activeWeaponId = blueprint.id;
  }

  renderArmory();
  updateHudLabels();
}

function loadWeaponIntoForge(weapon) {
  state.forge = {
    id: weapon.id,
    name: weapon.name,
    frame: weapon.frameId,
    material: weapon.materialId,
    edge: weapon.edgeId,
    length: weapon.length,
    balance: weapon.balance,
    temper: weapon.temper
  };

  ui.weaponName.value = state.forge.name;
  ui.frameSelect.value = state.forge.frame;
  ui.materialSelect.value = state.forge.material;
  ui.edgeSelect.value = state.forge.edge;
  ui.lengthRange.value = `${state.forge.length}`;
  ui.balanceRange.value = `${state.forge.balance}`;
  ui.temperRange.value = `${state.forge.temper}`;
  renderForge();
}

function deleteWeapon(id) {
  state.armory = state.armory.filter((weapon) => weapon.id !== id);
  if (state.activeWeaponId === id) {
    state.activeWeaponId = state.armory[0]?.id || null;
  }
  if (state.rivalWeaponId === id) {
    state.rivalWeaponId = state.armory[0]?.id || null;
  }
  renderArmory();
  updateHudLabels();
}

function renderArmory() {
  ui.armoryList.innerHTML = "";

  if (!state.armory.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "arena-hint";
    emptyState.textContent = "No saved weapons yet. Forge one and save it.";
    ui.armoryList.append(emptyState);
    return;
  }

  state.armory.forEach((weapon) => {
    const card = document.createElement("article");
    card.className = "armory-card";
    if (weapon.id === state.activeWeaponId) {
      card.classList.add("active");
    }
    if (weapon.id === state.rivalWeaponId) {
      card.classList.add("rival");
    }

    const header = document.createElement("header");
    header.innerHTML = `<strong>${weapon.name}</strong><span>${weapon.frame}</span>`;

    const meta = document.createElement("div");
    meta.className = "armory-meta";
    meta.innerHTML = `
      <span class="pill">${weapon.material}</span>
      <span class="pill">${weapon.edge}</span>
      <span class="pill">${weapon.damage} dmg</span>
      <span class="pill">${weapon.reach} reach</span>
    `;

    const actions = document.createElement("div");
    actions.className = "armory-actions";

    const equip = document.createElement("button");
    equip.className = "ghost-button";
    equip.textContent = "Equip";
    equip.addEventListener("click", () => {
      state.activeWeaponId = weapon.id;
      renderArmory();
      updateHudLabels();
    });

    const rival = document.createElement("button");
    rival.className = "ghost-button";
    rival.textContent = "Set Rival";
    rival.addEventListener("click", () => {
      state.rivalWeaponId = weapon.id;
      renderArmory();
      updateHudLabels();
    });

    const edit = document.createElement("button");
    edit.className = "ghost-button";
    edit.textContent = "Reforge";
    edit.addEventListener("click", () => loadWeaponIntoForge(weapon));

    const remove = document.createElement("button");
    remove.className = "ghost-button";
    remove.textContent = "Delete";
    remove.addEventListener("click", () => deleteWeapon(weapon.id));

    actions.append(equip, rival, edit, remove);
    card.append(header, meta, actions);
    ui.armoryList.append(card);
  });
}

function createToolPalette() {
  toolDefinitions.forEach((tool) => {
    const button = document.createElement("button");
    button.className = "ghost-button tool-button";
    button.dataset.tool = tool.id;
    button.textContent = tool.label;
    button.addEventListener("click", () => {
      state.selectedTool = tool.id;
      renderToolPalette();
    });
    ui.toolPalette.append(button);
  });
}

function renderToolPalette() {
  Array.from(ui.toolPalette.children).forEach((button) => {
    button.classList.toggle("active", button.dataset.tool === state.selectedTool);
  });
}

function renderArenaEditor() {
  ui.arenaEditor.innerHTML = "";
  for (let row = 0; row < GRID_ROWS; row += 1) {
    for (let col = 0; col < GRID_COLS; col += 1) {
      const tile = getTile(col, row);
      const cell = document.createElement("button");
      cell.className = `arena-cell ${tile}`;
      cell.dataset.col = `${col}`;
      cell.dataset.row = `${row}`;
      cell.type = "button";
      cell.ariaLabel = `${tile} tile`;
      ui.arenaEditor.append(cell);
    }
  }
}

function paintArenaCell(col, row) {
  const index = indexFromCell(col, row);
  const nextTiles = cloneTiles(state.arenaTiles);

  if (state.selectedTool === "player" || state.selectedTool === "rival") {
    for (let i = 0; i < nextTiles.length; i += 1) {
      if (nextTiles[i] === state.selectedTool) {
        nextTiles[i] = "empty";
      }
    }
  }

  nextTiles[index] = state.selectedTool;
  state.arenaTiles = nextTiles;
  state.arenaName = "Custom Arena";
  renderArenaEditor();
  updateHudLabels();
}

function ensureArenaSpawns() {
  const tiles = cloneTiles(state.arenaTiles);
  if (!tiles.includes("player")) {
    tiles[indexFromCell(3, 5)] = "player";
  }
  if (!tiles.includes("bot")) {
    tiles[indexFromCell(14, 2)] = "bot";
  }
  if (!tiles.includes("rival")) {
    tiles[indexFromCell(14, 7)] = "rival";
  }
  state.arenaTiles = tiles;
}

function arenaLabelFromId(id) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

function loadArenaPreset(id) {
  state.arenaTiles = parseArena(arenaPresets[id]);
  state.arenaName = arenaLabelFromId(id);
  ensureArenaSpawns();
  renderArenaEditor();
  updateHudLabels();
}

function clearArena() {
  const tiles = new Array(GRID_COLS * GRID_ROWS).fill("empty");
  tiles[indexFromCell(2, 5)] = "player";
  tiles[indexFromCell(15, 5)] = "bot";
  tiles[indexFromCell(15, 2)] = "rival";
  state.arenaTiles = tiles;
  state.arenaName = "Custom Blank";
  renderArenaEditor();
  updateHudLabels();
}

function mirrorArena() {
  const nextTiles = cloneTiles(state.arenaTiles);
  for (let row = 0; row < GRID_ROWS; row += 1) {
    for (let col = 0; col < Math.floor(GRID_COLS / 2); col += 1) {
      const leftIndex = indexFromCell(col, row);
      const rightIndex = indexFromCell(GRID_COLS - col - 1, row);
      nextTiles[rightIndex] = state.arenaTiles[leftIndex];
    }
  }
  state.arenaTiles = nextTiles;
  state.arenaName = `${state.arenaName} Mirror`;
  ensureArenaSpawns();
  renderArenaEditor();
  updateHudLabels();
}

function weaponById(id) {
  return state.armory.find((weapon) => weapon.id === id) || null;
}

function updateHudLabels() {
  const activeWeapon = weaponById(state.activeWeaponId);
  const rivalWeapon = weaponById(state.rivalWeaponId);
  ui.hudPlayerWeapon.textContent = activeWeapon?.name || "Unarmed";
  ui.hudRivalWeapon.textContent = rivalWeapon?.name || "Auto Forge";
  ui.hudArenaName.textContent = state.arenaName;
}

function spawnEntity({
  name,
  team,
  x,
  y,
  weapon,
  color,
  controlScheme = null,
  kind = "fighter"
}) {
  return {
    id: makeId("entity"),
    name,
    team,
    x,
    y,
    moveX: 0,
    moveY: 0,
    facingX: 1,
    facingY: 0,
    radius: 16,
    hp: 100,
    maxHp: 100,
    stamina: 100,
    maxStamina: 100,
    pushX: 0,
    pushY: 0,
    attackCooldown: 0,
    dashCooldown: 0,
    invulnerable: 0,
    attackFlash: 0,
    weapon,
    color,
    controlScheme,
    alive: true,
    kind,
    aiRouteTimer: randomRange(0.12, 0.28),
    aiNextCell: null,
    stepTimer: randomRange(0, 0.6)
  };
}

function getArenaSpawns(tiles) {
  const player = [];
  const bots = [];
  const rivals = [];
  const safe = [];

  tiles.forEach((tile, index) => {
    const cell = cellFromIndex(index);
    const center = cellCenter(cell.col, cell.row);
    if (tile !== "wall") {
      safe.push(center);
    }
    if (tile === "player") {
      player.push(center);
    } else if (tile === "bot") {
      bots.push(center);
    } else if (tile === "rival") {
      rivals.push(center);
    }
  });

  return { player, bots, rivals, safe };
}

function fallbackSpawn(usedSpawns, preferredCell) {
  usedSpawns.push(preferredCell);
  return { x: preferredCell.x, y: preferredCell.y };
}

function availableSpawn(spawns, safe, usedSpawns, fallbackIndex) {
  const pick = spawns.find((spawn) => !usedSpawns.includes(spawn));
  if (pick) {
    usedSpawns.push(pick);
    return { x: pick.x, y: pick.y };
  }
  const safePick = safe[fallbackIndex % safe.length] || { x: 120, y: 120 };
  return fallbackSpawn(usedSpawns, safePick);
}

function buildRound() {
  ensureArenaSpawns();
  const tiles = cloneTiles(state.arenaTiles);
  const mode = ui.matchMode.value;
  const botCount = Number(ui.botCount.value);
  const spawns = getArenaSpawns(tiles);
  const usedSpawns = [];

  const playerWeapon = weaponById(state.activeWeaponId) || currentBlueprint();
  const rivalWeapon = weaponById(state.rivalWeaponId) || createRandomEnemyWeapon();
  const playerSpawn = availableSpawn(spawns.player, spawns.safe, usedSpawns, 2);

  const entities = [
    spawnEntity({
      name: "Player 1",
      team: PLAYER_TEAM,
      x: playerSpawn.x,
      y: playerSpawn.y,
      weapon: playerWeapon,
      color: "#6fd2c6",
      controlScheme: "p1"
    })
  ];

  if (mode === "duel") {
    const rivalSpawn = availableSpawn(spawns.rivals, spawns.safe, usedSpawns, spawns.safe.length - 2);
    entities.push(
      spawnEntity({
        name: "Player 2",
        team: ENEMY_TEAM,
        x: rivalSpawn.x,
        y: rivalSpawn.y,
        weapon: rivalWeapon,
        color: "#d5b96f",
        controlScheme: "p2",
        kind: "rival"
      })
    );
  } else {
    for (let i = 0; i < botCount; i += 1) {
      const enemySpawn = availableSpawn(spawns.bots, spawns.safe, usedSpawns, 10 + i * 7);
      const weapon = i === 0 ? rivalWeapon : createRandomEnemyWeapon();
      entities.push(
        spawnEntity({
          name: i === 0 ? "Forged Rival" : `Bot ${i + 1}`,
          team: ENEMY_TEAM,
          x: enemySpawn.x,
          y: enemySpawn.y,
          weapon,
          color: i === 0 ? "#d5b96f" : "#f4efe7",
          kind: i === 0 ? "rival" : "bot"
        })
      );
    }
  }

  return {
    id: ++state.roundId,
    mode,
    tiles,
    entities,
    sparks: [],
    running: true,
    result: "Fighting",
    resultDetail: "Steel is in the air.",
    elapsed: 0
  };
}

function startMatch() {
  if (!state.armory.length) {
    saveCurrentWeapon({ equip: true });
  }

  state.round = buildRound();
  ui.hudResult.textContent = "Fighting";
  ui.matchSummary.textContent =
    state.round.mode === "duel"
      ? "Local duel started. P2 uses IJKL, O, and P."
      : "Skirmish started. The first enemy carries your rival loadout.";
}

function rawPressed(code) {
  return state.keysDown.has(code);
}

function controlSnapshot(scheme) {
  if (scheme === "p1") {
    return {
      up: rawPressed(keyBindings.p1.up) || state.touchState.up,
      left: rawPressed(keyBindings.p1.left) || state.touchState.left,
      down: rawPressed(keyBindings.p1.down) || state.touchState.down,
      right: rawPressed(keyBindings.p1.right) || state.touchState.right,
      attack: rawPressed(keyBindings.p1.attack) || state.touchState.attack,
      dash: rawPressed(keyBindings.p1.dash) || state.touchState.dash
    };
  }

  return {
    up: rawPressed(keyBindings.p2.up),
    left: rawPressed(keyBindings.p2.left),
    down: rawPressed(keyBindings.p2.down),
    right: rawPressed(keyBindings.p2.right),
    attack: rawPressed(keyBindings.p2.attack),
    dash: rawPressed(keyBindings.p2.dash)
  };
}

function normalizeVector(x, y) {
  const length = Math.hypot(x, y);
  if (!length) {
    return { x: 0, y: 0 };
  }
  return { x: x / length, y: y / length };
}

function hostileEntities(round, team) {
  return round.entities.filter((entity) => entity.alive && entity.team !== team);
}

function applyHumanControl(entity, scheme) {
  const snapshot = controlSnapshot(scheme);
  const dirX = (snapshot.right ? 1 : 0) - (snapshot.left ? 1 : 0);
  const dirY = (snapshot.down ? 1 : 0) - (snapshot.up ? 1 : 0);
  const direction = normalizeVector(dirX, dirY);

  entity.moveX = direction.x;
  entity.moveY = direction.y;
  if (direction.x || direction.y) {
    entity.facingX = direction.x;
    entity.facingY = direction.y;
  }

  const attackLatchKey = scheme === "p1" ? "p1Attack" : "p2Attack";
  const dashLatchKey = scheme === "p1" ? "p1Dash" : "p2Dash";

  if (snapshot.attack && !state.controlLatch[attackLatchKey]) {
    performAttack(entity);
  }
  if (snapshot.dash && !state.controlLatch[dashLatchKey]) {
    performDash(entity);
  }

  state.controlLatch[attackLatchKey] = snapshot.attack;
  state.controlLatch[dashLatchKey] = snapshot.dash;
}

function walkable(tile) {
  return tile !== "wall";
}

function findNextCell(startCell, goalCell, tiles) {
  const startIndex = indexFromCell(startCell.col, startCell.row);
  const goalIndex = indexFromCell(goalCell.col, goalCell.row);
  if (startIndex === goalIndex) {
    return goalCell;
  }

  const prev = new Array(tiles.length).fill(-1);
  const queue = [startIndex];
  prev[startIndex] = startIndex;
  let head = 0;

  while (head < queue.length) {
    const current = queue[head];
    head += 1;
    if (current === goalIndex) {
      break;
    }

    const { col, row } = cellFromIndex(current);
    const candidates = [
      { col: col + 1, row },
      { col: col - 1, row },
      { col, row: row + 1 },
      { col, row: row - 1 }
    ];

    candidates.forEach((next) => {
      if (next.col < 0 || next.col >= GRID_COLS || next.row < 0 || next.row >= GRID_ROWS) {
        return;
      }
      const nextIndex = indexFromCell(next.col, next.row);
      if (prev[nextIndex] !== -1 || !walkable(tiles[nextIndex])) {
        return;
      }
      prev[nextIndex] = current;
      queue.push(nextIndex);
    });
  }

  if (prev[goalIndex] === -1) {
    return goalCell;
  }

  let cursor = goalIndex;
  while (prev[cursor] !== startIndex && cursor !== startIndex) {
    cursor = prev[cursor];
  }
  return cellFromIndex(cursor);
}

function applyAiControl(entity, round, dt) {
  const enemies = hostileEntities(round, entity.team);
  if (!enemies.length) {
    entity.moveX = 0;
    entity.moveY = 0;
    return;
  }

  const target = enemies.reduce((best, candidate) => {
    const bestDist = best ? Math.hypot(best.x - entity.x, best.y - entity.y) : Infinity;
    const nextDist = Math.hypot(candidate.x - entity.x, candidate.y - entity.y);
    return nextDist < bestDist ? candidate : best;
  }, null);

  const dx = target.x - entity.x;
  const dy = target.y - entity.y;
  const distance = Math.hypot(dx, dy);
  const directionToTarget = normalizeVector(dx, dy);
  entity.facingX = directionToTarget.x || entity.facingX;
  entity.facingY = directionToTarget.y || entity.facingY;

  entity.aiRouteTimer -= dt;
  if (entity.aiRouteTimer <= 0) {
    entity.aiRouteTimer = randomRange(0.16, 0.34);
    const nextCell = findNextCell(pointToCell(entity.x, entity.y), pointToCell(target.x, target.y), round.tiles);
    entity.aiNextCell = cellCenter(nextCell.col, nextCell.row);
  }

  let moveTarget = entity.aiNextCell || target;
  if (distance < entity.weapon.reach * 0.72) {
    const orbit = normalizeVector(-directionToTarget.y, directionToTarget.x);
    moveTarget = {
      x: entity.x + orbit.x * 44 - directionToTarget.x * 18,
      y: entity.y + orbit.y * 44 - directionToTarget.y * 18
    };
  }

  const move = normalizeVector(moveTarget.x - entity.x, moveTarget.y - entity.y);
  entity.moveX = move.x;
  entity.moveY = move.y;

  if (distance <= entity.weapon.reach + target.radius + 8) {
    performAttack(entity);
    if (Math.random() < 0.05) {
      performDash(entity);
    }
  }
}

function performDash(entity) {
  if (!entity.alive || entity.dashCooldown > 0 || entity.stamina < 18) {
    return;
  }
  const facing = normalizeVector(entity.facingX, entity.facingY);
  entity.pushX += facing.x * 340;
  entity.pushY += facing.y * 340;
  entity.stamina = clamp(entity.stamina - 18, 0, entity.maxStamina);
  entity.dashCooldown = 1.1;
}

function addSpark(round, x, y, color, size = 10) {
  round.sparks.push({
    id: ++state.sparkId,
    x,
    y,
    vx: randomRange(-70, 70),
    vy: randomRange(-70, 70),
    life: randomRange(0.16, 0.34),
    maxLife: randomRange(0.16, 0.34),
    color,
    size
  });
}

function performAttack(entity) {
  if (!state.round || !entity.alive || entity.attackCooldown > 0 || entity.stamina < entity.weapon.staminaCost) {
    return;
  }

  entity.attackCooldown = entity.weapon.cooldown;
  entity.attackFlash = 0.14;
  entity.stamina = clamp(entity.stamina - entity.weapon.staminaCost, 0, entity.maxStamina);

  const round = state.round;
  const facing = normalizeVector(entity.facingX, entity.facingY);
  const cosArc = Math.cos(entity.weapon.arc * 0.5);

  hostileEntities(round, entity.team).forEach((target) => {
    if (!target.alive || target.invulnerable > 0) {
      return;
    }
    const dx = target.x - entity.x;
    const dy = target.y - entity.y;
    const distance = Math.hypot(dx, dy);
    if (distance > entity.weapon.reach + target.radius) {
      return;
    }
    const toward = normalizeVector(dx, dy);
    const alignment = toward.x * facing.x + toward.y * facing.y;
    if (alignment < cosArc) {
      return;
    }

    const crit = entity.weapon.temper > 84 && Math.random() < 0.18;
    const damage = entity.weapon.damage * (crit ? 1.24 : 1) * randomRange(0.92, 1.08);
    target.hp = clamp(target.hp - damage, 0, target.maxHp);
    target.pushX += toward.x * entity.weapon.knockback * 220;
    target.pushY += toward.y * entity.weapon.knockback * 220;
    target.invulnerable = 0.08;

    for (let i = 0; i < 5; i += 1) {
      addSpark(round, target.x, target.y, crit ? "#ffd46d" : entity.weapon.color, crit ? 13 : 9);
    }
  });
}

function resolveWalls(entity, tiles) {
  const minCol = clamp(Math.floor((entity.x - entity.radius) / TILE_SIZE), 0, GRID_COLS - 1);
  const maxCol = clamp(Math.floor((entity.x + entity.radius) / TILE_SIZE), 0, GRID_COLS - 1);
  const minRow = clamp(Math.floor((entity.y - entity.radius) / TILE_SIZE), 0, GRID_ROWS - 1);
  const maxRow = clamp(Math.floor((entity.y + entity.radius) / TILE_SIZE), 0, GRID_ROWS - 1);

  for (let row = minRow; row <= maxRow; row += 1) {
    for (let col = minCol; col <= maxCol; col += 1) {
      if (tiles[indexFromCell(col, row)] !== "wall") {
        continue;
      }

      const left = col * TILE_SIZE;
      const top = row * TILE_SIZE;
      const nearestX = clamp(entity.x, left, left + TILE_SIZE);
      const nearestY = clamp(entity.y, top, top + TILE_SIZE);
      const dx = entity.x - nearestX;
      const dy = entity.y - nearestY;
      const distSq = dx * dx + dy * dy;
      if (distSq >= entity.radius * entity.radius) {
        continue;
      }

      const dist = Math.sqrt(distSq) || 0.001;
      const overlap = entity.radius - dist;
      entity.x += (dx / dist) * overlap;
      entity.y += (dy / dist) * overlap;
      entity.pushX *= 0.6;
      entity.pushY *= 0.6;
    }
  }

  entity.x = clamp(entity.x, entity.radius, ARENA_WIDTH - entity.radius);
  entity.y = clamp(entity.y, entity.radius, ARENA_HEIGHT - entity.radius);
}

function hazardAt(entity, tiles) {
  const cell = pointToCell(entity.x, entity.y);
  return tiles[indexFromCell(cell.col, cell.row)] === "hazard";
}

function updateEntity(entity, round, dt) {
  if (!entity.alive) {
    return;
  }

  if (entity.controlScheme) {
    applyHumanControl(entity, entity.controlScheme);
  } else {
    applyAiControl(entity, round, dt);
  }

  const speed = 170 * entity.weapon.moveScale;
  entity.x += entity.moveX * speed * dt + entity.pushX * dt;
  entity.y += entity.moveY * speed * dt + entity.pushY * dt;
  entity.pushX *= Math.pow(0.08, dt);
  entity.pushY *= Math.pow(0.08, dt);

  resolveWalls(entity, round.tiles);

  if (hazardAt(entity, round.tiles)) {
    entity.hp = clamp(entity.hp - 18 * dt, 0, entity.maxHp);
    addSpark(round, entity.x, entity.y, "#ff8752", 7);
  }

  entity.attackCooldown = Math.max(0, entity.attackCooldown - dt);
  entity.dashCooldown = Math.max(0, entity.dashCooldown - dt);
  entity.invulnerable = Math.max(0, entity.invulnerable - dt);
  entity.attackFlash = Math.max(0, entity.attackFlash - dt);
  entity.stamina = clamp(entity.stamina + 24 * dt, 0, entity.maxStamina);
  entity.stepTimer += dt * (0.8 + Math.hypot(entity.moveX, entity.moveY));

  if (entity.hp <= 0 && entity.alive) {
    entity.alive = false;
    entity.hp = 0;
    for (let i = 0; i < 12; i += 1) {
      addSpark(round, entity.x, entity.y, entity.color, 12);
    }
  }
}

function updateRound(round, dt) {
  if (!round.running) {
    return;
  }

  round.elapsed += dt;
  round.entities.forEach((entity) => updateEntity(entity, round, dt));

  round.sparks = round.sparks.filter((spark) => {
    spark.life -= dt;
    spark.x += spark.vx * dt;
    spark.y += spark.vy * dt;
    spark.vx *= 0.96;
    spark.vy *= 0.96;
    return spark.life > 0;
  });

  const liveTeams = new Set(round.entities.filter((entity) => entity.alive).map((entity) => entity.team));
  if (liveTeams.size <= 1) {
    round.running = false;
    const survivingTeam = round.entities.find((entity) => entity.alive)?.team;
    const isPlayerWin = survivingTeam === PLAYER_TEAM;
    round.result = isPlayerWin ? "Victory" : "Defeat";
    round.resultDetail = isPlayerWin
      ? `Round won in ${round.elapsed.toFixed(1)}s with ${Math.ceil(round.entities[0].hp)} HP left.`
      : `Your fighter was dropped after ${round.elapsed.toFixed(1)}s.`;
    ui.hudResult.textContent = round.result;
    ui.matchSummary.textContent = round.resultDetail;
  }
}

function drawArena(round) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate((canvas.width - ARENA_WIDTH) * 0.5, HUD_HEIGHT);

  ctx.fillStyle = "#18141c";
  ctx.fillRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

  for (let row = 0; row < GRID_ROWS; row += 1) {
    for (let col = 0; col < GRID_COLS; col += 1) {
      const tile = round.tiles[indexFromCell(col, row)];
      const x = col * TILE_SIZE;
      const y = row * TILE_SIZE;

      ctx.fillStyle = "rgba(255,255,255,0.035)";
      ctx.fillRect(x, y, TILE_SIZE - 2, TILE_SIZE - 2);

      if (tile === "wall") {
        ctx.fillStyle = "#463d50";
        ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        ctx.fillStyle = "#5e5368";
        ctx.fillRect(x + 4, y + 4, TILE_SIZE - 16, 10);
      } else if (tile === "hazard") {
        const pulse = 0.5 + Math.sin(state.lastFrameTime * 0.005 + col + row) * 0.15;
        ctx.fillStyle = `rgba(232,107,58,${pulse})`;
        ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        ctx.strokeStyle = "rgba(255,220,160,0.5)";
        ctx.strokeRect(x + 7, y + 7, TILE_SIZE - 14, TILE_SIZE - 14);
      } else if (tile === "player" || tile === "bot" || tile === "rival") {
        const colors = {
          player: "rgba(111,210,198,0.18)",
          bot: "rgba(244,239,231,0.18)",
          rival: "rgba(213,185,111,0.18)"
        };
        ctx.fillStyle = colors[tile];
        ctx.fillRect(x + 8, y + 8, TILE_SIZE - 16, TILE_SIZE - 16);
      }
    }
  }

  ctx.restore();
}

function drawHealthBar(entity, x, y) {
  const width = 44;
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(x - width / 2, y, width, 6);

  ctx.fillStyle = entity.team === PLAYER_TEAM ? "#6fd2c6" : entity.kind === "rival" ? "#d5b96f" : "#f4efe7";
  ctx.fillRect(x - width / 2, y, width * (entity.hp / entity.maxHp), 6);

  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(x - width / 2, y + 8, width, 4);
  ctx.fillStyle = "#e86b3a";
  ctx.fillRect(x - width / 2, y + 8, width * (entity.stamina / entity.maxStamina), 4);
}

function drawStickman(entity) {
  const arenaOffsetX = (canvas.width - ARENA_WIDTH) * 0.5;
  const px = arenaOffsetX + entity.x;
  const py = HUD_HEIGHT + entity.y;
  const angle = Math.atan2(entity.facingY, entity.facingX);
  const step = Math.sin(entity.stepTimer * 8) * 5;

  ctx.save();
  ctx.translate(px, py);
  ctx.rotate(angle);
  ctx.lineCap = "round";
  ctx.lineWidth = 3;
  ctx.strokeStyle = entity.color;

  if (entity.attackFlash > 0) {
    ctx.strokeStyle = entity.weapon.color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, entity.weapon.reach * 0.42, -entity.weapon.arc * 0.5, entity.weapon.arc * 0.5);
    ctx.stroke();
    ctx.strokeStyle = entity.color;
    ctx.lineWidth = 3;
  }

  ctx.beginPath();
  ctx.arc(0, -16, 7, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -9);
  ctx.lineTo(0, 9);
  ctx.moveTo(0, -1);
  ctx.lineTo(10, 4);
  ctx.lineTo(entity.weapon.reach * 0.38, 0);
  ctx.moveTo(0, -1);
  ctx.lineTo(-8, 3);
  ctx.moveTo(0, 9);
  ctx.lineTo(9, 19 + step);
  ctx.moveTo(0, 9);
  ctx.lineTo(-9, 19 - step);
  ctx.stroke();

  ctx.strokeStyle = entity.weapon.color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(9, 4);
  ctx.lineTo(entity.weapon.reach * 0.52, 0);
  ctx.stroke();
  ctx.restore();

  drawHealthBar(entity, px, py - 34);
}

function drawSparks(round) {
  const arenaOffsetX = (canvas.width - ARENA_WIDTH) * 0.5;
  round.sparks.forEach((spark) => {
    const alpha = clamp(spark.life / spark.maxLife, 0, 1);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = spark.color;
    ctx.beginPath();
    ctx.arc(arenaOffsetX + spark.x, HUD_HEIGHT + spark.y, spark.size * alpha * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });
}

function drawHud(round) {
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  ctx.fillRect(0, 0, canvas.width, HUD_HEIGHT - 12);
  ctx.fillStyle = "#f4efe7";
  ctx.font = '600 18px "Trebuchet MS"';
  ctx.fillText(round.result, 20, 28);
  ctx.font = '14px "Trebuchet MS"';
  ctx.fillStyle = "#b9ad9e";
  ctx.fillText(round.resultDetail, 20, 48);

  const player = round.entities[0];
  ctx.fillStyle = "#6fd2c6";
  ctx.fillRect(canvas.width - 250, 16, 200 * (player.hp / player.maxHp), 10);
  ctx.fillStyle = "#e86b3a";
  ctx.fillRect(canvas.width - 250, 32, 200 * (player.stamina / player.maxStamina), 8);
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.strokeRect(canvas.width - 250, 16, 200, 10);
  ctx.strokeRect(canvas.width - 250, 32, 200, 8);
}

function renderBattlefield(round) {
  drawArena(round);
  round.entities.filter((entity) => entity.alive).forEach(drawStickman);
  drawSparks(round);
  drawHud(round);
}

function renderIdleStage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#241d29");
  gradient.addColorStop(1, "#120f15");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#f4efe7";
  ctx.font = '700 42px Georgia';
  ctx.fillText("Stickforge Arena", 42, 88);
  ctx.font = '18px "Trebuchet MS"';
  ctx.fillStyle = "#b9ad9e";
  ctx.fillText("Forge a weapon, draw the arena, and start a round.", 42, 126);

  ctx.strokeStyle = "rgba(232,107,58,0.34)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(70, 210);
  ctx.lineTo(310, 210);
  ctx.stroke();

  ctx.strokeStyle = "#d5b96f";
  ctx.beginPath();
  ctx.moveTo(312, 210);
  ctx.lineTo(390, 184);
  ctx.lineTo(370, 210);
  ctx.lineTo(390, 236);
  ctx.closePath();
  ctx.stroke();

  ctx.fillStyle = "#f4efe7";
  ctx.fillText("Weapons saved in the armory can be equipped for Player 1 or the rival.", 42, 310);
  ctx.fillText("Arena editor tiles feed directly into the match spawns and terrain.", 42, 344);
}

function loop(timestamp) {
  if (!state.lastFrameTime) {
    state.lastFrameTime = timestamp;
  }
  const dt = Math.min((timestamp - state.lastFrameTime) / 1000, 0.033);
  state.lastFrameTime = timestamp;

  if (state.round) {
    updateRound(state.round, dt);
    renderBattlefield(state.round);
  } else {
    renderIdleStage();
  }

  requestAnimationFrame(loop);
}

function handleForgeChange() {
  state.forge = {
    ...state.forge,
    name: ui.weaponName.value,
    frame: ui.frameSelect.value,
    material: ui.materialSelect.value,
    edge: ui.edgeSelect.value,
    length: Number(ui.lengthRange.value),
    balance: Number(ui.balanceRange.value),
    temper: Number(ui.temperRange.value)
  };
  renderForge();
}

function pointerPaintFromEvent(event) {
  const cell = event.target.closest(".arena-cell");
  if (!cell) {
    return;
  }
  paintArenaCell(Number(cell.dataset.col), Number(cell.dataset.row));
}

function bindArenaEditor() {
  ui.arenaEditor.addEventListener("pointerdown", (event) => {
    state.pointerPainting = true;
    pointerPaintFromEvent(event);
  });
  ui.arenaEditor.addEventListener("pointermove", (event) => {
    if (state.pointerPainting) {
      pointerPaintFromEvent(event);
    }
  });
  window.addEventListener("pointerup", () => {
    state.pointerPainting = false;
  });
}

function bindTouchControls() {
  Array.from(ui.touchControls.querySelectorAll("button")).forEach((button) => {
    const action = button.dataset.touch;
    const start = (event) => {
      event.preventDefault();
      state.touchState[action] = true;
    };
    const stop = (event) => {
      event.preventDefault();
      state.touchState[action] = false;
    };
    button.addEventListener("pointerdown", start);
    button.addEventListener("pointerup", stop);
    button.addEventListener("pointercancel", stop);
    button.addEventListener("pointerleave", stop);
  });
}

function bindEvents() {
  [ui.weaponName, ui.frameSelect, ui.materialSelect, ui.edgeSelect, ui.lengthRange, ui.balanceRange, ui.temperRange].forEach((input) => {
    input.addEventListener("input", handleForgeChange);
  });

  ui.saveWeapon.addEventListener("click", () => saveCurrentWeapon({ equip: false }));
  ui.equipWeapon.addEventListener("click", () => saveCurrentWeapon({ equip: true }));
  ui.clearArena.addEventListener("click", clearArena);
  ui.mirrorArena.addEventListener("click", mirrorArena);
  ui.presetButtons.forEach((button) => {
    button.addEventListener("click", () => loadArenaPreset(button.dataset.preset));
  });

  ui.botCount.addEventListener("input", () => {
    ui.botCountValue.textContent = ui.botCount.value;
  });

  ui.matchMode.addEventListener("change", () => {
    const isSkirmish = ui.matchMode.value === "skirmish";
    ui.botCountLabel.style.display = isSkirmish ? "" : "none";
  });

  ui.startMatch.addEventListener("click", startMatch);

  window.addEventListener("keydown", (event) => {
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) {
      event.preventDefault();
    }
    state.keysDown.add(event.code);
  });

  window.addEventListener("keyup", (event) => {
    state.keysDown.delete(event.code);
  });

  bindArenaEditor();
  bindTouchControls();
}

function seedArmory() {
  const starterWeapons = [
    state.forge,
    {
      name: "Warden Pike",
      frame: "spear",
      material: "ironwood",
      edge: "needle",
      length: 86,
      balance: 10,
      temper: 68
    },
    {
      name: "Cinder Maw",
      frame: "cleaver",
      material: "embersteel",
      edge: "breaker",
      length: 54,
      balance: 18,
      temper: 88
    }
  ];

  starterWeapons.forEach((recipe, index) => {
    const weapon = buildWeaponFromForge(recipe);
    state.armory.push(weapon);
    if (index === 0) {
      state.activeWeaponId = weapon.id;
    }
    if (index === 1) {
      state.rivalWeaponId = weapon.id;
    }
  });
}

function init() {
  populateSelect(ui.frameSelect, frameCatalog);
  populateSelect(ui.materialSelect, materialCatalog);
  populateSelect(ui.edgeSelect, edgeCatalog);

  ui.frameSelect.value = state.forge.frame;
  ui.materialSelect.value = state.forge.material;
  ui.edgeSelect.value = state.forge.edge;

  createToolPalette();
  renderToolPalette();
  ensureArenaSpawns();
  renderArenaEditor();
  seedArmory();
  loadWeaponIntoForge(state.armory[0]);
  renderArmory();
  updateHudLabels();
  bindEvents();

  ui.botCountValue.textContent = ui.botCount.value;
  ui.matchMode.dispatchEvent(new Event("change"));
  if (window.location.hash === "#autostart") {
    startMatch();
  }
  requestAnimationFrame(loop);
}

init();
