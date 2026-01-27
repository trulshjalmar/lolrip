/* randomBuild.js — FULL UPDATED
   - Data Dragon live
   - Final items only (no components), boots filtered
   - Bans jungle pets (Gustwalker Hatchling etc.)
   - Lane filter + search
   - Amumu override: Top/Jungle/Mid/Support (not ADC)
   - Champion meta: emoji + role ONLY (no title like "the Sad Mummy")
   - Unique share link via URL params
   - PNG preview modal + download + copy PNG (if supported)
*/

console.log("randomBuild.js blacklist build loaded");

const el = (id) => document.getElementById(id);

const pageSelect = el("pageSelect");
const pageBuild  = el("pageBuild");

const searchInput = el("search");
const championGrid = el("championGrid");
const gridWrap = el("gridWrap");

const champImg  = el("champImg");
const champName = el("champName");
const champMeta = el("champMeta");

const buildName = el("buildName");
const itemGrid = el("itemGrid");

const primaryRunesEl = el("primaryRunes");
const secondaryRunesEl = el("secondaryRunes");
const primaryStyleIcon = el("primaryStyleIcon");
const secondaryStyleIcon = el("secondaryStyleIcon");
const primaryStyleNameEl = el("primaryStyleName");
const secondaryStyleNameEl = el("secondaryStyleName");

const summonersEl = el("summoners");

const btnBack = el("btnBack");
const btnReroll = el("btnReroll");
const btnCopyText = el("btnCopyText");
const btnCopyLink = el("btnCopyLink");
const btnPreview = el("btnPreview");
const sharePreview = el("sharePreview");

const laneFilters = el("laneFilters");

/* Modal */
const previewModal = el("previewModal");
const modalBackdrop = el("modalBackdrop");
const btnCloseModal = el("btnCloseModal");
const previewImg = el("previewImg");
const btnDownloadPNG = el("btnDownloadPNG");
const btnCopyPNG = el("btnCopyPNG");
const previewHint = el("previewHint");

const flavorNames = [
  "The Inting Special 👨🏼‍🍳",
  "0/10 Power Spike",
  "Solo Lose Condition",
  "Giga Sprint Tech",
  "FF15 Speedrun",
  "Hands Diff (Not Yours)",
  "No Damage Any% Run",
  "W-Key Philosophy",
  "Minimal KP Lifestyle",
  "Ping Collector",
  "Outplay Loading…",
  "It’s a Limit Test",
  "We Scale (We Don’t)",
  "Report Button Enjoyer",
  "Turbo Negative Gaming"
];


// 🚫 Arena / Prismatic / special-mode items that appear in Data Dragon but are not obtainable in normal League (SR/ARAM)
const ARENA_ITEM_BLACKLIST = new Set([
  "Hexbolt Companion",
  "Innervating Locket",
  "Kinkou Jitte",
  "Lightning Rod",
  "Mirage Blade",
  "Moonflair Spellblade",
  "Night Harvester",
  "Prowler's Claw",
  "Puppeteer",
  "Pyromancer's Cloak",
  "Radiant Virtue",
  "Reality Fracture",
  "Reaper's Toll",
  "Regicide",
  "Reverberation",
  "Black Hole Gauntlet",
  "Cloak of Starry Night",
  "Crown of the Shattered Queen",
  "Cruelty",
  "Darksteel Talons",
  "Decapitator",
  "Demon King's Crown",
  "Demonic Embrace",
  "Detonation Orb",
  "Diamond-Tipped Spear",
  "Divine Sunderer",
  "Dragonheart",
  "Duskblade of Draktharr",
  "Eleisa's Miracle",
  "Empyrean Promise",
  "Everfrost",
  "Flesheater",
  "Force of Entropy",
  "Fulmination",
  "Galeforce",
  "Gambler's Blade",
  "Gargoyle Stoneplate",
  "Goredrinker",
  "Hamstringer",
  "Hemomancer's Helm",
  "Runecarver",
  "Sanguine Gift",
  "Shield of Molten Stone",
  "Sword of the Divine",
  "Talisman of Ascension",
  "Turbo Chemtank",
]);


let ddragonVersion = null;
let champions = [];
let items = [];
let boots = [];
let spells = [];
let runeStyles = [];
let keystones = [];

let junglePets = [];
let supportQuestItem = null;

let currentChampion = null;
let currentBuild = null;
let currentLane = "ALL";

