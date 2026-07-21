/* ==========================================================================
   KORTZ CENTER HEIST MASTER MATRIX v5.0-ALPHA - LOGIC & CALCULATION ENGINE
   ========================================================================== */

const LOOT_PROPERTIES = {
    canis: { weight: 50, label: "PAINTING: CANIS HOMINEM EDIT" },
    orange: { weight: 50, label: "PAINTING: ORANGE CRUSH" },
    pharaonic: { weight: 10, label: "PHARAONIC BANDS (FAR)" },
    explain: { weight: 50, label: "PAINTING: EXPLAIN YOURSELF" },
    duchesse: { weight: 50, label: "PAINTING: LA DUCHESSE" },
    see: { weight: 50, label: "PAINTING: DO YOU SEE ME" },
    coquardrings: { weight: 10, label: "COQUARD RINGS (OUTSIDE WALL)" },
    fertility: { weight: 20, label: "MIDDLE FLOOR FERTILITY STATUE" },
    antiquebands: { weight: 10, label: "ANTIQUE BANDS (RIGHT CASE)" },
    artdecorings: { weight: 10, label: "ART DECO RINGS (LEFT CASE)" },
    antiquerings: { weight: 10, label: "ANTIQUE RINGS (SECURITY DOOR)" },
    chief: { weight: 50, label: "PAINTING: THE CHIEF" },
    vleftback: { weight: 50, label: "VAULT PAINTING: SWING SET" },
    vleftfront: { weight: 50, label: "VAULT PAINTING: THE HUNTER" },
    vrightfront: { weight: 50, label: "VAULT PAINTING: WITH FRIENDS" },
    vrightback: { weight: 50, label: "VAULT PAINTING: HET GOUDEN HONDJE" },
    van: { weight: 30, label: "LOADING BAY VAN CARGO ASSET", critical: true },
    skull: { weight: 30, label: "PEDESTAL: MORI SKULL" },
    downegg: { weight: 20, label: "DOWNSTAIRS DECORATIVE EGG" },
    hoops: { weight: 10, label: "BYZANTINE HOOPS" },
    egg: { weight: 20, label: "UPSTAIRS DECORATIVE EGG" },
    pedright: { weight: 30, label: "PEDESTAL: CARCANETS" },
    pedleft: { weight: 30, label: "PEDESTAL: HORSE STATUE" },
    coquardbracelets: { weight: 10, label: "COQUARD BRACELETS" },
    sodoff: { weight: 50, label: "PAINTING: SOD OFF" },
    cooked: { weight: 50, label: "PAINTING: COOKED" },
    crewfertility: { weight: 20, label: "CREW RM: FERTILITY STATUE", crewRoom: true },
    blueprints: { weight: 50, label: "CREW RM: FORGO BLUEPRINTS", crewRoom: true },
    circleback: { weight: 50, label: "CREW RM: GREAT CIRCLE BACK", crewRoom: true },
    gemstone: { weight: 30, label: "CREW RM: PEDESTAL GEMSTONE", crewRoom: true },
    meteorite: { weight: 30, label: "CREW RM: METEORITE FRAGMENTS", crewRoom: true },
    algernon: { weight: 30, label: "CREW RM: VENUS D ALGERNON", crewRoom: true },
    circlets: { weight: 10, label: "CREW RM: ART DECO CIRCLETS", crewRoom: true }
};

// TIMER CONTROLS
let timerInterval = null; 
let timeRemainingSeconds = 17 * 60;

function toggleTimer() {
    let btn = document.getElementById('timer-toggle-btn');
    if (timerInterval) { 
        clearInterval(timerInterval); 
        timerInterval = null; 
        btn.innerText = "Start"; 
        btn.style.backgroundColor = "var(--neon-blue)"; 
    } else {
        btn.innerText = "Pause"; 
        btn.style.backgroundColor = "var(--alert-red)"; 
        btn.style.color = "#fff";
        timerInterval = setInterval(() => {
            if (timeRemainingSeconds > 0) {
                timeRemainingSeconds--;
                let mins = Math.floor(timeRemainingSeconds / 60).toString().padStart(2, '0');
                let secs = (timeRemainingSeconds % 60).toString().padStart(2, '0');
                document.getElementById('time-clock').innerText = mins + ":" + secs;
            } else { 
                clearInterval(timerInterval); 
                document.getElementById('time-clock').innerText = "00:00"; 
            }
        }, 1000);
    }
}

