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
  executioner: {
    label: "Executioner Blade",
    classLabel: "Long",
    kind: "long",
    summary: "Long heavy blade with a delayed punish hit. Clean front hits can execute at 40% or less if the rival is open.",
    design: "Oversized execution slab",
    damage: 28,
    reach: 110,
    cooldown: 1.02,
    knockback: 1.48,
    arc: 1.04,
    speed: 0.76,
    moveScale: 0.86,
    weight: 23,
    special: {
      type: "heavy-execute",
      threshold: 0.4,
      summary: "Heavy strike executes on clean front hits at 40% or less."
    }
  },
  pike: {
    label: "Pike",
    classLabel: "Long",
    kind: "long",
    summary: "Longest parry lane here. Heavy delayed thrust, easy catch range, and broad parry timing.",
    design: "Long thrusting polearm",
    damage: 20,
    reach: 124,
    cooldown: 0.9,
    knockback: 1.18,
    arc: 0.78,
    speed: 0.84,
    moveScale: 0.92,
    weight: 15,
    special: {
      type: "long-counter",
      summary: "Long class parries are easier and work on almost any incoming angle."
    }
  },
  dragonslayer: {
    label: "Dragon Slayer",
    classLabel: "Long",
    kind: "long",
    summary: "Long crushing blade. Delayed heavy swings hit dead-on and leave a longer stun trail even without an execute.",
    design: "Rune-cut slab sword",
    damage: 26,
    reach: 102,
    cooldown: 1,
    knockback: 1.44,
    arc: 0.94,
    speed: 0.78,
    moveScale: 0.84,
    weight: 22,
    special: {
      type: "quake-heavy",
      summary: "Heavy hits cause longer stun and stronger shake on clean front contact."
    }
  },
  katana: {
    label: "Katana",
    classLabel: "Medium",
    kind: "medium",
    summary: "Solid mid-range blade. Dashing becomes a draw slash, and passing through a rival under 30% can finish them.",
    design: "Single-edge draw blade",
    damage: 20,
    reach: 92,
    cooldown: 0.64,
    knockback: 1.12,
    arc: 1.02,
    speed: 1.02,
    moveScale: 1,
    weight: 11,
    special: {
      type: "dash-execute",
      threshold: 0.3,
      summary: "Dash slash executes if it cuts through an unblocked rival at 30% or less."
    }
  },
  capesh: {
    label: "Capesh",
    classLabel: "Medium",
    kind: "medium",
    summary: "Medium spinner. Its dash becomes a spinning slash that sweeps around the fighter instead of a plain rush.",
    design: "Curved spinner blade",
    damage: 18,
    reach: 84,
    cooldown: 0.58,
    knockback: 1,
    arc: 1.24,
    speed: 1.08,
    moveScale: 1.04,
    weight: 10,
    special: {
      type: "dash-spin",
      summary: "Dash turns into a spinning slash that catches both close and crossing movement."
    }
  },
  saber: {
    label: "Saber",
    classLabel: "Medium",
    kind: "medium",
    summary: "Reliable medium blade. No execute gimmick, just stable jabs, clean slashes, and balanced dash pressure.",
    design: "Straight duel blade",
    damage: 18,
    reach: 82,
    cooldown: 0.6,
    knockback: 1.04,
    arc: 1.1,
    speed: 1.04,
    moveScale: 1.02,
    weight: 10,
    special: {
      type: "dash-slash",
      summary: "Dash becomes a solid forward slash with no extra gimmick."
    }
  },
  cutlass: {
    label: "Cutlass",
    classLabel: "Medium",
    kind: "medium",
    summary: "Cross-cut medium blade. Its pass-through dash slash bites harder into guard and comes out fast.",
    design: "Broad curve cross blade",
    damage: 19,
    reach: 86,
    cooldown: 0.56,
    knockback: 1.06,
    arc: 1.18,
    speed: 1.06,
    moveScale: 1.02,
    weight: 10,
    special: {
      type: "cross-cut",
      summary: "Pass-through dash slash hits quickly and strains blocks harder."
    }
  },
  karambit: {
    label: "Karambit",
    classLabel: "Short",
    kind: "short",
    summary: "Short stealth blade. Back hits hurt more, crouching hides the silhouette, and dash becomes two spinning slashes.",
    design: "Hooked close-range knife",
    damage: 15,
    reach: 58,
    cooldown: 0.42,
    knockback: 0.86,
    arc: 1.36,
    speed: 1.24,
    moveScale: 1.12,
    weight: 6,
    special: {
      type: "double-spin-dash",
      backstabBonus: 1.32,
      summary: "Deals extra back damage and dash chains two spin slashes."
    }
  },
  shiv: {
    label: "Shiv",
    classLabel: "Short",
    kind: "short",
    summary: "Fast short blade with weak frontal trades but nasty back hits and very hard-to-read crouch pressure.",
    design: "Tucked ambush knife",
    damage: 13,
    reach: 54,
    cooldown: 0.38,
    knockback: 0.78,
    arc: 0.94,
    speed: 1.3,
    moveScale: 1.16,
    weight: 5,
    special: {
      type: "ambush",
      backstabBonus: 1.4,
      summary: "Back hits deal extra damage and crouching makes the fighter harder to read."
    }
  },
  twinfang: {
    label: "Twinfang",
    classLabel: "Short",
    kind: "short",
    summary: "Dual short blade set. Back hits still bite harder, and dash becomes a three-cut rush instead of a plain spin.",
    design: "Twin hooked fangs",
    damage: 14,
    reach: 60,
    cooldown: 0.4,
    knockback: 0.82,
    arc: 1.22,
    speed: 1.28,
    moveScale: 1.14,
    weight: 6,
    special: {
      type: "triple-rush",
      backstabBonus: 1.24,
      summary: "Dash chains three fast cuts and rewards crossing behind the rival."
    }
  }
};

const materialCatalog = {
  ironwood: {
    label: "Ironwood Core",
    summary: "Light and easy to carry. You give up some damage for faster movement and control.",
    damage: -1,
    reach: -2,
    speed: 0.06,
    cooldown: -0.05,
    knockback: -0.08,
    moveScale: 0.03,
    weight: -2.5,
    color: "#89e6dc"
  },
  sunsteel: {
    label: "Sunsteel",
    summary: "Safe all-round metal. Small damage boost without pushing the weapon too far in any direction.",
    damage: 3,
    reach: 2,
    speed: 0.02,
    cooldown: -0.02,
    knockback: 0.02,
    moveScale: 0,
    weight: 0,
    color: "#f0d48b"
  },
  voidglass: {
    label: "Voidglass",
    summary: "Long and fast. Better reach and speed, but it does not shove opponents as hard.",
    damage: 1,
    reach: 4,
    speed: 0.1,
    cooldown: -0.06,
    knockback: -0.02,
    moveScale: 0.02,
    weight: -1.2,
    color: "#90a2ff"
  },
  embersteel: {
    label: "Embersteel",
    summary: "Heavy furnace metal. Hits hard and launches well, but it slows your weapon down.",
    damage: 5,
    reach: 0,
    speed: -0.06,
    cooldown: 0.06,
    knockback: 0.12,
    moveScale: -0.04,
    weight: 3,
    color: "#ff8752"
  }
};

const edgeCatalog = {
  duelist: {
    label: "Duelist Style",
    summary: "Medium-only style. Faster slash recovery, cleaner jabs, and the safest all-round draw slash.",
    damage: 1,
    reach: 2,
    speed: 0.05,
    cooldown: -0.03,
    knockback: 0,
    arc: 0.02,
    weight: -0.4,
    ability: "Sharper recovery and cleaner control."
  },
  cyclone: {
    label: "Cyclone Style",
    summary: "Medium-only style. Dash slash sweeps wider and spins longer while crossing through the rival.",
    damage: 0,
    reach: 3,
    speed: 0.03,
    cooldown: 0,
    knockback: 0.03,
    arc: 0.2,
    weight: 0.4,
    ability: "Boosts spinning slash coverage."
  },
  shadow: {
    label: "Ghost Style",
    summary: "Medium-only style. Dash cross is faster, passes deeper through the rival, and recovers quicker after the slash.",
    damage: 1,
    reach: 0,
    speed: 0.1,
    cooldown: -0.04,
    knockback: -0.02,
    arc: 0.08,
    weight: -0.6,
    ability: "Faster pass-through slash and quicker recovery."
  },
  breaker: {
    label: "Breaker Style",
    summary: "Medium-only style. Heavier dash slash, stronger guard damage, slower recovery.",
    damage: 4,
    reach: -2,
    speed: -0.1,
    cooldown: 0.08,
    knockback: 0.14,
    arc: -0.02,
    weight: 2.2,
    ability: "Raises guard strain and raw finish power."
  }
};

const bladeTypeCatalog = {
  long: {
    label: "Long",
    summary: "Slow heavy weapons with easier parries and delayed punish hits."
  },
  medium: {
    label: "Medium",
    summary: "Balanced blades. Only medium weapons use styles, and their dash becomes a pass-through slash."
  },
  short: {
    label: "Short",
    summary: "Close-range blades with back-hit damage, stealthier crouches, and fast dash chains."
  }
};

