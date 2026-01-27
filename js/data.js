// CHAMPIONS: Updated for patch 26.2
// lanes: which lanes they typically play
// scales: what they typically build
const champions = [
  { name: "Aatrox", title: "the Darkin Blade", lanes: ["TOP"], scales: ["AD", "TANK"] },
  { name: "Ahri", title: "the Nine-Tailed Fox", lanes: ["MID"], scales: ["AP"] },
  { name: "Akali", title: "the Rogue Assassin", lanes: ["MID", "TOP"], scales: ["AP", "AD"] },
  { name: "Ashe", title: "the Frost Archer", lanes: ["ADC"], scales: ["AD", "CRIT"] },
  { name: "Blitzcrank", title: "the Great Steam Golem", lanes: ["SUPPORT"], scales: ["SUPPORT", "TANK"] },
  { name: "Caitlyn", title: "the Sheriff of Piltover", lanes: ["ADC"], scales: ["AD", "CRIT"] },
  { name: "Darius", title: "the Hand of Noxus", lanes: ["TOP"], scales: ["AD", "TANK"] },
  { name: "Draven", title: "the Glorious Executioner", lanes: ["ADC"], scales: ["AD", "CRIT"] },
  { name: "Ezreal", title: "the Prodigal Explorer", lanes: ["ADC", "MID"], scales: ["AD", "AP"] },
  { name: "Garen", title: "The Might of Demacia", lanes: ["TOP"], scales: ["AD", "TANK"] },
  { name: "Jinx", title: "the Loose Cannon", lanes: ["ADC"], scales: ["AD", "CRIT"] },
  { name: "Kayle", title: "the Righteous", lanes: ["TOP", "MID"], scales: ["AP", "AD"] },
  { name: "Lee Sin", title: "the Blind Monk", lanes: ["JUNGLE"], scales: ["AD", "TANK"] },
  { name: "Leona", title: "the Radiant Dawn", lanes: ["SUPPORT"], scales: ["TANK", "SUPPORT"] },
  { name: "Lux", title: "the Lady of Luminosity", lanes: ["MID", "SUPPORT"], scales: ["AP"] },
  { name: "Master Yi", title: "the Wuju Bladesman", lanes: ["JUNGLE"], scales: ["AD", "ON_HIT", "CRIT"] },
  { name: "Miss Fortune", title: "the Bounty Hunter", lanes: ["ADC"], scales: ["AD", "CRIT"] },
  { name: "Nasus", title: "the Curator of the Sands", lanes: ["TOP"], scales: ["AD", "TANK"] },
  { name: "Thresh", title: "the Chain Warden", lanes: ["SUPPORT"], scales: ["SUPPORT", "TANK"] },
  { name: "Yasuo", title: "the Unforgiven", lanes: ["MID", "TOP"], scales: ["AD", "CRIT"] },
  { name: "Zed", title: "the Master of Shadows", lanes: ["MID"], scales: ["AD"] },
];

// Item categories with emojis
const itemEmojis = {
  AD: "⚔️",
  AP: "✨",
  TANK: "🛡️",
  SUPPORT: "🧿",
  ON_HIT: "🎯",
  CRIT: "💥",
  BOOTS: "👢",
};

// ITEMS - Updated for Patch 26.2 (NO PRISMATIC/ARENA ITEMS)
const items = [
  // AP Items
  { name: "Rabadon's Deathcap", category: "AP", stats: "+140 AP" },
  { name: "Luden's Companion", category: "AP", stats: "+AP +Magic Pen" },
  { name: "Shadowflame", category: "AP", stats: "+AP +Magic Pen" },
  { name: "Stormsurge", category: "AP", stats: "+AP +MS" },
  { name: "Malignance", category: "AP", stats: "+AP +AH" },
  { name: "Liandry's Torment", category: "AP", stats: "+AP +HP" },
  { name: "Cosmic Drive", category: "AP", stats: "+AP +AH +MS" },
  { name: "Horizon Focus", category: "AP", stats: "+AP +Range" },
  { name: "Void Staff", category: "AP", stats: "+AP +% Magic Pen" },
  { name: "Cryptbloom", category: "AP", stats: "+AP +Magic Pen" },
  
  // AD/Crit Items
  { name: "Infinity Edge", category: "CRIT", stats: "+AD +Crit" },
  { name: "Kraken Slayer", category: "ON_HIT", stats: "+AS +On-Hit" },
  { name: "Stormrazor", category: "CRIT", stats: "+AD +AS +Crit" },
  { name: "The Collector", category: "AD", stats: "+AD +Crit +Lethality" },
  { name: "Bloodthirster", category: "AD", stats: "+AD +Lifesteal" },
  { name: "Mortal Reminder", category: "CRIT", stats: "+AD +Crit +GW" },
  { name: "Phantom Dancer", category: "CRIT", stats: "+AS +Crit +MS" },
  { name: "Runaan's Hurricane", category: "ON_HIT", stats: "+AS +Crit +Bolts" },
  { name: "Navori Flickerblade", category: "CRIT", stats: "+AD +Crit +AH" },
  
  // Fighter/Bruiser Items
  { name: "Black Cleaver", category: "AD", stats: "+AD +HP +AH" },
  { name: "Sterak's Gage", category: "AD", stats: "+AD +HP" },
  { name: "Death's Dance", category: "AD", stats: "+AD +Armor +AH" },
  { name: "Maw of Malmortius", category: "AD", stats: "+AD +MR" },
  { name: "Ravenous Hydra", category: "AD", stats: "+AD +Omnivamp" },
  { name: "Spear of Shojin", category: "AD", stats: "+AD +HP +AH" },
  { name: "Eclipse", category: "AD", stats: "+AD +Lethality" },
  
  // Tank Items
  { name: "Sunfire Aegis", category: "TANK", stats: "+HP +Armor" },
  { name: "Warmog's Armor", category: "TANK", stats: "+HP +Regen" },
  { name: "Thornmail", category: "TANK", stats: "+Armor +HP" },
  { name: "Spirit Visage", category: "TANK", stats: "+MR +HP +AH" },
  { name: "Randuin's Omen", category: "TANK", stats: "+Armor +HP" },
  { name: "Frozen Heart", category: "TANK", stats: "+Armor +Mana +AH" },
  { name: "Force of Nature", category: "TANK", stats: "+MR +HP +MS" },
  { name: "Abyssal Mask", category: "TANK", stats: "+MR +HP +Mana" },
  
  // Support Items
  { name: "Redemption", category: "SUPPORT", stats: "+HP +AH" },
  { name: "Locket of the Iron Solari", category: "SUPPORT", stats: "+HP +AH" },
  { name: "Knight's Vow", category: "SUPPORT", stats: "+HP +Armor" },
  { name: "Mikael's Blessing", category: "SUPPORT", stats: "+AH +Mana Regen" },
  { name: "Ardent Censer", category: "SUPPORT", stats: "+AP +AH" },
  { name: "Staff of Flowing Water", category: "SUPPORT", stats: "+AP +Mana Regen" },
];