function resetTimer() { 
    clearInterval(timerInterval); 
    timerInterval = null; 
    timeRemainingSeconds = 17 * 60; 
    document.getElementById('time-clock').innerText = "17:00"; 
    let btn = document.getElementById('timer-toggle-btn'); 
    btn.innerText = "Start"; 
    btn.style.backgroundColor = "var(--neon-blue)"; 
    btn.style.color = "#000"; 
}

// NAVIGATION MENU DROPDOWN
function toggleLayoutMenuDeck(e) { 
    e.stopPropagation(); 
    document.getElementById('layout-dropdown-menu').classList.toggle('show'); 
}

window.onclick = function() { 
    const menu = document.getElementById('layout-dropdown-menu');
    if (menu) menu.classList.remove('show'); 
};

function setLayoutMode(mode) {
    document.getElementById('btn-layout-desktop').classList.toggle('active', mode === 'desktop');
    document.getElementById('btn-layout-mobile').classList.toggle('active', mode === 'mobile');
    document.body.classList.toggle('mobile-mode', mode === 'mobile');
}

// MULTIPLAYER LOCKOUT MANAGEMENT
function handleCrewLockoutUI() {
    let crewSize = parseInt(document.getElementById('crew-size').value);
    Object.keys(LOOT_PROPERTIES).forEach(key => {
        if (LOOT_PROPERTIES[key].crewRoom) {
            let card = document.getElementById('row-' + key);
            if (card) {
                if (crewSize === 1) {
                    card.classList.add('card-burned');
                    let input = card.querySelector('input[type="number"]');
                    if (input) input.disabled = true;
                    let chk = card.querySelector('input[type="checkbox"]');
                    if (chk) chk.disabled = true;
                } else {
                    card.classList.remove('card-burned');
                    let input = card.querySelector('input[type="number"]');
                    if (input) input.disabled = false;
                    let chk = card.querySelector('input[type="checkbox"]');
                    if (chk) chk.disabled = false;
                }
            }
        }
    });
    saveCurrentState();
}

// VAN SELECTION STATE
function handleVanDropdownStateChange() {
    let state = document.getElementById('state-van').value;
    let input = document.getElementById('val-van');
    if (!input) return;
    
    if (state === 'override') {
        input.disabled = false; 
        input.style.opacity = "1"; 
        input.style.borderColor = "var(--neon-green)"; 
        input.value = ""; 
        input.placeholder = "Enter Live Finale Payout";
    } else if (state === 'average') {
        input.disabled = true; 
        input.style.opacity = "0.5"; 
        input.style.borderColor = "#222"; 
        input.value = "125000";
    } else {
        input.disabled = true; 
        input.style.opacity = "0.5"; 
        input.style.borderColor = "#222"; 
        input.value = "0"; 
        input.placeholder = "($125,000 Locked to Average)";
    }
    saveCurrentState();
}

// PERSISTENT STORAGE SAVER
function saveCurrentState() {
    let state = { inputs: {}, checkboxes: {}, adjustments: {} };
    Object.keys(LOOT_PROPERTIES).forEach(key => {
        let el = document.getElementById('val-' + key);
        if (el) state.inputs[key] = el.value;
        let chk = document.getElementById('chk-' + key);
        if (chk) state.checkboxes[key] = chk.checked;
    });
    
    let primaryInput = document.getElementById('val-primary');
    if (primaryInput) state.inputs['primary'] = primaryInput.value;
    
    state.adjustments['opt-primary'] = document.getElementById('opt-primary').value;
    state.adjustments['state-van'] = document.getElementById('state-van').value;
    state.adjustments['chk-hard'] = document.getElementById('chk-hard').checked;
    state.adjustments['chk-elite'] = document.getElementById('chk-elite').checked;
    state.adjustments['crew-size'] = document.getElementById('crew-size').value;
    
    localStorage.setItem('kortz_heist_matrix_state', JSON.stringify(state));
    updateBuyersRequestHUD();
}