let scrollTimer = null;
let lastPreviewBlob = null;

/* ---------------- helpers ---------------- */
function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function shuffleCopy(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function showPage(which) {
  if (which === "select") {
    pageSelect.classList.remove("hidden");
    pageBuild.classList.add("hidden");
  } else {
    pageSelect.classList.add("hidden");
    pageBuild.classList.remove("hidden");
  }
}

async function loadJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${url}`);
  return res.json();
}

function roleToEmoji(role) {
  if (role === "Tank") return "🛡️";
  if (role === "Fighter") return "⚔️";
  if (role === "Mage") return "✨";
  if (role === "Assassin") return "🗡️";
  if (role === "Marksman") return "🏹";
  if (role === "Support") return "💉";
  return "🎭";
}

/* ---------------- Data filters ---------------- */

// Boots we allow in SR builds (used both for filtering and as a fallback pool)
const ALLOWED_BOOT_NAMES = new Set([
  "Berserker's Greaves",
  "Boots of Swiftness",
  "Ionian Boots of Lucidity",
  "Mercury's Treads",
  "Plated Steelcaps",
  "Sorcerer's Shoes"
]);

function isSummonersRiftItem(it) {
  // Allow items by default unless explicitly disabled for SR.
  // Data Dragon isn't perfectly consistent about always providing a maps object.
  if (it.maps && it.maps["11"] === false) return false;

  // Explicitly disallow Arena map (30) if present
  if (it.maps && it.maps["30"] === true) return false;

  return true;
}


function isValidFinalItem(it) {
  if (!it.gold || !it.gold.purchasable) return false;
  if (!isSummonersRiftItem(it)) return false;
  if (it.gold.total <= 0) return false;
  if (it.inStore === false) return false;
  if (it.requiredChampion) return false;

  // 🚫 Hard blacklist for Arena/Prismatic special items
  if (ARENA_ITEM_BLACKLIST.has(it.name)) return false;

  // 🚫 Exclude Arena / special-acquisition items that can sneak into Data Dragon
  if (it.requiredAlly) return false;
  if (it.requiredBuffCurrencyName) return false;
  if (it.specialRecipe) return false;

  const desc = (it.description || "").toLowerCase();
  // Common Arena / Anvil / Prismatic markers (robust, not a name blacklist)
  if (desc.includes("arena") || desc.includes("anvil") || desc.includes("prismatic")) return false;


  const tags = it.tags || [];
  if (tags.includes("Consumable") || tags.includes("Trinket")) return false;
  if (tags.includes("Boots")) return false;

  // 🚫 Prevent "double boots": some boots-like items (e.g. Arena upgrades) may lack the Boots tag
  const lowerName = (it.name || "").toLowerCase();
  const bootWords = ["boots", "treads", "greaves", "shoes", "steelcaps", "swiftness", "lucidity"];
  if (bootWords.some(w => lowerName.includes(w))) return false;

  // Avoid components
  if (typeof it.depth === "number" && it.depth < 3) return false;
  if (Array.isArray(it.into) && it.into.length > 0) return false;

  // Exclude Crimson Lucidity / weird
  const name = (it.name || "").toLowerCase();
  if (String(it.id) === "3171") return false;
  if (name.includes("crimson")) return false;

  // Exclude jungle pets/hatchlings
  const bannedNames = new Set([
    "Gustwalker Hatchling",
    "Mosstomper Seedling",
    "Scorchclaw Pup"
  ]);
  if (bannedNames.has(it.name)) return false;
  if (name.includes("hatchling") || name.includes("seedling") || name.includes("pup")) return false;

  return true;
}

function isValidFinalBoots(it) {
  if (!it.gold || !it.gold.purchasable) return false;
  if (!isSummonersRiftItem(it)) return false;
  if (it.inStore === false) return false;

  const tags = it.tags || [];
  if (!tags.includes("Boots")) return false;

  // Exclude basic boots + special
  if (String(it.id) === "1001") return false;
  if (String(it.id) === "3171") return false;
  if ((it.name || "").toLowerCase().includes("crimson")) return false;

  if (Array.isArray(it.into) && it.into.length > 0) return false;
  if (typeof it.depth === "number" && it.depth < 2) return false;

  // ✅ Only allow real SR boots we want
  if (!ALLOWED_BOOT_NAMES.has(it.name)) return false;

  return true;
}

/* ---------------- Data Dragon load ---------------- */
async function bootDataDragon() {
  const versions = await loadJson("https://ddragon.leagueoflegends.com/api/versions.json");
  ddragonVersion = versions[0];

  const [champJson, itemJson, spellJson, runeJson] = await Promise.all([
    loadJson(`https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/data/en_US/champion.json`),
    loadJson(`https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/data/en_US/item.json`),
    loadJson(`https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/data/en_US/summoner.json`),
    loadJson(`https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/data/en_US/runesReforged.json`)
  ]);

  champions = Object.values(champJson.data).map(c => ({
    id: c.id,
    name: c.name,
    title: c.title,
    tags: c.tags || [],
    icon: `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/champion/${c.image.full}`
  })).sort((a,b) => a.name.localeCompare(b.name));

  const rawItems = Object.entries(itemJson.data).map(([id, it]) => ({ id, ...it }));

  // Keep quest items separately so they only appear when toggled in Advanced Mode
  const petNames = new Set(["Gustwalker Hatchling", "Mosstomper Seedling", "Scorchclaw Pup"]);
  junglePets = rawItems
    .filter(it => petNames.has(it.name))
    .map(it => ({
      id: it.id,
      name: it.name,
      icon: `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/item/${it.image.full}`,
      tags: it.tags || [],
      stats: it.stats || {}
    }));

  supportQuestItem = rawItems
    .filter(it => it.name === "World Atlas")
    .map(it => ({
      id: it.id,
      name: it.name,
      icon: `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/item/${it.image.full}`,
      tags: it.tags || [],
      stats: it.stats || {}
    }))[0] || null;


  boots = rawItems
    .filter(isValidFinalBoots)
    .map(it => ({
      id: it.id,
      name: it.name,
      icon: `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/item/${it.image.full}`,
      tags: it.tags || [],
      stats: it.stats || {}
    }));

  // Fallback: if Data Dragon metadata filtering ever yields no boots,
  // build the boots pool purely by name.
  if (!boots.length) {
    boots = rawItems
      .filter(it => ALLOWED_BOOT_NAMES.has(it.name))
      .map(it => ({
        id: it.id,
        name: it.name,
        icon: `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/item/${it.image.full}`,
        tags: it.tags || [],
        stats: it.stats || {}
      }));
  }

  items = rawItems
    .filter(it => !(it.tags || []).includes("Boots"))
    .filter(isValidFinalItem)
    .map(it => ({
      id: it.id,
      name: it.name,
      icon: `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/item/${it.image.full}`,
      tags: it.tags || [],
      stats: it.stats || {}
    }));

  const allowedSpellIds = new Set([
    "SummonerFlash",
    "SummonerDot",
    "SummonerTeleport",
    "SummonerHaste",
    "SummonerHeal",
    "SummonerBarrier",
    "SummonerBoost",
    "SummonerExhaust",
    "SummonerSmite",
    "SummonerSnowball",
    "SummonerMana"
  ]);

  spells = Object.values(spellJson.data)
    .filter(s => allowedSpellIds.has(s.id))
    .map(s => ({
      id: s.id,
      name: s.name,
      icon: `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/spell/${s.image.full}`
    }));

  runeStyles = runeJson.map(style => ({
    id: style.id,
    name: style.name,
    icon: `https://ddragon.leagueoflegends.com/cdn/img/${style.icon}`,
    slots: style.slots
  }));

  keystones = [];
  runeStyles.forEach(style => {
    const firstSlot = style.slots?.[0];
    (firstSlot?.runes || []).forEach(r => {
      keystones.push({
        id: r.id,
        name: r.name,
        styleId: style.id,
        icon: `https://ddragon.leagueoflegends.com/cdn/img/${r.icon}`
      });
    });
  });
}