// BOOTS
const boots = [
  { name: "Plated Steelcaps", category: "BOOTS", stats: "+Armor +MS" },
  { name: "Mercury's Treads", category: "BOOTS", stats: "+MR +Tenacity +MS" },
  { name: "Sorcerer's Shoes", category: "BOOTS", stats: "+Magic Pen +MS" },
  { name: "Berserker's Greaves", category: "BOOTS", stats: "+AS +MS" },
  { name: "Ionian Boots of Lucidity", category: "BOOTS", stats: "+AH +MS" },
  { name: "Boots of Swiftness", category: "BOOTS", stats: "+MS +Slow Resist" },
];

// ROLE QUEST ITEMS (Jungle Pets & Support)
const jungleItems = [
  { name: "Mosstomper Seedling", category: "TANK", stats: "Jungle Pet +Shield" },
  { name: "Gustwalker Hatchling", category: "AD", stats: "Jungle Pet +MS" },
  { name: "Scorchclaw Pup", category: "AP", stats: "Jungle Pet +Burn" },
];

const supportItems = [
  { name: "World Atlas", category: "SUPPORT", stats: "Support Quest Item" },
];

// RUNES - Updated for 2026
const runeTrees = ["Precision", "Domination", "Sorcery", "Resolve", "Inspiration"];

const keystones = [
  // Precision
  { name: "Press the Attack", tree: "Precision" },
  { name: "Lethal Tempo", tree: "Precision" },
  { name: "Conqueror", tree: "Precision" },
  { name: "Fleet Footwork", tree: "Precision" },
  
  // Domination
  { name: "Electrocute", tree: "Domination" },
  { name: "Dark Harvest", tree: "Domination" },
  { name: "Hail of Blades", tree: "Domination" },
  
  // Sorcery
  { name: "Summon Aery", tree: "Sorcery" },
  { name: "Arcane Comet", tree: "Sorcery" },
  { name: "Phase Rush", tree: "Sorcery" },
  
  // Resolve
  { name: "Grasp of the Undying", tree: "Resolve" },
  { name: "Aftershock", tree: "Resolve" },
  { name: "Guardian", tree: "Resolve" },
  
  // Inspiration
  { name: "Glacial Augment", tree: "Inspiration" },
  { name: "First Strike", tree: "Inspiration" },
];

// SUMMONER SPELLS
const summoners = [
  { name: "Flash", emoji: "⚡" },
  { name: "Ignite", emoji: "🔥" },
  { name: "Teleport", emoji: "🌀" },
  { name: "Ghost", emoji: "💨" },
  { name: "Heal", emoji: "💚" },
  { name: "Barrier", emoji: "🛑" },
  { name: "Cleanse", emoji: "🧼" },
  { name: "Exhaust", emoji: "😮‍💨" },
];

// Mode-specific summoners
const jungleSummoners = [
  { name: "Smite", emoji: "🪓" },
];

const aramSummoners = [
  { name: "Clarity", emoji: "💧" },
  { name: "Mark", emoji: "🎯" }, // ARAM Snowball
];

// FLAVOR TEXT
const cursedNames = [
  "The Inting Special",
  "Report Me Please",
  "0/10 Power Spike",
  "Solo Lose Condition",
  "Ping Me Again",
  "Turboint Protocol",
  "The Soft Reset",
  "Running It Down Mid",
  "Uninstall Recommended",
  "Bronze 4 Masterclass",
];

const cursedDescs = [
  "Your teammates will dodge. Your enemies will laugh.",
  "Build this and become a living cautionary tale.",
  "If it works, it's genius. If not, it's your jungler's fault.",
  "You are not allowed to type after 10 minutes.",
  "Trust the process (do not trust the process).",
  "Flame-proof build (you will still get flamed).",
  "Works 60% of the time, every time. In ARAM.",
  "Your honor level is already at 0 with this build.",
  "This build was banned in 3 regions.",
  "Challenger players hate this one weird trick.",
];