// HYDRATE SAVED DATA ON LOAD
function hydratePersistentState() {
    let raw = localStorage.getItem('kortz_heist_matrix_state');
    if (!raw) return;
    try {
        let state = JSON.parse(raw);
        if (state.inputs) {
            Object.keys(state.inputs).forEach(k => {
                let id = (k === 'primary') ? 'val-primary' : 'val-' + k;
                let el = document.getElementById(id);
                if (el) el.value = state.inputs[k];
            });
        }
        if (state.checkboxes) {
            Object.keys(state.checkboxes).forEach(k => {
                let chk = document.getElementById('chk-' + k);
                if (chk) chk.checked = state.checkboxes[k];
            });
        }
        if (state.adjustments) {
            if (state.adjustments['opt-primary']) document.getElementById('opt-primary').value = state.adjustments['opt-primary'];
            if (state.adjustments['state-van']) document.getElementById('state-van').value = state.adjustments['state-van'];
            if (state.adjustments['chk-hard'] !== undefined) document.getElementById('chk-hard').checked = state.adjustments['chk-hard'];
            if (state.adjustments['chk-elite'] !== undefined) document.getElementById('chk-elite').checked = state.adjustments['chk-elite'];
            if (state.adjustments['crew-size']) document.getElementById('crew-size').value = state.adjustments['crew-size'];
        }
    } catch(e) { console.error("Error restoring local state", e); }
}

// UPDATE BUYER'S REQUEST HUD WIDGET
function updateBuyersRequestHUD() {
    let container = document.getElementById('special-list-container');
    let totalSpan = document.getElementById('special-total-val');
    if (!container || !totalSpan) return;

    let flaggedItems = [];
    let totalBRValue = 0;

    Object.keys(LOOT_PROPERTIES).forEach(key => {
        let chk = document.getElementById('chk-' + key);
        if (chk && chk.checked) {
            let valInput = document.getElementById('val-' + key);
            let val = parseFloat(valInput?.value) || 0;
            if (key === 'van' && document.getElementById('state-van').value === 'average') val = 125000;
            
            flaggedItems.push(`• ${LOOT_PROPERTIES[key].label}`);
            totalBRValue += val;
        }
    });

    if (flaggedItems.length > 0) {
        container.innerHTML = flaggedItems.join('<br>');
    } else {
        container.innerHTML = "No targets flagged yet.";
    }
    totalSpan.innerText = "$" + totalBRValue.toLocaleString();
}