const stageCatalog = {
  foundry: {
    label: "Foundry",
    tagline: "Molten pressure lane",
    specialty: "Hazard punishes standing still",
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
    tagline: "Clean championship platform",
    specialty: "Best stage for pure duels",
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
    tagline: "Trial lane with pressure zones",
    specialty: "Strong sight lines and traps",
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
  introScreen: document.querySelector("#intro-screen"),
  introPlay: document.querySelector("#intro-play"),
  mainMenu: document.querySelector("#main-menu"),
  closeMenu: document.querySelector("#close-menu"),
  openMenu: document.querySelector("#open-menu"),
  toggleSound: document.querySelector("#toggle-sound"),
  menuToggleSound: document.querySelector("#menu-toggle-sound"),
  menuPlayBot: document.querySelector("#menu-play-bot"),
  menuPlayPvp: document.querySelector("#menu-play-pvp"),
  menuOpenWorkshop: document.querySelector("#menu-open-workshop"),
  menuSummary: document.querySelector("#menu-summary"),
  tutorialOffer: document.querySelector("#tutorial-offer"),
  tutorialOfferCopy: document.querySelector("#tutorial-offer-copy"),
  deviceChoiceButtons: Array.from(document.querySelectorAll(".device-choice-button")),
  startTutorial: document.querySelector("#start-tutorial"),
  skipTutorial: document.querySelector("#skip-tutorial"),
  classSelect: document.querySelector("#class-select"),
  frameSelect: document.querySelector("#frame-select"),
  materialSelect: document.querySelector("#material-select"),
  edgeSelect: document.querySelector("#edge-select"),
  forgeNote: document.querySelector(".forge-note"),
  forgeMinigame: document.querySelector("#forge-minigame"),
  forgeMinigameTitle: document.querySelector("#forge-minigame-title"),
  forgeMinigameCopy: document.querySelector("#forge-minigame-copy"),
  forgeMinigameRating: document.querySelector("#forge-minigame-rating"),
  forgeMinigameBar: document.querySelector("#forge-minigame-bar"),
  forgeMinigameTarget: document.querySelector("#forge-minigame-target"),
  forgeMinigameIndicator: document.querySelector("#forge-minigame-indicator"),
  forgeMinigamePips: document.querySelector("#forge-minigame-pips"),
  forgeMinigameStatus: document.querySelector("#forge-minigame-status"),
  forgeMinigameProgress: document.querySelector("#forge-minigame-progress"),
  forgeMinigameTime: document.querySelector("#forge-minigame-time"),
  forgeMinigameStreak: document.querySelector("#forge-minigame-streak"),
  forgeStart: document.querySelector("#forge-start"),
  forgeAction: document.querySelector("#forge-action"),
  weaponName: document.querySelector("#weapon-name"),
  heatRange: document.querySelector("#heat-range"),
  heatValue: document.querySelector("#heat-value"),
  forgePreview: document.querySelector("#forge-preview"),
  weaponTitle: document.querySelector("#weapon-title"),
  weaponLore: document.querySelector("#weapon-lore"),
  forgeBadges: document.querySelector("#forge-badges"),
  forgeStats: document.querySelector("#forge-stats"),
  forgeDetails: document.querySelector("#forge-details"),
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
  toggleScreenFocus: document.querySelector("#toggle-screen-focus"),
  startMatch: document.querySelector("#start-match"),
  battlefield: document.querySelector("#battlefield"),
  hudPlayerWeapon: document.querySelector("#hud-player-weapon"),
  hudRivalWeapon: document.querySelector("#hud-rival-weapon"),
  hudArenaName: document.querySelector("#hud-arena-name"),
  hudSetScore: document.querySelector("#hud-set-score"),
  hudResult: document.querySelector("#hud-result"),
  battlefieldMode: document.querySelector("#battlefield-mode"),
  battlefieldPhase: document.querySelector("#battlefield-phase"),
  broadcastPlayerName: document.querySelector("#broadcast-player-name"),
  broadcastPlayerLoadout: document.querySelector("#broadcast-player-loadout"),
  broadcastPlayerRecord: document.querySelector("#broadcast-player-record"),
  broadcastPlayerForm: document.querySelector("#broadcast-player-form"),
  broadcastRivalName: document.querySelector("#broadcast-rival-name"),
  broadcastRivalLoadout: document.querySelector("#broadcast-rival-loadout"),
  broadcastRivalRecord: document.querySelector("#broadcast-rival-record"),
  broadcastRivalForm: document.querySelector("#broadcast-rival-form"),
  broadcastStageName: document.querySelector("#broadcast-stage-name"),
  broadcastStageNote: document.querySelector("#broadcast-stage-note"),
  broadcastRoundPips: document.querySelector("#broadcast-round-pips"),
  battlefieldStyle: document.querySelector("#battlefield-style"),
  battlefieldStage: document.querySelector("#battlefield-stage"),
  battlefieldLoadout: document.querySelector("#battlefield-loadout"),
  fightFeed: document.querySelector("#fight-feed"),
  setStats: document.querySelector("#set-stats"),
  tutorialPanel: document.querySelector("#tutorial-panel"),
  tutorialTitle: document.querySelector("#tutorial-title"),
  tutorialCopy: document.querySelector("#tutorial-copy"),
  tutorialChecklist: document.querySelector("#tutorial-checklist"),
  closeTutorial: document.querySelector("#close-tutorial"),
  setRecap: document.querySelector("#set-recap"),
  setRecapTitle: document.querySelector("#set-recap-title"),
  setRecapMode: document.querySelector("#set-recap-mode"),
  setRecapWinner: document.querySelector("#set-recap-winner"),
  setRecapScore: document.querySelector("#set-recap-score"),
  setRecapLoadouts: document.querySelector("#set-recap-loadouts"),
  setRecapStage: document.querySelector("#set-recap-stage"),
  recapRematch: document.querySelector("#recap-rematch"),
  recapMenu: document.querySelector("#recap-menu"),
  matchSummary: document.querySelector("#match-summary"),
  controlGuide: document.querySelector("#control-guide"),
  touchControls: document.querySelector("#touch-controls"),
  accountName: document.querySelector("#account-name"),
  accountPasscode: document.querySelector("#account-passcode"),
  accountStatus: document.querySelector("#account-status"),
  accountNote: document.querySelector("#account-note"),
  createAccount: document.querySelector("#create-account"),
  loginAccount: document.querySelector("#login-account"),
  logoutAccount: document.querySelector("#logout-account"),
  friendName: document.querySelector("#friend-name"),
  friendStatus: document.querySelector("#friend-status"),
  addFriend: document.querySelector("#add-friend"),
  friendList: document.querySelector("#friend-list"),
  feedbackInbox: document.querySelector("#feedback-inbox"),
  feedbackPanel: document.querySelector("#feedback-panel"),
  feedbackChoices: Array.from(document.querySelectorAll(".feedback-choice")),
  feedbackCopy: document.querySelector("#feedback-copy"),
  feedbackNote: document.querySelector("#feedback-note"),
  feedbackStatus: document.querySelector("#feedback-status"),
  sendFeedback: document.querySelector("#send-feedback"),
  dismissFeedback: document.querySelector("#dismiss-feedback"),
  reviewChoices: Array.from(document.querySelectorAll(".review-choice")),
  reviewNote: document.querySelector("#review-note"),
  reviewStatus: document.querySelector("#review-status"),
  submitReview: document.querySelector("#submit-review"),
  reviewList: document.querySelector("#review-list")
};

const canvas = ui.battlefield;
const ctx = canvas.getContext("2d");
const previewCtx = ui.forgePreview.getContext("2d");

const state = {
  forge: {
    id: "weapon-player",
    name: "Ashbite",
    kind: "medium",
    frame: "saber",
    material: "sunsteel",
    edge: "duelist",
    heat: 58,
    forgeQuality: 0.5
  },
  forgeGame: {
    mode: "medium",
    active: false,
    finished: false,
    progress: 0,
    rating: 0.5,
    indicator: 0.18,
    direction: 1,
    hits: 0,
    misses: 0,
    streak: 0,
    bestStreak: 0,
    elapsed: 0,
    timeLimit: 6,
    pips: []
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
  lastFrameTime: performance.now(),
  auth: {
    accounts: [],
    activeAccountId: null
  },
  feedback: {
    shown: false,
    visible: false,
    promptDelay: 12,
    visibleDuration: 16,
    selectedChoice: "",
    entries: [],
    promptHandle: null,
    hideHandle: null
  },
  reviews: {
    selectedChoice: "",
    entries: []
  },
  flow: {
    introOpen: true,
    screen: "arena",
    fullscreen: false
  },
  social: {
    rivalFriendId: null
  },
  tutorial: {
    offerVisible: false,
    promptSeen: false,
    active: false,
    completed: false,
    dismissed: false,
    stepIndex: 0,
    progress: {
      move: false,
      air: false,
      attack: false,
      block: false,
      mobility: false
    }
  },
  menu: {
    open: true
  },
  inputProfile: {
    touch: false,
    lastSource: "mouse",
    preference: "auto"
  },
  gamepad: {
    connected: false,
    index: null,
    leftX: 0,
    leftY: 0,
    rightX: 0,
    rightY: 0,
    buttons: {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false,
      attack: false,
      block: false,
      dodge: false,
      slide: false,
      menu: false,
      confirm: false
    }
  },
  uiPulse: 0,
  audio: {
    enabled: true,
    context: null,
    masterGain: null
  }
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

function frameIdsForKind(kind) {
  return Object.entries(frameCatalog)
    .filter(([, frame]) => frame.kind === kind)
    .map(([id]) => id);
}

function firstFrameIdForKind(kind) {
  return frameIdsForKind(kind)[0] || "katana";
}

function frameCatalogForKind(kind) {
  return Object.fromEntries(Object.entries(frameCatalog).filter(([, frame]) => frame.kind === kind));
}

function normalizeForgeState(forge = state.forge) {
  const inferredKind = forge.kind || frameCatalog[forge.frame]?.kind || "medium";
  const kind = bladeTypeCatalog[inferredKind] ? inferredKind : "medium";
  const frameId = frameIdsForKind(kind).includes(forge.frame) ? forge.frame : firstFrameIdForKind(kind);
  const materialId = materialCatalog[forge.material] ? forge.material : "sunsteel";
  const edgeId = edgeCatalog[forge.edge] ? forge.edge : "duelist";
  return {
    ...forge,
    kind,
    frame: frameId,
    material: materialId,
    edge: edgeId,
    heat: clamp(Number(forge.heat ?? forge.temper ?? 58), 0, 100),
    forgeQuality: clamp(Number(forge.forgeQuality ?? 0.5), 0.2, 1),
    name: String(forge.name || "Ashbite").trim().slice(0, 12) || "Ashbite"
  };
}

function forgeModeMeta(kind) {
  if (kind === "long") {
    return {
      title: "Long Blade Heat Control",
      copy: "Let the temper marker drift into the wide gold zone, then strike. Long blades care about steady heavy timing.",
      action: "Quench Hit"
    };
  }
  if (kind === "short") {
    return {
      title: "Short Blade Rapid Forge",
      copy: "Short blades want fast, tight work. Strike quickly to pop every spark before the timer runs out.",
      action: "Spark Hit"
    };
  }
  return {
    title: "Medium Blade Rhythm Forge",
    copy: "Medium blades want measured rhythm. Strike as the marker crosses each target to keep the slash line clean.",
    action: "Hammer Hit"
  };
}

function forgeRatingLabel(score) {
  if (score >= 0.9) {
    return "Masterforged";
  }
  if (score >= 0.76) {
    return "Tempered";
  }
  if (score >= 0.58) {
    return "Field Ready";
  }
  if (score >= 0.42) {
    return "Rough Forged";
  }
  return "Crude";
}

function createForgeGame(kind) {
  const game = {
    mode: kind,
    active: false,
    finished: false,
    progress: 0,
    rating: 0.5,
    indicator: kind === "short" ? 0 : 0.18,
    direction: 1,
    hits: 0,
    misses: 0,
    elapsed: 0,
    timeLimit: kind === "short" ? 4.2 : kind === "medium" ? 7 : 6.4,
    pips: []
  };

  if (kind === "short") {
    game.pips = [0.18, 0.36, 0.52, 0.68, 0.84].map((position, index) => ({
      id: index,
      position,
      velocity: index % 2 === 0 ? 0.16 : -0.18,
      hit: false
    }));
  } else if (kind === "medium") {
    game.pips = [0.24, 0.5, 0.76].map((position, index) => ({
      id: index,
      position,
      hit: false
    }));
  }

  return game;
}

function resetForgeMinigame(kind = state.forge.kind, preserveQuality = false) {
  const existingQuality = preserveQuality ? clamp(Number(state.forge.forgeQuality ?? 0.5), 0.2, 1) : 0.5;
  state.forgeGame = createForgeGame(kind);
  state.forgeGame.rating = existingQuality;
  state.forge.forgeQuality = existingQuality;
}

function finishForgeMinigame() {
  const game = state.forgeGame;
  game.active = false;
  game.finished = true;
  state.forge.forgeQuality = clamp(game.rating, 0.2, 1);
  renderForge();
}

function startForgeMinigame() {
  const kind = state.forge.kind || "medium";
  state.forgeGame = createForgeGame(kind);
  state.forgeGame.active = true;
  state.forgeGame.finished = false;
  state.forgeGame.rating = clamp(Number(state.forge.forgeQuality ?? 0.5), 0.2, 1);
  renderForge();
}

function handleForgeMinigameAction() {
  const game = state.forgeGame;
  if (!game.active) {
    startForgeMinigame();
    return;
  }

  if (game.mode === "long") {
    const inZone = game.indicator >= 0.38 && game.indicator <= 0.62;
    const distanceFromCenter = Math.abs(game.indicator - 0.5);
    if (inZone) {
      game.hits += 1;
      game.streak += 1;
      game.bestStreak = Math.max(game.bestStreak, game.streak);
      game.progress = game.hits / 3;
      game.rating = clamp(0.58 + game.hits * 0.09 + game.streak * 0.02 - distanceFromCenter * 0.55, 0.2, 1);
      if (game.hits >= 3) {
        finishForgeMinigame();
      }
    } else {
      game.misses += 1;
      game.streak = 0;
      game.rating = clamp(game.rating - 0.07, 0.2, 1);
    }
    renderForge();
    return;
  }

  if (game.mode === "medium") {
    const target = game.pips.find((pip) => !pip.hit);
    if (!target) {
      finishForgeMinigame();
      return;
    }
    const error = Math.abs(game.indicator - target.position);
    if (error <= 0.08) {
      target.hit = true;
      game.hits += 1;
      game.streak += 1;
      game.bestStreak = Math.max(game.bestStreak, game.streak);
      game.progress = game.hits / game.pips.length;
      game.rating = clamp(0.54 + game.hits * 0.11 + game.streak * 0.015 - error * 0.6, 0.2, 1);
      if (game.hits >= game.pips.length) {
        finishForgeMinigame();
      }
    } else {
      game.misses += 1;
      game.streak = 0;
      game.rating = clamp(game.rating - 0.05, 0.2, 1);
    }
    renderForge();
    return;
  }

  const nextPip = game.pips.find((pip) => !pip.hit);
  if (nextPip) {
    nextPip.hit = true;
    game.hits += 1;
    game.streak += 1;
    game.bestStreak = Math.max(game.bestStreak, game.streak);
    game.progress = game.hits / game.pips.length;
    game.rating = clamp(0.46 + game.progress * 0.5 + game.streak * 0.01 - game.elapsed * 0.03, 0.2, 1);
    if (game.hits >= game.pips.length) {
      finishForgeMinigame();
    }
    renderForge();
    return;
  }

  finishForgeMinigame();
}

function updateForgeMinigame(dt) {
  const game = state.forgeGame;
  if (!game.active) {
    return;
  }

  game.elapsed += dt;
  if (game.mode === "long") {
    game.indicator += dt * 0.46 * game.direction;
    if (game.indicator >= 0.94 || game.indicator <= 0.06) {
      game.direction *= -1;
      game.indicator = clamp(game.indicator, 0.06, 0.94);
    }
  } else if (game.mode === "medium") {
    game.indicator += dt * 0.72;
    if (game.indicator > 1.04) {
      game.indicator = -0.04;
    }
  } else {
    game.pips.forEach((pip) => {
      if (pip.hit) {
        return;
      }
      pip.position += pip.velocity * dt;
      if (pip.position >= 0.9 || pip.position <= 0.1) {
        pip.velocity *= -1;
        pip.position = clamp(pip.position, 0.1, 0.9);
      }
    });
  }

  if (game.elapsed >= game.timeLimit) {
    if (game.mode === "short" && !game.finished) {
      game.rating = clamp(0.36 + game.progress * 0.5, 0.2, 1);
    } else if (!game.finished) {
      game.rating = clamp(game.rating - 0.04 * Math.max(1, game.misses), 0.2, 1);
    }
    finishForgeMinigame();
    return;
  }

  if (state.flow.screen === "forge") {
    renderForgeMinigame(currentBlueprint());
  }
}

function syncForgeSelectors() {
  state.forge = normalizeForgeState(state.forge);
  ui.classSelect.value = state.forge.kind;
  populateSelect(ui.frameSelect, frameCatalogForKind(state.forge.kind));
  ui.frameSelect.value = state.forge.frame;
  populateSelect(ui.materialSelect, materialCatalog);
  ui.materialSelect.value = state.forge.material;

  if (state.forge.kind === "medium") {
    populateSelect(ui.edgeSelect, edgeCatalog);
    ui.edgeSelect.disabled = false;
    ui.edgeSelect.value = state.forge.edge;
  } else {
    ui.edgeSelect.innerHTML = `<option value="class-special">Built-In Class Special</option>`;
    ui.edgeSelect.disabled = true;
    ui.edgeSelect.value = "class-special";
  }

  const styleLabel = ui.edgeSelect.closest("label")?.querySelector("span");
  if (styleLabel) {
    styleLabel.textContent = state.forge.kind === "medium" ? "Style" : "Style (Medium Only)";
  }

  ui.weaponName.value = state.forge.name;
  ui.heatRange.value = `${state.forge.heat}`;
}

function setMatchSummary(text) {
  ui.matchSummary.textContent = text;
}

function setStatus(text) {
  ui.hudResult.textContent = text;
}

function inputModeLabel(mode = preferredInputMode()) {
  if (mode === "mobile") {
    return "Mobile";
  }
  if (mode === "controller") {
    return "Controller";
  }
  return "PC";
}

function inferredInputMode() {
  if (state.inputProfile.lastSource === "controller" || state.gamepad.connected) {
    return "controller";
  }
  if (hasCoarsePointer() || state.inputProfile.lastSource === "touch") {
    return "mobile";
  }
  return "pc";
}

function preferredInputMode() {
  return state.inputProfile.preference !== "auto" ? state.inputProfile.preference : inferredInputMode();
}

function controlHintsForMode(mode = preferredInputMode()) {
  if (mode === "mobile") {
    return {
      move: "Tap Left or Right on the fight screen.",
      air: "Tap Jump to hop, or hold Down to crouch.",
      attack: "Tap Strike once.",
      block: "Tap Block as a strike lands to parry, or hold it to block.",
      mobility: "Tap Backstep or Dash once.",
      hit: "Walk close, then tap Strike so the practice bot gets hit."
    };
  }

  if (mode === "controller") {
    return {
      move: "Move the left stick left or right once.",
      air: "Press A to jump, or push down to crouch.",
      attack: "Press RT or X once.",
      block: "Tap LT or LB as a strike lands to parry, or hold it to block.",
      mobility: "Press B or Y once.",
      hit: "Walk close, then press RT or X so the practice bot gets hit."
    };
  }

  return {
    move: "Press A or D once.",
    air: "Press W to jump, or hold S to crouch.",
    attack: "Left click once.",
    block: "Tap right click as a strike lands to parry, or hold it to block.",
    mobility: "Press Q or E once.",
    hit: "Walk close, then left click so the practice bot gets hit."
  };
}

function selectedRivalFriend() {
  const account = currentAccount();
  if (!account || !state.social.rivalFriendId) {
    return null;
  }

  return ensureAccountFriends(account).find((friend) => friend.id === state.social.rivalFriendId) || null;
}

function selectedRivalName() {
  return selectedRivalFriend()?.name || (ui.matchMode.value === "duel" ? "Player 2" : "Bot");
}

function renderControlGuide() {
  const mode = preferredInputMode();
  const rivalName = selectedRivalName();
  let cards = [];

  if (mode === "mobile") {
    cards = [
      {
        kicker: "Selected Device",
        title: "Mobile Fight Deck",
        body: "Use the on-screen buttons under the arena. Left and Right move, Jump hops, Down crouches, Strike attacks, Block defends or parries if timed right, Backstep or Dash are your quick moves, and Pause opens the menu."
      },
      {
        kicker: "Arena Tip",
        title: "Touch play is aim-assisted",
        body: `Mobile aim leans toward ${rivalName}, so focus on spacing and timing instead of dragging the weapon by hand.`
      }
    ];
  } else if (mode === "controller") {
    cards = [
      {
        kicker: "Selected Device",
        title: "Controller Layout",
        body: "Move with left stick or D-pad, aim with right stick, A jumps, RT or X attacks, LT or LB blocks or parries on timing, B dodges, and Y or RB dashes."
      },
      {
        kicker: "Arena Tip",
        title: "Use both sticks",
        body: `The left stick moves your fighter while the right stick points your weapon toward ${rivalName}.`
      }
    ];
  } else {
    cards = [
      {
        kicker: "Selected Device",
        title: "PC Mouse And Keys",
        body: "A and D move, W jumps, S crouches, left click throws a jab, right click blocks or parries, Q backsteps, and E dashes."
      },
      {
        kicker: "Arena Tip",
        title: "Mouse controls the weapon",
        body: `Keep the mouse pointed at ${rivalName} while you move so your jab line and freeform weapon drags stay on target.`
      }
    ];
  }

  ui.controlGuide.innerHTML = cards
    .map(
      (card) => `
        <article class="control-guide-card">
          <span>${card.kicker}</span>
          <strong>${card.title}</strong>
          <p>${card.body}</p>
        </article>
      `
    )
    .join("");
}

function appearsNewPlayer() {
  return !state.tutorial.promptSeen;
}

function setPreferredInputMode(mode, persist = true) {
  state.inputProfile.preference = mode;
  if (mode === "mobile") {
    state.inputProfile.lastSource = "touch";
  } else if (mode === "controller") {
    state.inputProfile.lastSource = "controller";
  } else {
    state.inputProfile.lastSource = "mouse";
  }
  refreshInputProfile();
  if (mode === "mobile" && appearsNewPlayer() && state.flow.introOpen) {
    state.tutorial.offerVisible = true;
    setIntroOpen(false);
    setMenuOpen(true);
    setMatchSummary("It looks like you're new. Start the guided mobile tutorial when you're ready.");
  }
  renderTutorialOffer();
  renderTutorialPanel();
  renderControlGuide();
  if (persist) {
    saveSettingsState();
  }
}

function describeMatchMode(mode) {
  return mode === "duel"
    ? "Local PvP active. Player 2 uses keyboard attacks and defense."
    : "Bot mode active. Fight the AI in a round set.";
}

function matchModeLabel(mode) {
  return mode === "duel" ? "Local PvP" : "Vs Bot";
}

function defaultTutorialProgress() {
  return {
    move: false,
    air: false,
    attack: false,
    block: false,
    mobility: false,
    hit: false
  };
}

function tutorialSteps() {
  const hints = controlHintsForMode();
  return [
    {
      id: "move",
      title: "Move",
      copy: "Start simple. Make your fighter walk once so you can feel left and right movement.",
      hint: hints.move
    },
    {
      id: "air",
      title: "Jump Or Crouch",
      copy: "Now learn vertical movement. You can hop up, or crouch low under attacks.",
      hint: hints.air
    },
    {
      id: "attack",
      title: "Attack",
      copy: "Try one attack button press. This is your main way to hurt the other fighter.",
      hint: hints.attack
    },
    {
      id: "block",
      title: "Block",
      copy: "Hold block for a moment. Blocking helps you stay safe when something swings at you.",
      hint: hints.block
    },
    {
      id: "mobility",
      title: "Quick Move",
      copy: "Now try one quick move. One escapes fast, and one rushes you in fast.",
      hint: hints.mobility
    },
    {
      id: "hit",
      title: "Land A Hit",
      copy: "Finish the lesson by walking into range and landing one clean hit on the practice bot.",
      hint: hints.hit
    }
  ];
}

function syncRoundsOutput() {
  ui.roundsToWinValue.textContent = ui.roundsToWin.value;
}

function setIntroOpen(open) {
  state.flow.introOpen = open;
  ui.introScreen.classList.toggle("hidden", !open);
}

function setScreenFocus(screen) {
  state.flow.screen = screen;
  document.body.classList.toggle("arena-focus", screen === "arena");
  document.body.classList.toggle("forge-focus", screen === "forge");

  if (ui.toggleScreenFocus) {
    ui.toggleScreenFocus.textContent = screen === "forge" ? "Arena View" : "Forge Screen";
  }
}

function renderTutorialOffer() {
  const visible = state.menu.open && !state.flow.introOpen && state.tutorial.offerVisible;
  ui.tutorialOffer.classList.toggle("hidden", !visible);
  ui.deviceChoiceButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.deviceChoice === preferredInputMode());
  });

  ui.tutorialOfferCopy.textContent = `Choose your controls first. Right now the guided tutorial is set for ${inputModeLabel()} and will walk you through the buttons in a safe practice fight.`;
}

function renderTutorialPanel() {
  const tutorial = state.tutorial;
  const visible = tutorial.active;
  ui.tutorialPanel.classList.toggle("hidden", !visible);

  if (!visible) {
    return;
  }

  const entries = tutorialSteps();
  const completedCount = entries.filter((entry) => tutorial.progress[entry.id]).length;
  const allDone = tutorial.completed || completedCount === entries.length;
  const currentStep = allDone ? null : entries[tutorial.stepIndex] || entries[0];

  ui.tutorialTitle.textContent = allDone
    ? "Tutorial Complete"
    : `Step ${tutorial.stepIndex + 1} of ${entries.length}: ${currentStep.title}`;
  ui.tutorialCopy.textContent = allDone
    ? `You cleared the basics on ${inputModeLabel()} controls. The bot can stay here as a safe practice dummy while you keep experimenting.`
    : `Do this now: ${currentStep.copy} ${currentStep.hint}`;
  ui.tutorialChecklist.innerHTML = entries
    .map(
      (entry, index) => `
        <article class="tutorial-check ${tutorial.progress[entry.id] ? "done" : ""} ${!allDone && index === tutorial.stepIndex ? "current" : ""}">
          <span>${tutorial.progress[entry.id] ? "Done" : !allDone && index === tutorial.stepIndex ? "Now" : "Later"}</span>
          <strong>${entry.title}</strong>
          <p>${tutorial.progress[entry.id] ? "Complete." : !allDone && index === tutorial.stepIndex ? entry.hint : "We will explain this step later."}</p>
        </article>
      `
    )
    .join("");
}

function dismissTutorial() {
  state.tutorial.active = false;
  state.tutorial.dismissed = false;
  renderTutorialPanel();
}

function hasCoarsePointer() {
  return Boolean(
    ("ontouchstart" in window) ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia?.("(pointer: coarse)")?.matches
  );
}

function refreshInputProfile() {
  state.inputProfile.touch = preferredInputMode() === "mobile";
  document.body.classList.toggle("touch-device", state.inputProfile.touch);
  if (ui.controlGuide) {
    renderControlGuide();
  }
}

function anyTouchInputActive() {
  return Object.values(state.touchState).some(Boolean);
}

function applyDeadzone(value, threshold = 0.22) {
  return Math.abs(value) >= threshold ? value : 0;
}

function gamepadButtonPressed(pad, index) {
  return Boolean(pad?.buttons?.[index]?.pressed);
}

function pollGamepadState() {
  const pads = typeof navigator.getGamepads === "function" ? Array.from(navigator.getGamepads()).filter(Boolean) : [];
  const pad = pads[0] || null;
  const previousButtons = { ...state.gamepad.buttons };

  if (!pad) {
    state.gamepad.connected = false;
    state.gamepad.index = null;
    state.gamepad.leftX = 0;
    state.gamepad.leftY = 0;
    state.gamepad.rightX = 0;
    state.gamepad.rightY = 0;
    Object.keys(state.gamepad.buttons).forEach((key) => {
      state.gamepad.buttons[key] = false;
    });
    return;
  }

  const leftX = applyDeadzone(pad.axes[0] || 0, 0.24);
  const leftY = applyDeadzone(pad.axes[1] || 0, 0.28);
  const rightX = applyDeadzone(pad.axes[2] || 0, 0.2);
  const rightY = applyDeadzone(pad.axes[3] || 0, 0.2);
  const nextButtons = {
    left: leftX <= -0.4 || gamepadButtonPressed(pad, 14),
    right: leftX >= 0.4 || gamepadButtonPressed(pad, 15),
    up: leftY <= -0.58 || gamepadButtonPressed(pad, 12),
    down: leftY >= 0.4 || gamepadButtonPressed(pad, 13),
    jump: gamepadButtonPressed(pad, 0),
    attack: gamepadButtonPressed(pad, 7) || gamepadButtonPressed(pad, 2),
    block: gamepadButtonPressed(pad, 6) || gamepadButtonPressed(pad, 4),
    dodge: gamepadButtonPressed(pad, 1),
    slide: gamepadButtonPressed(pad, 3) || gamepadButtonPressed(pad, 5),
    menu: gamepadButtonPressed(pad, 9),
    confirm: gamepadButtonPressed(pad, 0)
  };

  state.gamepad.connected = true;
  state.gamepad.index = pad.index;
  state.gamepad.leftX = leftX;
  state.gamepad.leftY = leftY;
  state.gamepad.rightX = rightX;
  state.gamepad.rightY = rightY;
  state.gamepad.buttons = nextButtons;

  if (Object.values(nextButtons).some(Boolean) || Math.hypot(rightX, rightY) > 0.24) {
    state.inputProfile.lastSource = "controller";
  }

  if (nextButtons.menu && !previousButtons.menu) {
    primeAudio();
    playSoundEffect("menu-accept");
    setMenuOpen(!state.menu.open);
  }

  if (state.menu.open && nextButtons.confirm && !previousButtons.confirm) {
    if (!state.match || state.match.phase === "match-over") {
      startMatch();
    }
  }
}

function defaultAccountStats() {
  return {
    setsPlayed: 0,
    setsWon: 0,
    reviewsWritten: 0
  };
}

function ensureAccountStats(account) {
  if (!account) {
    return defaultAccountStats();
  }

  account.stats = {
    ...defaultAccountStats(),
    ...(account.stats || {})
  };
  return account.stats;
}

function ensureAccountFriends(account) {
  if (!account) {
    return [];
  }

  account.friends = Array.isArray(account.friends)
    ? account.friends
        .map((friend) => ({
          ...friend,
          name: String(friend.name || "").trim().slice(0, 12)
        }))
        .filter((friend) => friend.name)
    : [];
  return account.friends;
}

function accountSummaryMeta(account) {
  const stats = ensureAccountStats(account);
  const losses = Math.max(0, stats.setsPlayed - stats.setsWon);
  const friendCount = ensureAccountFriends(account).length;

  return {
    stats,
    line: `${stats.setsWon}W ${losses}L across ${stats.setsPlayed} sets`,
    reviewLine: `${stats.reviewsWritten} local review${stats.reviewsWritten === 1 ? "" : "s"}`,
    friendLine: `${friendCount} friend${friendCount === 1 ? "" : "s"} saved`
  };
}

function defaultCombatStats() {
  return {
    damage: 0,
    hits: 0,
    blocks: 0,
    guardBreaks: 0,
    parries: 0,
    stuns: 0
  };
}

function statsKeyForTeam(team) {
  return team === PLAYER_TEAM ? "player" : "enemy";
}

function statsForTeam(match, team) {
  if (!match) {
    return defaultCombatStats();
  }

  if (!match.stats) {
    match.stats = {
      player: defaultCombatStats(),
      enemy: defaultCombatStats()
    };
  }

  const key = statsKeyForTeam(team);
  if (!match.stats[key]) {
    match.stats[key] = defaultCombatStats();
  }

  return match.stats[key];
}

function saveSettingsState() {
  try {
    window.localStorage.setItem(
      "stickforge-settings",
      JSON.stringify({
        audioEnabled: state.audio.enabled,
        preferredInput: state.inputProfile.preference,
        tutorialPromptSeen: state.tutorial.promptSeen
      })
    );
  } catch (error) {
    // Ignore storage failures; settings can still work for the current session.
  }
}

function renderSoundButtons() {
  const label = `Sound: ${state.audio.enabled ? "On" : "Off"}`;
  [ui.toggleSound, ui.menuToggleSound].forEach((button) => {
    if (!button) {
      return;
    }
    button.textContent = label;
    button.classList.toggle("active", state.audio.enabled);
  });
}

function setAudioEnabled(enabled) {
  state.audio.enabled = enabled;
  saveSettingsState();
  renderSoundButtons();

  if (!enabled && state.audio.masterGain && state.audio.context) {
    const now = state.audio.context.currentTime;
    state.audio.masterGain.gain.cancelScheduledValues(now);
    state.audio.masterGain.gain.setValueAtTime(state.audio.masterGain.gain.value, now);
    state.audio.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.05);
  }
}