/* ---------------- Lane filtering ---------------- */
function laneMatches(champ, lane) {
  if (lane === "ALL") return true;

  const overrides = { Amumu: ["TOP", "JUNGLE", "MID", "SUPPORT"] };
  if (overrides[champ.id]) return overrides[champ.id].includes(lane);

  const tags = champ.tags || [];
  const isSupport = tags.includes("Support");
  const isMarksman = tags.includes("Marksman");
  const isMage = tags.includes("Mage");
  const isAssassin = tags.includes("Assassin");
  const isTank = tags.includes("Tank");
  const isFighter = tags.includes("Fighter");

  if (lane === "SUPPORT") return isSupport;
  if (lane === "ADC") return isMarksman;
  if (lane === "MID") return (isMage || isAssassin) && !isMarksman;
  if (lane === "TOP") return (isTank || isFighter) && !isSupport && !isMarksman;
  if (lane === "JUNGLE") return !isSupport && !isMarksman && (isAssassin || isFighter || isTank);

  return true;
}

function applyFilters() {
  const q = searchInput.value.trim().toLowerCase();
  const filtered = champions.filter(c => {
    const nameOk = c.name.toLowerCase().includes(q);
    const laneOk = laneMatches(c, currentLane);
    return nameOk && laneOk;
  });
  renderChampionGrid(filtered);
}