// MASTER KNAPSACK OPTIMIZATION ENGINE
function executeLootOptimization() {
    document.querySelectorAll('.loot-card').forEach(card => {
        card.style.border = ""; 
        card.style.backgroundColor = ""; 
        card.classList.remove('card-burned');
    });

    let crewSize = parseInt(document.getElementById('crew-size').value);
    let maxCapacity = crewSize * 100;
    let availablePool = [];
    let forceIncluded = [];
    let currentWeightAllocated = 0;

    // Loop Pass 1: Parse values & handle van constraints
    Object.keys(LOOT_PROPERTIES).forEach(key => {
        if (crewSize === 1 && LOOT_PROPERTIES[key].crewRoom) return;

        let id = 'val-' + key;
        let input = document.getElementById(id);
        if (!input) return;

        let val = 0;
        if (key === 'van') {
            let state = document.getElementById('state-van').value;
            if (state === 'missing') return;
            else if (state === 'average') val = 125000;
            else val = parseFloat(input.value) || 0;
        } else {
            val = parseFloat(input.value) || 0;
        }

        if (val <= 0) {
            let card = document.getElementById('row-' + key);
            if (card) card.classList.add('card-burned');
            return;
        }

        let itemNode = { key: key, label: LOOT_PROPERTIES[key].label, value: val, weight: LOOT_PROPERTIES[key].weight };

        if (key === 'van') {
            forceIncluded.push(itemNode);
            currentWeightAllocated += itemNode.weight;
        } else {
            availablePool.push(itemNode);
        }
    });

    // Loop Pass 2: Sort by value density
    availablePool.sort((a, b) => {
        let densityA = a.value / a.weight;
        let densityB = b.value / b.weight;
        if (densityA === densityB) return a.weight - b.weight;
        return densityB - densityA;
    });

    let finalManifest = [...forceIncluded];
    let remainingSpace = maxCapacity - currentWeightAllocated;

    // DP Knapsack Phase
    if (remainingSpace > 0 && availablePool.length > 0) {
        let scale = 10;
        let W = Math.round(remainingSpace * scale);
        let n = availablePool.length;
        let dp = Array(n + 1).fill().map(() => Array(W + 1).fill(0));

        for (let i = 1; i <= n; i++) {
            let wItem = Math.round(availablePool[i - 1].weight * scale);
            for (let w = 0; w <= W; w++) {
                if (wItem <= w) {
                    dp[i][w] = Math.max(availablePool[i - 1].value + dp[i - 1][w - wItem], dp[i - 1][w]);
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }

        let w = W;
        for (let i = n; i > 0; i--) {
            if (dp[i][w] !== dp[i - 1][w]) {
                finalManifest.push(availablePool[i - 1]);
                w -= Math.round(availablePool[i - 1].weight * scale);
            }
        }
    }

    // Render Results Output
    let secondaryTotal = 0;
    let totalWeightUsed = 0;
    let recommendationHTML = [];

    finalManifest.forEach(item => {
        secondaryTotal += item.value;
        totalWeightUsed += item.weight;
        recommendationHTML.push(`• ${item.label} (${item.weight}% Loot Bag Space Packed)`);
        
        let card = document.getElementById('row-' + item.key);
        if (card) {
            card.style.border = "2px solid var(--neon-green)";
            card.style.backgroundColor = "rgba(0, 255, 136, 0.08)";
        }
    });

    let isHard = document.getElementById('chk-hard').checked;
    let hardPremium = isHard ? (secondaryTotal * 0.10) : 0;
    let bonusBounty = document.getElementById('chk-elite').checked ? 150000 : 0;
    
    let primaryInput = document.getElementById('val-primary');
    let primaryVal = parseFloat(primaryInput.value) || 300000;
    let primaryTake = (document.getElementById('opt-primary').value === 'keep') ? 0 : primaryVal;

    let netMazeBankDeposit = secondaryTotal + hardPremium + bonusBounty + primaryTake;

    document.getElementById('slots-total-cap').innerText = maxCapacity;
    document.getElementById('slots-used').innerText = totalWeightUsed;
    document.getElementById('loot-recommendation').innerHTML = recommendationHTML.join('<br>') || "Bag strategy clear - No loose targets qualify.";
    document.getElementById('res-base').innerText = "$" + secondaryTotal.toLocaleString();
    document.getElementById('res-hard').innerText = "$" + Math.round(hardPremium).toLocaleString();
    document.getElementById('res-bonus').innerText = "$" + bonusBounty.toLocaleString();
    document.getElementById('res-primary').innerText = "$" + primaryTake.toLocaleString();
    document.getElementById('res-total').innerText = "$" + Math.round(netMazeBankDeposit).toLocaleString();
    
    document.getElementById('results-box').style.display = 'block';
    document.getElementById('weight-ledger-row').style.color = (totalWeightUsed >= maxCapacity) ? "var(--alert-red)" : "";
}

// SESSION COMMITTAL FLOW
function triggerEndSessionSequence() {
    document.getElementById('end-session-modal').style.display = 'flex';
}

function closeSessionGate(commitRun) {
    document.getElementById('end-session-modal').style.display = 'none';
    
    if (commitRun) {
        let sessionData = JSON.parse(localStorage.getItem('kortz_heist_analytics')) || { runs: 7, trackingPool: {} };
        sessionData.runs += 1;
        
        Object.keys(LOOT_PROPERTIES).forEach(key => {
            let id = 'val-' + key;
            let val = parseFloat(document.getElementById(id)?.value) || 0;
            if (key === 'van' && document.getElementById('state-van').value === 'average') val = 125000;
            
            if (val > 0) {
                if (!sessionData.trackingPool[key]) sessionData.trackingPool[key] = [];
                sessionData.trackingPool[key].push(val);
            }
        });
        localStorage.setItem('kortz_heist_analytics', JSON.stringify(sessionData));
    }
    
    // Clear active inputs
    Object.keys(LOOT_PROPERTIES).forEach(key => {
        let el = document.getElementById('val-' + key);
        if (el) el.value = "";
        let chk = document.getElementById('chk-' + key);
        if (chk) chk.checked = false;
    });
    document.getElementById('val-primary').value = "";
    document.getElementById('state-van').value = "missing";
    document.getElementById('results-box').style.display = 'none';
    
    handleVanDropdownStateChange();
    saveCurrentState();
    handleCrewLockoutUI();
}

function factoryResetAnalytics() {
    if (confirm("Completely wipe historical data analytics averages and reset defaults?")) {
        localStorage.removeItem('kortz_heist_matrix_state');
        localStorage.removeItem('kortz_heist_analytics');
        location.reload();
    }
}

// INITIALIZATION
window.onload = () => {
    hydratePersistentState();
    handleCrewLockoutUI();
    handleVanDropdownStateChange();
    updateBuyersRequestHUD();
};
