/* advancedMode.js - Extension for mode selector and role quests */

// Role quest items
const jungleItems = [
  { name: "Mosstomper Seedling", stats: "Jungle Pet +Shield" },
  { name: "Gustwalker Hatchling", stats: "Jungle Pet +MS" },
  { name: "Scorchclaw Pup", stats: "Jungle Pet +Burn" },
];

const supportItems = [
  { name: "World Atlas", stats: "Support Quest Item" },
];

const aramSummoners = [
  { name: "Clarity", emoji: "💧" },
  { name: "Mark", emoji: "🎯" },
];

// Get elements
const advancedToggle = document.getElementById('advancedToggle');
const advancedOptions = document.getElementById('advancedOptions');
const jungleToggle = document.getElementById('jungleToggle');
const supportToggle = document.getElementById('supportToggle');
const modeButtons = document.querySelectorAll('.modeBtn');
const currentModeLabel = document.getElementById('currentMode');

// Global state
window.gameMode = 'NORMALS';
window.isJungle = false;
window.isSupport = false;
window.isARAM = false;

// Update mode label
function updateModeLabel() {
  if (currentModeLabel) {
    const modeNames = {
      'NORMALS': 'Normals',
      'ARAM': 'ARAM',
      'ARUF': 'ARUF'
    };
    currentModeLabel.textContent = modeNames[window.gameMode] || 'Normals';
  }
}

// Advanced toggle
if (advancedToggle && advancedOptions) {
  advancedToggle.addEventListener('click', () => {
    const isHidden = advancedOptions.classList.contains('hidden');
    
    if (isHidden) {
      advancedOptions.classList.remove('hidden');
      advancedToggle.classList.add('active');
    } else {
      advancedOptions.classList.add('hidden');
      advancedToggle.classList.remove('active');
    }
  });
}

// Mode selector
modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active from all
    modeButtons.forEach(b => b.classList.remove('active'));
    // Add active to clicked
    btn.classList.add('active');
    
    // Update global state
    window.gameMode = btn.dataset.mode;
    window.isARAM = window.gameMode === 'ARAM';
    
    // Update the label
    updateModeLabel();
    
    // If ARAM, show/hide advanced options appropriately
    if (window.isARAM) {
      // Can't have jungle in ARAM
      if (jungleToggle) {
        jungleToggle.disabled = true;
        jungleToggle.checked = false;
        window.isJungle = false;
        jungleToggle.parentElement.style.opacity = '0.5';
        jungleToggle.parentElement.style.pointerEvents = 'none';
      }
      // Can have support
      if (supportToggle) {
        supportToggle.disabled = false;
        supportToggle.parentElement.style.opacity = '1';
        supportToggle.parentElement.style.pointerEvents = 'auto';
      }
    } else {
      // Normals or ARUF - enable both
      if (jungleToggle) {
        jungleToggle.disabled = false;
        jungleToggle.parentElement.style.opacity = '1';
        jungleToggle.parentElement.style.pointerEvents = 'auto';
      }
      if (supportToggle) {
        supportToggle.disabled = false;
        supportToggle.parentElement.style.opacity = '1';
        supportToggle.parentElement.style.pointerEvents = 'auto';
      }
    }
    
    console.log('Mode changed:', window.gameMode);
  });
});

// Jungle checkbox
if (jungleToggle) {
  jungleToggle.addEventListener('change', (e) => {
    window.isJungle = e.target.checked;
    
    // If jungle is checked, uncheck support
    if (window.isJungle && supportToggle) {
      supportToggle.checked = false;
      window.isSupport = false;
    }
    
    console.log('Jungle mode:', window.isJungle);
  });
}

// Support checkbox
if (supportToggle) {
  supportToggle.addEventListener('change', (e) => {
    window.isSupport = e.target.checked;
    
    // If support is checked, uncheck jungle
    if (window.isSupport && jungleToggle) {
      jungleToggle.checked = false;
      window.isJungle = false;
    }
    
    console.log('Support mode:', window.isSupport);
  });
}

// Helper functions to filter items/summoners based on mode
window.getAvailableSummoners = function(baseSummoners) {
  let available = [...baseSummoners];
  
  // Add Smite if jungle
  if (window.isJungle && jungleSummoners) {
    available = available.concat(jungleSummoners);
  }
  
  // Add ARAM summoners if ARAM
  if (window.isARAM && aramSummoners) {
    available = available.concat(aramSummoners);
  }
  
  // Remove Teleport if not Normals/ARUF
  if (window.isARAM) {
    available = available.filter(s => s.name !== 'Teleport');
  }
  
  return available;
};

window.getAvailableItems = function(baseItems) {
  let available = [...baseItems];
  
  // Add jungle pet if jungle
  if (window.isJungle && jungleItems) {
    available = available.concat(jungleItems);
  }
  
  // Add World Atlas if support
  if (window.isSupport && supportItems) {
    available = available.concat(supportItems);
  }
  
  return available;
};

// Smooth scroll to build when generated
window.scrollToBuild = function() {
  const buildCard = document.querySelector('.buildCard');
  if (buildCard) {
    buildCard.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }
};

console.log('Advanced mode script loaded');