function ensureAudioContext() {
  if (!state.audio.enabled) {
    return null;
  }

  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) {
    return null;
  }

  if (!state.audio.context) {
    const context = new AudioContextCtor();
    const masterGain = context.createGain();
    masterGain.gain.value = 0.13;
    masterGain.connect(context.destination);
    state.audio.context = context;
    state.audio.masterGain = masterGain;
  }

  return state.audio.context;
}

function primeAudio() {
  const context = ensureAudioContext();
  if (!context) {
    return;
  }

  if (context.state === "suspended") {
    context.resume().catch(() => {
      // Audio resume can fail until a valid user gesture. Ignore quietly.
    });
  } else if (state.audio.masterGain) {
    const now = context.currentTime;
    state.audio.masterGain.gain.cancelScheduledValues(now);
    state.audio.masterGain.gain.setValueAtTime(state.audio.masterGain.gain.value, now);
    state.audio.masterGain.gain.linearRampToValueAtTime(0.13, now + 0.05);
  }
}

function playSynthTone(frequency, duration, { type = "triangle", gain = 0.03, endFrequency = null } = {}) {
  const context = ensureAudioContext();
  if (!context || context.state !== "running" || !state.audio.masterGain) {
    return;
  }

  const oscillator = context.createOscillator();
  const envelope = context.createGain();
  const now = context.currentTime;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  if (endFrequency) {
    oscillator.frequency.linearRampToValueAtTime(endFrequency, now + duration);
  }

  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.exponentialRampToValueAtTime(gain, now + 0.012);
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(envelope);
  envelope.connect(state.audio.masterGain);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

function playSoundEffect(kind) {
  if (!state.audio.enabled) {
    return;
  }

  if (kind === "jump") {
    playSynthTone(620, 0.09, { type: "triangle", gain: 0.022, endFrequency: 880 });
  } else if (kind === "backstep") {
    playSynthTone(240, 0.12, { type: "sawtooth", gain: 0.02, endFrequency: 150 });
  } else if (kind === "slide") {
    playSynthTone(220, 0.14, { type: "sawtooth", gain: 0.026, endFrequency: 420 });
  } else if (kind === "attack") {
    playSynthTone(180, 0.08, { type: "square", gain: 0.02, endFrequency: 120 });
    playSynthTone(440, 0.05, { type: "triangle", gain: 0.012, endFrequency: 320 });
  } else if (kind === "block") {
    playSynthTone(280, 0.08, { type: "triangle", gain: 0.018, endFrequency: 210 });
  } else if (kind === "hit") {
    playSynthTone(120, 0.1, { type: "square", gain: 0.03, endFrequency: 76 });
    playSynthTone(520, 0.05, { type: "triangle", gain: 0.012, endFrequency: 300 });
  } else if (kind === "guard-break") {
    playSynthTone(110, 0.18, { type: "sawtooth", gain: 0.036, endFrequency: 72 });
    playSynthTone(320, 0.16, { type: "square", gain: 0.018, endFrequency: 180 });
  } else if (kind === "round-start") {
    playSynthTone(360, 0.12, { type: "triangle", gain: 0.018, endFrequency: 420 });
    playSynthTone(540, 0.18, { type: "triangle", gain: 0.02, endFrequency: 640 });
  } else if (kind === "round-win") {
    playSynthTone(420, 0.16, { type: "triangle", gain: 0.018, endFrequency: 520 });
    playSynthTone(620, 0.24, { type: "triangle", gain: 0.02, endFrequency: 760 });
  } else if (kind === "set-win") {
    playSynthTone(300, 0.18, { type: "triangle", gain: 0.018, endFrequency: 420 });
    playSynthTone(520, 0.24, { type: "triangle", gain: 0.022, endFrequency: 680 });
    playSynthTone(760, 0.32, { type: "triangle", gain: 0.024, endFrequency: 920 });
  } else if (kind === "menu-accept") {
    playSynthTone(520, 0.08, { type: "triangle", gain: 0.016, endFrequency: 640 });
  }
}

function triggerImpact(match, { shake = 0, flash = 0, hitstop = 0 } = {}) {
  if (!match) {
    return;
  }
  match.shake = Math.max(match.shake, shake);
  match.flash = Math.max(match.flash, flash);
  match.hitstop = Math.max(match.hitstop, hitstop);
}

function activeMenuWeapon() {
  return weaponById(state.activeWeaponId) || currentBlueprint();
}

function activeMenuRivalWeapon() {
  return weaponById(state.rivalWeaponId) || state.match?.rivalWeapon || null;
}

function renderMenuSummary() {
  const stageConfig = currentStageConfig();
  const account = currentAccount();
  const accountMeta = accountSummaryMeta(account);
  const armoryCount = state.armory.length;
  const rivalName = selectedRivalName();

  ui.menuSummary.innerHTML = `
    <article class="menu-summary-card">
      <span class="menu-summary-kicker">${account ? "Profile" : "Guest Slot"}</span>
      <strong>${account ? account.name : "Guest"}</strong>
      <p>${account ? accountMeta.line : "Sign in to save reviews locally and build a career record."}</p>
      <div class="menu-summary-meta">
        <span>${account ? accountMeta.reviewLine : "No account stats yet"}</span>
        <span>${account ? accountMeta.friendLine : "Guest mode"}</span>
        <span>${inputModeLabel()} controls</span>
      </div>
    </article>
    <article class="menu-summary-card">
      <span class="menu-summary-kicker">Arena Start</span>
      <strong>Fight First</strong>
      <p>Bot matches, PvP sets, and the tutorial all start straight in the arena now.</p>
      <div class="menu-summary-meta">
        <span>${matchModeLabel(ui.matchMode.value)}</span>
        <span>${Number(ui.roundsToWin.value)} rounds to win</span>
        <span>Rival: ${rivalName}</span>
      </div>
    </article>
    <article class="menu-summary-card">
      <span class="menu-summary-kicker">Forge Screen</span>
      <strong>${armoryCount} Saved Loadout${armoryCount === 1 ? "" : "s"}</strong>
      <p>Open the forge screen when you want to rebuild weapons, armory picks, or the stage rules.</p>
      <div class="menu-summary-meta">
        <span>${stageConfig.label}</span>
        <span>${stageConfig.specialty}</span>
      </div>
    </article>
  `;
}

function battlefieldPhaseText() {
  if (!state.match) {
    return "Awaiting next set. Start a fight, jump into the tutorial, or open the forge screen when you want to rebuild.";
  }

  const match = state.match;
  if (match.phase === "intro") {
    return `Round ${match.round} intro. Fighters are squaring up for ${matchModeLabel(match.mode)} on ${currentStageConfig(match.stage.id).label}.`;
  }
  if (match.phase === "fight") {
    return `Round ${match.round} is live. Break guard, manage range, and close the set before the clock expires.`;
  }
  if (match.phase === "round-over") {
    const roundWinner = match.fighters.find((fighter) => fighter.team === match.roundWinner)?.name;
    return roundWinner
      ? `${roundWinner} took the round. The next face-off is loading now.`
      : "Round ended in a draw. The next face-off is loading now.";
  }
  if (match.phase === "match-over") {
    const winner = match.fighters.find((fighter) => fighter.team === match.setWinner)?.name || "Winner";
    return `${winner} owns the set. Start a rematch or head back to the menu to change the build.`;
  }
  return "Awaiting next set.";
}

function renderSetRecap() {
  if (!state.match || state.match.phase !== "match-over") {
    ui.setRecap.classList.add("hidden");
    return;
  }

  const match = state.match;
  const winner = match.fighters.find((fighter) => fighter.team === match.setWinner)?.name || "Winner";
  const loser = match.fighters.find((fighter) => fighter.team !== match.setWinner)?.name || "Rival";

  ui.setRecap.classList.remove("hidden");
  ui.setRecapTitle.textContent = `${winner} took the set`;
  ui.setRecapMode.textContent = matchModeLabel(match.mode);
  ui.setRecapWinner.textContent = winner;
  ui.setRecapScore.textContent = `${match.score.player} - ${match.score.enemy}`;
  ui.setRecapLoadouts.textContent = `${match.playerWeapon.name} vs ${match.rivalWeapon.name}`;
  ui.setRecapStage.textContent = `${currentStageConfig(match.stage.id).label} | ${winner} over ${loser}`;
}

function roundPipMarkup(label, score, total, tone) {
  const pips = Array.from({ length: total }, (_, index) => {
    const classes = ["round-pip"];
    if (index < score) {
      classes.push("filled", tone);
    }
    return `<span class="${classes.join(" ")}"></span>`;
  }).join("");

  return `
    <div class="round-pip-row">
      <span>${label}</span>
      <div class="round-pip-track">${pips}</div>
    </div>
  `;
}

function renderFightFeed() {
  const match = state.match;
  const fallbackEntries = match
    ? [
        {
          label: "Live Feed",
          text: "The set is live. Big hits, blocks, and guard breaks will appear here.",
          tone: "control"
        }
      ]
    : [
        {
          label: "Broadcast Desk",
          text: "Start a set to light up the live fight feed.",
          tone: "control"
        },
        {
          label: "Tip",
          text: "Long reach controls space. Fast builds win scrambles. Heavy builds break guard.",
          tone: ""
        }
      ];

  ui.fightFeed.innerHTML = "";
  (match?.events?.length ? match.events : fallbackEntries).forEach((entry) => {
    const item = document.createElement("article");
    item.className = `fight-feed-entry ${entry.tone || ""}`.trim();
    item.innerHTML = `
      <span>${entry.label}</span>
      <p>${entry.text}</p>
    `;
    ui.fightFeed.append(item);
  });
}

function renderSetStats() {
  const match = state.match;
  const playerName = match?.fighters?.[0]?.name || playerDisplayName();
  const rivalName = match?.fighters?.[1]?.name || selectedRivalName();
  const playerStats = statsForTeam(match, PLAYER_TEAM);
  const enemyStats = statsForTeam(match, ENEMY_TEAM);
  const statCards = [
    {
      label: "Damage",
      value: `${playerStats.damage} - ${enemyStats.damage}`,
      detail: `${playerName} / ${rivalName} total damage`
    },
    {
      label: "Openings",
      value: `${playerStats.hits} - ${enemyStats.hits}`,
      detail: "Clean hit count"
    },
    {
      label: "Blocks",
      value: `${playerStats.blocks} - ${enemyStats.blocks}`,
      detail: "Successful defense checks"
    },
    {
      label: "Guard Breaks",
      value: `${playerStats.guardBreaks} - ${enemyStats.guardBreaks}`,
      detail: "Heavy pressure conversions"
    },
    {
      label: "Parries",
      value: `${playerStats.parries} - ${enemyStats.parries}`,
      detail: "Timed block reversals"
    },
    {
      label: "Stuns",
      value: `${playerStats.stuns} - ${enemyStats.stuns}`,
      detail: "Parries, breaks, and heavy interrupts"
    }
  ];

  ui.setStats.innerHTML = statCards
    .map(
      (card) => `
        <article class="set-stat-card">
          <span>${card.label}</span>
          <strong>${card.value}</strong>
          <p>${card.detail}</p>
        </article>
      `
    )
    .join("");
}

function renderBroadcastDeck() {
  const match = state.match;
  const account = currentAccount();
  const accountMeta = accountSummaryMeta(account);
  const playerWeapon = match?.playerWeapon || weaponById(state.activeWeaponId) || currentBlueprint();
  const rivalWeapon = match?.rivalWeapon || weaponById(state.rivalWeaponId) || null;
  const playerFighter = match?.fighters?.find((fighter) => fighter.team === PLAYER_TEAM) || null;
  const rivalFighter = match?.fighters?.find((fighter) => fighter.team === ENEMY_TEAM) || null;
  const rivalName = rivalFighter?.name || selectedRivalName();
  const stageState = activeStageState();
  const stageConfig = currentStageConfig(stageState.id);
  const roundsToWin = match?.roundsToWin || Number(ui.roundsToWin.value);
  const playerScore = match?.score?.player || 0;
  const enemyScore = match?.score?.enemy || 0;

  let playerForm = "Ready to fight";
  let rivalForm = matchModeLabel(ui.matchMode.value);

  if (match && playerFighter && rivalFighter) {
    if (match.phase === "fight") {
      playerForm = `HP ${Math.ceil(playerFighter.health)} | Stamina ${Math.ceil(playerFighter.stamina)}`;
      rivalForm = `HP ${Math.ceil(rivalFighter.health)} | Stamina ${Math.ceil(rivalFighter.stamina)}`;
    } else if (match.phase === "intro") {
      playerForm = `Round ${match.round} intro`;
      rivalForm = stageConfig.tagline;
    } else if (match.phase === "round-over") {
      playerForm = "Corner reset";
      rivalForm = "Next round loading";
    } else if (match.phase === "match-over") {
      playerForm = match.setWinner === PLAYER_TEAM ? "Set winner" : "Set complete";
      rivalForm = match.setWinner === ENEMY_TEAM ? "Set winner" : "Set complete";
    }
  }

  ui.broadcastPlayerName.textContent = playerFighter?.name || playerDisplayName();
  ui.broadcastPlayerLoadout.textContent = `${playerWeapon.name} | ${weaponRoleTag(playerWeapon)}`;
  ui.broadcastPlayerRecord.textContent = account ? accountMeta.line : "Guest profile";
  ui.broadcastPlayerForm.textContent = playerForm;

  ui.broadcastRivalName.textContent = rivalName;
  ui.broadcastRivalLoadout.textContent = rivalWeapon
    ? `${rivalWeapon.name} | ${weaponRoleTag(rivalWeapon)}`
    : "Auto forge rival";
  ui.broadcastRivalRecord.textContent =
    ui.matchMode.value === "duel"
      ? "Second local fighter"
      : selectedRivalFriend()
        ? "Friend-tag rival"
        : `${stageConfig.label} generated rival`;
  ui.broadcastRivalForm.textContent = rivalForm;

  ui.broadcastStageName.textContent = stageConfig.label;
  ui.broadcastStageNote.textContent = `${stageConfig.tagline} | ${stageConfig.specialty} | First to ${roundsToWin}`;
  ui.broadcastRoundPips.innerHTML = `
    ${roundPipMarkup("P1", playerScore, roundsToWin, "player")}
    ${roundPipMarkup("Rival", enemyScore, roundsToWin, "enemy")}
  `;
}

function renderBroadcastPanels() {
  renderBroadcastDeck();
  renderFightFeed();
  renderSetStats();
}

function pushFightEvent(match, label, text, tone = "") {
  if (!match) {
    return;
  }

  if (!match.events) {
    match.events = [];
  }

  match.events.unshift({
    id: makeId("event"),
    label,
    text,
    tone
  });
  match.events = match.events.slice(0, 4);
  renderBroadcastPanels();
}

function recordActiveAccountMatchResult(won) {
  const account = currentAccount();
  if (!account) {
    return;
  }

  const stats = ensureAccountStats(account);
  stats.setsPlayed += 1;
  if (won) {
    stats.setsWon += 1;
  }
  saveAuthState();
}

function setMenuOpen(open) {
  state.menu.open = open;
  if (open) {
    exitArenaFullscreen();
  }
  ui.mainMenu.classList.toggle("hidden", !open);
  renderMenuSummary();
  renderTutorialOffer();
}

function saveReviewState() {
  try {
    window.localStorage.setItem("stickforge-reviews", JSON.stringify(state.reviews.entries));
  } catch (error) {
    // Ignore storage failures; reviews still work for the current session.
  }
}

function renderReviewList(statusMessage = "") {
  ui.reviewList.innerHTML = "";

  ui.reviewChoices.forEach((button) => {
    button.classList.toggle("active", button.dataset.reviewChoice === state.reviews.selectedChoice);
  });

  ui.reviewStatus.textContent = statusMessage || "Reviews are stored locally in this browser.";

  if (!state.reviews.entries.length) {
    const empty = document.createElement("p");
    empty.className = "arena-hint";
    empty.textContent = "No menu reviews yet. Sign in and leave the first one.";
    ui.reviewList.append(empty);
    return;
  }

  state.reviews.entries.forEach((entry) => {
    const item = document.createElement("article");
    item.className = "feedback-entry";
    item.innerHTML = `
      <span>${entry.choice} | ${entry.accountName}</span>
      <strong>${entry.weapon} | ${entry.mode}</strong>
      <p>${entry.note || "No extra note."}</p>
    `;
    ui.reviewList.append(item);
  });
}

function submitReview() {
  const account = currentAccount();
  const note = ui.reviewNote.value.trim();
  const choice = state.reviews.selectedChoice;
  const weapon = activeMenuWeapon();

  if (!account) {
    renderReviewList("Sign in first so the review has a player name.");
    return;
  }

  if (!choice && !note) {
    renderReviewList("Pick a rating or write a short review first.");
    return;
  }

  state.reviews.entries.unshift({
    id: makeId("review"),
    accountName: account.name,
    choice: choice || "Note",
    note: note.slice(0, 180),
    weapon: weapon.name,
    mode: ui.matchMode.value === "duel" ? "Local PvP" : "Vs Bot",
    createdAt: new Date().toISOString()
  });
  state.reviews.entries = state.reviews.entries.slice(0, 8);
  saveReviewState();
  ensureAccountStats(account).reviewsWritten += 1;
  saveAuthState();

  state.reviews.selectedChoice = "";
  ui.reviewNote.value = "";
  renderReviewList("Review saved locally.");
  renderAccountPanel(`${account.name}'s review was saved locally.`);
}

function openForgeScreen() {
  exitArenaFullscreen();
  setScreenFocus("forge");
  setMenuOpen(false);
  setMatchSummary("Forge screen open. Rebuild your weapon, armory picks, or stage settings here.");
}

async function requestArenaFullscreen() {
  const root = document.documentElement;
  const request =
    root.requestFullscreen ||
    root.webkitRequestFullscreen ||
    root.msRequestFullscreen;

  if (!request || document.fullscreenElement || document.webkitFullscreenElement) {
    return;
  }

  try {
    await request.call(root);
  } catch (error) {
    // Fullscreen can fail when the browser blocks it or the start was not user initiated.
  }
}

async function exitArenaFullscreen() {
  const exit =
    document.exitFullscreen ||
    document.webkitExitFullscreen ||
    document.msExitFullscreen;

  if (!exit || (!document.fullscreenElement && !document.webkitFullscreenElement)) {
    return;
  }

  try {
    await exit.call(document);
  } catch (error) {
    // Ignore blocked exits; the app will still fall back once fullscreen clears.
  }
}

function syncFullscreenState() {
  state.flow.fullscreen = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
  document.body.classList.toggle("arena-fullscreen", state.flow.fullscreen);
}

function clearTutorialState() {
  state.tutorial.active = false;
  state.tutorial.completed = false;
  state.tutorial.dismissed = false;
  state.tutorial.offerVisible = false;
  state.tutorial.stepIndex = 0;
  state.tutorial.progress = defaultTutorialProgress();
  renderTutorialOffer();
  renderTutorialPanel();
}

function launchMatchFromMenu(mode) {
  ui.matchMode.value = mode;
  clearTutorialState();
  setMatchSummary(describeMatchMode(mode));
  startMatch();
}

function startTutorial() {
  state.tutorial.offerVisible = false;
  state.tutorial.promptSeen = true;
  state.tutorial.active = true;
  state.tutorial.completed = false;
  state.tutorial.dismissed = false;
  state.tutorial.stepIndex = 0;
  state.tutorial.progress = defaultTutorialProgress();
  saveSettingsState();
  ui.matchMode.value = "solo";
  ui.roundsToWin.value = "1";
  syncRoundsOutput();
  state.stage.id = "ring";
  state.stage.hazard = false;
  state.stage.pillars = true;
  state.stage.lights = true;
  renderStageSummary();
  updateHudLabels();
  startMatch({ tutorial: true });
  setMatchSummary(`Tutorial live for ${inputModeLabel()} controls. Do the highlighted step only and the practice bot will stay still.`);
  pushFightEvent(
    state.match,
    "Tutorial Coach",
    `This tutorial is calm on purpose. You do not need to win. Just follow the highlighted ${inputModeLabel()} control step.`,
    "control"
  );
  renderTutorialPanel();
}

function updateTutorialProgress(input, match) {
  if (!state.tutorial.active) {
    return;
  }

  const progress = state.tutorial.progress;
  const steps = tutorialSteps();
  const currentStep = steps[state.tutorial.stepIndex];

  if (!currentStep) {
    return;
  }

  let completedStep = false;
  if (currentStep.id === "move") {
    completedStep = input.left || input.right;
  } else if (currentStep.id === "air") {
    completedStep = input.jumpPressed || input.crouch;
  } else if (currentStep.id === "attack") {
    completedStep = input.attackPressed;
  } else if (currentStep.id === "block") {
    completedStep = input.block;
  } else if (currentStep.id === "mobility") {
    completedStep = input.dodgePressed || input.slidePressed;
  } else if (currentStep.id === "hit") {
    completedStep = statsForTeam(match, PLAYER_TEAM).hits > 0;
  }

  if (completedStep) {
    progress[currentStep.id] = true;
    state.tutorial.stepIndex += 1;

    if (state.tutorial.stepIndex >= steps.length) {
      state.tutorial.promptSeen = true;
      state.tutorial.completed = true;
      saveSettingsState();
      setMatchSummary("Tutorial complete. Keep practicing here or open the forge screen when you're ready.");
      pushFightEvent(match, "Tutorial Clear", "You cleared the basics. The arena is yours now.", "impact");
    } else {
      const nextStep = steps[state.tutorial.stepIndex];
      setMatchSummary(`${currentStep.title} complete. Next: ${nextStep.title}.`);
      pushFightEvent(match, "Tutorial Step", `${currentStep.title} complete. Follow the new highlighted step: ${nextStep.title.toLowerCase()}.`, "control");
    }
  }

  renderTutorialPanel();
}

function saveAuthState() {
  try {
    window.localStorage.setItem(
      "stickforge-auth",
      JSON.stringify({
        accounts: state.auth.accounts,
        activeAccountId: state.auth.activeAccountId
      })
    );
  } catch (error) {
    // Ignore storage failures; the session can still run in memory.
  }
}

function currentAccount() {
  return state.auth.accounts.find((account) => account.id === state.auth.activeAccountId) || null;
}

function playerDisplayName() {
  return currentAccount()?.name || "Player 1";
}

function canAccessFeedback() {
  return true;
}

function renderFeedbackInbox() {
  ui.feedbackInbox.innerHTML = "";

  if (!state.feedback.entries.length) {
    const empty = document.createElement("p");
    empty.className = "arena-hint";
    empty.textContent = "No saved feedback yet. Play a set and leave the first arena note.";
    ui.feedbackInbox.append(empty);
    return;
  }

  state.feedback.entries.forEach((entry) => {
    const item = document.createElement("article");
    item.className = "feedback-entry";
    item.innerHTML = `
      <span>${entry.choice} | ${entry.accountName || "Guest"}</span>
      <strong>${entry.stage} | ${entry.mode}</strong>
      <p>${entry.note || "No extra note."}</p>
    `;
    ui.feedbackInbox.append(item);
  });
}

function linkedAccountForFriend(friend) {
  if (friend.accountId) {
    return state.auth.accounts.find((account) => account.id === friend.accountId) || null;
  }

  return state.auth.accounts.find((account) => account.name.toLowerCase() === friend.name.toLowerCase()) || null;
}

function renderFriendList(statusMessage = "") {
  const account = currentAccount();
  ui.friendList.innerHTML = "";
  ui.friendStatus.textContent = statusMessage || (account
    ? "Friends are saved to the signed-in account on this browser."
    : "Sign in to save a local friend list for this browser.");

  if (!account) {
    const empty = document.createElement("p");
    empty.className = "arena-hint";
    empty.textContent = "No active profile. Sign in before adding friends.";
    ui.friendList.append(empty);
    return;
  }

  const friends = ensureAccountFriends(account);
  if (!friends.length) {
    const empty = document.createElement("p");
    empty.className = "arena-hint";
    empty.textContent = "No friends saved yet. Add a local account name or any friend tag.";
    ui.friendList.append(empty);
    return;
  }

  friends.forEach((friend) => {
    const linkedAccount = linkedAccountForFriend(friend);
    const isActiveRival = state.social.rivalFriendId === friend.id;
    const item = document.createElement("article");
    item.className = "feedback-entry";
    item.innerHTML = `
      <span>${linkedAccount ? (linkedAccount.id === state.auth.activeAccountId ? "Online here" : "Local account") : "Friend tag"}</span>
      <strong>${friend.name}</strong>
      <p>${linkedAccount
        ? `${linkedAccount.name} has a saved local account on this browser.`
        : "Saved as a local friend tag for this build."}</p>
    `;

    const actions = document.createElement("div");
    actions.className = "feedback-entry-actions";

    const rivalButton = document.createElement("button");
    rivalButton.className = "ghost-button";
    rivalButton.type = "button";
    rivalButton.textContent = isActiveRival ? "Using As Rival" : "Use As Rival";
    rivalButton.classList.toggle("active", isActiveRival);
    rivalButton.addEventListener("click", () => {
      state.social.rivalFriendId = isActiveRival ? null : friend.id;
      renderFriendList(isActiveRival ? "Rival friend cleared." : `${friend.name} will be used as the rival name.`);
      renderControlGuide();
      renderMenuSummary();
      updateHudLabels();
      renderBattlefield();
    });
    actions.append(rivalButton);

    const removeButton = document.createElement("button");
    removeButton.className = "ghost-button";
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => removeFriend(friend.id));
    actions.append(removeButton);
    item.append(actions);
    ui.friendList.append(item);
  });
}

