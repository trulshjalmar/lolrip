// CHAMPIONS: legg til flere etter hvert.
// scales: hva de typisk bygger (for å unngå helt meningsløs AD/AP)
// style: valgfritt - brukes hvis du vil gjøre det smartere senere
const champions = [
  { name: "Ahri", title: "the Nine-Tailed Fox", role: "Mage", scales: ["AP"] },
  { name: "Garen", title: "The Might of Demacia", role: "Fighter", scales: ["AD", "TANK"] },
  { name: "Jinx", title: "the Loose Cannon", role: "Marksman", scales: ["AD", "CRIT"] },
  { name: "Leona", title: "the Radiant Dawn", role: "Tank", scales: ["TANK"] },
  { name: "Thresh", title: "the Chain Warden", role: "Support", scales: ["SUPPORT", "TANK"] },
];

// ITEMS: kategori bestemmer emoji + “passer”-filter.
// boots: egne boots (velges separat)
const itemEmojis = {
  AD: "⚔️",
  AP: "✨",
  TANK: "🛡️",
  SUPPORT: "🧿",
  ON_HIT: "🎯",
  CRIT: "💥",
  MEME: "🤡",
  BOOTS: "👢",
};

const items = [
  { name: "Rabadon's Deathcap", category: "AP", stats: "+140 AP" },
  { name: "Luden's Companion", category: "AP", stats: "+AP +Magic Pen" },
  { name: "Infinity Edge", category: "CRIT", stats: "+AD +Crit" },
  { name: "Kraken Slayer", category: "ON_HIT", stats: "+AS +On-Hit" },
  { name: "Black Cleaver", category: "AD", stats: "+AD +HP" },
  { name: "Sunfire Aegis", category: "TANK", stats: "+HP +Armor" },
  { name: "Knight's Vow", category: "SUPPORT", stats: "+HP +Utility" },
  { name: "Warmog's Armor", category: "TANK", stats: "+HP" },

  // litt meme (valgfritt)
  { name: "Mejai's Soulstealer", category: "MEME", stats: "+AP (snowball)" },
];

const boots = [
  { name: "Plated Steelcaps", category: "BOOTS", stats: "+Armor +MS" },
  { name: "Mercury's Treads", category: "BOOTS", stats: "+MR +Tenacity +MS" },
  { name: "Sorcerer's Shoes", category: "BOOTS", stats: "+Magic Pen +MS" },
  { name: "Berserker's Greaves", category: "BOOTS", stats: "+AS +MS" },
];

// RUNES
const runeTrees = ["Precision", "Domination", "Sorcery", "Resolve", "Inspiration"];
const keystones = [
  { name: "Press the Attack", tree: "Precision" },
  { name: "Lethal Tempo", tree: "Precision" },
  { name: "Conqueror", tree: "Precision" },
  { name: "Electrocute", tree: "Domination" },
  { name: "Dark Harvest", tree: "Domination" },
  { name: "Summon Aery", tree: "Sorcery" },
  { name: "Arcane Comet", tree: "Sorcery" },
  { name: "Phase Rush", tree: "Sorcery" },
  { name: "Grasp of the Undying", tree: "Resolve" },
  { name: "Aftershock", tree: "Resolve" },
  { name: "Guardian", tree: "Resolve" },
  { name: "Glacial Augment", tree: "Inspiration" },
  { name: "First Strike", tree: "Inspiration" },
];

// SUMMONERS
const summoners = [
  { name: "Flash", emoji: "⚡" },
  { name: "Ignite", emoji: "🔥" },
  { name: "Teleport", emoji: "🌀" },
  { name: "Ghost", emoji: "💨" },
  { name: "Heal", emoji: "💚" },
  { name: "Barrier", emoji: "🛑" },
  { name: "Cleanse", emoji: "🧼" },
  { name: "Exhaust", emoji: "😮‍💨" },
  { name: "Smite", emoji: "🪓" },
  { name: "Clarity", emoji: "💧" },
  { name: "Mark", emoji: "🎯" }, // ARAM
];

// FLAVOR
const cursedNames = [
  "The Inting Special",
  "Report Me Please",
  "0/10 Power Spike",
  "Solo Lose Condition",
  "Ping Me Again",
];

const cursedDescs = [
  "Your teammates will dodge. Your enemies will laugh.",
  "Build this and become a living cautionary tale.",
  "If it works, it's genius. If not, it's your jungler.",
  "You are not allowed to type after 10 minutes.",
  "Trust the process (do not trust the process).",
];
