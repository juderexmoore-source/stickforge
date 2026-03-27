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
    summary: "Balanced sword. Good first pick with clean reach, clean speed, and no huge weakness.",
    design: "Straight duel blade",
    damage: 18,
    reach: 78,
    cooldown: 0.62,
    knockback: 1.08,
    arc: 1.18,
    speed: 1.02,
    moveScale: 1,
    weight: 10
  },
  spear: {
    label: "Spear",
    summary: "Long poke weapon. Safest range, narrower swing, and better lane control.",
    design: "Long thrusting polearm",
    damage: 16,
    reach: 104,
    cooldown: 0.76,
    knockback: 1.14,
    arc: 0.86,
    speed: 0.92,
    moveScale: 0.96,
    weight: 12
  },
  cleaver: {
    label: "Cleaver",
    summary: "Short heavy chopper. Slower than a saber but it hits harder and launches farther.",
    design: "Wide chopping blade",
    damage: 24,
    reach: 68,
    cooldown: 0.86,
    knockback: 1.34,
    arc: 1.04,
    speed: 0.86,
    moveScale: 0.92,
    weight: 16
  },
  chainblade: {
    label: "Chainblade",
    summary: "Fast pressure weapon. Swings wide, recovers quickly, and is good for close scrambles.",
    design: "Weighted chain blade",
    damage: 15,
    reach: 88,
    cooldown: 0.52,
    knockback: 0.94,
    arc: 1.42,
    speed: 1.16,
    moveScale: 1.04,
    weight: 11
  },
  dagger: {
    label: "Dagger",
    summary: "Shortest weapon here. Very fast, easy to weave with, and built for rushdown.",
    design: "Compact stabbing knife",
    damage: 13,
    reach: 58,
    cooldown: 0.42,
    knockback: 0.9,
    arc: 0.98,
    speed: 1.24,
    moveScale: 1.08,
    weight: 7
  },
  greatblade: {
    label: "Greatblade",
    summary: "Big two-hand sword. Strong range and damage, but every miss is slower to recover.",
    design: "Oversized great sword",
    damage: 27,
    reach: 92,
    cooldown: 0.94,
    knockback: 1.42,
    arc: 1.08,
    speed: 0.8,
    moveScale: 0.88,
    weight: 20
  },
  warhammer: {
    label: "War Hammer",
    summary: "Blunt wrecking tool. Massive knockback and guard damage, but the slowest swing here.",
    design: "Blocky impact hammer",
    damage: 30,
    reach: 74,
    cooldown: 1.02,
    knockback: 1.58,
    arc: 0.9,
    speed: 0.72,
    moveScale: 0.84,
    weight: 24
  },
  halberd: {
    label: "Halberd",
    summary: "Hybrid polearm. Strong range with better sweep than a spear and less weight than a hammer.",
    design: "Axe head with top spike",
    damage: 22,
    reach: 98,
    cooldown: 0.88,
    knockback: 1.28,
    arc: 1.06,
    speed: 0.88,
    moveScale: 0.9,
    weight: 17
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
  needle: {
    label: "Pierce Tip",
    summary: "Longest and quickest sub type. Best when you want easy pokes from farther away.",
    damage: 1,
    reach: 6,
    speed: 0.08,
    cooldown: -0.04,
    knockback: -0.02,
    arc: -0.08,
    weight: -1
  },
  crescent: {
    label: "Sweep Edge",
    summary: "Wider swing sub type. Easier to catch movement at close and mid range.",
    damage: 0,
    reach: 2,
    speed: 0.02,
    cooldown: -0.01,
    knockback: 0.04,
    arc: 0.18,
    weight: 0.5
  },
  breaker: {
    label: "Breaker Head",
    summary: "Heavy crushing sub type. Strongest push and block pressure, but it adds the most weight.",
    damage: 4,
    reach: -4,
    speed: -0.12,
    cooldown: 0.09,
    knockback: 0.16,
    arc: -0.02,
    weight: 2.5
  },
  serrated: {
    label: "Bite Edge",
    summary: "Power-focused sub type. Adds clean damage without changing the weapon too much.",
    damage: 3,
    reach: 0,
    speed: -0.03,
    cooldown: 0.03,
    knockback: 0.08,
    arc: 0.06,
    weight: 1
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
  startTutorial: document.querySelector("#start-tutorial"),
  skipTutorial: document.querySelector("#skip-tutorial"),
  frameSelect: document.querySelector("#frame-select"),
  materialSelect: document.querySelector("#material-select"),
  edgeSelect: document.querySelector("#edge-select"),
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
  touchControls: document.querySelector("#touch-controls"),
  accountName: document.querySelector("#account-name"),
  accountPasscode: document.querySelector("#account-passcode"),
  accountStatus: document.querySelector("#account-status"),
  accountNote: document.querySelector("#account-note"),
  createAccount: document.querySelector("#create-account"),
  loginAccount: document.querySelector("#login-account"),
  logoutAccount: document.querySelector("#logout-account"),
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
    frame: "saber",
    material: "sunsteel",
    edge: "crescent",
    heat: 58
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
    activeAccountId: null,
    ownerAccountId: null
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
    screen: "arena"
  },
  tutorial: {
    offerVisible: false,
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
    lastSource: "mouse"
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

function setMatchSummary(text) {
  ui.matchSummary.textContent = text;
}

function setStatus(text) {
  ui.hudResult.textContent = text;
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
    mobility: false
  };
}

function tutorialSteps() {
  return [
    {
      id: "move",
      title: "Move",
      copy: "Start simple. Press left or right once so your fighter walks.",
      hint: "Desktop: A or D. Mobile: Left or Right. Controller: move the left stick."
    },
    {
      id: "air",
      title: "Jump Or Crouch",
      copy: "Now try going up or down once. You can jump, or you can crouch low.",
      hint: "Desktop: W or S. Mobile: Jump or Down. Controller: A to jump, or push down."
    },
    {
      id: "attack",
      title: "Attack",
      copy: "Try one attack. This is your basic way to hit the other fighter.",
      hint: "Desktop: left click. Mobile: Strike. Controller: RT or X."
    },
    {
      id: "block",
      title: "Block",
      copy: "Hold block for a moment. Blocking helps keep you safe when a hit is coming.",
      hint: "Desktop: right click. Mobile: Block. Controller: LT or LB."
    },
    {
      id: "mobility",
      title: "Quick Move",
      copy: "Finish by trying one quick movement button. One moves you away fast, and one rushes you forward fast.",
      hint: "Desktop: Q or E. Mobile: Backstep or Lunge. Controller: B or Y."
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
    ? "You cleared the basics. The bot can stay as a safe practice dummy while you keep experimenting."
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
  state.inputProfile.touch = hasCoarsePointer();
  document.body.classList.toggle("touch-device", state.inputProfile.touch);
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

function accountSummaryMeta(account) {
  const stats = ensureAccountStats(account);
  const losses = Math.max(0, stats.setsPlayed - stats.setsWon);

  return {
    stats,
    line: `${stats.setsWon}W ${losses}L across ${stats.setsPlayed} sets`,
    reviewLine: `${stats.reviewsWritten} local review${stats.reviewsWritten === 1 ? "" : "s"}`
  };
}

function defaultCombatStats() {
  return {
    damage: 0,
    hits: 0,
    blocks: 0,
    guardBreaks: 0
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
        audioEnabled: state.audio.enabled
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

  ui.menuSummary.innerHTML = `
    <article class="menu-summary-card">
      <span class="menu-summary-kicker">${account ? "Profile" : "Guest Slot"}</span>
      <strong>${account ? account.name : "Guest"}</strong>
      <p>${account ? accountMeta.line : "Sign in to save reviews locally and build a career record."}</p>
      <div class="menu-summary-meta">
        <span>${account ? accountMeta.reviewLine : "No account stats yet"}</span>
        <span>${account ? "Local save active" : "Guest mode"}</span>
      </div>
    </article>
    <article class="menu-summary-card">
      <span class="menu-summary-kicker">Arena Start</span>
      <strong>Fight First</strong>
      <p>Bot matches, PvP sets, and the tutorial all start straight in the arena now.</p>
      <div class="menu-summary-meta">
        <span>${matchModeLabel(ui.matchMode.value)}</span>
        <span>${Number(ui.roundsToWin.value)} rounds to win</span>
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
  const rivalName = match?.fighters?.[1]?.name || (ui.matchMode.value === "duel" ? "Player 2" : "Bot");
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

  ui.broadcastRivalName.textContent = rivalFighter?.name || (ui.matchMode.value === "duel" ? "Player 2" : "Bot");
  ui.broadcastRivalLoadout.textContent = rivalWeapon
    ? `${rivalWeapon.name} | ${weaponRoleTag(rivalWeapon)}`
    : "Auto forge rival";
  ui.broadcastRivalRecord.textContent =
    ui.matchMode.value === "duel"
      ? "Second local fighter"
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
  setScreenFocus("forge");
  setMenuOpen(false);
  setMatchSummary("Forge screen open. Rebuild your weapon, armory picks, or stage settings here.");
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
  state.tutorial.active = true;
  state.tutorial.completed = false;
  state.tutorial.dismissed = false;
  state.tutorial.stepIndex = 0;
  state.tutorial.progress = defaultTutorialProgress();
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
  setMatchSummary("Tutorial live. Do the highlighted step only. The practice bot will stay still and will not attack.");
  pushFightEvent(
    state.match,
    "Tutorial",
    "This tutorial is calm on purpose. You do not need to win. Just follow the highlighted step.",
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
  }

  if (completedStep) {
    progress[currentStep.id] = true;
    state.tutorial.stepIndex += 1;

    if (state.tutorial.stepIndex >= steps.length) {
      state.tutorial.completed = true;
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
        activeAccountId: state.auth.activeAccountId,
        ownerAccountId: state.auth.ownerAccountId
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

function isOwnerAccount() {
  return Boolean(state.auth.activeAccountId) && state.auth.activeAccountId === state.auth.ownerAccountId;
}

function canAccessFeedback() {
  return isOwnerAccount();
}

function renderFeedbackInbox() {
  ui.feedbackInbox.innerHTML = "";

  if (!canAccessFeedback()) {
    const message = document.createElement("p");
    message.className = "arena-hint";
    message.textContent = "Feedback inbox is locked to the owner account.";
    ui.feedbackInbox.append(message);
    return;
  }

  if (!state.feedback.entries.length) {
    const empty = document.createElement("p");
    empty.className = "arena-hint";
    empty.textContent = "No saved feedback yet. Submit feedback in-game to build the inbox.";
    ui.feedbackInbox.append(empty);
    return;
  }

  state.feedback.entries.forEach((entry) => {
    const item = document.createElement("article");
    item.className = "feedback-entry";
    item.innerHTML = `
      <span>${entry.choice} | ${entry.accountName || "Owner"}</span>
      <strong>${entry.stage} | ${entry.mode}</strong>
      <p>${entry.note || "No extra note."}</p>
    `;
    ui.feedbackInbox.append(item);
  });
}

function renderAccountPanel(statusMessage = "") {
  const account = currentAccount();
  const ownerName =
    state.auth.accounts.find((candidate) => candidate.id === state.auth.ownerAccountId)?.name || "Not set";
  const accountMeta = accountSummaryMeta(account);

  if (account) {
    ui.accountStatus.textContent = isOwnerAccount()
      ? `Signed in as ${account.name}. You are the feedback owner.`
      : `Signed in as ${account.name}. Feedback stays locked to owner ${ownerName}.`;
  } else {
    ui.accountStatus.textContent = state.auth.accounts.length
      ? `No account is signed in. Owner feedback belongs to ${ownerName}.`
      : "No account is signed in. The first created account becomes the only feedback owner.";
  }

  ui.accountNote.textContent =
    statusMessage ||
    (account
      ? `${accountMeta.line}. ${accountMeta.reviewLine}. Accounts are saved locally in this browser.`
      : state.auth.accounts.length
        ? "Accounts are saved locally in this browser. Only the owner account can open or read feedback."
        : "Create a local account. The first one becomes the owner and gets feedback access.");

  renderFeedbackInbox();
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
    createdAt: new Date().toISOString()
  };

  state.auth.accounts.push(account);
  state.auth.activeAccountId = account.id;
  if (!state.auth.ownerAccountId) {
    state.auth.ownerAccountId = account.id;
  }
  saveAuthState();
  ui.accountName.value = "";
  ui.accountPasscode.value = "";
  if (state.match && isOwnerAccount()) {
    scheduleFeedbackPrompt();
  }
  renderAccountPanel(
    state.auth.ownerAccountId === account.id
      ? `${account.name} created and set as the feedback owner.`
      : `${account.name} created and signed in.`
  );
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
  if (state.match && isOwnerAccount()) {
    scheduleFeedbackPrompt();
  }
  renderAccountPanel(`Signed in as ${account.name}.`);
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
  renderAccountPanel("Signed out. Feedback remains locked until the owner logs back in.");
  renderReviewList("Signed out. Reviews need a signed-in player name.");
  renderMenuSummary();
}

function renderFeedbackPanel() {
  const feedback = state.feedback;
  const feedbackVisible = feedback.visible && canAccessFeedback();
  ui.feedbackPanel.classList.toggle("hidden", !feedbackVisible);
  ui.feedbackChoices.forEach((button) => {
    button.classList.toggle("active", button.dataset.feedbackChoice === feedback.selectedChoice);
  });
}

function openFeedbackPanel(message = "You have been in the arena a bit. Drop a fast note about combat feel, weapon control, or stickman visuals.") {
  const feedback = state.feedback;
  if (!canAccessFeedback()) {
    return;
  }
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
  const account = currentAccount();

  if (!canAccessFeedback() || !account) {
    ui.feedbackStatus.textContent = "Only the owner account can save feedback.";
    return;
  }

  if (!choice && !note) {
    ui.feedbackStatus.textContent = "Pick a quick rating or type a short note first.";
    return;
  }

  storeFeedbackEntry({
    choice: choice || "Note only",
    note,
    accountName: account.name,
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
  if (feedback.shown || feedback.promptHandle || !canAccessFeedback()) {
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
  const frame = frameCatalog[forge.frame];
  const material = materialCatalog[forge.material];
  const edge = edgeCatalog[forge.edge];
  const heat = clamp(Number(forge.heat ?? forge.temper ?? 58), 0, 100);
  const heatScale = heat / 100;
  const weight = clamp(
    Number((frame.weight + material.weight + edge.weight + heatScale * 6).toFixed(1)),
    5,
    32
  );
  const weightLoad = Math.max(0, weight - 10);

  const damage = clamp(
    Math.round(frame.damage + material.damage + edge.damage + heatScale * 4),
    10,
    36
  );
  const reach = clamp(
    Math.round(frame.reach + material.reach + edge.reach),
    54,
    132
  );
  const speed = clamp(
    Number((frame.speed + material.speed + edge.speed - weightLoad * 0.012).toFixed(2)),
    0.66,
    1.32
  );
  const cooldown = clamp(
    Number((frame.cooldown + material.cooldown + edge.cooldown + weightLoad * 0.008).toFixed(2)),
    0.36,
    1.14
  );
  const knockback = clamp(
    Number((frame.knockback + material.knockback + edge.knockback + weight * 0.01).toFixed(2)),
    0.82,
    1.72
  );
  const arc = clamp(
    Number((frame.arc + edge.arc).toFixed(2)),
    0.74,
    1.72
  );
  const moveScale = clamp(
    Number((frame.moveScale + material.moveScale - weightLoad * 0.008).toFixed(2)),
    0.72,
    1.12
  );

  let styleText = "balanced duel control";
  if (damage >= 28 || weight >= 22) {
    styleText = "heavy pressure and guard breaks";
  } else if (speed >= 1.12) {
    styleText = "quick rush pressure";
  } else if (reach >= 102) {
    styleText = "long-range control";
  }

  let heatSummary = "Low heat keeps the weapon lighter and easier to control.";
  if (heat >= 70) {
    heatSummary = "High heat makes the weapon heavier and stronger, so hits hurt more but handling gets slower.";
  } else if (heat >= 40) {
    heatSummary = "Mid heat adds extra damage without pushing the weight too far.";
  }

  return {
    id: forge.id || makeId("weapon"),
    name: forge.name.trim().slice(0, 12) || "NamelessSteel",
    frameId: forge.frame,
    frame: frame.label,
    materialId: forge.material,
    material: material.label,
    edgeId: forge.edge,
    edge: edge.label,
    heat,
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
    styleText,
    lore: `${frame.label} with ${material.label.toLowerCase()} and ${edge.label.toLowerCase()} at ${heat}% heat, built for ${styleText}.`
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
    heat: Math.round(randomRange(20, 92))
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
    <span class="menu-status alt">${weapon.frameDesign}</span>
    <span class="menu-status alt">${weapon.edge}</span>
    <span class="menu-status alt">${weapon.weight.toFixed(1)} wt</span>
    <span class="menu-status alt">${weapon.reach} reach</span>
  `;
}

function weaponRoleTag(weapon) {
  if (weapon.damage >= 27 || weapon.knockback >= 1.42) {
    return "Heavy";
  }
  if (weapon.speed >= 1.16 || weapon.cooldown <= 0.48) {
    return "Fast";
  }
  if (weapon.reach >= 98) {
    return "Control";
  }
  return "Balanced";
}

function weaponPreviewMarkup(weapon) {
  const shaft = clamp(Math.round(weapon.reach * 0.72), 50, 98);
  const bladeSize = clamp(Math.round(weapon.damage * 1.22), 16, 34);
  const color = weapon.color;
  const handle = "#f3ead8";
  let headMarkup = `
    <path d="M ${shaft} ${36 - bladeSize * 0.46} L ${shaft + bladeSize * 0.82} 36 L ${shaft} ${36 + bladeSize * 0.46} Z" fill="${color}" />
  `;

  if (weapon.frameId === "spear") {
    headMarkup = `
      <path d="M ${shaft} 36 L ${shaft + bladeSize} ${36 - 8} L ${shaft + bladeSize * 0.58} 36 L ${shaft + bladeSize} ${36 + 8} Z" fill="${color}" />
    `;
  } else if (weapon.frameId === "cleaver") {
    headMarkup = `
      <path d="M ${shaft - 3} ${36 - bladeSize * 0.52} L ${shaft + bladeSize * 0.48} ${36 - bladeSize * 0.28} L ${shaft + bladeSize * 0.4} ${36 + bladeSize * 0.34} L ${shaft - 8} ${36 + bladeSize * 0.42} Z" fill="${color}" />
    `;
  } else if (weapon.frameId === "chainblade") {
    headMarkup = `<circle cx="${shaft + bladeSize * 0.18}" cy="36" r="${bladeSize * 0.38}" fill="${color}" />`;
  } else if (weapon.frameId === "dagger") {
    headMarkup = `
      <path d="M ${shaft - 6} ${36 - bladeSize * 0.2} L ${shaft + bladeSize * 0.46} 36 L ${shaft - 6} ${36 + bladeSize * 0.2} Z" fill="${color}" />
    `;
  } else if (weapon.frameId === "greatblade") {
    headMarkup = `
      <path d="M ${shaft - 2} ${36 - bladeSize * 0.72} L ${shaft + bladeSize * 0.84} ${36 - bladeSize * 0.14} L ${shaft + bladeSize * 0.9} 36 L ${shaft + bladeSize * 0.84} ${36 + bladeSize * 0.14} L ${shaft - 2} ${36 + bladeSize * 0.72} Z" fill="${color}" />
    `;
  } else if (weapon.frameId === "warhammer") {
    headMarkup = `<rect x="${shaft - 1}" y="${36 - bladeSize * 0.42}" width="${bladeSize * 0.86}" height="${bladeSize * 0.84}" rx="4" fill="${color}" />`;
  } else if (weapon.frameId === "halberd") {
    headMarkup = `
      <path d="M ${shaft - 5} ${36 - bladeSize * 0.62} L ${shaft + bladeSize * 0.68} ${36 - bladeSize * 0.28} L ${shaft + bladeSize * 0.16} 36 L ${shaft + bladeSize * 0.68} ${36 + bladeSize * 0.24} L ${shaft - 5} ${36 + bladeSize * 0.16} L ${shaft + bladeSize * 0.42} 36 Z" fill="${color}" />
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
  ui.forgeDetails.innerHTML = `
    <article class="forge-detail-card">
      <span>Weapon Type</span>
      <strong>${weapon.frame}</strong>
      <p>${weapon.frameSummary}</p>
    </article>
    <article class="forge-detail-card">
      <span>Sub Weapon Type</span>
      <strong>${weapon.edge}</strong>
      <p>${weapon.edgeSummary}</p>
    </article>
    <article class="forge-detail-card">
      <span>Material</span>
      <strong>${weapon.material}</strong>
      <p>${weapon.materialSummary}</p>
    </article>
    <article class="forge-detail-card">
      <span>Heat</span>
      <strong>${weapon.heat}% forge heat</strong>
      <p>${weapon.heatSummary}</p>
    </article>
  `;
}

function renderForgeStats(weapon) {
  const stats = [
    {
      label: "Damage",
      value: weapon.damage,
      display: `${weapon.damage}`,
      max: 36,
      detail: "Higher damage removes more health on a clean hit."
    },
    {
      label: "Weight",
      value: weapon.weight,
      display: weapon.weight.toFixed(1),
      max: 32,
      detail: "More weight hits harder, but it also slows movement and recovery."
    },
    {
      label: "Reach",
      value: weapon.reach,
      display: `${weapon.reach}`,
      max: 132,
      detail: "Higher reach lets you touch the rival from farther away."
    },
    {
      label: "Speed",
      value: Math.round(weapon.speed * 100),
      display: `${Math.round(weapon.speed * 100)}`,
      max: 132,
      detail: "Higher speed makes the attack start faster."
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
      max: 172,
      detail: "Higher push shoves rivals farther and strains their block more."
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
  } else if (weapon.frameId === "dagger") {
    previewCtx.moveTo(shaft - 8, -bladeSize * 0.22);
    previewCtx.lineTo(shaft + bladeSize * 0.46, 0);
    previewCtx.lineTo(shaft - 8, bladeSize * 0.22);
  } else if (weapon.frameId === "greatblade") {
    previewCtx.moveTo(shaft - 4, -bladeSize * 0.72);
    previewCtx.lineTo(shaft + bladeSize * 0.84, -bladeSize * 0.18);
    previewCtx.lineTo(shaft + bladeSize * 0.92, 0);
    previewCtx.lineTo(shaft + bladeSize * 0.84, bladeSize * 0.18);
    previewCtx.lineTo(shaft - 4, bladeSize * 0.72);
  } else if (weapon.frameId === "warhammer") {
    previewCtx.rect(shaft - 2, -bladeSize * 0.44, bladeSize * 0.9, bladeSize * 0.88);
  } else if (weapon.frameId === "halberd") {
    previewCtx.moveTo(shaft - 6, -bladeSize * 0.68);
    previewCtx.lineTo(shaft + bladeSize * 0.66, -bladeSize * 0.3);
    previewCtx.lineTo(shaft + bladeSize * 0.2, 0);
    previewCtx.lineTo(shaft + bladeSize * 0.66, bladeSize * 0.3);
    previewCtx.lineTo(shaft - 6, bladeSize * 0.16);
    previewCtx.lineTo(shaft + bladeSize * 0.44, 0);
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
  renderForgeBadges(weapon);
  renderForgeStats(weapon);
  renderForgeDetails(weapon);
  renderForgePreview(weapon);
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
    heat: clamp(Number(weapon.heat ?? weapon.temper ?? 58), 0, 100)
  };

  ui.weaponName.value = state.forge.name;
  ui.frameSelect.value = state.forge.frame;
  ui.materialSelect.value = state.forge.material;
  ui.edgeSelect.value = state.forge.edge;
  ui.heatRange.value = `${state.forge.heat}`;
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
      <span class="pill">${weapon.material}</span>
      <span class="pill">${weapon.edge}</span>
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
  return {
    damage: clamp(Math.round(weapon.damage * 0.95 + weapon.arc * 2.2), 11, 34),
    reach: clamp(Math.round(weapon.reach * 0.78), 44, 118),
    windup: clamp(0.11 + weapon.cooldown * 0.11 - weapon.speed * 0.025, 0.08, 0.22),
    active: clamp(0.07 + weapon.arc * 0.03, 0.08, 0.16),
    recover: clamp(0.15 + weapon.cooldown * 0.2, 0.14, 0.36),
    knockback: clamp(180 + weapon.knockback * 70, 190, 320),
    blockDrain: clamp(Math.round(8 + weapon.damage * 0.35 + weapon.weight * 0.35), 10, 24),
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
    walkSpeed: clamp(168 + weapon.speed * 32 + weapon.moveScale * 18 - weapon.weight * 1.2, 132, 220),
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
      name: playerDisplayName(),
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
  const torsoTop = -height * 0.5;
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
  if (!fighter.alive || !fighter.onGround || fighter.jumpCooldown > 0 || fighter.hitstun > 0) {
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
  playSoundEffect("backstep");
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
  playSoundEffect("slide");
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
  playSoundEffect("attack");
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
  const attackerStats = statsForTeam(match, attacker.team);
  const defenderStats = statsForTeam(match, defender.team);

  if (defender.blocking && defender.onGround && onFrontSide(defender, attacker)) {
    defender.stamina = clamp(defender.stamina - attacker.profile.blockDrain, 0, defender.maxStamina);
    defender.vx += attacker.facing * attacker.profile.knockback * 0.18;
    defender.hitstun = Math.max(defender.hitstun, 0.08);
    addSpark(match, (attacker.x + defender.x) / 2, attacker.y - attackHeight * 0.6, "#ffffff", 8);
    defenderStats.blocks += 1;

    if (defender.stamina <= 0) {
      const guardBreakDamage = Math.round(attacker.profile.damage * 0.32);
      defender.blocking = false;
      defender.hitstun = 0.28;
      defender.health = clamp(defender.health - guardBreakDamage, 0, defender.maxHealth);
      defender.vx = attacker.facing * attacker.profile.knockback * 0.54;
      triggerImpact(match, { shake: 8, flash: 0.18, hitstop: 0.07 });
      playSoundEffect("guard-break");
      setMatchSummary(`${attacker.name} broke ${defender.name}'s guard.`);
      attackerStats.guardBreaks += 1;
      attackerStats.hits += 1;
      attackerStats.damage += guardBreakDamage;
      pushFightEvent(match, "Guard Break", `${attacker.name} cracked ${defender.name}'s guard for ${guardBreakDamage}.`, "impact");
    } else {
      triggerImpact(match, { shake: 4, flash: 0.08, hitstop: 0.03 });
      playSoundEffect("block");
      setMatchSummary(`${defender.name} blocked the strike.`);
      pushFightEvent(match, "Block", `${defender.name} stopped ${attacker.name}'s ${attacker.weapon.name} swing.`, "control");
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
  triggerImpact(match, { shake: 10, flash: 0.14, hitstop: 0.06 });
  playSoundEffect("hit");
  setMatchSummary(`${attacker.name} landed ${damage} damage with ${attacker.weapon.name}.`);
  attackerStats.hits += 1;
  attackerStats.damage += damage;
  pushFightEvent(match, "Clean Hit", `${attacker.name} landed ${damage} with ${attacker.weapon.name}.`, "impact");
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

  if (defender.blocking && defender.onGround && onFrontSide(defender, attacker)) {
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

  addSpark(match, currentPose.tipX, currentPose.tipY, attacker.weapon.color, 9);
  triggerImpact(match, { shake: 5, flash: 0.08, hitstop: 0.03 });
  playSoundEffect("hit");
  setMatchSummary(`${attacker.name} clipped ${defender.name} with a weapon swing for ${damage}.`);
  attackerStats.hits += 1;
  attackerStats.damage += damage;
  pushFightEvent(match, "Clip", `${attacker.name} clipped ${defender.name} for ${damage} with a mouse swing.`, "impact");
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

  updateMouseWeaponControl(fighter, opponent, dt);
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
  const frontHandX = fighter.facing * (19 + walkAmount * 5);
  const rearHandX = -fighter.facing * (12 + walkAmount * 4);
  const frontHandY =
    shoulderY + (fighter.blocking ? -15 : fighter.attack || fighter.slideTimer > 0 ? 1 : 22 + armSwing * 0.26);
  const rearHandY = shoulderY + 22 - armSwing * 0.22;
  const frontElbowX = fighter.facing * 6.5;
  const frontElbowY = shoulderY + (fighter.blocking ? -9 : 12);
  const rearElbowX = -fighter.facing * 5.5;
  const rearElbowY = shoulderY + 12;
  const frontKneeX = fighter.facing * (9 + walkAmount * 3.5);
  const rearKneeX = -fighter.facing * (6 + walkAmount * 2.5);
  const frontKneeY = fighter.slideTimer > 0 ? 12 : 22 + stride * 0.16;
  const rearKneeY = fighter.slideTimer > 0 ? 14 : 22 - stride * 0.16;
  const frontFootX = fighter.facing * (17 + walkAmount * 8);
  const rearFootX = -fighter.facing * (11 + walkAmount * 6);
  const frontFootY = fighter.slideTimer > 0 ? 14 : 46 + stride * 0.48;
  const rearFootY = fighter.slideTimer > 0 ? 18 : 46 - stride * 0.48;
  const footContactY = Math.max(frontFootY, rearFootY);
  const lean =
    fighter.slideTimer > 0 ? fighter.facing * 0.28 : fighter.hitstun > 0 ? -fighter.facing * 0.18 : 0;

  ctx.save();
  ctx.translate(stageX, stageFloorY - footContactY + bob + bodyLift);
  ctx.rotate(lean);

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

  if (fighter.attackFlash > 0) {
    ctx.fillStyle = `rgba(255,255,255,${fighter.attackFlash * 0.75})`;
    ctx.beginPath();
    ctx.arc(0, torsoTop * 0.64, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  const weaponTipX = weaponPose.tipX - fighter.x;
  const weaponTipY = weaponPose.tipY - fighter.y;
  const weaponRenderBaseX = frontHandX * 0.82;
  const weaponRenderBaseY = frontHandY - 2;

  if (fighter.attack || fighter.slideTimer > 0) {
    const trail = ctx.createLinearGradient(weaponRenderBaseX, weaponRenderBaseY, weaponTipX, weaponTipY);
    trail.addColorStop(0, "rgba(255,255,255,0)");
    trail.addColorStop(1, `${fighter.weapon.color}55`);
    ctx.strokeStyle = trail;
    ctx.lineWidth = fighter.attack ? 15 : 11;
    ctx.beginPath();
    ctx.moveTo(weaponRenderBaseX, weaponRenderBaseY);
    ctx.lineTo(weaponTipX, weaponTipY);
    ctx.stroke();
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

  ctx.fillStyle = `${fighter.weapon.color}44`;
  ctx.beginPath();
  ctx.arc(weaponTipX, weaponTipY, fighter.weapon.frameId === "chainblade" ? 13 : 9, 0, Math.PI * 2);
  ctx.fill();

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
  state.forge.name = ui.weaponName.value.trim().slice(0, 12);
  ui.weaponName.value = state.forge.name;
  state.forge.frame = ui.frameSelect.value;
  state.forge.material = ui.materialSelect.value;
  state.forge.edge = ui.edgeSelect.value;
  state.forge.heat = Number(ui.heatRange.value);
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
      if (value) {
        state.inputProfile.lastSource = "touch";
        primeAudio();
      }
    };

    button.addEventListener("pointerdown", (event) => setPressed(true, event));
    button.addEventListener("pointerup", (event) => setPressed(false, event));
    button.addEventListener("pointerleave", (event) => setPressed(false, event));
    button.addEventListener("pointercancel", (event) => setPressed(false, event));
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

      if (action === "play-bot") {
        launchMatchFromMenu("solo");
      } else if (action === "play-pvp") {
        launchMatchFromMenu("duel");
      } else if (action === "start-match") {
        startMatch();
      } else if (action === "menu") {
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
    state.tutorial.offerVisible = true;
    setMenuOpen(true);
    setMatchSummary("Choose tutorial, bot, PvP, or open the forge screen.");
  });
  ui.menuOpenWorkshop.addEventListener("click", () => {
    primeAudio();
    playSoundEffect("menu-accept");
    openForgeScreen();
  });
  ui.startTutorial.addEventListener("click", startTutorial);
  ui.skipTutorial.addEventListener("click", () => {
    state.tutorial.offerVisible = false;
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
  populateSelect(ui.frameSelect, frameCatalog);
  populateSelect(ui.materialSelect, materialCatalog);
  populateSelect(ui.edgeSelect, edgeCatalog);

  ui.frameSelect.value = state.forge.frame;
  ui.materialSelect.value = state.forge.material;
  ui.edgeSelect.value = state.forge.edge;
  ui.weaponName.value = state.forge.name;
  ui.heatRange.value = `${state.forge.heat}`;
  ui.roundsToWinValue.textContent = ui.roundsToWin.value;

  try {
    const savedAuth = JSON.parse(window.localStorage.getItem("stickforge-auth") || "null");
    if (savedAuth && Array.isArray(savedAuth.accounts)) {
      state.auth.accounts = savedAuth.accounts.map((account) => ({
        ...account,
        stats: {
          ...defaultAccountStats(),
          ...(account.stats || {})
        }
      }));
      state.auth.activeAccountId = savedAuth.activeAccountId || null;
      state.auth.ownerAccountId = savedAuth.ownerAccountId || savedAuth.accounts[0]?.id || null;
    }
  } catch (error) {
    state.auth.accounts = [];
    state.auth.activeAccountId = null;
    state.auth.ownerAccountId = null;
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
  } catch (error) {
    state.audio.enabled = true;
  }

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
  setMatchSummary("Press Play on the intro screen, then choose tutorial, bot, PvP, or the forge screen.");
  bindEvents();
  renderSoundButtons();
  renderAccountPanel();
  renderReviewList();
  renderFeedbackPanel();
  setScreenFocus("arena");
  setIntroOpen(!window.location.hash.includes("autostart"));
  setMenuOpen(false);
  renderTutorialOffer();
  renderTutorialPanel();
  renderBattlefield();

  if (window.location.hash.includes("autostart")) {
    startMatch();
  }

  requestAnimationFrame(loop);
}

init();