/* ---------------- Champion grid render ---------------- */
function renderChampionGrid(list) {
  championGrid.innerHTML = "";

  list.forEach(c => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "champCard";
    card.innerHTML = `
      <img class="champIcon" src="${c.icon}" alt="${c.name}">
      <div class="champLabel">${c.name}</div>
    `;
    card.addEventListener("click", () => openBuild(c));
    championGrid.appendChild(card);
  });
}

/* ---------------- Build generation ---------------- */
function classifyItem(it) {
  const s = it.stats || {};
  const tags = it.tags || [];
  const ap = (s.FlatMagicDamageMod || 0) > 0;
  const ad = (s.FlatPhysicalDamageMod || 0) > 0;
  const tank = ((s.FlatHPPoolMod || 0) > 0) || ((s.FlatArmorMod || 0) > 0) || ((s.FlatSpellBlockMod || 0) > 0);
  const support = tags.includes("GoldPer") || tags.includes("ManaRegen");

  if (support) return "SUPPORT";
  if (ap && !ad) return "AP";
  if (ad && !ap) return "AD";
  if (tank && !ap && !ad) return "TANK";
  if (tank && (ap || ad)) return "BRUISER";
  if (ap && ad) return "HYBRID";
  return "OTHER";
}

function preferredPoolsForChampion(champ) {
  const role = (champ.tags && champ.tags[0]) ? champ.tags[0] : "Unknown";
  if (role === "Mage") return ["AP", "HYBRID", "OTHER"];
  if (role === "Marksman") return ["AD", "OTHER"];
  if (role === "Assassin") return ["AD", "AP", "HYBRID"];
  if (role === "Tank") return ["TANK", "BRUISER", "OTHER"];
  if (role === "Support") return ["SUPPORT", "TANK", "AP"];
  if (role === "Fighter") return ["BRUISER", "AD", "TANK"];
  return ["OTHER", "AD", "AP", "TANK"];
}

function generateItems(champ) {
  const prefs = preferredPoolsForChampion(champ);

  const categorized = items.map(it => ({ ...it, bucket: classifyItem(it) }));
  const prefPool = shuffleCopy(categorized.filter(it => prefs.includes(it.bucket)));
  const anyPool = shuffleCopy(categorized);

  const picked = [];

  // We always want 5 non-boots items + 1 boots = 6 total slots.
  // If Jungle/Support is toggled, we force exactly one quest item and fill the rest with normal items.
  const wantQuest = (window.isJungle && junglePets.length) || (window.isSupport && supportQuestItem);
  const targetNonBoots = 5;

  if (window.isJungle && junglePets.length) {
    const pet = pickRandom(junglePets);
    if (pet) picked.push({ ...pet, isBoots: false, isQuest: true });
  } else if (window.isSupport && supportQuestItem) {
    picked.push({ ...supportQuestItem, isBoots: false, isQuest: true });
  }

  const needRelevant = wantQuest ? 2 : Math.min(3, targetNonBoots);

  for (const it of prefPool) {
    if (picked.length >= needRelevant) break;
    if (!picked.some(x => x.id === it.id || x.name === it.name)) picked.push(it);
  }

  while (picked.length < targetNonBoots) {
    const it = pickRandom(anyPool);
    if (!it) continue;
    if (picked.some(x => x.id === it.id || x.name === it.name)) continue;
    picked.push(it);
  }

  const boot = boots.length ? pickRandom(boots) : null;

  const result = picked.map(it => ({ ...it, isBoots: false }));
  if (boot) result.push({ ...boot, isBoots: true });

  return result;
}

