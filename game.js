"use strict";

const PLAYER_TEAM = "player";
const ENEMY_TEAM = "enemy";
const HUD_HEIGHT = 64;
const STAGE_WIDTH = 860;
const STAGE_HEIGHT = 420;
const STAGE_TOP = 28;
const GROUND_Y = 320;
const FLOOR_THICKNESS = 66;
const ROUND_TIME = 60;

const frameCatalog = {
  saber: {
    label: "Saber",
    damage: 18,
    reach: 78,
    cooldown: 0.62,
    knockback: 1.08,
    arc: 1.18,
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
    arc: 1.04,
    speed: 0.86,
    moveScale: 0.92
  },
  chainblade: {
    label: "Chainblade",
    damage: 15,
    reach: 88,
    cooldown: 0.52,
    knockback: 0.94,
    arc: 1.42,
    speed: 1.16,
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
    color: "#90a2ff"
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

const stageCatalog = {
  foundry: {
    label: "Foundry",
    description: "A molten forge lane with chain lifts, ash smoke, and a furnace pit in the middle.",
    skyTop: "#31161b",
    skyBottom: "#120c12",
    floor: "#3b2c31",
    floorEdge: "#9f6a44",
    accent: "#ff8752",
    crowd: "#ffb36b",
    hazard: "#ff6a38"
  },
  ring: {
    label: "Ring",
    description: "A championship platform with banners, cold spotlights, and heavy steel corners.",
    skyTop: "#192036",
    skyBottom: "#0c0f1b",
    floor: "#263146",
    floorEdge: "#78a3dd",
    accent: "#cfd8ff",
    crowd: "#7db7ff",
    hazard: "#7dd0ff"
  },
  crossfire: {
    label: "Crossfire",
    description: "A brutal test gallery lined with burners, rigging, and weapon trial rails.",
    skyTop: "#2a1f16",
    skyBottom: "#100c08",
    floor: "#463426",
    floorEdge: "#d6a16a",
    accent: "#ffd37d",
    crowd: "#ffc16b",
    hazard: "#ff8f5c"
  }
};

const keyBindings = {
  p1: {
    left: "KeyA",
    right: "KeyD",
    jump: "KeyW",
    crouch: "KeyS",
    dodge: "KeyQ",
    slide: "KeyE"
  },
  p2: {
    left: "KeyJ",
    right: "KeyL",
    jump: "KeyI",
    crouch: "KeyK",
    attack: "KeyO",
    block: "KeyU",
    dodge: "KeyP",
    slide: "Semicolon"
  }
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
  stageSummary: document.querySelector("#stage-summary"),
  presetButtons: Array.from(document.querySelectorAll(".preset-button")),
  toggleHazard: document.querySelector("#toggle-hazard"),
  togglePillars: document.querySelector("#toggle-pillars"),
  toggleLights: document.querySelector("#toggle-lights"),
  matchMode: document.querySelector("#match-mode"),
  roundsToWin: document.querySelector("#rounds-to-win"),
  roundsToWinValue: document.querySelector("#rounds-to-win-value"),
  startMatch: document.querySelector("#start-match"),
  battlefield: document.querySelector("#battlefield"),
  hudPlayerWeapon: document.querySelector("#hud-player-weapon"),
  hudRivalWeapon: document.querySelector("#hud-rival-weapon"),
  hudArenaName: document.querySelector("#hud-arena-name"),
  hudSetScore: document.querySelector("#hud-set-score"),
  hudResult: document.querySelector("#hud-result"),
  matchSummary: document.querySelector("#match-summary"),
  touchControls: document.querySelector("#touch-controls")
};

const canvas = ui.battlefield;
const ctx = canvas.getContext("2d");
const previewCtx = ui.forgePreview.getContext("2d");

const state = {
  forge: {
    id: "weapon-player",
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
  stage: {
    id: "foundry",
    hazard: true,
    pillars: true,
    lights: true
  },
  match: null,
  keysDown: new Set(),
  mouse: {
    left: false,
    right: false,
    x: canvas.width * 0.5,
    y: canvas.height * 0.5
  },
  touchState: {
    left: false,
    right: false,
    up: false,
    down: false,
    attack: false,
    block: false,
    dodge: false,
    slide: false
  },
  previousInputs: {
    p1: {},
    p2: {}
  },
  sparkId: 0,
  lastFrameTime: performance.now()
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function approach(current, target, delta) {
  if (current < target) {
    return Math.min(target, current + delta);
  }
  return Math.max(target, current - delta);
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function randomChoice(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function makeId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function stageOffsetX() {
  return Math.round((canvas.width - STAGE_WIDTH) / 2);
}

function currentStageConfig(stageId = state.stage.id) {
  return stageCatalog[stageId] || stageCatalog.foundry;
}

function activeStageState() {
  return state.match ? state.match.stage : state.stage;
}

function populateSelect(select, catalog) {
  select.innerHTML = "";
  Object.entries(catalog).forEach(([id, item]) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = item.label;
    select.append(option);
  });
}

function setMatchSummary(text) {
  ui.matchSummary.textContent = text;
}

function setStatus(text) {
  ui.hudResult.textContent = text;
}

function buildWeaponFromForge(forge) {
  const frame = frameCatalog[forge.frame];
  const material = materialCatalog[forge.material];
  const edge = edgeCatalog[forge.edge];
  const lengthBias = (forge.length - 60) / 8;
  const balanceBias = forge.balance / 12;
  const temperBias = (forge.temper - 60) / 14;

  const damage = clamp(
    Math.round(frame.damage + material.damage + edge.damage + temperBias * 1.4 + Math.abs(balanceBias) * 0.5),
    10,
    34
  );
  const reach = clamp(
    Math.round(frame.reach + material.reach + edge.reach + lengthBias * 4),
    54,
    132
  );
  const speed = clamp(
    Number((frame.speed + material.speed + edge.speed - Math.abs(balanceBias) * 0.015).toFixed(2)),
    0.7,
    1.35
  );
  const cooldown = clamp(
    Number((frame.cooldown + material.cooldown + edge.cooldown - temperBias * 0.01).toFixed(2)),
    0.34,
    1.1
  );
  const knockback = clamp(
    Number((frame.knockback + material.knockback + edge.knockback + temperBias * 0.025).toFixed(2)),
    0.8,
    1.65
  );
  const arc = clamp(
    Number((frame.arc + edge.arc + (20 - Math.abs(forge.balance)) * 0.008).toFixed(2)),
    0.74,
    1.72
  );
  const moveScale = clamp(
    Number((frame.moveScale + material.moveScale - Math.max(0, damage - 20) * 0.012).toFixed(2)),
    0.74,
    1.12
  );

  let styleText = "balanced duel control";
  if (damage >= 25) {
    styleText = "heavy crack-open pressure";
  } else if (speed >= 1.12) {
    styleText = "quick strike pressure";
  } else if (reach >= 102) {
    styleText = "long-range lane control";
  }

  return {
    id: forge.id || makeId("weapon"),
    name: forge.name.trim() || "Nameless Steel",
    frameId: forge.frame,
    frame: frame.label,
    materialId: forge.material,
    material: material.label,
    edgeId: forge.edge,
    edge: edge.label,
    length: Number(forge.length),
    balance: Number(forge.balance),
    temper: Number(forge.temper),
    damage,
    reach,
    speed,
    cooldown,
    knockback,
    arc,
    moveScale,
    color: material.color,
    lore: `${frame.label}, ${material.label.toLowerCase()}, and ${edge.label.toLowerCase()} tuned for ${styleText}.`
  };
}

function createRandomEnemyWeapon() {
  const prefixes = ["Iron", "Dread", "Night", "Ash", "War", "Storm", "Cinder", "Ruin"];
  const suffixes = ["fang", "bite", "lance", "edge", "hook", "brand", "talon", "reaver"];
  const forge = {
    id: makeId("rival"),
    name: `${randomChoice(prefixes)}${randomChoice(suffixes)}`,
    frame: randomChoice(Object.keys(frameCatalog)),
    material: randomChoice(Object.keys(materialCatalog)),
    edge: randomChoice(Object.keys(edgeCatalog)),
    length: Math.round(randomRange(38, 90)),
    balance: Math.round(randomRange(-24, 24)),
    temper: Math.round(randomRange(30, 98))
  };

  return buildWeaponFromForge(forge);
}

function currentBlueprint() {
  if (!state.forge.id) {
    state.forge.id = makeId("weapon");
  }
  return buildWeaponFromForge(state.forge);
}

function syncForgeOutputs() {
  ui.lengthValue.textContent = `${ui.lengthRange.value}`;
  ui.balanceValue.textContent = `${ui.balanceRange.value}`;
  ui.temperValue.textContent = `${ui.temperRange.value}`;
}

function renderForgeStats(weapon) {
  const stats = [
    { label: "Damage", value: weapon.damage, max: 34 },
    { label: "Reach", value: weapon.reach, max: 132 },
    { label: "Tempo", value: Math.round(weapon.speed * 100), max: 135 },
    { label: "Recovery", value: Math.round((1.16 - weapon.cooldown) * 100), max: 82 },
    { label: "Drive", value: Math.round(weapon.knockback * 100), max: 165 },
    { label: "Arc", value: Math.round(weapon.arc * 100), max: 172 }
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

  const gradient = previewCtx.createLinearGradient(0, 0, 0, ui.forgePreview.height);
  gradient.addColorStop(0, "rgba(255,255,255,0.08)");
  gradient.addColorStop(1, "rgba(0,0,0,0.12)");
  previewCtx.fillStyle = gradient;
  previewCtx.fillRect(0, 0, ui.forgePreview.width, ui.forgePreview.height);

  previewCtx.save();
  previewCtx.translate(52, ui.forgePreview.height * 0.62);
  previewCtx.lineCap = "round";
  previewCtx.strokeStyle = "rgba(255,255,255,0.12)";
  previewCtx.lineWidth = 2;

  for (let i = 0; i < 7; i += 1) {
    previewCtx.beginPath();
    previewCtx.moveTo(i * 44, -50);
    previewCtx.lineTo(i * 44 + 8, 46);
    previewCtx.stroke();
  }

  const shaft = clamp(weapon.reach * 0.8, 48, 128);
  const bladeSize = clamp(weapon.damage * 1.4, 18, 46);

  previewCtx.strokeStyle = "#e9dfd2";
  previewCtx.lineWidth = 8;
  previewCtx.beginPath();
  previewCtx.moveTo(-14, 0);
  previewCtx.lineTo(shaft, 0);
  previewCtx.stroke();

  previewCtx.strokeStyle = weapon.color;
  previewCtx.fillStyle = weapon.color;
  previewCtx.lineWidth = 10;
  previewCtx.beginPath();
  previewCtx.moveTo(0, 0);
  previewCtx.lineTo(shaft, 0);
  previewCtx.stroke();

  previewCtx.fillStyle = "#f3ead8";
  previewCtx.fillRect(-22, -4, 16, 8);

  previewCtx.fillStyle = weapon.color;
  previewCtx.beginPath();
  if (weapon.frameId === "spear") {
    previewCtx.moveTo(shaft, 0);
    previewCtx.lineTo(shaft + bladeSize, -10);
    previewCtx.lineTo(shaft + bladeSize * 0.62, 0);
    previewCtx.lineTo(shaft + bladeSize, 10);
  } else if (weapon.frameId === "cleaver") {
    previewCtx.moveTo(shaft - 4, -bladeSize * 0.55);
    previewCtx.lineTo(shaft + bladeSize * 0.5, -bladeSize * 0.34);
    previewCtx.lineTo(shaft + bladeSize * 0.42, bladeSize * 0.38);
    previewCtx.lineTo(shaft - 10, bladeSize * 0.48);
  } else if (weapon.frameId === "chainblade") {
    previewCtx.arc(shaft + bladeSize * 0.18, 0, bladeSize * 0.42, 0, Math.PI * 2);
  } else {
    previewCtx.moveTo(shaft, -bladeSize * 0.48);
    previewCtx.lineTo(shaft + bladeSize * 0.82, 0);
    previewCtx.lineTo(shaft, bladeSize * 0.48);
  }
  previewCtx.closePath();
  previewCtx.fill();

  previewCtx.globalAlpha = 0.2;
  previewCtx.fillStyle = weapon.color;
  previewCtx.beginPath();
  previewCtx.arc(shaft * 0.82, 0, bladeSize * 1.1, 0, Math.PI * 2);
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

function weaponById(id) {
  return state.armory.find((weapon) => weapon.id === id) || null;
}

function updateHudLabels() {
  const activeWeapon = state.match?.playerWeapon || weaponById(state.activeWeaponId) || currentBlueprint();
  const rivalWeapon = state.match?.rivalWeapon || weaponById(state.rivalWeaponId);
  const stageState = activeStageState();

  ui.hudPlayerWeapon.textContent = activeWeapon?.name || "Unarmed";
  ui.hudRivalWeapon.textContent = rivalWeapon?.name || "Auto Forge";
  ui.hudArenaName.textContent = currentStageConfig(stageState.id).label;
  ui.hudSetScore.textContent = state.match ? `${state.match.score.player} - ${state.match.score.enemy}` : "0 - 0";
}

function saveCurrentWeapon({ equip = true } = {}) {
  const blueprint = currentBlueprint();
  const existingIndex = state.armory.findIndex((weapon) => weapon.id === blueprint.id);

  if (existingIndex >= 0) {
    state.armory.splice(existingIndex, 1, blueprint);
  } else {
    state.armory.unshift(blueprint);
  }

  if (!state.rivalWeaponId || state.rivalWeaponId === blueprint.id) {
    const alternate = state.armory.find((weapon) => weapon.id !== blueprint.id);
    state.rivalWeaponId = alternate?.id || blueprint.id;
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
    state.rivalWeaponId = state.armory.find((weapon) => weapon.id !== state.activeWeaponId)?.id || state.armory[0]?.id || null;
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

    const equipButton = document.createElement("button");
    equipButton.className = "ghost-button";
    equipButton.textContent = "Equip";
    equipButton.addEventListener("click", () => {
      state.activeWeaponId = weapon.id;
      renderArmory();
      updateHudLabels();
      renderBattlefield();
    });

    const rivalButton = document.createElement("button");
    rivalButton.className = "ghost-button";
    rivalButton.textContent = "Set Rival";
    rivalButton.addEventListener("click", () => {
      state.rivalWeaponId = weapon.id;
      renderArmory();
      updateHudLabels();
      renderBattlefield();
    });

    const editButton = document.createElement("button");
    editButton.className = "ghost-button";
    editButton.textContent = "Reforge";
    editButton.addEventListener("click", () => loadWeaponIntoForge(weapon));

    const removeButton = document.createElement("button");
    removeButton.className = "ghost-button";
    removeButton.textContent = "Delete";
    removeButton.addEventListener("click", () => deleteWeapon(weapon.id));

    actions.append(equipButton, rivalButton, editButton, removeButton);
    card.append(header, meta, actions);
    ui.armoryList.append(card);
  });
}

function renderStageSummary() {
  const config = currentStageConfig();
  const stageState = state.stage;
  const toggles = [
    stageState.hazard ? "Center hazard on" : "Center hazard off",
    stageState.pillars ? "Corner pillars on" : "Corner pillars off",
    stageState.lights ? "Crowd lights on" : "Crowd lights off"
  ];

  ui.stageSummary.innerHTML = `
    <article class="stage-card">
      <h3>${config.label}</h3>
      <p>${config.description}</p>
      <div class="armory-meta">
        ${toggles.map((label) => `<span class="pill">${label}</span>`).join("")}
      </div>
    </article>
  `;

  ui.toggleHazard.textContent = `Center Hazard: ${stageState.hazard ? "On" : "Off"}`;
  ui.togglePillars.textContent = `Corner Pillars: ${stageState.pillars ? "On" : "Off"}`;
  ui.toggleLights.textContent = `Crowd Lights: ${stageState.lights ? "On" : "Off"}`;

  ui.presetButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.preset === stageState.id);
  });
}

function fighterProfileForWeapon(weapon) {
  return {
    damage: clamp(Math.round(weapon.damage * 0.95 + weapon.arc * 2.2), 11, 34),
    reach: clamp(Math.round(weapon.reach * 0.78), 44, 118),
    windup: clamp(0.11 + weapon.cooldown * 0.11 - weapon.speed * 0.025, 0.08, 0.22),
    active: clamp(0.07 + weapon.arc * 0.03, 0.08, 0.16),
    recover: clamp(0.15 + weapon.cooldown * 0.2, 0.14, 0.36),
    knockback: clamp(180 + weapon.knockback * 70, 190, 320),
    blockDrain: clamp(Math.round(10 + weapon.damage * 0.45), 10, 22),
    lunge: clamp(48 + weapon.reach * 0.18, 52, 84)
  };
}

function stageBounds(stageState) {
  const inset = stageState.pillars ? 108 : 72;
  return {
    left: inset,
    right: STAGE_WIDTH - inset
  };
}

function spawnFighter({ team, control, weapon, x, name, color }) {
  return {
    team,
    control,
    name,
    color,
    weapon,
    profile: fighterProfileForWeapon(weapon),
    x,
    y: GROUND_Y,
    vx: 0,
    vy: 0,
    moveIntent: 0,
    facing: team === PLAYER_TEAM ? 1 : -1,
    width: 34,
    standHeight: 126,
    crouchHeight: 86,
    slideHeight: 54,
    gravity: 1680,
    walkSpeed: clamp(150 + weapon.speed * 36 + weapon.moveScale * 28, 136, 220),
    onGround: true,
    health: 100,
    maxHealth: 100,
    stamina: 100,
    maxStamina: 100,
    blocking: false,
    crouching: false,
    hitstun: 0,
    invulnerable: 0,
    attack: null,
    attackFlash: 0,
    dodgeCooldown: 0,
    slideCooldown: 0,
    jumpCooldown: 0,
    manualSwingCooldown: 0,
    dodgeTimer: 0,
    slideTimer: 0,
    slideDir: 0,
    stepTimer: 0,
    mouseWeaponAngle: -0.18,
    previousMouseWeaponAngle: -0.18,
    weaponTip: null,
    aiDecisionTimer: 0,
    aiIntent: {
      left: false,
      right: false,
      block: false,
      crouch: false
    },
    alive: true
  };
}

function createRoundFighters(match) {
  return [
    spawnFighter({
      team: PLAYER_TEAM,
      control: "p1",
      weapon: match.playerWeapon,
      x: 220,
      name: "Player 1",
      color: "#89e6dc"
    }),
    spawnFighter({
      team: ENEMY_TEAM,
      control: match.mode === "duel" ? "p2" : "bot",
      weapon: match.rivalWeapon,
      x: STAGE_WIDTH - 220,
      name: match.mode === "duel" ? "Player 2" : "Bot",
      color: match.mode === "duel" ? "#f0d48b" : "#f4efe7"
    })
  ];
}

function readRawInput(slot) {
  if (slot === "p1") {
    return {
      left: state.keysDown.has(keyBindings.p1.left) || state.touchState.left,
      right: state.keysDown.has(keyBindings.p1.right) || state.touchState.right,
      jump: state.keysDown.has(keyBindings.p1.jump) || state.touchState.up,
      crouch: state.keysDown.has(keyBindings.p1.crouch) || state.touchState.down,
      attack: state.mouse.left || state.touchState.attack,
      block: state.mouse.right || state.touchState.block,
      dodge: state.keysDown.has(keyBindings.p1.dodge) || state.touchState.dodge,
      slide: state.keysDown.has(keyBindings.p1.slide) || state.touchState.slide
    };
  }

  return {
    left: state.keysDown.has(keyBindings.p2.left),
    right: state.keysDown.has(keyBindings.p2.right),
    jump: state.keysDown.has(keyBindings.p2.jump),
    crouch: state.keysDown.has(keyBindings.p2.crouch),
    attack: state.keysDown.has(keyBindings.p2.attack),
    block: state.keysDown.has(keyBindings.p2.block),
    dodge: state.keysDown.has(keyBindings.p2.dodge),
    slide: state.keysDown.has(keyBindings.p2.slide)
  };
}

function inputSnapshot(slot) {
  const raw = readRawInput(slot);
  const previous = state.previousInputs[slot] || {};
  const snapshot = {
    ...raw,
    jumpPressed: raw.jump && !previous.jump,
    attackPressed: raw.attack && !previous.attack,
    dodgePressed: raw.dodge && !previous.dodge,
    slidePressed: raw.slide && !previous.slide
  };
  state.previousInputs[slot] = raw;
  return snapshot;
}

function primeInputMemory() {
  state.previousInputs.p1 = readRawInput("p1");
  state.previousInputs.p2 = readRawInput("p2");
}

function autoFace(fighter, opponent) {
  if (!fighter.alive || !opponent.alive) {
    return;
  }
  fighter.facing = fighter.x <= opponent.x ? 1 : -1;
}

function currentFighterHeight(fighter) {
  if (fighter.slideTimer > 0) {
    return fighter.slideHeight;
  }
  if (fighter.crouching && fighter.onGround) {
    return fighter.crouchHeight;
  }
  return fighter.standHeight;
}

function onFrontSide(defender, attacker) {
  return (attacker.x - defender.x) * defender.facing > 0;
}

function fighterHitbox(fighter) {
  const height = currentFighterHeight(fighter);
  return {
    left: fighter.x - fighter.width / 2,
    right: fighter.x + fighter.width / 2,
    top: fighter.y - height,
    bottom: fighter.y
  };
}

function expandHitbox(box, padding) {
  return {
    left: box.left - padding,
    right: box.right + padding,
    top: box.top - padding,
    bottom: box.bottom + padding
  };
}

function pointInsideHitbox(x, y, box) {
  return x >= box.left && x <= box.right && y >= box.top && y <= box.bottom;
}

function segmentsIntersect(ax, ay, bx, by, cx, cy, dx, dy) {
  const denominator = (bx - ax) * (dy - cy) - (by - ay) * (dx - cx);
  if (Math.abs(denominator) < 0.0001) {
    return false;
  }

  const ua = ((cx - ax) * (dy - cy) - (cy - ay) * (dx - cx)) / denominator;
  const ub = ((cx - ax) * (by - ay) - (cy - ay) * (bx - ax)) / denominator;
  return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
}

function lineIntersectsHitbox(x1, y1, x2, y2, box) {
  if (pointInsideHitbox(x1, y1, box) || pointInsideHitbox(x2, y2, box)) {
    return true;
  }

  return (
    segmentsIntersect(x1, y1, x2, y2, box.left, box.top, box.right, box.top) ||
    segmentsIntersect(x1, y1, x2, y2, box.right, box.top, box.right, box.bottom) ||
    segmentsIntersect(x1, y1, x2, y2, box.right, box.bottom, box.left, box.bottom) ||
    segmentsIntersect(x1, y1, x2, y2, box.left, box.bottom, box.left, box.top)
  );
}

function weaponPoseForFighter(fighter) {
  const height = currentFighterHeight(fighter);
  const torsoTop = -height * 0.6;
  const shoulderX = fighter.facing * 11;
  const shoulderY = torsoTop * 0.46;
  let weaponAngle = -0.18;
  let weaponLength = fighter.profile.reach * 0.78;

  if (fighter.blocking) {
    weaponAngle = -0.92;
  } else if (fighter.attack) {
    const swingWindow = clamp(
      (fighter.attack.timer - fighter.profile.windup) / Math.max(fighter.profile.active, 0.01),
      0,
      1
    );
    weaponAngle = lerp(-1.12, 0.48, swingWindow);
    weaponLength += 10 * swingWindow;
  } else if (fighter.slideTimer > 0) {
    weaponAngle = 0.02;
  } else if (fighter.control === "p1") {
    weaponAngle = fighter.mouseWeaponAngle;
  }

  return {
    baseX: fighter.x + shoulderX,
    baseY: fighter.y + shoulderY,
    tipX: fighter.x + shoulderX + fighter.facing * Math.cos(weaponAngle) * weaponLength,
    tipY: fighter.y + shoulderY + Math.sin(weaponAngle) * weaponLength * 0.56,
    angle: weaponAngle,
    length: weaponLength
  };
}

function updateMouseWeaponControl(fighter, dt) {
  if (fighter.control !== "p1") {
    return;
  }

  const height = currentFighterHeight(fighter);
  const torsoTop = -height * 0.6;
  const shoulderX = fighter.x + fighter.facing * 11;
  const shoulderY = fighter.y + torsoTop * 0.46;
  const stageMouseX = clamp(state.mouse.x - stageOffsetX(), 0, STAGE_WIDTH);
  const stageMouseY = clamp(state.mouse.y - STAGE_TOP, 0, STAGE_HEIGHT);
  const localX = (stageMouseX - shoulderX) * fighter.facing;
  const localY = stageMouseY - shoulderY;
  const targetAngle = clamp(Math.atan2(localY, Math.max(-42, Math.min(160, localX))), -1.22, 0.92);

  fighter.previousMouseWeaponAngle = fighter.mouseWeaponAngle;
  fighter.mouseWeaponAngle = lerp(fighter.mouseWeaponAngle, targetAngle, clamp(dt * 16, 0, 1));
}

function addSpark(match, x, y, color, amount = 8) {
  for (let i = 0; i < amount; i += 1) {
    match.sparks.push({
      id: state.sparkId,
      x,
      y,
      vx: randomRange(-140, 140),
      vy: randomRange(-180, -24),
      life: randomRange(0.18, 0.36),
      color,
      size: randomRange(1.5, 4.5)
    });
    state.sparkId += 1;
  }
}

function performJump(fighter, match) {
  if (!fighter.alive || !fighter.onGround || fighter.jumpCooldown > 0 || fighter.hitstun > 0) {
    return false;
  }

  fighter.vy = -620;
  fighter.onGround = false;
  fighter.jumpCooldown = 0.22;
  fighter.blocking = false;
  fighter.crouching = false;
  addSpark(match, fighter.x, fighter.y - 4, "rgba(255,255,255,0.7)", 6);
  return true;
}

function performBackstep(fighter, match) {
  if (!fighter.alive || !fighter.onGround || fighter.hitstun > 0 || fighter.dodgeCooldown > 0 || fighter.attack) {
    return false;
  }

  fighter.blocking = false;
  fighter.crouching = false;
  fighter.dodgeTimer = 0.22;
  fighter.dodgeCooldown = 0.82;
  fighter.invulnerable = 0.14;
  fighter.vx = -fighter.facing * 360;
  addSpark(match, fighter.x, fighter.y - 8, fighter.weapon.color, 8);
  return true;
}

function performLunge(fighter, match) {
  if (!fighter.alive || !fighter.onGround || fighter.hitstun > 0 || fighter.slideCooldown > 0 || fighter.attack) {
    return false;
  }

  fighter.blocking = false;
  fighter.crouching = false;
  fighter.slideTimer = 0.2;
  fighter.slideCooldown = 0.96;
  fighter.slideDir = fighter.facing;
  fighter.vx = fighter.facing * 420;
  addSpark(match, fighter.x, fighter.y - 10, fighter.weapon.color, 10);
  return true;
}

function startAttack(fighter) {
  if (
    !fighter.alive ||
    fighter.hitstun > 0 ||
    fighter.attack ||
    fighter.blocking ||
    fighter.dodgeTimer > 0 ||
    fighter.slideTimer > 0 ||
    fighter.stamina < 8
  ) {
    return false;
  }

  fighter.attack = {
    timer: 0,
    connected: false
  };
  fighter.attackFlash = 0.18;
  fighter.stamina = clamp(fighter.stamina - 8, 0, fighter.maxStamina);
  fighter.vx += fighter.facing * fighter.profile.lunge * 0.45;
  return true;
}

function attemptAttackHit(attacker, defender, match) {
  if (!attacker.attack || attacker.attack.connected || !defender.alive || defender.invulnerable > 0) {
    return;
  }

  const attackHeight = currentFighterHeight(attacker);
  const attackBottom = attacker.y - (attacker.crouching ? 8 : 18);
  const attackTop = attacker.y - attackHeight + 18;
  const attackRange = attacker.profile.reach + (attacker.slideTimer > 0 ? 12 : 0);
  const attackBox = {
    left: attacker.facing === 1 ? attacker.x + attacker.width * 0.12 : attacker.x - attackRange - attacker.width * 0.12,
    right: attacker.facing === 1 ? attacker.x + attackRange + attacker.width * 0.12 : attacker.x - attacker.width * 0.12,
    top: attackTop,
    bottom: attackBottom
  };
  const defenderBox = fighterHitbox(defender);

  const overlaps =
    attackBox.left < defenderBox.right &&
    attackBox.right > defenderBox.left &&
    attackBox.top < defenderBox.bottom &&
    attackBox.bottom > defenderBox.top;

  if (!overlaps) {
    return;
  }

  attacker.attack.connected = true;

  if (defender.blocking && defender.onGround && onFrontSide(defender, attacker)) {
    defender.stamina = clamp(defender.stamina - attacker.profile.blockDrain, 0, defender.maxStamina);
    defender.vx += attacker.facing * attacker.profile.knockback * 0.18;
    defender.hitstun = Math.max(defender.hitstun, 0.08);
    addSpark(match, (attacker.x + defender.x) / 2, attacker.y - attackHeight * 0.6, "#ffffff", 8);

    if (defender.stamina <= 0) {
      const guardBreakDamage = Math.round(attacker.profile.damage * 0.32);
      defender.blocking = false;
      defender.hitstun = 0.28;
      defender.health = clamp(defender.health - guardBreakDamage, 0, defender.maxHealth);
      defender.vx = attacker.facing * attacker.profile.knockback * 0.54;
      match.shake = Math.max(match.shake, 6);
      setMatchSummary(`${attacker.name} broke ${defender.name}'s guard.`);
    } else {
      setMatchSummary(`${defender.name} blocked the strike.`);
    }
    return;
  }

  const damage = clamp(
    Math.round(attacker.profile.damage * (attacker.slideTimer > 0 ? 1.08 : 1)),
    8,
    38
  );

  defender.health = clamp(defender.health - damage, 0, defender.maxHealth);
  defender.hitstun = 0.18 + damage * 0.006;
  defender.vx = attacker.facing * attacker.profile.knockback;
  defender.vy = Math.min(defender.vy, -80);
  defender.blocking = false;
  defender.crouching = false;
  defender.attackFlash = 0.16;
  defender.alive = defender.health > 0;

  addSpark(match, (attacker.x + defender.x) / 2, defender.y - currentFighterHeight(defender) * 0.62, attacker.weapon.color, 12);
  match.shake = Math.max(match.shake, 8);
  setMatchSummary(`${attacker.name} landed ${damage} damage with ${attacker.weapon.name}.`);
}

function attemptMouseSwingHit(attacker, defender, match, dt) {
  if (
    attacker.control !== "p1" ||
    !attacker.alive ||
    !defender.alive ||
    attacker.hitstun > 0 ||
    attacker.attack ||
    attacker.blocking ||
    attacker.slideTimer > 0 ||
    attacker.dodgeTimer > 0 ||
    attacker.manualSwingCooldown > 0 ||
    attacker.stamina < 3
  ) {
    const currentPose = weaponPoseForFighter(attacker);
    attacker.weaponTip = { x: currentPose.tipX, y: currentPose.tipY };
    return;
  }

  const currentPose = weaponPoseForFighter(attacker);
  const previousTip = attacker.weaponTip || { x: currentPose.tipX, y: currentPose.tipY };
  attacker.weaponTip = { x: currentPose.tipX, y: currentPose.tipY };

  const tipTravel = Math.hypot(currentPose.tipX - previousTip.x, currentPose.tipY - previousTip.y);
  const swingSpeed = tipTravel / Math.max(dt, 0.001);

  if (tipTravel < 10 || swingSpeed < 280) {
    return;
  }

  const defenderBox = expandHitbox(fighterHitbox(defender), 10);
  if (!lineIntersectsHitbox(previousTip.x, previousTip.y, currentPose.tipX, currentPose.tipY, defenderBox)) {
    return;
  }

  attacker.manualSwingCooldown = 0.16;
  attacker.stamina = clamp(attacker.stamina - 3, 0, attacker.maxStamina);

  if (defender.blocking && defender.onGround && onFrontSide(defender, attacker)) {
    defender.stamina = clamp(defender.stamina - 5, 0, defender.maxStamina);
    defender.vx += attacker.facing * 42;
    defender.hitstun = Math.max(defender.hitstun, 0.05);
    addSpark(match, (currentPose.tipX + defender.x) / 2, currentPose.tipY, "#ffffff", 6);
    setMatchSummary(`${defender.name} checked the mouse swing.`);
    return;
  }

  const damage = clamp(Math.round(1 + swingSpeed / 180), 2, 6);
  defender.health = clamp(defender.health - damage, 0, defender.maxHealth);
  defender.hitstun = Math.max(defender.hitstun, 0.08 + damage * 0.01);
  defender.vx += attacker.facing * (44 + damage * 12);
  defender.attackFlash = 0.12;
  defender.alive = defender.health > 0;

  addSpark(match, currentPose.tipX, currentPose.tipY, attacker.weapon.color, 9);
  match.shake = Math.max(match.shake, 4);
  setMatchSummary(`${attacker.name} clipped ${defender.name} with a weapon swing for ${damage}.`);
}

function updateAttackState(fighter, opponent, match, dt) {
  if (!fighter.attack) {
    return;
  }

  fighter.attack.timer += dt;
  const windupEnd = fighter.profile.windup;
  const activeEnd = windupEnd + fighter.profile.active;
  const recoverEnd = activeEnd + fighter.profile.recover;

  if (fighter.attack.timer >= windupEnd && fighter.attack.timer <= activeEnd) {
    attemptAttackHit(fighter, opponent, match);
  }

  if (fighter.attack.timer >= recoverEnd) {
    fighter.attack = null;
  }
}

function applyHumanControl(fighter, input, match) {
  fighter.moveIntent = 0;

  if (!fighter.alive) {
    fighter.blocking = false;
    fighter.crouching = false;
    return;
  }

  if (fighter.hitstun > 0) {
    fighter.blocking = false;
    fighter.crouching = false;
    return;
  }

  if (input.left) {
    fighter.moveIntent -= 1;
  }
  if (input.right) {
    fighter.moveIntent += 1;
  }

  if (input.jumpPressed) {
    performJump(fighter, match);
  }
  if (input.dodgePressed) {
    performBackstep(fighter, match);
  }
  if (input.slidePressed) {
    performLunge(fighter, match);
  }
  if (input.attackPressed) {
    startAttack(fighter);
  }

  fighter.blocking =
    input.block &&
    fighter.onGround &&
    !fighter.attack &&
    fighter.dodgeTimer <= 0 &&
    fighter.slideTimer <= 0;

  fighter.crouching =
    input.crouch &&
    fighter.onGround &&
    !fighter.blocking &&
    fighter.dodgeTimer <= 0 &&
    fighter.slideTimer <= 0;
}

function applyAiControl(fighter, opponent, match, dt) {
  fighter.moveIntent = 0;
  fighter.aiDecisionTimer -= dt;

  const gap = opponent.x - fighter.x;
  const absGap = Math.abs(gap);

  if (fighter.aiDecisionTimer <= 0) {
    fighter.aiDecisionTimer = randomRange(0.08, 0.22);
    fighter.aiIntent.left = false;
    fighter.aiIntent.right = false;
    fighter.aiIntent.block = false;
    fighter.aiIntent.crouch = false;

    if (opponent.attack && absGap < opponent.profile.reach + 42 && Math.random() < 0.72) {
      if (Math.random() < 0.68) {
        fighter.aiIntent.block = true;
      } else {
        performBackstep(fighter, match);
      }
    } else if (absGap > fighter.profile.reach + 42) {
      fighter.aiIntent.right = gap > 0;
      fighter.aiIntent.left = gap < 0;
    } else if (absGap < fighter.profile.reach * 0.7 && Math.random() < 0.26) {
      performBackstep(fighter, match);
    } else if (Math.random() < 0.55) {
      startAttack(fighter);
    } else if (Math.random() < 0.22) {
      performLunge(fighter, match);
    } else if (Math.random() < 0.14) {
      performJump(fighter, match);
    }
  }

  if (fighter.hitstun > 0) {
    fighter.blocking = false;
    fighter.crouching = false;
    return;
  }

  if (fighter.aiIntent.left) {
    fighter.moveIntent = -1;
  }
  if (fighter.aiIntent.right) {
    fighter.moveIntent = 1;
  }

  fighter.blocking =
    fighter.aiIntent.block &&
    fighter.onGround &&
    !fighter.attack &&
    fighter.dodgeTimer <= 0 &&
    fighter.slideTimer <= 0;

  fighter.crouching =
    fighter.aiIntent.crouch &&
    fighter.onGround &&
    !fighter.blocking &&
    fighter.dodgeTimer <= 0 &&
    fighter.slideTimer <= 0;
}

function updateFighter(fighter, opponent, match, dt) {
  fighter.hitstun = Math.max(0, fighter.hitstun - dt);
  fighter.invulnerable = Math.max(0, fighter.invulnerable - dt);
  fighter.attackFlash = Math.max(0, fighter.attackFlash - dt);
  fighter.dodgeCooldown = Math.max(0, fighter.dodgeCooldown - dt);
  fighter.slideCooldown = Math.max(0, fighter.slideCooldown - dt);
  fighter.jumpCooldown = Math.max(0, fighter.jumpCooldown - dt);
  fighter.manualSwingCooldown = Math.max(0, fighter.manualSwingCooldown - dt);
  fighter.dodgeTimer = Math.max(0, fighter.dodgeTimer - dt);
  fighter.slideTimer = Math.max(0, fighter.slideTimer - dt);

  if (!fighter.onGround) {
    fighter.blocking = false;
    fighter.crouching = false;
  }

  const movementLocked = fighter.hitstun > 0 || !fighter.alive;

  if (fighter.dodgeTimer > 0) {
    fighter.vx = -fighter.facing * 360;
  } else if (fighter.slideTimer > 0) {
    fighter.vx = fighter.slideDir * 430;
  } else if (!movementLocked) {
    const controlScale = fighter.blocking ? 0.24 : fighter.attack ? 0.38 : 1;
    const crouchScale = fighter.crouching ? 0.46 : 1;
    const airScale = fighter.onGround ? 1 : 0.66;
    const targetSpeed = fighter.moveIntent * fighter.walkSpeed * controlScale * crouchScale * airScale;
    const acceleration = fighter.onGround ? 2200 : 1100;
    fighter.vx = approach(fighter.vx, targetSpeed, acceleration * dt);
  } else {
    const friction = fighter.onGround ? 1100 : 240;
    fighter.vx = approach(fighter.vx, 0, friction * dt);
  }

  if (fighter.hitstun > 0) {
    fighter.blocking = false;
    fighter.crouching = false;
  }

  if (!fighter.onGround) {
    fighter.vy += fighter.gravity * dt;
  }

  fighter.x += fighter.vx * dt;
  fighter.y += fighter.vy * dt;

  if (fighter.y >= GROUND_Y) {
    fighter.y = GROUND_Y;
    fighter.vy = 0;
    fighter.onGround = true;
  } else {
    fighter.onGround = false;
  }

  const bounds = stageBounds(match.stage);
  fighter.x = clamp(fighter.x, bounds.left, bounds.right);

  if (fighter.onGround && Math.abs(fighter.vx) < 5 && fighter.dodgeTimer <= 0 && fighter.slideTimer <= 0) {
    fighter.vx = 0;
  }

  if (Math.abs(fighter.vx) > 18 && fighter.onGround) {
    fighter.stepTimer += dt * Math.abs(fighter.vx) * 0.055;
  }

  fighter.stamina = clamp(
    fighter.stamina + dt * (fighter.blocking ? 5 : 14),
    0,
    fighter.maxStamina
  );

  updateMouseWeaponControl(fighter, dt);
  updateAttackState(fighter, opponent, match, dt);
  attemptMouseSwingHit(fighter, opponent, match, dt);
}

function resolveFighterSpacing(leftFighter, rightFighter, match) {
  const minimumGap = leftFighter.width + rightFighter.width + 20;
  const gap = rightFighter.x - leftFighter.x;

  if (gap < minimumGap) {
    const push = (minimumGap - gap) / 2;
    leftFighter.x -= push;
    rightFighter.x += push;
  }

  const bounds = stageBounds(match.stage);
  leftFighter.x = clamp(leftFighter.x, bounds.left, bounds.right);
  rightFighter.x = clamp(rightFighter.x, bounds.left, bounds.right);

  autoFace(leftFighter, rightFighter);
  autoFace(rightFighter, leftFighter);
}

function finishMatch(match, winnerTeam, reason) {
  match.phase = "match-over";
  match.finished = true;
  match.setWinner = winnerTeam;
  match.phaseTimer = 999;

  const winnerName =
    winnerTeam === PLAYER_TEAM ? "Player 1" : match.mode === "duel" ? "Player 2" : "Bot";

  setStatus(`${winnerName} wins`);
  setMatchSummary(reason || `${winnerName} wins the set.`);
  updateHudLabels();
}

function finishRound(match, winner, reason) {
  if (match.phase !== "fight") {
    return;
  }

  match.phase = "round-over";
  match.phaseTimer = 2.25;
  match.roundWinner = winner ? winner.team : null;

  if (winner) {
    if (winner.team === PLAYER_TEAM) {
      match.score.player += 1;
    } else {
      match.score.enemy += 1;
    }
    setStatus(`${winner.name} wins`);
  } else {
    setStatus("Draw");
  }

  setMatchSummary(reason || (winner ? `${winner.name} took round ${match.round}.` : `Round ${match.round} ended in a draw.`));
  updateHudLabels();
}

function resetRound(match) {
  match.round += 1;
  match.timer = ROUND_TIME;
  match.phase = "intro";
  match.phaseTimer = 2.1;
  match.roundWinner = null;
  match.sparks = [];
  match.fighters = createRoundFighters(match);
  autoFace(match.fighters[0], match.fighters[1]);
  autoFace(match.fighters[1], match.fighters[0]);
  setStatus(`Round ${match.round}`);
  setMatchSummary(`Round ${match.round}. First to ${match.roundsToWin} round wins takes the set.`);
  updateHudLabels();
}

function createMatch() {
  const playerWeapon = weaponById(state.activeWeaponId) || currentBlueprint();
  let rivalWeapon = weaponById(state.rivalWeaponId);

  if (!rivalWeapon || rivalWeapon.id === playerWeapon.id) {
    rivalWeapon = createRandomEnemyWeapon();
  }

  return {
    mode: ui.matchMode.value,
    roundsToWin: Number(ui.roundsToWin.value),
    stage: { ...state.stage },
    playerWeapon,
    rivalWeapon,
    round: 0,
    timer: ROUND_TIME,
    score: {
      player: 0,
      enemy: 0
    },
    fighters: [],
    sparks: [],
    phase: "intro",
    phaseTimer: 0,
    roundWinner: null,
    setWinner: null,
    finished: false,
    shake: 0,
    hazardTick: 0
  };
}

function startMatch() {
  state.match = createMatch();
  primeInputMemory();
  resetRound(state.match);
  updateHudLabels();
}

function updateSparks(match, dt) {
  match.sparks = match.sparks.filter((spark) => {
    spark.life -= dt;
    spark.x += spark.vx * dt;
    spark.y += spark.vy * dt;
    spark.vy += 320 * dt;
    return spark.life > 0;
  });
}

function applyStageHazard(match, dt) {
  if (!match.stage.hazard || match.phase !== "fight") {
    return;
  }

  const center = STAGE_WIDTH / 2;
  match.hazardTick += dt;

  match.fighters.forEach((fighter) => {
    if (!fighter.alive || !fighter.onGround) {
      return;
    }

    const distance = Math.abs(fighter.x - center);
    if (distance > 34) {
      return;
    }

    fighter.health = clamp(fighter.health - dt * 8, 0, fighter.maxHealth);
    fighter.vx += (fighter.x < center ? -1 : 1) * 88 * dt;
    fighter.attackFlash = 0.08;

    if (match.hazardTick >= 0.08) {
      addSpark(match, center + randomRange(-10, 10), GROUND_Y - randomRange(14, 38), currentStageConfig(match.stage.id).hazard, 4);
      match.hazardTick = 0;
    }

    if (fighter.health <= 0) {
      fighter.alive = false;
    }
  });
}

function updateMatch(dt) {
  const match = state.match;
  if (!match) {
    return;
  }

  const p1Input = inputSnapshot("p1");
  const p2Input = inputSnapshot("p2");

  updateSparks(match, dt);
  match.shake = Math.max(0, match.shake - dt * 18);

  if (!match.fighters.length) {
    return;
  }

  const [player, enemy] = match.fighters;

  if (match.phase === "intro") {
    player.moveIntent = 0;
    enemy.moveIntent = 0;
    player.blocking = false;
    enemy.blocking = false;
    updateFighter(player, enemy, match, dt);
    updateFighter(enemy, player, match, dt);
    resolveFighterSpacing(player, enemy, match);
    match.phaseTimer -= dt;

    if (match.phaseTimer <= 0) {
      match.phase = "fight";
      setStatus("Fight");
      setMatchSummary(`Round ${match.round} is live. Break guard, manage range, and close the set.`);
    }
    return;
  }

  if (match.phase === "fight") {
    match.timer = Math.max(0, match.timer - dt);

    applyHumanControl(player, p1Input, match);
    if (match.mode === "duel") {
      applyHumanControl(enemy, p2Input, match);
    } else {
      applyAiControl(enemy, player, match, dt);
    }

    updateFighter(player, enemy, match, dt);
    updateFighter(enemy, player, match, dt);
    resolveFighterSpacing(player, enemy, match);
    applyStageHazard(match, dt);

    if (!player.alive || player.health <= 0) {
      finishRound(match, enemy, `${enemy.name} finished round ${match.round}.`);
      return;
    }
    if (!enemy.alive || enemy.health <= 0) {
      finishRound(match, player, `${player.name} finished round ${match.round}.`);
      return;
    }

    if (match.timer <= 0) {
      if (player.health > enemy.health) {
        finishRound(match, player, `${player.name} won on time.`);
      } else if (enemy.health > player.health) {
        finishRound(match, enemy, `${enemy.name} won on time.`);
      } else {
        finishRound(match, null, `Round ${match.round} timed out in a draw.`);
      }
    }
    return;
  }

  if (match.phase === "round-over") {
    player.moveIntent = 0;
    enemy.moveIntent = 0;
    player.blocking = false;
    enemy.blocking = false;
    updateFighter(player, enemy, match, dt);
    updateFighter(enemy, player, match, dt);
    resolveFighterSpacing(player, enemy, match);
    match.phaseTimer -= dt;

    if (match.phaseTimer <= 0) {
      if (match.score.player >= match.roundsToWin) {
        finishMatch(match, PLAYER_TEAM, "Player 1 wins the set.");
      } else if (match.score.enemy >= match.roundsToWin) {
        finishMatch(match, ENEMY_TEAM, `${match.mode === "duel" ? "Player 2" : "Bot"} wins the set.`);
      } else {
        resetRound(match);
      }
    }
    return;
  }

  if (match.phase === "match-over") {
    player.moveIntent = 0;
    enemy.moveIntent = 0;
    updateFighter(player, enemy, match, dt);
    updateFighter(enemy, player, match, dt);
    resolveFighterSpacing(player, enemy, match);
  }
}

function drawStage(sceneStage) {
  const stageState = sceneStage || activeStageState();
  const config = currentStageConfig(stageState.id);
  const offsetX = stageOffsetX();
  const groundY = STAGE_TOP + GROUND_Y;
  const floorTop = groundY + 10;
  const bottom = STAGE_TOP + STAGE_HEIGHT;

  const sky = ctx.createLinearGradient(0, STAGE_TOP, 0, bottom);
  sky.addColorStop(0, config.skyTop);
  sky.addColorStop(1, config.skyBottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (stageState.lights) {
    for (let i = 0; i < 5; i += 1) {
      const x = offsetX + 90 + i * 170;
      const glow = ctx.createRadialGradient(x, STAGE_TOP + 64, 8, x, STAGE_TOP + 64, 120);
      glow.addColorStop(0, `${config.crowd}80`);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, STAGE_TOP + 64, 120, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = "rgba(255,255,255,0.04)";
  for (let i = 0; i < 10; i += 1) {
    const x = offsetX + i * 88;
    ctx.fillRect(x, STAGE_TOP + 180 + Math.sin(i) * 8, 32, 50);
  }

  ctx.fillStyle = `${config.crowd}66`;
  for (let i = 0; i < 26; i += 1) {
    ctx.fillRect(offsetX + 16 + i * 32, STAGE_TOP + 186 + Math.sin(i * 0.8) * 6, 16, 28);
  }

  ctx.fillStyle = config.floor;
  ctx.fillRect(offsetX, floorTop, STAGE_WIDTH, FLOOR_THICKNESS);
  ctx.fillStyle = config.floorEdge;
  ctx.fillRect(offsetX, floorTop, STAGE_WIDTH, 10);

  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(offsetX, floorTop);
  ctx.lineTo(offsetX + STAGE_WIDTH, floorTop);
  ctx.stroke();

  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fillRect(offsetX, floorTop + 20, STAGE_WIDTH, 18);

  if (stageState.pillars) {
    [offsetX + 48, offsetX + STAGE_WIDTH - 80].forEach((x) => {
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fillRect(x, STAGE_TOP + 112, 32, 222);
      ctx.fillStyle = config.accent;
      ctx.fillRect(x - 8, STAGE_TOP + 126, 48, 16);
      ctx.fillRect(x - 10, STAGE_TOP + 286, 52, 12);
    });
  }

  if (stageState.hazard) {
    const centerX = offsetX + STAGE_WIDTH / 2;
    ctx.fillStyle = "rgba(0,0,0,0.34)";
    ctx.fillRect(centerX - 20, floorTop - 8, 40, 18);
    ctx.fillStyle = `${config.hazard}bb`;
    ctx.beginPath();
    ctx.moveTo(centerX - 18, floorTop);
    ctx.lineTo(centerX - 4, floorTop - 38);
    ctx.lineTo(centerX + 8, floorTop - 18);
    ctx.lineTo(centerX + 18, floorTop - 42);
    ctx.lineTo(centerX + 24, floorTop);
    ctx.closePath();
    ctx.fill();

    const flare = ctx.createRadialGradient(centerX, floorTop - 18, 10, centerX, floorTop - 18, 50);
    flare.addColorStop(0, `${config.hazard}aa`);
    flare.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = flare;
    ctx.beginPath();
    ctx.arc(centerX, floorTop - 18, 50, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawHealthBar(x, y, width, ratio, fill, reverse = false) {
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(x, y, width, 18);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(x + 2, y + 2, width - 4, 14);

  const filledWidth = Math.round((width - 4) * clamp(ratio, 0, 1));
  ctx.fillStyle = fill;
  if (reverse) {
    ctx.fillRect(x + width - 2 - filledWidth, y + 2, filledWidth, 14);
  } else {
    ctx.fillRect(x + 2, y + 2, filledWidth, 14);
  }
}

function drawRoundPips(x, y, wins, roundsToWin, fill, reverse = false) {
  const gap = 22;
  for (let i = 0; i < roundsToWin; i += 1) {
    const dx = reverse ? x - i * gap : x + i * gap;
    ctx.fillStyle = i < wins ? fill : "rgba(255,255,255,0.15)";
    ctx.beginPath();
    ctx.arc(dx, y, 7, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawFighter(fighter) {
  const stageX = stageOffsetX() + fighter.x;
  const footY = STAGE_TOP + fighter.y + 10;
  const height = currentFighterHeight(fighter);
  const jumpLift = GROUND_Y - fighter.y;
  const shadowScale = clamp(1 - jumpLift / 260, 0.46, 1);
  const bob = fighter.onGround ? 0 : Math.sin(performance.now() * 0.015) * 1.5;
  const walkAmount =
    fighter.onGround && fighter.slideTimer <= 0 && fighter.dodgeTimer <= 0
      ? clamp(Math.abs(fighter.vx) / Math.max(fighter.walkSpeed, 1), 0, 1)
      : 0;
  const walkCycle = fighter.onGround ? Math.sin(fighter.stepTimer) : 0;
  const counterCycle = fighter.onGround ? Math.cos(fighter.stepTimer) : 0;
  const stride = walkCycle * 24 * walkAmount;
  const armSwing = counterCycle * 14 * walkAmount;
  const bodyLift = Math.abs(counterCycle) * 4 * walkAmount;
  const weaponPose = weaponPoseForFighter(fighter);

  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  ctx.beginPath();
  ctx.ellipse(stageX, STAGE_TOP + GROUND_Y + 18, 24 * shadowScale, 8 * shadowScale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(stageX, footY + bob + bodyLift);

  const torsoTop = -height * 0.6;
  const headRadius = 10.5;
  const headCenterX = fighter.facing * 2;
  const headCenterY = torsoTop - headRadius + 5;
  const neckY = headCenterY + headRadius - 1;
  const shoulderY = torsoTop * 0.46;
  const shoulderFrontX = fighter.facing * (19 + walkAmount * 5);
  const shoulderRearX = -fighter.facing * (17 + walkAmount * 4);
  const hipFrontX = fighter.facing * 23;
  const hipRearX = -fighter.facing * 21;
  const frontArmY =
    shoulderY + (fighter.blocking ? -14 : fighter.attack || fighter.slideTimer > 0 ? 4 : 12 + armSwing * 0.3);
  const rearArmY = shoulderY + 14 - armSwing * 0.34;
  const frontLegY = fighter.slideTimer > 0 ? 10 : 20 + stride * 0.7;
  const rearLegY = fighter.slideTimer > 0 ? 14 : 20 - stride * 0.7;
  const lean =
    fighter.slideTimer > 0 ? fighter.facing * 0.28 : fighter.hitstun > 0 ? -fighter.facing * 0.18 : 0;
  ctx.rotate(lean);

  ctx.strokeStyle = fighter.color;
  ctx.lineWidth = 4.5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(fighter.facing * 2, torsoTop * 0.44, headCenterX * 0.35, neckY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, shoulderY);
  ctx.quadraticCurveTo(shoulderFrontX * 0.45, shoulderY + 12, shoulderFrontX, frontArmY);
  ctx.moveTo(0, shoulderY);
  ctx.quadraticCurveTo(shoulderRearX * 0.42, shoulderY + 10, shoulderRearX, rearArmY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(hipFrontX * 0.34, 12, hipFrontX, frontLegY);
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(hipRearX * 0.32, 12, hipRearX, rearLegY);
  ctx.stroke();

  ctx.fillStyle = fighter.color;
  ctx.beginPath();
  ctx.arc(headCenterX, headCenterY, headRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = fighter.color;
  ctx.lineWidth = 2;
  ctx.stroke();

  if (fighter.attackFlash > 0) {
    ctx.fillStyle = `rgba(255,255,255,${fighter.attackFlash * 0.75})`;
    ctx.beginPath();
    ctx.arc(0, torsoTop * 0.64, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  const weaponBaseX = weaponPose.baseX - fighter.x;
  const weaponBaseY = weaponPose.baseY - fighter.y;
  const weaponTipX = weaponPose.tipX - fighter.x;
  const weaponTipY = weaponPose.tipY - fighter.y;

  ctx.strokeStyle = fighter.color;
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(shoulderFrontX * 0.86, shoulderY - 2);
  ctx.lineTo(weaponBaseX, weaponBaseY);
  ctx.stroke();

  ctx.strokeStyle = fighter.weapon.color;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(weaponBaseX, weaponBaseY);
  ctx.lineTo(weaponTipX, weaponTipY);
  ctx.stroke();

  ctx.fillStyle = fighter.weapon.color;
  ctx.beginPath();
  ctx.arc(weaponTipX, weaponTipY, fighter.weapon.frameId === "chainblade" ? 8 : 5, 0, Math.PI * 2);
  ctx.fill();

  if (fighter.blocking) {
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(fighter.facing * 18, torsoTop * 0.56, 18, -1.4, 1.4);
    ctx.stroke();
  }

  ctx.restore();
}

function drawSparks(match) {
  match.sparks.forEach((spark) => {
    ctx.fillStyle = spark.color;
    ctx.globalAlpha = clamp(spark.life * 3, 0, 1);
    ctx.beginPath();
    ctx.arc(stageOffsetX() + spark.x, STAGE_TOP + spark.y + 10, spark.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function drawHud(match) {
  const [player, enemy] = match.fighters;
  const playerLabel = `PLAYER 1  ${match.playerWeapon.name.toUpperCase()}`;
  const enemyLabel = `${(match.mode === "duel" ? "PLAYER 2" : "BOT")}  ${match.rivalWeapon.name.toUpperCase()}`;

  ctx.fillStyle = "rgba(0,0,0,0.42)";
  ctx.fillRect(0, 0, canvas.width, HUD_HEIGHT);

  ctx.fillStyle = "#f4efe7";
  ctx.font = "700 15px 'Trebuchet MS', sans-serif";
  ctx.fillText(playerLabel, 44, 24);
  ctx.fillText(enemyLabel, canvas.width - 44 - ctx.measureText(enemyLabel).width, 24);

  drawHealthBar(42, 30, 320, player.health / player.maxHealth, "#89e6dc");
  drawHealthBar(canvas.width - 362, 30, 320, enemy.health / enemy.maxHealth, "#f0d48b", true);

  ctx.fillStyle = "#d7c9b7";
  ctx.font = "700 28px Georgia, serif";
  const timerText = `${Math.ceil(match.timer)}`;
  ctx.fillText(timerText, canvas.width / 2 - ctx.measureText(timerText).width / 2, 38);

  drawRoundPips(48, 56, match.score.player, match.roundsToWin, "#89e6dc");
  drawRoundPips(canvas.width - 48, 56, match.score.enemy, match.roundsToWin, "#f0d48b", true);

  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fillRect(42, 52, 320 * (player.stamina / player.maxStamina), 4);
  ctx.fillRect(canvas.width - 42 - 320 * (enemy.stamina / enemy.maxStamina), 52, 320 * (enemy.stamina / enemy.maxStamina), 4);
}

function drawBanner(title, subtitle) {
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.38)";
  ctx.fillRect(canvas.width / 2 - 220, canvas.height / 2 - 58, 440, 116);

  ctx.fillStyle = "#f4efe7";
  ctx.font = "700 38px Georgia, serif";
  const titleWidth = ctx.measureText(title).width;
  ctx.fillText(title, canvas.width / 2 - titleWidth / 2, canvas.height / 2 - 6);

  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = "600 16px 'Trebuchet MS', sans-serif";
  const subtitleWidth = ctx.measureText(subtitle).width;
  ctx.fillText(subtitle, canvas.width / 2 - subtitleWidth / 2, canvas.height / 2 + 24);
  ctx.restore();
}

function renderIdleStage() {
  drawStage(state.stage);

  const leftPose = spawnFighter({
    team: PLAYER_TEAM,
    control: "p1",
    weapon: weaponById(state.activeWeaponId) || currentBlueprint(),
    x: 300,
    name: "Player 1",
    color: "#89e6dc"
  });
  const rightPose = spawnFighter({
    team: ENEMY_TEAM,
    control: "bot",
    weapon: weaponById(state.rivalWeaponId) || createRandomEnemyWeapon(),
    x: STAGE_WIDTH - 300,
    name: "Rival",
    color: "#f0d48b"
  });

  leftPose.stepTimer = 0.8;
  leftPose.attack = { timer: leftPose.profile.windup + leftPose.profile.active * 0.66, connected: true };
  rightPose.blocking = true;

  drawFighter(leftPose);
  drawFighter(rightPose);

  ctx.fillStyle = "rgba(0,0,0,0.34)";
  ctx.fillRect(140, 176, canvas.width - 280, 132);
  drawBanner("ROUND SET FIGHTER", "Forge a weapon, choose a stage, then start the duel.");

  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "600 16px 'Trebuchet MS', sans-serif";
  const stageText = `${currentStageConfig().label}  |  ${state.stage.hazard ? "hazard on" : "hazard off"}  |  first to ${ui.roundsToWin.value}`;
  ctx.fillText(stageText, canvas.width / 2 - ctx.measureText(stageText).width / 2, canvas.height / 2 + 74);
}

function renderBattlefield() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!state.match) {
    renderIdleStage();
    return;
  }

  const match = state.match;
  drawStage(match.stage);

  ctx.save();
  if (match.shake > 0) {
    ctx.translate(randomRange(-match.shake, match.shake), randomRange(-match.shake, match.shake));
  }

  match.fighters.forEach((fighter) => drawFighter(fighter));
  drawSparks(match);
  ctx.restore();

  drawHud(match);

  if (match.phase === "intro") {
    if (match.phaseTimer > 0.9) {
      drawBanner(`ROUND ${match.round}`, `First to ${match.roundsToWin} wins`);
    } else {
      drawBanner("FIGHT", `${match.mode === "duel" ? "Local duel" : "Bot duel"} on ${currentStageConfig(match.stage.id).label}`);
    }
  } else if (match.phase === "round-over") {
    const title = match.roundWinner
      ? `${match.roundWinner === PLAYER_TEAM ? "PLAYER 1" : match.mode === "duel" ? "PLAYER 2" : "BOT"} TAKES ROUND`
      : "DRAW";
    drawBanner(title, `Set score ${match.score.player} - ${match.score.enemy}`);
  } else if (match.phase === "match-over") {
    const title =
      match.setWinner === PLAYER_TEAM ? "PLAYER 1 WINS" : match.mode === "duel" ? "PLAYER 2 WINS" : "BOT WINS";
    drawBanner(title, "Set complete. Reforge or start another match.");
  }
}

function loop(now) {
  const dt = clamp((now - state.lastFrameTime) / 1000, 0, 0.033);
  state.lastFrameTime = now;
  updateMatch(dt);
  renderBattlefield();
  requestAnimationFrame(loop);
}

function handleForgeChange() {
  state.forge.name = ui.weaponName.value;
  state.forge.frame = ui.frameSelect.value;
  state.forge.material = ui.materialSelect.value;
  state.forge.edge = ui.edgeSelect.value;
  state.forge.length = Number(ui.lengthRange.value);
  state.forge.balance = Number(ui.balanceRange.value);
  state.forge.temper = Number(ui.temperRange.value);
  renderForge();
  updateHudLabels();
}

function bindTouchControls() {
  const buttons = ui.touchControls.querySelectorAll("[data-touch]");
  buttons.forEach((button) => {
    const action = button.dataset.touch;
    const setPressed = (value, event) => {
      event.preventDefault();
      state.touchState[action] = value;
    };

    button.addEventListener("pointerdown", (event) => setPressed(true, event));
    button.addEventListener("pointerup", (event) => setPressed(false, event));
    button.addEventListener("pointerleave", (event) => setPressed(false, event));
    button.addEventListener("pointercancel", (event) => setPressed(false, event));
  });
}

function bindPointerInput() {
  const updateMousePosition = (event) => {
    const rect = ui.battlefield.getBoundingClientRect();
    state.mouse.x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * canvas.width;
    state.mouse.y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * canvas.height;
  };

  ui.battlefield.addEventListener("pointermove", updateMousePosition);
  ui.battlefield.addEventListener("pointerdown", (event) => {
    updateMousePosition(event);
    if (event.button === 0) {
      state.mouse.left = true;
    } else if (event.button === 2) {
      state.mouse.right = true;
    }
    event.preventDefault();
  });

  window.addEventListener("pointerup", (event) => {
    if (event.button === 0) {
      state.mouse.left = false;
    } else if (event.button === 2) {
      state.mouse.right = false;
    }
  });

  window.addEventListener("pointercancel", () => {
    state.mouse.left = false;
    state.mouse.right = false;
  });

  ui.battlefield.addEventListener("contextmenu", (event) => event.preventDefault());
}

function bindEvents() {
  [
    ui.weaponName,
    ui.frameSelect,
    ui.materialSelect,
    ui.edgeSelect,
    ui.lengthRange,
    ui.balanceRange,
    ui.temperRange
  ].forEach((element) => {
    element.addEventListener("input", handleForgeChange);
    element.addEventListener("change", handleForgeChange);
  });

  ui.saveWeapon.addEventListener("click", () => {
    saveCurrentWeapon({ equip: false });
    setMatchSummary(`Saved ${currentBlueprint().name} to the armory.`);
  });

  ui.equipWeapon.addEventListener("click", () => {
    saveCurrentWeapon({ equip: true });
    setMatchSummary(`${currentBlueprint().name} equipped for Player 1.`);
  });

  ui.presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.stage.id = button.dataset.preset;
      renderStageSummary();
      updateHudLabels();
      renderBattlefield();
    });
  });

  ui.toggleHazard.addEventListener("click", () => {
    state.stage.hazard = !state.stage.hazard;
    renderStageSummary();
    updateHudLabels();
    renderBattlefield();
  });

  ui.togglePillars.addEventListener("click", () => {
    state.stage.pillars = !state.stage.pillars;
    renderStageSummary();
    renderBattlefield();
  });

  ui.toggleLights.addEventListener("click", () => {
    state.stage.lights = !state.stage.lights;
    renderStageSummary();
    renderBattlefield();
  });

  ui.roundsToWin.addEventListener("input", () => {
    ui.roundsToWinValue.textContent = ui.roundsToWin.value;
    renderBattlefield();
  });

  ui.matchMode.addEventListener("change", () => {
    setMatchSummary(
      ui.matchMode.value === "duel"
        ? "Local duel mode active. Player 2 uses keyboard attacks and defense."
        : "Bot mode active. Fight the AI in a round set."
    );
  });

  ui.startMatch.addEventListener("click", startMatch);

  const preventedKeys = new Set([
    "Space",
    ...Object.values(keyBindings.p1),
    ...Object.values(keyBindings.p2)
  ]);

  window.addEventListener("keydown", (event) => {
    if (preventedKeys.has(event.code)) {
      event.preventDefault();
    }
    state.keysDown.add(event.code);
  });

  window.addEventListener("keyup", (event) => {
    state.keysDown.delete(event.code);
  });

  window.addEventListener("blur", () => {
    state.keysDown.clear();
    state.mouse.left = false;
    state.mouse.right = false;
    Object.keys(state.touchState).forEach((key) => {
      state.touchState[key] = false;
    });
  });

  bindPointerInput();
  bindTouchControls();
}

function seedArmory() {
  if (state.armory.length) {
    return;
  }

  const playerWeapon = currentBlueprint();
  const rivalWeapon = createRandomEnemyWeapon();
  const alternateWeapon = createRandomEnemyWeapon();

  state.armory.push(playerWeapon, rivalWeapon, alternateWeapon);
  state.activeWeaponId = playerWeapon.id;
  state.rivalWeaponId = rivalWeapon.id;
  renderArmory();
}

function init() {
  populateSelect(ui.frameSelect, frameCatalog);
  populateSelect(ui.materialSelect, materialCatalog);
  populateSelect(ui.edgeSelect, edgeCatalog);

  ui.frameSelect.value = state.forge.frame;
  ui.materialSelect.value = state.forge.material;
  ui.edgeSelect.value = state.forge.edge;
  ui.weaponName.value = state.forge.name;
  ui.lengthRange.value = `${state.forge.length}`;
  ui.balanceRange.value = `${state.forge.balance}`;
  ui.temperRange.value = `${state.forge.temper}`;
  ui.roundsToWinValue.textContent = ui.roundsToWin.value;

  seedArmory();
  renderForge();
  renderArmory();
  renderStageSummary();
  updateHudLabels();
  setStatus("Waiting");
  setMatchSummary("Forge a weapon, pick a stage, and launch a proper round set.");
  bindEvents();
  renderBattlefield();

  if (window.location.hash.includes("autostart")) {
    startMatch();
  }

  requestAnimationFrame(loop);
}

init();