function renderAccountPanel(statusMessage = "") {
  const account = currentAccount();
  const accountMeta = accountSummaryMeta(account);

  if (account) {
    ui.accountStatus.textContent = `Signed in as ${account.name}. Your reviews, friends, and match record will save locally here.`;
  } else {
    ui.accountStatus.textContent = state.auth.accounts.length
      ? "No account is signed in. Feedback is still open, but friends and reviews save to signed-in players."
      : "No account is signed in. Sign in to save reviews, friends, and local fight history.";
  }

  ui.accountNote.textContent =
    statusMessage ||
    (account
      ? `${accountMeta.line}. ${accountMeta.reviewLine}. ${accountMeta.friendLine}. Accounts are saved locally in this browser.`
      : state.auth.accounts.length
        ? "Accounts are saved locally in this browser. Feedback is open to everyone, and friend lists save to the signed-in profile."
        : "Create a local account to keep your player name, reviews, and friends on this browser.");

  renderFeedbackInbox();
  renderFriendList();
  renderFeedbackPanel();
  renderMenuSummary();
  renderBroadcastPanels();
}

function createAccount() {
  const name = ui.accountName.value.trim().slice(0, 12);
  const passcode = ui.accountPasscode.value.trim();

  if (!name || !passcode) {
    renderAccountPanel("Enter both a name and passcode to create an account.");
    return;
  }

  const duplicate = state.auth.accounts.find((account) => account.name.toLowerCase() === name.toLowerCase());
  if (duplicate) {
    renderAccountPanel("That account name already exists. Log in instead.");
    return;
  }

  const account = {
    id: makeId("account"),
    name,
    passcode,
    stats: defaultAccountStats(),
    friends: [],
    createdAt: new Date().toISOString()
  };

  state.auth.accounts.push(account);
  state.auth.activeAccountId = account.id;
  saveAuthState();
  ui.accountName.value = "";
  ui.accountPasscode.value = "";
  if (state.match) {
    scheduleFeedbackPrompt();
  }
  renderAccountPanel(`${account.name} created and signed in.`);
  renderFriendList(`${account.name}'s friend list is ready.`);
  renderReviewList(`${account.name} can now leave menu reviews.`);
  renderMenuSummary();
}

function loginAccount() {
  const name = ui.accountName.value.trim().slice(0, 12);
  const passcode = ui.accountPasscode.value.trim();

  const account = state.auth.accounts.find(
    (candidate) => candidate.name.toLowerCase() === name.toLowerCase() && candidate.passcode === passcode
  );

  if (!account) {
    renderAccountPanel("Account name or passcode did not match.");
    return;
  }

  state.auth.activeAccountId = account.id;
  saveAuthState();
  ui.accountName.value = "";
  ui.accountPasscode.value = "";
  if (state.match) {
    scheduleFeedbackPrompt();
  }
  renderAccountPanel(`Signed in as ${account.name}.`);
  renderFriendList(`${account.name}'s friend list is loaded.`);
  renderReviewList(`Signed in as ${account.name}.`);
  renderMenuSummary();
}

function logoutAccount() {
  if (state.feedback.promptHandle) {
    window.clearTimeout(state.feedback.promptHandle);
    state.feedback.promptHandle = null;
  }
  state.auth.activeAccountId = null;
  saveAuthState();
  closeFeedbackPanel();
  renderAccountPanel("Signed out. Feedback stays open, but friends and reviews save to signed-in players.");
  renderFriendList("Sign in to manage friends.");
  renderReviewList("Signed out. Reviews need a signed-in player name.");
  renderMenuSummary();
}

function addFriend() {
  const account = currentAccount();
  if (!account) {
    renderFriendList("Sign in before adding friends.");
    return;
  }

  const name = ui.friendName.value.trim().slice(0, 12);
  if (!name) {
    renderFriendList("Type a friend name first.");
    return;
  }

  if (name.toLowerCase() === account.name.toLowerCase()) {
    renderFriendList("You cannot add yourself as a friend.");
    return;
  }

  const linkedAccount = state.auth.accounts.find((candidate) => candidate.name.toLowerCase() === name.toLowerCase()) || null;
  const friends = ensureAccountFriends(account);
  const duplicate = friends.find((friend) =>
    (linkedAccount && friend.accountId === linkedAccount.id) || friend.name.toLowerCase() === name.toLowerCase()
  );

  if (duplicate) {
    renderFriendList(`${name} is already in your friend list.`);
    return;
  }

  friends.unshift({
    id: makeId("friend"),
    name: linkedAccount?.name || name,
    accountId: linkedAccount?.id || null,
    createdAt: new Date().toISOString()
  });
  friends.splice(12);
  ui.friendName.value = "";
  saveAuthState();
  renderFriendList(`${name} added to ${account.name}'s friend list.`);
  renderControlGuide();
  renderMenuSummary();
}

function removeFriend(friendId) {
  const account = currentAccount();
  if (!account) {
    renderFriendList("Sign in before editing friends.");
    return;
  }

  account.friends = ensureAccountFriends(account).filter((friend) => friend.id !== friendId);
  if (state.social.rivalFriendId === friendId) {
    state.social.rivalFriendId = null;
  }
  saveAuthState();
  renderFriendList("Friend removed.");
  renderControlGuide();
  renderMenuSummary();
  updateHudLabels();
}

function renderFeedbackPanel() {
  const feedback = state.feedback;
  ui.feedbackPanel.classList.toggle("hidden", !feedback.visible);
  ui.feedbackChoices.forEach((button) => {
    button.classList.toggle("active", button.dataset.feedbackChoice === feedback.selectedChoice);
  });
}

function openFeedbackPanel(message = "You have been in the arena a bit. Drop a fast note about combat feel, weapon control, or stickman visuals.") {
  const feedback = state.feedback;
  feedback.visible = true;
  feedback.shown = true;
  if (feedback.promptHandle) {
    window.clearTimeout(feedback.promptHandle);
    feedback.promptHandle = null;
  }
  if (feedback.hideHandle) {
    window.clearTimeout(feedback.hideHandle);
  }
  feedback.selectedChoice = "";
  ui.feedbackCopy.textContent = message;
  ui.feedbackStatus.textContent = "Shows for a short time, or you can dismiss it.";
  ui.feedbackNote.value = "";
  feedback.hideHandle = window.setTimeout(() => {
    closeFeedbackPanel();
  }, feedback.visibleDuration * 1000);
  renderFeedbackPanel();
}

function closeFeedbackPanel() {
  state.feedback.visible = false;
  if (state.feedback.hideHandle) {
    window.clearTimeout(state.feedback.hideHandle);
    state.feedback.hideHandle = null;
  }
  renderFeedbackPanel();
}

function storeFeedbackEntry(entry) {
  state.feedback.entries.unshift(entry);
  state.feedback.entries = state.feedback.entries.slice(0, 10);

  try {
    window.localStorage.setItem("stickforge-feedback", JSON.stringify(state.feedback.entries));
  } catch (error) {
    // Ignore storage failures; the in-session list is still usable.
  }
}

function submitFeedback() {
  const note = ui.feedbackNote.value.trim();
  const choice = state.feedback.selectedChoice;
  const accountName = currentAccount()?.name || "Guest";

  if (!choice && !note) {
    ui.feedbackStatus.textContent = "Pick a quick rating or type a short note first.";
    return;
  }

  storeFeedbackEntry({
    choice: choice || "Note only",
    note,
    accountName,
    createdAt: new Date().toISOString(),
    stage: activeStageState().id,
    mode: ui.matchMode.value
  });

  ui.feedbackStatus.textContent = "Feedback saved for this session. Thanks.";
  ui.feedbackCopy.textContent = "Saved locally for this build test.";
  ui.feedbackNote.value = "";
  state.feedback.selectedChoice = "";
  renderFeedbackInbox();
  renderFeedbackPanel();
  if (state.feedback.hideHandle) {
    window.clearTimeout(state.feedback.hideHandle);
  }
  state.feedback.hideHandle = window.setTimeout(() => {
    closeFeedbackPanel();
  }, 2400);
}

function scheduleFeedbackPrompt() {
  const feedback = state.feedback;
  if (feedback.shown || feedback.promptHandle) {
    return;
  }
  feedback.promptHandle = window.setTimeout(() => {
    feedback.promptHandle = null;
    if (!feedback.shown) {
      openFeedbackPanel();
    }
  }, feedback.promptDelay * 1000);
}

function buildWeaponFromForge(forge) {
  const safeForge = normalizeForgeState(forge);
  const frame = frameCatalog[safeForge.frame] || frameCatalog.katana;
  const material = materialCatalog[safeForge.material] || materialCatalog.sunsteel;
  const usesStyle = frame.kind === "medium";
  const edge =
    usesStyle
      ? edgeCatalog[safeForge.edge] || edgeCatalog.duelist
      : {
          label: "Class Ability",
          summary: "This class uses its own built-in special instead of a medium style.",
          damage: 0,
          reach: 0,
          speed: 0,
          cooldown: 0,
          knockback: 0,
          arc: 0,
          weight: 0,
          ability: "Style slot only opens for medium blades."
        };
  const heat = clamp(Number(safeForge.heat ?? safeForge.temper ?? 58), 0, 100);
  const forgeQuality = clamp(Number(safeForge.forgeQuality ?? 0.5), 0.2, 1);
  const forgeDelta = forgeQuality - 0.5;
  const heatScale = heat / 100;
  const classWeightBias = frame.kind === "long" ? 3 : frame.kind === "short" ? -1.4 : 0;
  const weight = clamp(
    Number((frame.weight + material.weight + edge.weight + classWeightBias + heatScale * 6 - forgeDelta * 2.6).toFixed(1)),
    4,
    34
  );
  const weightLoad = Math.max(0, weight - 10);

  const damage = clamp(
    Math.round(frame.damage + material.damage + edge.damage + heatScale * 4 + (frame.kind === "long" ? 2 : 0) + forgeDelta * 6),
    10,
    42
  );
  const reach = clamp(
    Math.round(frame.reach + material.reach + edge.reach + (frame.kind === "long" ? 6 : frame.kind === "short" ? -2 : 0)),
    48,
    142
  );
  const speed = clamp(
    Number((frame.speed + material.speed + edge.speed - weightLoad * 0.012 + (frame.kind === "short" ? 0.06 : 0) + forgeDelta * 0.12).toFixed(2)),
    0.62,
    1.4
  );
  const cooldown = clamp(
    Number((frame.cooldown + material.cooldown + edge.cooldown + weightLoad * 0.008 + (frame.kind === "long" ? 0.06 : 0) - forgeDelta * 0.08).toFixed(2)),
    0.34,
    1.28
  );
  const knockback = clamp(
    Number((frame.knockback + material.knockback + edge.knockback + weight * 0.01 + forgeDelta * 0.12).toFixed(2)),
    0.82,
    1.84
  );
  const arc = clamp(
    Number((frame.arc + edge.arc).toFixed(2)),
    0.74,
    1.84
  );
  const moveScale = clamp(
    Number((frame.moveScale + material.moveScale - weightLoad * 0.008 + (frame.kind === "short" ? 0.04 : 0)).toFixed(2)),
    0.68,
    1.16
  );

  let classText = "solid all-round pressure";
  if (frame.kind === "long") {
    classText = "long-range parry control and delayed heavy punishment";
  } else if (frame.kind === "medium") {
    classText = "solid slash pressure with style-driven specials";
  } else if (frame.kind === "short") {
    classText = "ambush pressure with back-hit damage and stealthy crouches";
  }

  let heatSummary = "Low heat keeps the weapon lighter and easier to control.";
  if (heat >= 70) {
    heatSummary = "High heat makes the weapon heavier and stronger, so hits hurt more but handling gets slower.";
  } else if (heat >= 40) {
    heatSummary = "Mid heat adds extra damage without pushing the weight too far.";
  }

  const abilityParts = [frame.special?.summary, usesStyle ? edge.ability : null].filter(Boolean);
  const abilitySummary = abilityParts.join(" ");
  const forgeSummary =
    forgeQuality >= 0.9
      ? "Masterforged finish: cleaner recovery, lighter handling, and sharper damage."
      : forgeQuality >= 0.76
        ? "Tempered finish: solid stat boosts across handling and bite."
        : forgeQuality >= 0.58
          ? "Field-ready finish: stable enough for live rounds."
          : forgeQuality >= 0.42
            ? "Rough finish: usable, but the edges and timing are a little loose."
            : "Crude finish: heavy mistakes in the forge dragged the weapon down.";
  const backstabBonus =
    frame.kind === "short"
      ? Number((frame.special?.backstabBonus || 1.22).toFixed(2))
      : 1;
  const stealthOpacity =
    frame.kind === "short"
      ? clamp(Number((safeForge.frame === "shiv" ? 0.36 : 0.46).toFixed(2)), 0.3, 0.6)
      : 1;
  const forgeSource = usesStyle ? `${edge.label.toLowerCase()} style` : `${frame.label.toLowerCase()} class special`;

  return {
    id: safeForge.id || makeId("weapon"),
    name: safeForge.name.trim().slice(0, 12) || "NamelessSteel",
    frameId: safeForge.frame,
    frame: frame.label,
    classLabel: frame.classLabel,
    kind: frame.kind,
    materialId: safeForge.material,
    material: material.label,
    edgeId: safeForge.edge,
    edge: edge.label,
    usesStyle,
    heat,
    forgeQuality,
    forgeQualityLabel: forgeRatingLabel(forgeQuality),
    weight,
    damage,
    reach,
    speed,
    cooldown,
    knockback,
    arc,
    moveScale,
    color: material.color,
    frameSummary: frame.summary,
    frameDesign: frame.design,
    materialSummary: material.summary,
    edgeSummary: edge.summary,
    heatSummary,
    forgeSummary,
    styleText: classText,
    abilitySummary,
    specialType: frame.special?.type || "standard",
    executeThreshold: frame.special?.threshold || 0,
    backstabBonus,
    stealthOpacity,
    lore: `${frame.label} with ${material.label.toLowerCase()} and ${forgeSource} at ${heat}% heat, built for ${classText}. ${forgeSummary}`
  };
}