function pickRandomRuneFromSlot(slot) {
  const runes = slot?.runes || [];
  if (!runes.length) return null;
  const r = pickRandom(runes);
  return { id: r.id, name: r.name, icon: `https://ddragon.leagueoflegends.com/cdn/img/${r.icon}` };
}

function generateRunes() {
  const key = pickRandom(keystones);

  const primaryStyle = runeStyles.find(s => s.id === key.styleId);
  let secondaryStyle = pickRandom(runeStyles);
  while (secondaryStyle.id === key.styleId) secondaryStyle = pickRandom(runeStyles);

  const primaryPicks = [{ id: key.id, name: key.name, icon: key.icon }];

  if (primaryStyle?.slots?.length >= 4) {
    for (let i = 1; i <= 3; i++) {
      const pick = pickRandomRuneFromSlot(primaryStyle.slots[i]);
      if (pick) primaryPicks.push(pick);
    }
  }

  const secSlots = [1, 2, 3].filter(i => secondaryStyle?.slots?.[i]?.runes?.length);
  const shuffled = shuffleCopy(secSlots);
  const secondaryPicks = [];

  for (const idx of shuffled.slice(0, 2)) {
    const pick = pickRandomRuneFromSlot(secondaryStyle.slots[idx]);
    if (pick) secondaryPicks.push(pick);
  }

  return {
    primaryStyleName: primaryStyle?.name || "Primary",
    primaryStyleIcon: primaryStyle?.icon || "",
    secondaryStyleName: secondaryStyle?.name || "Secondary",
    secondaryStyleIcon: secondaryStyle?.icon || "",
    primaryPicks,
    secondaryPicks
  };
}

function generateSummoners() {
  if (spells.length < 2) return [];

  // ARAM restrictions
  const base = window.isARAM
    ? spells.filter(s => s.name !== "Teleport")
    : spells.slice();

  // Jungle: always force Smite + one random (not Smite)
  if (window.isJungle) {
    const smite = base.find(s => s.name === "Smite");
    const others = base.filter(s => s.name !== "Smite");
    if (!smite || others.length < 1) return [];
    return [smite, pickRandom(others)];
  }

  // Non-jungle: never include Smite
  const pool = base.filter(s => s.name !== "Smite");
  if (pool.length < 2) return [];

  const a = pickRandom(pool);
  let b = pickRandom(pool);
  while (b && a && b.id === a.id) b = pickRandom(pool);

  return [a, b].filter(Boolean);
}

function generateBuild(champ) {
  return {
    items: generateItems(champ),
    summoners: generateSummoners(),
    flavorName: pickRandom(flavorNames),
    ...generateRunes()
  };
}

/* ---------------- Render build ---------------- */
function renderRuneGrid(targetEl, picks) {
  targetEl.innerHTML = "";
  (picks || []).forEach(r => {
    const div = document.createElement("div");
    div.className = "runePick";
    div.innerHTML = `
      <img class="runeIcon" src="${r.icon}" alt="${r.name || ""}">
      <div class="runeName">${r.name || ""}</div>
    `;
    targetEl.appendChild(div);
  });
}

function renderBuild(champ, build) {
  champImg.src = champ.icon;
  champImg.alt = champ.name;
  champName.textContent = champ.name;

  const role = (champ.tags && champ.tags[0]) ? champ.tags[0] : "";
  champMeta.textContent = role ? `${roleToEmoji(role)} ${role}` : "";

  buildName.textContent = build.flavorName;

  itemGrid.innerHTML = "";
  build.items.forEach(it => {
    const wrap = document.createElement("div");
    wrap.className = "itemIconWrap";
    wrap.innerHTML = `
      <img class="itemIcon" src="${it.icon}" alt="${it.name}">
      <div class="itemName">${it.name}</div>
    `;
    itemGrid.appendChild(wrap);
  });

  primaryStyleIcon.src = build.primaryStyleIcon;
  primaryStyleIcon.alt = build.primaryStyleName;
  secondaryStyleIcon.src = build.secondaryStyleIcon;
  secondaryStyleIcon.alt = build.secondaryStyleName;

  primaryStyleNameEl.textContent = build.primaryStyleName;
  secondaryStyleNameEl.textContent = build.secondaryStyleName;

  renderRuneGrid(primaryRunesEl, build.primaryPicks);
  renderRuneGrid(secondaryRunesEl, build.secondaryPicks);

  summonersEl.innerHTML = "";
  if (!build.summoners || build.summoners.length < 2) {
    summonersEl.innerHTML = `<div style="opacity:.7;">Summoners not loaded</div>`;
  } else {
    build.summoners.forEach(s => {
      const pill = document.createElement("div");
      pill.className = "spellPill";
      pill.innerHTML = `
        <img class="spellIcon" src="${s.icon}" alt="${s.name}">
        <span class="spellName">${s.name}</span>
      `;
      summonersEl.appendChild(pill);
    });
  }

  if (sharePreview) {
    sharePreview.classList.add("hidden");
    sharePreview.textContent = "";
  }

  lastPreviewBlob = null;
}

