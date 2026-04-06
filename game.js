"use strict";

const PLAYER_TEAM = "player";
const ENEMY_TEAM = "enemy";
const STYLE_PATH_MAX = 50;
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
  nodachi: {
    label: "Nodachi",
    classLabel: "Long",
    kind: "long",
    summary: "Long draw greatblade with a cleaner rising punish. Dead-on front hits launch rivals up and leave them open longer.",
    design: "Long draw greatblade",
    damage: 24,
    reach: 118,
    cooldown: 0.94,
    knockback: 1.3,
    arc: 0.96,
    speed: 0.84,
    moveScale: 0.9,
    weight: 18,
    special: {
      type: "sky-launch",
      summary: "Dead-on front hits kick rivals upward and extend the punish window."
    }
  },
  halberd: {
    label: "Halberd",
    classLabel: "Long",
    kind: "long",
    summary: "Long poleaxe with broad front control. Heavy clean hits shove harder and sweep a wider punish lane.",
    design: "Hooked poleaxe head",
    damage: 23,
    reach: 122,
    cooldown: 0.96,
    knockback: 1.36,
    arc: 1.12,
    speed: 0.8,
    moveScale: 0.88,
    weight: 20,
    special: {
      type: "cleave-wave",
      summary: "Heavy clean hits shove harder and cover a broader front arc."
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
  falchion: {
    label: "Falchion",
    classLabel: "Medium",
    kind: "medium",
    summary: "Wide medium slasher built to chew through guard. Its dash slash rips stamina off blocking rivals much faster.",
    design: "Broad slashing falchion",
    damage: 20,
    reach: 88,
    cooldown: 0.6,
    knockback: 1.08,
    arc: 1.2,
    speed: 1,
    moveScale: 1,
    weight: 11,
    special: {
      type: "guard-rip",
      summary: "Dash slashes and front hits strip much more guard stamina."
    }
  },
  twinblade: {
    label: "Twinblade",
    classLabel: "Medium",
    kind: "medium",
    summary: "Balanced twin-edge medium blade. Dash becomes a two-cut rush that catches late sidesteps.",
    design: "Split-edge twinblade",
    damage: 18,
    reach: 90,
    cooldown: 0.58,
    knockback: 1.02,
    arc: 1.18,
    speed: 1.08,
    moveScale: 1.04,
    weight: 10,
    special: {
      type: "twin-dash",
      summary: "Dash chains two medium slashes instead of one."
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
  },
  hatchet: {
    label: "Hatchet",
    classLabel: "Short",
    kind: "short",
    summary: "A brutal short cleaver. Back hits hurt, and dash bites in with a chopping rush.",
    design: "Compact hand axe",
    damage: 16,
    reach: 56,
    cooldown: 0.44,
    knockback: 0.92,
    arc: 1.08,
    speed: 1.18,
    moveScale: 1.08,
    weight: 7,
    special: {
      type: "chop-rush",
      backstabBonus: 1.26,
      summary: "Dash becomes a chopping burst with extra knockback."
    }
  },
  sai: {
    label: "Sai",
    classLabel: "Short",
    kind: "short",
    summary: "Fast guard-harassing short weapon set. Great for pinning blocks and slipping inside range.",
    design: "Twin prong blades",
    damage: 14,
    reach: 57,
    cooldown: 0.38,
    knockback: 0.8,
    arc: 1.16,
    speed: 1.3,
    moveScale: 1.12,
    weight: 6,
    special: {
      type: "guard-pin",
      backstabBonus: 1.18,
      summary: "Block pressure is stronger and clean hits pin rivals in place for a beat."
    }
  },
  kukri: {
    label: "Kukri",
    classLabel: "Short",
    kind: "short",
    summary: "Hooked short cleaver that rewards getting behind the rival. Dash becomes a brutal chopping burst with extra finish power.",
    design: "Hooked kukri blade",
    damage: 16,
    reach: 57,
    cooldown: 0.42,
    knockback: 0.9,
    arc: 1.12,
    speed: 1.22,
    moveScale: 1.1,
    weight: 6,
    special: {
      type: "chop-rush",
      backstabBonus: 1.3,
      summary: "Dash becomes a chopping burst with extra knockback and stronger rear cuts."
    }
  },
  claws: {
    label: "Claws",
    classLabel: "Short",
    kind: "short",
    summary: "A vicious short rake set. Back hits shred harder, and dash becomes a fast four-cut frenzy.",
    design: "Raking hand claws",
    damage: 13,
    reach: 55,
    cooldown: 0.36,
    knockback: 0.74,
    arc: 1.3,
    speed: 1.34,
    moveScale: 1.16,
    weight: 5,
    special: {
      type: "rake-frenzy",
      backstabBonus: 1.34,
      summary: "Dash chains four quick rake cuts and rewards rear pressure."
    }
  },
  hookknife: {
    label: "Hook Knife",
    classLabel: "Short",
    kind: "short",
    summary: "A tight hooked blade meant to snag guard and slip behind the rival. Back hits bite harder, and clean pressure pins blocks in place.",
    design: "Hooked guard knife",
    damage: 15,
    reach: 56,
    cooldown: 0.38,
    knockback: 0.82,
    arc: 1.18,
    speed: 1.28,
    moveScale: 1.14,
    weight: 5,
    special: {
      type: "guard-pin",
      backstabBonus: 1.28,
      summary: "Pins guard harder, rewards back cuts, and makes close pressure harder to shake."
    }
  },
  rapier: {
    label: "Rapier",
    classLabel: "Medium",
    kind: "medium",
    summary: "Fast thrusting medium blade. Dash becomes a feinting pass-through thrust.",
    design: "Needle duel blade",
    damage: 17,
    reach: 90,
    cooldown: 0.52,
    knockback: 0.96,
    arc: 0.9,
    speed: 1.14,
    moveScale: 1.06,
    weight: 9,
    special: {
      type: "feint-thrust",
      summary: "Dash thrust recovers fast and is hard to read."
    }
  },
  glaive: {
    label: "Glaive",
    classLabel: "Medium",
    kind: "medium",
    summary: "Wide medium pole blade. Dash becomes a crescent slash that sweeps a larger lane.",
    design: "Crescent pole blade",
    damage: 19,
    reach: 98,
    cooldown: 0.66,
    knockback: 1.1,
    arc: 1.26,
    speed: 0.96,
    moveScale: 0.98,
    weight: 12,
    special: {
      type: "crescent-sweep",
      summary: "Dash slash covers a wider crescent arc."
    }
  },
  riftblade: {
    label: "Rift Blade",
    classLabel: "Medium",
    kind: "medium",
    summary: "A split-edged medium blade that cuts through space in two beats. Dash becomes a twin slash that catches late movement and side slips.",
    design: "Split-phase saber",
    damage: 18,
    reach: 92,
    cooldown: 0.56,
    knockback: 1.02,
    arc: 1.16,
    speed: 1.1,
    moveScale: 1.04,
    weight: 10,
    special: {
      type: "twin-dash",
      summary: "Dash becomes a two-cut pass-through slash that keeps pressure on crossing rivals."
    }
  },
  claymore: {
    label: "Claymore",
    classLabel: "Long",
    kind: "long",
    summary: "Long sweeping blade with a broad delayed cleave and strong ring-out pressure.",
    design: "Wide two-hand greatsword",
    damage: 24,
    reach: 104,
    cooldown: 0.94,
    knockback: 1.38,
    arc: 1.14,
    speed: 0.82,
    moveScale: 0.88,
    weight: 20,
    special: {
      type: "cleave-wave",
      summary: "Heavy clean hits shove harder and cover a broader front arc."
    }
  },
  meteor: {
    label: "Meteor Mace",
    classLabel: "Long",
    kind: "long",
    summary: "Long crushing head that breaks posture and slams hard through guarded lanes.",
    design: "Spiked head breaker",
    damage: 25,
    reach: 96,
    cooldown: 1.04,
    knockback: 1.54,
    arc: 0.96,
    speed: 0.74,
    moveScale: 0.82,
    weight: 24,
    special: {
      type: "crush-burst",
      summary: "Heavy hits crack stamina harder and stun on dead-on contact."
    }
  },
  guillotine: {
    label: "Guillotine",
    classLabel: "Long",
    kind: "long",
    summary: "A brutal execution pole built for deliberate front-loaded punishes. Clean heavy hits can finish open rivals at 35% or less.",
    design: "Hooked execution pole",
    damage: 27,
    reach: 108,
    cooldown: 1.02,
    knockback: 1.5,
    arc: 1.02,
    speed: 0.76,
    moveScale: 0.84,
    weight: 22,
    special: {
      type: "heavy-execute",
      threshold: 0.35,
      summary: "Heavy clean front hits execute open rivals at 35% or less."
    }
  },
  brass: {
    label: "Brass Knuckles",
    classLabel: "Special",
    kind: "special",
    summary: "Close-range combo weapon. Attack becomes a 4-hit string: right, left, right uppercut, then a heavy left finisher with huge knockback.",
    design: "Close-range fist frame",
    damage: 14,
    reach: 40,
    cooldown: 0.44,
    knockback: 1.02,
    arc: 0.82,
    speed: 1.32,
    moveScale: 1.14,
    weight: 7,
    special: {
      type: "combo-barrage",
      summary: "Attacks chain into a 4-hit combo with a strong finishing punch."
    }
  },
  thundermaul: {
    label: "Thunder Hammer",
    classLabel: "Special",
    kind: "special",
    summary: "A heavy shock hammer. Jumping and crashing down creates a ground shockwave on landing.",
    design: "Shock head war hammer",
    damage: 23,
    reach: 84,
    cooldown: 0.9,
    knockback: 1.46,
    arc: 1,
    speed: 0.8,
    moveScale: 0.88,
    weight: 21,
    special: {
      type: "shockwave-slam",
      summary: "Landing from a hammer jump sends a damaging shockwave along the ground."
    }
  },
  reaper: {
    label: "Reaper Scythe",
    classLabel: "Special",
    kind: "special",
    summary: "Hooking special weapon. Clean hits drag the rival back into your lane instead of just pushing them away.",
    design: "Hooked harvest scythe",
    damage: 20,
    reach: 102,
    cooldown: 0.78,
    knockback: 1.08,
    arc: 1.34,
    speed: 0.94,
    moveScale: 0.96,
    weight: 15,
    special: {
      type: "reaper-hook",
      summary: "Clean hits yank rivals back toward the blade."
    }
  },
  throwaxe: {
    label: "Throw Axe",
    classLabel: "Special",
    kind: "special",
    summary: "A brutal axe that can be thrown as its special. It is the only weapon here with a real ranged factor.",
    design: "Weighted throwing axe",
    damage: 18,
    reach: 76,
    cooldown: 0.62,
    knockback: 1.18,
    arc: 1.02,
    speed: 1.04,
    moveScale: 1.04,
    weight: 11,
    special: {
      type: "axe-throw",
      summary: "Dash throws the axe forward for a ranged strike, then the fighter resets to close range."
    }
  },
  tonfa: {
    label: "Tonfa",
    classLabel: "Special",
    kind: "special",
    summary: "Close guard weapon set with fast chained swings and safer block pressure.",
    design: "Twin guard batons",
    damage: 16,
    reach: 58,
    cooldown: 0.46,
    knockback: 0.94,
    arc: 1.08,
    speed: 1.22,
    moveScale: 1.08,
    weight: 8,
    special: {
      type: "tonfa-rush",
      summary: "Dash becomes a rushing baton flurry that keeps pressure close."
    }
  },
  bostaff: {
    label: "Bo Staff",
    classLabel: "Special",
    kind: "special",
    summary: "A spinning reach weapon built to vault through pressure. Dash becomes a vaulting smash that pops rivals upward.",
    design: "Long ironwood staff",
    damage: 17,
    reach: 90,
    cooldown: 0.54,
    knockback: 1.08,
    arc: 1.2,
    speed: 1.08,
    moveScale: 1.08,
    weight: 9,
    special: {
      type: "vault-smash",
      summary: "Dash vaults through space and bounces clean hits upward."
    }
  },
  morningstar: {
    label: "Morning Star",
    classLabel: "Special",
    kind: "special",
    summary: "A brutal chain-headed striker that caves in guard and hits with ugly front-loaded force.",
    design: "Spiked chain mace",
    damage: 22,
    reach: 80,
    cooldown: 0.84,
    knockback: 1.4,
    arc: 1.06,
    speed: 0.86,
    moveScale: 0.9,
    weight: 18,
    special: {
      type: "crush-burst",
      summary: "Heavy clean hits crack guard harder and leave a longer stagger."
    }
  },
  stormtalon: {
    label: "Storm Talons",
    classLabel: "Special",
    kind: "special",
    summary: "Twin storm blades built for relentless tempo. Dash becomes a fast storm rush that chains pressure and keeps the wielder moving.",
    design: "Twin wind-cut talons",
    damage: 18,
    reach: 70,
    cooldown: 0.4,
    knockback: 1.02,
    arc: 1.18,
    speed: 1.26,
    moveScale: 1.14,
    weight: 7,
    special: {
      type: "storm-rush",
      summary: "Dash turns into a fast storm rush with sharper follow-through and better tempo pressure."
    }
  },
  bulwark: {
    label: "Bulwark Brk",
    classLabel: "Special",
    kind: "special",
    summary: "A shield-maul hybrid built to smash straight through guard. Dash becomes a fortress break that crushes blocks and launches rivals away.",
    design: "Shielded breaker maul",
    damage: 24,
    reach: 82,
    cooldown: 0.9,
    knockback: 1.52,
    arc: 0.96,
    speed: 0.82,
    moveScale: 0.9,
    weight: 20,
    special: {
      type: "fortress-break",
      summary: "Dash becomes a crushing guard-break slam that shoves rivals farther and batters stamina."
    }
  },
  shadefans: {
    label: "Shade Fans",
    classLabel: "Special",
    kind: "special",
    summary: "Hidden bladed fans meant for vanish pressure. Dash slips through the rival, rear hits bite harder, and the recovery stays slippery.",
    design: "Hidden crescent fans",
    damage: 16,
    reach: 62,
    cooldown: 0.38,
    knockback: 0.88,
    arc: 1.28,
    speed: 1.28,
    moveScale: 1.18,
    weight: 5,
    special: {
      type: "veil-rush",
      backstabBonus: 1.36,
      summary: "Dash slips cleanly through pressure, and rear hits punish much harder."
    }
  },
  revolver: {
    label: "Revolver",
    classLabel: "Sidearm",
    kind: "sidearm",
    family: "ranged",
    ammoType: "bullet",
    clipSize: 6,
    chamberMax: 1,
    projectileSpeed: 780,
    reload: 0.92,
    range: 420,
    summary: "A quick sidearm with steady bullet pressure. It fits small chamber rounds and reloads fast.",
    design: "Quick-draw cylinder pistol",
    damage: 15,
    reach: 112,
    cooldown: 0.34,
    knockback: 0.88,
    arc: 0.86,
    speed: 1.18,
    moveScale: 1.08,
    weight: 7,
    special: {
      type: "ranged-sidearm",
      summary: "Fast draw pistol built for light rounds and quick reloads."
    }
  },
  handcannon: {
    label: "Hand Cannon",
    classLabel: "Sidearm",
    kind: "sidearm",
    family: "ranged",
    ammoType: "bullet",
    clipSize: 4,
    chamberMax: 2,
    projectileSpeed: 740,
    reload: 1.08,
    range: 400,
    summary: "A heavy sidearm that can carry thicker rounds and hit much harder than a standard pistol.",
    design: "Heavy frame pistol",
    damage: 20,
    reach: 104,
    cooldown: 0.42,
    knockback: 1.08,
    arc: 0.82,
    speed: 1.02,
    moveScale: 1.02,
    weight: 10,
    special: {
      type: "ranged-sidearm",
      summary: "Heavy pistol built for chambered specialty shots."
    }
  },
  machinepistol: {
    label: "Machine Pistol",
    classLabel: "Sidearm",
    kind: "sidearm",
    family: "ranged",
    ammoType: "bullet",
    clipSize: 9,
    chamberMax: 1,
    projectileSpeed: 820,
    reload: 0.82,
    range: 390,
    summary: "A tiny bullet hose built for fast close pressure. It cannot carry big chamber rounds, but it floods the lane with quick fire.",
    design: "Compact burst sidearm",
    damage: 11,
    reach: 102,
    cooldown: 0.18,
    knockback: 0.76,
    arc: 0.78,
    speed: 1.24,
    moveScale: 1.12,
    weight: 6,
    special: {
      type: "burst-sidearm",
      summary: "Fires short double taps instead of a single sidearm shot."
    }
  },
  breacher: {
    label: "Breacher",
    classLabel: "Sidearm",
    kind: "sidearm",
    family: "ranged",
    ammoType: "bullet",
    clipSize: 3,
    chamberMax: 2,
    projectileSpeed: 730,
    reload: 1.02,
    range: 350,
    summary: "A close assault sidearm that loves block-breaking ammo. It hits harder than a light pistol and excels at cracking open guard.",
    design: "Heavy breaching pistol",
    damage: 18,
    reach: 108,
    cooldown: 0.38,
    knockback: 1.06,
    arc: 0.86,
    speed: 1.04,
    moveScale: 1,
    weight: 9,
    special: {
      type: "breach-pop",
      summary: "Close shots tear through guard harder and leave rougher follow-up pressure."
    }
  },
  sawedoff: {
    label: "Sawed-Off",
    classLabel: "Sidearm",
    kind: "sidearm",
    family: "ranged",
    ammoType: "bullet",
    clipSize: 2,
    chamberMax: 1,
    projectileSpeed: 660,
    reload: 0.96,
    range: 300,
    summary: "A brutal close-range pocket shotgun. It dumps a short spread that hits hardest up close and bucks rivals back.",
    design: "Cut-down scatter gun",
    damage: 23,
    reach: 100,
    cooldown: 0.48,
    knockback: 1.24,
    arc: 0.88,
    speed: 0.98,
    moveScale: 1.04,
    weight: 9,
    special: {
      type: "scatter-burst",
      summary: "Fires a tight cone of pellets instead of a single bullet."
    }
  },
  needler: {
    label: "Needler",
    classLabel: "Sidearm",
    kind: "sidearm",
    family: "ranged",
    ammoType: "bullet",
    clipSize: 8,
    chamberMax: 1,
    projectileSpeed: 860,
    reload: 0.88,
    range: 410,
    summary: "A darting sidearm that spits quick needle bursts. It loves rupture, frost, and other control-heavy light rounds.",
    design: "Needle burst pistol",
    damage: 12,
    reach: 110,
    cooldown: 0.18,
    knockback: 0.74,
    arc: 0.78,
    speed: 1.22,
    moveScale: 1.12,
    weight: 6,
    special: {
      type: "burst-sidearm",
      summary: "Fires quick needle bursts instead of a single pistol tap."
    }
  },
  ak47: {
    label: "AK-47",
    classLabel: "Assault",
    kind: "assault",
    family: "ranged",
    ammoType: "bullet",
    clipSize: 12,
    chamberMax: 2,
    projectileSpeed: 840,
    reload: 1.22,
    range: 460,
    summary: "A medium assault rifle with balanced recoil, reliable fire, and enough room for upgraded impact setups.",
    design: "Stamped assault rifle",
    damage: 16,
    reach: 122,
    cooldown: 0.26,
    knockback: 0.92,
    arc: 0.84,
    speed: 1.1,
    moveScale: 1.02,
    weight: 12,
    special: {
      type: "ranged-assault",
      summary: "Full-size rifle built for sustained fire and upgraded rounds."
    }
  },
  burstcarbine: {
    label: "Burst Carbine",
    classLabel: "Assault",
    kind: "assault",
    family: "ranged",
    ammoType: "bullet",
    clipSize: 10,
    chamberMax: 2,
    projectileSpeed: 860,
    reload: 1.16,
    range: 470,
    summary: "A tighter medium rifle that fires sharp, stable bursts and keeps strong mid-range pressure.",
    design: "Compact burst rifle",
    damage: 15,
    reach: 120,
    cooldown: 0.24,
    knockback: 0.9,
    arc: 0.82,
    speed: 1.14,
    moveScale: 1.04,
    weight: 11,
    special: {
      type: "ranged-assault",
      summary: "Burst rifle with quick follow-up shots and strong projectile control."
    }
  },
  battlerifle: {
    label: "Battle Rifle",
    classLabel: "Assault",
    kind: "assault",
    family: "ranged",
    ammoType: "bullet",
    clipSize: 9,
    chamberMax: 2,
    projectileSpeed: 910,
    reload: 1.2,
    range: 520,
    summary: "A disciplined assault rifle with clean two-round bursts and harder lane control than a spray rifle.",
    design: "Heavy burst rifle",
    damage: 18,
    reach: 132,
    cooldown: 0.28,
    knockback: 0.98,
    arc: 0.8,
    speed: 1.04,
    moveScale: 0.98,
    weight: 13,
    special: {
      type: "ranged-assault",
      summary: "Controlled rifle bursts land harder and keep steadier range pressure."
    }
  },
  drumrifle: {
    label: "Drum Rifle",
    classLabel: "Assault",
    kind: "assault",
    family: "ranged",
    ammoType: "bullet",
    clipSize: 16,
    chamberMax: 2,
    projectileSpeed: 835,
    reload: 1.34,
    range: 500,
    summary: "A drum-fed rifle built for long spray strings. It floods the lane with four-round bursts and keeps pressure on moving rivals.",
    design: "Drum-fed spray rifle",
    damage: 14,
    reach: 128,
    cooldown: 0.2,
    knockback: 0.86,
    arc: 0.82,
    speed: 1.08,
    moveScale: 0.98,
    weight: 14,
    special: {
      type: "spray-rifle",
      summary: "Fires dense four-round bursts and keeps stronger sustained fire pressure."
    }
  },
  marksman: {
    label: "Marksman Rifle",
    classLabel: "Assault",
    kind: "assault",
    family: "ranged",
    ammoType: "bullet",
    clipSize: 7,
    chamberMax: 2,
    projectileSpeed: 930,
    reload: 1.18,
    range: 560,
    summary: "A precise long rifle that shoots slower than an assault weapon but carries harder, cleaner rounds through the lane.",
    design: "Long receiver rifle",
    damage: 19,
    reach: 142,
    cooldown: 0.34,
    knockback: 1,
    arc: 0.76,
    speed: 1.02,
    moveScale: 0.96,
    weight: 13,
    special: {
      type: "pierce-rifle",
      summary: "Precise rifle shots punch farther and pierce more cleanly."
    }
  },
  volleyrifle: {
    label: "Volley Rifle",
    classLabel: "Assault",
    kind: "assault",
    family: "ranged",
    ammoType: "bullet",
    clipSize: 14,
    chamberMax: 2,
    projectileSpeed: 850,
    reload: 1.28,
    range: 495,
    summary: "A wide-control assault rifle that fires disciplined five-round sprays and thrives on concussion or rupture ammo.",
    design: "Long gas-piston rifle",
    damage: 14,
    reach: 126,
    cooldown: 0.22,
    knockback: 0.88,
    arc: 0.82,
    speed: 1.08,
    moveScale: 0.98,
    weight: 13,
    special: {
      type: "spray-rifle",
      summary: "Fires longer spray strings that flood the lane and keep moving rivals pinned down."
    }
  },
  longshot: {
    label: "Longshot",
    classLabel: "Assault",
    kind: "assault",
    family: "ranged",
    ammoType: "bullet",
    clipSize: 5,
    chamberMax: 2,
    projectileSpeed: 980,
    reload: 1.24,
    range: 590,
    summary: "A rangy precision rifle tuned for slow punishing shots, deep pierce work, and hard long-lane confirms.",
    design: "Long-barrel precision rifle",
    damage: 22,
    reach: 150,
    cooldown: 0.44,
    knockback: 1.06,
    arc: 0.74,
    speed: 0.98,
    moveScale: 0.92,
    weight: 15,
    special: {
      type: "scope-shot",
      summary: "Heavy long-lane shots fly fast, hit hard, and keep stronger pierce pressure."
    }
  },
  linebreaker: {
    label: "Linebreaker",
    classLabel: "Assault",
    kind: "assault",
    family: "ranged",
    ammoType: "bullet",
    clipSize: 8,
    chamberMax: 2,
    projectileSpeed: 920,
    reload: 1.22,
    range: 545,
    summary: "A hard-duty lane rifle built to crack straight through cover, guard, and stacked targets with mean precision rounds.",
    design: "Reinforced battle rifle",
    damage: 20,
    reach: 144,
    cooldown: 0.36,
    knockback: 1.02,
    arc: 0.76,
    speed: 1,
    moveScale: 0.96,
    weight: 14,
    special: {
      type: "pierce-rifle",
      summary: "Precision line shots pierce deeper and hammer blocks harder down the lane."
    }
  },
  sniper: {
    label: "Sniper",
    classLabel: "Assault",
    kind: "assault",
    family: "ranged",
    ammoType: "bullet",
    clipSize: 3,
    chamberMax: 2,
    projectileSpeed: 1040,
    reload: 1.34,
    range: 640,
    summary: "A long-lane rifle built for hard single shots. It fires slowly, but it owns the far end of the arena.",
    design: "Long scope rifle",
    damage: 28,
    reach: 158,
    cooldown: 0.66,
    knockback: 1.28,
    arc: 0.7,
    speed: 0.92,
    moveScale: 0.82,
    weight: 16,
    special: {
      type: "scope-shot",
      summary: "Single heavy shots fly fast, hit hard, and pierce deep through the lane."
    }
  },
  siegecannon: {
    label: "Siege Cannon",
    classLabel: "Heavy",
    kind: "heavy",
    family: "ranged",
    ammoType: "bullet",
    clipSize: 3,
    chamberMax: 3,
    projectileSpeed: 720,
    reload: 1.56,
    range: 500,
    summary: "A huge heavy firearm built for thick impact chambers, brutal knockback, and crushing single-shot hits.",
    design: "Oversized siege rifle",
    damage: 26,
    reach: 136,
    cooldown: 0.58,
    knockback: 1.36,
    arc: 0.8,
    speed: 0.9,
    moveScale: 0.84,
    weight: 22,
    special: {
      type: "ranged-heavy",
      summary: "Heavy cannon that carries the largest chamber rounds."
    }
  },
  ironhowl: {
    label: "Iron Howl",
    classLabel: "Heavy",
    kind: "heavy",
    family: "ranged",
    ammoType: "bullet",
    clipSize: 5,
    chamberMax: 3,
    projectileSpeed: 760,
    reload: 1.42,
    range: 490,
    summary: "A strong heavy rifle with a little more room to fire repeatedly before reloading.",
    design: "Heavy breaker rifle",
    damage: 22,
    reach: 130,
    cooldown: 0.46,
    knockback: 1.22,
    arc: 0.82,
    speed: 0.96,
    moveScale: 0.9,
    weight: 18,
    special: {
      type: "ranged-heavy",
      summary: "Heavy rifle tuned for stronger knockback and larger payloads."
    }
  },
  flakcannon: {
    label: "Flak Cannon",
    classLabel: "Heavy",
    kind: "heavy",
    family: "ranged",
    ammoType: "bullet",
    clipSize: 2,
    chamberMax: 3,
    projectileSpeed: 690,
    reload: 1.62,
    range: 450,
    summary: "A brutal heavy gun that fires a fan of payload shards. It owns mid range and loves explosive or scatter chamber work.",
    design: "Wide-mouth flak gun",
    damage: 24,
    reach: 138,
    cooldown: 0.62,
    knockback: 1.28,
    arc: 0.82,
    speed: 0.86,
    moveScale: 0.8,
    weight: 24,
    special: {
      type: "flak-cannon",
      summary: "Each shot spreads into a short flak fan instead of a single heavy slug."
    }
  },
  minigun: {
    label: "Minigun",
    classLabel: "Heavy",
    kind: "heavy",
    family: "ranged",
    ammoType: "bullet",
    clipSize: 18,
    chamberMax: 2,
    projectileSpeed: 800,
    reload: 1.86,
    range: 500,
    summary: "A spinning heavy stream gun built for relentless pressure. It chews through ammo fast and loves sustained fire.",
    design: "Rotary barrel gun",
    damage: 12,
    reach: 132,
    cooldown: 0.1,
    knockback: 0.82,
    arc: 0.8,
    speed: 0.92,
    moveScale: 0.76,
    weight: 26,
    special: {
      type: "spin-stream",
      summary: "Spools into a dense stream of shots when you keep firing."
    }
  },
  thumper: {
    label: "Thumper",
    classLabel: "Heavy",
    kind: "heavy",
    family: "ranged",
    ammoType: "bullet",
    clipSize: 4,
    chamberMax: 3,
    projectileSpeed: 710,
    reload: 1.5,
    range: 480,
    summary: "A brutal slug launcher that slams rivals backward and leaves them slowed after clean body hits.",
    design: "Thick-bore slug cannon",
    damage: 25,
    reach: 140,
    cooldown: 0.56,
    knockback: 1.34,
    arc: 0.8,
    speed: 0.9,
    moveScale: 0.82,
    weight: 23,
    special: {
      type: "quake-shell",
      summary: "Heavy slug hits shove harder and leave extra slow pressure."
    }
  },
  crusher: {
    label: "Crusher",
    classLabel: "Heavy",
    kind: "heavy",
    family: "ranged",
    ammoType: "bullet",
    clipSize: 3,
    chamberMax: 3,
    projectileSpeed: 700,
    reload: 1.58,
    range: 470,
    summary: "A siege breaker that fires compact ruin slugs. It is slow and heavy, but every clean hit caves in space and posture.",
    design: "Ruin-bore cannon",
    damage: 27,
    reach: 142,
    cooldown: 0.6,
    knockback: 1.4,
    arc: 0.8,
    speed: 0.88,
    moveScale: 0.8,
    weight: 24,
    special: {
      type: "quake-shell",
      summary: "Heavy ruin slugs shove harder, slow harder, and batter blocks on contact."
    }
  },
  longbow: {
    label: "Longbow",
    classLabel: "Special Gun",
    kind: "gun-special",
    family: "ranged",
    ammoType: "bolt",
    clipSize: 1,
    chamberMax: 2,
    projectileSpeed: 700,
    reload: 0.74,
    range: 520,
    summary: "A special bow that fires bolts instead of bullets. It reloads one powerful arrow at a time.",
    design: "Drawn recurve bow",
    damage: 19,
    reach: 140,
    cooldown: 0.44,
    knockback: 1.04,
    arc: 0.9,
    speed: 1.02,
    moveScale: 1,
    weight: 8,
    special: {
      type: "bolt-shot",
      summary: "Fires single loaded bolts with strong flight control."
    }
  },
  crossbow: {
    label: "Crossbow",
    classLabel: "Special Gun",
    kind: "gun-special",
    family: "ranged",
    ammoType: "bolt",
    clipSize: 1,
    chamberMax: 2,
    projectileSpeed: 820,
    reload: 0.88,
    range: 500,
    summary: "A special crossbow that fires fast bolts and hits harder than a bow at point-blank range.",
    design: "Cranked heavy crossbow",
    damage: 21,
    reach: 134,
    cooldown: 0.48,
    knockback: 1.12,
    arc: 0.84,
    speed: 0.98,
    moveScale: 0.96,
    weight: 11,
    special: {
      type: "bolt-shot",
      summary: "Cranked bolt launcher with harder direct hits."
    }
  },
  warbow: {
    label: "Warbow",
    classLabel: "Special Gun",
    kind: "gun-special",
    family: "ranged",
    ammoType: "bolt",
    clipSize: 1,
    chamberMax: 2,
    projectileSpeed: 760,
    reload: 0.84,
    range: 560,
    summary: "A heavier bow with longer lane control. Each bolt lands harder and loves deep pierce or delayed tip builds.",
    design: "Heavy war bow",
    damage: 23,
    reach: 148,
    cooldown: 0.52,
    knockback: 1.18,
    arc: 0.88,
    speed: 0.96,
    moveScale: 0.94,
    weight: 10,
    special: {
      type: "deep-pierce",
      summary: "Heavy bow bolts push through targets and keep stronger knockback."
    }
  },
  stormbow: {
    label: "Storm Bow",
    classLabel: "Special Gun",
    kind: "gun-special",
    family: "ranged",
    ammoType: "bolt",
    clipSize: 2,
    chamberMax: 3,
    projectileSpeed: 840,
    reload: 0.92,
    range: 570,
    summary: "A split-limb storm bow that throws a short bolt fan and leans into arc and shiver rune builds.",
    design: "Storm-limbed split bow",
    damage: 20,
    reach: 146,
    cooldown: 0.42,
    knockback: 1.02,
    arc: 0.88,
    speed: 1.02,
    moveScale: 0.98,
    weight: 9,
    special: {
      type: "stormbow-shot",
      summary: "Fires a short storm volley and adds extra charged pressure."
    }
  },
  emberbow: {
    label: "Ember Bow",
    classLabel: "Special Gun",
    kind: "gun-special",
    family: "ranged",
    ammoType: "bolt",
    clipSize: 1,
    chamberMax: 3,
    projectileSpeed: 790,
    reload: 0.82,
    range: 550,
    summary: "A furnace bow that throws hotter, meaner shots. It leans into flare, bloom, and harsh close confirms.",
    design: "Furnace recurve bow",
    damage: 21,
    reach: 146,
    cooldown: 0.46,
    knockback: 1.08,
    arc: 0.88,
    speed: 1,
    moveScale: 0.98,
    weight: 9,
    special: {
      type: "bolt-shot",
      summary: "Fires a single heated bolt with brighter trail pressure and stronger burst potential."
    }
  },
  moonbow: {
    label: "Moon Bow",
    classLabel: "Special Gun",
    kind: "gun-special",
    family: "ranged",
    ammoType: "bolt",
    clipSize: 2,
    chamberMax: 3,
    projectileSpeed: 830,
    reload: 0.88,
    range: 560,
    summary: "A phase-cut hunting bow that sends paired crescent bolts and leans into bloom, phase, and shiver builds.",
    design: "Phase crescent bow",
    damage: 19,
    reach: 144,
    cooldown: 0.4,
    knockback: 1,
    arc: 0.88,
    speed: 1.04,
    moveScale: 1.02,
    weight: 8,
    special: {
      type: "bolt-burst",
      summary: "Releases paired crescent bolts that cover a broader lane than a normal bow shot."
    }
  },
  boltcaster: {
    label: "Boltcaster",
    classLabel: "Special Gun",
    kind: "gun-special",
    family: "ranged",
    ammoType: "bolt",
    clipSize: 3,
    chamberMax: 2,
    projectileSpeed: 840,
    reload: 0.94,
    range: 520,
    summary: "A three-rack crossbow rig built for repeated bolt pressure. It cycles harder than a repeater and loves loaded control shots.",
    design: "Three-rack siege crossbow",
    damage: 18,
    reach: 132,
    cooldown: 0.36,
    knockback: 1,
    arc: 0.82,
    speed: 1.02,
    moveScale: 0.96,
    weight: 11,
    special: {
      type: "bolt-burst",
      summary: "Fires chained bolt bursts with steadier rack pressure than a standard crossbow."
    }
  },
  repeater: {
    label: "Repeater Crossbow",
    classLabel: "Special Gun",
    kind: "gun-special",
    family: "ranged",
    ammoType: "bolt",
    clipSize: 2,
    chamberMax: 2,
    projectileSpeed: 800,
    reload: 0.86,
    range: 500,
    summary: "A fast cycling crossbow that throws paired bolts before it has to reload the rig.",
    design: "Twin-limb repeater crossbow",
    damage: 17,
    reach: 126,
    cooldown: 0.34,
    knockback: 0.96,
    arc: 0.82,
    speed: 1.06,
    moveScale: 0.98,
    weight: 10,
    special: {
      type: "bolt-burst",
      summary: "Fires quick paired bolts instead of a single heavy shot."
    }
  },
  harpoon: {
    label: "Harpoon Launcher",
    classLabel: "Special Gun",
    kind: "gun-special",
    family: "ranged",
    ammoType: "bolt",
    clipSize: 1,
    chamberMax: 2,
    projectileSpeed: 760,
    reload: 0.98,
    range: 540,
    summary: "A brutal line launcher built to drag targets out of position with hard tether-like hits.",
    design: "Barbed harpoon launcher",
    damage: 22,
    reach: 146,
    cooldown: 0.54,
    knockback: 1.14,
    arc: 0.82,
    speed: 0.96,
    moveScale: 0.92,
    weight: 12,
    special: {
      type: "harpoon-shot",
      summary: "Clean hits reel rivals back toward the shooter."
    }
  },
  ballista: {
    label: "Ballista",
    classLabel: "Special Gun",
    kind: "gun-special",
    family: "ranged",
    ammoType: "bolt",
    clipSize: 1,
    chamberMax: 3,
    projectileSpeed: 900,
    reload: 1.18,
    range: 620,
    summary: "A siege bolt thrower that fires huge piercing shots. It is slow to cycle, but each bolt owns the lane.",
    design: "Mounted siege ballista",
    damage: 27,
    reach: 162,
    cooldown: 0.62,
    knockback: 1.36,
    arc: 0.76,
    speed: 0.88,
    moveScale: 0.84,
    weight: 18,
    special: {
      type: "ballista-shot",
      summary: "Massive bolts pierce deeper, hit harder, and launch rivals farther."
    }
  },
  railgun: {
    label: "Railgun",
    classLabel: "Special Gun",
    kind: "gun-special",
    family: "ranged",
    ammoType: "rail",
    clipSize: 3,
    chamberMax: 3,
    projectileSpeed: 980,
    reload: 1.38,
    range: 580,
    summary: "A special rail weapon that fires rails instead of bullets. It works best with shock or poison emitters.",
    design: "Charged rail launcher",
    damage: 24,
    reach: 150,
    cooldown: 0.52,
    knockback: 1.2,
    arc: 0.72,
    speed: 0.94,
    moveScale: 0.9,
    weight: 17,
    special: {
      type: "rail-shot",
      summary: "Rail launcher that favors emitter rounds like shock and poison."
    }
  },
  coillance: {
    label: "Coil Lance",
    classLabel: "Special Gun",
    kind: "gun-special",
    family: "ranged",
    ammoType: "rail",
    clipSize: 2,
    chamberMax: 3,
    projectileSpeed: 1040,
    reload: 1.44,
    range: 620,
    summary: "A piercing rail lance built around sharp emitter rails. It fires fewer shots, but they tear straight through the lane.",
    design: "Lance rail driver",
    damage: 26,
    reach: 156,
    cooldown: 0.58,
    knockback: 1.26,
    arc: 0.68,
    speed: 0.9,
    moveScale: 0.86,
    weight: 19,
    special: {
      type: "rail-lance",
      summary: "Charge rails punch through more targets and carry stronger emitter effects."
    }
  },
  arcrail: {
    label: "Arc Rail",
    classLabel: "Special Gun",
    kind: "gun-special",
    family: "ranged",
    ammoType: "rail",
    clipSize: 3,
    chamberMax: 3,
    projectileSpeed: 1020,
    reload: 1.32,
    range: 600,
    summary: "A shock-focused rail weapon that overwhelms rivals with fast charged lines and extra stun pressure.",
    design: "Split-prong arc rail",
    damage: 22,
    reach: 152,
    cooldown: 0.44,
    knockback: 1.08,
    arc: 0.7,
    speed: 1,
    moveScale: 0.92,
    weight: 16,
    special: {
      type: "arc-rail",
      summary: "Rail hits carry extra shock and stun even before custom emitter tuning."
    }
  },
  ionrail: {
    label: "Ion Rail",
    classLabel: "Special Gun",
    kind: "gun-special",
    family: "ranged",
    ammoType: "rail",
    clipSize: 4,
    chamberMax: 3,
    projectileSpeed: 1040,
    reload: 1.28,
    range: 610,
    summary: "A fast ion rail built to overwhelm with chained charge lines and brutal stun pressure.",
    design: "Ion fork rail",
    damage: 21,
    reach: 148,
    cooldown: 0.36,
    knockback: 1.02,
    arc: 0.7,
    speed: 1.08,
    moveScale: 0.94,
    weight: 15,
    special: {
      type: "arc-rail",
      summary: "Overloads the lane with faster charged lines and even more shock pressure."
    }
  },
  prismrail: {
    label: "Prism Rail",
    classLabel: "Special Gun",
    kind: "gun-special",
    family: "ranged",
    ammoType: "rail",
    clipSize: 3,
    chamberMax: 3,
    projectileSpeed: 1010,
    reload: 1.36,
    range: 600,
    summary: "A phase-cut rail projector that splits into twin lines and leans hard into portal, phase, and redirect builds.",
    design: "Prism phase rail",
    damage: 23,
    reach: 154,
    cooldown: 0.48,
    knockback: 1.1,
    arc: 0.7,
    speed: 0.98,
    moveScale: 0.9,
    weight: 17,
    special: {
      type: "phase-rail",
      summary: "Fires split phase rails and adds extra portal-shift pressure."
    }
  },
  ghostrail: {
    label: "Ghost Rail",
    classLabel: "Special Gun",
    kind: "gun-special",
    family: "ranged",
    ammoType: "rail",
    clipSize: 3,
    chamberMax: 3,
    projectileSpeed: 1000,
    reload: 1.3,
    range: 610,
    summary: "A ghost-cut phase projector that bends rails through the lane and loves portal, revenant, and redirect work.",
    design: "Ghost-phase rail",
    damage: 22,
    reach: 150,
    cooldown: 0.44,
    knockback: 1.04,
    arc: 0.7,
    speed: 1,
    moveScale: 0.92,
    weight: 16,
    special: {
      type: "phase-rail",
      summary: "Phase rails shift rivals harder and ride warped lane control more aggressively."
    }
  },
  "tempest-edge": {
    label: "Tempest Edge",
    classLabel: "Special",
    kind: "special",
    masteryStyle: "tempest",
    summary: "Tempest mastery weapon. A fast storm blade that keeps pressure moving and rewards tempo control.",
    design: "Mastery storm blade",
    damage: 22,
    reach: 94,
    cooldown: 0.54,
    knockback: 1.18,
    arc: 1.16,
    speed: 1.14,
    moveScale: 1.12,
    weight: 10,
    special: {
      type: "storm-rush",
      summary: "Mastery dash cuts harder and recovers faster."
    }
  },
  "bastion-maul": {
    label: "Bastion Maul",
    classLabel: "Special",
    kind: "special",
    masteryStyle: "bastion",
    summary: "Bastion mastery weapon. A crushing maul built for blocks, shock, and ugly close finishes.",
    design: "Mastery wall maul",
    damage: 26,
    reach: 88,
    cooldown: 0.96,
    knockback: 1.6,
    arc: 1.02,
    speed: 0.82,
    moveScale: 0.86,
    weight: 24,
    special: {
      type: "fortress-break",
      summary: "Mastery heavy hits shatter guard harder and slam rivals farther."
    }
  },
  "phantom-fang": {
    label: "Phantom Fang",
    classLabel: "Special",
    kind: "special",
    masteryStyle: "phantom",
    summary: "Phantom mastery weapon. A hidden fang blade built for evasions, back cuts, and vanish pressure.",
    design: "Mastery shadow fang",
    damage: 18,
    reach: 64,
    cooldown: 0.36,
    knockback: 0.92,
    arc: 1.24,
    speed: 1.32,
    moveScale: 1.18,
    weight: 6,
    special: {
      type: "veil-rush",
      backstabBonus: 1.42,
      summary: "Mastery dash and rear hits become much deadlier."
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
    summary: "Balanced blades with pass-through dash slashes and built-in weapon traits."
  },
  short: {
    label: "Short",
    summary: "Close-range blades with back-hit damage, stealthier crouches, and fast dash chains."
  },
  special: {
    label: "Special",
    summary: "Unique weapons with custom abilities and custom forge drills."
  },
  sidearm: {
    label: "Sidearm",
    summary: "Quick secondary-feel guns with light ammo, fast reloads, and smaller chamber limits."
  },
  assault: {
    label: "Assault",
    summary: "Medium rifles like an AK-47. They handle upgraded rounds well and keep steady fire."
  },
  heavy: {
    label: "Heavy",
    summary: "Large heavy guns built for huge payloads, strong knockback, and slower reloads."
  },
  "gun-special": {
    label: "Special Gun",
    summary: "Bows, crossbows, and railguns. They use bolts or rails instead of normal bullets."
  }
};

const weaponFamilyCatalog = {
  melee: {
    label: "Melee",
    summary: "Close-range weapons with built-in weapon traits."
  },
  ranged: {
    label: "Ranged",
    summary: "Projectile weapons with ammo setup, reloads, and shot behavior."
  }
};

const impactMountCatalog = {
  core: { label: "Core Chamber", summary: "A straight chamber stack for simple rounds." },
  ring: { label: "Ring Chamber", summary: "A wrapped chamber layout used for portal or emitter rounds." },
  split: { label: "Split Chamber", summary: "A split payload shell used for shrapnel and mixed impacts." }
};

const impactTypeCatalog = {
  standard: {
    label: "Standard",
    summary: "A clean direct hit with no extra payload behavior.",
    minChambers: 1,
    allowedMounts: ["core", "ring", "split"]
  },
  breach: {
    label: "Breach",
    summary: "A block-cracking payload built to wreck guard and punch rivals back harder.",
    minChambers: 1,
    allowedMounts: ["core", "split"],
    ammoFamilies: ["bullet"]
  },
  explosive: {
    label: "Explosive",
    summary: "Detonates on impact and damages a small area around the hit.",
    minChambers: 2,
    allowedMounts: ["core", "split"]
  },
  shrapnel: {
    label: "Shrapnel",
    summary: "Bursts into fragments on impact and scatters extra damage.",
    minChambers: 2,
    allowedMounts: ["split"]
  },
  scatter: {
    label: "Scatter",
    summary: "Breaks into a short-range pellet bloom that is brutal up close and rough on guard.",
    minChambers: 2,
    allowedMounts: ["split"],
    ammoFamilies: ["bullet"]
  },
  portal: {
    label: "Portal",
    summary: "Creates a brief portal pulse that shifts the rival's position on impact.",
    minChambers: 3,
    allowedMounts: ["ring", "split"]
  },
  imploder: {
    label: "Imploder",
    summary: "Pulls the rival back toward the shot line instead of only blowing them away.",
    minChambers: 2,
    allowedMounts: ["ring", "split"]
  },
  shock: {
    label: "Shock",
    summary: "Charges the payload and adds stun on impact. Railguns love this.",
    minChambers: 2,
    allowedMounts: ["ring", "core"],
    ammoFamilies: ["rail"]
  },
  poison: {
    label: "Poison",
    summary: "Leaves the hit target poisoned for damage over time.",
    minChambers: 2,
    allowedMounts: ["ring", "split"],
    ammoFamilies: ["rail", "bolt"]
  },
  rupture: {
    label: "Rupture",
    summary: "Cracks on impact, drains guard harder, and can trigger a delayed second bite after the first hit.",
    minChambers: 2,
    allowedMounts: ["core", "split"],
    ammoFamilies: ["bullet", "rail"]
  },
  frost: {
    label: "Frost",
    summary: "Cold payload that leaves a pale wake and slows the lane with a freezing burst on impact.",
    minChambers: 2,
    allowedMounts: ["ring", "core"],
    ammoFamilies: ["bullet", "bolt"]
  },
  concussion: {
    label: "Concussion",
    summary: "Rattles the rival on impact, adding extra stun and a harsher launch without needing a full explosive shell.",
    minChambers: 2,
    allowedMounts: ["core", "ring"],
    ammoFamilies: ["bullet", "bolt"]
  },
  anchor: {
    label: "Anchor",
    summary: "Hooks into the target, drags them off line, and leaves the hit slowed for uglier follow-up pressure.",
    minChambers: 2,
    allowedMounts: ["ring", "split"],
    ammoFamilies: ["bullet", "bolt"]
  }
};

const launchTypeCatalog = {
  standard: { label: "Standard Powder", summary: "Normal launch smoke and steady shot speed.", speed: 0, damage: 0 },
  blizzard: { label: "Blizzard Powder", summary: "Launch smoke turns into a freezing trail that slows rivals.", speed: -20, damage: 0 },
  overdrive: { label: "Overdrive Powder", summary: "Punches the round out faster for sharper travel.", speed: 110, damage: 1 },
  ember: { label: "Ember Powder", summary: "Leaves a hot flare behind the muzzle and adds burn pressure.", speed: 40, damage: 2 },
  storm: { label: "Storm Powder", summary: "Cracks with charged smoke and boosts shock or heavy impact pressure.", speed: 55, damage: 1 },
  hush: { label: "Hush Powder", summary: "Soft launch smoke keeps the shot steadier and a little harder to read.", speed: 20, damage: 0 },
  quake: { label: "Quake Powder", summary: "A heavy powder burst that trades speed for harsher shove and block crack.", speed: -30, damage: 2, knockback: 0.1, stormTrail: true }
};

const midAirTypeCatalog = {
  none: { label: "None", summary: "The shot flies straight with no extra mid-flight tech." },
  magnetized: { label: "Magnetized", summary: "Pulls harder toward the rival and accelerates mid-air." },
  redirect: { label: "Redirect", summary: "Mid-flight the round snaps once toward the opponent." },
  stabilizer: { label: "Stabilizer", summary: "Keeps the shot truer and faster across the lane." },
  spiral: { label: "Spiral", summary: "Makes the round weave through the lane and become harder to read." },
  glide: { label: "Glide", summary: "Carries speed longer and keeps the shot flatter down the lane." },
  tracer: { label: "Tracer", summary: "Burns a visible line through the lane, helping the shot stay fast and clean." }
};

const tipTypeCatalog = {
  blunt: { label: "Blunt", summary: "Breaks blocks harder and launches rivals farther.", damage: 0, knockback: 0.22, blockDrain: 8 },
  sharp: { label: "Sharp", summary: "Pierces through the target and can keep flying.", damage: 2, knockback: 0.04, blockDrain: 2 },
  spiked: { label: "Spiked", summary: "Sticks in the rival and triggers a delayed extra burst.", damage: 1, knockback: 0.1, blockDrain: 4 },
  drill: { label: "Drill", summary: "Drills through blocks and boosts piercing pressure.", damage: 1, knockback: 0.08, blockDrain: 7 },
  forked: { label: "Forked", summary: "Hooks into the target, bumps knockback, and roughs up guard on contact.", damage: 1, knockback: 0.14, blockDrain: 5 },
  serrated: { label: "Serrated", summary: "Tears into the hit and leaves a rough delayed rip after the first contact.", damage: 1, knockback: 0.08, blockDrain: 4, delayedImpact: true }
};

const specialImpactMountCatalog = {
  spine: { label: "Rune Spine", summary: "A straight sigil spine for clean bolt and rail builds." },
  halo: { label: "Halo Cage", summary: "A circular cage for phase, venom, and arc infusions." },
  lattice: { label: "Lattice Frame", summary: "A split lattice for exotic mixed payloads and unstable shot behavior." }
};

const specialPayloadTypeCatalog = {
  focus: {
    label: "Focus Rune",
    summary: "A direct damage rune that keeps the shot clean, fast, and sharp.",
    minChambers: 1,
    allowedMounts: ["spine", "halo", "lattice"]
  },
  tether: {
    label: "Tether Rune",
    summary: "Hooks into the rival and drags them back toward the shot line.",
    minChambers: 1,
    allowedMounts: ["spine", "lattice"],
    ammoFamilies: ["bolt"]
  },
  burst: {
    label: "Burst Rune",
    summary: "Splits the shot into a close-range bloom after impact or on release.",
    minChambers: 2,
    allowedMounts: ["lattice"],
    ammoFamilies: ["bolt"]
  },
  phase: {
    label: "Phase Rune",
    summary: "Slides through the lane and shifts the rival's position on contact.",
    minChambers: 2,
    allowedMounts: ["halo", "lattice"]
  },
  venom: {
    label: "Venom Rune",
    summary: "Loads the shot with a lingering poison effect.",
    minChambers: 2,
    allowedMounts: ["halo", "spine"],
    ammoFamilies: ["bolt", "rail"]
  },
  arc: {
    label: "Arc Rune",
    summary: "Electrifies the shot and increases stun pressure. Rail weapons thrive on it.",
    minChambers: 2,
    allowedMounts: ["halo", "spine"],
    ammoFamilies: ["rail", "bolt"]
  },
  fracture: {
    label: "Fracture Rune",
    summary: "Turns the shot into a guard-breaking hammer line with extra shove.",
    minChambers: 1,
    allowedMounts: ["spine", "lattice"]
  },
  revenant: {
    label: "Revenant Rune",
    summary: "Adds a hungry after-image that can redirect and keep chasing the rival.",
    minChambers: 3,
    allowedMounts: ["halo", "lattice"]
  },
  bloom: {
    label: "Bloom Rune",
    summary: "Opens the shot into a wider petal bloom after a clean line through the lane.",
    minChambers: 2,
    allowedMounts: ["halo", "lattice"],
    ammoFamilies: ["bolt", "rail"]
  },
  shiver: {
    label: "Shiver Rune",
    summary: "Cold rune that leaves a pale wake and slows the hit line with freezing pressure.",
    minChambers: 2,
    allowedMounts: ["spine", "halo"],
    ammoFamilies: ["bolt", "rail"]
  },
  snare: {
    label: "Snare Rune",
    summary: "Wraps the shot in tethered chill, making it tug, slow, and cling longer after a clean hit.",
    minChambers: 2,
    allowedMounts: ["halo", "lattice"],
    ammoFamilies: ["bolt", "rail"]
  },
  flare: {
    label: "Flare Rune",
    summary: "Builds a bright volatile burst that heats the shot line, adds splash pressure, and leaves a hotter trail in the air.",
    minChambers: 2,
    allowedMounts: ["spine", "halo"],
    ammoFamilies: ["bolt", "rail"]
  }
};

const specialDriveTypeCatalog = {
  draw: { label: "Draw Tension", summary: "Balanced draw or charge with stable travel.", speed: 0, damage: 0 },
  snap: { label: "Snap Release", summary: "Fast release that kicks the shot out harder and quicker.", speed: 90, damage: 1 },
  winch: { label: "Winch Pull", summary: "Heavy release that hits harder and yanks more on tethered shots.", speed: -18, damage: 2, knockback: 0.08 },
  coil: { label: "Coil Charge", summary: "Charged drive that accelerates rails and boosts arc pressure.", speed: 72, damage: 1, stormTrail: true },
  mist: { label: "Mist Veil", summary: "Softens the release and hides the line with a cold drifting wake.", speed: 24, damage: 0, blizzardTrail: true },
  surge: { label: "Surge Drive", summary: "Violent release with the fastest launch and a bright charged wake.", speed: 118, damage: 1, stormTrail: true }
};

const specialFieldTypeCatalog = {
  none: { label: "None", summary: "No extra field work. The shot keeps its base line." },
  fletch: { label: "Fletch Array", summary: "Stabilizes the body and carries speed better down the lane." },
  seeker: { label: "Seeker Rune", summary: "Pulls the shot toward the rival once it is airborne." },
  "phase-trim": { label: "Phase Trim", summary: "Lets the shot cut across the lane and redirect mid-flight." },
  arcwake: { label: "Arc Wake", summary: "Builds a charged trail that sharpens shock pressure." },
  afterimage: { label: "Afterimage", summary: "Leaves a ghost line behind the shot and makes it harder to read." },
  glide: { label: "Glide Trim", summary: "Keeps the shot flatter and smoother across the arena." },
  splitter: { label: "Splitter Lattice", summary: "Destabilizes the line into a split bloom or wider burst mid-flight." },
  echo: { label: "Echo Field", summary: "Leaves a phantom follow line that can keep chasing after redirects." }
};

const specialHeadTypeCatalog = {
  broadhead: { label: "Broadhead", summary: "Wide hunting head with stronger raw damage and heavier impact.", damage: 2, knockback: 0.08, blockDrain: 2 },
  barbed: { label: "Barbed Head", summary: "Bites in and lingers on contact, increasing delayed pressure.", damage: 1, knockback: 0.12, blockDrain: 4 },
  needle: { label: "Needle Head", summary: "Thin piercing head built for speed and deep line penetration.", damage: 1, knockback: 0.04, blockDrain: 2, pierce: 2, speed: 40 },
  anchor: { label: "Anchor Head", summary: "Heavy hook head that drags harder and crushes blocks.", damage: 1, knockback: 0.2, blockDrain: 8 },
  prism: { label: "Prism Head", summary: "An unstable crystal tip that bends shots into stranger phase behavior.", damage: 0, knockback: 0.08, blockDrain: 3, portal: 1 },
  crescent: { label: "Crescent Head", summary: "Curved cutting head that sweeps wider and chews blocks harder.", damage: 1, knockback: 0.12, blockDrain: 5 },
  injector: { label: "Injector Head", summary: "Needle injector that buries venom or arc effects deeper into the target.", damage: 1, knockback: 0.04, blockDrain: 2, pierce: 1 }
};

const specialAmmoRigCatalog = {
  "bow-rig": {
    slotTags: ["Nock", "Shaft", "Head"],
    shotWord: "arrow",
    headWord: "arrowhead",
    noMidAirLabel: "No Flight Bindings",
    descriptor: "Bow ammo is light, clean, and flight-focused. It rewards draw tuning, glide, and line control more than raw shove.",
    capacityScale: 0.55,
    previewMode: "bow",
    labels: {
      familyTag: "Bow Workshop",
      note:
        "Bows craft rune arrows: tune the shaft rig, socket runes down the arrow body, braid the flight, then stack arrows into the quiver order.",
      chambers: "Arrow Sockets",
      mount: "Shaft Rig",
      impacts: "Per-Socket Runes",
      launch: "Draw Style",
      midAir: "Flight Bindings",
      tip: "Arrowhead",
      preload: "Quiver Load",
      recipe: "Arrow",
      impactsChip: "Runes",
      midAirChip: "Bindings",
      detailMount: "Arrow Rig",
      detailStack: "Rune Spine",
      detailLaunch: "Draw",
      detailMidAir: "Flight Weave",
      detailTip: "Arrowhead",
      slotUnit: "Socket"
    },
    mountCatalog: pickCatalogEntries(specialImpactMountCatalog, ["spine", "halo", "lattice"], {
      spine: { label: "Arrow Spine", summary: "A straight shaft rig for clean bow arrows." },
      halo: { label: "Feather Halo", summary: "A wrapped feather ring for phase and shiver bow work." },
      lattice: { label: "Split Nock", summary: "A split bow nock for bloom and burst arrow builds." }
    }),
    impactCatalog: pickCatalogEntries(specialPayloadTypeCatalog, ["focus", "burst", "phase", "arc", "bloom", "shiver", "snare", "flare"]),
    launchCatalog: pickCatalogEntries(specialDriveTypeCatalog, ["draw", "snap", "mist"], {
      draw: { label: "Balanced Draw" },
      snap: { label: "Snap Draw" },
      mist: { label: "Mist Draw" }
    }),
    fieldCatalog: pickCatalogEntries(specialFieldTypeCatalog, ["none", "fletch", "seeker", "afterimage", "glide"]),
    headCatalog: pickCatalogEntries(specialHeadTypeCatalog, ["broadhead", "needle", "crescent", "barbed"]),
    defaults: {
      mount: "spine",
      impact: "focus",
      launch: "draw",
      tip: "broadhead"
    }
  },
  "crossbow-rig": {
    slotTags: ["Latch", "Body", "Head"],
    shotWord: "bolt",
    headWord: "bolt head",
    noMidAirLabel: "No Flight Rails",
    descriptor: "Crossbow ammo is denser and more mechanical. It trades some elegance for heavier latch force, guard strain, and direct punch.",
    capacityScale: 1,
    previewMode: "crossbow",
    labels: {
      familyTag: "Crossbow Workshop",
      note:
        "Crossbows build heavier bolt loads: brace the bolt body, seat payloads into the frame, crank the latch drive, then line the bolt with flight rails before loading the magazine.",
      chambers: "Bolt Bays",
      mount: "Bolt Chassis",
      impacts: "Per-Bay Payloads",
      launch: "Latch Drive",
      midAir: "Flight Rails",
      tip: "Bolt Head",
      preload: "Magazine Load",
      recipe: "Bolt",
      impactsChip: "Payloads",
      midAirChip: "Rails",
      detailMount: "Bolt Chassis",
      detailStack: "Bolt Stack",
      detailLaunch: "Latch Drive",
      detailMidAir: "Flight Rail Stack",
      detailTip: "Bolt Head",
      slotUnit: "Bay"
    },
    mountCatalog: pickCatalogEntries(specialImpactMountCatalog, ["spine", "halo", "lattice"], {
      spine: { label: "Bolt Spine", summary: "A straight bolt spine for direct heavy crossbow shots." },
      halo: { label: "Wheel Cage", summary: "A wheel cage that stabilizes loaded payloads before release." },
      lattice: { label: "Repeater Rail", summary: "A split repeater rail used for burst and fracture bolt work." }
    }),
    impactCatalog: pickCatalogEntries(specialPayloadTypeCatalog, ["focus", "tether", "burst", "venom", "fracture", "shiver", "snare", "flare"]),
    launchCatalog: pickCatalogEntries(specialDriveTypeCatalog, ["draw", "snap", "winch"], {
      draw: { label: "Latch Draw" },
      snap: { label: "Quick Latch" },
      winch: { label: "Crank Winch" }
    }),
    fieldCatalog: pickCatalogEntries(specialFieldTypeCatalog, ["none", "fletch", "seeker", "glide", "splitter"]),
    headCatalog: pickCatalogEntries(specialHeadTypeCatalog, ["broadhead", "needle", "anchor", "barbed"]),
    defaults: {
      mount: "spine",
      impact: "focus",
      launch: "snap",
      tip: "needle"
    }
  },
  "harpoon-rig": {
    slotTags: ["Line", "Shaft", "Barb"],
    shotWord: "harpoon",
    headWord: "barb head",
    noMidAirLabel: "No Line Mods",
    descriptor: "Harpoon ammo is tether-heavy. It loads slower, carries less per rack, and leans into pull, stick, and brutal reel pressure.",
    capacityScale: 1.55,
    previewMode: "harpoon",
    labels: {
      familyTag: "Harpoon Rig",
      note:
        "Harpoon launchers build tethered line shots: tune the cable spine, seat the hook cores, set the winch, then lace line mods before locking the barb.",
      chambers: "Cable Slots",
      mount: "Harpoon Spine",
      impacts: "Per-Slot Cores",
      launch: "Winch Drive",
      midAir: "Line Mods",
      tip: "Barb Head",
      preload: "Launcher Rack",
      recipe: "Harpoon",
      impactsChip: "Cores",
      midAirChip: "Line Mods",
      detailMount: "Harpoon Spine",
      detailStack: "Cable Core Stack",
      detailLaunch: "Winch",
      detailMidAir: "Line Mod Stack",
      detailTip: "Barb Head",
      slotUnit: "Cable"
    },
    mountCatalog: pickCatalogEntries(specialImpactMountCatalog, ["spine", "halo", "lattice"], {
      spine: { label: "Cable Spine", summary: "A straight harpoon spine for hard tether pulls." },
      halo: { label: "Anchor Cage", summary: "A round cage that keeps venom and chill loads from shaking loose." },
      lattice: { label: "Reel Brace", summary: "A reel brace built for fracture and mixed pull payloads." }
    }),
    impactCatalog: pickCatalogEntries(specialPayloadTypeCatalog, ["focus", "tether", "venom", "fracture", "shiver", "snare"]),
    launchCatalog: pickCatalogEntries(specialDriveTypeCatalog, ["winch", "snap", "mist"], {
      winch: { label: "Tether Winch" },
      snap: { label: "Reel Snap" },
      mist: { label: "Fog Reel" }
    }),
    fieldCatalog: pickCatalogEntries(specialFieldTypeCatalog, ["none", "seeker", "afterimage", "glide", "splitter"]),
    headCatalog: pickCatalogEntries(specialHeadTypeCatalog, ["anchor", "barbed", "needle", "injector"]),
    defaults: {
      mount: "spine",
      impact: "tether",
      launch: "winch",
      tip: "anchor"
    }
  },
  "rail-rig": {
    slotTags: ["Emitter", "Coil", "Tip"],
    shotWord: "rail",
    headWord: "rail tip",
    noMidAirLabel: "No Field Coils",
    descriptor: "Rail ammo is emitter-driven. It favors charge speed, shock pressure, and fast line control over hook and bloom tricks.",
    capacityScale: 1.1,
    previewMode: "rail",
    labels: {
      familyTag: "Rail Foundry",
      note:
        "Rail weapons build charged line shots: lock emitters into the cage, feed them with a charge drive, wrap field coils around the rail, then finish the tip for the rack order.",
      chambers: "Emitter Slots",
      mount: "Emitter Cage",
      impacts: "Per-Slot Emitters",
      launch: "Charge Drive",
      midAir: "Field Coils",
      tip: "Rail Tip",
      preload: "Rail Rack",
      recipe: "Rail",
      impactsChip: "Emitters",
      midAirChip: "Coils",
      detailMount: "Emitter Cage",
      detailStack: "Emitter Stack",
      detailLaunch: "Charge Drive",
      detailMidAir: "Field Coil Stack",
      detailTip: "Rail Tip",
      slotUnit: "Emitter"
    },
    mountCatalog: pickCatalogEntries(specialImpactMountCatalog, ["spine", "halo", "lattice"], {
      spine: { label: "Conductor Spine", summary: "A straight rail spine for clean emitter lines." },
      halo: { label: "Emitter Halo", summary: "A halo cage for arc, revenant, and cold rail work." },
      lattice: { label: "Coil Lattice", summary: "A coil lattice that splits unstable phase and fracture rails." }
    }),
    impactCatalog: pickCatalogEntries(specialPayloadTypeCatalog, ["focus", "phase", "venom", "arc", "fracture", "revenant", "shiver", "snare", "flare"]),
    launchCatalog: pickCatalogEntries(specialDriveTypeCatalog, ["coil", "mist", "surge"]),
    fieldCatalog: pickCatalogEntries(specialFieldTypeCatalog, ["none", "seeker", "phase-trim", "arcwake", "echo"]),
    headCatalog: pickCatalogEntries(specialHeadTypeCatalog, ["needle", "crescent", "injector", "broadhead"]),
    defaults: {
      mount: "halo",
      impact: "arc",
      launch: "coil",
      tip: "injector"
    }
  },
  "prism-rig": {
    slotTags: ["Core", "Facet", "Prism"],
    shotWord: "phase rail",
    headWord: "prism head",
    noMidAirLabel: "No Veil Mods",
    descriptor: "Prism ammo is unstable phase work. It bends, splits, redirects, and tears space harder than a normal rail, but it is harder to rack in bulk.",
    capacityScale: 1.7,
    previewMode: "prism",
    labels: {
      familyTag: "Prism Foundry",
      note:
        "Prism rails are built through phase facets instead of standard emitters: stack sigils into the lattice, charge the phase drive, then layer veil mods before locking the crystal head.",
      chambers: "Facet Slots",
      mount: "Prism Lattice",
      impacts: "Per-Facet Sigils",
      launch: "Phase Drive",
      midAir: "Veil Mods",
      tip: "Prism Head",
      preload: "Prism Rack",
      recipe: "Phase Rail",
      impactsChip: "Sigils",
      midAirChip: "Veils",
      detailMount: "Prism Lattice",
      detailStack: "Facet Stack",
      detailLaunch: "Phase Drive",
      detailMidAir: "Veil Stack",
      detailTip: "Prism Head",
      slotUnit: "Facet"
    },
    mountCatalog: pickCatalogEntries(specialImpactMountCatalog, ["spine", "halo", "lattice"], {
      spine: { label: "Facet Spine", summary: "A straight facet spine for cleaner phase rails." },
      halo: { label: "Prism Halo", summary: "A halo cage that bends phase rails into portal and revenant lines." },
      lattice: { label: "Phase Lattice", summary: "A prism lattice used for split phase sigils and twin rail cuts." }
    }),
    impactCatalog: pickCatalogEntries(specialPayloadTypeCatalog, ["focus", "phase", "arc", "revenant", "bloom", "shiver", "snare", "flare"]),
    launchCatalog: pickCatalogEntries(specialDriveTypeCatalog, ["coil", "mist", "surge"], {
      coil: { label: "Facet Charge" },
      mist: { label: "Veil Charge" },
      surge: { label: "Phase Surge" }
    }),
    fieldCatalog: pickCatalogEntries(specialFieldTypeCatalog, ["none", "phase-trim", "afterimage", "splitter", "echo", "seeker"]),
    headCatalog: pickCatalogEntries(specialHeadTypeCatalog, ["prism", "needle", "crescent", "injector"]),
    defaults: {
      mount: "halo",
      impact: "phase",
      launch: "surge",
      tip: "prism"
    }
  }
};

const stylePathCatalog = {
  agility: { label: "Agility" },
  strength: { label: "Strength" },
  defense: { label: "Defense" }
};

const combatStyleCatalog = {
  tempest: {
    label: "Tempest",
    summary: "Mobile pressure style built around fast movement, clean openings, and tempo control.",
    masteryWeaponId: "tempest-edge",
    passives: {
      agility: [
        "Level 10: stride speed rises and movement starts to feel lighter.",
        "Level 20: dash cooldown shortens and dash distance grows.",
        "Level 30: jump startup tightens so escapes come out faster.",
        "Level 40: attacks recover a little faster after quick movement.",
        "Level 50: Tempest movement pressure peaks and fuels your style ability."
      ],
      strength: [
        "Level 10: clean hits shove rivals farther.",
        "Level 20: jab and slash damage both climb slightly.",
        "Level 30: every quick confirm adds extra tempo pressure.",
        "Level 40: chained hits build toward heavier storm finishers.",
        "Level 50: Tempest offense peaks and unlocks the path ability."
      ],
      defense: [
        "Level 10: parry timing widens a little.",
        "Level 20: stamina comes back faster after defense.",
        "Level 30: blocks stay steadier during fast scrambles.",
        "Level 40: clean parries start restoring more momentum.",
        "Level 50: Tempest defense peaks and unlocks the path ability."
      ]
    },
    abilities: {
      agility: "Afterimage Dash: level 50 agility gives long, fast dashes with much lighter recovery.",
      strength: "Storm Finish: level 50 strength powers up every few clean hits into a heavier burst finisher.",
      defense: "Flow Guard: level 50 defense lets clean parries restore health and a big chunk of stamina."
    }
  },
  bastion: {
    label: "Bastion",
    summary: "Heavy control style built around block pressure, guard survival, and punishing breaks.",
    masteryWeaponId: "bastion-maul",
    passives: {
      agility: [
        "Level 10: backsteps travel farther.",
        "Level 20: landing recovery tightens after jumps and hops.",
        "Level 30: heavy movement keeps more balance on defense.",
        "Level 40: evasive movement gives more room to reset.",
        "Level 50: Bastion mobility peaks and unlocks the path ability."
      ],
      strength: [
        "Level 10: guard damage rises noticeably.",
        "Level 20: heavy strikes knock rivals back farther.",
        "Level 30: direct hits build stronger stun pressure.",
        "Level 40: guard breaks become much more dangerous.",
        "Level 50: Bastion offense peaks and unlocks the path ability."
      ],
      defense: [
        "Level 10: blocks drain less stamina.",
        "Level 20: stamina recovers faster while grounded.",
        "Level 30: blocking heavy strings feels safer.",
        "Level 40: guard break recovery improves and posture returns faster.",
        "Level 50: Bastion defense peaks and unlocks the path ability."
      ]
    },
    abilities: {
      agility: "Anchor Step: level 50 agility grants a deeper, safer backstep with extra invulnerability.",
      strength: "Breaker Crush: level 50 strength massively amplifies guard break damage and shove power.",
      defense: "Fortress Guard: level 50 defense greatly reduces block stamina loss and stabilizes defense."
    }
  },
  phantom: {
    label: "Phantom",
    summary: "Trick pressure style built around stealthier movement, evasive timing, and back-hit threat.",
    masteryWeaponId: "phantom-fang",
    passives: {
      agility: [
        "Level 10: crouch movement gets lighter and lower profile.",
        "Level 20: dodge recovery shortens.",
        "Level 30: evasive movement becomes harder to read.",
        "Level 40: stealthy approaches keep more speed.",
        "Level 50: Phantom mobility peaks and unlocks the path ability."
      ],
      strength: [
        "Level 10: back hits gain sharper bonus damage.",
        "Level 20: dash strikes recover faster.",
        "Level 30: ambush confirms hit harder from close range.",
        "Level 40: rear-angle pressure becomes much more lethal.",
        "Level 50: Phantom offense peaks and unlocks the path ability."
      ],
      defense: [
        "Level 10: dodges give brief cover.",
        "Level 20: the first block after a dodge feels sturdier.",
        "Level 30: defensive slips keep you safer during resets.",
        "Level 40: evasions hide recovery better and buy time.",
        "Level 50: Phantom defense peaks and unlocks the path ability."
      ]
    },
    abilities: {
      agility: "Ghost Step: level 50 agility makes crouch and dodge movement much harder to read.",
      strength: "Back Reave: level 50 strength sharply boosts rear-hit finishers and ambush damage.",
      defense: "Veil Reset: level 50 defense grants a stronger brief veil after evasions."
    }
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
  },
  stormspire: {
    label: "Stormspire",
    tagline: "Sky bridge under live charge",
    specialty: "Lightning reads and hard contrast",
    description: "A high storm bridge lined with coil pylons, rain sheets, and a live charge vent running through the center lane.",
    skyTop: "#17304b",
    skyBottom: "#050912",
    floor: "#253349",
    floorEdge: "#8edbff",
    accent: "#82d7ff",
    crowd: "#d7f3ff",
    hazard: "#73c9ff"
  },
  gravevault: {
    label: "Gravevault",
    tagline: "Cold stone with sealed fire",
    specialty: "Mist pressure and eerie reads",
    description: "An under-crypt dueling floor ringed by chains, green braziers, and old sealed vault arches.",
    skyTop: "#1a171e",
    skyBottom: "#07070a",
    floor: "#342e36",
    floorEdge: "#9ec7a2",
    accent: "#90ffbe",
    crowd: "#d8ffe4",
    hazard: "#6effa0"
  },
  voidhangar: {
    label: "Voidhangar",
    tagline: "Silent dock over black space",
    specialty: "Low-light pressure and drift",
    description: "A dead orbital dock with hanging chains, cold windows, and a split void seam tearing through the center deck.",
    skyTop: "#101423",
    skyBottom: "#020306",
    floor: "#2f3747",
    floorEdge: "#b39cff",
    accent: "#a48dff",
    crowd: "#d8d0ff",
    hazard: "#8b6bff"
  }
};

const keyBindings = {
  p1: {
    left: "KeyA",
    right: "KeyD",
    jump: "KeyW",
    crouch: "KeyS",
    dodge: "KeyQ",
    slide: "KeyE",
    reload: "KeyR"
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
  menuOpenStyleLab: document.querySelector("#menu-open-style-lab"),
  menuSummary: document.querySelector("#menu-summary"),
  tutorialOffer: document.querySelector("#tutorial-offer"),
  tutorialOfferCopy: document.querySelector("#tutorial-offer-copy"),
  deviceChoiceButtons: Array.from(document.querySelectorAll(".device-choice-button")),
  startTutorial: document.querySelector("#start-tutorial"),
  skipTutorial: document.querySelector("#skip-tutorial"),
  familySelect: document.querySelector("#family-select"),
  classSelect: document.querySelector("#class-select"),
  frameSelect: document.querySelector("#frame-select"),
  materialSelect: document.querySelector("#material-select"),
  edgeSelect: document.querySelector("#edge-select"),
  styleLabel: document.querySelector("#style-label"),
  ammoWorkshop: document.querySelector("#ammo-workshop"),
  ammoWorkshopFamily: document.querySelector("#ammo-workshop-family"),
  ammoWorkshopNote: document.querySelector("#ammo-workshop-note"),
  impactChambersLabel: document.querySelector("#impact-chambers-label"),
  impactChambers: document.querySelector("#impact-chambers"),
  impactMountLabel: document.querySelector("#impact-mount-label"),
  impactMount: document.querySelector("#impact-mount"),
  impactTypeLabel: document.querySelector("#impact-type-label"),
  impactChamberList: document.querySelector("#impact-chamber-list"),
  launchTypeLabel: document.querySelector("#launch-type-label"),
  launchType: document.querySelector("#launch-type"),
  midAirTypeLabel: document.querySelector("#mid-air-type-label"),
  midAirType: document.querySelector("#mid-air-type"),
  addMidAirAddon: document.querySelector("#add-mid-air-addon"),
  midAirAddonList: document.querySelector("#mid-air-addon-list"),
  tipTypeLabel: document.querySelector("#tip-type-label"),
  tipType: document.querySelector("#tip-type"),
  preloadAmmoLabel: document.querySelector("#preload-ammo-label"),
  preloadAmmo: document.querySelector("#preload-ammo"),
  ammoPreview: document.querySelector("#ammo-preview"),
  ammoSummary: document.querySelector("#ammo-summary"),
  saveAmmo: document.querySelector("#save-ammo"),
  addAmmoToCase: document.querySelector("#add-ammo-to-case"),
  clearAmmoCase: document.querySelector("#clear-ammo-case"),
  ammoRack: document.querySelector("#ammo-rack"),
  ammoCaseList: document.querySelector("#ammo-case-list"),
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
  touchReload: document.querySelector('[data-touch="reload"]'),
  touchAttack: document.querySelector('[data-touch="attack"]'),
  touchBlock: document.querySelector('[data-touch="block"]'),
  touchSlide: document.querySelector('[data-touch="slide"]'),
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
  styleLabCard: document.querySelector("#style-lab-card"),
  styleLabStatus: document.querySelector("#style-lab-status"),
  styleSelect: document.querySelector("#style-select"),
  styleSkillPoints: document.querySelector("#style-skill-points"),
  styleMasteryPoints: document.querySelector("#style-mastery-points"),
  styleMasteryWeapon: document.querySelector("#style-mastery-weapon"),
  styleSummary: document.querySelector("#style-summary"),
  styleAgilityLevel: document.querySelector("#style-agility-level"),
  styleStrengthLevel: document.querySelector("#style-strength-level"),
  styleDefenseLevel: document.querySelector("#style-defense-level"),
  styleAgilityCopy: document.querySelector("#style-agility-copy"),
  styleStrengthCopy: document.querySelector("#style-strength-copy"),
  styleDefenseCopy: document.querySelector("#style-defense-copy"),
  trainAgility: document.querySelector("#train-agility"),
  trainStrength: document.querySelector("#train-strength"),
  trainDefense: document.querySelector("#train-defense"),
  styleTrainingTitle: document.querySelector("#style-training-title"),
  styleTrainingCopy: document.querySelector("#style-training-copy"),
  styleTrainingRating: document.querySelector("#style-training-rating"),
  styleTrainingBar: document.querySelector("#style-training-bar"),
  styleTrainingProgress: document.querySelector("#style-training-progress"),
  styleTrainingTime: document.querySelector("#style-training-time"),
  styleTrainingReward: document.querySelector("#style-training-reward"),
  styleTrainingStatus: document.querySelector("#style-training-status"),
  styleTrainingPips: document.querySelector("#style-training-pips"),
  styleTrainingStart: document.querySelector("#style-training-start"),
  styleTrainingAction: document.querySelector("#style-training-action"),
  stylePassives: document.querySelector("#style-passives"),
  styleAbilities: document.querySelector("#style-abilities"),
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
    family: "melee",
    kind: "medium",
    frame: "saber",
    material: "sunsteel",
    edge: "duelist",
    impactChambers: 1,
    impactMount: "core",
    impactType: "standard",
    chamberImpacts: ["standard"],
    launchType: "standard",
    midAirType: "none",
    midAirAddons: [],
    tipType: "sharp",
    preloadAmmo: 6,
    ammoCase: [],
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
  styleTraining: {
    styleId: "tempest",
    path: "agility",
    active: false,
    finished: false,
    indicator: 0.18,
    direction: 1,
    progress: 0,
    elapsed: 0,
    timeLimit: 6,
    hits: 0,
    pips: []
  },
  ammoRack: [],
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
    slide: false,
    reload: false
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
      reload: false,
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

function stringArray(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry || "").trim()).filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }
  return [];
}

function countMatches(list, id) {
  return stringArray(list).filter((entry) => entry === id).length;
}

function isSpecialGunFrame(frame) {
  return frame?.kind === "gun-special";
}

function pickCatalogEntries(source, ids, overrides = {}) {
  return Object.fromEntries(
    ids
      .filter((id) => source[id])
      .map((id) => [id, { ...source[id], ...(overrides[id] || {}) }])
  );
}

function frameCatalogId(frame) {
  if (!frame) {
    return "";
  }
  const match = Object.entries(frameCatalog).find(([, entry]) => entry === frame);
  return match?.[0] || frame.frameId || "";
}

function specialAmmoRigForFrame(frame) {
  if (!isSpecialGunFrame(frame)) {
    return null;
  }
  const frameId = frameCatalogId(frame);
  if (["longbow", "warbow", "stormbow"].includes(frameId)) {
    return "bow-rig";
  }
  if (["crossbow", "repeater", "ballista", "boltcaster"].includes(frameId)) {
    return "crossbow-rig";
  }
  if (frameId === "harpoon") {
    return "harpoon-rig";
  }
  if (["prismrail", "ghostrail"].includes(frameId)) {
    return "prism-rig";
  }
  if (["railgun", "coillance", "arcrail"].includes(frameId)) {
    return "rail-rig";
  }
  return frame?.ammoType === "rail" ? "rail-rig" : "bow-rig";
}

function specialAmmoRigConfig(frame) {
  const rigId = specialAmmoRigForFrame(frame);
  return rigId ? specialAmmoRigCatalog[rigId] || null : null;
}

function specialAmmoSlotTag(frame, index, total) {
  const slotTags = specialAmmoRigConfig(frame)?.slotTags;
  if (!slotTags?.length) {
    return index === 0
      ? frame?.ammoType === "rail" ? "Emitter" : "Lead"
      : index === total - 1
        ? frame?.ammoType === "rail" ? "Tail" : "Head"
        : "Core";
  }
  if (total <= 1) {
    return slotTags[1] || slotTags[0];
  }
  if (index === 0) {
    return slotTags[0];
  }
  if (index === total - 1) {
    return slotTags[slotTags.length - 1];
  }
  return slotTags[1] || slotTags[0];
}

function impactMountCatalogForFrame(frame) {
  return isSpecialGunFrame(frame) ? specialAmmoRigConfig(frame)?.mountCatalog || specialImpactMountCatalog : impactMountCatalog;
}

function impactTypeCatalogForFrame(frame) {
  return isSpecialGunFrame(frame) ? specialAmmoRigConfig(frame)?.impactCatalog || specialPayloadTypeCatalog : impactTypeCatalog;
}

function launchCatalogForFrame(frame) {
  return isSpecialGunFrame(frame) ? specialAmmoRigConfig(frame)?.launchCatalog || specialDriveTypeCatalog : launchTypeCatalog;
}

function midAirCatalogForFrame(frame) {
  return isSpecialGunFrame(frame) ? specialAmmoRigConfig(frame)?.fieldCatalog || specialFieldTypeCatalog : midAirTypeCatalog;
}

function tipCatalogForFrame(frame) {
  return isSpecialGunFrame(frame) ? specialAmmoRigConfig(frame)?.headCatalog || specialHeadTypeCatalog : tipTypeCatalog;
}

function defaultImpactMountForFrame(frame) {
  return isSpecialGunFrame(frame) ? specialAmmoRigConfig(frame)?.defaults?.mount || "spine" : "core";
}

function defaultImpactTypeForFrame(frame) {
  return isSpecialGunFrame(frame) ? specialAmmoRigConfig(frame)?.defaults?.impact || "focus" : "standard";
}

function defaultLaunchTypeForFrame(frame) {
  return isSpecialGunFrame(frame) ? specialAmmoRigConfig(frame)?.defaults?.launch || "draw" : "standard";
}

function defaultTipTypeForFrame(frame) {
  return isSpecialGunFrame(frame) ? specialAmmoRigConfig(frame)?.defaults?.tip || "broadhead" : "sharp";
}

function ammoWorkshopLabelsForFrame(frame) {
  if (isSpecialGunFrame(frame)) {
    const rig = specialAmmoRigConfig(frame);
    if (rig) {
      return {
        ...rig.labels,
        slotTags: rig.slotTags,
        shotWord: rig.shotWord,
        headWord: rig.headWord,
        noMidAirLabel: rig.noMidAirLabel,
        descriptor: rig.descriptor,
        previewMode: rig.previewMode
      };
    }
  }
  return {
    familyTag: frame?.ammoType === "rail" ? "Rail Work" : frame?.ammoType === "bolt" ? "Bolt Work" : "Bullet Work",
    note:
      "Craft ammo separately, then stack it into the case in the exact order the gun will load it.",
    chambers: "Impact Chambers",
    mount: "Chamber Layout",
    impacts: "Per-Chamber Impacts",
    launch: "Launch",
    midAir: "Mid Air Add-Ons",
    tip: "Tip",
    preload: "Preload Ammo",
    recipe: "Recipe",
    impactsChip: "Impacts",
    midAirChip: "Mid Air",
    detailMount: "Impact Chamber",
    detailStack: "Chamber Stack",
    detailLaunch: "Launch",
    detailMidAir: "Mid Flight Stack",
    detailTip: "Tip",
    slotUnit: "Chamber",
    shotWord: frame?.ammoType === "rail" ? "rail" : frame?.ammoType === "bolt" ? "bolt" : "round",
    headWord: "tip",
    noMidAirLabel: "No Add-Ons",
    descriptor: "Standard ammo uses shared chamber tech and straightforward shot tuning.",
    previewMode: frame?.ammoType || "bullet"
  };
}

function validImpactIdsForFrame(frame, chambers, mount) {
  return Object.entries(impactTypeCatalogForFrame(frame))
    .filter(([, impact]) =>
      chambers >= impact.minChambers &&
      impact.allowedMounts.includes(mount) &&
      (!impact.ammoFamilies || impact.ammoFamilies.includes(ammoFamilyForFrame(frame)))
    )
    .map(([id]) => id);
}

function normalizeChamberImpacts(frame, chambers, mount, requested) {
  const valid = validImpactIdsForFrame(frame, chambers, mount);
  const fallback = valid[0] || defaultImpactTypeForFrame(frame);
  const source = stringArray(requested);
  return Array.from({ length: chambers }, (_, index) => {
    const requestedId = source[index] || source[source.length - 1] || fallback;
    return valid.includes(requestedId) ? requestedId : fallback;
  });
}

function normalizeMidAirAddons(frame, requested) {
  const catalog = midAirCatalogForFrame(frame);
  return stringArray(requested).filter((addon) => addon !== "none" && catalog[addon]);
}

function impactLabelForChambers(frame, chamberImpacts) {
  const catalog = impactTypeCatalogForFrame(frame);
  const unique = [...new Set(stringArray(chamberImpacts))];
  if (!unique.length) {
    return catalog[defaultImpactTypeForFrame(frame)]?.label || defaultImpactTypeForFrame(frame);
  }
  return unique.map((id) => catalog[id]?.label || id).join(" + ");
}

function midAirLabelForAddons(frame, addons) {
  const catalog = midAirCatalogForFrame(frame);
  const list = stringArray(addons);
  if (!list.length) {
    return ammoWorkshopLabelsForFrame(frame).noMidAirLabel;
  }
  return list.map((id) => catalog[id]?.label || id).join(" + ");
}

function ammoRecipeNameFromParts(frame, chamberImpacts, tipType, launchType) {
  const labels = ammoWorkshopLabelsForFrame(frame);
  const impactCatalog = impactTypeCatalogForFrame(frame);
  const tipCatalog = tipCatalogForFrame(frame);
  const launchTypeSet = launchCatalogForFrame(frame);
  const impacts = [...new Set(stringArray(chamberImpacts))]
    .map((id) => impactCatalog[id]?.label.split(" ")[0] || id)
    .slice(0, 2)
    .join("-");
  const tip = tipCatalog[tipType]?.label || labels.detailTip || (isSpecialGunFrame(frame) ? "Head" : "Tip");
  const launch = launchTypeSet[launchType]?.label.split(" ")[0] || labels.detailLaunch || (isSpecialGunFrame(frame) ? "Drive" : "Std");
  return `${impacts || "Standard"} ${tip} ${launch}`.slice(0, 28);
}

function ammoRecipeCompatibleWithFrame(recipe, frame) {
  if (!recipe || !frame || frame.family !== "ranged") {
    return false;
  }
  const requestedChambers = Number(recipe.impactChambers || 1);
  if (requestedChambers > Math.max(1, frame.chamberMax || 1)) {
    return false;
  }
  const chambers = clamp(requestedChambers, 1, Math.max(1, frame.chamberMax || 1));
  const mount = compatibleImpactMount(frame, recipe.impactMount);
  const impacts = normalizeChamberImpacts(frame, chambers, mount, recipe.chamberImpacts || recipe.impactType);
  return recipe.ammoFamily === ammoFamilyForFrame(frame) && impacts.length === chambers;
}

function ammoCaseCapacityForFrame(frame, recipes, requestedAmmo) {
  const fallback = Math.max(1, Number(frame?.clipSize || 1));
  const capacity = (recipes || []).reduce((lowest, recipe) => {
    return Math.min(lowest, effectivePreloadAmmo(frame, recipe.impactChambers || 1, frame?.clipSize || 1));
  }, fallback);
  return clamp(Number(requestedAmmo || fallback), 1, Math.max(1, capacity));
}

function buildAmmoRecipeFromForge(forge, frame = frameCatalog[forge?.frame] || frameCatalog.longbow) {
  const normalized = normalizeForgeState(forge);
  const labels = ammoWorkshopLabelsForFrame(frame);
  const rigId = specialAmmoRigForFrame(frame);
  const chambers = clamp(Number(normalized.impactChambers || 1), 1, Math.max(1, frame.chamberMax || 1));
  const mount = compatibleImpactMount(frame, normalized.impactMount);
  const chamberImpacts = normalizeChamberImpacts(frame, chambers, mount, normalized.chamberImpacts || normalized.impactType);
  const uniqueImpacts = [...new Set(chamberImpacts)];
  const launchTypeSet = launchCatalogForFrame(frame);
  const tipTypeSet = tipCatalogForFrame(frame);
  const launchType = launchTypeSet[normalized.launchType] ? normalized.launchType : defaultLaunchTypeForFrame(frame);
  const tipType = tipTypeSet[normalized.tipType] ? normalized.tipType : defaultTipTypeForFrame(frame);
  const midAirAddons = normalizeMidAirAddons(frame, normalized.midAirAddons || normalized.midAirType);
  const quality = clamp(Number(normalized.forgeQuality ?? 0.5), 0.2, 1);
  const tip = tipTypeSet[tipType];
  const launch = launchTypeSet[launchType];
  const summaryBits = [
    `${chambers} ${(labels.slotUnit || (isSpecialGunFrame(frame) ? "Slot" : "Chamber")).toLowerCase()}${chambers === 1 ? "" : "s"}`,
    impactLabelForChambers(frame, chamberImpacts),
    launch.label,
    midAirAddons.length ? midAirLabelForAddons(frame, midAirAddons) : null,
    `${tip.label} ${labels.headWord || (isSpecialGunFrame(frame) ? "head" : "tip")}`
  ].filter(Boolean);

  const recipe = {
    id: forge?.ammoRecipeId || makeId("ammo"),
    name: ammoRecipeNameFromParts(frame, chamberImpacts, tipType, launchType),
    ammoFamily: ammoFamilyForFrame(frame),
    impactChambers: chambers,
    impactMount: mount,
    impactMountLabel: impactMountCatalogForFrame(frame)[mount]?.label || mount,
    chamberImpacts,
    impactTypes: uniqueImpacts,
    impactLabel: impactLabelForChambers(frame, chamberImpacts),
    launchType,
    launchLabel: launch.label,
    midAirAddons,
    midAirLabel: midAirLabelForAddons(frame, midAirAddons),
    tipType,
    tipLabel: tip.label,
    specialRig: specialAmmoRigForFrame(frame),
    quality,
    qualityLabel: forgeRatingLabel(quality)
  };
  if (isSpecialGunFrame(frame)) {
    const focusCount = countMatches(chamberImpacts, "focus");
    const tetherCount = countMatches(chamberImpacts, "tether");
    const burstCount = countMatches(chamberImpacts, "burst");
    const phaseCount = countMatches(chamberImpacts, "phase");
    const venomCount = countMatches(chamberImpacts, "venom");
    const arcCount = countMatches(chamberImpacts, "arc");
    const fractureCount = countMatches(chamberImpacts, "fracture");
    const revenantCount = countMatches(chamberImpacts, "revenant");
    const bloomCount = countMatches(chamberImpacts, "bloom");
    const shiverCount = countMatches(chamberImpacts, "shiver");
    const snareCount = countMatches(chamberImpacts, "snare");
    const flareCount = countMatches(chamberImpacts, "flare");
    const fletchCount = countMatches(midAirAddons, "fletch");
    const seekerCount = countMatches(midAirAddons, "seeker");
    const phaseTrimCount = countMatches(midAirAddons, "phase-trim");
    const arcwakeCount = countMatches(midAirAddons, "arcwake");
    const afterimageCount = countMatches(midAirAddons, "afterimage");
    const glideCount = countMatches(midAirAddons, "glide");
    const splitterCount = countMatches(midAirAddons, "splitter");
    const echoCount = countMatches(midAirAddons, "echo");
    recipe.damageBonus =
      chambers * 2 +
      focusCount * 2 +
      burstCount +
      bloomCount +
      arcCount +
      venomCount +
      fractureCount * 2 +
      phaseCount +
      shiverCount +
      snareCount +
      flareCount +
      revenantCount +
      (launch.damage || 0) +
      (tip.damage || 0);
    recipe.speedBonus =
      (launch.speed || 0) +
      (tip.speed || 0) +
      fletchCount * 58 +
      glideCount * 42 +
      seekerCount * 22 +
      afterimageCount * 14 +
      phaseTrimCount * 18 +
      quality * 24;
    recipe.knockbackBonus =
      chambers * 0.05 +
      tetherCount * 0.08 +
      fractureCount * 0.1 +
      bloomCount * 0.05 +
      shiverCount * 0.04 +
      snareCount * 0.05 +
      flareCount * 0.03 +
      (launch.knockback || 0) +
      (tip.knockback || 0);
    recipe.blockBreakBonus =
      (tip.blockDrain || 0) +
      fractureCount * 4 +
      tetherCount * 2 +
      bloomCount * 2 +
      snareCount * 2 +
      flareCount +
      burstCount * 2 +
      focusCount;
    recipe.projectilePierceBonus =
      (tip.pierce || 0) +
      focusCount +
      (tipType === "needle" ? 1 : 0);
    recipe.delayedImpact = Boolean(tipType === "barbed" || burstCount || snareCount > 0 || tip.delayedImpact);
    recipe.homingStrength = seekerCount * 0.7 + revenantCount * 0.45 + echoCount * 0.2;
    recipe.redirectCharges = phaseTrimCount + revenantCount + echoCount;
    recipe.blizzardTrail = Boolean(launch.blizzardTrail || shiverCount > 0);
    recipe.emberTrail = flareCount > 0;
    recipe.stormTrail = Boolean(launch.stormTrail || arcwakeCount > 0 || (arcCount > 0 && frame.ammoType === "rail"));
    recipe.spiralCount = afterimageCount + Math.max(0, revenantCount - 1);
    recipe.scatterImpact = burstCount > 0 || bloomCount > 0 || splitterCount > 0;
    recipe.pullImpact = tetherCount > 0 || snareCount > 0 || tipType === "anchor";
    recipe.explosiveBoost = burstCount * 0.07 + bloomCount * 0.09 + splitterCount * 0.05 + flareCount * 0.08;
    recipe.shockCount = arcCount + arcwakeCount + (tipType === "injector" ? 1 : 0);
    recipe.poisonCount = venomCount + (tipType === "injector" ? 1 : 0);
    recipe.portalCount = phaseCount + revenantCount + (tip.portal || 0);
    recipe.slowCount = shiverCount + snareCount;
    recipe.ruptureCount = (tipType === "barbed" ? 1 : 0) + Math.max(0, snareCount - 1);
    switch (rigId) {
      case "bow-rig":
        recipe.damageBonus += focusCount + Math.max(0, bloomCount - 1);
        recipe.speedBonus += 36 + fletchCount * 26 + glideCount * 18;
        recipe.knockbackBonus = Math.max(0.04, recipe.knockbackBonus - 0.08);
        recipe.projectilePierceBonus += tipType === "broadhead" ? 1 : 0;
        recipe.blockBreakBonus = Math.max(0, recipe.blockBreakBonus - 2);
        recipe.homingStrength += seekerCount * 0.12;
        recipe.rigSummary = "Bow rig: lighter arrows fly cleaner, keep speed better, and reward draw plus flight tuning over raw shove.";
        break;
      case "crossbow-rig":
        recipe.damageBonus += 2 + tetherCount + fractureCount;
        recipe.speedBonus -= 18;
        recipe.knockbackBonus += 0.08 + fractureCount * 0.04;
        recipe.blockBreakBonus += 4 + fractureCount * 2;
        recipe.projectilePierceBonus += tipType === "anchor" ? 1 : 0;
        recipe.delayedImpact = Boolean(recipe.delayedImpact || tipType === "anchor");
        recipe.rigSummary = "Crossbow rig: heavier bolts hit harder, bite deeper into guard, and reward latch force over finesse.";
        break;
      case "harpoon-rig":
        recipe.damageBonus += tetherCount + fractureCount + 1;
        recipe.speedBonus -= 46;
        recipe.knockbackBonus += 0.14 + tetherCount * 0.06;
        recipe.blockBreakBonus += 6;
        recipe.pullImpact = true;
        recipe.delayedImpact = true;
        recipe.homingStrength += 0.18 + seekerCount * 0.1;
        recipe.rigSummary = "Harpoon rig: brutal tether shots trade speed for drag force, stuck-barb pressure, and harder reel control.";
        break;
      case "rail-rig":
        recipe.damageBonus += arcCount + revenantCount + 1;
        recipe.speedBonus += 52 + arcwakeCount * 20;
        recipe.knockbackBonus = Math.max(0.03, recipe.knockbackBonus - 0.03);
        recipe.projectilePierceBonus += 1;
        recipe.shockCount += 1;
        recipe.redirectCharges += phaseTrimCount;
        recipe.rigSummary = "Rail rig: emitter rails fire faster, hold straighter lines, and push charge pressure harder than hook or bloom work.";
        break;
      case "prism-rig":
        recipe.damageBonus += phaseCount + revenantCount + 1;
        recipe.speedBonus += 26;
        recipe.portalCount += 1;
        recipe.redirectCharges += 1 + phaseTrimCount;
        recipe.scatterImpact = true;
        recipe.homingStrength += 0.34;
        recipe.explosiveBoost += 0.04;
        recipe.rigSummary = "Prism rig: unstable facets split, redirect, and warp the lane harder than a standard rail ever could.";
        break;
      default:
        recipe.rigSummary = labels.descriptor;
        break;
    }
  } else {
    const magnetCount = countMatches(midAirAddons, "magnetized");
    const redirectCount = countMatches(midAirAddons, "redirect");
    const spiralCount = countMatches(midAirAddons, "spiral");
    const stabilizerCount = countMatches(midAirAddons, "stabilizer");
    const tracerCount = countMatches(midAirAddons, "tracer");
    const explosiveCount = countMatches(chamberImpacts, "explosive");
    const shrapnelCount = countMatches(chamberImpacts, "shrapnel");
    const scatterCount = countMatches(chamberImpacts, "scatter");
    const imploderCount = countMatches(chamberImpacts, "imploder");
    const shockCount = countMatches(chamberImpacts, "shock");
    const poisonCount = countMatches(chamberImpacts, "poison");
    const portalCount = countMatches(chamberImpacts, "portal");
    const ruptureCount = countMatches(chamberImpacts, "rupture");
    const frostCount = countMatches(chamberImpacts, "frost");
    const concussionCount = countMatches(chamberImpacts, "concussion");
    const anchorCount = countMatches(chamberImpacts, "anchor");
    const standardCount = countMatches(chamberImpacts, "standard");
    recipe.damageBonus =
      chambers * 2 +
      explosiveCount * 2 +
      shrapnelCount +
      shockCount +
      poisonCount +
      portalCount +
      scatterCount +
      ruptureCount +
      frostCount +
      concussionCount +
      anchorCount +
      (launch.damage || 0) +
      (tip.damage || 0);
    recipe.speedBonus =
      (launch.speed || 0) +
      stabilizerCount * 55 +
      magnetCount * 28 +
      spiralCount * 12 +
      tracerCount * 34 +
      quality * 24;
    recipe.knockbackBonus =
      chambers * 0.06 +
      explosiveCount * 0.08 +
      scatterCount * 0.06 +
      imploderCount * 0.04 +
      ruptureCount * 0.05 +
      frostCount * 0.03 +
      concussionCount * 0.09 +
      anchorCount * 0.04 +
      (launch.knockback || 0) +
      (tip.knockback || 0);
    recipe.blockBreakBonus =
      (tip.blockDrain || 0) +
      scatterCount * 3 +
      explosiveCount * 2 +
      shrapnelCount * 2 +
      ruptureCount * 4 +
      concussionCount * 2 +
      anchorCount * 2 +
      standardCount;
    recipe.projectilePierceBonus =
      (tipType === "sharp" ? 1 : 0) +
      (tipType === "drill" ? 2 : 0) +
      (tipType === "forked" ? 1 : 0);
    recipe.delayedImpact = Boolean(tipType === "spiked" || tip.delayedImpact || ruptureCount > 0 || anchorCount > 0);
    recipe.homingStrength = magnetCount * 0.5;
    recipe.redirectCharges = redirectCount;
    recipe.blizzardTrail = Boolean(launchType === "blizzard" || frostCount > 0);
    recipe.emberTrail = launchType === "ember";
    recipe.stormTrail = Boolean(launchType === "storm" || launch.stormTrail);
    recipe.spiralCount = spiralCount;
    recipe.scatterImpact = scatterCount > 0;
    recipe.pullImpact = imploderCount > 0 || anchorCount > 0;
    recipe.explosiveBoost = explosiveCount * 0.12;
    recipe.shockCount = shockCount + concussionCount;
    recipe.poisonCount = poisonCount;
    recipe.portalCount = portalCount;
    recipe.slowCount = frostCount + anchorCount;
    recipe.ruptureCount = ruptureCount + (tipType === "serrated" ? 1 : 0);
    recipe.rigSummary = labels.descriptor;
  }
  recipe.summary = `${summaryBits.join(" | ")}. ${recipe.rigSummary}`;
  recipe.signature = ammoRecipeSignature(recipe);
  return recipe;
}

function ammoRoundListForWeapon(weapon) {
  if (!isRangedWeapon(weapon)) {
    return [];
  }
  const frame = frameCatalog[weapon.frameId] || frameCatalog.longbow;
  const fallbackRound =
    weapon.ammoPrototype ||
    buildAmmoRecipeFromForge(
      {
        frame: weapon.frameId,
        impactChambers: weapon.impactChambers || 1,
        impactMount: weapon.impactMount || defaultImpactMountForFrame(frame),
        chamberImpacts: weapon.chamberImpacts || [weapon.impactType || defaultImpactTypeForFrame(frame)],
        launchType: weapon.launchType || defaultLaunchTypeForFrame(frame),
        midAirAddons: weapon.midAirAddons || [],
        tipType: weapon.tipType || defaultTipTypeForFrame(frame),
        forgeQuality: weapon.forgeQuality || 0.5
      },
      frame
    );
  const rounds = Array.isArray(weapon.ammoCaseRounds) && weapon.ammoCaseRounds.length
    ? weapon.ammoCaseRounds
    : [fallbackRound].filter(Boolean);
  const desiredCount = clamp(Number(weapon.preloadAmmo || weapon.clipSize || rounds.length || 1), 1, 24);
  const list = [];
  for (let index = 0; index < desiredCount; index += 1) {
    list.push(rounds[index % rounds.length]);
  }
  return list;
}

function impactAccentColor(impactId) {
  const palette = {
    standard: "#f1e7d6",
    breach: "#ffd08f",
    explosive: "#ffb16b",
    shrapnel: "#f5f5f5",
    scatter: "#ffe49a",
    portal: "#b596ff",
    imploder: "#9eb7ff",
    shock: "#9fe8ff",
    poison: "#9ef58c",
    rupture: "#ff9275",
    frost: "#b8ecff",
    concussion: "#d3f1ff",
    anchor: "#a9dbff",
    focus: "#f4f0e8",
    tether: "#8ce0ff",
    burst: "#ffd59a",
    phase: "#c5a7ff",
    venom: "#86ef8d",
    arc: "#8fe8ff",
    fracture: "#ffc27a",
    revenant: "#e6b7ff",
    bloom: "#ffd7b2",
    shiver: "#d0f2ff",
    snare: "#b6fff1",
    flare: "#ffbb84"
  };
  return palette[impactId] || "#f1e7d6";
}

function ammoRecipeSignature(recipe) {
  return JSON.stringify({
    ammoFamily: recipe?.ammoFamily || "bullet",
    impactChambers: recipe?.impactChambers || 1,
    impactMount: recipe?.impactMount || "core",
    chamberImpacts: stringArray(recipe?.chamberImpacts),
    launchType: recipe?.launchType || "standard",
    midAirAddons: stringArray(recipe?.midAirAddons),
    tipType: recipe?.tipType || "sharp"
  });
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

function masteryWeaponVisible(frame, account = currentAccount()) {
  if (!frame?.masteryStyle) {
    return true;
  }
  return Boolean(account && masteryWeaponUnlocked(account, frame.masteryStyle));
}

function frameIdsForKind(kind) {
  return Object.entries(frameCatalog)
    .filter(([, frame]) => frame.kind === kind && masteryWeaponVisible(frame))
    .map(([id]) => id);
}

function firstFrameIdForKind(kind) {
  return frameIdsForKind(kind)[0] || "katana";
}

function frameCatalogForKind(kind) {
  return Object.fromEntries(
    Object.entries(frameCatalog).filter(([, frame]) => frame.kind === kind && masteryWeaponVisible(frame))
  );
}

function forgeFamilyForKind(kind) {
  return isRangedKind(kind) ? "ranged" : "melee";
}

function firstKindForFamily(family) {
  return family === "ranged" ? "sidearm" : "medium";
}

function kindCatalogForFamily(family) {
  return Object.fromEntries(
    Object.entries(bladeTypeCatalog).filter(([kind]) => forgeFamilyForKind(kind) === family)
  );
}

function isRangedKind(kind) {
  return ["sidearm", "assault", "heavy", "gun-special"].includes(kind);
}

function isRangedWeapon(weapon) {
  return Boolean(weapon && (weapon.family === "ranged" || isRangedKind(weapon.kind)));
}

function ammoFamilyForFrame(frame) {
  return frame?.ammoType || "bullet";
}

function compatibleImpactMount(frame, requestedMount = defaultImpactMountForFrame(frame)) {
  const mountCatalog = impactMountCatalogForFrame(frame);
  const fallback = defaultImpactMountForFrame(frame);
  const requested = mountCatalog[requestedMount] ? requestedMount : fallback;
  const disallowedSplit = !isSpecialGunFrame(frame) && requested === "split" && frame?.chamberMax < 2;
  const allowedMounts = disallowedSplit ? [fallback] : Object.keys(mountCatalog);
  return allowedMounts.includes(requested) ? requested : allowedMounts[0];
}

function compatibleImpactType(frame, chambers, mount, requestedImpact = defaultImpactTypeForFrame(frame)) {
  const ammoFamily = ammoFamilyForFrame(frame);
  const impactCatalog = impactTypeCatalogForFrame(frame);
  const fallback = defaultImpactTypeForFrame(frame);
  const requested = impactCatalog[requestedImpact] ? requestedImpact : fallback;
  const valid = Object.entries(impactCatalog)
    .filter(([, impact]) =>
      chambers >= impact.minChambers &&
      impact.allowedMounts.includes(mount) &&
      (!impact.ammoFamilies || impact.ammoFamilies.includes(ammoFamily))
    )
    .map(([id]) => id);
  return valid.includes(requested) ? requested : (valid[0] || fallback);
}

function effectivePreloadAmmo(frame, chambers, requestedAmmo) {
  const clipSize = Math.max(1, Number(frame?.clipSize || 1));
  const basePenalty = Math.max(0, chambers - 1);
  const specialRigScale = isSpecialGunFrame(frame) ? specialAmmoRigConfig(frame)?.capacityScale || 1 : 1;
  const penalty = isSpecialGunFrame(frame)
    ? Math.max(0, Math.ceil(basePenalty * specialRigScale))
    : basePenalty * (frame?.kind === "heavy" ? 1 : frame?.kind === "sidearm" ? 2 : 1);
  const maxLoaded = Math.max(1, clipSize - penalty);
  return clamp(Number(requestedAmmo || maxLoaded), 1, maxLoaded);
}

function normalizeForgeState(forge = state.forge) {
  const inferredKind = forge.kind || frameCatalog[forge.frame]?.kind || "medium";
  const inferredFamily = forge.family || forgeFamilyForKind(inferredKind);
  const family = weaponFamilyCatalog[inferredFamily] ? inferredFamily : "melee";
  const requestedKind = bladeTypeCatalog[inferredKind] ? inferredKind : firstKindForFamily(family);
  const kind = forgeFamilyForKind(requestedKind) === family ? requestedKind : firstKindForFamily(family);
  const frameId = frameIdsForKind(kind).includes(forge.frame) ? forge.frame : firstFrameIdForKind(kind);
  const frame = frameCatalog[frameId] || frameCatalog.saber;
  const materialId = materialCatalog[forge.material] ? forge.material : "sunsteel";
  const edgeId = edgeCatalog[forge.edge] ? forge.edge : "duelist";
  const impactChambers = clamp(Number(forge.impactChambers ?? 1), 1, Math.max(1, frame.chamberMax || 1));
  const impactMount = compatibleImpactMount(frame, forge.impactMount);
  const chamberImpacts = normalizeChamberImpacts(
    frame,
    impactChambers,
    impactMount,
    forge.chamberImpacts || forge.impactType
  );
  const impactType = chamberImpacts[0] || compatibleImpactType(frame, impactChambers, impactMount, forge.impactType);
  const launchTypeSet = launchCatalogForFrame(frame);
  const launchType = launchTypeSet[forge.launchType] ? forge.launchType : defaultLaunchTypeForFrame(frame);
  const midAirAddons = normalizeMidAirAddons(frame, forge.midAirAddons || forge.midAirType);
  const midAirType = midAirAddons[0] || "none";
  const tipTypeSet = tipCatalogForFrame(frame);
  const tipType = tipTypeSet[forge.tipType] ? forge.tipType : defaultTipTypeForFrame(frame);
  const preloadAmmo = effectivePreloadAmmo(frame, impactChambers, forge.preloadAmmo);
  return {
    ...forge,
    family,
    kind,
    frame: frameId,
    material: materialId,
    edge: edgeId,
    impactChambers,
    impactMount,
    chamberImpacts,
    impactType,
    launchType,
    midAirAddons,
    midAirType,
    tipType,
    preloadAmmo,
    ammoCase: Array.isArray(forge.ammoCase) ? forge.ammoCase.filter(Boolean).slice(0, preloadAmmo) : [],
    heat: clamp(Number(forge.heat ?? forge.temper ?? 58), 0, 100),
    forgeQuality: clamp(Number(forge.forgeQuality ?? 0.5), 0.2, 1),
    name: String(forge.name || "Ashbite").trim().slice(0, 12) || "Ashbite"
  };
}

function reconcileAmmoCaseForForge(forge = state.forge) {
  const normalized = normalizeForgeState(forge);
  const frame = frameCatalog[normalized.frame] || frameCatalog.saber;
  if (!isRangedWeapon(frame)) {
    return normalized;
  }
  const recipePool = normalized.ammoCase
    .map((id) => state.ammoRack.find((recipe) => recipe.id === id))
    .filter((recipe) => ammoRecipeCompatibleWithFrame(recipe, frame));
  const prototype = buildAmmoRecipeFromForge(normalized, frame);
  const caseCapacity = ammoCaseCapacityForFrame(frame, recipePool.length ? recipePool : [prototype], normalized.preloadAmmo);
  if (caseCapacity === normalized.preloadAmmo && recipePool.length === normalized.ammoCase.length) {
    return normalized;
  }
  return normalizeForgeState({
    ...normalized,
    preloadAmmo: caseCapacity,
    ammoCase: normalized.ammoCase.filter((id) => recipePool.some((recipe) => recipe.id === id)).slice(0, caseCapacity)
  });
}

function forgeGameModeForWeapon(source) {
  if (typeof source === "string" && (bladeTypeCatalog[source] || source.includes("-"))) {
    return source;
  }
  const frame = typeof source === "string" ? frameCatalog[source] : source;
  if (!frame) {
    return "medium";
  }
  if (frame.family === "ranged") {
    if (frame.ammoType === "bolt") {
      return ["crossbow", "repeater", "harpoon"].includes(frame.frameId || "") || ["Crossbow", "Repeater Crossbow", "Harpoon Launcher"].includes(frame.label)
        ? "bolt-latch"
        : "bow-string";
    }
    if (frame.ammoType === "rail") {
      return frame.frameId === "coillance" || frame.label === "Coil Lance" ? "rail-bore" : "rail-align";
    }
    if (frame.kind === "sidearm") {
      return "short";
    }
    if (frame.kind === "heavy") {
      return "long";
    }
    return "medium";
  }
  if (frame.kind === "special") {
    const specialMode = frame.special?.type || "special";
    if (["combo-barrage", "shockwave-slam", "reaper-hook", "axe-throw"].includes(specialMode)) {
      return specialMode;
    }
    if (["crush-burst", "fortress-break"].includes(specialMode)) {
      return "long";
    }
    return "medium";
  }
  return frame.kind;
}

function forgeModeMeta(kind) {
  const frame = typeof kind === "string" ? frameCatalog[kind] : kind;
  const mode = typeof kind === "string" && bladeTypeCatalog[kind] ? kind : forgeGameModeForWeapon(kind);
  if (frame?.family === "ranged") {
    if (mode === "bow-string") {
      return {
        title: "Bow String Set",
        copy: "Bows want a clean draw and release. Let the draw marker settle inside the narrow gold lane, then snap the string.",
        action: "Snap String"
      };
    }
    if (mode === "bolt-latch") {
      return {
        title: "Crossbow Latch Lock",
        copy: "Crossbows need crisp latch timing. Hit the alternating latch lanes cleanly to lock each bolt into place.",
        action: "Latch Bolt"
      };
    }
    if (mode === "rail-align") {
      return {
        title: "Rail Emitter Alignment",
        copy: "Railguns want exact emitter timing. Hit each rail marker in order so the charge lanes stay true.",
        action: "Align Rail"
      };
    }
    if (mode === "rail-bore") {
      return {
        title: "Coil Bore Tuning",
        copy: "Coil rails need moving bore catches. Catch each drifting alignment point as it sweeps through the lane.",
        action: "Tune Coil"
      };
    }
    if (frame.kind === "sidearm") {
      return {
        title: "Sidearm Chamber Cycling",
        copy: "Light guns want quick chamber work. Pop the fast targets cleanly so the cylinder or sidearm feed stays tight.",
        action: "Cycle Round"
      };
    }
    if (frame.kind === "heavy") {
      return {
        title: "Heavy Payload Seating",
        copy: "Heavy guns want slow, deliberate shell seating. Hit the large timing zone cleanly to lock the chamber.",
        action: "Seat Shell"
      };
    }
    return {
      title: frame.kind === "gun-special" ? "Special Shot Alignment" : "Assault Feed Tuning",
      copy: frame.kind === "gun-special"
        ? "Special ranged frames want steady alignment. Time each feed marker to keep bolts or rails tracking true."
        : "Assault weapons want steady burst timing. Hit each feed marker in rhythm to smooth the action.",
      action: frame.kind === "gun-special" ? "Align Shot" : "Feed Burst"
    };
  }
  if (mode === "long") {
    return {
      title: "Long Blade Heat Control",
      copy: "Let the temper marker drift into the wide gold zone, then strike. Long blades care about steady heavy timing.",
      action: "Quench Hit"
    };
  }
  if (mode === "short") {
    return {
      title: "Short Blade Rapid Forge",
      copy: "Short blades want fast, tight work. Strike quickly to pop every spark before the timer runs out.",
      action: "Spark Hit"
    };
  }
  if (mode === "combo-barrage") {
    return {
      title: "Brass Combo Forge",
      copy: "Punch the pattern in order: right, left, uppercut, then the heavy finish. Clean rhythm sharpens the combo.",
      action: "Punch Beat"
    };
  }
  if (mode === "shockwave-slam") {
    return {
      title: "Hammer Slam Forge",
      copy: "Let the hammer fall into the impact lane and slam clean. Better timing strengthens the landing shockwave.",
      action: "Slam"
    };
  }
  if (mode === "reaper-hook") {
    return {
      title: "Scythe Hook Forge",
      copy: "Catch the drifting hook points as they swing by. Clean catches strengthen the pull.",
      action: "Hook"
    };
  }
  if (mode === "axe-throw") {
    return {
      title: "Throw Axe Forge",
      copy: "Snap the axe through alternating throw lanes. Clean lane timing tightens the release and return.",
      action: "Throw"
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
  const mode = forgeGameModeForWeapon(kind) || kind;
  const game = {
    mode,
    active: false,
    finished: false,
    progress: 0,
    rating: 0.5,
    indicator: mode === "short" ? 0 : mode === "shockwave-slam" ? 0.05 : mode === "bow-string" ? 0.08 : 0.18,
    direction: 1,
    hits: 0,
    misses: 0,
    streak: 0,
    bestStreak: 0,
    elapsed: 0,
    timeLimit:
      mode === "short"
        ? 4.2
        : mode === "bow-string"
          ? 5.6
          : mode === "bolt-latch"
            ? 5.8
            : mode === "rail-align"
              ? 6.1
              : mode === "rail-bore"
                ? 6.3
        : mode === "combo-barrage"
          ? 5.4
          : mode === "shockwave-slam"
            ? 6
            : mode === "reaper-hook"
              ? 6.2
              : mode === "axe-throw"
                ? 6
                : mode === "medium"
                  ? 7
                  : 6.4,
    pips: [],
    laneIndex: 0
  };

  if (mode === "short") {
    game.pips = [0.18, 0.36, 0.52, 0.68, 0.84].map((position, index) => ({
      id: index,
      position,
      velocity: index % 2 === 0 ? 0.16 : -0.18,
      hit: false
    }));
  } else if (mode === "rail-align") {
    game.pips = [0.18, 0.39, 0.62, 0.82].map((position, index) => ({
      id: index,
      position,
      hit: false
    }));
  } else if (mode === "medium") {
    game.pips = [0.24, 0.5, 0.76].map((position, index) => ({
      id: index,
      position,
      hit: false
    }));
  } else if (mode === "combo-barrage") {
    game.pips = [0.2, 0.72, 0.34, 0.64].map((position, index) => ({
      id: index,
      position,
      hit: false
    }));
  } else if (mode === "reaper-hook") {
    game.pips = [0.24, 0.5, 0.76].map((position, index) => ({
      id: index,
      position,
      phase: index * 1.4,
      hit: false
    }));
  } else if (mode === "rail-bore") {
    game.pips = [0.22, 0.46, 0.74].map((position, index) => ({
      id: index,
      position,
      phase: index * 1.1,
      hit: false
    }));
  }

  return game;
}

function resetForgeMinigame(kind = state.forge.frame, preserveQuality = false) {
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
  state.forgeGame = createForgeGame(state.forge.frame);
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

  if (game.mode === "rail-align") {
    const target = game.pips.find((pip) => !pip.hit);
    if (!target) {
      finishForgeMinigame();
      return;
    }
    const error = Math.abs(game.indicator - target.position);
    if (error <= 0.07) {
      target.hit = true;
      game.hits += 1;
      game.streak += 1;
      game.bestStreak = Math.max(game.bestStreak, game.streak);
      game.progress = game.hits / game.pips.length;
      game.rating = clamp(0.56 + game.progress * 0.32 + game.streak * 0.018 - error * 0.5, 0.2, 1);
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

  if (game.mode === "combo-barrage") {
    const target = game.pips.find((pip) => !pip.hit);
    if (!target) {
      finishForgeMinigame();
      return;
    }
    const error = Math.abs(game.indicator - target.position);
    if (error <= 0.075) {
      target.hit = true;
      game.hits += 1;
      game.streak += 1;
      game.bestStreak = Math.max(game.bestStreak, game.streak);
      game.progress = game.hits / game.pips.length;
      game.rating = clamp(0.52 + game.progress * 0.34 + game.streak * 0.02 - error * 0.5, 0.2, 1);
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

  if (game.mode === "shockwave-slam") {
    const inZone = game.indicator >= 0.78 && game.indicator <= 0.92;
    const distanceFromCenter = Math.abs(game.indicator - 0.85);
    if (inZone) {
      game.hits += 1;
      game.streak += 1;
      game.bestStreak = Math.max(game.bestStreak, game.streak);
      game.progress = game.hits / 3;
      game.rating = clamp(0.56 + game.progress * 0.28 + game.streak * 0.02 - distanceFromCenter * 0.55, 0.2, 1);
      game.indicator = 0.05;
      if (game.hits >= 3) {
        finishForgeMinigame();
      }
    } else {
      game.misses += 1;
      game.streak = 0;
      game.rating = clamp(game.rating - 0.06, 0.2, 1);
    }
    renderForge();
    return;
  }

  if (game.mode === "bow-string") {
    const inZone = game.indicator >= 0.46 && game.indicator <= 0.54;
    const distanceFromCenter = Math.abs(game.indicator - 0.5);
    if (inZone) {
      game.hits += 1;
      game.streak += 1;
      game.bestStreak = Math.max(game.bestStreak, game.streak);
      game.progress = game.hits / 4;
      game.rating = clamp(0.58 + game.progress * 0.26 + game.streak * 0.02 - distanceFromCenter * 0.58, 0.2, 1);
      game.indicator = 0.08;
      if (game.hits >= 4) {
        finishForgeMinigame();
      }
    } else {
      game.misses += 1;
      game.streak = 0;
      game.rating = clamp(game.rating - 0.06, 0.2, 1);
    }
    renderForge();
    return;
  }

  if (game.mode === "reaper-hook") {
    const target = game.pips.find((pip) => !pip.hit && Math.abs(game.indicator - pip.position) <= 0.08);
    if (target) {
      target.hit = true;
      game.hits += 1;
      game.streak += 1;
      game.bestStreak = Math.max(game.bestStreak, game.streak);
      game.progress = game.hits / game.pips.length;
      game.rating = clamp(0.5 + game.progress * 0.34 + game.streak * 0.02, 0.2, 1);
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

  if (game.mode === "rail-bore") {
    const target = game.pips.find((pip) => !pip.hit && Math.abs(game.indicator - pip.position) <= 0.07);
    if (target) {
      target.hit = true;
      game.hits += 1;
      game.streak += 1;
      game.bestStreak = Math.max(game.bestStreak, game.streak);
      game.progress = game.hits / game.pips.length;
      game.rating = clamp(0.54 + game.progress * 0.34 + game.streak * 0.02, 0.2, 1);
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

  if (game.mode === "axe-throw" || game.mode === "bolt-latch") {
    const lanes = [
      { start: 0.1, end: 0.22 },
      { start: 0.78, end: 0.9 },
      { start: 0.14, end: 0.26 },
      { start: 0.74, end: 0.86 }
    ];
    const activeLanes = game.mode === "bolt-latch" ? lanes.slice(0, 3) : lanes;
    const lane = activeLanes[Math.min(game.laneIndex, activeLanes.length - 1)];
    const inLane = game.indicator >= lane.start && game.indicator <= lane.end;
    if (inLane) {
      game.hits += 1;
      game.streak += 1;
      game.bestStreak = Math.max(game.bestStreak, game.streak);
      game.laneIndex += 1;
      game.progress = game.hits / activeLanes.length;
      game.rating = clamp(0.5 + game.progress * 0.34 + game.streak * 0.018, 0.2, 1);
      if (game.hits >= activeLanes.length) {
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
  } else if (game.mode === "bow-string") {
    game.indicator += dt * (0.28 + game.elapsed * 0.06);
    if (game.indicator > 0.92) {
      game.indicator = 0.08;
    }
  } else if (game.mode === "medium") {
    game.indicator += dt * 0.72;
    if (game.indicator > 1.04) {
      game.indicator = -0.04;
    }
  } else if (game.mode === "rail-align") {
    game.indicator += dt * 0.84;
    if (game.indicator > 1.04) {
      game.indicator = -0.04;
    }
  } else if (game.mode === "combo-barrage") {
    game.indicator += dt * 0.9 * game.direction;
    if (game.indicator >= 0.94 || game.indicator <= 0.06) {
      game.direction *= -1;
      game.indicator = clamp(game.indicator, 0.06, 0.94);
    }
  } else if (game.mode === "shockwave-slam") {
    game.indicator += dt * (0.34 + game.elapsed * 0.08);
    if (game.indicator > 1.05) {
      game.indicator = 0.05;
    }
  } else if (game.mode === "reaper-hook") {
    game.indicator += dt * 0.62;
    if (game.indicator > 1.04) {
      game.indicator = -0.04;
    }
    game.pips.forEach((pip) => {
      if (pip.hit) {
        return;
      }
      pip.position = clamp(0.5 + Math.sin(game.elapsed * 2.8 + pip.phase) * 0.28, 0.14, 0.86);
    });
  } else if (game.mode === "rail-bore") {
    game.indicator += dt * 0.66;
    if (game.indicator > 1.04) {
      game.indicator = -0.04;
    }
    game.pips.forEach((pip) => {
      if (pip.hit) {
        return;
      }
      pip.position = clamp(0.5 + Math.sin(game.elapsed * 3.4 + pip.phase) * 0.24, 0.18, 0.82);
    });
  } else if (game.mode === "axe-throw" || game.mode === "bolt-latch") {
    game.indicator += dt * 1.08 * game.direction;
    if (game.indicator >= 0.94 || game.indicator <= 0.06) {
      game.direction *= -1;
      game.indicator = clamp(game.indicator, 0.06, 0.94);
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
  populateSelect(ui.familySelect, weaponFamilyCatalog);
  ui.familySelect.value = state.forge.family;
  populateSelect(ui.classSelect, kindCatalogForFamily(state.forge.family));
  ui.classSelect.value = state.forge.kind;
  populateSelect(ui.frameSelect, frameCatalogForKind(state.forge.kind));
  ui.frameSelect.value = state.forge.frame;
  populateSelect(ui.materialSelect, materialCatalog);
  ui.materialSelect.value = state.forge.material;
  ui.edgeSelect.innerHTML = `<option value="class-special">Built-In Weapon Trait</option>`;
  ui.edgeSelect.disabled = true;
  ui.edgeSelect.value = "class-special";

  const frame = frameCatalog[state.forge.frame] || frameCatalog.saber;
  const ranged = isRangedWeapon(frame);
  if (ui.ammoWorkshop) {
    ui.ammoWorkshop.hidden = !ranged;
  }
  ui.styleLabel.hidden = true;
  ui.impactChambersLabel.hidden = !ranged;
  ui.impactMountLabel.hidden = !ranged;
  ui.impactTypeLabel.hidden = !ranged;
  ui.launchTypeLabel.hidden = !ranged;
  ui.midAirTypeLabel.hidden = !ranged;
  ui.tipTypeLabel.hidden = !ranged;
  ui.preloadAmmoLabel.hidden = !ranged;

  if (ranged) {
    const labels = ammoWorkshopLabelsForFrame(frame);
    const mountCatalog = impactMountCatalogForFrame(frame);
    const impactCatalog = impactTypeCatalogForFrame(frame);
    const driveCatalog = launchCatalogForFrame(frame);
    const fieldCatalog = midAirCatalogForFrame(frame);
    const headCatalog = tipCatalogForFrame(frame);
    populateSelect(
      ui.impactChambers,
      Object.fromEntries(Array.from({ length: Math.max(1, frame.chamberMax || 1) }, (_, index) => {
        const value = `${index + 1}`;
        return [value, { label: `${value}` }];
      }))
    );
    ui.impactChambers.value = `${state.forge.impactChambers}`;

    populateSelect(ui.impactMount, mountCatalog);
    ui.impactMount.value = state.forge.impactMount;

    const compatibleImpacts = Object.fromEntries(
      validImpactIdsForFrame(frame, state.forge.impactChambers, state.forge.impactMount)
        .map((id) => [id, impactCatalog[id]])
    );

    populateSelect(ui.launchType, driveCatalog);
    ui.launchType.value = state.forge.launchType;
    populateSelect(
      ui.midAirType,
      Object.fromEntries(Object.entries(fieldCatalog).filter(([id]) => id !== "none"))
    );
    ui.midAirType.value = state.forge.midAirAddons[0] || Object.keys(fieldCatalog).find((id) => id !== "none") || "none";
    populateSelect(ui.tipType, headCatalog);
    ui.tipType.value = state.forge.tipType;

    const maxLoaded = effectivePreloadAmmo(frame, state.forge.impactChambers, frame.clipSize);
    populateSelect(
      ui.preloadAmmo,
      Object.fromEntries(Array.from({ length: maxLoaded }, (_, index) => {
        const value = `${index + 1}`;
        return [value, { label: `${value} ${isSpecialGunFrame(frame) ? labels.recipe.toLowerCase() : frame.ammoType}` }];
      }))
    );
    ui.preloadAmmo.value = `${Math.min(state.forge.preloadAmmo, maxLoaded)}`;
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

function setTouchButtonTitle(button, title) {
  if (!button) {
    return;
  }
  const titleNode = button.querySelector(".touch-button-title");
  if (titleNode) {
    titleNode.textContent = title;
  } else {
    button.textContent = title;
  }
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
      move: "Use the left D-pad on the fight screen to move left or right.",
      air: "Tap D-pad Up to jump, or hold D-pad Down to crouch.",
      attack: "Tap the A button once.",
      block: "Tap the X button as a strike lands to parry, or hold it to block.",
      mobility: "Tap B for Backstep or Y for Dash once.",
      hit: "Walk close, then tap A so the practice bot gets hit."
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
  const activeWeapon = state.match?.playerWeapon || weaponById(state.activeWeaponId) || currentBlueprint();
  const ranged = isRangedWeapon(activeWeapon);
  let cards = [];

  if (mode === "mobile") {
    cards = [
      {
        kicker: "Selected Device",
        title: "Mobile Controller Deck",
        body: ranged
          ? "Use the left D-pad cluster to move, jump, and crouch. Use the right face buttons like a controller: A fires, X blocks or parries on timing, B backsteps, Y dashes, R1 reloads, and Start pauses."
          : "Use the left D-pad cluster to move, jump, and crouch. Use the right face buttons like a controller: A attacks, X blocks or parries on timing, B backsteps, Y dashes, and Start pauses."
      },
      {
        kicker: "Arena Tip",
        title: ranged ? "Touch fire is controller-like" : "Touch play is controller-like",
        body: ranged
          ? `Mobile ranged aim still leans toward ${rivalName}, so focus on spacing while the A button keeps pressure on. Use R1 whenever the magazine runs dry, and remember that shots can now clash or get cut.`
          : `Mobile aim still leans toward ${rivalName}, so focus on spacing, guarding, and timing instead of dragging the weapon by hand. Clean melee lines now cut shots into weak bursts.`
      }
    ];
  } else if (mode === "controller") {
    cards = [
      {
        kicker: "Selected Device",
        title: "Controller Layout",
        body: ranged
          ? "Move with left stick or D-pad, aim with right stick, A jumps, RT or X fires, LT or LB blocks or parries on timing, B dodges, Y or RB dashes, and click the left stick to reload."
          : "Move with left stick or D-pad, aim with right stick, A jumps, RT or X attacks, LT or LB blocks or parries on timing, B dodges, and Y or RB dashes."
      },
      {
        kicker: "Arena Tip",
        title: ranged ? "Use both sticks and reload" : "Use both sticks",
        body: ranged
          ? `The left stick moves your fighter while the right stick points shots toward ${rivalName}. If you stop aiming, ranged assist still leans your fire toward the rival, but shots can now clash or get cut by a strong parry lane.`
          : `The left stick moves your fighter while the right stick points your weapon toward ${rivalName}. You can now cut incoming shots with a clean swing or parry line.`
      }
    ];
  } else {
    cards = [
      {
        kicker: "Selected Device",
        title: "PC Mouse And Keys",
        body: ranged
          ? "A and D move, W jumps, S crouches, hold left click to fire, right click blocks or parries, Q backsteps, E dashes, and R reloads."
          : "A and D move, W jumps, S crouches, left click throws a jab, right click blocks or parries, Q backsteps, and E dashes."
      },
      {
        kicker: "Arena Tip",
        title: ranged ? "Mouse points the barrel" : "Mouse controls the weapon",
        body: ranged
          ? `Keep the mouse on ${rivalName}, hold fire for steady shots, and tap R before the magazine empties if you want cleaner pressure. Mid-air shot clashes and blade cuts now punish lazy spam.`
          : `Keep the mouse pointed at ${rivalName} while you move so your jab line and freeform weapon drags stay on target. Clean swings and parry timing now cut shots into weak bursts.`
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
  if (ui.startMatch) {
    ui.startMatch.disabled = screen === "forge";
    ui.startMatch.textContent = screen === "forge" ? "Arena Only" : "Start Set";
  }
  if (ui.touchControls) {
    ui.touchControls.querySelectorAll("button").forEach((button) => {
      if (button.dataset.touchUi === "pause") {
        button.disabled = false;
      } else {
        button.disabled = screen === "forge";
      }
    });
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
      reload: gamepadButtonPressed(pad, 10),
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
    reviewsWritten: 0,
    skillPoints: 0,
    masteryPoints: 0
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

function defaultStyleProgress() {
  return {
    agility: 0,
    strength: 0,
    defense: 0,
    masteryUnlocked: false,
    masteryWeaponClaimed: false
  };
}

function defaultStyleLab() {
  return {
    activeStyleId: "tempest",
    styles: Object.fromEntries(Object.keys(combatStyleCatalog).map((styleId) => [styleId, defaultStyleProgress()]))
  };
}

function ensureAccountStyleLab(account) {
  if (!account) {
    return defaultStyleLab();
  }
  const base = defaultStyleLab();
  account.styleLab = {
    ...base,
    ...(account.styleLab || {}),
    styles: {
      ...base.styles,
      ...(account.styleLab?.styles || {})
    }
  };
  Object.keys(combatStyleCatalog).forEach((styleId) => {
    account.styleLab.styles[styleId] = {
      ...defaultStyleProgress(),
      ...(account.styleLab.styles[styleId] || {})
    };
  });
  if (!combatStyleCatalog[account.styleLab.activeStyleId]) {
    account.styleLab.activeStyleId = "tempest";
  }
  return account.styleLab;
}

function activeStyleId() {
  return ensureAccountStyleLab(currentAccount()).activeStyleId;
}

function activeStyleProgress(account = currentAccount()) {
  const styleLab = ensureAccountStyleLab(account);
  return styleLab.styles[styleLab.activeStyleId];
}

function styleFullyCompleted(progress) {
  return progress.agility >= STYLE_PATH_MAX && progress.strength >= STYLE_PATH_MAX && progress.defense >= STYLE_PATH_MAX;
}

function styleAbilityUnlocked(progress, path) {
  return Number(progress?.[path] || 0) >= STYLE_PATH_MAX;
}

function stylePassiveUnlockCount(level) {
  return [10, 20, 30, 40, 50].filter((milestone) => level >= milestone).length;
}

function styleBonusProfile(account = currentAccount()) {
  if (!account) {
    return null;
  }

  const styleLab = ensureAccountStyleLab(account);
  const styleId = styleLab.activeStyleId;
  const progress = styleLab.styles[styleId];
  return {
    styleId,
    progress,
    agilityLevel: progress.agility,
    strengthLevel: progress.strength,
    defenseLevel: progress.defense,
    abilityAgility: styleAbilityUnlocked(progress, "agility"),
    abilityStrength: styleAbilityUnlocked(progress, "strength"),
    abilityDefense: styleAbilityUnlocked(progress, "defense")
  };
}

function awardMasteryWeapon(account, styleId) {
  if (!account) {
    return false;
  }

  const styleLab = ensureAccountStyleLab(account);
  const progress = styleLab.styles[styleId];
  if (!masteryWeaponUnlocked(account, styleId) || progress.masteryWeaponClaimed) {
    return false;
  }

  const weaponId = combatStyleCatalog[styleId]?.masteryWeaponId;
  if (!weaponId || !frameCatalog[weaponId]) {
    return false;
  }

  const forged = buildWeaponFromForge({
    id: makeId(`mastery-${styleId}`),
    name: frameCatalog[weaponId].label.slice(0, 12),
    kind: frameCatalog[weaponId].kind,
    frame: weaponId,
    material: styleId === "bastion" ? "embersteel" : styleId === "phantom" ? "voidglass" : "sunsteel",
    edge: "class-special",
    heat: styleId === "bastion" ? 84 : 68,
    forgeQuality: 0.96
  });

  progress.masteryWeaponClaimed = true;
  state.armory = state.armory.filter((weapon) => weapon.frameId !== weaponId);
  state.armory.unshift(forged);
  if (!state.activeWeaponId) {
    state.activeWeaponId = forged.id;
  }
  return true;
}

function accountSummaryMeta(account) {
  const stats = ensureAccountStats(account);
  const losses = Math.max(0, stats.setsPlayed - stats.setsWon);
  const friendCount = ensureAccountFriends(account).length;
  const styleLab = ensureAccountStyleLab(account);
  const activeStyle = combatStyleCatalog[styleLab.activeStyleId];

  return {
    stats,
    line: `${stats.setsWon}W ${losses}L across ${stats.setsPlayed} sets`,
    reviewLine: `${stats.reviewsWritten} local review${stats.reviewsWritten === 1 ? "" : "s"}`,
    friendLine: `${friendCount} friend${friendCount === 1 ? "" : "s"} saved`,
    styleLine: `${activeStyle.label} style | ${stats.skillPoints} SP | ${stats.masteryPoints} MP`
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

function cloneAmmoRecipe(recipe) {
  if (!recipe || typeof recipe !== "object") {
    return null;
  }
  const cloned = {
    ...recipe,
    chamberImpacts: [...(recipe.chamberImpacts || [])],
    impactTypes: [...(recipe.impactTypes || [])],
    midAirAddons: [...(recipe.midAirAddons || [])]
  };
  cloned.id = cloned.id || makeId("ammo");
  cloned.signature = cloned.signature || ammoRecipeSignature(cloned);
  return cloned;
}

function forgeBlueprintFromWeapon(weapon) {
  const ammoCaseIds = Array.isArray(weapon?.ammoCaseIds) ? [...weapon.ammoCaseIds] : [];
  if (!ammoCaseIds.length && Array.isArray(weapon?.ammoCaseRounds)) {
    weapon.ammoCaseRounds.forEach((recipe) => {
      const signature = recipe.signature || ammoRecipeSignature(recipe);
      const existing = state.ammoRack.find((entry) => entry.signature === signature);
      const rackEntry = existing || {
        ...cloneAmmoRecipe(recipe),
        signature
      };
      if (!existing) {
        state.ammoRack.unshift(rackEntry);
      }
      ammoCaseIds.push(rackEntry.id);
    });
  }
  const ammoPrototype = weapon?.ammoPrototype || null;
  const frame = frameCatalog[weapon?.frameId || weapon?.frame] || frameCatalog.saber;
  return {
    id: weapon?.id || makeId("weapon"),
    name: String(weapon?.name || "Ashbite").trim().slice(0, 12) || "Ashbite",
    family: isRangedWeapon(weapon) ? "ranged" : "melee",
    kind: frameCatalog[weapon?.frameId]?.kind || weapon?.kind || "medium",
    frame: weapon?.frameId || weapon?.frame || "saber",
    material: weapon?.materialId || weapon?.material || "sunsteel",
    edge: weapon?.edgeId || weapon?.edge || "duelist",
    impactChambers: weapon?.impactChambers || 1,
    impactMount: weapon?.impactMount || defaultImpactMountForFrame(frame),
    impactType: weapon?.impactType || defaultImpactTypeForFrame(frame),
    chamberImpacts:
      ammoPrototype?.chamberImpacts ||
      weapon?.chamberImpacts ||
      [weapon?.impactType || defaultImpactTypeForFrame(frame)],
    launchType: weapon?.launchType || defaultLaunchTypeForFrame(frame),
    midAirType: weapon?.midAirType || "none",
    midAirAddons: ammoPrototype?.midAirAddons || weapon?.midAirAddons || [],
    tipType: weapon?.tipType || defaultTipTypeForFrame(frame),
    preloadAmmo: weapon?.preloadAmmo || weapon?.clipSize || 1,
    ammoCase: ammoCaseIds,
    heat: clamp(Number(weapon?.heat ?? weapon?.temper ?? 58), 0, 100),
    forgeQuality: clamp(Number(weapon?.forgeQuality ?? 0.5), 0.2, 1)
  };
}

function hydrateSavedWeapon(savedWeapon) {
  if (!savedWeapon || typeof savedWeapon !== "object") {
    return null;
  }
  const frameId = savedWeapon.frameId || savedWeapon.frame;
  const frame = frameCatalog[frameId];
  if (!frame) {
    return null;
  }
  if (frame.masteryStyle && !masteryWeaponVisible(frame)) {
    return {
      ...savedWeapon,
      frameId,
      frame: frame.label,
      classLabel: frame.classLabel,
      kind: frame.kind,
      family: frame.family || forgeFamilyForKind(frame.kind),
      ammoPrototype: cloneAmmoRecipe(savedWeapon.ammoPrototype),
      ammoCaseRounds: Array.isArray(savedWeapon.ammoCaseRounds) ? savedWeapon.ammoCaseRounds.map(cloneAmmoRecipe).filter(Boolean) : []
    };
  }
  const rebuilt = buildWeaponFromForge(forgeBlueprintFromWeapon(savedWeapon));
  return {
    ...rebuilt,
    id: savedWeapon.id || rebuilt.id,
    name: String(savedWeapon.name || rebuilt.name).trim().slice(0, 12) || rebuilt.name
  };
}

function validateLoadoutSelections() {
  const validIds = new Set(state.armory.map((weapon) => weapon.id));
  if (!validIds.has(state.activeWeaponId)) {
    state.activeWeaponId = state.armory[0]?.id || null;
  }
  if (!validIds.has(state.rivalWeaponId) || (state.armory.length > 1 && state.rivalWeaponId === state.activeWeaponId)) {
    const alternate = state.armory.find((weapon) => weapon.id !== state.activeWeaponId);
    state.rivalWeaponId = alternate?.id || state.activeWeaponId || null;
  }
}

function saveProgressState() {
  try {
    window.localStorage.setItem(
      "stickforge-progress",
      JSON.stringify({
        forge: state.forge,
        ammoRack: state.ammoRack,
        armory: state.armory,
        activeWeaponId: state.activeWeaponId,
        rivalWeaponId: state.rivalWeaponId,
        stage: state.stage,
        rivalFriendId: state.social.rivalFriendId,
        matchMode: ui.matchMode?.value || "solo",
        roundsToWin: Number(ui.roundsToWin?.value || 2)
      })
    );
  } catch (error) {
    // Ignore storage failures; the session can still run in memory.
  }
}

function loadProgressState(savedProgress) {
  if (!savedProgress || typeof savedProgress !== "object") {
    return;
  }
  if (savedProgress.forge) {
    state.forge = normalizeForgeState(savedProgress.forge);
  }
  if (Array.isArray(savedProgress.ammoRack)) {
    state.ammoRack = savedProgress.ammoRack.map(cloneAmmoRecipe).filter(Boolean);
  }
  if (Array.isArray(savedProgress.armory)) {
    state.armory = savedProgress.armory.map(hydrateSavedWeapon).filter(Boolean);
  }
  state.activeWeaponId = savedProgress.activeWeaponId || null;
  state.rivalWeaponId = savedProgress.rivalWeaponId || null;
  if (savedProgress.stage && stageCatalog[savedProgress.stage.id]) {
    state.stage = {
      ...state.stage,
      id: savedProgress.stage.id,
      hazard: savedProgress.stage.hazard !== false,
      pillars: savedProgress.stage.pillars !== false,
      lights: savedProgress.stage.lights !== false
    };
  }
  if (typeof savedProgress.rivalFriendId === "string" || savedProgress.rivalFriendId === null) {
    state.social.rivalFriendId = savedProgress.rivalFriendId;
  }
  if (["solo", "duel"].includes(savedProgress.matchMode)) {
    ui.matchMode.value = savedProgress.matchMode;
  }
  if (savedProgress.roundsToWin) {
    ui.roundsToWin.value = `${clamp(Number(savedProgress.roundsToWin), 1, 5)}`;
    ui.roundsToWinValue.textContent = ui.roundsToWin.value;
  }
  state.forge = reconcileAmmoCaseForForge(state.forge);
  validateLoadoutSelections();
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
        <span>${account ? accountMeta.styleLine : inputModeLabel() + " controls"}</span>
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
  const styleLab = ensureAccountStyleLab(account);
  const progress = styleLab.styles[styleLab.activeStyleId];
  stats.setsPlayed += 1;
  if (won) {
    stats.setsWon += 1;
  }
  if (styleFullyCompleted(progress)) {
    stats.masteryPoints += won ? 1400 : 900;
    if (stats.masteryPoints >= 250) {
      progress.masteryUnlocked = true;
    }
  } else {
    stats.skillPoints += won ? 3 : 2;
  }
  const gainedMasteryWeapon = awardMasteryWeapon(account, styleLab.activeStyleId);
  saveAuthState();
  if (gainedMasteryWeapon) {
    renderArmory();
  }
  renderAccountPanel(
    gainedMasteryWeapon
      ? `${combatStyleCatalog[styleLab.activeStyleId].label} mastery unlocked. ${frameCatalog[combatStyleCatalog[styleLab.activeStyleId].masteryWeaponId]?.label} was added to the armory.`
      : ""
  );
}

function setMenuOpen(open) {
  state.menu.open = open;
  if (open) {
    exitArenaFullscreen();
  }
  ui.mainMenu.classList.toggle("hidden", !open);
  renderMenuSummary();
  renderTutorialOffer();
  if (open) {
    renderStyleLab();
  }
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

function styleTrainingMode(styleId, path) {
  return `${styleId}-${path}`;
}

function createStyleTraining(styleId, path) {
  const mode = styleTrainingMode(styleId, path);
  const account = currentAccount();
  const currentLevel = account ? ensureAccountStyleLab(account).styles[styleId]?.[path] || 0 : 0;
  const difficulty = clamp(currentLevel / STYLE_PATH_MAX, 0, 1);
  const game = {
    styleId,
    path,
    level: currentLevel,
    difficulty,
    mode,
    active: false,
    finished: false,
    indicator: 0.18,
    direction: 1,
    progress: 0,
    elapsed: 0,
    timeLimit: 6,
    hits: 0,
    pips: []
  };

  if (mode === "tempest-agility") {
    game.timeLimit = 7.8 - difficulty * 1.6;
    game.pips = [0.2, 0.48, 0.78].map((position, index) => ({ id: index, position, hit: false }));
  } else if (mode === "tempest-strength") {
    game.timeLimit = 8 - difficulty * 1.7;
  } else if (mode === "tempest-defense") {
    game.timeLimit = 8.1 - difficulty * 1.5;
  } else if (mode === "bastion-agility") {
    game.timeLimit = 7.9 - difficulty * 1.4;
  } else if (mode === "bastion-strength") {
    game.timeLimit = 8.2 - difficulty * 1.8;
    game.indicator = 0.04;
  } else if (mode === "bastion-defense") {
    game.timeLimit = 8.3 - difficulty * 1.6;
  } else if (mode === "phantom-agility") {
    game.timeLimit = 7.5 - difficulty * 1.4;
    game.pips = [0.24, 0.74, 0.34].map((position, index) => ({ id: index, position, hit: false }));
  } else if (mode === "phantom-strength") {
    game.timeLimit = 7.8 - difficulty * 1.5;
    game.pips = [0.22, 0.52, 0.82].map((position, index) => ({ id: index, position, phase: index * 1.3, hit: false }));
  } else if (mode === "phantom-defense") {
    game.timeLimit = 7.9 - difficulty * 1.5;
  }
  return game;
}

function styleTrainingWindow(game, baseWindow) {
  return clamp(baseWindow + (1 - (game?.difficulty || 0)) * 0.08, baseWindow, baseWindow + 0.08);
}

function resetStyleTrainingState(styleId = activeStyleId(), path = "agility") {
  const safeStyleId = combatStyleCatalog[styleId] ? styleId : "tempest";
  const safePath = stylePathCatalog[path] ? path : "agility";
  state.styleTraining = createStyleTraining(safeStyleId, safePath);
  return state.styleTraining;
}

function styleTrainingMeta(styleId, path) {
  const label = stylePathCatalog[path].label;
  const style = combatStyleCatalog[styleId];
  const mode = styleTrainingMode(styleId, path);
  if (mode === "tempest-agility") {
    return { title: `${style.label} ${label} Trial`, copy: "Catch the moving wind marks in order.", action: "Step", reward: "+1 agility" };
  }
  if (mode === "tempest-strength") {
    return { title: `${style.label} ${label} Trial`, copy: "Hit the strike lane as the marker sweeps through center.", action: "Burst", reward: "+1 strength" };
  }
  if (mode === "tempest-defense") {
    return { title: `${style.label} ${label} Trial`, copy: "Time three calm guard checks inside the safe lane.", action: "Guard", reward: "+1 defense" };
  }
  if (mode === "bastion-agility") {
    return { title: `${style.label} ${label} Trial`, copy: "Cut the side lanes in sequence to train anchored steps.", action: "Step", reward: "+1 agility" };
  }
  if (mode === "bastion-strength") {
    return { title: `${style.label} ${label} Trial`, copy: "Slam in the heavy impact band three times.", action: "Slam", reward: "+1 strength" };
  }
  if (mode === "bastion-defense") {
    return { title: `${style.label} ${label} Trial`, copy: "Hold the guard rhythm steady through three checks.", action: "Guard", reward: "+1 defense" };
  }
  if (mode === "phantom-agility") {
    return { title: `${style.label} ${label} Trial`, copy: "Catch the ghost marks before they vanish.", action: "Slip", reward: "+1 agility" };
  }
  if (mode === "phantom-strength") {
    return { title: `${style.label} ${label} Trial`, copy: "Hit the drifting cut points as they slide across the lane.", action: "Cut", reward: "+1 strength" };
  }
  return { title: `${style.label} ${label} Trial`, copy: "Guard the alternating veil lanes cleanly.", action: "Veil", reward: "+1 defense" };
}

function startStyleTraining(path) {
  const account = currentAccount();
  if (!account) {
    renderStyleLab("Sign in before training styles.");
    return;
  }
  const stats = ensureAccountStats(account);
  if (stats.skillPoints <= 0) {
    renderStyleLab("You need skill points from matches before starting a style trial.");
    return;
  }
  const styleLab = ensureAccountStyleLab(account);
  const progress = styleLab.styles[styleLab.activeStyleId];
  if (progress[path] >= STYLE_PATH_MAX) {
    renderStyleLab(`${stylePathCatalog[path].label} is already maxed for ${combatStyleCatalog[styleLab.activeStyleId].label}.`);
    return;
  }
  state.styleTraining = createStyleTraining(styleLab.activeStyleId, path);
  state.styleTraining.active = true;
  renderStyleLab(`Started ${combatStyleCatalog[styleLab.activeStyleId].label} ${stylePathCatalog[path].label} trial.`);
}

function finishStyleTraining(success, message = "") {
  const game = state.styleTraining;
  const account = currentAccount();
  if (!account) {
    return;
  }
  const stats = ensureAccountStats(account);
  const styleLab = ensureAccountStyleLab(account);
  const progress = styleLab.styles[game.styleId];
  game.active = false;
  game.finished = true;
  if (success && stats.skillPoints > 0 && progress[game.path] < STYLE_PATH_MAX) {
    stats.skillPoints -= 1;
    progress[game.path] += 1;
    const allDone = styleFullyCompleted(progress);
    if (allDone && stats.masteryPoints >= 250) {
      progress.masteryUnlocked = true;
    }
  }
  const gainedMasteryWeapon = awardMasteryWeapon(account, game.styleId);
  saveAuthState();
  renderStyleLab(
    gainedMasteryWeapon
      ? `${message} ${frameCatalog[combatStyleCatalog[game.styleId]?.masteryWeaponId]?.label || "Mastery weapon"} added to the armory.`
      : message
  );
  if (gainedMasteryWeapon) {
    renderArmory();
  }
  renderMenuSummary();
}

function handleStyleTrainingAction() {
  const game = state.styleTraining;
  if (!game.active) {
    startStyleTraining(game.path || "agility");
    return;
  }
  const mode = game.mode;
  const laneWindow = styleTrainingWindow(game, 0.08);
  if (mode === "tempest-agility" || mode === "phantom-agility") {
    const target = game.pips.find((pip) => !pip.hit);
    if (target && Math.abs(game.indicator - target.position) <= laneWindow) {
      target.hit = true;
      game.hits += 1;
      game.progress = game.hits / game.pips.length;
      if (game.hits >= game.pips.length) {
        finishStyleTraining(true, "Style trial cleared. Path level increased.");
      } else {
        renderStyleLab("Clean timing. Keep going.");
      }
    } else {
      finishStyleTraining(false, "Style trial failed. Skill point was not spent.");
    }
    return;
  }
  if (mode === "tempest-strength" || mode === "bastion-strength") {
    const targetCenter = mode === "bastion-strength" ? 0.84 : 0.5;
    if (Math.abs(game.indicator - targetCenter) <= styleTrainingWindow(game, 0.09)) {
      game.hits += 1;
      game.progress = game.hits / 3;
      if (game.hits >= 3) {
        finishStyleTraining(true, "Style trial cleared. Path level increased.");
      } else {
        renderStyleLab("Heavy beat landed. One more.");
      }
    } else {
      finishStyleTraining(false, "Style trial failed. Missed the strike lane.");
    }
    return;
  }
  if (mode === "phantom-strength") {
    const target = game.pips.find((pip) => !pip.hit && Math.abs(game.indicator - pip.position) <= laneWindow);
    if (target) {
      target.hit = true;
      game.hits += 1;
      game.progress = game.hits / game.pips.length;
      if (game.hits >= game.pips.length) {
        finishStyleTraining(true, "Style trial cleared. Path level increased.");
      } else {
        renderStyleLab("Cut point captured. Keep moving.");
      }
    } else {
      finishStyleTraining(false, "Style trial failed. You missed the drifting cut point.");
    }
    return;
  }
  const laneBonus = (1 - game.difficulty) * 0.08;
  const inGuardLane = game.indicator >= 0.36 - laneBonus && game.indicator <= 0.64 + laneBonus;
  const inSideLane =
    (game.indicator >= 0.1 - laneBonus && game.indicator <= 0.22 + laneBonus) ||
    (game.indicator >= 0.78 - laneBonus && game.indicator <= 0.9 + laneBonus);
  const inVeilLane =
    (game.indicator >= 0.16 - laneBonus && game.indicator <= 0.28 + laneBonus) ||
    (game.indicator >= 0.72 - laneBonus && game.indicator <= 0.84 + laneBonus);
  const success =
    mode === "bastion-agility" ? inSideLane :
    mode === "phantom-defense" ? inVeilLane :
    inGuardLane;
  if (success) {
    game.hits += 1;
    game.progress = game.hits / 3;
    if (game.hits >= 3) {
      finishStyleTraining(true, "Style trial cleared. Path level increased.");
    } else {
      renderStyleLab("Guard check landed. Stay steady.");
    }
  } else {
    finishStyleTraining(false, "Style trial failed. Missed the training lane.");
  }
}

function updateStyleTraining(dt) {
  const game = state.styleTraining;
  if (!game.active) {
    return;
  }
  game.elapsed += dt;
  if (game.mode === "bastion-strength") {
    game.indicator += dt * 0.4;
    if (game.indicator > 1.05) {
      game.indicator = 0.05;
    }
  } else {
    game.indicator += dt * 0.72 * game.direction;
    if (game.indicator >= 0.94 || game.indicator <= 0.06) {
      game.direction *= -1;
      game.indicator = clamp(game.indicator, 0.06, 0.94);
    }
  }
  if (game.mode === "phantom-strength") {
    game.pips.forEach((pip) => {
      if (pip.hit) {
        return;
      }
      pip.position = clamp(0.5 + Math.sin(game.elapsed * 2.6 + pip.phase) * 0.28, 0.14, 0.86);
    });
  }
  if (game.elapsed >= game.timeLimit) {
    finishStyleTraining(false, "Style trial timed out.");
    return;
  }
  if (state.menu.open) {
    renderStyleLab();
  }
}

function masteryWeaponUnlocked(account, styleId) {
  const progress = ensureAccountStyleLab(account).styles[styleId];
  return Boolean(progress.masteryUnlocked && ensureAccountStats(account).masteryPoints >= 250);
}

function availableMasteryWeaponIds(account = currentAccount()) {
  if (!account) {
    return [];
  }
  return Object.entries(combatStyleCatalog)
    .filter(([styleId]) => masteryWeaponUnlocked(account, styleId))
    .map(([, style]) => style.masteryWeaponId);
}

function currentAccount() {
  return state.auth.accounts.find((account) => account.id === state.auth.activeAccountId) || null;
}

function renderStyleLab(statusMessage = "") {
  const account = currentAccount();
  populateSelect(ui.styleSelect, combatStyleCatalog);
  if (!account) {
    ui.styleSelect.value = "tempest";
    ui.styleLabStatus.textContent = statusMessage || "Sign in to earn style skill points, level paths, and unlock mastery weapons.";
    ui.styleSkillPoints.textContent = "0";
    ui.styleMasteryPoints.textContent = "0 / 250";
    ui.styleMasteryWeapon.textContent = "Locked";
    ui.styleSummary.innerHTML = `<article class="menu-summary-card"><span class="menu-summary-kicker">Guest</span><strong>No style profile</strong><p>Match rewards only save to signed-in accounts.</p></article>`;
    ui.stylePassives.innerHTML = `<p class="arena-hint">No passives yet.</p>`;
    ui.styleAbilities.innerHTML = `<p class="arena-hint">No abilities yet.</p>`;
    [ui.trainAgility, ui.trainStrength, ui.trainDefense, ui.styleTrainingStart, ui.styleTrainingAction].forEach((button) => {
      button.disabled = true;
    });
    return;
  }

  const styleLab = ensureAccountStyleLab(account);
  const stats = ensureAccountStats(account);
  const styleId = styleLab.activeStyleId;
  const style = combatStyleCatalog[styleId];
  const progress = styleLab.styles[styleId];
  const training =
    state.styleTraining && state.styleTraining.styleId === styleId
      ? state.styleTraining
      : createStyleTraining(styleId, "agility");
  ui.styleSelect.value = styleId;
  ui.styleLabStatus.textContent =
    statusMessage ||
    `${style.label} is active. Earn skill points from matches, then clear trials to level agility, strength, and defense.`;
  ui.styleSkillPoints.textContent = `${stats.skillPoints}`;
  ui.styleMasteryPoints.textContent = `${stats.masteryPoints} / 250`;
  ui.styleMasteryWeapon.textContent = masteryWeaponUnlocked(account, styleId)
    ? frameCatalog[style.masteryWeaponId]?.label || "Unlocked"
    : "Locked";
  ui.styleSummary.innerHTML = `
    <article class="menu-summary-card">
      <span class="menu-summary-kicker">Style</span>
      <strong>${style.label}</strong>
      <p>${style.summary}</p>
      <div class="menu-summary-meta">
      <span>${progress.agility}/${STYLE_PATH_MAX} agility</span>
      <span>${progress.strength}/${STYLE_PATH_MAX} strength</span>
      <span>${progress.defense}/${STYLE_PATH_MAX} defense</span>
      </div>
    </article>
    <article class="menu-summary-card">
      <span class="menu-summary-kicker">Rewards</span>
      <strong>${styleFullyCompleted(progress) ? "Mastery Track" : "Skill Track"}</strong>
      <p>${styleFullyCompleted(progress)
        ? "All three paths are complete. Matches now convert into mastery progress toward the style weapon."
        : "Keep winning matches to earn more skill points, then spend them on successful training trials."}</p>
      <div class="menu-summary-meta">
        <span>${stats.skillPoints} skill points</span>
        <span>${stats.masteryPoints} mastery points</span>
      </div>
    </article>
  `;
  ui.styleAgilityLevel.textContent = `${progress.agility} / ${STYLE_PATH_MAX}`;
  ui.styleStrengthLevel.textContent = `${progress.strength} / ${STYLE_PATH_MAX}`;
  ui.styleDefenseLevel.textContent = `${progress.defense} / ${STYLE_PATH_MAX}`;
  ui.styleAgilityCopy.textContent = `${style.passives.agility[Math.min(stylePassiveUnlockCount(progress.agility), style.passives.agility.length) - 1] || style.passives.agility[0]} ${progress.agility >= STYLE_PATH_MAX ? style.abilities.agility : ""}`.trim();
  ui.styleStrengthCopy.textContent = `${style.passives.strength[Math.min(stylePassiveUnlockCount(progress.strength), style.passives.strength.length) - 1] || style.passives.strength[0]} ${progress.strength >= STYLE_PATH_MAX ? style.abilities.strength : ""}`.trim();
  ui.styleDefenseCopy.textContent = `${style.passives.defense[Math.min(stylePassiveUnlockCount(progress.defense), style.passives.defense.length) - 1] || style.passives.defense[0]} ${progress.defense >= STYLE_PATH_MAX ? style.abilities.defense : ""}`.trim();
  ui.trainAgility.disabled = progress.agility >= STYLE_PATH_MAX || stats.skillPoints <= 0;
  ui.trainStrength.disabled = progress.strength >= STYLE_PATH_MAX || stats.skillPoints <= 0;
  ui.trainDefense.disabled = progress.defense >= STYLE_PATH_MAX || stats.skillPoints <= 0;
  ui.styleTrainingStart.disabled = stats.skillPoints <= 0;
  ui.styleTrainingAction.disabled = false;

  ui.stylePassives.innerHTML = [
    ...style.passives.agility.slice(0, stylePassiveUnlockCount(progress.agility)),
    ...style.passives.strength.slice(0, stylePassiveUnlockCount(progress.strength)),
    ...style.passives.defense.slice(0, stylePassiveUnlockCount(progress.defense))
  ].map((line) => `<article class="feedback-entry"><strong>Passive</strong><p>${line}</p></article>`).join("") || `<p class="arena-hint">No passives unlocked yet.</p>`;

  ui.styleAbilities.innerHTML = [
    progress.agility >= STYLE_PATH_MAX ? style.abilities.agility : "",
    progress.strength >= STYLE_PATH_MAX ? style.abilities.strength : "",
    progress.defense >= STYLE_PATH_MAX ? style.abilities.defense : "",
    masteryWeaponUnlocked(account, styleId) ? `Mastery weapon unlocked: ${frameCatalog[style.masteryWeaponId]?.label}.` : ""
  ].filter(Boolean).map((line) => `<article class="feedback-entry"><strong>Ability</strong><p>${line}</p></article>`).join("") || `<p class="arena-hint">Reach level ${STYLE_PATH_MAX} on a path to unlock its ability.</p>`;

  const meta = styleTrainingMeta(training.styleId || styleId, training.path || "agility");
  ui.styleTrainingTitle.textContent = meta.title;
  ui.styleTrainingCopy.textContent = meta.copy;
  ui.styleTrainingRating.textContent = training.active ? "Trial Live" : training.finished ? "Trial Ended" : "Idle";
  ui.styleTrainingStart.textContent = training.active ? "Restart Trial" : training.finished ? "Try Again" : "Start Trial";
  ui.styleTrainingAction.textContent = meta.action;
  ui.styleTrainingBar.style.setProperty("--indicator", `${Math.round(training.indicator * 100)}%`);
  ui.styleTrainingProgress.textContent = `${Math.round(training.progress * 100)}%`;
  ui.styleTrainingTime.textContent = training.active ? `${Math.max(0, training.timeLimit - training.elapsed).toFixed(1)}s` : "Ready";
  ui.styleTrainingReward.textContent = `${meta.reward} | Lv ${progress[training.path || "agility"]} -> ${Math.min(STYLE_PATH_MAX, progress[training.path || "agility"] + 1)}`;
  ui.styleTrainingStart.disabled = stats.skillPoints <= 0 && !training.active;
  ui.styleTrainingAction.disabled = !training.active && stats.skillPoints <= 0;
  ui.styleTrainingStatus.textContent = statusMessage || (training.active
    ? `${combatStyleCatalog[training.styleId].label} ${stylePathCatalog[training.path].label} trial live.`
    : "No trial running. Choose a path to start.");
  ui.styleTrainingPips.innerHTML = "";
  (training.pips || []).forEach((pip) => {
    const dot = document.createElement("span");
    dot.className = `forge-pip${pip.hit ? " hit" : ""}`;
    dot.style.left = `${Math.round(pip.position * 100)}%`;
    ui.styleTrainingPips.append(dot);
  });
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
      ? `${accountMeta.line}. ${accountMeta.reviewLine}. ${accountMeta.friendLine}. ${accountMeta.styleLine}. Accounts are saved locally in this browser.`
      : state.auth.accounts.length
        ? "Accounts are saved locally in this browser. Feedback is open to everyone, and friend lists save to the signed-in profile."
        : "Create a local account to keep your player name, reviews, and friends on this browser.");

  renderFeedbackInbox();
  renderFriendList();
  renderFeedbackPanel();
  renderMenuSummary();
  renderBroadcastPanels();
  renderStyleLab();
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
    styleLab: defaultStyleLab(),
    friends: [],
    createdAt: new Date().toISOString()
  };

  state.auth.accounts.push(account);
  state.auth.activeAccountId = account.id;
  resetStyleTrainingState(account.styleLab.activeStyleId, "agility");
  saveAuthState();
  ui.accountName.value = "";
  ui.accountPasscode.value = "";
  if (state.match) {
    scheduleFeedbackPrompt();
  }
  renderAccountPanel(`${account.name} created and signed in.`);
  renderFriendList(`${account.name}'s friend list is ready.`);
  renderReviewList(`${account.name} can now leave menu reviews.`);
  renderStyleLab(`${account.name}'s style lab is ready. Play matches to earn your first skill points.`);
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
  resetStyleTrainingState(ensureAccountStyleLab(account).activeStyleId, "agility");
  saveAuthState();
  ui.accountName.value = "";
  ui.accountPasscode.value = "";
  if (state.match) {
    scheduleFeedbackPrompt();
  }
  renderAccountPanel(`Signed in as ${account.name}.`);
  renderFriendList(`${account.name}'s friend list is loaded.`);
  renderReviewList(`Signed in as ${account.name}.`);
  renderStyleLab(`${account.name}'s style lab is loaded.`);
  renderMenuSummary();
}

function logoutAccount() {
  if (state.feedback.promptHandle) {
    window.clearTimeout(state.feedback.promptHandle);
    state.feedback.promptHandle = null;
  }
  state.auth.activeAccountId = null;
  resetStyleTrainingState("tempest", "agility");
  saveAuthState();
  closeFeedbackPanel();
  renderAccountPanel("Signed out. Feedback stays open, but friends and reviews save to signed-in players.");
  renderFriendList("Sign in to manage friends.");
  renderReviewList("Signed out. Reviews need a signed-in player name.");
  renderStyleLab("Sign in to earn style skill points, level paths, and unlock mastery weapons.");
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
  const isRanged = frame.family === "ranged";
  const usesStyle = false;
  const edge =
    {
      label: "Built-In Weapon Trait",
      summary: "This weapon uses its own built-in class trait.",
      damage: 0,
      reach: 0,
      speed: 0,
      cooldown: 0,
      knockback: 0,
      arc: 0,
      weight: 0,
      ability: "This weapon uses its own built-in class trait."
    };
  const heat = clamp(Number(safeForge.heat ?? safeForge.temper ?? 58), 0, 100);
  const forgeQuality = clamp(Number(safeForge.forgeQuality ?? 0.5), 0.2, 1);
  const forgeDelta = forgeQuality - 0.5;
  const heatScale = heat / 100;

  if (isRanged) {
    const ammoPrototype = buildAmmoRecipeFromForge(safeForge, frame);
    const rackRounds = (safeForge.ammoCase || [])
      .map((recipeId) => state.ammoRack.find((recipe) => recipe.id === recipeId))
      .filter((recipe) => ammoRecipeCompatibleWithFrame(recipe, frame))
      .map((recipe) => ({ ...recipe, chamberImpacts: [...recipe.chamberImpacts], impactTypes: [...recipe.impactTypes], midAirAddons: [...recipe.midAirAddons] }));
    const activeRounds = rackRounds.length ? rackRounds : [ammoPrototype];
    const dominantRound = activeRounds[0] || ammoPrototype;
    const payloadLoad = Math.max(0, dominantRound.impactChambers - 1);
    const caseCapacity = ammoCaseCapacityForFrame(frame, activeRounds, safeForge.preloadAmmo || frame.clipSize);
    const clipSize = Math.max(1, Number(frame.clipSize || 1));
    const preloadAmmo = clamp(Number(safeForge.preloadAmmo || clipSize), 1, caseCapacity);
    const ammoCaseRounds = activeRounds.slice(0, preloadAmmo);
    const ammoCaseSummary = ammoCaseRounds.map((round, index) => `${index + 1}. ${round.name}`).join(" -> ");
    let damage = clamp(
      Math.round(frame.damage + material.damage + heatScale * 4 + forgeDelta * 5 + dominantRound.damageBonus * 0.35),
      11,
      48
    );
    const reach = clamp(Math.round(frame.range + material.reach * 8 + payloadLoad * 14), 280, 660);
    let projectileSpeed = clamp(
      Math.round(frame.projectileSpeed + dominantRound.speedBonus + forgeDelta * 120),
      560,
      1320
    );
    let cooldown = clamp(Number((frame.cooldown + payloadLoad * 0.04 - forgeDelta * 0.05).toFixed(2)), 0.1, 0.86);
    let reloadTime = clamp(Number((frame.reload + payloadLoad * 0.12 - forgeDelta * 0.08).toFixed(2)), 0.54, 1.92);
    let knockback = clamp(Number((frame.knockback + material.knockback + dominantRound.knockbackBonus + forgeDelta * 0.08).toFixed(2)), 0.84, 1.9);
    let weight = clamp(Number((frame.weight + material.weight + payloadLoad * 1.8 + heatScale * 3 - forgeDelta * 2.2).toFixed(1)), 5, 32);
    let moveScale = clamp(Number((frame.moveScale + material.moveScale - payloadLoad * 0.04).toFixed(2)), 0.68, 1.16);
    let speed = clamp(Number((frame.speed + material.speed - payloadLoad * 0.02 + forgeDelta * 0.06).toFixed(2)), 0.72, 1.28);
    const ammoLabel = `${preloadAmmo}/${caseCapacity} ${frame.ammoType}`;
    const ammoLabels = ammoWorkshopLabelsForFrame(frame);
    const chamberSummary =
      isSpecialGunFrame(frame)
        ? `${dominantRound.impactChambers} ${ammoLabels.slotUnit.toLowerCase()}${dominantRound.impactChambers === 1 ? "" : "s"} in a ` +
          `${dominantRound.impactMountLabel.toLowerCase()}. Bigger ${ammoLabels.recipe.toLowerCase()}s shrink the rack size but carry more sigil and ${ammoLabels.midAir.toLowerCase()} space.`
        : `${dominantRound.impactChambers} impact chamber${dominantRound.impactChambers === 1 ? "" : "s"} in a ` +
          `${dominantRound.impactMountLabel.toLowerCase()} setup. Bigger rounds shrink the case size but carry more effect space.`;
    const classText =
      frame.kind === "sidearm"
        ? "quick sidearm pressure with fast reloads"
        : frame.kind === "assault"
          ? "steady rifle fire with customizable ammo"
          : frame.kind === "heavy"
            ? "heavy ranged punishment with brutal payloads"
            : "special ranged shots using bolts or rails";
    let fireModeLabel = "Single Shot";
    let burstCount = 1;
    let burstSpread = 0;
    let burstDamageScale = 1;
    let extraPierce = dominantRound.projectilePierceBonus || 0;
    let explosiveBoost = 0;
    let scatterImpact = dominantRound.scatterImpact;
    let pullImpact = dominantRound.pullImpact;
    let emberTrail = dominantRound.emberTrail;
    let stormTrail = dominantRound.stormTrail;
    let spiralFlight = dominantRound.spiralCount > 0;
    let projectileGlow = material.color;
    let bonusShockCount = 0;
    let bonusPortalCount = 0;
    let bonusSlowCount = 0;
    let bonusRuptureCount = 0;
    let bonusBlockBreak = 0;

    switch (safeForge.frame) {
      case "machinepistol":
        fireModeLabel = "Twin Tap";
        burstCount = 2;
        burstSpread = 0.028;
        burstDamageScale = 0.7;
        cooldown = clamp(cooldown - 0.02, 0.1, 0.86);
        break;
      case "burstcarbine":
        fireModeLabel = "3-Round Burst";
        burstCount = 3;
        burstSpread = 0.024;
        burstDamageScale = 0.54;
        break;
      case "marksman":
        fireModeLabel = "Pierce Line";
        extraPierce += 1;
        projectileSpeed = clamp(projectileSpeed + 40, 560, 1320);
        break;
      case "needler":
        fireModeLabel = "3-Needle Burst";
        burstCount = 3;
        burstSpread = 0.02;
        burstDamageScale = 0.46;
        projectileSpeed = clamp(projectileSpeed + 20, 560, 1320);
        bonusRuptureCount += 1;
        break;
      case "volleyrifle":
        fireModeLabel = "5-Round Sweep";
        burstCount = 5;
        burstSpread = 0.022;
        burstDamageScale = 0.38;
        reloadTime = clamp(reloadTime + 0.06, 0.54, 1.92);
        bonusBlockBreak += 2;
        break;
      case "longshot":
        fireModeLabel = "Long Scope";
        extraPierce += 1;
        projectileSpeed = clamp(projectileSpeed + 60, 560, 1320);
        damage = clamp(damage + 2, 11, 48);
        moveScale = clamp(moveScale - 0.03, 0.68, 1.16);
        break;
      case "linebreaker":
        fireModeLabel = "Breaker Line";
        extraPierce += 1;
        projectileSpeed = clamp(projectileSpeed + 20, 560, 1320);
        bonusBlockBreak += 3;
        break;
      case "sniper":
        fireModeLabel = "Scope Shot";
        extraPierce += 2;
        projectileSpeed = clamp(projectileSpeed + 80, 560, 1320);
        damage = clamp(damage + 3, 11, 48);
        moveScale = clamp(moveScale - 0.06, 0.68, 1.16);
        break;
      case "flakcannon":
        fireModeLabel = "Flak Fan";
        burstCount = 5;
        burstSpread = 0.09;
        burstDamageScale = 0.34;
        scatterImpact = true;
        explosiveBoost = 0.2;
        break;
      case "minigun":
        fireModeLabel = "Spin Stream";
        burstCount = 2;
        burstSpread = 0.038;
        burstDamageScale = 0.56;
        cooldown = clamp(cooldown - 0.03, 0.1, 0.86);
        reloadTime = clamp(reloadTime + 0.08, 0.54, 1.92);
        moveScale = clamp(moveScale - 0.04, 0.68, 1.16);
        break;
      case "sawedoff":
        fireModeLabel = "Scatter Blast";
        burstCount = 6;
        burstSpread = 0.105;
        burstDamageScale = 0.26;
        projectileSpeed = clamp(projectileSpeed - 120, 560, 1320);
        knockback = clamp(knockback + 0.14, 0.84, 1.9);
        break;
      case "battlerifle":
        fireModeLabel = "2-Round Burst";
        burstCount = 2;
        burstSpread = 0.014;
        burstDamageScale = 0.76;
        projectileSpeed = clamp(projectileSpeed + 35, 560, 1320);
        break;
      case "drumrifle":
        fireModeLabel = "4-Round Spray";
        burstCount = 4;
        burstSpread = 0.022;
        burstDamageScale = 0.44;
        reloadTime = clamp(reloadTime + 0.08, 0.54, 1.92);
        moveScale = clamp(moveScale - 0.02, 0.68, 1.16);
        break;
      case "warbow":
        fireModeLabel = "Deep Draw";
        extraPierce += 1;
        knockback = clamp(knockback + 0.08, 0.84, 1.9);
        break;
      case "stormbow":
        fireModeLabel = "Storm Volley";
        burstCount = 3;
        burstSpread = 0.032;
        burstDamageScale = 0.48;
        projectileGlow = "#9ef4ff";
        stormTrail = true;
        bonusShockCount += 1;
        break;
      case "emberbow":
        fireModeLabel = "Ember Draw";
        projectileGlow = "#ffb77e";
        emberTrail = true;
        explosiveBoost += 0.06;
        damage = clamp(damage + 1, 11, 48);
        break;
      case "moonbow":
        fireModeLabel = "Twin Crescent";
        burstCount = 2;
        burstSpread = 0.026;
        burstDamageScale = 0.7;
        projectileGlow = "#dccaff";
        bonusPortalCount += 1;
        bonusSlowCount += 1;
        break;
      case "boltcaster":
        fireModeLabel = "3-Bolt Rack";
        burstCount = 3;
        burstSpread = 0.024;
        burstDamageScale = 0.58;
        reloadTime = clamp(reloadTime + 0.04, 0.54, 1.92);
        break;
      case "repeater":
        fireModeLabel = "Twin Bolt";
        burstCount = 2;
        burstSpread = 0.018;
        burstDamageScale = 0.72;
        reloadTime = clamp(reloadTime - 0.04, 0.54, 1.92);
        break;
      case "harpoon":
        fireModeLabel = "Harpoon Shot";
        projectileSpeed = clamp(projectileSpeed - 40, 560, 1320);
        knockback = clamp(knockback + 0.06, 0.84, 1.9);
        break;
      case "ballista":
        fireModeLabel = "Ballista Bolt";
        projectileGlow = "#f6edd9";
        extraPierce += 2;
        damage = clamp(damage + 2, 11, 48);
        knockback = clamp(knockback + 0.14, 0.84, 1.9);
        reloadTime = clamp(reloadTime + 0.1, 0.54, 1.92);
        moveScale = clamp(moveScale - 0.04, 0.68, 1.16);
        break;
      case "railgun":
        fireModeLabel = "Emitter Rail";
        projectileGlow = "#d1f7ff";
        if (dominantRound.shockCount || dominantRound.poisonCount) {
          damage = clamp(damage + 2, 11, 48);
        }
        break;
      case "coillance":
        fireModeLabel = "Lance Rail";
        extraPierce += 2;
        projectileGlow = "#d1f7ff";
        projectileSpeed = clamp(projectileSpeed + 40, 560, 1320);
        break;
      case "arcrail":
        fireModeLabel = "Arc Rail";
        projectileGlow = "#b7f6ff";
        damage = clamp(damage + 1, 11, 48);
        bonusShockCount += 1;
        break;
      case "ionrail":
        fireModeLabel = "Ion Rail";
        projectileGlow = "#9ef4ff";
        projectileSpeed = clamp(projectileSpeed + 30, 560, 1320);
        bonusShockCount += 2;
        break;
      case "prismrail":
        fireModeLabel = "Prism Rail";
        burstCount = 2;
        burstSpread = 0.022;
        burstDamageScale = 0.68;
        projectileGlow = "#efc2ff";
        bonusPortalCount += 1;
        break;
      case "ghostrail":
        fireModeLabel = "Ghost Rail";
        projectileGlow = "#d9cbff";
        projectileSpeed = clamp(projectileSpeed + 24, 560, 1320);
        bonusPortalCount += 1;
        break;
      case "breacher":
        fireModeLabel = "Breach Pop";
        knockback = clamp(knockback + 0.08, 0.84, 1.9);
        bonusRuptureCount += 1;
        bonusBlockBreak += 4;
        break;
      case "thumper":
        fireModeLabel = "Thump Shell";
        knockback = clamp(knockback + 0.12, 0.84, 1.9);
        explosiveBoost += 0.08;
        bonusSlowCount += 1;
        bonusBlockBreak += 2;
        break;
      case "crusher":
        fireModeLabel = "Crusher Slug";
        knockback = clamp(knockback + 0.14, 0.84, 1.9);
        explosiveBoost += 0.1;
        bonusSlowCount += 1;
        bonusBlockBreak += 3;
        break;
      default:
        break;
    }

    const abilitySummary = `${frame.special?.summary || ""} ${dominantRound.rigSummary || ""} ${dominantRound.summary} Load order: ${ammoCaseSummary || dominantRound.name}.`.trim();
    const heatSummary =
      heat >= 70
        ? "High forge heat hardens the barrel and round body, raising shot damage but making the build heavier."
        : heat >= 40
          ? "Mid forge heat keeps the gun stable while still boosting shot damage."
          : "Lower forge heat keeps the weapon lighter and easier to handle.";
    const forgeSummary =
      forgeQuality >= 0.9
        ? "Masterforged ranged finish: cleaner cycling, stronger launch, and tighter shots."
        : forgeQuality >= 0.76
          ? "Tempered ranged finish: stable ammo handling and reliable shot behavior."
          : forgeQuality >= 0.58
            ? "Field-ready ranged finish: solid enough for live fights."
            : forgeQuality >= 0.42
              ? "Rough ranged finish: usable, but the ammo handling is loose."
              : "Crude ranged finish: the loading system feels unstable and slow.";

    return {
      id: safeForge.id || makeId("weapon"),
      name: safeForge.name.trim().slice(0, 12) || "Ashbite",
      frameId: safeForge.frame,
      frame: frame.label,
      classLabel: frame.classLabel,
      kind: frame.kind,
      family: "ranged",
      materialId: safeForge.material,
      material: material.label,
      edgeId: dominantRound.impactTypes[0] || defaultImpactTypeForFrame(frame),
      edge: `${dominantRound.impactLabel} Round`,
      usesStyle: false,
      heat,
      forgeQuality,
      forgeQualityLabel: forgeRatingLabel(forgeQuality),
      weight,
      damage,
      reach,
      speed,
      cooldown,
      knockback,
      arc: frame.arc,
      moveScale,
      color: material.color,
      frameSummary: frame.summary,
      frameDesign: frame.design,
      materialSummary: material.summary,
      edgeSummary: chamberSummary,
      heatSummary,
      forgeSummary,
      styleText: `${frame.classLabel} ranged build | ${fireModeLabel} | ${dominantRound.impactLabel} | ${dominantRound.tipLabel} ${ammoLabels.headWord}`,
      abilitySummary,
      specialType: frame.special?.type || "ranged-shot",
      fireModeLabel,
      executeThreshold: 0,
      backstabBonus: 1,
      stealthOpacity: 1,
      ammoType: frame.ammoType,
      clipSize,
      preloadAmmo,
      impactChambers: dominantRound.impactChambers,
      impactMount: dominantRound.impactMount,
      impactMountLabel: dominantRound.impactMountLabel,
      chamberImpacts: [...dominantRound.chamberImpacts],
      impactType: dominantRound.impactTypes[0] || defaultImpactTypeForFrame(frame),
      impactTypes: [...dominantRound.impactTypes],
      impactLabel: dominantRound.impactLabel,
      launchType: dominantRound.launchType,
      launchLabel: dominantRound.launchLabel,
      midAirType: dominantRound.midAirAddons[0] || "none",
      midAirAddons: [...dominantRound.midAirAddons],
      midAirLabel: dominantRound.midAirLabel,
      tipType: dominantRound.tipType,
      tipLabel: dominantRound.tipLabel,
      projectileSpeed,
      reloadTime,
      projectileRange: reach,
      ammoLabel,
      ammoPrototype,
      ammoCaseRounds,
      ammoCaseIds: [...safeForge.ammoCase],
      ammoCaseSummary: ammoCaseSummary || dominantRound.name,
      blockBreak: dominantRound.blockBreakBonus + bonusBlockBreak,
      projectilePierce: extraPierce,
      delayedImpact: dominantRound.delayedImpact,
      homingStrength: dominantRound.homingStrength,
      redirectShot: dominantRound.redirectCharges > 0,
      redirectCharges: dominantRound.redirectCharges,
      blizzardTrail: dominantRound.blizzardTrail,
      emberTrail,
      stormTrail,
      spiralFlight: dominantRound.spiralCount > 0,
      spiralCount: dominantRound.spiralCount,
      scatterImpact,
      pullImpact,
      explosiveBoost,
      shockCount: dominantRound.shockCount + bonusShockCount,
      poisonCount: dominantRound.poisonCount,
      portalCount: dominantRound.portalCount + bonusPortalCount,
      slowCount: (dominantRound.slowCount || 0) + bonusSlowCount,
      ruptureCount: (dominantRound.ruptureCount || 0) + bonusRuptureCount,
      burstCount,
      burstSpread,
      burstDamageScale,
      projectileGlow,
      lore:
        `${frame.label} built from ${material.label.toLowerCase()} with ${dominantRound.impactLabel.toLowerCase()} ${isSpecialGunFrame(frame) ? "sigils" : "ammo"}, ` +
        `${dominantRound.launchLabel.toLowerCase()}, ${dominantRound.midAirLabel.toLowerCase()} ${isSpecialGunFrame(frame) ? ammoLabels.midAir.toLowerCase() : "flight"}, and a ${dominantRound.tipLabel.toLowerCase()} ${isSpecialGunFrame(frame) ? ammoLabels.headWord : "tip"}. ` +
        `${dominantRound.rigSummary || ""} ${frame.special?.summary || ""} ${chamberSummary} Case order: ${ammoCaseSummary || dominantRound.name}. ${forgeSummary}`.trim()
    };
  }

  const classWeightBias = frame.kind === "long" ? 3 : frame.kind === "short" ? -1.4 : frame.kind === "special" ? 0.8 : 0;
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
    classText = "solid slash pressure with built-in weapon traits";
  } else if (frame.kind === "short") {
    classText = "ambush pressure with back-hit damage and stealthy crouches";
  } else if (frame.kind === "special") {
    classText = "custom weapon tech with a unique signature move";
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
    edgeId: frame.special?.type || safeForge.edge,
    edge: `${frame.classLabel} Trait`,
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
    edgeSummary: `${frame.classLabel} weapons carry built-in class traits tuned to their class.`,
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
  const frameId = randomChoice(Object.keys(frameCatalog).filter((id) => !frameCatalog[id].masteryStyle));
  const frame = frameCatalog[frameId];
  const randomChambers = randomRange(1, (frame?.chamberMax || 1) + 0.9);
  const impactChambers = clamp(Math.floor(randomChambers), 1, Math.max(1, frame?.chamberMax || 1));
  const mountCatalog = impactMountCatalogForFrame(frame);
  const impactCatalog = impactTypeCatalogForFrame(frame);
  const driveCatalog = launchCatalogForFrame(frame);
  const fieldCatalog = midAirCatalogForFrame(frame);
  const headCatalog = tipCatalogForFrame(frame);
  const impactMount = compatibleImpactMount(frame, randomChoice(Object.keys(mountCatalog)));
  const chamberImpacts = Array.from({ length: impactChambers }, () =>
    compatibleImpactType(frame, impactChambers, impactMount, randomChoice(Object.keys(impactCatalog)))
  );
  const impactType = chamberImpacts[0] || defaultImpactTypeForFrame(frame);
  const midAirAddons = isRangedWeapon(frame)
    ? Array.from(
        { length: Math.floor(randomRange(0, frame.kind === "heavy" ? 2.8 : 2.2)) },
        () => randomChoice(Object.keys(fieldCatalog).filter((id) => id !== "none"))
      )
    : [];
  const forge = {
    id: makeId("rival"),
    name: `${randomChoice(prefixes)}${randomChoice(suffixes)}`,
    family: forgeFamilyForKind(frame?.kind || "medium"),
    kind: frame?.kind || "medium",
    frame: frameId,
    material: randomChoice(Object.keys(materialCatalog)),
    edge: randomChoice(Object.keys(edgeCatalog)),
    impactChambers,
    impactMount,
    impactType,
    chamberImpacts,
    launchType: randomChoice(Object.keys(driveCatalog)),
    midAirType: midAirAddons[0] || "none",
    midAirAddons,
    tipType: randomChoice(Object.keys(headCatalog)),
    preloadAmmo: effectivePreloadAmmo(frame, impactChambers, Math.ceil((frame?.clipSize || 1) * randomRange(0.5, 1))),
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

function currentAmmoRecipe() {
  const frame = frameCatalog[state.forge.frame] || frameCatalog.longbow;
  return buildAmmoRecipeFromForge(state.forge, frame);
}

function saveCurrentAmmoRecipe() {
  const frame = frameCatalog[state.forge.frame] || frameCatalog.longbow;
  if (!isRangedWeapon(frame)) {
    return;
  }
  const labels = ammoWorkshopLabelsForFrame(frame);
  const recipe = currentAmmoRecipe();
  const existingIndex = state.ammoRack.findIndex((entry) => entry.signature === recipe.signature);
  if (existingIndex >= 0) {
    recipe.id = state.ammoRack[existingIndex].id;
    state.ammoRack.splice(existingIndex, 1, recipe);
  } else {
    state.ammoRack.unshift(recipe);
  }
  renderForge();
  setMatchSummary(`${recipe.name} crafted and stored in the ${isSpecialGunFrame(frame) ? `${labels.familyTag.toLowerCase()} rack` : "ammo rack"}.`);
}

function addCurrentAmmoToCase() {
  const frame = frameCatalog[state.forge.frame] || frameCatalog.longbow;
  if (!isRangedWeapon(frame)) {
    return;
  }
  const labels = ammoWorkshopLabelsForFrame(frame);
  const recipe = currentAmmoRecipe();
  let rackEntry = state.ammoRack.find((entry) => entry.signature === recipe.signature);
  if (!rackEntry) {
    rackEntry = recipe;
    state.ammoRack.unshift(rackEntry);
  }
  const maxSlots = Math.max(1, Number(state.forge.preloadAmmo || 1));
  const nextCase = [...(state.forge.ammoCase || [])];
  if (nextCase.length >= maxSlots) {
    nextCase.shift();
  }
  nextCase.push(rackEntry.id);
  state.forge = normalizeForgeState({
    ...state.forge,
    ammoCase: nextCase
  });
  state.forge = reconcileAmmoCaseForForge(state.forge);
  renderForge();
  setMatchSummary(`${rackEntry.name} loaded into ${labels.recipe.toLowerCase()} slot ${state.forge.ammoCase.length}.`);
}

function clearAmmoCase() {
  const frame = frameCatalog[state.forge.frame] || frameCatalog.longbow;
  const labels = ammoWorkshopLabelsForFrame(frame);
  state.forge = normalizeForgeState({
    ...state.forge,
    ammoCase: []
  });
  state.forge = reconcileAmmoCaseForForge(state.forge);
  renderForge();
  setMatchSummary(`${isSpecialGunFrame(frame) ? `${labels.recipe} rack` : "Ammo case"} cleared.`);
}

function renderImpactChamberList(frame) {
  if (!ui.impactChamberList) {
    return;
  }
  ui.impactChamberList.innerHTML = "";
  const impactCatalog = impactTypeCatalogForFrame(frame);
  const labels = ammoWorkshopLabelsForFrame(frame);
  const validImpacts = validImpactIdsForFrame(frame, state.forge.impactChambers, state.forge.impactMount);
  state.forge.chamberImpacts.forEach((impactId, index) => {
    const row = document.createElement("div");
    row.className = "chamber-row";

    const header = document.createElement("header");
    const title = document.createElement("strong");
    title.textContent = `${labels.slotUnit || "Chamber"} ${index + 1}`;
    const tag = document.createElement("span");
    tag.className = "pill";
    tag.textContent = isSpecialGunFrame(frame)
      ? specialAmmoSlotTag(frame, index, state.forge.chamberImpacts.length)
      : index === 0 ? "Front" : index === state.forge.chamberImpacts.length - 1 ? "Rear" : "Core";
    header.append(title, tag);

    const select = document.createElement("select");
    validImpacts.forEach((validId) => {
      const option = document.createElement("option");
      option.value = validId;
      option.textContent = impactCatalog[validId].label;
      if (validId === impactId) {
        option.selected = true;
      }
      select.append(option);
    });
    select.addEventListener("change", () => {
      const chamberImpacts = [...state.forge.chamberImpacts];
      chamberImpacts[index] = select.value;
      state.forge = normalizeForgeState({
        ...state.forge,
        chamberImpacts
      });
      state.forge = reconcileAmmoCaseForForge(state.forge);
      resetForgeMinigame(state.forge.frame, false);
      renderForge();
    });

    const copy = document.createElement("p");
    copy.textContent = impactCatalog[impactId]?.summary || "";
    row.append(header, select, copy);
    ui.impactChamberList.append(row);
  });
}

function renderMidAirAddonList() {
  if (!ui.midAirAddonList) {
    return;
  }
  ui.midAirAddonList.innerHTML = "";
  const frame = frameCatalog[state.forge.frame] || frameCatalog.longbow;
  const labels = ammoWorkshopLabelsForFrame(frame);
  const fieldCatalog = midAirCatalogForFrame(frame);
  const emptyLabel = isSpecialGunFrame(frame)
    ? `${labels.noMidAirLabel} loaded. Stack as many ${labels.midAir.toLowerCase()} layers as you want to make the ${labels.recipe.toLowerCase()} steer, split, ghost, or chase harder.`
    : "No mid-air add-ons loaded. Add as many as you want to stack flight behavior.";
  if (!state.forge.midAirAddons.length) {
    const empty = document.createElement("p");
    empty.className = "arena-hint";
    empty.textContent = emptyLabel;
    ui.midAirAddonList.append(empty);
    return;
  }
  state.forge.midAirAddons.forEach((addonId, index) => {
    const item = document.createElement("div");
    item.className = "token-item";
    const copy = document.createElement("div");
    copy.innerHTML = `
      <strong>${fieldCatalog[addonId]?.label || addonId}</strong>
      <p>${fieldCatalog[addonId]?.summary || ""}</p>
    `;
    const button = document.createElement("button");
    button.className = "ghost-button";
    button.type = "button";
    button.textContent = "Remove";
    button.addEventListener("click", () => {
      const nextAddons = [...state.forge.midAirAddons];
      nextAddons.splice(index, 1);
      state.forge = normalizeForgeState({
        ...state.forge,
        midAirAddons: nextAddons
      });
      state.forge = reconcileAmmoCaseForForge(state.forge);
      renderForge();
    });
    item.append(copy, button);
    ui.midAirAddonList.append(item);
  });
}

function renderAmmoPreview(weapon) {
  if (!ui.ammoPreview) {
    return;
  }
  const recipe = weapon?.ammoPrototype || currentAmmoRecipe();
  const frame = frameCatalog[state.forge.frame] || frameCatalog.longbow;
  const specialGun = isSpecialGunFrame(frame);
  const ctx = ui.ammoPreview.getContext("2d");
  ctx.clearRect(0, 0, ui.ammoPreview.width, ui.ammoPreview.height);

  const bodyY = ui.ammoPreview.height * 0.5;
  const left = 46;
  const bodyWidth = frame.ammoType === "rail" ? 214 : frame.ammoType === "bolt" ? 196 : 208;
  const chamberWidth = bodyWidth / Math.max(1, recipe.impactChambers);
  const bodyHeight = frame.ammoType === "rail" ? 22 : frame.ammoType === "bolt" ? 18 : 26;

  ctx.fillStyle = "rgba(255,255,255,0.04)";
  ctx.fillRect(0, 0, ui.ammoPreview.width, ui.ammoPreview.height);

  if (specialGun) {
    const previewMode = specialAmmoRigConfig(frame)?.previewMode || (frame.ammoType === "rail" ? "rail" : "bow");
    const mount = recipe.impactMount || defaultImpactMountForFrame(frame);
    const headId = recipe.tipType || defaultTipTypeForFrame(frame);
    const driveGlow =
      recipe.launchType === "mist"
        ? "rgba(196,234,255,0.42)"
        : recipe.launchType === "coil" || recipe.launchType === "surge"
          ? "rgba(151,244,255,0.4)"
          : recipe.launchType === "winch"
            ? "rgba(255,198,135,0.36)"
            : "rgba(255,255,255,0.18)";
    const fieldColorForAddon = (addonId) => {
      const palette = {
        fletch: "#f2ddad",
        seeker: "#8eeaff",
        "phase-trim": "#d2bbff",
        arcwake: "#9bf4ff",
        afterimage: "#ffd2ff",
        glide: "#dce8ff",
        splitter: "#ffd7a6",
        echo: "#ffffff"
      };
      return palette[addonId] || "#b6fff3";
    };

    ctx.fillStyle = driveGlow;
    ctx.beginPath();
    ctx.arc(left - 10, bodyY, 28, 0, Math.PI * 2);
    ctx.fill();

    if (previewMode === "bow") {
      ctx.strokeStyle = "#efd9ab";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(left - 6, bodyY);
      ctx.lineTo(left + bodyWidth + 10, bodyY);
      ctx.stroke();
      ["#8de6db", "#f0d48b", "#97a7ff"].forEach((color, index) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(left - 18, bodyY);
        ctx.lineTo(left - 38, bodyY - 13 + index * 13);
        ctx.lineTo(left - 8, bodyY - 5 + index * 5);
        ctx.closePath();
        ctx.fill();
      });
    } else if (previewMode === "crossbow") {
      ctx.fillStyle = "#f0ddba";
      ctx.fillRect(left - 8, bodyY - 5, bodyWidth + 18, 10);
      ctx.fillStyle = "rgba(240, 221, 186, 0.75)";
      ctx.fillRect(left + 30, bodyY - 11, bodyWidth * 0.22, 22);
      ctx.fillRect(left + bodyWidth * 0.58, bodyY - 11, bodyWidth * 0.16, 22);
      ctx.strokeStyle = "#d7f4ff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(left - 14, bodyY - 18);
      ctx.lineTo(left + 8, bodyY);
      ctx.lineTo(left - 14, bodyY + 18);
      ctx.moveTo(left + bodyWidth * 0.24, bodyY - 14);
      ctx.lineTo(left + bodyWidth * 0.24, bodyY + 14);
      ctx.stroke();
    } else if (previewMode === "harpoon") {
      ctx.strokeStyle = "#efddb7";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(left + 6, bodyY);
      ctx.lineTo(left + bodyWidth + 10, bodyY);
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.24)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(left - 22, bodyY);
      ctx.quadraticCurveTo(left - 6, bodyY - 16, left + 12, bodyY);
      ctx.stroke();
      ctx.fillStyle = "rgba(255,204,150,0.3)";
      ctx.beginPath();
      ctx.arc(left - 24, bodyY, 10, 0, Math.PI * 2);
      ctx.fill();
    } else if (previewMode === "prism") {
      ctx.strokeStyle = "#d9f8ff";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(left - 2, bodyY);
      ctx.lineTo(left + bodyWidth + 14, bodyY);
      ctx.stroke();
      ctx.strokeStyle = "rgba(239,194,255,0.55)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(left + 10, bodyY - 12);
      ctx.lineTo(left + bodyWidth + 2, bodyY - 12);
      ctx.moveTo(left + 10, bodyY + 12);
      ctx.lineTo(left + bodyWidth + 2, bodyY + 12);
      ctx.stroke();
      ctx.fillStyle = "rgba(239,194,255,0.35)";
      ctx.beginPath();
      ctx.moveTo(left + bodyWidth * 0.38, bodyY - 16);
      ctx.lineTo(left + bodyWidth * 0.58, bodyY);
      ctx.lineTo(left + bodyWidth * 0.38, bodyY + 16);
      ctx.lineTo(left + bodyWidth * 0.24, bodyY);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.strokeStyle = "#cff4ff";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(left - 6, bodyY);
      ctx.lineTo(left + bodyWidth + 14, bodyY);
      ctx.stroke();
      ctx.strokeStyle = "rgba(214,249,255,0.45)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(left - 6, bodyY - 10);
      ctx.lineTo(left + bodyWidth + 14, bodyY - 10);
      ctx.moveTo(left - 6, bodyY + 10);
      ctx.lineTo(left + bodyWidth + 14, bodyY + 10);
      ctx.stroke();
      if (previewMode === "rail") {
        ctx.strokeStyle = "rgba(151,244,255,0.32)";
        ctx.lineWidth = 1.5;
        [0.22, 0.46, 0.7].forEach((offset) => {
          ctx.beginPath();
          ctx.arc(left + bodyWidth * offset, bodyY, 13, 0, Math.PI * 2);
          ctx.stroke();
        });
      }
    }

    recipe.chamberImpacts.forEach((impactId, index) => {
      const slotLeft = left + index * chamberWidth + chamberWidth * 0.12;
      const slotWidth = chamberWidth * 0.76;
      const slotHeight = frame.ammoType === "rail" ? 24 : 18;
      ctx.fillStyle = impactAccentColor(impactId);
      ctx.beginPath();
      if (mount === "halo") {
        ctx.ellipse(slotLeft + slotWidth * 0.5, bodyY, slotWidth * 0.48, slotHeight * 0.74, 0, 0, Math.PI * 2);
      } else if (mount === "lattice") {
        ctx.moveTo(slotLeft + slotWidth * 0.5, bodyY - slotHeight * 0.7);
        ctx.lineTo(slotLeft + slotWidth, bodyY);
        ctx.lineTo(slotLeft + slotWidth * 0.5, bodyY + slotHeight * 0.7);
        ctx.lineTo(slotLeft, bodyY);
        ctx.closePath();
      } else {
        ctx.roundRect(slotLeft, bodyY - slotHeight * 0.5, slotWidth, slotHeight, 7);
      }
      ctx.fill();
      ctx.strokeStyle = "rgba(16,18,26,0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    ctx.strokeStyle = mount === "halo" ? "rgba(233,208,255,0.65)" : mount === "lattice" ? "rgba(255,214,164,0.72)" : "rgba(233,244,255,0.65)";
    ctx.lineWidth = 2;
    if (mount === "halo") {
      ctx.beginPath();
      ctx.ellipse(left + bodyWidth * 0.5, bodyY, bodyWidth * 0.54, bodyHeight * 1.3, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (mount === "lattice") {
      ctx.beginPath();
      ctx.moveTo(left + 12, bodyY - bodyHeight * 1.1);
      ctx.lineTo(left + bodyWidth - 8, bodyY + bodyHeight * 1.1);
      ctx.moveTo(left + 12, bodyY + bodyHeight * 1.1);
      ctx.lineTo(left + bodyWidth - 8, bodyY - bodyHeight * 1.1);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(left, bodyY);
      ctx.lineTo(left + bodyWidth, bodyY);
      ctx.stroke();
    }

    ctx.fillStyle = "#f5f8ff";
    ctx.beginPath();
    if (previewMode === "harpoon" || headId === "anchor") {
      ctx.moveTo(left + bodyWidth + 16, bodyY - 14);
      ctx.lineTo(left + bodyWidth + 26, bodyY);
      ctx.lineTo(left + bodyWidth + 16, bodyY + 14);
      ctx.lineTo(left + bodyWidth - 2, bodyY + 6);
      ctx.lineTo(left + bodyWidth + 6, bodyY);
      ctx.lineTo(left + bodyWidth - 2, bodyY - 6);
      ctx.closePath();
    } else if (previewMode === "prism" || headId === "prism") {
      ctx.moveTo(left + bodyWidth + 18, bodyY);
      ctx.lineTo(left + bodyWidth + 4, bodyY - 12);
      ctx.lineTo(left + bodyWidth - 4, bodyY);
      ctx.lineTo(left + bodyWidth + 4, bodyY + 12);
      ctx.closePath();
    } else if (["needle", "injector"].includes(headId)) {
      ctx.moveTo(left + bodyWidth + 20, bodyY);
      ctx.lineTo(left + bodyWidth, bodyY - 6);
      ctx.lineTo(left + bodyWidth - 2, bodyY + 6);
      ctx.closePath();
    } else if (headId === "crescent") {
      ctx.moveTo(left + bodyWidth + 20, bodyY);
      ctx.quadraticCurveTo(left + bodyWidth + 2, bodyY - 16, left + bodyWidth - 4, bodyY - 2);
      ctx.quadraticCurveTo(left + bodyWidth + 4, bodyY + 2, left + bodyWidth + 20, bodyY);
    } else {
      ctx.moveTo(left + bodyWidth + 22, bodyY);
      ctx.lineTo(left + bodyWidth, bodyY - 12);
      ctx.lineTo(left + bodyWidth - 2, bodyY);
      ctx.lineTo(left + bodyWidth, bodyY + 12);
      ctx.closePath();
    }
    ctx.fill();

    ctx.globalAlpha = 0.44;
    recipe.midAirAddons.forEach((addonId, index) => {
      const x = left + 22 + (index % 6) * 34;
      const y = bodyY + 34 + Math.floor(index / 6) * 18;
      ctx.fillStyle = fieldColorForAddon(addonId);
      ctx.beginPath();
      ctx.moveTo(x, y - 7);
      ctx.lineTo(x + 7, y);
      ctx.lineTo(x, y + 7);
      ctx.lineTo(x - 7, y);
      ctx.closePath();
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  } else if (frame.ammoType === "bolt") {
    ctx.fillStyle = "#f0d8a8";
    ctx.fillRect(left, bodyY - 4, bodyWidth + 28, 8);
    ctx.fillStyle = recipe.tipType === "spiked" ? impactAccentColor(recipe.chamberImpacts[0]) : "#f3f6fb";
    ctx.beginPath();
    ctx.moveTo(left + bodyWidth + 28, bodyY);
    ctx.lineTo(left + bodyWidth + 4, bodyY - 14);
    ctx.lineTo(left + bodyWidth - 2, bodyY);
    ctx.lineTo(left + bodyWidth + 4, bodyY + 14);
    ctx.closePath();
    ctx.fill();
    ["#89e6dc", "#f0d48b", "#90a2ff"].forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(left - 16, bodyY);
      ctx.lineTo(left - 36, bodyY - 12 + index * 12);
      ctx.lineTo(left - 10, bodyY - 4 + index * 4);
      ctx.closePath();
      ctx.fill();
    });
  } else {
    ctx.fillStyle = frame.ammoType === "rail" ? "#d4f7ff" : "#e1c48d";
    ctx.beginPath();
    ctx.roundRect(left - 30, bodyY - bodyHeight * 0.5, 32, bodyHeight, 8);
    ctx.fill();

    ctx.fillStyle = "#f6ead2";
    ctx.beginPath();
    if (recipe.tipType === "blunt") {
      ctx.roundRect(left + bodyWidth, bodyY - bodyHeight * 0.5, 20, bodyHeight, 6);
    } else if (recipe.tipType === "forked") {
      ctx.moveTo(left + bodyWidth + 18, bodyY);
      ctx.lineTo(left + bodyWidth + 2, bodyY - bodyHeight * 0.5);
      ctx.lineTo(left + bodyWidth - 4, bodyY - 4);
      ctx.lineTo(left + bodyWidth + 6, bodyY);
      ctx.lineTo(left + bodyWidth - 4, bodyY + 4);
      ctx.lineTo(left + bodyWidth + 2, bodyY + bodyHeight * 0.5);
      ctx.closePath();
    } else if (recipe.tipType === "serrated") {
      ctx.moveTo(left + bodyWidth + 18, bodyY);
      ctx.lineTo(left + bodyWidth + 4, bodyY - bodyHeight * 0.5);
      ctx.lineTo(left + bodyWidth + 1, bodyY - 4);
      ctx.lineTo(left + bodyWidth - 4, bodyY);
      ctx.lineTo(left + bodyWidth + 1, bodyY + 4);
      ctx.lineTo(left + bodyWidth + 4, bodyY + bodyHeight * 0.5);
      ctx.closePath();
    } else {
      ctx.moveTo(left + bodyWidth + 22, bodyY);
      ctx.lineTo(left + bodyWidth, bodyY - bodyHeight * 0.52);
      ctx.lineTo(left + bodyWidth - 2, bodyY + bodyHeight * 0.52);
      ctx.closePath();
    }
    ctx.fill();

    if (frame.ammoType === "rail") {
      ctx.strokeStyle = "#d4f7ff";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(left - 6, bodyY);
      ctx.lineTo(left + bodyWidth + 10, bodyY);
      ctx.stroke();
    }
  }

  recipe.chamberImpacts.forEach((impactId, index) => {
    ctx.fillStyle = impactAccentColor(impactId);
    const slotLeft = left + index * chamberWidth;
    ctx.beginPath();
    if (frame.ammoType === "rail") {
      ctx.roundRect(slotLeft, bodyY - bodyHeight * 0.46, chamberWidth - 4, bodyHeight * 0.92, 6);
    } else {
      ctx.roundRect(slotLeft, bodyY - bodyHeight * 0.5, chamberWidth - 4, bodyHeight, 8);
    }
    ctx.fill();
  });

  ctx.globalAlpha = 0.34;
  recipe.midAirAddons.forEach((addonId, index) => {
    ctx.fillStyle =
      addonId === "magnetized"
        ? "#9fe8ff"
        : addonId === "redirect"
          ? "#ffffff"
          : addonId === "spiral"
            ? "#f0d48b"
            : addonId === "tracer"
              ? "#ffbf7d"
              : "#9ef58c";
    ctx.beginPath();
    ctx.arc(left + 36 + (index % 6) * 34, bodyY + 36 + Math.floor(index / 6) * 18, 7, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  if (!specialGun) {
    const launchGlow =
      recipe.launchType === "blizzard"
        ? "rgba(202,236,255,0.4)"
        : recipe.launchType === "ember"
          ? "rgba(255,183,106,0.4)"
          : recipe.launchType === "storm" || recipe.launchType === "quake"
            ? "rgba(200,232,255,0.4)"
            : "rgba(255,255,255,0.16)";
    ctx.fillStyle = launchGlow;
    ctx.beginPath();
    ctx.arc(left - 18, bodyY, 24, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.font = "600 12px 'Trebuchet MS', sans-serif";
  ctx.fillText(recipe.name, 18, 24);
  ctx.fillText(`${recipe.impactLabel} | ${recipe.tipLabel} | ${recipe.launchLabel}`, 18, ui.ammoPreview.height - 16);
}

function renderAmmoRack() {
  if (!ui.ammoRack) {
    return;
  }
  ui.ammoRack.innerHTML = "";
  const frame = frameCatalog[state.forge.frame] || frameCatalog.longbow;
  const labels = ammoWorkshopLabelsForFrame(frame);
  if (!state.ammoRack.length) {
    const empty = document.createElement("p");
    empty.className = "arena-hint";
    empty.textContent = isSpecialGunFrame(frame)
      ? `No crafted ${labels.recipe.toLowerCase()}s yet. Build one from the ${labels.familyTag.toLowerCase()} and press Craft Ammo.`
      : "No crafted rounds yet. Build one from the chamber editor and press Craft Ammo.";
    ui.ammoRack.append(empty);
    return;
  }
  const currentSignature = currentAmmoRecipe().signature;
  state.ammoRack.forEach((recipe) => {
    const compatible = ammoRecipeCompatibleWithFrame(recipe, frame);
    const item = document.createElement("article");
    item.className = "ammo-rack-item";
    if (recipe.signature === currentSignature) {
      item.classList.add("active");
    }
    item.innerHTML = `
      <header>
        <strong>${recipe.name}</strong>
        <span class="pill">${recipe.qualityLabel}</span>
      </header>
      <p>${recipe.summary}</p>
    `;
    const actions = document.createElement("div");
    actions.className = "ammo-case-actions";

    const loadButton = document.createElement("button");
    loadButton.className = "ghost-button";
    loadButton.type = "button";
    loadButton.textContent = "Load";
    loadButton.disabled = !compatible;
    loadButton.addEventListener("click", () => {
      const frame = frameCatalog[state.forge.frame] || frameCatalog.longbow;
      state.forge = normalizeForgeState({
        ...state.forge,
        impactChambers: recipe.impactChambers,
        impactMount: recipe.impactMount,
        chamberImpacts: [...recipe.chamberImpacts],
        impactType: recipe.impactTypes[0] || defaultImpactTypeForFrame(frame),
        launchType: recipe.launchType,
        midAirAddons: [...recipe.midAirAddons],
        midAirType: recipe.midAirAddons[0] || "none",
        tipType: recipe.tipType
      });
      state.forge = reconcileAmmoCaseForForge(state.forge);
      resetForgeMinigame(state.forge.frame, false);
      renderForge();
      setMatchSummary(`${recipe.name} loaded back into the ${labels.familyTag.toLowerCase()}.`);
    });

    const caseButton = document.createElement("button");
    caseButton.className = "ghost-button";
    caseButton.type = "button";
    caseButton.textContent = "To Case";
    caseButton.disabled = !compatible;
    caseButton.addEventListener("click", () => {
      const maxSlots = Math.max(1, Number(state.forge.preloadAmmo || 1));
      const nextCase = [...(state.forge.ammoCase || [])];
      if (nextCase.length >= maxSlots) {
        nextCase.shift();
      }
      nextCase.push(recipe.id);
      state.forge = normalizeForgeState({
        ...state.forge,
        ammoCase: nextCase
      });
      state.forge = reconcileAmmoCaseForForge(state.forge);
      renderForge();
      setMatchSummary(`${recipe.name} added to the ${isSpecialGunFrame(frame) ? "rack order" : "ammo case"}.`);
    });

    actions.append(loadButton, caseButton);
    item.append(actions);
    ui.ammoRack.append(item);
  });
}

function renderAmmoCase(weapon) {
  if (!ui.ammoCaseList) {
    return;
  }
  ui.ammoCaseList.innerHTML = "";
  const frame = frameCatalog[state.forge.frame] || frameCatalog.longbow;
  const labels = ammoWorkshopLabelsForFrame(frame);
  const rounds = (state.forge.ammoCase || [])
    .map((id) => state.ammoRack.find((recipe) => recipe.id === id))
    .filter((recipe) => ammoRecipeCompatibleWithFrame(recipe, frame));
  if (!rounds.length) {
    const empty = document.createElement("p");
    empty.className = "arena-hint";
    empty.textContent = isSpecialGunFrame(frame)
      ? `The rack is empty. Crafted ${labels.recipe.toLowerCase()}s added here define the exact firing order.`
      : "The case is empty. Crafted rounds added here define the exact firing order.";
    ui.ammoCaseList.append(empty);
    return;
  }

  rounds.forEach((recipe, index) => {
    const slot = document.createElement("article");
    slot.className = "ammo-case-slot";
    slot.innerHTML = `
      <div class="ammo-case-slot-index">${index + 1}</div>
      <div class="ammo-case-copy">
        <strong>${recipe.name}</strong>
        <p>${recipe.summary}</p>
      </div>
    `;
    const actions = document.createElement("div");
    actions.className = "ammo-case-actions";

    const upButton = document.createElement("button");
    upButton.className = "ghost-button";
    upButton.type = "button";
    upButton.textContent = "Up";
    upButton.disabled = index === 0;
    upButton.addEventListener("click", () => {
      const ammoCase = [...state.forge.ammoCase];
      [ammoCase[index - 1], ammoCase[index]] = [ammoCase[index], ammoCase[index - 1]];
      state.forge = normalizeForgeState({ ...state.forge, ammoCase });
      state.forge = reconcileAmmoCaseForForge(state.forge);
      renderForge();
    });

    const downButton = document.createElement("button");
    downButton.className = "ghost-button";
    downButton.type = "button";
    downButton.textContent = "Down";
    downButton.disabled = index === rounds.length - 1;
    downButton.addEventListener("click", () => {
      const ammoCase = [...state.forge.ammoCase];
      [ammoCase[index + 1], ammoCase[index]] = [ammoCase[index], ammoCase[index + 1]];
      state.forge = normalizeForgeState({ ...state.forge, ammoCase });
      state.forge = reconcileAmmoCaseForForge(state.forge);
      renderForge();
    });

    const removeButton = document.createElement("button");
    removeButton.className = "ghost-button";
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      const ammoCase = [...state.forge.ammoCase];
      ammoCase.splice(index, 1);
      state.forge = normalizeForgeState({ ...state.forge, ammoCase });
      state.forge = reconcileAmmoCaseForForge(state.forge);
      renderForge();
    });

    actions.append(upButton, downButton, removeButton);
    slot.append(actions);
    ui.ammoCaseList.append(slot);
  });
}

function renderAmmoWorkshop(weapon) {
  const frame = frameCatalog[state.forge.frame] || frameCatalog.longbow;
  if (!isRangedWeapon(frame)) {
    return;
  }
  const labels = ammoWorkshopLabelsForFrame(frame);
  const recipe = weapon?.ammoPrototype || currentAmmoRecipe();
  const rackRounds = (state.forge.ammoCase || [])
    .map((id) => state.ammoRack.find((entry) => entry.id === id))
    .filter((entry) => ammoRecipeCompatibleWithFrame(entry, frame));
  const caseCapacity = ammoCaseCapacityForFrame(frame, rackRounds.length ? rackRounds : [recipe], state.forge.preloadAmmo || frame.clipSize);
  const loadedRounds = rackRounds.slice(0, caseCapacity);

  ui.ammoWorkshopFamily.textContent = labels.familyTag;
  ui.ammoWorkshopNote.textContent =
    `${labels.note} ${labels.descriptor} ${frame.label} can hold up to ${caseCapacity} ${labels.recipe.toLowerCase()}${caseCapacity === 1 ? "" : "s"} with this build size.`;
  ui.impactChambersLabel.querySelector("span").textContent = labels.chambers;
  ui.impactMountLabel.querySelector("span").textContent = labels.mount;
  ui.impactTypeLabel.querySelector("span").textContent = labels.impacts;
  ui.launchTypeLabel.querySelector("span").textContent = labels.launch;
  ui.midAirTypeLabel.querySelector("span").textContent = labels.midAir;
  ui.tipTypeLabel.querySelector("span").textContent = labels.tip;
  ui.preloadAmmoLabel.querySelector("span").textContent = labels.preload;
  ui.preloadAmmo.value = `${Math.min(Number(state.forge.preloadAmmo || 1), caseCapacity)}`;

  renderImpactChamberList(frame);
  renderMidAirAddonList();
  renderAmmoPreview(weapon);
  renderAmmoRack();
  renderAmmoCase(weapon);

  ui.ammoSummary.innerHTML = `
    <div class="ammo-summary-grid">
      <div class="ammo-summary-chip">
        <span>${labels.recipe}</span>
        <strong>${recipe.name}</strong>
      </div>
      <div class="ammo-summary-chip">
        <span>Case</span>
        <strong>${loadedRounds.length}/${caseCapacity}</strong>
      </div>
      <div class="ammo-summary-chip">
        <span>${labels.impactsChip}</span>
        <strong>${recipe.impactLabel}</strong>
      </div>
      <div class="ammo-summary-chip">
        <span>${labels.midAirChip}</span>
        <strong>${recipe.midAirAddons.length || 0} add-on${recipe.midAirAddons.length === 1 ? "" : "s"}</strong>
      </div>
    </div>
    <p>${recipe.summary}</p>
  `;
}

function renderForgeBadges(weapon) {
  ui.forgeBadges.innerHTML = isRangedWeapon(weapon)
    ? `
      <span class="menu-status alt">${weapon.classLabel}</span>
      <span class="menu-status alt">${weapon.fireModeLabel || "Single Shot"}</span>
      <span class="menu-status alt">${weapon.ammoLabel}</span>
      <span class="menu-status alt">${weapon.impactLabel}</span>
      <span class="menu-status alt">${weapon.tipLabel}</span>
      <span class="menu-status alt">${weapon.launchLabel}</span>
      <span class="menu-status alt">${weapon.midAirAddons?.length || 0} add-ons</span>
      <span class="menu-status alt">${weapon.forgeQualityLabel}</span>
    `
    : `
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
  if (weapon.kind === "sidearm") {
    return "Sidearm";
  }
  if (weapon.kind === "assault") {
    return "Assault";
  }
  if (weapon.kind === "heavy") {
    return "Heavy";
  }
  if (weapon.kind === "gun-special") {
    return "Special Gun";
  }
  if (weapon.kind === "long") {
    return "Long";
  }
  if (weapon.kind === "special") {
    return "Special";
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
  } else if (weapon.frameId === "brass") {
    headMarkup = `
      <rect x="${shaft - 6}" y="24" width="${bladeSize * 0.9}" height="24" rx="8" fill="${color}" />
      <circle cx="${shaft + 2}" cy="36" r="3.2" fill="#18151a" />
      <circle cx="${shaft + 10}" cy="36" r="3.2" fill="#18151a" />
      <circle cx="${shaft + 18}" cy="36" r="3.2" fill="#18151a" />
    `;
  } else if (weapon.frameId === "thundermaul") {
    headMarkup = `
      <rect x="${shaft - 6}" y="${36 - bladeSize * 0.5}" width="${bladeSize * 0.82}" height="${bladeSize}" rx="6" fill="${color}" />
      <rect x="${shaft + bladeSize * 0.18}" y="${36 - bladeSize * 0.62}" width="${bladeSize * 0.14}" height="${bladeSize * 1.24}" rx="3" fill="#f6edd8" />
    `;
  } else if (weapon.frameId === "reaper") {
    headMarkup = `
      <path d="M ${shaft - 4} ${36 - bladeSize * 0.58} Q ${shaft + bladeSize * 0.84} ${36 - bladeSize * 0.46} ${shaft + bladeSize * 0.48} 36 Q ${shaft + bladeSize * 0.74} ${36 + bladeSize * 0.28} ${shaft - 2} ${36 + bladeSize * 0.14} Z" fill="${color}" />
    `;
  } else if (weapon.frameId === "stormbow") {
    headMarkup = `
      <path d="M ${shaft - 8} ${36 - 20} Q ${shaft - 26} 36 ${shaft - 8} ${36 + 20}" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round" />
      <path d="M ${shaft + 8} ${36 - 20} Q ${shaft + 26} 36 ${shaft + 8} ${36 + 20}" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round" />
      <line x1="${shaft - 8}" y1="${36 - 20}" x2="${shaft + 8}" y2="${36 + 20}" stroke="#f3ead8" stroke-width="2" />
      <line x1="${shaft - 8}" y1="${36 + 20}" x2="${shaft + 8}" y2="${36 - 20}" stroke="#f3ead8" stroke-width="2" />
      <rect x="${shaft + 8}" y="34" width="${Math.max(24, bladeSize * 1.1)}" height="4" rx="2" fill="${color}" />
    `;
  } else if (weapon.frameId === "ballista") {
    headMarkup = `
      <rect x="${shaft - 12}" y="26" width="${Math.max(48, bladeSize * 1.8)}" height="20" rx="8" fill="${color}" />
      <path d="M ${shaft - 8} 20 L ${shaft + 18} 36 L ${shaft - 8} 52" fill="none" stroke="#f3ead8" stroke-width="4" stroke-linecap="round" />
      <rect x="${shaft + bladeSize * 1.2}" y="34" width="${Math.max(18, bladeSize * 0.7)}" height="4" rx="2" fill="#f3ead8" />
      <rect x="${shaft + bladeSize * 1.7}" y="32" width="${Math.max(16, bladeSize * 0.6)}" height="8" rx="4" fill="${color}" />
    `;
  } else if (weapon.frameId === "prismrail") {
    headMarkup = `
      <rect x="${shaft - 10}" y="26" width="${Math.max(46, bladeSize * 1.7)}" height="20" rx="8" fill="${color}" />
      <rect x="${shaft + bladeSize * 1.1}" y="24" width="${Math.max(20, bladeSize * 0.8)}" height="4" rx="2" fill="#d9fbff" />
      <rect x="${shaft + bladeSize * 1.1}" y="44" width="${Math.max(20, bladeSize * 0.8)}" height="4" rx="2" fill="#d9fbff" />
      <circle cx="${shaft + bladeSize * 1.88}" cy="36" r="5" fill="#efc2ff" />
    `;
  } else if (isRangedWeapon(weapon)) {
    headMarkup = `
      <rect x="${shaft - 18}" y="28" width="${Math.max(32, bladeSize * 1.3)}" height="16" rx="6" fill="${handle}" />
      <rect x="${shaft - 4}" y="24" width="${Math.max(38, bladeSize * 1.7)}" height="10" rx="4" fill="${color}" />
      <rect x="${shaft + bladeSize * 0.9}" y="28" width="${Math.max(12, bladeSize * 0.5)}" height="4" rx="2" fill="${color}" />
      <rect x="${shaft + bladeSize * 0.28}" y="38" width="10" height="14" rx="4" fill="${handle}" />
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
  if (isRangedWeapon(weapon)) {
    const frame = frameCatalog[weapon.frameId] || frameCatalog.longbow;
    const labels = ammoWorkshopLabelsForFrame(frame);
    const impactCatalog = impactTypeCatalogForFrame(frame);
    const launchSet = launchCatalogForFrame(frame);
    const tipSet = tipCatalogForFrame(frame);
    ui.forgeDetails.innerHTML = `
      <article class="forge-detail-card">
        <span>Weapon Type</span>
        <strong>${weapon.frame} | ${weapon.classLabel}</strong>
        <p>${weapon.frameSummary}</p>
      </article>
      <article class="forge-detail-card">
        <span>Fire Mode</span>
        <strong>${weapon.fireModeLabel || "Single Shot"}</strong>
        <p>${weapon.abilitySummary}</p>
      </article>
      ${isSpecialGunFrame(frame) ? `
      <article class="forge-detail-card">
        <span>Rig Identity</span>
        <strong>${labels.familyTag}</strong>
        <p>${labels.descriptor}</p>
      </article>
      ` : ""}
      <article class="forge-detail-card">
        <span>${labels.detailMount}</span>
        <strong>${weapon.impactChambers} | ${weapon.impactMountLabel}</strong>
        <p>${weapon.edgeSummary}</p>
      </article>
      <article class="forge-detail-card">
        <span>${labels.detailStack}</span>
        <strong>${weapon.chamberImpacts.map((impactId, index) => `${isSpecialGunFrame(frame) ? labels.slotUnit.charAt(0).toUpperCase() : "C"}${index + 1}:${impactCatalog[impactId]?.label || impactId}`).join(" | ")}</strong>
        <p>${isSpecialGunFrame(frame) ? `Each ${labels.slotUnit.toLowerCase()} can carry its own sigil or payload. Mixed ${labels.recipe.toLowerCase()}s fire exactly in the order shown in the ammo workshop.` : "Each chamber can carry its own impact. Mixed rounds fire exactly in the order shown in the ammo workshop."}</p>
      </article>
      <article class="forge-detail-card">
        <span>${labels.detailLaunch}</span>
        <strong>${weapon.launchLabel}</strong>
        <p>${launchSet[weapon.launchType]?.summary || ""}</p>
      </article>
      <article class="forge-detail-card">
        <span>${labels.detailMidAir}</span>
        <strong>${weapon.midAirLabel}</strong>
        <p>${isSpecialGunFrame(frame) ? `${labels.midAir} stack without a set limit. Each extra layer can bend, ghost, split, redirect, glide, or chase harder depending on the rig.` : "Mid-air add-ons stack without a set limit. Each extra module can make the round track, redirect, stabilize, or weave harder."}</p>
      </article>
      <article class="forge-detail-card">
        <span>${labels.detailTip}</span>
        <strong>${weapon.tipLabel}</strong>
        <p>${tipSet[weapon.tipType]?.summary || ""}</p>
      </article>
      <article class="forge-detail-card">
        <span>Ammo Case</span>
        <strong>${weapon.ammoLabel}</strong>
        <p>${weapon.ammoCaseSummary || "Prototype rounds fill the case when you have not loaded crafted ammo yet."}</p>
      </article>
      <article class="forge-detail-card">
        <span>Forge Finish</span>
        <strong>${weapon.forgeQualityLabel}</strong>
        <p>${weapon.forgeSummary}</p>
      </article>
    `;
    return;
  }

  const styleTitle = weapon.usesStyle ? "Style" : "Class Trait";
  const styleName = weapon.usesStyle ? weapon.edge : `${weapon.frame} Trait`;
  const styleCopy = weapon.usesStyle
    ? `${weapon.edgeSummary} ${weapon.abilitySummary}`
    : `${weapon.edgeSummary} ${weapon.abilitySummary}`.trim();
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
  if (isRangedWeapon(weapon)) {
    const stats = [
      {
        label: "Shot Damage",
        value: weapon.damage,
        display: `${weapon.damage}`,
        max: 44,
        detail: "Higher shot damage makes each round hit much harder."
      },
      {
        label: "Load",
        value: weapon.preloadAmmo,
        display: `${weapon.preloadAmmo}/${weapon.clipSize}`,
        max: Math.max(weapon.clipSize, 12),
        detail: "Preload ammo is how many rounds start in the gun before you need a reload."
      },
      {
        label: "Range",
        value: weapon.projectileRange,
        display: `${weapon.projectileRange}`,
        max: 620,
        detail: "Range controls how far the round can travel before it dies."
      },
      {
        label: "Velocity",
        value: weapon.projectileSpeed,
        display: `${weapon.projectileSpeed}`,
        max: 1240,
        detail: "Higher velocity makes the round get to the rival faster."
      },
      {
        label: "Reload",
        value: Math.round((2 - weapon.reloadTime) * 100),
        display: `${weapon.reloadTime.toFixed(2)}s`,
        max: 150,
        detail: "Lower reload time means the gun gets back to loaded fire more quickly."
      },
      {
        label: "Break",
        value: weapon.blockBreak,
        display: `${weapon.blockBreak}`,
        max: 14,
        detail: "Block break shows how much the tip and payload chew through guard."
      },
      {
        label: "Weight",
        value: weapon.weight,
        display: weapon.weight.toFixed(1),
        max: 30,
        detail: "Heavier guns hit harder but slow movement and recovery."
      },
      {
        label: "Move",
        value: Math.round(weapon.moveScale * 100),
        display: `${Math.round(weapon.moveScale * 100)}`,
        max: 114,
        detail: "Move keeps track of how much the gun slows or frees your movement."
      }
    ];
    ui.forgeStats.innerHTML = stats
      .map((stat) => `
        <article class="forge-stat-card">
          <div class="forge-stat-top">
            <span>${stat.label}</span>
            <strong>${stat.display}</strong>
          </div>
          <div class="forge-stat-bar">
            <div class="forge-stat-fill" style="width:${clamp((stat.value / stat.max) * 100, 8, 100)}%"></div>
          </div>
          <p>${stat.detail}</p>
        </article>
      `)
      .join("");
    return;
  }

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
          ? "Medium stays balanced, keeps built-in weapon traits, and turns dash into a pass-through slash."
          : weapon.kind === "short"
            ? "Short gains back-hit damage, stealthier crouches, and close-range rush specials."
            : "Special weapons ignore styles and instead bring a unique signature move."
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

  if (isRangedWeapon(weapon)) {
    const bodyLength =
      weapon.kind === "sidearm"
        ? 78
        : weapon.kind === "assault"
          ? 116
          : weapon.kind === "heavy"
            ? 134
            : ["longbow", "stormbow"].includes(weapon.frameId)
              ? 110
              : ["crossbow", "ballista"].includes(weapon.frameId)
                ? 118
                : 128;
    const barrelLength = weapon.kind === "heavy" ? 64 : weapon.kind === "sidearm" ? 34 : 48;
    const bodyHeight = weapon.kind === "heavy" ? 22 : weapon.kind === "sidearm" ? 16 : 18;
    const stockDrop = weapon.kind === "sidearm" ? 22 : 18;
    const chamberGlow = 10 + weapon.impactChambers * 7;

    previewCtx.strokeStyle = "#e9dfd2";
    previewCtx.lineWidth = 8;
    previewCtx.beginPath();
    previewCtx.moveTo(-14, 0);
    previewCtx.lineTo(bodyLength + barrelLength + 12, 0);
    previewCtx.stroke();

    previewCtx.fillStyle = "rgba(0,0,0,0.18)";
    previewCtx.beginPath();
    previewCtx.roundRect(-16, -6, bodyLength + barrelLength + 18, bodyHeight + 12, 14);
    previewCtx.fill();

    previewCtx.fillStyle = weapon.color;
    previewCtx.beginPath();
    if (["longbow", "stormbow"].includes(weapon.frameId)) {
      previewCtx.moveTo(10, -34);
      previewCtx.quadraticCurveTo(-18, 0, 10, 34);
      previewCtx.lineTo(18, 26);
      previewCtx.quadraticCurveTo(-6, 0, 18, -26);
      previewCtx.closePath();
      previewCtx.fill();
      previewCtx.strokeStyle = "#f3ead8";
      previewCtx.lineWidth = 3;
      previewCtx.beginPath();
      previewCtx.moveTo(10, -34);
      previewCtx.lineTo(10, 34);
      previewCtx.stroke();
      previewCtx.strokeStyle = weapon.color;
      previewCtx.lineWidth = 8;
      previewCtx.beginPath();
      previewCtx.moveTo(18, 0);
      previewCtx.lineTo(106, 0);
      previewCtx.stroke();
      if (weapon.frameId === "stormbow") {
        previewCtx.strokeStyle = "#d5f7ff";
        previewCtx.lineWidth = 3;
        previewCtx.beginPath();
        previewCtx.moveTo(20, -22);
        previewCtx.lineTo(40, 0);
        previewCtx.lineTo(20, 22);
        previewCtx.stroke();
      }
    } else if (["crossbow", "ballista"].includes(weapon.frameId)) {
      previewCtx.beginPath();
      previewCtx.roundRect(10, -8, weapon.frameId === "ballista" ? 98 : 86, 16, 8);
      previewCtx.fill();
      previewCtx.beginPath();
      previewCtx.moveTo(12, -28);
      previewCtx.lineTo(44, 0);
      previewCtx.lineTo(12, 28);
      previewCtx.lineTo(22, 22);
      previewCtx.lineTo(50, 0);
      previewCtx.lineTo(22, -22);
      previewCtx.closePath();
      previewCtx.fill();
      previewCtx.strokeStyle = "#f3ead8";
      previewCtx.lineWidth = 3;
      previewCtx.beginPath();
      previewCtx.moveTo(14, -22);
      previewCtx.lineTo(14, 22);
      previewCtx.stroke();
      previewCtx.strokeStyle = weapon.color;
      previewCtx.lineWidth = 7;
      previewCtx.beginPath();
      previewCtx.moveTo(42, 0);
      previewCtx.lineTo(weapon.frameId === "ballista" ? 132 : 124, 0);
      previewCtx.stroke();
    } else {
      previewCtx.beginPath();
      previewCtx.roundRect(8, -bodyHeight / 2, bodyLength, bodyHeight, 10);
      previewCtx.fill();
      previewCtx.fillStyle = "#f3ead8";
      previewCtx.beginPath();
      previewCtx.roundRect(18, -6, 22, 12, 6);
      previewCtx.fill();
      previewCtx.fillStyle = weapon.color;
      previewCtx.beginPath();
      previewCtx.moveTo(24, bodyHeight / 2 - 1);
      previewCtx.lineTo(12, bodyHeight / 2 + stockDrop);
      previewCtx.lineTo(30, bodyHeight / 2 + 14);
      previewCtx.lineTo(44, bodyHeight / 2 - 1);
      previewCtx.closePath();
      previewCtx.fill();
      previewCtx.beginPath();
      previewCtx.roundRect(bodyLength - 4, -5, barrelLength, 10, 5);
      previewCtx.fill();
      if (["railgun", "arcrail", "coillance", "prismrail"].includes(weapon.frameId)) {
        previewCtx.fillStyle = "#d7f7ff";
        previewCtx.beginPath();
        previewCtx.roundRect(bodyLength - 2, -3, barrelLength + 10, 6, 3);
        previewCtx.fill();
        if (weapon.frameId === "prismrail") {
          previewCtx.fillStyle = "#efc2ff";
          previewCtx.beginPath();
          previewCtx.arc(bodyLength + barrelLength + 8, 0, 6, 0, Math.PI * 2);
          previewCtx.fill();
        }
      }
    }

    previewCtx.globalAlpha = 0.26;
    previewCtx.fillStyle = weapon.color;
    previewCtx.beginPath();
    previewCtx.arc(bodyLength * 0.42, 0, chamberGlow, 0, Math.PI * 2);
    previewCtx.fill();

    previewCtx.globalAlpha = 1;
    previewCtx.fillStyle = "rgba(255, 255, 255, 0.78)";
    previewCtx.font = "600 12px 'Trebuchet MS', sans-serif";
    previewCtx.fillText(`${weapon.impactLabel} | ${weapon.tipLabel} | ${weapon.ammoLabel}`, -12, 58);
    previewCtx.restore();
    return;
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
  } else if (weapon.frameId === "halberd") {
    previewCtx.moveTo(shaft - 2, -bladeSize * 0.52);
    previewCtx.lineTo(shaft + bladeSize * 0.56, -bladeSize * 0.18);
    previewCtx.lineTo(shaft + bladeSize * 0.22, 0);
    previewCtx.lineTo(shaft + bladeSize * 0.56, bladeSize * 0.18);
    previewCtx.lineTo(shaft - 2, bladeSize * 0.52);
    previewCtx.lineTo(shaft + bladeSize * 0.34, 0);
    previewCtx.lineTo(shaft + bladeSize * 0.92, -bladeSize * 0.08);
    previewCtx.lineTo(shaft + bladeSize * 0.98, 0);
    previewCtx.lineTo(shaft + bladeSize * 0.92, bladeSize * 0.08);
  } else if (weapon.frameId === "executioner") {
    previewCtx.moveTo(shaft - 4, -bladeSize * 0.72);
    previewCtx.lineTo(shaft + bladeSize * 0.84, -bladeSize * 0.18);
    previewCtx.lineTo(shaft + bladeSize * 0.92, 0);
    previewCtx.lineTo(shaft + bladeSize * 0.84, bladeSize * 0.18);
    previewCtx.lineTo(shaft - 4, bladeSize * 0.72);
  } else if (weapon.frameId === "nodachi") {
    previewCtx.moveTo(shaft - 6, -bladeSize * 0.14);
    previewCtx.lineTo(shaft + bladeSize * 0.92, -bladeSize * 0.12);
    previewCtx.lineTo(shaft + bladeSize, 0);
    previewCtx.lineTo(shaft + bladeSize * 0.92, bladeSize * 0.12);
    previewCtx.lineTo(shaft - 6, bladeSize * 0.14);
  } else if (weapon.frameId === "karambit") {
    previewCtx.moveTo(shaft - 8, -bladeSize * 0.26);
    previewCtx.quadraticCurveTo(shaft + bladeSize * 0.54, -bladeSize * 0.36, shaft + bladeSize * 0.24, 0);
    previewCtx.quadraticCurveTo(shaft + bladeSize * 0.54, bladeSize * 0.36, shaft - 8, bladeSize * 0.26);
  } else if (weapon.frameId === "shiv") {
    previewCtx.moveTo(shaft - 8, -bladeSize * 0.18);
    previewCtx.lineTo(shaft + bladeSize * 0.52, 0);
    previewCtx.lineTo(shaft - 8, bladeSize * 0.18);
  } else if (weapon.frameId === "claws") {
    previewCtx.moveTo(shaft - 10, -bladeSize * 0.28);
    previewCtx.lineTo(shaft + bladeSize * 0.18, -bladeSize * 0.42);
    previewCtx.lineTo(shaft + bladeSize * 0.1, -bladeSize * 0.12);
    previewCtx.lineTo(shaft + bladeSize * 0.34, -bladeSize * 0.06);
    previewCtx.lineTo(shaft + bladeSize * 0.28, 0);
    previewCtx.lineTo(shaft + bladeSize * 0.34, bladeSize * 0.06);
    previewCtx.lineTo(shaft + bladeSize * 0.1, bladeSize * 0.12);
    previewCtx.lineTo(shaft + bladeSize * 0.18, bladeSize * 0.42);
    previewCtx.lineTo(shaft - 10, bladeSize * 0.28);
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
  } else if (weapon.frameId === "twinblade") {
    previewCtx.moveTo(shaft - 8, -bladeSize * 0.34);
    previewCtx.lineTo(shaft + bladeSize * 0.58, -bladeSize * 0.1);
    previewCtx.lineTo(shaft + bladeSize * 0.8, 0);
    previewCtx.lineTo(shaft + bladeSize * 0.58, bladeSize * 0.1);
    previewCtx.lineTo(shaft - 8, bladeSize * 0.34);
    previewCtx.lineTo(shaft + bladeSize * 0.18, 0);
  } else if (weapon.frameId === "brass") {
    previewCtx.roundRect(shaft - 10, -bladeSize * 0.32, bladeSize * 0.92, bladeSize * 0.64, 8);
  } else if (weapon.frameId === "thundermaul") {
    previewCtx.rect(shaft - 8, -bladeSize * 0.52, bladeSize * 0.78, bladeSize * 1.04);
  } else if (weapon.frameId === "reaper") {
    previewCtx.moveTo(shaft - 4, -bladeSize * 0.56);
    previewCtx.quadraticCurveTo(shaft + bladeSize * 0.84, -bladeSize * 0.42, shaft + bladeSize * 0.46, 0);
    previewCtx.quadraticCurveTo(shaft + bladeSize * 0.68, bladeSize * 0.24, shaft - 3, bladeSize * 0.14);
  } else if (weapon.frameId === "bostaff") {
    previewCtx.roundRect(shaft - 8, -bladeSize * 0.08, bladeSize * 1.06, bladeSize * 0.16, 8);
  } else if (weapon.frameId === "morningstar") {
    previewCtx.arc(shaft + bladeSize * 0.28, 0, bladeSize * 0.36, 0, Math.PI * 2);
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
  const meta = forgeModeMeta(frameCatalog[weapon.frameId] || weapon);
  const rangedWeapon = isRangedWeapon(weapon);
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

  if (game.mode === "long") {
    ui.forgeMinigameBar.style.setProperty("--target-start", "38%");
    ui.forgeMinigameBar.style.setProperty("--target-end", "62%");
    ui.forgeMinigameStatus.textContent = game.active
      ? rangedWeapon
        ? `Seat the heavy chamber in the gold lane 3 times. Successes: ${game.hits}/3.`
        : `Hit the gold temper band 3 times. Successes: ${game.hits}/3.`
      : game.finished
        ? rangedWeapon
          ? `Heavy ranged tuning finished at ${weapon.forgeQualityLabel}. Chamber seating was ${Math.round(weapon.forgeQuality * 100)}% clean.`
          : `Long forge finished at ${weapon.forgeQualityLabel}. Heavy timing was ${Math.round(weapon.forgeQuality * 100)}% clean.`
        : rangedWeapon
          ? "No heavy-gun run yet. Start the drill to seat the large payload cleanly."
          : "No long-blade run yet. Start the drill to temper the heavy edge.";
  } else if (game.mode === "bow-string") {
    ui.forgeMinigameBar.style.setProperty("--target-start", "46%");
    ui.forgeMinigameBar.style.setProperty("--target-end", "54%");
    ui.forgeMinigameStatus.textContent = game.active
      ? `Snap the string in the gold lane 4 times. Clean releases: ${game.hits}/4.`
      : game.finished
        ? `Bow ammo tuning finished at ${weapon.forgeQualityLabel}. String control landed ${Math.round(weapon.forgeQuality * 100)}% clean.`
        : "No bow-string run yet. Start the drill to tune the draw and release.";
  } else if (game.mode === "medium") {
    ui.forgeMinigameBar.style.setProperty("--target-start", "0%");
    ui.forgeMinigameBar.style.setProperty("--target-end", "0%");
    ui.forgeMinigameStatus.textContent = game.active
      ? rangedWeapon
        ? `Hit the three feed markers in order. Landed: ${game.hits}/${Math.max(game.pips.length, 3)}.`
        : `Strike the three rhythm markers in order. Landed: ${game.hits}/${Math.max(game.pips.length, 3)}.`
      : game.finished
        ? rangedWeapon
          ? `Ranged feed tuning finished at ${weapon.forgeQualityLabel}. Shot timing landed ${Math.round(weapon.forgeQuality * 100)}% clean.`
          : `Medium forge finished at ${weapon.forgeQualityLabel}. Slash rhythm landed ${Math.round(weapon.forgeQuality * 100)}% clean.`
        : rangedWeapon
          ? "No assault or special-gun run yet. Start the drill to smooth the feed rhythm."
          : "No medium-blade run yet. Start the drill to tune the slash rhythm.";
  } else if (game.mode === "rail-align") {
    ui.forgeMinigameBar.style.setProperty("--target-start", "0%");
    ui.forgeMinigameBar.style.setProperty("--target-end", "0%");
    ui.forgeMinigameStatus.textContent = game.active
      ? `Hit the 4 rail markers in order. Aligned rails: ${game.hits}/${Math.max(game.pips.length, 4)}.`
      : game.finished
        ? `Rail alignment finished at ${weapon.forgeQualityLabel}. Charge timing landed ${Math.round(weapon.forgeQuality * 100)}% clean.`
        : "No rail alignment run yet. Start the drill to line up the emitter rail.";
  } else if (game.mode === "short") {
    ui.forgeMinigameBar.style.setProperty("--target-start", "0%");
    ui.forgeMinigameBar.style.setProperty("--target-end", "0%");
    ui.forgeMinigameStatus.textContent = game.active
      ? rangedWeapon
        ? `Cycle every light round before time expires. Chambers hit: ${game.hits}/${Math.max(game.pips.length, 5)}.`
        : `Pop every spark before time expires. Sparks hit: ${game.hits}/${Math.max(game.pips.length, 5)}.`
      : game.finished
        ? rangedWeapon
          ? `Sidearm tuning finished at ${weapon.forgeQualityLabel}. Chamber cycling landed ${Math.round(weapon.forgeQuality * 100)}% clean.`
          : `Short forge finished at ${weapon.forgeQualityLabel}. Spark work landed ${Math.round(weapon.forgeQuality * 100)}% clean.`
        : rangedWeapon
          ? "No sidearm run yet. Start the drill to tighten the light feed cycle."
          : "No short-blade run yet. Start the drill to sharpen the close-range edge.";
  } else if (game.mode === "combo-barrage") {
    ui.forgeMinigameBar.style.setProperty("--target-start", "0%");
    ui.forgeMinigameBar.style.setProperty("--target-end", "0%");
    ui.forgeMinigameStatus.textContent = game.active
      ? `Land the 4 combo beats in order. Combo hits: ${game.hits}/4.`
      : game.finished
        ? `Brass combo forge finished at ${weapon.forgeQualityLabel}. Combo rhythm landed ${Math.round(weapon.forgeQuality * 100)}% clean.`
        : "No brass combo run yet. Start the drill to sharpen the punch chain.";
  } else if (game.mode === "shockwave-slam") {
    ui.forgeMinigameBar.style.setProperty("--target-start", "78%");
    ui.forgeMinigameBar.style.setProperty("--target-end", "92%");
    ui.forgeMinigameStatus.textContent = game.active
      ? `Slam in the impact lane 3 times. Clean slams: ${game.hits}/3.`
      : game.finished
        ? `Hammer slam forge finished at ${weapon.forgeQualityLabel}. Shockwave timing landed ${Math.round(weapon.forgeQuality * 100)}% clean.`
        : "No hammer slam run yet. Start the drill to charge the impact head.";
  } else if (game.mode === "reaper-hook") {
    ui.forgeMinigameBar.style.setProperty("--target-start", "0%");
    ui.forgeMinigameBar.style.setProperty("--target-end", "0%");
    ui.forgeMinigameStatus.textContent = game.active
      ? `Catch each drifting hook point. Hooks caught: ${game.hits}/${Math.max(game.pips.length, 3)}.`
      : game.finished
        ? `Scythe hook forge finished at ${weapon.forgeQualityLabel}. Hook control landed ${Math.round(weapon.forgeQuality * 100)}% clean.`
        : "No scythe hook run yet. Start the drill to tune the pull arc.";
  } else if (game.mode === "rail-bore") {
    ui.forgeMinigameBar.style.setProperty("--target-start", "0%");
    ui.forgeMinigameBar.style.setProperty("--target-end", "0%");
    ui.forgeMinigameStatus.textContent = game.active
      ? `Catch each drifting bore point. Coil catches: ${game.hits}/${Math.max(game.pips.length, 3)}.`
      : game.finished
        ? `Coil bore tuning finished at ${weapon.forgeQualityLabel}. Bore control landed ${Math.round(weapon.forgeQuality * 100)}% clean.`
        : "No coil-bore run yet. Start the drill to tune the rail lane.";
  } else if (game.mode === "bolt-latch") {
    const lanes = [
      ["10%", "22%"],
      ["78%", "90%"],
      ["14%", "26%"]
    ];
    const lane = lanes[Math.min(game.laneIndex, lanes.length - 1)];
    ui.forgeMinigameBar.style.setProperty("--target-start", lane[0]);
    ui.forgeMinigameBar.style.setProperty("--target-end", lane[1]);
    ui.forgeMinigameStatus.textContent = game.active
      ? `Hit the 3 latch lanes. Locked bolts: ${game.hits}/3.`
      : game.finished
        ? `Crossbow latch tuning finished at ${weapon.forgeQualityLabel}. Bolt seating landed ${Math.round(weapon.forgeQuality * 100)}% clean.`
        : "No crossbow latch run yet. Start the drill to seat each bolt cleanly.";
  } else if (game.mode === "axe-throw") {
    const lanes = [
      ["10%", "22%"],
      ["78%", "90%"],
      ["14%", "26%"],
      ["74%", "86%"]
    ];
    const lane = lanes[Math.min(game.laneIndex, lanes.length - 1)];
    ui.forgeMinigameBar.style.setProperty("--target-start", lane[0]);
    ui.forgeMinigameBar.style.setProperty("--target-end", lane[1]);
    ui.forgeMinigameStatus.textContent = game.active
      ? `Hit the alternating throw lanes. Clean throws: ${game.hits}/4.`
      : game.finished
        ? `Throw axe forge finished at ${weapon.forgeQualityLabel}. Throw control landed ${Math.round(weapon.forgeQuality * 100)}% clean.`
        : "No throw axe run yet. Start the drill to tighten the release pattern.";
  } else {
    ui.forgeMinigameBar.style.setProperty("--target-start", "0%");
    ui.forgeMinigameBar.style.setProperty("--target-end", "0%");
    ui.forgeMinigameStatus.textContent = "Start the forge drill to tune this weapon.";
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
    if (isRangedWeapon(weapon)) {
      ui.forgeNote.textContent =
        `${weapon.classLabel} ranged builds now split weapon body and ammo crafting. ` +
        `Build rounds in the ammo workshop, stack them into the case, and every shot will fire in that exact order.`;
    } else {
      ui.forgeNote.textContent =
        `${weapon.classLabel} blades now use built-in class traits only. ` +
        `${weapon.frame} trait: ${weapon.abilitySummary}`;
    }
  }
  ui.weaponTitle.textContent = weapon.name;
  ui.weaponLore.textContent = weapon.lore;
  renderForgeBadges(weapon);
  renderForgeStats(weapon);
  renderForgeDetails(weapon);
  renderForgePreview(weapon);
  renderForgeMinigame(weapon);
  if (isRangedWeapon(weapon)) {
    renderAmmoWorkshop(weapon);
  }
  renderMenuSummary();
  saveProgressState();
}

function weaponById(id) {
  return state.armory.find((weapon) => weapon.id === id) || null;
}

function updateHudLabels() {
  const activeWeapon = state.match?.playerWeapon || weaponById(state.activeWeaponId) || currentBlueprint();
  const rivalWeapon = state.match?.rivalWeapon || weaponById(state.rivalWeaponId);
  const stageState = activeStageState();
  const ranged = isRangedWeapon(activeWeapon);

  ui.hudPlayerWeapon.textContent = activeWeapon?.name || "Unarmed";
  ui.hudRivalWeapon.textContent = rivalWeapon?.name || "Auto Forge";
  ui.hudArenaName.textContent = currentStageConfig(stageState.id).label;
  ui.hudSetScore.textContent = state.match ? `${state.match.score.player} - ${state.match.score.enemy}` : "0 - 0";
  ui.battlefieldMode.textContent = matchModeLabel(ui.matchMode.value);
  ui.battlefieldPhase.textContent = battlefieldPhaseText();
  ui.battlefieldStyle.textContent = activeWeapon?.styleText || "Balanced duel control";
  ui.battlefieldStage.textContent = currentStageConfig(stageState.id).label;
  ui.battlefieldLoadout.textContent = activeWeapon?.name || "Unarmed";
  if (ui.touchControls) {
    ui.touchControls.classList.toggle("ranged-mode", ranged);
  }
  if (ui.touchAttack) {
    setTouchButtonTitle(ui.touchAttack, ranged ? "Fire" : "Strike");
  }
  if (ui.touchReload) {
    const showReload = ranged;
    ui.touchReload.hidden = !showReload;
    setTouchButtonTitle(ui.touchReload, "Reload");
  }
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
  validateLoadoutSelections();

  renderArmory();
  updateHudLabels();
}

function loadWeaponIntoForge(weapon) {
  state.forge = forgeBlueprintFromWeapon(weapon);
  state.forge = reconcileAmmoCaseForForge(state.forge);

  syncForgeSelectors();
  resetForgeMinigame(state.forge.frame, true);
  renderForge();
}

function deleteWeapon(id) {
  state.armory = state.armory.filter((weapon) => weapon.id !== id);
  validateLoadoutSelections();
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
    saveProgressState();
    return;
  }

  state.armory.forEach((weapon) => {
    const rangedWeapon = isRangedWeapon(weapon);
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
      <span class="pill">${rangedWeapon ? (weapon.fireModeLabel || weapon.edge) : weapon.edge}</span>
      <span class="pill">${weapon.forgeQualityLabel}</span>
      <span class="pill">${weapon.heat}% heat</span>
      <span class="pill">${rangedWeapon ? weapon.ammoLabel : `${weapon.reach} reach`}</span>
    `;

    const statRow = document.createElement("div");
    statRow.className = "armory-stat-row";
    statRow.innerHTML = rangedWeapon
      ? `
        <div class="armory-stat">
          <span>Shot Speed</span>
          <strong>${weapon.projectileSpeed}</strong>
        </div>
        <div class="armory-stat">
          <span>Reload</span>
          <strong>${weapon.reloadTime.toFixed(2)}s</strong>
        </div>
        <div class="armory-stat">
          <span>Weight</span>
          <strong>${weapon.weight.toFixed(1)}</strong>
        </div>
      `
      : `
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
  saveProgressState();
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
  saveProgressState();
}

function fighterProfileForWeapon(weapon) {
  if (isRangedWeapon(weapon)) {
    const heavyGun = weapon.kind === "heavy";
    const sidearm = weapon.kind === "sidearm";
    return {
      damage: clamp(Math.round(weapon.damage * 0.88 + weapon.impactChambers * 1.5), 10, 42),
      reach: clamp(Math.round(58 + weapon.weight * 1.1 + (heavyGun ? 8 : sidearm ? -4 : 0)), 52, 92),
      windup: clamp(0.05 + weapon.cooldown * 0.18 + (heavyGun ? 0.02 : 0), 0.06, 0.18),
      active: 0.04,
      recover: clamp(0.12 + weapon.cooldown * 0.22 + (heavyGun ? 0.03 : 0), 0.14, 0.3),
      knockback: clamp(170 + weapon.knockback * 88, 200, 350),
      blockDrain: clamp(Math.round(6 + weapon.blockBreak + weapon.impactChambers * 2), 8, 22),
      lunge: clamp(14 + weapon.speed * 8 - weapon.weight * 0.1, 10, 22),
      parryWindow: heavyGun ? 0.12 : 0.14,
      slideDamage: 0,
      slideHits: 0,
      shotDrain: clamp(6 + weapon.impactChambers * 2 + (heavyGun ? 3 : 0), 7, 16)
    };
  }

  const longClass = weapon.kind === "long";
  const shortClass = weapon.kind === "short";
  const mediumClass = weapon.kind === "medium";
  const specialClass = weapon.kind === "special";
  let slideHits = shortClass ? 1 : mediumClass ? 1 : specialClass ? 1 : 0;
  if (weapon.specialType === "double-spin-dash") {
    slideHits = 2;
  } else if (weapon.specialType === "triple-rush") {
    slideHits = 3;
  } else if (weapon.specialType === "tonfa-rush" || weapon.specialType === "storm-rush" || weapon.specialType === "veil-rush" || weapon.specialType === "twin-dash") {
    slideHits = 2;
  } else if (weapon.specialType === "rake-frenzy") {
    slideHits = 4;
  } else if (weapon.specialType === "reaper-hook" || weapon.specialType === "axe-throw") {
    slideHits = 1;
  }
  const slideDamageScale =
    weapon.specialType === "cross-cut"
      ? 0.78
      : weapon.specialType === "guard-rip"
        ? 0.8
      : weapon.specialType === "axe-throw"
        ? 0.74
      : weapon.specialType === "twin-dash"
        ? 0.64
      : weapon.specialType === "rake-frenzy"
        ? 0.44
      : weapon.specialType === "vault-smash"
        ? 0.72
      : weapon.specialType === "dash-spin"
        ? 0.68
        : mediumClass
          ? 0.7
          : shortClass
            ? 0.52
            : specialClass
              ? 0.62
              : 0.42;
  return {
    damage: clamp(Math.round(weapon.damage * 0.95 + weapon.arc * 2.2 + (longClass ? 2 : shortClass ? -1 : specialClass ? 1 : 0)), 11, 40),
    reach: clamp(Math.round(weapon.reach * 0.78 + (longClass ? 6 : shortClass ? -4 : specialClass ? 1 : 0)), 40, 126),
    windup: clamp(0.11 + weapon.cooldown * 0.11 - weapon.speed * 0.025 + (longClass ? 0.06 : shortClass ? -0.02 : specialClass ? -0.01 : 0), 0.07, 0.3),
    active: clamp(0.07 + weapon.arc * 0.03 + (mediumClass ? 0.01 : specialClass ? 0.015 : 0), 0.08, 0.2),
    recover: clamp(0.15 + weapon.cooldown * 0.2 + (longClass ? 0.04 : shortClass ? -0.02 : specialClass ? -0.01 : 0), 0.12, 0.42),
    knockback: clamp(180 + weapon.knockback * 70 + (longClass ? 18 : 0), 190, 340),
    blockDrain: clamp(Math.round(8 + weapon.damage * 0.35 + weapon.weight * 0.35 + (longClass ? 2 : specialClass ? 1 : 0)), 10, 28),
    lunge: clamp(48 + weapon.reach * 0.18 + (mediumClass ? 10 : shortClass ? 14 : specialClass ? 8 : -4), 48, 96),
    parryWindow: longClass ? 0.22 : mediumClass ? 0.16 : 0.14,
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
  const isRanged = isRangedWeapon(weapon);
  const loadedRounds = isRanged ? ammoRoundListForWeapon(weapon) : [];
  const fighter = {
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
    muzzleFlash: 0,
    parryWindow: 0,
    parryFlash: 0,
    dodgeCooldown: 0,
    slideCooldown: 0,
    jumpCooldown: 0,
    manualSwingCooldown: 0,
    ammo: isRanged ? loadedRounds.length : 0,
    maxAmmo: isRanged ? loadedRounds.length : 0,
    loadedRounds,
    roundIndex: 0,
    reloadTimer: 0,
    reloadQueued: false,
    slowTimer: 0,
    poisonTimer: 0,
    poisonTickTimer: 0,
    stuckPayloads: [],
    dodgeTimer: 0,
    slideTimer: 0,
    slideDir: 0,
    dashSpeed: 0,
    slideHitCooldown: 0,
    slideHitCount: 0,
    slamReady: false,
    lastGrounded: true,
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
    alive: true,
    styleBonuses: null,
    comboPressure: 0
  };

  if (team === PLAYER_TEAM) {
    const bonus = styleBonusProfile();
    if (bonus) {
      fighter.styleBonuses = bonus;
      fighter.walkSpeed = clamp(fighter.walkSpeed + bonus.agilityLevel * 7, 132, 264);
      fighter.profile.damage = clamp(fighter.profile.damage + bonus.strengthLevel, 11, 48);
      fighter.profile.knockback = clamp(fighter.profile.knockback + bonus.strengthLevel * 6, 190, 380);
      fighter.profile.lunge = clamp(fighter.profile.lunge + bonus.agilityLevel * 3, 48, 120);
      fighter.profile.parryWindow = clamp(fighter.profile.parryWindow + bonus.defenseLevel * 0.01, 0.12, 0.3);
      fighter.maxStamina = clamp(fighter.maxStamina + bonus.defenseLevel * 6, 100, 136);
      fighter.stamina = fighter.maxStamina;
      if (bonus.styleId === "phantom") {
        fighter.weapon.stealthOpacity = clamp((fighter.weapon.stealthOpacity || 1) - bonus.agilityLevel * 0.025, 0.22, 1);
      }
    }
  }

  return fighter;
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
      slide: state.keysDown.has(keyBindings.p1.slide) || state.touchState.slide || gamepadButtons.slide,
      reload: state.keysDown.has(keyBindings.p1.reload) || state.touchState.reload || gamepadButtons.reload
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
    slide: state.keysDown.has(keyBindings.p2.slide),
    reload: false
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
    slidePressed: raw.slide && !previous.slide,
    reloadPressed: raw.reload && !previous.reload
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

function pointToSegmentDistance(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared <= 0.0001) {
    return Math.hypot(px - x1, py - y1);
  }
  const projection = clamp(((px - x1) * dx + (py - y1) * dy) / lengthSquared, 0, 1);
  const closestX = x1 + dx * projection;
  const closestY = y1 + dy * projection;
  return Math.hypot(px - closestX, py - closestY);
}

function segmentDistance(ax, ay, bx, by, cx, cy, dx, dy) {
  if (segmentsIntersect(ax, ay, bx, by, cx, cy, dx, dy)) {
    return 0;
  }
  return Math.min(
    pointToSegmentDistance(ax, ay, cx, cy, dx, dy),
    pointToSegmentDistance(bx, by, cx, cy, dx, dy),
    pointToSegmentDistance(cx, cy, ax, ay, bx, by),
    pointToSegmentDistance(dx, dy, ax, ay, bx, by)
  );
}

function fighterUsesMouseJab(fighter) {
  return fighter.control === "p1" && preferredInputMode() === "pc" && fighter.weapon.kind !== "long" && !isRangedWeapon(fighter.weapon);
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
  if (fighter.attack?.style === "shot") {
    return "shot";
  }
  return fighter.attack?.style === "jab" ? "jab" : "swing";
}

function fighterProjectileCounterSegment(fighter) {
  if (
    !fighter.alive ||
    isRangedWeapon(fighter.weapon) ||
    fighter.hitstun > 0 ||
    fighter.stunTimer > 0
  ) {
    return null;
  }

  const pose = weaponPoseForFighter(fighter);
  const basePadding = fighter.weapon.kind === "long" ? 18 : fighter.weapon.kind === "medium" ? 14 : 11;

  if (fighter.parryWindow > 0 && fighter.onGround) {
    return {
      x1: pose.baseX,
      y1: pose.baseY,
      x2: pose.tipX,
      y2: pose.tipY,
      padding: basePadding + (fighter.weapon.kind === "long" ? 14 : 9),
      mode: "parry"
    };
  }

  if (fighter.blocking && fighter.onGround) {
    return {
      x1: pose.baseX,
      y1: pose.baseY,
      x2: pose.tipX,
      y2: pose.tipY,
      padding: basePadding + (fighter.weapon.kind === "long" ? 10 : fighter.weapon.kind === "medium" ? 6 : 3),
      mode: "guard"
    };
  }

  if (fighter.attack && fighter.attack.style !== "shot") {
    if (fighter.attack.style === "combo") {
      const comboActive = (fighter.attack.comboSegments || []).some(
        (segment) =>
          fighter.attack.timer >= segment.start - 0.02 &&
          fighter.attack.timer <= segment.end + 0.03
      );
      if (!comboActive) {
        return null;
      }
    } else {
      const windupEnd = fighter.profile.windup;
      const activeEnd = windupEnd + fighter.profile.active;
      if (
        fighter.attack.timer < windupEnd * 0.55 ||
        fighter.attack.timer > activeEnd + fighter.profile.recover * 0.18
      ) {
        return null;
      }
    }

    return {
      x1: pose.baseX,
      y1: pose.baseY,
      x2: pose.tipX,
      y2: pose.tipY,
      padding: basePadding + (fighter.attack.style === "jab" ? 9 : 6),
      mode: "slice"
    };
  }

  if (
    fighter.control === "p1" &&
    fighter.weaponTip &&
    !fighter.attack &&
    !fighter.blocking &&
    fighter.slideTimer <= 0 &&
    fighter.dodgeTimer <= 0
  ) {
    const tipTravel = Math.hypot(pose.tipX - fighter.weaponTip.x, pose.tipY - fighter.weaponTip.y);
    if (tipTravel >= 12) {
      return {
        x1: fighter.weaponTip.x,
        y1: fighter.weaponTip.y,
        x2: pose.tipX,
        y2: pose.tipY,
        padding: Math.max(8, basePadding - 2),
        mode: "slice"
      };
    }
  }

  return null;
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
  let weaponLength = isRangedWeapon(fighter.weapon)
    ? fighter.weapon.kind === "sidearm"
      ? 42
      : fighter.weapon.kind === "assault"
        ? 58
        : fighter.weapon.kind === "heavy"
          ? 72
          : fighter.weapon.frameId === "ballista"
            ? 72
            : fighter.weapon.frameId === "longbow" || fighter.weapon.frameId === "stormbow"
              ? 62
              : fighter.weapon.frameId === "crossbow"
                ? 58
                : 66
    : fighter.profile.reach * 0.78;
  let baseX = fighter.x + shoulderX;
  let baseY = fighter.y + shoulderY;

  if (fighter.blocking) {
    weaponAngle = isRangedWeapon(fighter.weapon) ? -0.4 : -0.92;
  } else if (fighter.attack) {
    const actionWindow = attackActionProgress(fighter);
    if (fighter.attack.style === "shot") {
      const recoil = Math.sin(actionWindow * Math.PI);
      weaponAngle = fighter.mouseWeaponAngle;
      baseX -= fighter.facing * recoil * 8;
      baseY += recoil * 2;
    } else if (fighter.attack.style === "jab") {
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
  } else if (fighter.control === "p1" || isRangedWeapon(fighter.weapon)) {
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
  if (fighter.control !== "p1" && !isRangedWeapon(fighter.weapon)) {
    return;
  }

  const height = currentFighterHeight(fighter);
  const torsoTop = -height * 0.5;
  const shoulderX = fighter.x + fighter.facing * 11;
  const shoulderY = fighter.y + torsoTop * 0.46;
  const usingGamepadAim = state.gamepad.connected && Math.hypot(state.gamepad.rightX, state.gamepad.rightY) > 0.24;
  const usingControllerAssist =
    preferredInputMode() === "controller" &&
    !usingGamepadAim &&
    opponent &&
    (isRangedWeapon(fighter.weapon) || fighter.control === "p1");
  const usingTouchAssist =
    state.inputProfile.touch &&
    !usingGamepadAim &&
    (state.inputProfile.lastSource === "touch" || anyTouchInputActive());
  let localX;
  let localY;

  if (fighter.control !== "p1" && isRangedWeapon(fighter.weapon) && opponent) {
    const opponentHeight = currentFighterHeight(opponent);
    localX = (opponent.x - shoulderX) * fighter.facing;
    localY = opponent.y - opponentHeight * 0.58 - shoulderY;
  } else if (usingGamepadAim) {
    localX = state.gamepad.rightX * 140;
    localY = state.gamepad.rightY * 94;
  } else if (usingControllerAssist) {
    const opponentHeight = currentFighterHeight(opponent);
    const targetX = opponent.x + opponent.vx * 0.08;
    const targetY = opponent.y - opponentHeight * 0.58;
    localX = (targetX - shoulderX) * fighter.facing;
    localY = targetY - shoulderY;
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

function startReload(fighter, match, manual = false) {
  if (!isRangedWeapon(fighter.weapon) || fighter.reloadTimer > 0 || fighter.ammo >= fighter.maxAmmo || !fighter.alive) {
    return false;
  }

  fighter.reloadTimer = fighter.weapon.reloadTime || 0.9;
  fighter.reloadQueued = false;
  fighter.attack = null;
  fighter.blocking = false;
  fighter.crouching = false;
  addSpark(match, fighter.x + fighter.facing * 10, fighter.y - currentFighterHeight(fighter) * 0.56, "rgba(255,255,255,0.8)", 5);
  playSoundEffect("block");
  if (manual) {
    setMatchSummary(`${fighter.name} started reloading ${fighter.weapon.name}.`);
    pushFightEvent(match, "Reload", `${fighter.name} is reloading ${fighter.weapon.name}.`, "control");
  }
  return true;
}

function performJump(fighter, match) {
  if (!fighter.alive || !fighter.onGround || fighter.jumpCooldown > 0 || fighter.hitstun > 0 || fighter.stunTimer > 0) {
    return false;
  }

  fighter.vy = -620;
  fighter.onGround = false;
  fighter.slamReady = fighter.weapon.specialType === "shockwave-slam";
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
  fighter.dodgeTimer = fighter.styleBonuses?.styleId === "phantom" && fighter.styleBonuses.abilityAgility ? 0.2 : 0.22;
  fighter.dodgeCooldown = fighter.styleBonuses?.styleId === "tempest" && fighter.styleBonuses.abilityAgility ? 0.68 : 0.82;
  fighter.invulnerable =
    fighter.styleBonuses?.styleId === "bastion" && fighter.styleBonuses.abilityAgility
      ? 0.19
      : fighter.styleBonuses?.styleId === "phantom" && fighter.styleBonuses.abilityDefense
        ? 0.18
        : 0.14;
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
  const dashDurationBoost =
    fighter.weapon.specialType === "feint-thrust"
      ? 0.03
      : fighter.weapon.specialType === "crescent-sweep" || fighter.weapon.specialType === "dash-spin"
        ? 0.02
        : fighter.weapon.specialType === "tonfa-rush" || fighter.weapon.specialType === "storm-rush"
          ? 0.04
          : fighter.weapon.specialType === "veil-rush"
            ? 0.06
        : fighter.weapon.specialType === "twin-dash"
          ? 0.04
          : fighter.weapon.specialType === "rake-frenzy"
            ? 0.05
            : fighter.weapon.specialType === "vault-smash"
              ? 0.03
        : 0;
  fighter.slideTimer = fighter.weapon.kind === "short" ? 0.28 + dashDurationBoost : fighter.weapon.kind === "medium" ? 0.22 + dashDurationBoost : 0.2 + dashDurationBoost;
  fighter.slideCooldown = 0.96;
  fighter.slideDir = fighter.facing;
  fighter.dashSpeed = fighter.weapon.kind === "long" ? 400 : fighter.weapon.kind === "short" ? 470 : 450;
  fighter.slideHitCooldown = 0;
  fighter.slideHitCount = 0;
  const slideSpeedBonus =
    fighter.weapon.specialType === "cross-cut"
      ? 24
      : fighter.weapon.specialType === "guard-rip"
        ? 18
      : fighter.weapon.specialType === "tonfa-rush"
        ? 24
      : fighter.weapon.specialType === "storm-rush"
        ? 34
      : fighter.weapon.specialType === "veil-rush"
        ? 36
      : fighter.weapon.specialType === "triple-rush"
        ? 30
        : fighter.weapon.specialType === "twin-dash"
          ? 22
          : fighter.weapon.specialType === "rake-frenzy"
            ? 34
            : fighter.weapon.specialType === "vault-smash"
              ? 20
        : fighter.weapon.specialType === "feint-thrust"
          ? 18
          : 0;
  if (fighter.weapon.specialType === "veil-rush") {
    fighter.invulnerable = Math.max(fighter.invulnerable || 0, 0.14);
  }
  if (fighter.weapon.specialType === "storm-rush") {
    fighter.slideCooldown = 0.84;
  } else if (fighter.weapon.specialType === "tonfa-rush") {
    fighter.slideCooldown = 0.88;
  }
  fighter.dashSpeed += slideSpeedBonus + (fighter.styleBonuses?.styleId === "tempest" && fighter.styleBonuses.abilityAgility ? 32 : 0);
  fighter.vx = fighter.facing * fighter.dashSpeed;
  addSpark(match, fighter.x, fighter.y - 10, fighter.weapon.color, 10);
  playSoundEffect("slide");
  return true;
}

function comboSegmentsForWeapon(weapon) {
  if (weapon.specialType !== "combo-barrage") {
    return null;
  }
  return [
    { start: 0.03, end: 0.08, damageScale: 0.42, knockbackScale: 0.32, label: "right jab" },
    { start: 0.09, end: 0.14, damageScale: 0.44, knockbackScale: 0.36, label: "left jab" },
    { start: 0.16, end: 0.22, damageScale: 0.62, knockbackScale: 0.54, label: "right uppercut" },
    { start: 0.24, end: 0.34, damageScale: 0.9, knockbackScale: 1.2, label: "heavy left finisher" }
  ];
}

function emitGroundShockwave(attacker, defender, match) {
  const contactX = attacker.x;
  const contactY = attacker.y - 10;
  addSpark(match, contactX, contactY, "#ffe8a1", 20);
  triggerImpact(match, { shake: 12, flash: 0.14, hitstop: 0.06 });
  pushFightEvent(match, "Shockwave", `${attacker.name} crashed down with ${attacker.weapon.name} and sent out a shockwave.`, "impact");

  if (!defender.alive || defender.invulnerable > 0 || !defender.onGround) {
    return;
  }

  const distance = Math.abs(defender.x - attacker.x);
  if (distance > 132) {
    return;
  }

  const attackerStats = statsForTeam(match, attacker.team);
  const defenderStats = statsForTeam(match, defender.team);
  const reduced = defender.blocking && onFrontSide(defender, attacker);
  const damage = reduced ? 7 : 14;
  defender.health = clamp(defender.health - damage, 0, defender.maxHealth);
  defender.vx = Math.sign(defender.x - attacker.x || attacker.facing) * (reduced ? 140 : 240);
  defender.hitstun = Math.max(defender.hitstun, reduced ? 0.12 : 0.2);
  defender.blocking = false;
  defender.attackFlash = 0.16;
  defender.alive = defender.health > 0;
  applyStun(defender, reduced ? 0.08 : 0.18);
  attackerStats.hits += 1;
  attackerStats.damage += damage;
  attackerStats.stuns += 1;
  if (reduced) {
    defenderStats.blocks += 1;
  }
  setMatchSummary(
    reduced
      ? `${attacker.name}'s hammer shockwave clipped ${defender.name}'s guard.`
      : `${attacker.name} slammed the ground and shockwaved ${defender.name} for ${damage}.`
  );
}

function projectileTargetPoint(fighter) {
  return {
    x: fighter.x,
    y: fighter.y - currentFighterHeight(fighter) * 0.58
  };
}

function projectileImpactCount(projectile, impactId) {
  return countMatches(projectile.chamberImpacts || projectile.impactTypes || [projectile.impactType], impactId);
}

function projectileHasImpact(projectile, impactId) {
  return projectileImpactCount(projectile, impactId) > 0;
}

function projectileRadius(projectile) {
  const base =
    projectile.ammoType === "rail"
      ? 6.8
      : projectile.ammoType === "bolt"
        ? 5.6
        : 4.8;
  const chamberBonus = Math.max(0, (projectile.impactChambers || 1) - 1) * 0.7;
  const weakenedPenalty = projectile.weakened ? 1.1 : 0;
  return Math.max(2.6, base + chamberBonus - weakenedPenalty);
}

function projectileCounterPower(projectile) {
  return (
    projectile.damage +
    projectile.blockBreak * 0.34 +
    projectile.pierce * 3 +
    (projectile.impactChambers || 1) * 1.5 +
    Math.hypot(projectile.vx || 0, projectile.vy || 0) / 240 +
    (projectile.ammoType === "rail" ? 4 : projectile.ammoType === "bolt" ? 2 : 0) +
    (projectile.shockCount || 0) +
    (projectile.portalCount || 0) +
    (projectile.slowCount || 0) * 0.4 +
    (projectile.ruptureCount || 0) * 0.5 +
    (projectile.explosiveBoost || 0) * 10
  );
}

function weakenProjectile(projectile, factor = 0.62) {
  projectile.weakened = true;
  projectile.damage = Math.max(2, Math.round(projectile.damage * factor));
  projectile.blockBreak = Math.max(0, Math.round(projectile.blockBreak * Math.max(0.36, factor * 0.82)));
  projectile.knockback *= Math.max(0.4, factor * 0.9);
  projectile.vx *= Math.max(0.68, factor * 1.08);
  projectile.vy *= Math.max(0.68, factor * 1.08);
  projectile.speed = Math.hypot(projectile.vx || 0, projectile.vy || 0);
  projectile.life *= Math.max(0.52, factor * 1.08);
  projectile.pierce = Math.max(0, projectile.pierce - 1);
  projectile.homingStrength *= factor;
  projectile.redirectCharges = Math.max(0, Math.round((projectile.redirectCharges || 0) * factor) - 1);
  projectile.explosiveBoost *= factor;
  projectile.shockCount = Math.round((projectile.shockCount || 0) * factor);
  projectile.poisonCount = Math.round((projectile.poisonCount || 0) * factor);
  projectile.portalCount = Math.round((projectile.portalCount || 0) * factor);
  projectile.slowCount = Math.round((projectile.slowCount || 0) * factor);
  projectile.ruptureCount = Math.round((projectile.ruptureCount || 0) * factor);
  projectile.impactChambers = Math.max(1, Math.round((projectile.impactChambers || 1) * Math.max(0.5, factor)));
}

function projectileCounterNeedsCallout(projectile, fighter = null) {
  return projectile.ownerTeam === PLAYER_TEAM || fighter?.team === PLAYER_TEAM;
}

function projectileIntersectsCounter(projectile, counter) {
  const distance = segmentDistance(
    projectile.prevX,
    projectile.prevY,
    projectile.x,
    projectile.y,
    counter.x1,
    counter.y1,
    counter.x2,
    counter.y2
  );
  return distance <= projectileRadius(projectile) + counter.padding;
}

function applyWeakenedProjectileBurst(projectile, match, x, y, counterFighter = null) {
  const burstRadius = 24 + (projectile.impactChambers || 1) * 6 + (projectile.ammoType === "rail" ? 6 : 0);
  const baseDamage = clamp(
    Math.round(
      projectile.damage * 0.24 +
      (projectile.impactChambers || 1) * 0.6 +
      (projectileHasImpact(projectile, "explosive") ? 1 : 0) +
      (projectileHasImpact(projectile, "scatter") || projectileHasImpact(projectile, "shrapnel") ? 1 : 0)
    ),
    1,
    8
  );
  const pushDir = Math.sign(projectile.vx || (counterFighter ? counterFighter.facing : 1)) || 1;

  addSpark(match, x, y, projectile.glow || projectile.color, projectile.ammoType === "rail" ? 14 : 10);

  if (
    projectileHasImpact(projectile, "explosive") ||
    projectileHasImpact(projectile, "scatter") ||
    projectileHasImpact(projectile, "shrapnel")
  ) {
    spawnZone(match, "blast", x, y, 16 + (projectile.impactChambers || 1) * 4, 0.14, "rgba(255,187,102,0.18)", 0);
  }
  if (projectile.portalCount > 0 || projectileHasImpact(projectile, "portal")) {
    spawnZone(match, "portal", x, y, 20 + (projectile.portalCount || 0) * 4, 0.16, "rgba(140,118,255,0.2)", 0);
  }
  if (projectile.blizzardTrail || (projectile.slowCount || 0) > 0) {
    spawnZone(match, "blizzard", x, y, 18 + (projectile.slowCount || 0) * 4, 0.14, "rgba(202,236,255,0.22)", 0.12);
  }

  match.fighters.forEach((fighter) => {
    if (!fighter.alive) {
      return;
    }
    const targetPoint = projectileTargetPoint(fighter);
    const distance = Math.hypot(targetPoint.x - x, targetPoint.y - y);
    if (distance > burstRadius) {
      return;
    }

    const falloff = 1 - distance / Math.max(burstRadius, 1);
    let chipDamage = clamp(Math.round(baseDamage * (0.45 + falloff * 0.55)), 1, baseDamage);
    if (counterFighter && fighter.team === counterFighter.team) {
      chipDamage = Math.max(1, Math.round(chipDamage * 0.7));
    }

    if (fighter.blocking && fighter.onGround) {
      fighter.stamina = clamp(
        fighter.stamina - Math.max(1, Math.round(chipDamage + (projectile.blockBreak || 0) * 0.16)),
        0,
        fighter.maxStamina
      );
      fighter.hitstun = Math.max(fighter.hitstun, 0.04);
      addSpark(match, targetPoint.x, targetPoint.y, "#ffffff", 4);
      return;
    }

    fighter.health = clamp(fighter.health - chipDamage, 0, fighter.maxHealth);
    fighter.vx += pushDir * (18 + chipDamage * 8) * (0.5 + falloff * 0.5);
    fighter.hitstun = Math.max(fighter.hitstun, 0.05 + chipDamage * 0.006);
    fighter.attackFlash = 0.08;
    fighter.alive = fighter.health > 0;

    if ((projectile.slowCount || 0) > 0 || projectile.blizzardTrail) {
      fighter.slowTimer = Math.max(fighter.slowTimer, 0.08 + (projectile.slowCount || 0) * 0.02);
    }
    if ((projectile.shockCount || 0) > 0 && !fighter.blocking) {
      applyStun(fighter, 0.05 + (projectile.shockCount || 0) * 0.01);
    }
    if ((projectile.poisonCount || 0) > 0 && !fighter.blocking) {
      fighter.poisonTimer = Math.max(fighter.poisonTimer, 0.7 + (projectile.poisonCount || 0) * 0.2);
      fighter.poisonTickTimer = Math.min(fighter.poisonTickTimer || 0.45, 0.45);
    }
  });

  triggerImpact(match, { shake: 3 + Math.min(3, projectile.impactChambers || 1), flash: 0.05, hitstop: 0.02 });
}

function resolveProjectileCounter(match, projectile, fighter, counter) {
  const contactX = (projectile.x + counter.x2) * 0.5;
  const contactY = (projectile.y + counter.y2) * 0.5;
  const fighterStats = statsForTeam(match, fighter.team);

  projectile.spent = true;
  applyWeakenedProjectileBurst(projectile, match, contactX, contactY, fighter);
  fighter.attackFlash = Math.max(fighter.attackFlash, 0.1);

  if (counter.mode === "parry") {
    fighter.parryFlash = Math.max(fighter.parryFlash, 0.24);
    fighter.stamina = clamp(fighter.stamina + 5, 0, fighter.maxStamina);
    fighterStats.parries += 1;
    fighterStats.blocks += 1;
    playSoundEffect("block");
  } else if (counter.mode === "guard") {
    fighter.stamina = clamp(fighter.stamina - Math.max(1, Math.round(projectile.blockBreak * 0.18 + 2)), 0, fighter.maxStamina);
    fighterStats.blocks += 1;
    playSoundEffect("block");
  } else {
    fighter.stamina = clamp(fighter.stamina - 1, 0, fighter.maxStamina);
    playSoundEffect("hit");
  }

  if (projectileCounterNeedsCallout(projectile, fighter)) {
    const actionLabel =
      counter.mode === "parry"
        ? "parried"
        : counter.mode === "guard"
          ? "checked"
          : "cut";
    setMatchSummary(`${fighter.name} ${actionLabel} ${projectile.attackerName}'s shot out of the air.`);
    pushFightEvent(
      match,
      counter.mode === "parry" ? "Projectile Parry" : "Air Cut",
      `${fighter.name} ${actionLabel} ${projectile.attackerName}'s ${projectile.weaponName} shot and forced a weak burst.`,
      "control"
    );
  }
}

function resolveProjectileClash(match, first, second) {
  const contactX = (first.x + second.x) * 0.5;
  const contactY = (first.y + second.y) * 0.5;
  const firstPower = projectileCounterPower(first);
  const secondPower = projectileCounterPower(second);

  addSpark(match, contactX, contactY, first.glow || first.color, first.ammoType === "rail" ? 10 : 6);
  addSpark(match, contactX, contactY, second.glow || second.color, second.ammoType === "rail" ? 10 : 6);

  if (Math.abs(firstPower - secondPower) <= 3.6) {
    first.spent = true;
    second.spent = true;
    applyWeakenedProjectileBurst(firstPower >= secondPower ? first : second, match, contactX, contactY);
  } else {
    const winner = firstPower > secondPower ? first : second;
    const loser = winner === first ? second : first;
    loser.spent = true;
    weakenProjectile(winner, 0.58);
    winner.x = contactX;
    winner.y = contactY;
    winner.prevX = contactX - winner.vx * 0.02;
    winner.prevY = contactY - winner.vy * 0.02;
  }

  triggerImpact(match, { shake: 3, flash: 0.04, hitstop: 0.015 });

  if (projectileCounterNeedsCallout(first) || projectileCounterNeedsCallout(second)) {
    setMatchSummary("Shots clashed in mid-air and burst apart.");
    pushFightEvent(match, "Shot Clash", "Two projectiles collided in the lane and lost most of their force.", "control");
  }
}

function resolveProjectileCounterplay(match) {
  if (!match?.projectiles?.length) {
    return;
  }

  for (let index = 0; index < match.projectiles.length; index += 1) {
    const projectile = match.projectiles[index];
    if (projectile.spent) {
      continue;
    }
    for (let otherIndex = index + 1; otherIndex < match.projectiles.length; otherIndex += 1) {
      const other = match.projectiles[otherIndex];
      if (other.spent || projectile.ownerTeam === other.ownerTeam) {
        continue;
      }
      const collisionDistance = segmentDistance(
        projectile.prevX,
        projectile.prevY,
        projectile.x,
        projectile.y,
        other.prevX,
        other.prevY,
        other.x,
        other.y
      );
      if (collisionDistance <= projectileRadius(projectile) + projectileRadius(other)) {
        resolveProjectileClash(match, projectile, other);
        break;
      }
    }
  }

  match.projectiles.forEach((projectile) => {
    if (projectile.spent) {
      return;
    }
    const counterFighter = match.fighters.find((fighter) => fighter.team !== projectile.ownerTeam && fighterProjectileCounterSegment(fighter));
    if (!counterFighter) {
      return;
    }
    const counter = fighterProjectileCounterSegment(counterFighter);
    if (counter && projectileIntersectsCounter(projectile, counter)) {
      resolveProjectileCounter(match, projectile, counterFighter, counter);
    }
  });

  match.projectiles = match.projectiles.filter((projectile) => !projectile.spent);
}

function spawnZone(match, type, x, y, radius, life, color, power = 0) {
  match.zones.push({
    id: makeId(type),
    type,
    x,
    y,
    radius,
    life,
    maxLife: life,
    color,
    power
  });
}

function spawnProjectile(attacker, opponent, match, options = {}) {
  const pose = weaponPoseForFighter(attacker);
  const ammoRound = options.ammoRound || attacker.weapon.ammoPrototype || null;
  const prototypeRound = attacker.weapon.ammoPrototype || ammoRound;
  const targetPoint = opponent ? projectileTargetPoint(opponent) : null;
  let dx = pose.tipX - pose.baseX;
  let dy = pose.tipY - pose.baseY;
  if (Math.abs(dx) < 4 && targetPoint) {
    dx = targetPoint.x - pose.baseX;
    dy = targetPoint.y - pose.baseY;
  }
  const baseAngle = Math.atan2(dy, dx);
  const shotAngle = baseAngle + (options.angleOffset || 0);
  const speedDelta = (ammoRound?.speedBonus || 0) - (prototypeRound?.speedBonus || 0);
  const damageDelta = Math.round(((ammoRound?.damageBonus || 0) - (prototypeRound?.damageBonus || 0)) * 0.65);
  const knockbackDelta = (ammoRound?.knockbackBonus || 0) - (prototypeRound?.knockbackBonus || 0);
  const blockBreakDelta = (ammoRound?.blockBreakBonus || 0) - (prototypeRound?.blockBreakBonus || 0);
  const pierceDelta = (ammoRound?.projectilePierceBonus || 0) - (prototypeRound?.projectilePierceBonus || 0);
  const speed = ((attacker.weapon.projectileSpeed || 760) + speedDelta) * (options.speedScale || 1);
  const projectile = {
    id: makeId("projectile"),
    ownerTeam: attacker.team,
    x: pose.tipX,
    y: pose.tipY,
    prevX: pose.tipX,
    prevY: pose.tipY,
    vx: Math.cos(shotAngle) * speed,
    vy: Math.sin(shotAngle) * speed,
    gravity: attacker.weapon.ammoType === "bolt" ? 80 : attacker.weapon.ammoType === "rail" ? 0 : 24,
    speed,
    life: (attacker.weapon.projectileRange || 420) / Math.max(speed, 1) + 0.22,
    age: 0,
    attackerId: attacker.team,
    attackerName: attacker.name,
    weaponId: attacker.weapon.id,
    weaponName: attacker.weapon.name,
    color: attacker.weapon.color,
    ammoType: attacker.weapon.ammoType,
    impactType: ammoRound?.impactTypes?.[0] || attacker.weapon.impactType,
    impactTypes: ammoRound?.impactTypes ? [...ammoRound.impactTypes] : [attacker.weapon.impactType],
    chamberImpacts: ammoRound?.chamberImpacts ? [...ammoRound.chamberImpacts] : [...(attacker.weapon.chamberImpacts || [attacker.weapon.impactType])],
    impactLabel: ammoRound?.impactLabel || attacker.weapon.impactLabel,
    impactChambers: ammoRound?.impactChambers || attacker.weapon.impactChambers,
    launchType: ammoRound?.launchType || attacker.weapon.launchType,
    midAirType: ammoRound?.midAirAddons?.[0] || attacker.weapon.midAirType,
    midAirAddons: ammoRound?.midAirAddons ? [...ammoRound.midAirAddons] : [...(attacker.weapon.midAirAddons || [])],
    tipType: ammoRound?.tipType || attacker.weapon.tipType,
    damage: Math.max(3, Math.round(attacker.profile.damage * (options.damageScale || 1) + damageDelta)),
    knockback: attacker.profile.knockback + knockbackDelta * 90,
    blockBreak: Math.max(0, Math.round(((attacker.weapon.blockBreak || 0) + blockBreakDelta) * (options.blockScale || 1))),
    pierce: Math.max(0, (attacker.weapon.projectilePierce || 0) + pierceDelta),
    delayedImpact: Boolean(ammoRound?.delayedImpact ?? attacker.weapon.delayedImpact),
    homingStrength: ammoRound?.homingStrength ?? attacker.weapon.homingStrength ?? 0,
    redirectShot: Boolean((ammoRound?.redirectCharges ?? attacker.weapon.redirectCharges ?? 0) > 0),
    redirectCharges: ammoRound?.redirectCharges ?? attacker.weapon.redirectCharges ?? 0,
    redirectedCount: 0,
    blizzardTrail: Boolean(ammoRound?.blizzardTrail ?? attacker.weapon.blizzardTrail),
    emberTrail: Boolean(ammoRound?.emberTrail ?? attacker.weapon.emberTrail),
    stormTrail: Boolean(ammoRound?.stormTrail ?? attacker.weapon.stormTrail),
    spiralFlight: Boolean((ammoRound?.spiralCount ?? attacker.weapon.spiralCount ?? 0) > 0),
    spiralCount: ammoRound?.spiralCount ?? attacker.weapon.spiralCount ?? 0,
    pullImpact: Boolean(ammoRound?.pullImpact ?? attacker.weapon.pullImpact),
    scatterImpact: Boolean(ammoRound?.scatterImpact ?? attacker.weapon.scatterImpact),
    explosiveBoost: ammoRound?.explosiveBoost ?? attacker.weapon.explosiveBoost ?? 0,
    shockCount: ammoRound?.shockCount ?? attacker.weapon.shockCount ?? 0,
    poisonCount: ammoRound?.poisonCount ?? attacker.weapon.poisonCount ?? 0,
    portalCount: ammoRound?.portalCount ?? attacker.weapon.portalCount ?? 0,
    slowCount: ammoRound?.slowCount ?? attacker.weapon.slowCount ?? 0,
    ruptureCount: ammoRound?.ruptureCount ?? attacker.weapon.ruptureCount ?? 0,
    glow: attacker.weapon.projectileGlow || impactAccentColor(ammoRound?.impactTypes?.[0] || attacker.weapon.impactType) || attacker.weapon.color,
    waveSeed: Math.random() * Math.PI * 2,
    trailTimer: 0,
    weakened: false,
    spent: false
  };
  match.projectiles.push(projectile);
  addSpark(match, projectile.x, projectile.y, attacker.weapon.color, attacker.weapon.ammoType === "rail" ? 10 : 6);
  if (projectile.launchType === "blizzard") {
    spawnZone(match, "blizzard", projectile.x, projectile.y, 42, 0.45, "rgba(202,236,255,0.38)", 0.26);
  }
  if (projectile.launchType === "ember") {
    addSpark(match, projectile.x, projectile.y, "#ffc27a", 8);
  }
}

function applyProjectileSplash(attacker, defender, projectile, match, contactX, contactY) {
  const explosiveCount = projectileImpactCount(projectile, "explosive");
  const scatterCount = projectileImpactCount(projectile, "scatter");
  const shrapnelCount = projectileImpactCount(projectile, "shrapnel");
  const imploderCount = projectileImpactCount(projectile, "imploder");
  const portalCount = projectileImpactCount(projectile, "portal");

  if (explosiveCount) {
    const splashDamage = clamp(
      Math.round(projectile.damage * (0.26 + projectile.impactChambers * 0.05 + projectile.explosiveBoost + explosiveCount * 0.08)),
      4,
      20
    );
    defender.health = clamp(defender.health - splashDamage, 0, defender.maxHealth);
    defender.vx += Math.sign(projectile.vx || attacker.facing) * (36 + splashDamage * 6);
    defender.alive = defender.health > 0;
    addSpark(match, contactX, contactY, "#ffd37a", 16);
    triggerImpact(match, { shake: 7, flash: 0.08, hitstop: 0.03 });
  }
  if (scatterCount || projectile.scatterImpact) {
    const fragmentDamage = clamp(Math.round(projectile.damage * (0.14 + scatterCount * 0.05)), 2, 9);
    defender.health = clamp(defender.health - fragmentDamage, 0, defender.maxHealth);
    defender.vx += Math.sign(projectile.vx || attacker.facing) * (20 + fragmentDamage * 4);
    defender.alive = defender.health > 0;
    addSpark(match, contactX, contactY, "#f8f3eb", 20);
  }
  if (shrapnelCount) {
    const fragmentDamage = clamp(Math.round(projectile.damage * (0.2 + shrapnelCount * 0.04)), 3, 10);
    defender.health = clamp(defender.health - fragmentDamage, 0, defender.maxHealth);
    defender.vx += Math.sign(projectile.vx || attacker.facing) * (28 + fragmentDamage * 5);
    defender.alive = defender.health > 0;
    addSpark(match, contactX, contactY, "#f8f3eb", 18);
  }
  if (imploderCount || projectile.pullImpact) {
    const pullDir = Math.sign(projectile.vx || attacker.facing) || attacker.facing;
    defender.vx = -pullDir * (90 + projectile.impactChambers * 24);
    defender.x = clamp(defender.x - pullDir * (18 + projectile.impactChambers * 8), stageBounds(match.stage).left, stageBounds(match.stage).right);
    defender.hitstun = Math.max(defender.hitstun, 0.18);
    addSpark(match, contactX, contactY, "#d9cbff", 14);
  }
  if (portalCount) {
    const shiftDir = Math.sign(projectile.vx || attacker.facing) || attacker.facing;
    defender.x = clamp(defender.x + shiftDir * (54 + projectile.impactChambers * 16), stageBounds(match.stage).left, stageBounds(match.stage).right);
    spawnZone(match, "portal", contactX, contactY, 34, 0.28, "rgba(140,118,255,0.34)", 0);
    addSpark(match, contactX, contactY, "#bcaeff", 14);
  }
}

function resolveProjectileHit(projectile, attacker, defender, match) {
  if (!defender.alive || defender.invulnerable > 0) {
    return true;
  }

  const attackerStats = statsForTeam(match, attacker.team);
  const defenderStats = statsForTeam(match, defender.team);
  const contactX = projectile.x;
  const contactY = projectile.y;

  if (defender.blocking && defender.onGround && onFrontSide(defender, attacker)) {
    if (attemptParry(defender, attacker, match, contactX, contactY)) {
      return true;
    }

    defender.stamina = clamp(defender.stamina - (attacker.profile.blockDrain + projectile.blockBreak), 0, defender.maxStamina);
    defender.hitstun = Math.max(defender.hitstun, 0.06);
    defender.vx += Math.sign(projectile.vx || attacker.facing) * (40 + projectile.blockBreak * 3);
    defenderStats.blocks += 1;
    addSpark(match, contactX, contactY, "#ffffff", 8);
    playSoundEffect("block");

    if (defender.stamina <= 0) {
      const guardBreakDamage = clamp(Math.round(projectile.damage * 0.44), 6, 18);
      defender.blocking = false;
      defender.health = clamp(defender.health - guardBreakDamage, 0, defender.maxHealth);
      defender.hitstun = Math.max(defender.hitstun, 0.22);
      defender.vx = Math.sign(projectile.vx || attacker.facing) * (110 + projectile.blockBreak * 6);
      defender.attackFlash = 0.16;
      defender.alive = defender.health > 0;
      applyStun(defender, 0.16);
      triggerImpact(match, { shake: 8, flash: 0.12, hitstop: 0.05 });
      attackerStats.guardBreaks += 1;
      attackerStats.hits += 1;
      attackerStats.damage += guardBreakDamage;
      pushFightEvent(match, "Shot Break", `${attacker.name} broke ${defender.name}'s guard with ${attacker.weapon.name}.`, "impact");
      setMatchSummary(`${attacker.name}'s shot broke ${defender.name}'s guard.`);
    } else {
      triggerImpact(match, { shake: 4, flash: 0.05, hitstop: 0.02 });
      pushFightEvent(match, "Shot Block", `${defender.name} blocked ${attacker.name}'s ${attacker.weapon.name} shot.`, "control");
      setMatchSummary(`${defender.name} blocked the shot.`);
    }
    return true;
  }

  let damage = projectile.damage;
  damage += projectileImpactCount(projectile, "shock") * 2;
  damage += projectileImpactCount(projectile, "poison");
  damage += projectileImpactCount(projectile, "imploder");
  damage += projectile.ruptureCount || 0;

  defender.health = clamp(defender.health - damage, 0, defender.maxHealth);
  defender.hitstun = Math.max(defender.hitstun, 0.12 + damage * 0.004);
  defender.vx = Math.sign(projectile.vx || attacker.facing) * (projectile.knockback + projectile.blockBreak * 3);
  defender.attackFlash = 0.14;
  defender.blocking = false;
  defender.crouching = false;
  defender.alive = defender.health > 0;
  attackerStats.hits += 1;
  attackerStats.damage += damage;

  if (projectile.shockCount || projectileHasImpact(projectile, "shock")) {
    applyStun(defender, 0.18 + projectile.impactChambers * 0.02 + projectileImpactCount(projectile, "shock") * 0.03 + (projectile.stormTrail ? 0.04 : 0));
    attackerStats.stuns += 1;
  }
  if (attacker.weapon.specialType === "arc-rail") {
    applyStun(defender, 0.16 + projectile.impactChambers * 0.02);
    defender.vx += Math.sign(projectile.vx || attacker.facing) * 42;
    attackerStats.stuns += 1;
  }
  if (projectile.poisonCount || projectileHasImpact(projectile, "poison")) {
    defender.poisonTimer = Math.max(defender.poisonTimer, 2.8 + projectile.impactChambers * 0.4 + projectileImpactCount(projectile, "poison") * 0.5);
    defender.poisonTickTimer = Math.min(defender.poisonTickTimer || 0.45, 0.45);
  }
  if (projectile.slowCount || projectileHasImpact(projectile, "frost") || projectileHasImpact(projectile, "shiver") || projectile.blizzardTrail) {
    defender.slowTimer = Math.max(
      defender.slowTimer,
      0.2 + projectile.impactChambers * 0.03 + (projectile.slowCount || 0) * 0.05 + (projectile.blizzardTrail ? 0.04 : 0)
    );
  }
  if (projectileHasImpact(projectile, "concussion")) {
    defender.vx += Math.sign(projectile.vx || attacker.facing) * (28 + projectileImpactCount(projectile, "concussion") * 14);
    defender.hitstun = Math.max(defender.hitstun, 0.18);
    applyStun(defender, 0.08 + projectileImpactCount(projectile, "concussion") * 0.03);
    attackerStats.stuns += 1;
  }
  if (attacker.weapon.specialType === "harpoon-shot") {
    const pullDir = Math.sign(projectile.vx || attacker.facing) || attacker.facing;
    defender.vx = -pullDir * (150 + projectile.impactChambers * 18);
    defender.x = clamp(defender.x - pullDir * (26 + projectile.impactChambers * 10), stageBounds(match.stage).left, stageBounds(match.stage).right);
    defender.hitstun = Math.max(defender.hitstun, 0.2);
  }
  if (attacker.weapon.specialType === "phase-rail") {
    const shiftDir = Math.sign(projectile.vx || attacker.facing) || attacker.facing;
    defender.x = clamp(defender.x + shiftDir * (26 + projectile.impactChambers * 8), stageBounds(match.stage).left, stageBounds(match.stage).right);
    defender.hitstun = Math.max(defender.hitstun, 0.18);
  }
  if (attacker.weapon.specialType === "quake-shell") {
    defender.slowTimer = Math.max(defender.slowTimer, 0.24 + projectile.impactChambers * 0.03);
    defender.vx += Math.sign(projectile.vx || attacker.facing) * 28;
  }
  if (attacker.weapon.specialType === "stormbow-shot") {
    applyStun(defender, 0.12 + projectile.impactChambers * 0.02);
  }
  if (projectile.delayedImpact || projectile.ruptureCount > 0) {
    const delayedScale =
      projectile.tipType === "spiked"
        ? 0.26
        : projectile.tipType === "barbed"
          ? 0.22
          : 0.18;
    defender.stuckPayloads.push({
      timer:
        projectile.tipType === "spiked"
          ? 0.24
          : projectile.tipType === "barbed"
            ? 0.2
            : 0.18,
      damage: clamp(Math.round(projectile.damage * delayedScale + (projectile.ruptureCount || 0)), 3, 10),
      color: projectile.color,
      knockback: 28 + projectile.impactChambers * 10 + (projectile.ruptureCount || 0) * 8
    });
  }

  applyProjectileSplash(attacker, defender, projectile, match, contactX, contactY);
  addSpark(match, contactX, contactY, projectile.color, projectile.ammoType === "rail" ? 14 : 11);
  triggerImpact(match, { shake: 6 + projectile.impactChambers, flash: 0.09, hitstop: 0.04 });
  playSoundEffect("hit");
  setMatchSummary(`${attacker.name} landed a ${projectile.impactLabel.toLowerCase()} ${attacker.weapon.name} shot for ${damage}.`);
  pushFightEvent(match, "Shot Hit", `${attacker.name} landed ${damage} with ${projectile.impactLabel.toLowerCase()} ${attacker.weapon.name} ammo.`, "impact");

  if (projectile.pierce > 0) {
    projectile.pierce -= 1;
    projectile.damage = Math.max(4, Math.round(projectile.damage * 0.72));
    projectile.x += Math.sign(projectile.vx || attacker.facing) * 12;
    return false;
  }

  return true;
}

function updateZones(match, dt) {
  match.zones = match.zones.filter((zone) => {
    zone.life -= dt;
    if (zone.type === "blizzard") {
      match.fighters.forEach((fighter) => {
        const targetPoint = projectileTargetPoint(fighter);
        if (Math.hypot(targetPoint.x - zone.x, targetPoint.y - zone.y) <= zone.radius) {
          fighter.slowTimer = Math.max(fighter.slowTimer, zone.power || 0.22);
        }
      });
    }
    return zone.life > 0;
  });
}

function updateProjectiles(match, dt) {
  updateZones(match, dt);
  match.projectiles = match.projectiles.filter((projectile) => {
    const attacker = match.fighters.find((fighter) => fighter.team === projectile.ownerTeam);
    const defender = match.fighters.find((fighter) => fighter.team !== projectile.ownerTeam);
    if (!attacker || !defender) {
      return false;
    }

    projectile.age += dt;
    projectile.life -= dt;
    projectile.prevX = projectile.x;
    projectile.prevY = projectile.y;

    if (projectile.homingStrength > 0 && defender.alive) {
      const targetPoint = projectileTargetPoint(defender);
      const targetDx = targetPoint.x - projectile.x;
      const targetDy = targetPoint.y - projectile.y;
      const targetLength = Math.max(1, Math.hypot(targetDx, targetDy));
      const currentSpeed = Math.max(1, Math.hypot(projectile.vx, projectile.vy));
      const steer = clamp(dt * (2.4 + projectile.homingStrength * 1.8), 0, 0.35);
      projectile.vx = lerp(projectile.vx, (targetDx / targetLength) * currentSpeed * 1.08, steer);
      projectile.vy = lerp(projectile.vy, (targetDy / targetLength) * currentSpeed * 1.08, steer);
    }

    if (
      projectile.redirectShot &&
      (projectile.redirectCharges || 1) > (projectile.redirectedCount || 0) &&
      projectile.age >= 0.14 * ((projectile.redirectedCount || 0) + 1) &&
      defender.alive
    ) {
      const targetPoint = projectileTargetPoint(defender);
      const targetDx = targetPoint.x - projectile.x;
      const targetDy = targetPoint.y - projectile.y;
      const targetLength = Math.max(1, Math.hypot(targetDx, targetDy));
      const currentSpeed = Math.max(1, Math.hypot(projectile.vx, projectile.vy)) * 1.12;
      projectile.vx = (targetDx / targetLength) * currentSpeed;
      projectile.vy = (targetDy / targetLength) * currentSpeed;
      projectile.redirectedCount = (projectile.redirectedCount || 0) + 1;
      addSpark(match, projectile.x, projectile.y, "#ffffff", 6);
    }

    if (projectile.spiralFlight) {
      projectile.vy += Math.sin(projectile.age * 24 + projectile.waveSeed) * (180 + (projectile.spiralCount || 1) * 26) * dt;
    }

    projectile.vy += projectile.gravity * dt;
    projectile.x += projectile.vx * dt;
    projectile.y += projectile.vy * dt;
    projectile.trailTimer += dt;

    if (projectile.blizzardTrail && projectile.trailTimer >= 0.12) {
      projectile.trailTimer = 0;
      spawnZone(match, "blizzard", projectile.x, projectile.y, 34, 0.34, "rgba(202,236,255,0.34)", 0.18);
    } else if (projectile.stormTrail && projectile.trailTimer >= 0.1) {
      projectile.trailTimer = 0;
      addSpark(match, projectile.x, projectile.y, "#c8e8ff", 4);
    } else if (projectile.emberTrail && projectile.trailTimer >= 0.08) {
      projectile.trailTimer = 0;
      addSpark(match, projectile.x, projectile.y, "#ffb76a", 3);
    }

    const defenderBox = expandHitbox(fighterHitbox(defender), 6);
    if (lineIntersectsHitbox(projectile.prevX, projectile.prevY, projectile.x, projectile.y, defenderBox)) {
      return !resolveProjectileHit(projectile, attacker, defender, match);
    }

    const outOfBounds =
      projectile.x < stageBounds(match.stage).left - 40 ||
      projectile.x > stageBounds(match.stage).right + 40 ||
      projectile.y < -24 ||
      projectile.y > GROUND_Y + 42;
    if (outOfBounds || projectile.life <= 0) {
      if (projectileHasImpact(projectile, "explosive") && projectile.y >= GROUND_Y - 8) {
        addSpark(match, projectile.x, GROUND_Y, "#ffd37a", 10);
        spawnZone(match, "blast", projectile.x, GROUND_Y - 10, 42, 0.18, "rgba(255,187,102,0.28)", 0);
      }
      return false;
    }

    return true;
  });
  resolveProjectileCounterplay(match);
}

function shotPatternForWeapon(weapon) {
  const count = weapon.burstCount || 1;
  if (count <= 1) {
    return [{ angleOffset: 0, damageScale: 1, speedScale: 1, blockScale: 1 }];
  }
  const spread = weapon.burstSpread || 0.02;
  if (weapon.frameId === "flakcannon") {
    return [-2, -1, 0, 1, 2].map((index) => ({
      angleOffset: index * spread,
      damageScale: weapon.burstDamageScale || 0.34,
      speedScale: 0.94 + Math.abs(index) * 0.02,
      blockScale: 0.9
    }));
  }
  if (weapon.frameId === "sawedoff") {
    return [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((index) => ({
      angleOffset: index * spread,
      damageScale: weapon.burstDamageScale || 0.26,
      speedScale: 0.88 + Math.abs(index) * 0.03,
      blockScale: 0.82
    }));
  }
  if (weapon.frameId === "stormbow") {
    return [-1, 0, 1].map((index) => ({
      angleOffset: index * spread,
      damageScale: weapon.burstDamageScale || 0.48,
      speedScale: index === 0 ? 1 : 0.94,
      blockScale: 0.96
    }));
  }
  if (weapon.frameId === "prismrail") {
    return [-0.5, 0.5].map((index) => ({
      angleOffset: index * spread,
      damageScale: weapon.burstDamageScale || 0.68,
      speedScale: 1.04,
      blockScale: 1
    }));
  }
  return Array.from({ length: count }, (_, index) => ({
    angleOffset: (index - (count - 1) / 2) * spread,
    damageScale: weapon.burstDamageScale || 1,
    speedScale: 1,
    blockScale: 1
  }));
}

function startAttack(fighter, opponent = null, match = state.match) {
  const staminaCost = isRangedWeapon(fighter.weapon) ? fighter.profile.shotDrain || 8 : 8;
  if (
    !fighter.alive ||
    fighter.hitstun > 0 ||
    fighter.stunTimer > 0 ||
    fighter.attack ||
    fighter.blocking ||
    fighter.dodgeTimer > 0 ||
    fighter.slideTimer > 0 ||
    fighter.stamina < staminaCost
  ) {
    return false;
  }

  if (isRangedWeapon(fighter.weapon)) {
    if (fighter.reloadTimer > 0) {
      return false;
    }
    if (fighter.ammo <= 0) {
      return startReload(fighter, match, true);
    }

    fighter.attack = {
      timer: 0,
      connected: true,
      style: "shot"
    };
    fighter.attackFlash = 0.18;
    fighter.muzzleFlash = fighter.weapon.frameId === "railgun" || fighter.weapon.frameId === "coillance" ? 0.12 : 0.08;
    fighter.stamina = clamp(fighter.stamina - staminaCost, 0, fighter.maxStamina);
    fighter.ammo = Math.max(0, fighter.ammo - 1);
    const ammoRound =
      fighter.loadedRounds[fighter.roundIndex] ||
      fighter.weapon.ammoCaseRounds?.[fighter.roundIndex] ||
      fighter.weapon.ammoPrototype ||
      buildAmmoRecipeFromForge(
        {
          frame: fighter.weapon.frameId,
          impactChambers: fighter.weapon.impactChambers || 1,
          impactMount: fighter.weapon.impactMount || defaultImpactMountForFrame(frameCatalog[fighter.weapon.frameId] || frameCatalog.longbow),
          chamberImpacts:
            fighter.weapon.chamberImpacts ||
            [fighter.weapon.impactType || defaultImpactTypeForFrame(frameCatalog[fighter.weapon.frameId] || frameCatalog.longbow)],
          launchType: fighter.weapon.launchType || defaultLaunchTypeForFrame(frameCatalog[fighter.weapon.frameId] || frameCatalog.longbow),
          midAirAddons: fighter.weapon.midAirAddons || [],
          tipType: fighter.weapon.tipType || defaultTipTypeForFrame(frameCatalog[fighter.weapon.frameId] || frameCatalog.longbow),
          forgeQuality: fighter.weapon.forgeQuality || 0.5
        },
        frameCatalog[fighter.weapon.frameId] || frameCatalog.longbow
      );
    fighter.roundIndex += 1;
    fighter.reloadQueued = fighter.ammo <= 0;
    fighter.vx -= fighter.facing * clamp(fighter.weapon.weight * 2.4, 8, 44);
    const target = opponent || match?.fighters?.find((candidate) => candidate.team !== fighter.team) || null;
    shotPatternForWeapon(fighter.weapon).forEach((shot) => {
      spawnProjectile(fighter, target, match, { ...shot, ammoRound });
    });
    addSpark(match, fighter.x + fighter.facing * 22, fighter.y - currentFighterHeight(fighter) * 0.56, fighter.weapon.projectileGlow || fighter.weapon.color, fighter.weapon.burstCount > 1 ? 8 : 5);
    playSoundEffect(fighter.weapon.ammoType === "rail" ? "guard-break" : "attack");
    return true;
  }

  const comboSegments = comboSegmentsForWeapon(fighter.weapon);
  fighter.attack = comboSegments
    ? {
        timer: 0,
        connected: false,
        style: "combo",
        comboResolved: comboSegments.map(() => false),
        comboSegments
      }
    : {
        timer: 0,
        connected: false,
        style: fighterUsesMouseJab(fighter) ? "jab" : "swing"
      };
  fighter.attackFlash = 0.18;
  fighter.stamina = clamp(fighter.stamina - 8, 0, fighter.maxStamina);
  fighter.vx += fighter.facing * fighter.profile.lunge * (fighter.attack.style === "jab" ? 0.2 : fighter.attack.style === "combo" ? 0.14 : 0.45);
  if (fighter.weapon.specialType === "shockwave-slam" && !fighter.onGround) {
    fighter.slamReady = true;
  }
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
  if (defender.styleBonuses?.styleId === "tempest" && defender.styleBonuses.abilityDefense) {
    defender.health = clamp(defender.health + 3, 0, defender.maxHealth);
    defender.stamina = clamp(defender.stamina + 8, 0, defender.maxStamina);
  }
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

    const guardDrainMultiplier =
      (attacker.styleBonuses?.styleId === "bastion" && attacker.styleBonuses.abilityStrength ? 1.24 : 1) *
      (attacker.weapon.specialType === "guard-rip" ? 1.3 : 1);
    const blockDrainReduction =
      defender.styleBonuses?.styleId === "bastion" && defender.styleBonuses.abilityDefense ? 0.7 : 1;
    defender.stamina = clamp(
      defender.stamina - attacker.profile.blockDrain * guardDrainMultiplier * blockDrainReduction,
      0,
      defender.maxStamina
    );
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
        (attacker.weapon.kind === "short" && !onFrontSide(defender, attacker) ? attacker.weapon.backstabBonus : 1) *
        (attacker.styleBonuses?.styleId === "phantom" && attacker.styleBonuses.abilityStrength && !onFrontSide(defender, attacker) ? 1.14 : 1)
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

  if (attacker.styleBonuses?.styleId === "tempest" && attacker.styleBonuses.abilityStrength) {
    attacker.comboPressure += 1;
    if (attacker.comboPressure >= 3) {
      defender.health = clamp(defender.health - 4, 0, defender.maxHealth);
      defender.vx += attacker.facing * 48;
      attacker.comboPressure = 0;
    }
  } else if (attacker.comboPressure) {
    attacker.comboPressure = 0;
  }

  if (quakeHeavy) {
    defender.vx = attacker.facing * attacker.profile.knockback * 1.16;
    triggerImpact(match, { shake: 13, flash: 0.16, hitstop: 0.07 });
  }

  if (attacker.weapon.specialType === "reaper-hook") {
    defender.vx = attacker.facing * -190;
    defender.x = clamp(defender.x - attacker.facing * 18, stageBounds(match.stage).left, stageBounds(match.stage).right);
    defender.hitstun = Math.max(defender.hitstun, 0.22);
    setMatchSummary(`${attacker.name} hooked ${defender.name} back in with ${attacker.weapon.name}.`);
  } else if (attacker.weapon.specialType === "guard-pin") {
    defender.hitstun = Math.max(defender.hitstun, 0.2);
  } else if (attacker.weapon.specialType === "sky-launch" && onFrontSide(defender, attacker)) {
    defender.vy = Math.min(defender.vy, -240);
    defender.hitstun = Math.max(defender.hitstun, 0.24);
    applyStun(defender, 0.12);
    attackerStats.stuns += 1;
  } else if (attacker.weapon.specialType === "vault-smash") {
    defender.vy = Math.min(defender.vy, -210);
    defender.hitstun = Math.max(defender.hitstun, 0.22);
    applyStun(defender, 0.12);
    attackerStats.stuns += 1;
  } else if (attacker.weapon.specialType === "cleave-wave" || attacker.weapon.specialType === "crush-burst") {
    defender.vx = attacker.facing * attacker.profile.knockback * 1.22;
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

function attemptComboAttackHit(attacker, defender, match, segment, index) {
  if (!attacker.attack || attacker.attack.comboResolved[index] || !defender.alive || defender.invulnerable > 0) {
    return;
  }
  attacker.attack.comboResolved[index] = true;

  const contactX = attacker.x + attacker.facing * (18 + index * 3);
  const contactY = attacker.y - currentFighterHeight(attacker) * (index === 2 ? 0.76 : 0.58);
  const attackBox = {
    left: attacker.x + (attacker.facing === 1 ? 6 : -42),
    right: attacker.x + (attacker.facing === 1 ? 42 : -6),
    top: attacker.y - currentFighterHeight(attacker) + 20,
    bottom: attacker.y - 8
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

  const attackerStats = statsForTeam(match, attacker.team);
  const defenderStats = statsForTeam(match, defender.team);
  if (defender.blocking && defender.onGround && onFrontSide(defender, attacker)) {
    if (attemptParry(defender, attacker, match, contactX, contactY)) {
      attacker.attack = null;
      return;
    }
    defender.stamina = clamp(defender.stamina - Math.round(attacker.profile.blockDrain * 0.62), 0, defender.maxStamina);
    defender.hitstun = Math.max(defender.hitstun, 0.06);
    defenderStats.blocks += 1;
    addSpark(match, contactX, contactY, "#ffffff", 6);
    triggerImpact(match, { shake: 3, flash: 0.05, hitstop: 0.02 });
    return;
  }

  const finalHit = index === attacker.attack.comboSegments.length - 1;
  const damage = clamp(Math.round(attacker.profile.damage * segment.damageScale), 4, 18);
  defender.health = clamp(defender.health - damage, 0, defender.maxHealth);
  defender.vx = attacker.facing * attacker.profile.knockback * segment.knockbackScale;
  defender.hitstun = Math.max(defender.hitstun, finalHit ? 0.24 : 0.1);
  defender.attackFlash = 0.14;
  defender.alive = defender.health > 0;
  if (finalHit) {
    applyStun(defender, 0.18);
    attackerStats.stuns += 1;
  }
  attackerStats.hits += 1;
  attackerStats.damage += damage;
  addSpark(match, contactX, contactY, attacker.weapon.color, finalHit ? 14 : 8);
  triggerImpact(match, { shake: finalHit ? 9 : 4, flash: finalHit ? 0.12 : 0.06, hitstop: finalHit ? 0.05 : 0.02 });
  playSoundEffect("hit");
  setMatchSummary(`${attacker.name} landed ${segment.label} for ${damage}.`);
}

function attemptMouseSwingHit(attacker, defender, match, dt) {
  if (
    attacker.control !== "p1" ||
    isRangedWeapon(attacker.weapon) ||
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
      : attacker.weapon.specialType === "dash-spin" || attacker.weapon.specialType === "axe-throw" || attacker.weapon.specialType === "crescent-sweep"
        ? 26
        : 18
  );
  const defenderBox = fighterHitbox(defender);
  const axeThrow = attacker.weapon.specialType === "axe-throw";
  const throwRange = axeThrow ? 170 : 0;
  const widenedDefenderBox = axeThrow ? expandHitbox(defenderBox, 10) : defenderBox;
  const overlaps =
    attackerBox.left < defenderBox.right &&
    attackerBox.right > defenderBox.left &&
    attackerBox.top < defenderBox.bottom &&
    attackerBox.bottom > defenderBox.top;
  const rangedThrowConnect =
    axeThrow &&
    lineIntersectsHitbox(
      attacker.x,
      attacker.y - currentFighterHeight(attacker) * 0.62,
      attacker.x + attacker.facing * throwRange,
      attacker.y - currentFighterHeight(attacker) * 0.6,
      widenedDefenderBox
    );

  if (!overlaps && !rangedThrowConnect) {
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
      attacker.weapon.specialType === "cross-cut"
        ? 0.9
        : attacker.weapon.specialType === "guard-rip"
          ? 1
        : attacker.weapon.specialType === "tonfa-rush" || attacker.weapon.specialType === "fortress-break"
          ? 0.92
        : 0.7;
    defender.stamina = clamp(defender.stamina - Math.round(attacker.profile.blockDrain * guardDrainScale), 0, defender.maxStamina);
    defender.hitstun = Math.max(defender.hitstun, 0.06);
    defender.vx += attacker.facing * 52;
    attacker.slideHitCooldown =
      attacker.weapon.specialType === "triple-rush" || attacker.weapon.specialType === "rake-frenzy"
        ? 0.045
        : attacker.weapon.specialType === "twin-dash"
          ? 0.06
          : attacker.weapon.kind === "short"
            ? 0.08
            : 0.12;
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
    (attacker.weapon.specialType === "cross-cut" ? 1 : 0);
  const damage = clamp(
    Math.round(
      baseDamage *
      (attacker.weapon.kind === "short" && !onFrontSide(defender, attacker) ? attacker.weapon.backstabBonus : 1) *
      (attacker.weapon.specialType === "veil-rush" && !onFrontSide(defender, attacker) ? 1.16 : 1) *
      (attacker.weapon.specialType === "storm-rush" ? 1.08 : 1)
    ),
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
  attacker.slideHitCooldown =
    attacker.weapon.specialType === "triple-rush" || attacker.weapon.specialType === "rake-frenzy"
      ? 0.045
      : attacker.weapon.specialType === "twin-dash"
        ? 0.06
        : attacker.weapon.kind === "short"
          ? 0.07
          : 0.18;

  if (attacker.weapon.kind === "short" || attacker.weapon.frameId === "capesh") {
    applyStun(defender, attacker.weapon.kind === "short" ? 0.08 : 0.12);
    attackerStats.stuns += 1;
  } else if (attacker.weapon.specialType === "tonfa-rush") {
    defender.hitstun = Math.max(defender.hitstun, 0.22);
    defender.stamina = clamp(defender.stamina - 8, 0, defender.maxStamina);
  } else if (attacker.weapon.specialType === "axe-throw") {
    defender.vx = attacker.facing * 186;
    defender.hitstun = Math.max(defender.hitstun, 0.2);
  } else if (attacker.weapon.specialType === "reaper-hook") {
    defender.vx = attacker.facing * -130;
    defender.hitstun = Math.max(defender.hitstun, 0.18);
  } else if (attacker.weapon.specialType === "vault-smash") {
    defender.vy = Math.min(defender.vy, -220);
    defender.hitstun = Math.max(defender.hitstun, 0.22);
    applyStun(defender, 0.14);
    attackerStats.stuns += 1;
  } else if (attacker.weapon.specialType === "fortress-break") {
    defender.vx = attacker.facing * 210;
    defender.hitstun = Math.max(defender.hitstun, 0.24);
    defender.stamina = clamp(defender.stamina - 12, 0, defender.maxStamina);
    applyStun(defender, 0.12);
    attackerStats.stuns += 1;
  }

  attackerStats.hits += 1;
  attackerStats.damage += damage;
  addSpark(match, contactX, contactY, attacker.weapon.color, attacker.weapon.kind === "short" ? 14 : 12);
  triggerImpact(match, { shake: attacker.weapon.kind === "short" ? 7 : 9, flash: 0.1, hitstop: 0.04 });
  playSoundEffect("hit");
  setMatchSummary(
    `${attacker.name} landed a ${
      attacker.weapon.specialType === "axe-throw"
        ? "throw axe"
        : attacker.weapon.specialType === "vault-smash"
          ? "vault smash"
          : attacker.weapon.specialType === "twin-dash"
            ? "twin dash"
            : attacker.weapon.specialType === "rake-frenzy"
              ? "rake rush"
              : attacker.weapon.kind === "short"
                ? "spin"
                : "dash"
    } slash for ${damage}.`
  );
  pushFightEvent(
    match,
    attacker.weapon.specialType === "axe-throw"
      ? "Axe Throw"
      : attacker.weapon.specialType === "vault-smash"
        ? "Vault Smash"
        : attacker.weapon.specialType === "twin-dash"
          ? "Twin Dash"
          : attacker.weapon.specialType === "rake-frenzy"
            ? "Rake Rush"
            : attacker.weapon.kind === "short"
              ? "Spin Slash"
              : "Dash Slash",
    `${attacker.name} cut ${defender.name} for ${damage} with ${attacker.weapon.name}.`,
    "impact"
  );
}

function updateAttackState(fighter, opponent, match, dt) {
  if (!fighter.attack) {
    return;
  }

  fighter.attack.timer += dt;
  if (fighter.attack.style === "shot") {
    if (fighter.attack.timer >= fighter.profile.recover * 0.78) {
      fighter.attack = null;
      if (fighter.reloadQueued && fighter.reloadTimer <= 0 && fighter.ammo <= 0) {
        startReload(fighter, match);
      }
    }
    return;
  }
  if (fighter.attack.style === "combo" && fighter.attack.comboSegments) {
    const lastSegment = fighter.attack.comboSegments[fighter.attack.comboSegments.length - 1];
    fighter.attack.comboSegments.forEach((segment, index) => {
      if (
        !fighter.attack.comboResolved[index] &&
        fighter.attack.timer >= segment.start &&
        fighter.attack.timer <= segment.end
      ) {
        attemptComboAttackHit(fighter, opponent, match, segment, index);
      }
    });
    if (fighter.attack.timer >= lastSegment.end + fighter.profile.recover * 0.75) {
      fighter.attack = null;
    }
    return;
  }
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
  if (input.reloadPressed) {
    startReload(fighter, match, true);
  }
  if (input.attackPressed || (isRangedWeapon(fighter.weapon) && input.attack)) {
    startAttack(fighter, match.fighters.find((candidate) => candidate.team !== fighter.team), match);
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
  const rangedFighter = isRangedWeapon(fighter.weapon);
  const preferredGap = rangedFighter ? clamp((fighter.weapon.projectileRange || 420) * 0.45, 180, 320) : fighter.profile.reach + 42;

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
    } else if (rangedFighter && fighter.reloadTimer > 0) {
      fighter.aiIntent.left = gap > 0;
      fighter.aiIntent.right = gap < 0;
      if (absGap < 120 && Math.random() < 0.44) {
        performBackstep(fighter, match);
      }
    } else if (rangedFighter && absGap < 112) {
      fighter.aiIntent.left = gap > 0;
      fighter.aiIntent.right = gap < 0;
      if (Math.random() < 0.42) {
        performBackstep(fighter, match);
      }
    } else if (absGap > preferredGap) {
      fighter.aiIntent.right = gap > 0;
      fighter.aiIntent.left = gap < 0;
    } else if (!rangedFighter && absGap < fighter.profile.reach * 0.7 && Math.random() < 0.26) {
      performBackstep(fighter, match);
    } else if (Math.random() < (rangedFighter ? 0.68 : 0.55)) {
      startAttack(fighter, opponent, match);
    } else if (Math.random() < (rangedFighter ? 0.16 : 0.22)) {
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
  const wasOnGround = fighter.onGround;
  const wasReloading = fighter.reloadTimer > 0;
  fighter.hitstun = Math.max(0, fighter.hitstun - dt);
  fighter.stunTimer = Math.max(0, fighter.stunTimer - dt);
  fighter.invulnerable = Math.max(0, fighter.invulnerable - dt);
  fighter.attackFlash = Math.max(0, fighter.attackFlash - dt);
  fighter.muzzleFlash = Math.max(0, fighter.muzzleFlash - dt);
  fighter.parryWindow = Math.max(0, fighter.parryWindow - dt);
  fighter.parryFlash = Math.max(0, fighter.parryFlash - dt);
  fighter.dodgeCooldown = Math.max(0, fighter.dodgeCooldown - dt);
  fighter.slideCooldown = Math.max(0, fighter.slideCooldown - dt);
  fighter.jumpCooldown = Math.max(0, fighter.jumpCooldown - dt);
  fighter.manualSwingCooldown = Math.max(0, fighter.manualSwingCooldown - dt);
  fighter.reloadTimer = Math.max(0, fighter.reloadTimer - dt);
  fighter.slowTimer = Math.max(0, fighter.slowTimer - dt);
  fighter.poisonTimer = Math.max(0, fighter.poisonTimer - dt);
  fighter.poisonTickTimer = Math.max(0, fighter.poisonTickTimer - dt);
  fighter.dodgeTimer = Math.max(0, fighter.dodgeTimer - dt);
  fighter.slideTimer = Math.max(0, fighter.slideTimer - dt);
  fighter.dashSpeed = Math.max(0, fighter.dashSpeed - dt * 1180);
  fighter.slideHitCooldown = Math.max(0, fighter.slideHitCooldown - dt);

  if (wasReloading && fighter.reloadTimer <= 0 && isRangedWeapon(fighter.weapon)) {
    fighter.loadedRounds = ammoRoundListForWeapon(fighter.weapon);
    fighter.maxAmmo = fighter.loadedRounds.length;
    fighter.ammo = fighter.maxAmmo;
    fighter.roundIndex = 0;
    addSpark(match, fighter.x + fighter.facing * 8, fighter.y - currentFighterHeight(fighter) * 0.54, "rgba(255,255,255,0.85)", 8);
    if (fighter.team === PLAYER_TEAM) {
      setMatchSummary(`${fighter.weapon.name} reloaded.`);
      pushFightEvent(match, "Reload Ready", `${fighter.name} reloaded ${fighter.weapon.name}.`, "control");
    }
  }

  if (fighter.poisonTimer > 0 && fighter.poisonTickTimer <= 0) {
    fighter.poisonTickTimer = 0.42;
    fighter.health = clamp(fighter.health - 1, 0, fighter.maxHealth);
    fighter.attackFlash = 0.08;
    fighter.alive = fighter.health > 0;
    addSpark(match, fighter.x + randomRange(-10, 10), fighter.y - currentFighterHeight(fighter) * 0.58, "#9ef58c", 4);
  }

  if (fighter.stuckPayloads.length) {
    fighter.stuckPayloads = fighter.stuckPayloads.filter((payload) => {
      payload.timer -= dt;
      if (payload.timer > 0) {
        return true;
      }
      fighter.health = clamp(fighter.health - payload.damage, 0, fighter.maxHealth);
      fighter.vx += fighter.facing * -payload.knockback;
      fighter.hitstun = Math.max(fighter.hitstun, 0.1);
      fighter.attackFlash = 0.12;
      fighter.alive = fighter.health > 0;
      addSpark(match, fighter.x, fighter.y - currentFighterHeight(fighter) * 0.6, payload.color, 10);
      triggerImpact(match, { shake: 4, flash: 0.05, hitstop: 0.02 });
      return false;
    });
  }

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
    const slowScale = fighter.slowTimer > 0 ? 0.72 : 1;
    const targetSpeed = fighter.moveIntent * fighter.walkSpeed * controlScale * crouchScale * airScale * slowScale;
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

  if (!wasOnGround && fighter.onGround && fighter.slamReady && fighter.weapon.specialType === "shockwave-slam") {
    fighter.slamReady = false;
    emitGroundShockwave(fighter, opponent, match);
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
  if (fighter.reloadQueued && !fighter.attack && fighter.reloadTimer <= 0 && fighter.ammo <= 0) {
    startReload(fighter, match);
  }
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
  match.projectiles = [];
  match.zones = [];
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
    projectiles: [],
    zones: [],
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

  if (match.phase === "fight" || match.projectiles.length || match.zones.length) {
    updateProjectiles(match, dt);
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
    resolveProjectileCounterplay(match);
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

  if (stageState.id === "stormspire") {
    [offsetX + 88, offsetX + STAGE_WIDTH - 120].forEach((x) => {
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fillRect(x, STAGE_TOP + 96, 26, 214);
      ctx.fillStyle = `${config.accent}88`;
      ctx.fillRect(x - 8, STAGE_TOP + 118, 42, 10);
      ctx.fillRect(x - 6, STAGE_TOP + 254, 38, 8);
      ctx.strokeStyle = `${config.crowd}44`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 12, STAGE_TOP + 110);
      ctx.lineTo(x + 84, STAGE_TOP + 86);
      ctx.lineTo(x + 156, STAGE_TOP + 106);
      ctx.stroke();
    });
  } else if (stageState.id === "gravevault") {
    for (let i = 0; i < 3; i += 1) {
      const archX = offsetX + 136 + i * 210;
      ctx.strokeStyle = "rgba(210,255,224,0.08)";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(archX, STAGE_TOP + 216);
      ctx.quadraticCurveTo(archX + 28, STAGE_TOP + 132, archX + 72, STAGE_TOP + 132);
      ctx.quadraticCurveTo(archX + 116, STAGE_TOP + 132, archX + 144, STAGE_TOP + 216);
      ctx.stroke();
      ctx.fillStyle = `${config.accent}22`;
      ctx.beginPath();
      ctx.arc(archX + 72, STAGE_TOP + 170, 20, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (stageState.id === "voidhangar") {
    [offsetX + 120, offsetX + STAGE_WIDTH - 150].forEach((x) => {
      ctx.strokeStyle = "rgba(216,208,255,0.12)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, STAGE_TOP + 46);
      ctx.lineTo(x, STAGE_TOP + 132);
      ctx.stroke();
      ctx.fillStyle = `${config.accent}2a`;
      ctx.fillRect(x - 24, STAGE_TOP + 132, 48, 74);
      ctx.strokeStyle = `${config.crowd}30`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 18, STAGE_TOP + 206);
      ctx.lineTo(x, STAGE_TOP + 232);
      ctx.lineTo(x + 18, STAGE_TOP + 206);
      ctx.stroke();
    });
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
    if (stageState.id === "stormspire") {
      ctx.fillStyle = "rgba(0,0,0,0.34)";
      ctx.fillRect(centerX - 24, floorTop - 8, 48, 18);
      ctx.strokeStyle = `${config.hazard}cc`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX - 16, floorTop - 2);
      ctx.lineTo(centerX - 8, floorTop - 26 - pulse * 10);
      ctx.lineTo(centerX + 2, floorTop - 12);
      ctx.lineTo(centerX + 10, floorTop - 36 - pulse * 8);
      ctx.lineTo(centerX + 18, floorTop - 8);
      ctx.stroke();

      const flare = ctx.createRadialGradient(centerX, floorTop - 18, 10, centerX, floorTop - 18, 56);
      flare.addColorStop(0, `${config.hazard}aa`);
      flare.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = flare;
      ctx.beginPath();
      ctx.arc(centerX, floorTop - 18, 56, 0, Math.PI * 2);
      ctx.fill();
    } else if (stageState.id === "gravevault") {
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fillRect(centerX - 26, floorTop - 8, 52, 18);
      ctx.fillStyle = `${config.hazard}bb`;
      ctx.beginPath();
      ctx.arc(centerX, floorTop - 6, 24, Math.PI, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < 4; i += 1) {
        const mistX = centerX - 14 + i * 10;
        const mistHeight = 16 + pulse * 20 + i * 3;
        ctx.beginPath();
        ctx.moveTo(mistX, floorTop - 6);
        ctx.quadraticCurveTo(mistX + 4, floorTop - mistHeight, mistX + 10, floorTop - 10);
        ctx.quadraticCurveTo(mistX + 6, floorTop - mistHeight * 0.7, mistX + 2, floorTop - 4);
        ctx.fill();
      }
    } else if (stageState.id === "voidhangar") {
      ctx.fillStyle = "rgba(0,0,0,0.42)";
      ctx.fillRect(centerX - 30, floorTop - 8, 60, 18);
      const voidFlare = ctx.createRadialGradient(centerX, floorTop - 8, 6, centerX, floorTop - 8, 60);
      voidFlare.addColorStop(0, `${config.hazard}bb`);
      voidFlare.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = voidFlare;
      ctx.beginPath();
      ctx.arc(centerX, floorTop - 8, 60, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `${config.hazard}${pulse > 0.5 ? "aa" : "7a"}`;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(centerX - 18, floorTop - 2);
      ctx.lineTo(centerX - 6, floorTop - 22 - pulse * 8);
      ctx.lineTo(centerX + 4, floorTop - 10);
      ctx.lineTo(centerX + 16, floorTop - 28 - pulse * 10);
      ctx.stroke();
    } else {
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
  } else if (stageId === "stormspire") {
    ctx.strokeStyle = "rgba(150,228,255,0.12)";
    ctx.lineWidth = 1.4;
    for (let i = 0; i < 28; i += 1) {
      const rainX = ((time * 220 + i * 52) % (canvas.width + 120)) - 60;
      const rainY = (i * 18 + time * 46) % canvas.height;
      ctx.beginPath();
      ctx.moveTo(rainX, rainY);
      ctx.lineTo(rainX - 12, rainY + 28);
      ctx.stroke();
    }
    if (Math.sin(time * 1.7) > 0.84) {
      ctx.strokeStyle = "rgba(198,244,255,0.24)";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.5, 62);
      ctx.lineTo(canvas.width * 0.47, 112);
      ctx.lineTo(canvas.width * 0.54, 148);
      ctx.lineTo(canvas.width * 0.49, 194);
      ctx.stroke();
    }
  } else if (stageId === "gravevault") {
    for (let i = 0; i < 18; i += 1) {
      const moteX = 90 + ((i * 81 + time * 18) % (canvas.width - 180));
      const moteY = 150 + Math.sin(time * 0.9 + i * 0.7) * 34 + i * 6;
      ctx.fillStyle = "rgba(144,255,190,0.1)";
      ctx.beginPath();
      ctx.arc(moteX, moteY, 2 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (stageId === "voidhangar") {
    for (let i = 0; i < 16; i += 1) {
      const shardX = 120 + ((i * 64 + time * 22) % (canvas.width - 240));
      const shardY = 92 + (i * 21 + Math.sin(time + i) * 14);
      ctx.fillStyle = "rgba(180,158,255,0.12)";
      ctx.beginPath();
      ctx.moveTo(shardX, shardY);
      ctx.lineTo(shardX + 7, shardY + 14);
      ctx.lineTo(shardX - 5, shardY + 18);
      ctx.closePath();
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

  if (isRangedWeapon(fighter.weapon)) {
    const dx = weaponTipX - weaponRenderBaseX;
    const dy = weaponTipY - weaponRenderBaseY;
    const length = Math.max(1, Math.hypot(dx, dy));
    const ux = dx / length;
    const uy = dy / length;
    const px = -uy;
    const py = ux;
    const stockLength = fighter.weapon.kind === "sidearm" ? 10 : fighter.weapon.kind === "heavy" ? 20 : 16;
    const bodyLength = fighter.weapon.kind === "sidearm" ? 18 : fighter.weapon.kind === "heavy" ? 26 : 22;
    const bodyWidth = fighter.weapon.kind === "sidearm" ? 4.5 : 6;
    const barrelLength = Math.max(10, length - bodyLength + 4);

    const strokeSegment = (sx, sy, ex, ey, shadowWidth, coreWidth, coreColor) => {
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineWidth = shadowWidth;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      ctx.strokeStyle = coreColor;
      ctx.lineWidth = coreWidth;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
    };

    if (["longbow", "crossbow", "stormbow", "ballista"].includes(fighter.weapon.frameId)) {
      const bowArm =
        fighter.weapon.frameId === "crossbow"
          ? 14
          : fighter.weapon.frameId === "ballista"
            ? 16
            : fighter.weapon.frameId === "stormbow"
              ? 22
              : 20;
      strokeSegment(
        weaponRenderBaseX - px * bowArm,
        weaponRenderBaseY - py * bowArm,
        weaponRenderBaseX + px * bowArm,
        weaponRenderBaseY + py * bowArm,
        8,
        5,
        fighter.weapon.color
      );
      ctx.strokeStyle = "rgba(255,255,255,0.68)";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(weaponRenderBaseX - px * bowArm, weaponRenderBaseY - py * bowArm);
      ctx.lineTo(weaponRenderBaseX + px * bowArm, weaponRenderBaseY + py * bowArm);
      ctx.stroke();
    } else {
      strokeSegment(
        weaponRenderBaseX - ux * stockLength,
        weaponRenderBaseY - uy * stockLength,
        weaponRenderBaseX + ux * bodyLength,
        weaponRenderBaseY + uy * bodyLength,
        bodyWidth + 4,
        bodyWidth,
        fighter.weapon.color
      );
      strokeSegment(
        weaponRenderBaseX + ux * (bodyLength - 2),
        weaponRenderBaseY + uy * (bodyLength - 2),
        weaponRenderBaseX + ux * (bodyLength + barrelLength),
        weaponRenderBaseY + uy * (bodyLength + barrelLength),
        5,
        ["railgun", "coillance", "arcrail", "prismrail"].includes(fighter.weapon.frameId) ? 3.8 : 3,
        ["railgun", "coillance", "arcrail", "prismrail"].includes(fighter.weapon.frameId) ? "#d1f7ff" : "#f3ead8"
      );
      strokeSegment(
        weaponRenderBaseX - px * 2,
        weaponRenderBaseY + py * 2,
        weaponRenderBaseX - px * 6 - ux * 3,
        weaponRenderBaseY + py * 6 - uy * 3,
        5,
        3,
        fighter.weapon.color
      );
    }

    ctx.fillStyle = ["railgun", "coillance", "arcrail", "prismrail"].includes(fighter.weapon.frameId) ? "#d1f7ff" : fighter.weapon.color;
    ctx.beginPath();
    ctx.arc(weaponTipX, weaponTipY, ["railgun", "coillance", "arcrail", "prismrail"].includes(fighter.weapon.frameId) ? 4 : 3.4, 0, Math.PI * 2);
    ctx.fill();

    if (fighter.muzzleFlash > 0) {
      const flashAlpha = fighter.muzzleFlash * 7;
      ctx.fillStyle = ["railgun", "coillance", "arcrail", "prismrail"].includes(fighter.weapon.frameId)
        ? `rgba(209,247,255,${flashAlpha})`
        : fighter.weapon.frameId === "stormbow"
          ? `rgba(158,244,255,${flashAlpha})`
          : `rgba(255,219,160,${flashAlpha})`;
      ctx.beginPath();
      ctx.moveTo(weaponTipX, weaponTipY);
      ctx.lineTo(weaponTipX + fighter.facing * 12, weaponTipY - 5);
      ctx.lineTo(weaponTipX + fighter.facing * 18, weaponTipY);
      ctx.lineTo(weaponTipX + fighter.facing * 12, weaponTipY + 5);
      ctx.closePath();
      ctx.fill();
    }
  } else {
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
  }

  if (fighter.blocking) {
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(fighter.facing * 18, torsoTop * 0.56, 18, -1.4, 1.4);
    ctx.stroke();
  }

  ctx.restore();
}

function drawZones(match) {
  match.zones.forEach((zone) => {
    const alpha = clamp(zone.life / Math.max(zone.maxLife, 0.01), 0, 1);
    const x = stageOffsetX() + zone.x;
    const y = STAGE_TOP + zone.y + 10;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, zone.radius);
    gradient.addColorStop(0, zone.color.replace(/0?\.\d+\)/, `${Math.max(alpha * 0.7, 0.12)})`));
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, zone.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawProjectiles(match) {
  match.projectiles.forEach((projectile) => {
    const startX = stageOffsetX() + projectile.prevX;
    const startY = STAGE_TOP + projectile.prevY + 10;
    const endX = stageOffsetX() + projectile.x;
    const endY = STAGE_TOP + projectile.y + 10;
    const glow = projectile.glow || (projectile.ammoType === "rail" ? "#d1f7ff" : projectile.color);
    const outerWidth = projectile.ammoType === "rail" ? 7 : projectile.ammoType === "bolt" ? 5 : 4;
    const innerWidth = projectile.ammoType === "rail" ? 3 : projectile.ammoType === "bolt" ? 2.6 : 2.2;
    const tipRadius = projectile.tipType === "blunt" ? 4.2 : projectile.tipType === "drill" ? 3.6 : 3.2;

    ctx.save();
    ctx.globalAlpha = projectile.weakened ? 0.58 : 1;
    ctx.setLineDash(projectile.weakened ? [5, 4] : []);
    ctx.strokeStyle = `${glow}55`;
    ctx.lineWidth = projectile.weakened ? outerWidth * 0.78 : outerWidth;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    ctx.strokeStyle = glow;
    ctx.lineWidth = projectile.weakened ? innerWidth * 0.8 : innerWidth;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(endX, endY, projectile.weakened ? tipRadius * 0.82 : tipRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
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
  const playerAmmo = isRangedWeapon(player.weapon)
    ? `${player.ammo}/${player.maxAmmo} ${player.weapon.ammoType}${player.reloadTimer > 0 ? " | RELOAD" : ""}`
    : `${Math.ceil(player.stamina)} stamina`;
  const enemyAmmo = isRangedWeapon(enemy.weapon)
    ? `${enemy.ammo}/${enemy.maxAmmo} ${enemy.weapon.ammoType}${enemy.reloadTimer > 0 ? " | RELOAD" : ""}`
    : `${Math.ceil(enemy.stamina)} stamina`;

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
  ctx.font = "600 11px 'Trebuchet MS', sans-serif";
  ctx.fillText(playerAmmo.toUpperCase(), 42, 44);
  ctx.fillText(enemyAmmo.toUpperCase(), canvas.width - 42 - ctx.measureText(enemyAmmo.toUpperCase()).width, 44);

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
  } else if (player.reloadTimer > 0) {
    drawStatusPill(40, 80, "RELOAD", "#f2dcaa");
  } else if (player.poisonTimer > 0) {
    drawStatusPill(40, 80, "POISON", "#9ef58c");
  } else if (player.slowTimer > 0) {
    drawStatusPill(40, 80, "CHILL", "#b9ebff");
  }

  if (enemy.parryWindow > 0) {
    drawStatusPill(canvas.width - 40, 80, "PARRY", "#bffcff", true);
  } else if (enemy.stunTimer > 0) {
    drawStatusPill(canvas.width - 40, 80, "STUN", "#ffd47c", true);
  } else if (enemy.reloadTimer > 0) {
    drawStatusPill(canvas.width - 40, 80, "RELOAD", "#f2dcaa", true);
  } else if (enemy.poisonTimer > 0) {
    drawStatusPill(canvas.width - 40, 80, "POISON", "#9ef58c", true);
  } else if (enemy.slowTimer > 0) {
    drawStatusPill(canvas.width - 40, 80, "CHILL", "#b9ebff", true);
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

  drawZones(match);
  match.fighters.forEach((fighter) => drawFighter(fighter));
  drawProjectiles(match);
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
  updateStyleTraining(dt);
  if (!state.menu.open && state.flow.screen === "arena") {
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
  const previousFamily = state.forge.family || forgeFamilyForKind(state.forge.kind);
  const previousKind = state.forge.kind || frameCatalog[state.forge.frame]?.kind || "medium";
  const previousFrame = frameCatalog[state.forge.frame] || null;
  const requestedFamily = ui.familySelect.value || previousFamily;
  const requestedKind =
    requestedFamily === previousFamily
      ? (ui.classSelect.value || previousKind)
      : firstKindForFamily(requestedFamily);
  const requestedFrame = requestedKind === previousKind ? ui.frameSelect.value : firstFrameIdForKind(requestedKind);
  const nextFrame = frameCatalog[requestedFrame] || previousFrame;
  const preserveAmmoCase =
    previousFrame &&
    nextFrame &&
    ammoFamilyForFrame(previousFrame) === ammoFamilyForFrame(nextFrame) &&
    previousFrame.family === nextFrame.family;
  state.forge = normalizeForgeState({
    ...state.forge,
    name: ui.weaponName.value.trim().slice(0, 12),
    family: requestedFamily,
    kind: requestedKind,
    frame: requestedFrame,
    material: ui.materialSelect.value,
    edge: state.forge.edge,
    impactChambers: ui.impactChambers.value || state.forge.impactChambers,
    impactMount: ui.impactMount.value || state.forge.impactMount,
    chamberImpacts: state.forge.chamberImpacts,
    impactType: state.forge.chamberImpacts[0] || state.forge.impactType,
    launchType: ui.launchType.value || state.forge.launchType,
    midAirType: state.forge.midAirAddons[0] || state.forge.midAirType,
    midAirAddons: state.forge.midAirAddons,
    tipType: ui.tipType.value || state.forge.tipType,
    preloadAmmo: ui.preloadAmmo.value || state.forge.preloadAmmo,
    ammoCase: preserveAmmoCase ? state.forge.ammoCase : [],
    heat: Number(ui.heatRange.value)
  });
  state.forge = reconcileAmmoCaseForForge(state.forge);
  const blueprintChanged =
    previousForge.family !== state.forge.family ||
    previousForge.kind !== state.forge.kind ||
    previousForge.frame !== state.forge.frame ||
    previousForge.material !== state.forge.material ||
    previousForge.edge !== state.forge.edge ||
    previousForge.impactChambers !== state.forge.impactChambers ||
    previousForge.impactMount !== state.forge.impactMount ||
    JSON.stringify(previousForge.chamberImpacts || []) !== JSON.stringify(state.forge.chamberImpacts || []) ||
    previousForge.launchType !== state.forge.launchType ||
    JSON.stringify(previousForge.midAirAddons || []) !== JSON.stringify(state.forge.midAirAddons || []) ||
    previousForge.tipType !== state.forge.tipType ||
    previousForge.preloadAmmo !== state.forge.preloadAmmo ||
    JSON.stringify(previousForge.ammoCase || []) !== JSON.stringify(state.forge.ammoCase || []) ||
    previousForge.heat !== state.forge.heat;
  if (blueprintChanged) {
    resetForgeMinigame(state.forge.frame, false);
  }
  syncForgeSelectors();
  renderForge();
  updateHudLabels();
}

function bindTouchControls() {
  const buttons = ui.touchControls.querySelectorAll("[data-touch]");
  buttons.forEach((button) => {
    const action = button.dataset.touch;
    const tapFriendly = new Set(["attack", "up", "dodge", "slide", "reload"]);
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
      button.classList.toggle("pressed", value);
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
          button.classList.remove("pressed");
        }, 90);
      } else {
        state.touchState[action] = false;
        button.classList.remove("pressed");
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
      button.classList.add("pressed");
    });
    ["pointerup", "pointerleave", "pointercancel"].forEach((eventName) => {
      button.addEventListener(eventName, () => {
        button.classList.remove("pressed");
      });
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
    ui.familySelect,
    ui.classSelect,
    ui.frameSelect,
    ui.materialSelect,
    ui.edgeSelect,
    ui.impactChambers,
    ui.impactMount,
    ui.launchType,
    ui.tipType,
    ui.preloadAmmo,
    ui.heatRange
  ].filter(Boolean).forEach((element) => {
    element.addEventListener("input", handleForgeChange);
    element.addEventListener("change", handleForgeChange);
  });

  ui.addMidAirAddon.addEventListener("click", () => {
    const addonId = ui.midAirType.value;
    if (!addonId) {
      return;
    }
    state.forge = normalizeForgeState({
      ...state.forge,
      midAirAddons: [...state.forge.midAirAddons, addonId]
    });
    state.forge = reconcileAmmoCaseForForge(state.forge);
    resetForgeMinigame(state.forge.frame, false);
    renderForge();
    const frame = frameCatalog[state.forge.frame] || frameCatalog.longbow;
    const fieldCatalog = midAirCatalogForFrame(frame);
    const labels = ammoWorkshopLabelsForFrame(frame);
    setMatchSummary(`${fieldCatalog[addonId].label} added to the ${isSpecialGunFrame(frame) ? labels.detailMidAir.toLowerCase() : "mid-air stack"}.`);
  });

  ui.saveAmmo.addEventListener("click", saveCurrentAmmoRecipe);
  ui.addAmmoToCase.addEventListener("click", addCurrentAmmoToCase);
  ui.clearAmmoCase.addEventListener("click", clearAmmoCase);

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
    setMatchSummary(`Forge drill started for ${currentBlueprint().classLabel.toLowerCase()} ${isRangedWeapon(currentBlueprint()) ? "ammo tuning" : "weapon work"}.`);
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
  ui.menuOpenStyleLab.addEventListener("click", () => {
    ui.styleLabCard.scrollIntoView({ behavior: "smooth", block: "start" });
    renderStyleLab("Style Lab ready. Pick a style, then spend match-earned skill points on training.");
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
  ui.styleSelect.addEventListener("change", () => {
    const account = currentAccount();
    if (!account) {
      renderStyleLab("Sign in before changing your active style.");
      return;
    }
    const styleLab = ensureAccountStyleLab(account);
    styleLab.activeStyleId = ui.styleSelect.value;
    resetStyleTrainingState(styleLab.activeStyleId, "agility");
    saveAuthState();
    renderStyleLab(`${combatStyleCatalog[styleLab.activeStyleId].label} is now active.`);
    renderMenuSummary();
  });
  ui.trainAgility.addEventListener("click", () => startStyleTraining("agility"));
  ui.trainStrength.addEventListener("click", () => startStyleTraining("strength"));
  ui.trainDefense.addEventListener("click", () => startStyleTraining("defense"));
  ui.styleTrainingStart.addEventListener("click", () => {
    const training = state.styleTraining;
    startStyleTraining(training.path || "agility");
  });
  ui.styleTrainingAction.addEventListener("click", handleStyleTrainingAction);

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
    if (state.menu.open && (event.code === "Space" || event.code === "Enter") && state.styleTraining.active) {
      event.preventDefault();
      handleStyleTrainingAction();
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
  populateSelect(ui.familySelect, weaponFamilyCatalog);
  populateSelect(ui.classSelect, bladeTypeCatalog);
  syncForgeSelectors();
  resetForgeMinigame(state.forge.frame, true);
  ui.roundsToWinValue.textContent = ui.roundsToWin.value;

  try {
    const savedAuth = JSON.parse(window.localStorage.getItem("stickforge-auth") || "null");
    if (savedAuth && Array.isArray(savedAuth.accounts)) {
      state.auth.accounts = savedAuth.accounts.map((account) => {
        const normalized = {
          ...account,
          friends: Array.isArray(account.friends) ? account.friends : [],
          stats: {
            ...defaultAccountStats(),
            ...(account.stats || {})
          }
        };
        normalized.styleLab = ensureAccountStyleLab(normalized);
        return normalized;
      });
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

  try {
    const savedProgress = JSON.parse(window.localStorage.getItem("stickforge-progress") || "null");
    loadProgressState(savedProgress);
  } catch (error) {
    state.armory = [];
    state.ammoRack = [];
  }

  seedArmory();
  resetStyleTrainingState(currentAccount() ? ensureAccountStyleLab(currentAccount()).activeStyleId : "tempest", "agility");
  renderForge();
  renderArmory();
  renderStageSummary();
  updateHudLabels();
  setStatus("Waiting");
  setMatchSummary("Press Play on the intro screen, choose your controls, then start the tutorial, bot fight, PvP set, or forge screen.");
  bindEvents();
  renderSoundButtons();
  renderAccountPanel();
  renderStyleLab();
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