function createRandomEnemyWeapon() {
  const prefixes = ["Iron", "Dread", "Night", "Ash", "War", "Storm", "Cinder", "Ruin"];
  const suffixes = ["fang", "bite", "lance", "edge", "hook", "brand", "talon", "reaver"];
  const frameId = randomChoice(Object.keys(frameCatalog));
  const forge = {
    id: makeId("rival"),
    name: `${randomChoice(prefixes)}${randomChoice(suffixes)}`,
    kind: frameCatalog[frameId]?.kind || "medium",
    frame: frameId,
    material: randomChoice(Object.keys(materialCatalog)),
    edge: randomChoice(Object.keys(edgeCatalog)),
    heat: Math.round(randomRange(20, 92)),
    forgeQuality: randomRange(0.42, 0.92)
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
  ui.heatValue.textContent = `${ui.heatRange.value}%`;
}

function renderForgeBadges(weapon) {
  ui.forgeBadges.innerHTML = `
    <span class="menu-status alt">${weapon.classLabel} Class</span>
    <span class="menu-status alt">${weapon.frameDesign}</span>
    <span class="menu-status alt">${weapon.edge}</span>
    <span class="menu-status alt">${weapon.forgeQualityLabel}</span>
    <span class="menu-status alt">${weapon.weight.toFixed(1)} wt</span>
    <span class="menu-status alt">${weapon.reach} reach</span>
    <span class="menu-status alt">${weapon.specialType.replaceAll("-", " ")}</span>
  `;
}

function weaponRoleTag(weapon) {
  if (weapon.kind === "long") {
    return "Long";
  }
  if (weapon.kind === "short") {
    return "Short";
  }
  return "Medium";
}

function weaponPreviewMarkup(weapon) {
  const shaft = clamp(Math.round(weapon.reach * 0.72), 50, 98);
  const bladeSize = clamp(Math.round(weapon.damage * 1.22), 16, 34);
  const color = weapon.color;
  const handle = "#f3ead8";
  let headMarkup = `
    <path d="M ${shaft} ${36 - bladeSize * 0.46} L ${shaft + bladeSize * 0.82} 36 L ${shaft} ${36 + bladeSize * 0.46} Z" fill="${color}" />
  `;

  if (weapon.frameId === "pike") {
    headMarkup = `
      <path d="M ${shaft} 36 L ${shaft + bladeSize} ${36 - 8} L ${shaft + bladeSize * 0.58} 36 L ${shaft + bladeSize} ${36 + 8} Z" fill="${color}" />
    `;
  } else if (weapon.frameId === "executioner") {
    headMarkup = `
      <path d="M ${shaft - 3} ${36 - bladeSize * 0.7} L ${shaft + bladeSize * 0.78} ${36 - bladeSize * 0.34} L ${shaft + bladeSize * 0.82} ${36 + bladeSize * 0.34} L ${shaft - 3} ${36 + bladeSize * 0.7} Z" fill="${color}" />
    `;
  } else if (weapon.frameId === "karambit") {
    headMarkup = `
      <path d="M ${shaft - 6} ${36 - bladeSize * 0.28} Q ${shaft + bladeSize * 0.46} ${36 - bladeSize * 0.34} ${shaft + bladeSize * 0.24} 36 Q ${shaft + bladeSize * 0.46} ${36 + bladeSize * 0.34} ${shaft - 6} ${36 + bladeSize * 0.28} Z" fill="${color}" />
    `;
  } else if (weapon.frameId === "shiv") {
    headMarkup = `
      <path d="M ${shaft - 4} ${36 - bladeSize * 0.18} L ${shaft + bladeSize * 0.56} 36 L ${shaft - 4} ${36 + bladeSize * 0.18} Z" fill="${color}" />
    `;
  } else if (weapon.frameId === "capesh") {
    headMarkup = `
      <path d="M ${shaft - 4} ${36 - bladeSize * 0.44} Q ${shaft + bladeSize * 0.7} 36 ${shaft - 4} ${36 + bladeSize * 0.44} Q ${shaft + bladeSize * 0.28} 36 ${shaft - 4} ${36 - bladeSize * 0.44} Z" fill="${color}" />
    `;
  } else if (weapon.frameId === "katana") {
    headMarkup = `
      <path d="M ${shaft - 2} ${36 - bladeSize * 0.18} L ${shaft + bladeSize * 0.84} ${36 - bladeSize * 0.08} L ${shaft + bladeSize * 0.9} 36 L ${shaft + bladeSize * 0.84} ${36 + bladeSize * 0.08} L ${shaft - 2} ${36 + bladeSize * 0.18} Z" fill="${color}" />
    `;
  }

  return `
    <svg viewBox="0 0 150 72" class="armory-preview-svg" aria-hidden="true">
      <defs>
        <linearGradient id="armoryGlow-${weapon.id}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.08"></stop>
          <stop offset="100%" stop-color="${color}" stop-opacity="0.42"></stop>
        </linearGradient>
      </defs>
      <rect x="6" y="10" width="138" height="52" rx="18" fill="rgba(255,255,255,0.04)"></rect>
      <rect x="18" y="33" width="${shaft}" height="6" rx="3" fill="${color}"></rect>
      <rect x="10" y="31" width="14" height="10" rx="3" fill="${handle}"></rect>
      <rect x="18" y="28" width="${shaft}" height="16" rx="8" fill="url(#armoryGlow-${weapon.id})"></rect>
      ${headMarkup}
    </svg>
  `;
}

function renderForgeDetails(weapon) {
  const styleTitle = weapon.usesStyle ? "Style" : "Class Special";
  const styleName = weapon.usesStyle ? weapon.edge : `${weapon.classLabel} Built-In`;
  const styleCopy = weapon.usesStyle
    ? `${weapon.edgeSummary} ${weapon.abilitySummary}`
    : `${weapon.classLabel} weapons do not equip styles. ${weapon.abilitySummary}`;
  ui.forgeDetails.innerHTML = `
    <article class="forge-detail-card">
      <span>Weapon Type</span>
      <strong>${weapon.frame} | ${weapon.classLabel}</strong>
      <p>${weapon.frameSummary}</p>
    </article>
    <article class="forge-detail-card">
      <span>${styleTitle}</span>
      <strong>${styleName}</strong>
      <p>${styleCopy}</p>
    </article>
    <article class="forge-detail-card">
      <span>Material</span>
      <strong>${weapon.material}</strong>
      <p>${weapon.materialSummary}</p>
    </article>
    <article class="forge-detail-card">
      <span>Special</span>
      <strong>${weapon.specialType.replaceAll("-", " ")}</strong>
      <p>${weapon.abilitySummary}</p>
    </article>
    <article class="forge-detail-card">
      <span>Heat</span>
      <strong>${weapon.heat}% forge heat</strong>
      <p>${weapon.heatSummary}</p>
    </article>
    <article class="forge-detail-card">
      <span>Forge Finish</span>
      <strong>${weapon.forgeQualityLabel}</strong>
      <p>${weapon.forgeSummary}</p>
    </article>
  `;
}

function renderForgeStats(weapon) {
  const stats = [
    {
      label: "Damage",
      value: weapon.damage,
      display: `${weapon.damage}`,
      max: 42,
      detail: "Higher damage removes more health on a clean hit."
    },
    {
      label: "Weight",
      value: weapon.weight,
      display: weapon.weight.toFixed(1),
      max: 34,
      detail: "More weight hits harder, but it also slows movement and recovery."
    },
    {
      label: "Reach",
      value: weapon.reach,
      display: `${weapon.reach}`,
      max: 142,
      detail: "Higher reach lets you touch the rival from farther away."
    },
    {
      label: "Speed",
      value: Math.round(weapon.speed * 100),
      display: `${Math.round(weapon.speed * 100)}`,
      max: 140,
      detail: weapon.kind === "long" ? "Long weapons stay slower because their main attack is a delayed heavy." : "Higher speed makes the attack start faster."
    },
    {
      label: "Recovery",
      value: Math.round((1.18 - weapon.cooldown) * 100),
      display: `${Math.round((1.18 - weapon.cooldown) * 100)}`,
      max: 82,
      detail: "Higher recovery means you can move again sooner after swinging."
    },
    {
      label: "Push",
      value: Math.round(weapon.knockback * 100),
      display: `${Math.round(weapon.knockback * 100)}`,
      max: 184,
      detail: "Higher push shoves rivals farther and strains their block more."
    },
    {
      label: "Class",
      value: weapon.kind === "long" ? 3 : weapon.kind === "medium" ? 2 : 1,
      display: weapon.classLabel,
      max: 3,
      detail: weapon.kind === "long"
        ? "Long parries are easier and use slower heavy attacks with built-in weapon specials."
        : weapon.kind === "medium"
          ? "Medium stays balanced, uses styles, and turns dash into a pass-through slash."
          : "Short gains back-hit damage, stealthier crouches, and close-range rush specials."
    },
    {
      label: "Finish",
      value: Math.round(weapon.forgeQuality * 100),
      display: `${Math.round(weapon.forgeQuality * 100)}`,
      max: 100,
      detail: "Better forge drill results give small boosts to damage, speed, recovery, and handling."
    }
  ];

  ui.forgeStats.innerHTML = "";
  stats.forEach((stat) => {
    const card = document.createElement("div");
    card.className = "stat-card";
    card.innerHTML = `
      <span>${stat.label}</span>
      <strong>${stat.display}</strong>
      <div class="bar-track">
        <div class="bar-fill" style="width: ${Math.round((stat.value / stat.max) * 100)}%"></div>
      </div>
      <p>${stat.detail}</p>
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
  if (weapon.frameId === "pike") {
    previewCtx.moveTo(shaft, 0);
    previewCtx.lineTo(shaft + bladeSize, -10);
    previewCtx.lineTo(shaft + bladeSize * 0.62, 0);
    previewCtx.lineTo(shaft + bladeSize, 10);
  } else if (weapon.frameId === "executioner") {
    previewCtx.moveTo(shaft - 4, -bladeSize * 0.72);
    previewCtx.lineTo(shaft + bladeSize * 0.84, -bladeSize * 0.18);
    previewCtx.lineTo(shaft + bladeSize * 0.92, 0);
    previewCtx.lineTo(shaft + bladeSize * 0.84, bladeSize * 0.18);
    previewCtx.lineTo(shaft - 4, bladeSize * 0.72);
  } else if (weapon.frameId === "karambit") {
    previewCtx.moveTo(shaft - 8, -bladeSize * 0.26);
    previewCtx.quadraticCurveTo(shaft + bladeSize * 0.54, -bladeSize * 0.36, shaft + bladeSize * 0.24, 0);
    previewCtx.quadraticCurveTo(shaft + bladeSize * 0.54, bladeSize * 0.36, shaft - 8, bladeSize * 0.26);
  } else if (weapon.frameId === "shiv") {
    previewCtx.moveTo(shaft - 8, -bladeSize * 0.18);
    previewCtx.lineTo(shaft + bladeSize * 0.52, 0);
    previewCtx.lineTo(shaft - 8, bladeSize * 0.18);
  } else if (weapon.frameId === "capesh") {
    previewCtx.moveTo(shaft - 4, -bladeSize * 0.44);
    previewCtx.quadraticCurveTo(shaft + bladeSize * 0.72, 0, shaft - 4, bladeSize * 0.44);
    previewCtx.quadraticCurveTo(shaft + bladeSize * 0.28, 0, shaft - 4, -bladeSize * 0.44);
  } else if (weapon.frameId === "katana") {
    previewCtx.moveTo(shaft - 2, -bladeSize * 0.16);
    previewCtx.lineTo(shaft + bladeSize * 0.84, -bladeSize * 0.08);
    previewCtx.lineTo(shaft + bladeSize * 0.92, 0);
    previewCtx.lineTo(shaft + bladeSize * 0.84, bladeSize * 0.08);
    previewCtx.lineTo(shaft - 2, bladeSize * 0.16);
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

  previewCtx.globalAlpha = 0.8;
  previewCtx.fillStyle = "rgba(255, 255, 255, 0.78)";
  previewCtx.font = "600 12px 'Trebuchet MS', sans-serif";
  previewCtx.fillText(`Forge Finish ${weapon.forgeQualityLabel}`, -12, 58);
  previewCtx.restore();
}

function renderForgeMinigame(weapon) {
  const game = state.forgeGame;
  const meta = forgeModeMeta(weapon.kind);
  ui.forgeMinigameTitle.textContent = meta.title;
  ui.forgeMinigameCopy.textContent = meta.copy;
  ui.forgeAction.textContent = meta.action;
  ui.forgeMinigameRating.textContent = weapon.forgeQualityLabel;
  ui.forgeStart.textContent = game.active ? "Restart Drill" : game.finished ? "Run Again" : "Start Forge Drill";
  ui.forgeAction.disabled = false;
  ui.forgeMinigameBar.style.setProperty("--indicator", `${Math.round(game.indicator * 100)}%`);
  ui.forgeMinigameProgress.textContent = `${Math.round((game.active ? game.rating : weapon.forgeQuality) * 100)}%`;
  ui.forgeMinigameTime.textContent = game.active ? `${Math.max(0, game.timeLimit - game.elapsed).toFixed(1)}s` : game.finished ? "Done" : "Ready";
  ui.forgeMinigameStreak.textContent = `x${game.bestStreak || game.streak || 0}`;

  if (weapon.kind === "long") {
    ui.forgeMinigameBar.style.setProperty("--target-start", "38%");
    ui.forgeMinigameBar.style.setProperty("--target-end", "62%");
    ui.forgeMinigameStatus.textContent = game.active
      ? `Hit the gold temper band 3 times. Successes: ${game.hits}/3.`
      : game.finished
        ? `Long forge finished at ${weapon.forgeQualityLabel}. Heavy timing was ${Math.round(weapon.forgeQuality * 100)}% clean.`
        : "No long-blade run yet. Start the drill to temper the heavy edge.";
  } else if (weapon.kind === "medium") {
    ui.forgeMinigameBar.style.setProperty("--target-start", "0%");
    ui.forgeMinigameBar.style.setProperty("--target-end", "0%");
    ui.forgeMinigameStatus.textContent = game.active
      ? `Strike the three rhythm markers in order. Landed: ${game.hits}/${Math.max(game.pips.length, 3)}.`
      : game.finished
        ? `Medium forge finished at ${weapon.forgeQualityLabel}. Slash rhythm landed ${Math.round(weapon.forgeQuality * 100)}% clean.`
        : "No medium-blade run yet. Start the drill to tune the slash rhythm.";
  } else {
    ui.forgeMinigameBar.style.setProperty("--target-start", "0%");
    ui.forgeMinigameBar.style.setProperty("--target-end", "0%");
    ui.forgeMinigameStatus.textContent = game.active
      ? `Pop every spark before time expires. Sparks hit: ${game.hits}/${Math.max(game.pips.length, 5)}.`
      : game.finished
        ? `Short forge finished at ${weapon.forgeQualityLabel}. Spark work landed ${Math.round(weapon.forgeQuality * 100)}% clean.`
        : "No short-blade run yet. Start the drill to sharpen the close-range edge.";
  }

  if (!game.active && !game.finished) {
    ui.forgeMinigameStatus.textContent += " Press Enter or Space to strike once the drill starts.";
  }

  ui.forgeMinigamePips.innerHTML = "";
  game.pips.forEach((pip) => {
    const dot = document.createElement("span");
    dot.className = `forge-pip${pip.hit ? " hit" : ""}`;
    dot.style.left = `${Math.round(pip.position * 100)}%`;
    ui.forgeMinigamePips.append(dot);
  });
}

function renderForge() {
  syncForgeOutputs();
  const weapon = currentBlueprint();
  if (ui.forgeNote) {
    ui.forgeNote.textContent = weapon.usesStyle
      ? `${weapon.classLabel} blades use styles. ${weapon.edge} gives: ${weapon.abilitySummary}`
      : `${weapon.classLabel} blades do not use styles. ${weapon.frame} special: ${weapon.abilitySummary}`;
  }
  ui.weaponTitle.textContent = weapon.name;
  ui.weaponLore.textContent = weapon.lore;
  renderForgeBadges(weapon);
  renderForgeStats(weapon);
  renderForgeDetails(weapon);
  renderForgePreview(weapon);
  renderForgeMinigame(weapon);
  renderMenuSummary();
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
  ui.battlefieldMode.textContent = matchModeLabel(ui.matchMode.value);
  ui.battlefieldPhase.textContent = battlefieldPhaseText();
  ui.battlefieldStyle.textContent = activeWeapon?.styleText || "Balanced duel control";
  ui.battlefieldStage.textContent = currentStageConfig(stageState.id).label;
  ui.battlefieldLoadout.textContent = activeWeapon?.name || "Unarmed";
  renderSetRecap();
  renderBroadcastPanels();
  renderMenuSummary();
  renderControlGuide();
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
    kind: frameCatalog[weapon.frameId]?.kind || weapon.kind || "medium",
    frame: weapon.frameId,
    material: weapon.materialId,
    edge: weapon.edgeId,
    heat: clamp(Number(weapon.heat ?? weapon.temper ?? 58), 0, 100),
    forgeQuality: clamp(Number(weapon.forgeQuality ?? 0.5), 0.2, 1)
  };

  syncForgeSelectors();
  resetForgeMinigame(state.forge.kind, true);
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
    header.innerHTML = `
      <div>
        <strong>${weapon.name}</strong>
        <span class="armory-frame-name">${weapon.frame}</span>
      </div>
      <span class="pill">${weaponRoleTag(weapon)}</span>
    `;

    const showcase = document.createElement("div");
    showcase.className = "armory-showcase";
    showcase.innerHTML = `
      ${weaponPreviewMarkup(weapon)}
      <div class="armory-ribbons">
        ${weapon.id === state.activeWeaponId ? '<span class="armory-badge player">P1 Loadout</span>' : ""}
        ${weapon.id === state.rivalWeaponId ? '<span class="armory-badge rival">Rival Loadout</span>' : ""}
      </div>
    `;

    const meta = document.createElement("div");
    meta.className = "armory-meta";
    meta.innerHTML = `
      <span class="pill">${weapon.classLabel}</span>
      <span class="pill">${weapon.material}</span>
      <span class="pill">${weapon.edge}</span>
      <span class="pill">${weapon.forgeQualityLabel}</span>
      <span class="pill">${weapon.heat}% heat</span>
      <span class="pill">${weapon.reach} reach</span>
    `;

    const statRow = document.createElement("div");
    statRow.className = "armory-stat-row";
    statRow.innerHTML = `
      <div class="armory-stat">
        <span>Speed</span>
        <strong>${Math.round(weapon.speed * 100)}</strong>
      </div>
      <div class="armory-stat">
        <span>Push</span>
        <strong>${Math.round(weapon.knockback * 100)}</strong>
      </div>
      <div class="armory-stat">
        <span>Weight</span>
        <strong>${weapon.weight.toFixed(1)}</strong>
      </div>
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
    card.append(header, showcase, meta, statRow, actions);
    const note = document.createElement("p");
    note.className = "arena-hint";
    note.textContent = weapon.abilitySummary;
    card.append(note);
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
      <div class="stage-card-top">
        <div>
          <h3>${config.label}</h3>
          <p class="stage-tagline">${config.tagline}</p>
        </div>
        <span class="pill">${config.specialty}</span>
      </div>
      <p>${config.description}</p>
      <div class="stage-highlight-grid">
        <div class="stage-highlight">
          <span>Hazard</span>
          <strong>${stageState.hazard ? "Live" : "Safe"}</strong>
        </div>
        <div class="stage-highlight">
          <span>Layout</span>
          <strong>${stageState.pillars ? "Pillars In" : "Open Floor"}</strong>
        </div>
        <div class="stage-highlight">
          <span>Crowd</span>
          <strong>${stageState.lights ? "Lights Up" : "Dimmed"}</strong>
        </div>
      </div>
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
    const presetConfig = currentStageConfig(button.dataset.preset);
    button.style.setProperty("--preset-top", presetConfig.skyTop);
    button.style.setProperty("--preset-glow", `${presetConfig.accent}66`);
    button.innerHTML = `
      <strong>${presetConfig.label}</strong>
      <small>${presetConfig.tagline}</small>
    `;
  });
}

function fighterProfileForWeapon(weapon) {
  const longClass = weapon.kind === "long";
  const shortClass = weapon.kind === "short";
  const mediumClass = weapon.kind === "medium";
  let slideHits = shortClass ? 1 : mediumClass ? 1 : 0;
  if (weapon.specialType === "double-spin-dash") {
    slideHits = 2;
  } else if (weapon.specialType === "triple-rush") {
    slideHits = 3;
  }
  const slideDamageScale =
    weapon.specialType === "cross-cut"
      ? 0.78
      : weapon.specialType === "dash-spin"
        ? 0.68
        : mediumClass
          ? 0.7
          : shortClass
            ? 0.52
            : 0.42;
  return {
    damage: clamp(Math.round(weapon.damage * 0.95 + weapon.arc * 2.2 + (longClass ? 2 : shortClass ? -1 : 0)), 11, 40),
    reach: clamp(Math.round(weapon.reach * 0.78 + (longClass ? 6 : shortClass ? -4 : 0)), 40, 126),
    windup: clamp(0.11 + weapon.cooldown * 0.11 - weapon.speed * 0.025 + (longClass ? 0.06 : shortClass ? -0.02 : 0), 0.07, 0.3),
    active: clamp(0.07 + weapon.arc * 0.03 + (mediumClass ? 0.01 : 0), 0.08, 0.2),
    recover: clamp(0.15 + weapon.cooldown * 0.2 + (longClass ? 0.04 : shortClass ? -0.02 : 0), 0.12, 0.42),
    knockback: clamp(180 + weapon.knockback * 70 + (longClass ? 18 : 0), 190, 340),
    blockDrain: clamp(Math.round(8 + weapon.damage * 0.35 + weapon.weight * 0.35 + (longClass ? 2 : 0)), 10, 28),
    lunge: clamp(48 + weapon.reach * 0.18 + (mediumClass ? 10 : shortClass ? 14 : -4), 48, 96),
    parryWindow: longClass ? 0.22 : weapon.edgeId === "duelist" ? 0.16 : 0.14,
    slideDamage: clamp(Math.round(weapon.damage * slideDamageScale), 6, 22),
    slideHits
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
    walkSpeed: clamp(168 + weapon.speed * 32 + weapon.moveScale * 18 - weapon.weight * 1.2, 132, 220),
    onGround: true,
    health: 100,
    maxHealth: 100,
    stamina: 100,
    maxStamina: 100,
    blocking: false,
    crouching: false,
    hitstun: 0,
    stunTimer: 0,
    invulnerable: 0,
    attack: null,
    attackFlash: 0,
    parryWindow: 0,
    parryFlash: 0,
    dodgeCooldown: 0,
    slideCooldown: 0,
    jumpCooldown: 0,
    manualSwingCooldown: 0,
    dodgeTimer: 0,
    slideTimer: 0,
    slideDir: 0,
    dashSpeed: 0,
    slideHitCooldown: 0,
    slideHitCount: 0,
    prevX: x,
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
      name: playerDisplayName(),
      color: "#89e6dc"
    }),
    spawnFighter({
      team: ENEMY_TEAM,
      control: match.mode === "duel" ? "p2" : "bot",
      weapon: match.rivalWeapon,
      x: STAGE_WIDTH - 220,
      name: selectedRivalName(),
      color: match.mode === "duel" ? "#f0d48b" : "#f4efe7"
    })
  ];
}