/* ---------------- Share text/link ---------------- */
function buildShareText() {
  if (!currentChampion || !currentBuild) return "";

  const itemsText = currentBuild.items.map(it => `- ${it.name}`).join("\n");

  const pNames = (currentBuild.primaryPicks || []).map(r => r.name).filter(Boolean).join(", ");
  const sNames = (currentBuild.secondaryPicks || []).map(r => r.name).filter(Boolean).join(", ");

  const summText = (currentBuild.summoners && currentBuild.summoners.length >= 2)
    ? `- ${currentBuild.summoners[0].name}\n- ${currentBuild.summoners[1].name}`
    : "(not available)";

  return `${currentChampion.name} — Int Build 💀

Items:
${itemsText}

Runes:
Primary (${currentBuild.primaryStyleName}): ${pNames}
Secondary (${currentBuild.secondaryStyleName}): ${sNames}

Summoners:
${summText}

"${currentBuild.flavorName}"
`;
}

async function copyText() {
  if (!currentChampion || !currentBuild) return;
  const text = buildShareText();

  try {
    await navigator.clipboard.writeText(text);
    const old = btnCopyText.textContent;
    btnCopyText.textContent = "✅ Copied!";
    setTimeout(() => (btnCopyText.textContent = old), 900);

    if (sharePreview) {
      sharePreview.textContent = text;
      sharePreview.classList.remove("hidden");
    }
  } catch {
    alert("Kunne ikke kopiere tekst.");
  }
}

function buildToQuery(champ, build) {
  const p = new URLSearchParams();
  p.set("champ", champ.id);
  p.set("items", (build.items || []).map(x => String(x.id)).join(","));
  p.set("title", build.flavorName);

  p.set("pStyle", build.primaryStyleName);
  p.set("sStyle", build.secondaryStyleName);

  p.set("pStyleIcon", encodeURIComponent(build.primaryStyleIcon || ""));
  p.set("sStyleIcon", encodeURIComponent(build.secondaryStyleIcon || ""));

  p.set("pRunes", (build.primaryPicks || []).map(r => encodeURIComponent(r.icon)).join(","));
  p.set("sRunes", (build.secondaryPicks || []).map(r => encodeURIComponent(r.icon)).join(","));

  p.set("spells", (build.summoners || []).map(s => encodeURIComponent(s.icon)).join(","));
  return p.toString();
}

function updateShareURL() {
  if (!currentChampion || !currentBuild) return;
  const qs = buildToQuery(currentChampion, currentBuild);
  const url = `${location.origin}${location.pathname}?${qs}`;
  history.replaceState(null, "", url);
}

async function copyLink() {
  if (!currentChampion || !currentBuild) return;
  updateShareURL();

  try {
    await navigator.clipboard.writeText(location.href);
    const old = btnCopyLink.textContent;
    btnCopyLink.textContent = "✅ Copied!";
    setTimeout(() => (btnCopyLink.textContent = old), 900);
  } catch {
    alert("Kunne ikke kopiere link.");
  }
}