function readRawInput(slot) {
  if (slot === "p1") {
    const gamepadButtons = state.gamepad.buttons;
    return {
      left: state.keysDown.has(keyBindings.p1.left) || state.touchState.left || gamepadButtons.left,
      right: state.keysDown.has(keyBindings.p1.right) || state.touchState.right || gamepadButtons.right,
      jump: state.keysDown.has(keyBindings.p1.jump) || state.touchState.up || gamepadButtons.jump || gamepadButtons.up,
      crouch: state.keysDown.has(keyBindings.p1.crouch) || state.touchState.down || gamepadButtons.down,
      attack: state.mouse.left || state.touchState.attack || gamepadButtons.attack,
      block: state.mouse.right || state.touchState.block || gamepadButtons.block,
      dodge: state.keysDown.has(keyBindings.p1.dodge) || state.touchState.dodge || gamepadButtons.dodge,
      slide: state.keysDown.has(keyBindings.p1.slide) || state.touchState.slide || gamepadButtons.slide
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
    blockPressed: raw.block && !previous.block,
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
    return fighter.standHeight;
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

function fighterUsesMouseJab(fighter) {
  return fighter.control === "p1" && preferredInputMode() === "pc" && fighter.weapon.kind !== "long";
}

function attackActionProgress(fighter) {
  if (!fighter.attack) {
    return 0;
  }

  return clamp(
    (fighter.attack.timer - fighter.profile.windup) / Math.max(fighter.profile.active, 0.01),
    0,
    1
  );
}

function fighterAttackLabel(fighter) {
  return fighter.attack?.style === "jab" ? "jab" : "swing";
}

function applyStun(fighter, duration) {
  fighter.stunTimer = Math.max(fighter.stunTimer, duration);
  fighter.blocking = false;
  fighter.crouching = false;
  fighter.attack = null;
}

function weaponPoseForFighter(fighter) {
  const height = currentFighterHeight(fighter);
  const torsoTop = -height * 0.5;
  const shoulderX = fighter.facing * 11;
  const shoulderY = torsoTop * 0.46;
  let weaponAngle = -0.18;
  let weaponLength = fighter.profile.reach * 0.78;
  let baseX = fighter.x + shoulderX;
  let baseY = fighter.y + shoulderY;

  if (fighter.blocking) {
    weaponAngle = -0.92;
  } else if (fighter.attack) {
    const actionWindow = attackActionProgress(fighter);
    if (fighter.attack.style === "jab") {
      const jabWindow = Math.sin(actionWindow * Math.PI);
      weaponAngle = fighter.mouseWeaponAngle;
      weaponLength += 18 + 34 * jabWindow;
      baseX += fighter.facing * (6 + jabWindow * 12);
      baseY += Math.sin(weaponAngle) * (2 + jabWindow * 7);
    } else {
      weaponAngle = lerp(-1.12, 0.48, actionWindow);
      weaponLength += 10 * actionWindow;
    }
  } else if (fighter.slideTimer > 0) {
    weaponAngle = 0.02;
  } else if (fighter.control === "p1") {
    weaponAngle = fighter.mouseWeaponAngle;
  }

  return {
    baseX,
    baseY,
    tipX: baseX + fighter.facing * Math.cos(weaponAngle) * weaponLength,
    tipY: baseY + Math.sin(weaponAngle) * weaponLength * 0.56,
    angle: weaponAngle,
    length: weaponLength
  };
}

function updateMouseWeaponControl(fighter, opponent, dt) {
  if (fighter.control !== "p1") {
    return;
  }

  const height = currentFighterHeight(fighter);
  const torsoTop = -height * 0.5;
  const shoulderX = fighter.x + fighter.facing * 11;
  const shoulderY = fighter.y + torsoTop * 0.46;
  const usingGamepadAim = state.gamepad.connected && Math.hypot(state.gamepad.rightX, state.gamepad.rightY) > 0.24;
  const usingTouchAssist =
    state.inputProfile.touch &&
    !usingGamepadAim &&
    (state.inputProfile.lastSource === "touch" || anyTouchInputActive());
  let localX;
  let localY;

  if (usingGamepadAim) {
    localX = state.gamepad.rightX * 140;
    localY = state.gamepad.rightY * 94;
  } else if (usingTouchAssist && opponent) {
    const opponentHeight = currentFighterHeight(opponent);
    const targetX = opponent.x + opponent.vx * 0.06;
    const targetY = opponent.y - opponentHeight * 0.58;
    localX = (targetX - shoulderX) * fighter.facing;
    localY = targetY - shoulderY;
  } else {
    const stageMouseX = clamp(state.mouse.x - stageOffsetX(), 0, STAGE_WIDTH);
    const stageMouseY = clamp(state.mouse.y - STAGE_TOP, 0, STAGE_HEIGHT);
    localX = (stageMouseX - shoulderX) * fighter.facing;
    localY = stageMouseY - shoulderY;
  }

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
  if (!fighter.alive || !fighter.onGround || fighter.jumpCooldown > 0 || fighter.hitstun > 0 || fighter.stunTimer > 0) {
    return false;
  }

  fighter.vy = -620;
  fighter.onGround = false;
  fighter.jumpCooldown = 0.22;
  fighter.blocking = false;
  fighter.crouching = false;
  addSpark(match, fighter.x, fighter.y - 4, "rgba(255,255,255,0.7)", 6);
  playSoundEffect("jump");
  return true;
}

function performBackstep(fighter, match) {
  if (!fighter.alive || !fighter.onGround || fighter.hitstun > 0 || fighter.stunTimer > 0 || fighter.dodgeCooldown > 0 || fighter.attack) {
    return false;
  }

  fighter.blocking = false;
  fighter.crouching = false;
  fighter.dodgeTimer = 0.22;
  fighter.dodgeCooldown = 0.82;
  fighter.invulnerable = 0.14;
  fighter.vx = -fighter.facing * 360;
  addSpark(match, fighter.x, fighter.y - 8, fighter.weapon.color, 8);
  playSoundEffect("backstep");
  return true;
}

function performLunge(fighter, match) {
  if (!fighter.alive || !fighter.onGround || fighter.hitstun > 0 || fighter.stunTimer > 0 || fighter.slideCooldown > 0 || fighter.attack) {
    return false;
  }

  fighter.blocking = false;
  fighter.crouching = false;
  const mediumStyleBoost =
    fighter.weapon.kind === "medium" && fighter.weapon.edgeId === "shadow"
      ? 0.03
      : fighter.weapon.kind === "medium" && fighter.weapon.edgeId === "cyclone"
        ? 0.02
        : 0;
  fighter.slideTimer = fighter.weapon.kind === "short" ? 0.28 : fighter.weapon.kind === "medium" ? 0.22 + mediumStyleBoost : 0.2;
  fighter.slideCooldown = 0.96;
  fighter.slideDir = fighter.facing;
  fighter.dashSpeed = fighter.weapon.kind === "long" ? 400 : fighter.weapon.kind === "short" ? 470 : 450;
  fighter.slideHitCooldown = 0;
  fighter.slideHitCount = 0;
  const slideSpeedBonus =
    fighter.weapon.specialType === "cross-cut"
      ? 24
      : fighter.weapon.specialType === "triple-rush"
        ? 30
        : fighter.weapon.edgeId === "shadow"
          ? 18
          : 0;
  fighter.dashSpeed += slideSpeedBonus;
  fighter.vx = fighter.facing * fighter.dashSpeed;
  addSpark(match, fighter.x, fighter.y - 10, fighter.weapon.color, 10);
  playSoundEffect("slide");
  return true;
}

function startAttack(fighter) {
  if (
    !fighter.alive ||
    fighter.hitstun > 0 ||
    fighter.stunTimer > 0 ||
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
    connected: false,
    style: fighterUsesMouseJab(fighter) ? "jab" : "swing"
  };
  fighter.attackFlash = 0.18;
  fighter.stamina = clamp(fighter.stamina - 8, 0, fighter.maxStamina);
  fighter.vx += fighter.facing * fighter.profile.lunge * (fighter.attack.style === "jab" ? 0.2 : 0.45);
  playSoundEffect("attack");
  return true;
}

function attemptParry(defender, attacker, match, contactX, contactY) {
  const longParry = defender.weapon.kind === "long";
  if (defender.parryWindow <= 0 || !defender.onGround || (!longParry && !onFrontSide(defender, attacker))) {
    return false;
  }

  const defenderStats = statsForTeam(match, defender.team);
  defender.parryWindow = 0;
  defender.parryFlash = 0.24;
  defender.stamina = clamp(defender.stamina + 10, 0, defender.maxStamina);
  defender.blocking = false;
  applyStun(attacker, 0.42);
  attacker.hitstun = Math.max(attacker.hitstun, 0.1);
  attacker.vx = -attacker.facing * 220;
  attacker.attackFlash = 0.18;
  addSpark(match, contactX, contactY, "#bffcff", 14);
  triggerImpact(match, { shake: 8, flash: 0.12, hitstop: 0.05 });
  playSoundEffect("guard-break");
  setMatchSummary(`${defender.name} parried ${attacker.name} and stunned them.`);
  defenderStats.parries += 1;
  defenderStats.stuns += 1;
  pushFightEvent(match, "Parry", `${defender.name} parried ${attacker.name} clean and left them stunned.`, "control");
  return true;
}

function attemptAttackHit(attacker, defender, match) {
  if (!attacker.attack || attacker.attack.connected || !defender.alive || defender.invulnerable > 0) {
    return;
  }

  const attackHeight = currentFighterHeight(attacker);
  const defenderBox = fighterHitbox(defender);
  const attackPose = weaponPoseForFighter(attacker);
  let overlaps = false;

  if (attacker.attack.style === "jab") {
    overlaps = lineIntersectsHitbox(
      attackPose.baseX,
      attackPose.baseY,
      attackPose.tipX,
      attackPose.tipY,
      expandHitbox(defenderBox, 6)
    );
  } else {
    const attackBottom = attacker.y - (attacker.crouching ? 8 : 18);
    const attackTop = attacker.y - attackHeight + 18;
    const attackRange = attacker.profile.reach + (attacker.slideTimer > 0 ? 12 : 0);
    const attackBox = {
      left: attacker.facing === 1 ? attacker.x + attacker.width * 0.12 : attacker.x - attackRange - attacker.width * 0.12,
      right: attacker.facing === 1 ? attacker.x + attackRange + attacker.width * 0.12 : attacker.x - attacker.width * 0.12,
      top: attackTop,
      bottom: attackBottom
    };

    overlaps =
      attackBox.left < defenderBox.right &&
      attackBox.right > defenderBox.left &&
      attackBox.top < defenderBox.bottom &&
      attackBox.bottom > defenderBox.top;
  }

  if (!overlaps) {
    return;
  }

  attacker.attack.connected = true;
  const attackerStats = statsForTeam(match, attacker.team);
  const defenderStats = statsForTeam(match, defender.team);
  const contactX = attacker.attack.style === "jab" ? attackPose.tipX : (attacker.x + defender.x) / 2;
  const contactY = attacker.attack.style === "jab" ? attackPose.tipY : attacker.y - attackHeight * 0.6;

  if (defender.blocking && defender.onGround && onFrontSide(defender, attacker)) {
    if (attemptParry(defender, attacker, match, contactX, contactY)) {
      attacker.attack = null;
      return;
    }

    defender.stamina = clamp(defender.stamina - attacker.profile.blockDrain, 0, defender.maxStamina);
    defender.vx += attacker.facing * attacker.profile.knockback * 0.18;
    defender.hitstun = Math.max(defender.hitstun, 0.08);
    addSpark(match, contactX, contactY, "#ffffff", 8);
    defenderStats.blocks += 1;

    if (defender.stamina <= 0) {
      const guardBreakDamage = Math.round(attacker.profile.damage * 0.32);
      defender.blocking = false;
      defender.hitstun = 0.28;
      applyStun(defender, 0.22);
      defender.health = clamp(defender.health - guardBreakDamage, 0, defender.maxHealth);
      defender.vx = attacker.facing * attacker.profile.knockback * 0.54;
      triggerImpact(match, { shake: 8, flash: 0.18, hitstop: 0.07 });
      playSoundEffect("guard-break");
      setMatchSummary(`${attacker.name} broke ${defender.name}'s guard.`);
      attackerStats.guardBreaks += 1;
      attackerStats.stuns += 1;
      attackerStats.hits += 1;
      attackerStats.damage += guardBreakDamage;
      pushFightEvent(match, "Guard Break", `${attacker.name} cracked ${defender.name}'s guard for ${guardBreakDamage}.`, "impact");
    } else {
      triggerImpact(match, { shake: 4, flash: 0.08, hitstop: 0.03 });
      playSoundEffect("block");
      setMatchSummary(`${defender.name} blocked the strike.`);
      pushFightEvent(match, "Block", `${defender.name} stopped ${attacker.name}'s ${attacker.weapon.name} ${fighterAttackLabel(attacker)}.`, "control");
    }
    return;
  }

  const damage = clamp(
    Math.round(
      attacker.profile.damage *
        (attacker.slideTimer > 0 ? 1.08 : 1) *
        (attacker.weapon.kind === "short" && !onFrontSide(defender, attacker) ? attacker.weapon.backstabBonus : 1)
    ),
    8,
    42
  );
  const defenderRatio = defender.health / Math.max(defender.maxHealth, 1);
  const executionStrike =
    attacker.weapon.specialType === "heavy-execute" &&
    defenderRatio <= attacker.weapon.executeThreshold &&
    !defender.blocking &&
    onFrontSide(defender, attacker);

  if (executionStrike) {
    defender.health = 0;
    defender.alive = false;
    applyStun(defender, 0.42);
    defender.vx = attacker.facing * attacker.profile.knockback * 0.62;
    defender.attackFlash = 0.2;
    addSpark(match, contactX, defender.y - currentFighterHeight(defender) * 0.62, "#fff3c4", 20);
    triggerImpact(match, { shake: 14, flash: 0.2, hitstop: 0.09 });
    playSoundEffect("guard-break");
    setMatchSummary(`${attacker.name} executed ${defender.name} with ${attacker.weapon.name}.`);
    attackerStats.hits += 1;
    attackerStats.damage += Math.ceil(defender.maxHealth * defenderRatio);
    attackerStats.stuns += 1;
    pushFightEvent(match, "Execution", `${attacker.name} executed ${defender.name} with a dead-on ${attacker.weapon.name} hit.`, "impact");
    return;
  }

  defender.health = clamp(defender.health - damage, 0, defender.maxHealth);
  defender.hitstun = 0.18 + damage * 0.006;
  defender.vx = attacker.facing * attacker.profile.knockback;
  defender.vy = Math.min(defender.vy, -80);
  defender.blocking = false;
  defender.crouching = false;
  defender.attackFlash = 0.16;
  defender.alive = defender.health > 0;
  const quakeHeavy = attacker.weapon.specialType === "quake-heavy" && onFrontSide(defender, attacker);
  const inflictedStun = quakeHeavy ? 0.28 : damage >= 24 || attacker.slideTimer > 0 ? 0.16 : 0;

  if (inflictedStun > 0) {
    applyStun(defender, inflictedStun);
    attackerStats.stuns += 1;
  }

  if (quakeHeavy) {
    defender.vx = attacker.facing * attacker.profile.knockback * 1.16;
    triggerImpact(match, { shake: 13, flash: 0.16, hitstop: 0.07 });
  }

  addSpark(match, contactX, defender.y - currentFighterHeight(defender) * 0.62, attacker.weapon.color, 12);
  triggerImpact(match, { shake: 10, flash: 0.14, hitstop: 0.06 });
  playSoundEffect("hit");
  setMatchSummary(
    inflictedStun > 0
      ? `${attacker.name} landed ${damage} damage and stunned ${defender.name}.`
      : `${attacker.name} landed ${damage} damage with ${attacker.weapon.name}.`
  );
  attackerStats.hits += 1;
  attackerStats.damage += damage;
  pushFightEvent(
    match,
    inflictedStun > 0 ? "Stun Hit" : "Clean Hit",
    inflictedStun > 0
      ? `${attacker.name} landed ${damage} with ${attacker.weapon.name} and stunned ${defender.name}.`
      : `${attacker.name} landed ${damage} with ${attacker.weapon.name}.`,
    "impact"
  );
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
  const attackerStats = statsForTeam(match, attacker.team);
  const defenderStats = statsForTeam(match, defender.team);
  const contactX = currentPose.tipX;
  const contactY = currentPose.tipY;

  if (defender.blocking && defender.onGround && onFrontSide(defender, attacker)) {
    if (attemptParry(defender, attacker, match, contactX, contactY)) {
      return;
    }

    defender.stamina = clamp(defender.stamina - 5, 0, defender.maxStamina);
    defender.vx += attacker.facing * 42;
    defender.hitstun = Math.max(defender.hitstun, 0.05);
    addSpark(match, (currentPose.tipX + defender.x) / 2, currentPose.tipY, "#ffffff", 6);
    triggerImpact(match, { shake: 3, flash: 0.05, hitstop: 0.02 });
    playSoundEffect("block");
    setMatchSummary(`${defender.name} checked the mouse swing.`);
    defenderStats.blocks += 1;
    pushFightEvent(match, "Check", `${defender.name} checked a freeform mouse swing.`, "control");
    return;
  }

  const damage = clamp(Math.round(1 + swingSpeed / 180), 2, 6);
  defender.health = clamp(defender.health - damage, 0, defender.maxHealth);
  defender.hitstun = Math.max(defender.hitstun, 0.08 + damage * 0.01);
  defender.vx += attacker.facing * (44 + damage * 12);
  defender.attackFlash = 0.12;
  defender.alive = defender.health > 0;
  if (damage >= 5) {
    applyStun(defender, 0.1);
    attackerStats.stuns += 1;
  }

  addSpark(match, currentPose.tipX, currentPose.tipY, attacker.weapon.color, 9);
  triggerImpact(match, { shake: 5, flash: 0.08, hitstop: 0.03 });
  playSoundEffect("hit");
  setMatchSummary(`${attacker.name} clipped ${defender.name} with a weapon swing for ${damage}.`);
  attackerStats.hits += 1;
  attackerStats.damage += damage;
  pushFightEvent(match, "Clip", `${attacker.name} clipped ${defender.name} for ${damage} with a mouse swing.`, "impact");
}

function attemptSlideSpecialHit(attacker, defender, match) {
  if (
    attacker.slideTimer <= 0 ||
    attacker.profile.slideHits <= 0 ||
    attacker.slideHitCount >= attacker.profile.slideHits ||
    attacker.slideHitCooldown > 0 ||
    !attacker.alive ||
    !defender.alive ||
    defender.invulnerable > 0
  ) {
    return;
  }

  const attackerBox = expandHitbox(
    fighterHitbox(attacker),
    attacker.weapon.kind === "short"
      ? 26
      : attacker.weapon.specialType === "dash-spin" || attacker.weapon.edgeId === "cyclone"
        ? 26
        : 18
  );
  const defenderBox = fighterHitbox(defender);
  const overlaps =
    attackerBox.left < defenderBox.right &&
    attackerBox.right > defenderBox.left &&
    attackerBox.top < defenderBox.bottom &&
    attackerBox.bottom > defenderBox.top;

  if (!overlaps) {
    return;
  }

  const contactX = (attacker.x + defender.x) / 2;
  const contactY = defender.y - currentFighterHeight(defender) * 0.52;
  const attackerStats = statsForTeam(match, attacker.team);
  const defenderStats = statsForTeam(match, defender.team);

  if (defender.blocking && defender.onGround && onFrontSide(defender, attacker)) {
    if (attemptParry(defender, attacker, match, contactX, contactY)) {
      attacker.slideTimer = 0;
      return;
    }

    const guardDrainScale =
      attacker.weapon.specialType === "cross-cut" || attacker.weapon.edgeId === "breaker"
        ? 0.9
        : 0.7;
    defender.stamina = clamp(defender.stamina - Math.round(attacker.profile.blockDrain * guardDrainScale), 0, defender.maxStamina);
    defender.hitstun = Math.max(defender.hitstun, 0.06);
    defender.vx += attacker.facing * 52;
    attacker.slideHitCooldown = attacker.weapon.specialType === "triple-rush" ? 0.045 : attacker.weapon.kind === "short" ? 0.08 : 0.12;
    attacker.slideHitCount += 1;
    defenderStats.blocks += 1;
    addSpark(match, contactX, contactY, "#ffffff", 8);
    triggerImpact(match, { shake: 4, flash: 0.06, hitstop: 0.02 });
    playSoundEffect("block");
    setMatchSummary(`${defender.name} blocked the dash slash.`);
    pushFightEvent(match, "Dash Block", `${defender.name} stopped ${attacker.name}'s dash slash.`, "control");
    return;
  }

  const defenderRatio = defender.health / Math.max(defender.maxHealth, 1);
  const passedThrough =
    attacker.weapon.specialType === "dash-execute" &&
    (attacker.prevX - defender.x) * (attacker.x - defender.x) <= 0;
  const katanaExecute = attacker.weapon.specialType === "dash-execute" && passedThrough && defenderRatio <= attacker.weapon.executeThreshold;

  if (katanaExecute) {
    defender.health = 0;
    defender.alive = false;
    applyStun(defender, 0.35);
    attacker.slideHitCount += 1;
    attacker.slideHitCooldown = 0.14;
    attackerStats.hits += 1;
    attackerStats.damage += Math.ceil(defender.maxHealth * defenderRatio);
    attackerStats.stuns += 1;
    addSpark(match, contactX, contactY, "#fff3c4", 18);
    triggerImpact(match, { shake: 12, flash: 0.18, hitstop: 0.08 });
    playSoundEffect("guard-break");
    setMatchSummary(`${attacker.name} cut through ${defender.name} for an execution dash.`);
    pushFightEvent(match, "Dash Execute", `${attacker.name}'s dash slash executed ${defender.name}.`, "impact");
    return;
  }

  const baseDamage =
    attacker.profile.slideDamage +
    (attacker.weapon.edgeId === "breaker" ? 2 : 0) +
    (attacker.weapon.specialType === "cross-cut" ? 1 : 0);
  const damage = clamp(
    Math.round(baseDamage * (attacker.weapon.kind === "short" && !onFrontSide(defender, attacker) ? attacker.weapon.backstabBonus : 1)),
    5,
    24
  );

  defender.health = clamp(defender.health - damage, 0, defender.maxHealth);
  defender.vx = attacker.facing * (attacker.weapon.kind === "short" ? 120 : 150);
  defender.hitstun = Math.max(
    defender.hitstun,
    attacker.weapon.kind === "short" ? 0.12 : attacker.weapon.specialType === "cross-cut" ? 0.2 : 0.16
  );
  defender.attackFlash = 0.16;
  defender.alive = defender.health > 0;
  attacker.slideHitCount += 1;
  attacker.slideHitCooldown = attacker.weapon.specialType === "triple-rush" ? 0.045 : attacker.weapon.kind === "short" ? 0.07 : 0.18;

  if (attacker.weapon.kind === "short" || attacker.weapon.frameId === "capesh") {
    applyStun(defender, attacker.weapon.kind === "short" ? 0.08 : 0.12);
    attackerStats.stuns += 1;
  }

  attackerStats.hits += 1;
  attackerStats.damage += damage;
  addSpark(match, contactX, contactY, attacker.weapon.color, attacker.weapon.kind === "short" ? 14 : 12);
  triggerImpact(match, { shake: attacker.weapon.kind === "short" ? 7 : 9, flash: 0.1, hitstop: 0.04 });
  playSoundEffect("hit");
  setMatchSummary(`${attacker.name} landed a ${attacker.weapon.kind === "short" ? "spin" : "dash"} slash for ${damage}.`);
  pushFightEvent(
    match,
    attacker.weapon.kind === "short" ? "Spin Slash" : "Dash Slash",
    `${attacker.name} cut ${defender.name} for ${damage} with ${attacker.weapon.name}.`,
    "impact"
  );
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

  if (fighter.stunTimer > 0) {
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
  if (
    input.blockPressed &&
    fighter.onGround &&
    !fighter.attack &&
    fighter.dodgeTimer <= 0 &&
    fighter.slideTimer <= 0
  ) {
    fighter.parryWindow = fighter.profile.parryWindow;
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
  if (match.tutorial) {
    fighter.moveIntent = 0;
    fighter.aiDecisionTimer = 0;
    fighter.aiIntent.left = false;
    fighter.aiIntent.right = false;
    fighter.aiIntent.block = false;
    fighter.aiIntent.crouch = false;
    fighter.blocking = false;
    fighter.crouching = false;
    return;
  }

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

  if (fighter.hitstun > 0 || fighter.stunTimer > 0) {
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
  fighter.prevX = fighter.x;
  fighter.hitstun = Math.max(0, fighter.hitstun - dt);
  fighter.stunTimer = Math.max(0, fighter.stunTimer - dt);
  fighter.invulnerable = Math.max(0, fighter.invulnerable - dt);
  fighter.attackFlash = Math.max(0, fighter.attackFlash - dt);
  fighter.parryWindow = Math.max(0, fighter.parryWindow - dt);
  fighter.parryFlash = Math.max(0, fighter.parryFlash - dt);
  fighter.dodgeCooldown = Math.max(0, fighter.dodgeCooldown - dt);
  fighter.slideCooldown = Math.max(0, fighter.slideCooldown - dt);
  fighter.jumpCooldown = Math.max(0, fighter.jumpCooldown - dt);
  fighter.manualSwingCooldown = Math.max(0, fighter.manualSwingCooldown - dt);
  fighter.dodgeTimer = Math.max(0, fighter.dodgeTimer - dt);
  fighter.slideTimer = Math.max(0, fighter.slideTimer - dt);
  fighter.dashSpeed = Math.max(0, fighter.dashSpeed - dt * 1180);
  fighter.slideHitCooldown = Math.max(0, fighter.slideHitCooldown - dt);

  if (!fighter.onGround) {
    fighter.blocking = false;
    fighter.crouching = false;
  }

  const movementLocked = fighter.hitstun > 0 || fighter.stunTimer > 0 || !fighter.alive;

  if (fighter.dodgeTimer > 0) {
    fighter.vx = -fighter.facing * 360;
  } else if (fighter.slideTimer > 0) {
    const dashFloor = fighter.weapon.kind === "short" ? 170 : fighter.weapon.kind === "medium" ? 150 : 130;
    fighter.vx = fighter.slideDir * Math.max(fighter.dashSpeed, dashFloor);
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

  if (fighter.hitstun > 0 || fighter.stunTimer > 0) {
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

  updateMouseWeaponControl(fighter, opponent, dt);
  updateAttackState(fighter, opponent, match, dt);
  attemptMouseSwingHit(fighter, opponent, match, dt);
  attemptSlideSpecialHit(fighter, opponent, match);
}

function resolveFighterSpacing(leftFighter, rightFighter, match) {
  const passThroughSlash =
    (leftFighter.weapon.kind === "medium" && leftFighter.slideTimer > 0) ||
    (rightFighter.weapon.kind === "medium" && rightFighter.slideTimer > 0);
  const minimumGap = passThroughSlash ? 8 : leftFighter.width + rightFighter.width + 20;
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
  triggerImpact(match, { shake: 14, flash: 0.18, hitstop: 0.08 });
  addSpark(match, STAGE_WIDTH / 2, GROUND_Y - 90, winnerTeam === PLAYER_TEAM ? "#89e6dc" : "#f0d48b", 24);
  playSoundEffect("set-win");

  const winnerName = match.fighters.find((fighter) => fighter.team === winnerTeam)?.name || "Winner";
  if (!match.accountRecorded) {
    recordActiveAccountMatchResult(winnerTeam === PLAYER_TEAM);
    match.accountRecorded = true;
  }

  setStatus(`${winnerName} wins`);
  setMatchSummary(reason || `${winnerName} wins the set.`);
  pushFightEvent(match, "Final", `${winnerName} closed the set on ${currentStageConfig(match.stage.id).label}.`, "impact");
  updateHudLabels();
}

function finishRound(match, winner, reason) {
  if (match.phase !== "fight") {
    return;
  }

  match.phase = "round-over";
  match.phaseTimer = 2.25;
  match.roundWinner = winner ? winner.team : null;
  triggerImpact(match, { shake: 12, flash: 0.16, hitstop: 0.07 });

  if (winner) {
    if (winner.team === PLAYER_TEAM) {
      match.score.player += 1;
    } else {
      match.score.enemy += 1;
    }
    addSpark(match, winner.x, winner.y - 70, winner.color, 18);
    playSoundEffect("round-win");
    setStatus(`${winner.name} wins`);
  } else {
    playSoundEffect("block");
    setStatus("Draw");
  }

  setMatchSummary(reason || (winner ? `${winner.name} took round ${match.round}.` : `Round ${match.round} ended in a draw.`));
  pushFightEvent(
    match,
    winner ? "Round Result" : "Round Draw",
    winner ? `${winner.name} took round ${match.round}. Score is ${match.score.player}-${match.score.enemy}.` : `Round ${match.round} ended even. Next face-off loading.`,
    winner ? "impact" : "control"
  );
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
  match.hitstop = 0;
  match.flash = 0;
  autoFace(match.fighters[0], match.fighters[1]);
  autoFace(match.fighters[1], match.fighters[0]);
  setStatus(`Round ${match.round}`);
  setMatchSummary(`Round ${match.round}. First to ${match.roundsToWin} round wins takes the set.`);
  pushFightEvent(match, "Round Call", `Round ${match.round} is loading. ${currentStageConfig(match.stage.id).specialty}.`, "control");
  updateHudLabels();
}

function createMatch({ tutorial = false } = {}) {
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
    accountRecorded: false,
    tutorial,
    shake: 0,
    hazardTick: 0,
    events: [],
    stats: {
      player: defaultCombatStats(),
      enemy: defaultCombatStats()
    },
    hitstop: 0,
    flash: 0
  };
}

function startMatch({ tutorial = false } = {}) {
  if (!tutorial) {
    clearTutorialState();
  }
  state.feedback.shown = false;
  closeFeedbackPanel();
  primeAudio();
  playSoundEffect("menu-accept");
  requestArenaFullscreen();
  state.uiPulse = 0;
  setScreenFocus("arena");
  state.match = createMatch({ tutorial });
  primeInputMemory();
  resetRound(state.match);
  pushFightEvent(
    state.match,
    "Fight Night",
    `${currentStageConfig(state.match.stage.id).label} is live. First to ${state.match.roundsToWin} round wins takes the set.`,
    "control"
  );
  updateHudLabels();
  setMenuOpen(false);
  scheduleFeedbackPrompt();
  renderTutorialPanel();
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
  match.flash = Math.max(0, match.flash - dt * 1.8);

  if (match.hitstop > 0) {
    match.hitstop = Math.max(0, match.hitstop - dt);
    return;
  }

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
      triggerImpact(match, { flash: 0.08, hitstop: 0.03 });
      playSoundEffect("round-start");
      setStatus("Fight");
      setMatchSummary(`Round ${match.round} is live. Break guard, manage range, and close the set.`);
      pushFightEvent(match, "Fight", `Round ${match.round} starts now. ${match.fighters[0].name} and ${match.fighters[1].name} are live.`, "impact");
    }
    return;
  }

  if (match.phase === "fight") {
    match.timer = Math.max(0, match.timer - dt);

    applyHumanControl(player, p1Input, match);
    updateTutorialProgress(p1Input, match);
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
        finishMatch(match, PLAYER_TEAM, `${player.name} wins the set.`);
      } else if (match.score.enemy >= match.roundsToWin) {
        finishMatch(match, ENEMY_TEAM, `${enemy.name} wins the set.`);
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
  const pulse = (Math.sin(performance.now() * 0.0024) + 1) * 0.5;

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

  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.font = "700 34px Georgia, serif";
  const headerText = `${config.label.toUpperCase()} ARENA`;
  ctx.fillText(headerText, canvas.width / 2 - ctx.measureText(headerText).width / 2, STAGE_TOP + 110);

  [offsetX + 126, offsetX + STAGE_WIDTH - 168].forEach((bannerX, index) => {
    const bannerColor = index === 0 ? `${config.accent}aa` : `${config.crowd}88`;
    ctx.fillStyle = "rgba(0,0,0,0.24)";
    ctx.fillRect(bannerX - 4, STAGE_TOP + 38, 8, 110);
    ctx.fillStyle = bannerColor;
    ctx.beginPath();
    ctx.moveTo(bannerX - 26, STAGE_TOP + 52);
    ctx.lineTo(bannerX + 26, STAGE_TOP + 52);
    ctx.lineTo(bannerX + 20, STAGE_TOP + 128);
    ctx.lineTo(bannerX, STAGE_TOP + 146);
    ctx.lineTo(bannerX - 20, STAGE_TOP + 128);
    ctx.closePath();
    ctx.fill();
  });

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

  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let i = 1; i < 12; i += 1) {
    const x = offsetX + i * (STAGE_WIDTH / 12);
    ctx.beginPath();
    ctx.moveTo(x, floorTop + 10);
    ctx.lineTo(x, floorTop + FLOOR_THICKNESS);
    ctx.stroke();
  }

  const floorGlow = ctx.createLinearGradient(0, floorTop - 20, 0, floorTop + 90);
  floorGlow.addColorStop(0, `${config.accent}${stageState.lights ? "26" : "10"}`);
  floorGlow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = floorGlow;
  ctx.fillRect(offsetX, floorTop - 20, STAGE_WIDTH, 110);

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

    ctx.fillStyle = `${config.hazard}${pulse > 0.5 ? "88" : "66"}`;
    for (let i = 0; i < 4; i += 1) {
      const sparkX = centerX - 12 + i * 8;
      const sparkHeight = 10 + pulse * 18 + (i % 2) * 6;
      ctx.beginPath();
      ctx.moveTo(sparkX, floorTop - 4);
      ctx.lineTo(sparkX + 4, floorTop - sparkHeight);
      ctx.lineTo(sparkX + 8, floorTop - 6);
      ctx.closePath();
      ctx.fill();
    }
  }
}

function roundedRectPath(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + width - safeRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  context.lineTo(x + width, y + height - safeRadius);
  context.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  context.lineTo(x + safeRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(x, y, x + safeRadius, y);
  context.closePath();
}

function fillRoundedRect(context, x, y, width, height, radius, fillStyle) {
  roundedRectPath(context, x, y, width, height, radius);
  context.fillStyle = fillStyle;
  context.fill();
}

function drawArenaOverlay(stageId) {
  const config = currentStageConfig(stageId);
  const time = performance.now() * 0.001;

  const vignette = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 140, canvas.width / 2, canvas.height / 2, 520);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.34)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 4; i += 1) {
    const lightX = 140 + i * 220;
    const beam = ctx.createLinearGradient(lightX, 60, lightX, 260);
    beam.addColorStop(0, `${config.crowd}20`);
    beam.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(lightX - 46, 60);
    ctx.lineTo(lightX + 46, 60);
    ctx.lineTo(lightX + 90, 260);
    ctx.lineTo(lightX - 90, 260);
    ctx.closePath();
    ctx.fill();
  }

  if (stageId === "foundry" || stageId === "crossfire") {
    for (let i = 0; i < 14; i += 1) {
      const drift = (time * 28 + i * 37) % (canvas.width + 80);
      const emberX = ((i * 93 + drift) % (canvas.width + 80)) - 40;
      const emberY = 360 - ((time * 42 + i * 19) % 180);
      const emberSize = 1.5 + (i % 3);
      ctx.fillStyle = stageId === "foundry" ? "rgba(255,168,96,0.22)" : "rgba(255,208,124,0.18)";
      ctx.beginPath();
      ctx.arc(emberX, emberY, emberSize, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (stageId === "ring") {
    for (let i = 0; i < 10; i += 1) {
      const shimmerX = 120 + i * 112;
      const shimmerY = 118 + Math.sin(time * 1.3 + i) * 10;
      ctx.fillStyle = "rgba(207,216,255,0.08)";
      ctx.beginPath();
      ctx.arc(shimmerX, shimmerY, 2 + (i % 2), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = "#ffffff";
  for (let y = 90; y < canvas.height; y += 6) {
    ctx.fillRect(0, y, canvas.width, 1);
  }
  ctx.restore();
}

function drawHealthBar(x, y, width, ratio, fill, reverse = false) {
  fillRoundedRect(ctx, x, y, width, 18, 9, "rgba(0,0,0,0.45)");
  fillRoundedRect(ctx, x + 2, y + 2, width - 4, 14, 7, "rgba(255,255,255,0.08)");

  const filledWidth = Math.round((width - 4) * clamp(ratio, 0, 1));
  if (reverse) {
    fillRoundedRect(ctx, x + width - 2 - filledWidth, y + 2, filledWidth, 14, 7, fill);
  } else {
    fillRoundedRect(ctx, x + 2, y + 2, filledWidth, 14, 7, fill);
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

function drawStatusPill(x, y, label, fill, reverse = false) {
  const width = 62;
  const pillX = reverse ? x - width : x;
  fillRoundedRect(ctx, pillX, y, width, 22, 11, "rgba(0,0,0,0.4)");
  fillRoundedRect(ctx, pillX + 2, y + 2, width - 4, 18, 9, fill);
  ctx.fillStyle = "#0f1016";
  ctx.font = "700 11px 'Trebuchet MS', sans-serif";
  const labelWidth = ctx.measureText(label).width;
  ctx.fillText(label, pillX + width / 2 - labelWidth / 2, y + 15);
}

function drawFighter(fighter) {
  const stageX = stageOffsetX() + fighter.x;
  const stageFloorY = STAGE_TOP + fighter.y + 10;
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
  const attackProgress = attackActionProgress(fighter);
  const jabAttack = fighter.attack?.style === "jab";

  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.28)";
  ctx.beginPath();
  ctx.ellipse(stageX, STAGE_TOP + GROUND_Y + 18, 24 * shadowScale, 8 * shadowScale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const torsoTop = -height * 0.5;
  const headRadius = 8.6;
  const headCenterX = fighter.facing * 1;
  const headCenterY = torsoTop - headRadius + 9;
  const neckY = headCenterY + headRadius - 5.4;
  const shoulderY = torsoTop * 0.46;
  let frontHandX = fighter.facing * (19 + walkAmount * 5);
  const rearHandX = -fighter.facing * (12 + walkAmount * 4);
  let frontHandY =
    shoulderY + (fighter.blocking ? -15 : fighter.attack || fighter.slideTimer > 0 ? 1 : 22 + armSwing * 0.26);
  const rearHandY = shoulderY + 22 - armSwing * 0.22;
  let frontElbowX = fighter.facing * 6.5;
  let frontElbowY = shoulderY + (fighter.blocking ? -9 : 12);
  const rearElbowX = -fighter.facing * 5.5;
  const rearElbowY = shoulderY + 12;
  const frontKneeX = fighter.facing * (9 + walkAmount * 3.5);
  const rearKneeX = -fighter.facing * (6 + walkAmount * 2.5);
  const frontKneeY = fighter.slideTimer > 0 ? 18 : 22 + stride * 0.16;
  const rearKneeY = fighter.slideTimer > 0 ? 20 : 22 - stride * 0.16;
  const frontFootX = fighter.facing * (17 + walkAmount * 8);
  const rearFootX = -fighter.facing * (11 + walkAmount * 6);
  const frontFootY = fighter.slideTimer > 0 ? 46 : 46 + stride * 0.48;
  const rearFootY = fighter.slideTimer > 0 ? 48 : 46 - stride * 0.48;
  const footContactY = Math.max(frontFootY, rearFootY);
  const lean =
    fighter.slideTimer > 0 ? fighter.facing * 0.1 : fighter.hitstun > 0 || fighter.stunTimer > 0 ? -fighter.facing * 0.18 : 0;
  const weaponRenderBaseX = weaponPose.baseX - fighter.x;
  const weaponRenderBaseY = weaponPose.baseY - fighter.y;
  const weaponTipX = weaponPose.tipX - fighter.x;
  const weaponTipY = weaponPose.tipY - fighter.y;
  const crouchFade = fighter.weapon.kind === "short" && fighter.crouching ? fighter.weapon.stealthOpacity : 1;

  if (jabAttack) {
    frontHandX = weaponRenderBaseX;
    frontHandY = weaponRenderBaseY;
    frontElbowX = fighter.facing * 4 + (frontHandX - fighter.facing * 4) * (0.42 + attackProgress * 0.16);
    frontElbowY = shoulderY + (frontHandY - shoulderY) * (0.48 + attackProgress * 0.1);
  }

  ctx.save();
  ctx.translate(stageX, stageFloorY - footContactY + bob + bodyLift);
  ctx.rotate(lean);
  ctx.globalAlpha = crouchFade;

  const drawBodyStroke = () => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(fighter.facing * 1.2, torsoTop * 0.62);
    ctx.lineTo(headCenterX * 0.08, neckY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, shoulderY);
    ctx.lineTo(frontElbowX, frontElbowY);
    ctx.lineTo(frontHandX, frontHandY);
    ctx.moveTo(0, shoulderY);
    ctx.lineTo(rearElbowX, rearElbowY);
    ctx.lineTo(rearHandX, rearHandY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(frontKneeX, frontKneeY);
    ctx.lineTo(frontFootX, frontFootY);
    ctx.moveTo(0, 0);
    ctx.lineTo(rearKneeX, rearKneeY);
    ctx.lineTo(rearFootX, rearFootY);
    ctx.stroke();
  };

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(0,0,0,0.34)";
  ctx.lineWidth = 8.2;
  drawBodyStroke();

  ctx.strokeStyle = fighter.color;
  ctx.lineWidth = 4.5;
  drawBodyStroke();

  ctx.fillStyle = "rgba(0,0,0,0.32)";
  ctx.beginPath();
  ctx.arc(headCenterX, headCenterY + 1.5, headRadius + 2.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = fighter.color;
  ctx.beginPath();
  ctx.arc(headCenterX, headCenterY, headRadius, 0, Math.PI * 2);
  ctx.fill();

  if (fighter.parryFlash > 0) {
    ctx.strokeStyle = `rgba(191,252,255,${fighter.parryFlash * 1.8})`;
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.arc(fighter.facing * 12, torsoTop * 0.52, 23, -1.2, 1.25);
    ctx.stroke();
  }

  if (fighter.stunTimer > 0) {
    for (let i = 0; i < 3; i += 1) {
      const orbit = performance.now() * 0.008 + i * 2.09;
      const starX = headCenterX + Math.cos(orbit) * 14;
      const starY = headCenterY - 12 + Math.sin(orbit) * 5;
      ctx.fillStyle = i === 1 ? "#fff1a8" : "#ffd062";
      ctx.beginPath();
      ctx.arc(starX, starY, 2.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (fighter.attackFlash > 0) {
    ctx.fillStyle = `rgba(255,255,255,${fighter.attackFlash * 0.75})`;
    ctx.beginPath();
    ctx.arc(0, torsoTop * 0.64, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  if (fighter.attack || fighter.slideTimer > 0) {
    const trail = ctx.createLinearGradient(weaponRenderBaseX, weaponRenderBaseY, weaponTipX, weaponTipY);
    trail.addColorStop(0, "rgba(255,255,255,0)");
    trail.addColorStop(1, `${fighter.weapon.color}55`);
    ctx.strokeStyle = trail;
    ctx.lineWidth = fighter.attack ? (jabAttack ? 11 : 15) : 11;
    ctx.beginPath();
    ctx.moveTo(weaponRenderBaseX, weaponRenderBaseY);
    ctx.lineTo(weaponTipX, weaponTipY);
    ctx.stroke();
  }

  if (fighter.slideTimer > 0 && fighter.weapon.kind !== "long") {
    ctx.strokeStyle = fighter.weapon.kind === "short" ? `${fighter.weapon.color}55` : "rgba(255,255,255,0.28)";
    ctx.lineWidth = fighter.weapon.kind === "short" ? 7 : 6;
    ctx.beginPath();
    ctx.arc(0, torsoTop * 0.1, fighter.weapon.kind === "short" ? 26 : 22, -1.05, 1.55);
    ctx.stroke();

    if (fighter.weapon.frameId === "capesh") {
      ctx.beginPath();
      ctx.arc(0, torsoTop * 0.16, 34, -0.8, 2.35);
      ctx.stroke();
    }
  }

  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(weaponRenderBaseX, weaponRenderBaseY);
  ctx.lineTo(weaponTipX, weaponTipY);
  ctx.stroke();

  ctx.strokeStyle = fighter.weapon.color;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(weaponRenderBaseX, weaponRenderBaseY);
  ctx.lineTo(weaponTipX, weaponTipY);
  ctx.stroke();

  const tipRadius = fighter.weapon.kind === "long" ? 10 : fighter.weapon.kind === "short" ? 7 : 8;
  const tipCoreRadius = fighter.weapon.kind === "long" ? 6 : fighter.weapon.kind === "short" ? 4 : 5;
  ctx.fillStyle = `${fighter.weapon.color}44`;
  ctx.beginPath();
  ctx.arc(weaponTipX, weaponTipY, tipRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = fighter.weapon.color;
  ctx.beginPath();
  ctx.arc(weaponTipX, weaponTipY, tipCoreRadius, 0, Math.PI * 2);
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
  const playerLabel = `${player.name.toUpperCase()}  ${match.playerWeapon.name.toUpperCase()}`;
  const enemyLabel = `${enemy.name.toUpperCase()}  ${match.rivalWeapon.name.toUpperCase()}`;
  const timerText = `${Math.ceil(match.timer)}`;

  fillRoundedRect(ctx, 24, 10, 348, 56, 20, "rgba(0,0,0,0.34)");
  fillRoundedRect(ctx, canvas.width - 372, 10, 348, 56, 20, "rgba(0,0,0,0.34)");
  fillRoundedRect(ctx, canvas.width / 2 - 58, 8, 116, 64, 24, "rgba(0,0,0,0.44)");
  fillRoundedRect(ctx, canvas.width / 2 - 50, 14, 100, 52, 20, "rgba(255,255,255,0.06)");

  ctx.fillStyle = "#f4efe7";
  ctx.font = "700 15px 'Trebuchet MS', sans-serif";
  ctx.fillText(playerLabel, 42, 30);
  ctx.fillText(enemyLabel, canvas.width - 42 - ctx.measureText(enemyLabel).width, 30);

  drawHealthBar(40, 38, 316, player.health / player.maxHealth, "#89e6dc");
  drawHealthBar(canvas.width - 356, 38, 316, enemy.health / enemy.maxHealth, "#f0d48b", true);

  ctx.fillStyle = "#d7c9b7";
  ctx.font = "700 28px Georgia, serif";
  ctx.fillText(timerText, canvas.width / 2 - ctx.measureText(timerText).width / 2, 44);

  ctx.fillStyle = "rgba(255,255,255,0.68)";
  ctx.font = "600 12px 'Trebuchet MS', sans-serif";
  const roundLabel = `ROUND ${match.round}  |  ${matchModeLabel(match.mode)}`;
  ctx.fillText(roundLabel, canvas.width / 2 - ctx.measureText(roundLabel).width / 2, 60);

  drawRoundPips(48, 74, match.score.player, match.roundsToWin, "#89e6dc");
  drawRoundPips(canvas.width - 48, 74, match.score.enemy, match.roundsToWin, "#f0d48b", true);

  ctx.fillStyle = "rgba(255,255,255,0.6)";
  fillRoundedRect(ctx, 40, 61, 316 * (player.stamina / player.maxStamina), 5, 3, "rgba(255,255,255,0.72)");
  fillRoundedRect(
    ctx,
    canvas.width - 40 - 316 * (enemy.stamina / enemy.maxStamina),
    61,
    316 * (enemy.stamina / enemy.maxStamina),
    5,
    3,
    "rgba(255,255,255,0.72)"
  );

  if (player.parryWindow > 0) {
    drawStatusPill(40, 80, "PARRY", "#bffcff");
  } else if (player.stunTimer > 0) {
    drawStatusPill(40, 80, "STUN", "#ffd47c");
  }

  if (enemy.parryWindow > 0) {
    drawStatusPill(canvas.width - 40, 80, "PARRY", "#bffcff", true);
  } else if (enemy.stunTimer > 0) {
    drawStatusPill(canvas.width - 40, 80, "STUN", "#ffd47c", true);
  }
}

function drawBanner(title, subtitle) {
  ctx.save();
  fillRoundedRect(ctx, canvas.width / 2 - 238, canvas.height / 2 - 66, 476, 132, 26, "rgba(0,0,0,0.46)");
  fillRoundedRect(ctx, canvas.width / 2 - 228, canvas.height / 2 - 56, 456, 112, 22, "rgba(255,255,255,0.04)");

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
  drawArenaOverlay(state.stage.id);

  const leftPose = spawnFighter({
    team: PLAYER_TEAM,
    control: "p1",
    weapon: weaponById(state.activeWeaponId) || currentBlueprint(),
    x: 300,
    name: playerDisplayName(),
    color: "#89e6dc"
  });
  const rightPose = spawnFighter({
    team: ENEMY_TEAM,
    control: "bot",
    weapon: weaponById(state.rivalWeaponId) || createRandomEnemyWeapon(),
    x: STAGE_WIDTH - 300,
    name: selectedRivalName(),
    color: "#f0d48b"
  });

  leftPose.stepTimer = 0.8;
  leftPose.attack = { timer: leftPose.profile.windup + leftPose.profile.active * 0.66, connected: true };
  rightPose.blocking = true;

  drawFighter(leftPose);
  drawFighter(rightPose);

  ctx.fillStyle = "rgba(0,0,0,0.34)";
  ctx.fillRect(140, 176, canvas.width - 280, 132);
  drawBanner("ROUND SET FIGHTER", "Press Play, choose tutorial or a mode, then jump straight into the arena.");

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
  drawArenaOverlay(match.stage.id);

  ctx.save();
  if (match.shake > 0) {
    ctx.translate(randomRange(-match.shake, match.shake), randomRange(-match.shake, match.shake));
  }

  match.fighters.forEach((fighter) => drawFighter(fighter));
  drawSparks(match);
  ctx.restore();

  drawHud(match);

  if (match.flash > 0) {
    ctx.fillStyle = `rgba(255,255,255,${match.flash * 0.18})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (match.phase === "intro") {
    if (match.phaseTimer > 0.9) {
      drawBanner(`ROUND ${match.round}`, `First to ${match.roundsToWin} wins`);
    } else {
      drawBanner("FIGHT", `${match.mode === "duel" ? "Local duel" : "Bot duel"} on ${currentStageConfig(match.stage.id).label}`);
    }
  } else if (match.phase === "round-over") {
    const winnerName = match.fighters.find((fighter) => fighter.team === match.roundWinner)?.name || null;
    const title = match.roundWinner
      ? `${winnerName?.toUpperCase() || "WINNER"} TAKES ROUND`
      : "DRAW";
    drawBanner(title, `Set score ${match.score.player} - ${match.score.enemy}`);
  } else if (match.phase === "match-over") {
    const winnerName = match.fighters.find((fighter) => fighter.team === match.setWinner)?.name || "Winner";
    const title =
      `${winnerName.toUpperCase()} WINS`;
    drawBanner(title, "Set complete. Reforge or press Start Set for a rematch.");
  }
}

function loop(now) {
  const dt = clamp((now - state.lastFrameTime) / 1000, 0, 0.033);
  state.lastFrameTime = now;
  pollGamepadState();
  updateForgeMinigame(dt);
  if (!state.menu.open) {
    updateMatch(dt);
    state.uiPulse += dt;
    if (state.uiPulse >= 0.12) {
      renderBroadcastDeck();
      state.uiPulse = 0;
    }
  }
  renderBattlefield();
  requestAnimationFrame(loop);
}

function handleForgeChange() {
  const previousForge = { ...state.forge };
  const previousKind = state.forge.kind || frameCatalog[state.forge.frame]?.kind || "medium";
  const requestedKind = ui.classSelect.value || previousKind;
  const requestedFrame = requestedKind === previousKind ? ui.frameSelect.value : firstFrameIdForKind(requestedKind);
  state.forge = normalizeForgeState({
    ...state.forge,
    name: ui.weaponName.value.trim().slice(0, 12),
    kind: requestedKind,
    frame: requestedFrame,
    material: ui.materialSelect.value,
    edge: ui.edgeSelect.disabled ? state.forge.edge : ui.edgeSelect.value,
    heat: Number(ui.heatRange.value)
  });
  const blueprintChanged =
    previousForge.kind !== state.forge.kind ||
    previousForge.frame !== state.forge.frame ||
    previousForge.material !== state.forge.material ||
    previousForge.edge !== state.forge.edge ||
    previousForge.heat !== state.forge.heat;
  if (blueprintChanged) {
    resetForgeMinigame(state.forge.kind, false);
  }
  syncForgeSelectors();
  renderForge();
  updateHudLabels();
}

function bindTouchControls() {
  const buttons = ui.touchControls.querySelectorAll("[data-touch]");
  buttons.forEach((button) => {
    const action = button.dataset.touch;
    const tapFriendly = new Set(["attack", "up", "dodge", "slide"]);
    let releaseTimer = 0;
    const clearReleaseTimer = () => {
      if (releaseTimer) {
        window.clearTimeout(releaseTimer);
        releaseTimer = 0;
      }
    };
    const setPressed = (value, event) => {
      event.preventDefault();
      clearReleaseTimer();
      state.touchState[action] = value;
      if (value) {
        state.inputProfile.lastSource = "touch";
        primeAudio();
      }
    };

    button.addEventListener("pointerdown", (event) => {
      if (button.setPointerCapture) {
        button.setPointerCapture(event.pointerId);
      }
      setPressed(true, event);
    });
    button.addEventListener("pointerup", (event) => {
      event.preventDefault();
      if (button.releasePointerCapture && button.hasPointerCapture?.(event.pointerId)) {
        button.releasePointerCapture(event.pointerId);
      }
      clearReleaseTimer();
      if (tapFriendly.has(action)) {
        releaseTimer = window.setTimeout(() => {
          state.touchState[action] = false;
        }, 90);
      } else {
        state.touchState[action] = false;
      }
    });
    button.addEventListener("pointerleave", (event) => setPressed(false, event));
    button.addEventListener("pointercancel", (event) => setPressed(false, event));
    button.addEventListener("contextmenu", (event) => event.preventDefault());
  });

  ui.touchControls.querySelectorAll("[data-touch-ui]").forEach((button) => {
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      state.inputProfile.lastSource = "touch";
      primeAudio();
    });

    button.addEventListener("click", (event) => {
      event.preventDefault();
      const action = button.dataset.touchUi;

      if (action === "tutorial") {
        startTutorial();
      } else if (action === "pause") {
        setMenuOpen(true);
      }
    });
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
    primeAudio();
    updateMousePosition(event);
    state.inputProfile.lastSource = event.pointerType === "touch" ? "touch" : "mouse";
    if (event.pointerType === "touch") {
      event.preventDefault();
      return;
    }
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
    ui.classSelect,
    ui.frameSelect,
    ui.materialSelect,
    ui.edgeSelect,
    ui.heatRange
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

  ui.forgeStart.addEventListener("click", () => {
    startForgeMinigame();
    setMatchSummary(`Forge drill started for ${state.forge.kind} blades.`);
  });

  ui.forgeAction.addEventListener("click", () => {
    handleForgeMinigameAction();
    const quality = forgeRatingLabel(state.forge.forgeQuality ?? state.forgeGame.rating);
    setMatchSummary(`Forge finish now reads ${quality}.`);
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
    setMatchSummary(describeMatchMode(ui.matchMode.value));
    ui.battlefieldMode.textContent = matchModeLabel(ui.matchMode.value);
    renderMenuSummary();
    renderControlGuide();
  });

  const toggleAudio = () => {
    const nextEnabled = !state.audio.enabled;
    setAudioEnabled(nextEnabled);
    if (nextEnabled) {
      primeAudio();
      playSoundEffect("menu-accept");
    }
  };

  ui.toggleSound.addEventListener("click", toggleAudio);
  ui.menuToggleSound.addEventListener("click", toggleAudio);

  ui.openMenu.addEventListener("click", () => setMenuOpen(true));
  ui.closeMenu.addEventListener("click", () => setMenuOpen(false));
  ui.introPlay.addEventListener("click", () => {
    primeAudio();
    playSoundEffect("menu-accept");
    setIntroOpen(false);
    state.tutorial.offerVisible = appearsNewPlayer();
    setMenuOpen(true);
    setMatchSummary(
      state.tutorial.offerVisible
        ? "It looks like you're new. Pick your controls, then start the guided tutorial or jump into a fight."
        : "Choose tutorial, bot, PvP, or open the forge screen."
    );
  });
  ui.deviceChoiceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setPreferredInputMode(button.dataset.deviceChoice);
      setMatchSummary(`${inputModeLabel()} controls selected. Start the tutorial when you're ready.`);
    });
  });
  ui.menuOpenWorkshop.addEventListener("click", () => {
    primeAudio();
    playSoundEffect("menu-accept");
    openForgeScreen();
  });
  ui.startTutorial.addEventListener("click", startTutorial);
  ui.skipTutorial.addEventListener("click", () => {
    state.tutorial.promptSeen = true;
    state.tutorial.offerVisible = false;
    saveSettingsState();
    renderTutorialOffer();
    setMatchSummary("Tutorial skipped. Pick a mode or open the forge screen whenever you want.");
  });
  ui.menuPlayBot.addEventListener("click", () => launchMatchFromMenu("solo"));
  ui.menuPlayPvp.addEventListener("click", () => launchMatchFromMenu("duel"));
  ui.toggleScreenFocus.addEventListener("click", () => {
    if (state.flow.screen === "forge") {
      setScreenFocus("arena");
      setMatchSummary("Arena view active.");
    } else {
      openForgeScreen();
    }
  });
  ui.closeTutorial.addEventListener("click", () => {
    dismissTutorial();
    setMatchSummary("Tutorial panel closed. Keep fighting.");
  });
  ui.recapRematch.addEventListener("click", startMatch);
  ui.recapMenu.addEventListener("click", () => {
    primeAudio();
    playSoundEffect("menu-accept");
    setMenuOpen(true);
  });

  ui.feedbackChoices.forEach((button) => {
    button.addEventListener("click", () => {
      state.feedback.selectedChoice = button.dataset.feedbackChoice;
      ui.feedbackStatus.textContent = "Ready to save local session feedback.";
      renderFeedbackPanel();
    });
  });

  ui.reviewChoices.forEach((button) => {
    button.addEventListener("click", () => {
      state.reviews.selectedChoice = button.dataset.reviewChoice;
      renderReviewList("Review rating selected.");
    });
  });

  ui.sendFeedback.addEventListener("click", submitFeedback);
  ui.dismissFeedback.addEventListener("click", () => {
    ui.feedbackStatus.textContent = "Feedback prompt dismissed for this session.";
    closeFeedbackPanel();
  });
  ui.submitReview.addEventListener("click", submitReview);

  ui.createAccount.addEventListener("click", createAccount);
  ui.loginAccount.addEventListener("click", loginAccount);
  ui.logoutAccount.addEventListener("click", logoutAccount);
  ui.addFriend.addEventListener("click", addFriend);

  ui.startMatch.addEventListener("click", startMatch);

  const preventedKeys = new Set([
    "Space",
    ...Object.values(keyBindings.p1),
    ...Object.values(keyBindings.p2)
  ]);

  const isEditableTarget = (target) => {
    if (!(target instanceof HTMLElement)) {
      return false;
    }
    return Boolean(target.closest("input, textarea, select, button")) || target.isContentEditable;
  };

  window.addEventListener("keydown", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }
    if (isEditableTarget(event.target)) {
      return;
    }
    if (state.flow.screen === "forge" && (event.code === "Space" || event.code === "Enter")) {
      event.preventDefault();
      handleForgeMinigameAction();
      renderForge();
      return;
    }
    if (preventedKeys.has(event.code)) {
      event.preventDefault();
    }
    state.inputProfile.lastSource = "keyboard";
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
    Object.keys(state.gamepad.buttons).forEach((key) => {
      state.gamepad.buttons[key] = false;
    });
  });

  window.addEventListener("resize", refreshInputProfile);
  window.addEventListener("orientationchange", refreshInputProfile);
  document.addEventListener("fullscreenchange", syncFullscreenState);
  document.addEventListener("webkitfullscreenchange", syncFullscreenState);

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
  refreshInputProfile();
  populateSelect(ui.classSelect, bladeTypeCatalog);
  syncForgeSelectors();
  resetForgeMinigame(state.forge.kind, true);
  ui.roundsToWinValue.textContent = ui.roundsToWin.value;

  try {
    const savedAuth = JSON.parse(window.localStorage.getItem("stickforge-auth") || "null");
    if (savedAuth && Array.isArray(savedAuth.accounts)) {
      state.auth.accounts = savedAuth.accounts.map((account) => ({
        ...account,
        friends: Array.isArray(account.friends) ? account.friends : [],
        stats: {
          ...defaultAccountStats(),
          ...(account.stats || {})
        }
      }));
      state.auth.activeAccountId = savedAuth.activeAccountId || null;
    }
  } catch (error) {
    state.auth.accounts = [];
    state.auth.activeAccountId = null;
  }

  try {
    const savedFeedback = JSON.parse(window.localStorage.getItem("stickforge-feedback") || "[]");
    if (Array.isArray(savedFeedback)) {
      state.feedback.entries = savedFeedback.slice(0, 10);
    }
  } catch (error) {
    state.feedback.entries = [];
  }

  try {
    const savedSettings = JSON.parse(window.localStorage.getItem("stickforge-settings") || "null");
    if (savedSettings && typeof savedSettings.audioEnabled === "boolean") {
      state.audio.enabled = savedSettings.audioEnabled;
    }
    if (savedSettings && ["auto", "pc", "mobile", "controller"].includes(savedSettings.preferredInput)) {
      state.inputProfile.preference = savedSettings.preferredInput;
    }
    if (savedSettings && typeof savedSettings.tutorialPromptSeen === "boolean") {
      state.tutorial.promptSeen = savedSettings.tutorialPromptSeen;
    }
  } catch (error) {
    state.audio.enabled = true;
  }

  const coarsePointerBoot = hasCoarsePointer();
  if (coarsePointerBoot && state.inputProfile.preference === "auto") {
    state.inputProfile.preference = "mobile";
  }
  refreshInputProfile();

  try {
    const savedReviews = JSON.parse(window.localStorage.getItem("stickforge-reviews") || "[]");
    if (Array.isArray(savedReviews)) {
      state.reviews.entries = savedReviews.slice(0, 8);
    }
  } catch (error) {
    state.reviews.entries = [];
  }

  seedArmory();
  renderForge();
  renderArmory();
  renderStageSummary();
  updateHudLabels();
  setStatus("Waiting");
  setMatchSummary("Press Play on the intro screen, choose your controls, then start the tutorial, bot fight, PvP set, or forge screen.");
  bindEvents();
  renderSoundButtons();
  renderAccountPanel();
  renderReviewList();
  renderFeedbackPanel();
  renderControlGuide();
  setScreenFocus("arena");
  const autoStart = window.location.hash.includes("autostart");
  const autoOpenMobileOnboarding = !autoStart && coarsePointerBoot && appearsNewPlayer();

  if (autoOpenMobileOnboarding) {
    state.tutorial.offerVisible = true;
    setIntroOpen(false);
    setMenuOpen(true);
    setMatchSummary("It looks like you're new. Pick your controls, then start the guided tutorial right away.");
  } else {
    setIntroOpen(!autoStart);
    setMenuOpen(false);
  }

  renderTutorialOffer();
  renderTutorialPanel();
  syncFullscreenState();
  renderBattlefield();

  if (autoStart) {
    startMatch();
  }

  requestAnimationFrame(loop);
}

init();