/* ---------------- PNG preview modal ---------------- */
function openModal() {
  previewModal?.classList.remove("hidden");
  previewModal?.setAttribute("aria-hidden", "false");
}
function closeModal() {
  previewModal?.classList.add("hidden");
  previewModal?.setAttribute("aria-hidden", "true");
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    if (!url) return reject(new Error("No url"));
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function drawIcon(ctx, img, x, y, s, radius) {
  ctx.save();
  roundRect(ctx, x, y, s, s, radius);
  ctx.clip();
  ctx.drawImage(img, x, y, s, s);
  ctx.restore();
}

async function generatePreviewPNG() {
  if (!currentChampion || !currentBuild) return null;

  const W = 1200, H = 630;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0f1115");
  bg.addColorStop(1, "#07080b");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "rgba(31,122,255,0.10)";
  ctx.beginPath();
  ctx.arc(260, 230, 260, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.04)";
  roundRect(ctx, 48, 48, W - 96, H - 96, 24);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 2;
  roundRect(ctx, 48, 48, W - 96, H - 96, 24);
  ctx.stroke();

  const champImgEl = await loadImage(currentChampion.icon);

  const itemImgs = await Promise.all(
    (currentBuild.items || []).map(it => loadImage(it.icon).catch(() => null))
  );

  const runeAll = [
    { icon: currentBuild.primaryStyleIcon, name: currentBuild.primaryStyleName },
    ...(currentBuild.primaryPicks || []),
    { icon: currentBuild.secondaryStyleIcon, name: currentBuild.secondaryStyleName },
    ...(currentBuild.secondaryPicks || [])
  ].filter(x => x && x.icon);

  const runeImgs = await Promise.all(runeAll.map(r => loadImage(r.icon).catch(() => null)));

  const spellImgs = await Promise.all(
    (currentBuild.summoners || []).map(s => loadImage(s.icon).catch(() => null))
  );

  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = "800 54px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillText(currentChampion.name, 110, 140);

  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = "800 28px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillText(currentBuild.flavorName, 110, 182);

  drawIcon(ctx, champImgEl, 110, 220, 132, 26);

  const itemSize = 86;
  const itemGap = 16;
  const count = itemImgs.length;
  const totalW = count * itemSize + Math.max(0, count - 1) * itemGap;
  const startX = Math.round((W - totalW) / 2);
  const yItems = 390;

  itemImgs.forEach((img, i) => {
    if (!img) return;
    const x = startX + i * (itemSize + itemGap);
    drawIcon(ctx, img, x, yItems, itemSize, 20);

    if (currentBuild.items?.[i]?.isBoots) {
      ctx.strokeStyle = "rgba(31,122,255,0.65)";
      ctx.lineWidth = 4;
      roundRect(ctx, x - 2, yItems - 2, itemSize + 4, itemSize + 4, 22);
      ctx.stroke();
    }
  });

  const runesX = 820;
  const runesY = 140;
  const rSize = 62;
  const rGap = 12;

  ctx.fillStyle = "rgba(255,255,255,0.70)";
  ctx.font = "800 18px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillText("Runes", runesX, runesY - 22);

  runeImgs.slice(0, 9).forEach((img, i) => {
    if (!img) return;
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = runesX + col * (rSize + rGap);
    const y = runesY + row * (rSize + rGap);
    drawIcon(ctx, img, x, y, rSize, 18);
  });

  const spX = 930;
  const spY = 440;
  const spS = 66;

  ctx.fillStyle = "rgba(255,255,255,0.70)";
  ctx.font = "800 18px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillText("Summoners", spX, spY - 22);

  spellImgs.slice(0, 2).forEach((img, i) => {
    if (!img) return;
    drawIcon(ctx, img, spX + i * (spS + 14), spY, spS, 18);
  });

  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = "700 16px system-ui, -apple-system, Segoe UI, Roboto, Arial";
  ctx.fillText("6... 7...👨🏼‍🍳🥄", 64, 600);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  return blob;
}

async function openPreview() {
  if (!currentChampion || !currentBuild) return;

  previewHint.textContent = "Generating preview…";
  openModal();

  try {
    const blob = await generatePreviewPNG();
    if (!blob) throw new Error("No blob");

    lastPreviewBlob = blob;

    const url = URL.createObjectURL(blob);
    previewImg.src = url;
    previewHint.textContent = "PNG ready";
  } catch (e) {
    console.error(e);
    previewHint.textContent = "Preview failed (check console)";
  }
}

function downloadPNG() {
  if (!lastPreviewBlob) return;

  const a = document.createElement("a");
  a.href = URL.createObjectURL(lastPreviewBlob);
  a.download = `${currentChampion?.name || "build"}-int-build.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

async function copyPNG() {
  if (!lastPreviewBlob) return;

  try {
    if (!navigator.clipboard || !window.ClipboardItem) {
      alert("Copy PNG not supported in this browser.");
      return;
    }
    const item = new ClipboardItem({ "image/png": lastPreviewBlob });
    await navigator.clipboard.write([item]);
    previewHint.textContent = "✅ PNG copied";
  } catch (e) {
    console.error(e);
    alert("Could not copy PNG (browser permissions).");
  }
}

/* ---------------- URL load ---------------- */
function tryLoadFromURL() {
  const params = new URLSearchParams(location.search);
  const champId = params.get("champ");
  if (!champId) return;

  const champ = champions.find(c => c.id === champId);
  if (!champ) return;

  const title = params.get("title") || "Int Build";

  const itemIds = (params.get("items") || "").split(",").filter(Boolean);
  const pickedItems = itemIds
    .map(id => items.find(it => String(it.id) === String(id)) || boots.find(b => String(b.id) === String(id)))
    .filter(Boolean)
    .slice(0, 6)
    .map(it => ({ ...it, isBoots: (it.tags || []).includes("Boots") }));

  const pStyle = params.get("pStyle") || "Primary";
  const sStyle = params.get("sStyle") || "Secondary";

  const pStyleIcon = decodeURIComponent(params.get("pStyleIcon") || "");
  const sStyleIcon = decodeURIComponent(params.get("sStyleIcon") || "");

  const pRunes = (params.get("pRunes") || "").split(",").filter(Boolean)
    .map(u => ({ name: "", icon: decodeURIComponent(u) }));

  const sRunes = (params.get("sRunes") || "").split(",").filter(Boolean)
    .map(u => ({ name: "", icon: decodeURIComponent(u) }));

  const sp = (params.get("spells") || "").split(",").filter(Boolean)
    .map(u => ({ name: "", icon: decodeURIComponent(u) }));

  currentChampion = champ;
  currentBuild = {
    items: pickedItems.length ? pickedItems : generateItems(champ),
    summoners: sp.length ? sp : generateSummoners(),
    flavorName: title,
    primaryStyleName: pStyle,
    secondaryStyleName: sStyle,
    primaryStyleIcon: pStyleIcon || "",
    secondaryStyleIcon: sStyleIcon || "",
    primaryPicks: pRunes.length ? pRunes : (generateRunes().primaryPicks || []),
    secondaryPicks: sRunes.length ? sRunes : (generateRunes().secondaryPicks || [])
  };

  renderBuild(currentChampion, currentBuild);
  showPage("build");
}

/* ---------------- Actions ---------------- */
function openBuild(champ) {
  currentChampion = champ;
  currentBuild = generateBuild(champ);
  renderBuild(champ, currentBuild);
  showPage("build");
  updateShareURL();
}

function reroll() {
  if (!currentChampion) return;
  currentBuild = generateBuild(currentChampion);
  renderBuild(currentChampion, currentBuild);
  updateShareURL();
}

/* ---------------- Init ---------------- */
async function init() {
  championGrid.innerHTML = `<div style="opacity:.75;padding:10px;">Loading champions…</div>`;

  try {
    await bootDataDragon();
    applyFilters();
    tryLoadFromURL();
  } catch (err) {
    championGrid.innerHTML = `<div style="opacity:.85;padding:10px;">Failed to load game data (check console).</div>`;
    console.error(err);
  }

  searchInput.addEventListener("input", applyFilters);

  if (laneFilters) {
    laneFilters.addEventListener("click", (e) => {
      const btn = e.target.closest(".laneBtn");
      if (!btn) return;

      document.querySelectorAll(".laneBtn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      currentLane = btn.dataset.lane || "ALL";
      applyFilters();
    });
  }

  btnBack.addEventListener("click", () => {
    showPage("select");
    history.replaceState(null, "", location.pathname);
  });

  btnReroll.addEventListener("click", reroll);

  btnCopyText.addEventListener("click", copyText);
  btnCopyLink.addEventListener("click", copyLink);
  btnPreview.addEventListener("click", openPreview);

  btnCloseModal?.addEventListener("click", closeModal);
  modalBackdrop?.addEventListener("click", closeModal);
  btnDownloadPNG?.addEventListener("click", downloadPNG);
  btnCopyPNG?.addEventListener("click", copyPNG);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && previewModal && !previewModal.classList.contains("hidden")) closeModal();
  });

  if (gridWrap) {
    gridWrap.addEventListener("scroll", () => {
      gridWrap.classList.add("isScrolling");
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => gridWrap.classList.remove("isScrolling"), 700);
    });
  }
}

init();
