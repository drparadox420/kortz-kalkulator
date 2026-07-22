let timerInterval = null; 
let timeRemainingSeconds = 17 * 60;

function toggleTimer() {
    let btn = document.getElementById('timer-toggle-btn');
    if (timerInterval) { 
        clearInterval(timerInterval); 
        timerInterval = null; 
        btn.innerText = "Start"; 
        btn.style.backgroundColor = "#00e1ff"; 
    } else {
        btn.innerText = "Pause"; 
        btn.style.backgroundColor = "#ff3b30"; 
        btn.style.color = "#fff";
        timerInterval = setInterval(() => {
            if (timeRemainingSeconds > 0) {
                timeRemainingSeconds--;
                let mins = Math.floor(timeRemainingSeconds / 60).toString().padStart(2, '0');
                let secs = (timeRemainingSeconds % 60).toString().padStart(2, '0');
                document.getElementById('time-clock').innerText = mins + ":" + secs;
            } else { 
                clearInterval(timerInterval); 
                document.getElementById('time-clock').innerText = "00:00 - TIME OUT"; 
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
    btn.style.backgroundColor = "#00e1ff"; 
    btn.style.color = "#000";
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.gold-chk').forEach(chk => {
        chk.addEventListener('change', function() {
            let id = this.getAttribute('data-id');
            let card = document.getElementById('row-' + id);
            if(card) { card.classList.toggle('gold-box-row', this.checked); }
            updateGoldManifestTracker();
        });
    });
    updateGoldManifestTracker();
});

function updateGoldManifestTracker() {
    let crewSize = parseInt(document.getElementById('crew-size').value);
    let checkedBoxes = document.querySelectorAll('.gold-chk:checked');
    let displayList = []; 
    let grandGoldTotal = 0;
    let multiIds = ['blueprints', 'circleback', 'gemstone', 'meteorite', 'crewfertility', 'circlets', 'algernon'];

    checkedBoxes.forEach(chk => {
        let id = chk.getAttribute('data-id');
        let isMulti = multiIds.includes(id);
        let isBlocked = (crewSize === 1 && isMulti);
        let displayLabel = id.toUpperCase();
        
        if (isBlocked) {
            displayList.push("<span class='hud-alert-row'>★ " + displayLabel + " [NOT POSSIBLE IN SOLO RUN]</span>");
        } else {
            let valInput = document.getElementById('val-' + id);
            let cashVal = valInput ? (parseFloat(valInput.value) || parseFloat(valInput.placeholder.replace(/[^0-9]/g, '')) || 0) : 0;
            displayList.push("★ " + displayLabel + " ($" + cashVal.toLocaleString() + ")");
            grandGoldTotal += cashVal;
        }
    });
    
    let container = document.getElementById('special-list-container');
    if (container) container.innerHTML = displayList.length > 0 ? displayList.join('<br>') : "No targets flagged yet.";
    let totalVal = document.getElementById('special-total-val');
    if (totalVal) totalVal.innerText = "$" + grandGoldTotal.toLocaleString();
}

function calculateHeistPayout() {
    document.querySelectorAll('.loot-card').forEach(el => { 
        el.style.border = ""; 
        el.classList.remove('gold-box-row'); 
        el.classList.remove('card-burned'); 
    });
    
    let crewSize = parseInt(document.getElementById('crew-size').value);
    let maxCapacityPct = crewSize * 100; 
    let availableLootItems = [];
    let multiIds = ['blueprints', 'circleback', 'gemstone', 'meteorite', 'crewfertility', 'circlets', 'algernon'];

    const numInputs = document.querySelectorAll('.loot-card input[type="number"]');
    numInputs.forEach(input => {
        let id = input.id.replace('val-', '');
        let card = document.getElementById('row-' + id);
        let val = parseFloat(input.value) || 0;
        
        if (val <= 0 && !input.placeholder.includes('Average Price')) {
            if (card) card.classList.add('card-burned');
            return;
        }

        if (crewSize === 1 && multiIds.includes(id)) {
            if (card) card.classList.add('card-burned');
            return;
        }

        let paintings = ['explain', 'see', 'duchessa', 'canis', 'orange', 'chief', 'cooked', 'sawed', 'circleback', 'blueprints'];
        let pct = id.startsWith('v') ? parseFloat(input.getAttribute('data-pct')) : (paintings.includes(id) ? 50 : (id === 'van' ? 25 : (id === 'skull' || id === 'pedright' || id === 'pedleft' || id === 'algernon' || id === 'gemstone' || id === 'meteorite' ? 30 : (id === 'egg' || id === 'downegg' || id === 'fertility' || id === 'crewfertility' ? 20 : 10))));
        
        if (val > 0 && pct > 0) availableLootItems.push({ id: id, label: id.toUpperCase(), value: val, weight: pct });
    });

    let scale = 10; 
    let W = Math.round(maxCapacityPct * scale); 
    let n = availableLootItems.length;
    let dp = Array(n + 1).fill().map(() => Array(W + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        let itemWeight = Math.round(availableLootItems[i-1].weight * scale);
        for (let w = 0; w <= W; w++) {
            if (itemWeight <= w) { 
                dp[i][w] = Math.max(availableLootItems[i-1].value + dp[i-1][w - itemWeight], dp[i-1][w]); 
            } else { 
                dp[i][w] = dp[i-1][w]; 
            }
        }
    }

    let w = W; 
    let selected = []; 
    let baseTake = 0; 
    let pctUsed = 0;
    for (let i = n; i > 0; i--) {
        if (dp[i][w] !== dp[i-1][w]) {
            selected.push(availableLootItems[i-1]); 
            baseTake += availableLootItems[i-1].value;
            pctUsed += availableLootItems[i-1].weight; 
            w -= Math.round(availableLootItems[i-1].weight * scale);
        }
    }

    let lockBoxCashAdd = 0;
    if (document.getElementById('chk-autobox').checked && pctUsed < maxCapacityPct) {
        let boxCount = Math.floor((maxCapacityPct - pctUsed) / 5);
        lockBoxCashAdd = boxCount * 7500; 
        pctUsed += (boxCount * 5);
        document.getElementById('lockbox-row').style.display = "block";
    } else { 
        document.getElementById('lockbox-row').style.display = "none"; 
    }

    let primInput = document.getElementById('val-primary');
    let primVal = parseFloat(primInput.value) || 300000;
    let finalPrim = (document.getElementById('opt-primary').value === 'keep') ? 0 : primVal;

    let hardPremium = document.getElementById('chk-hard').checked ? ((baseTake + lockBoxCashAdd) * 0.10) : 0;
    let bonuses = (document.getElementById('chk-special').checked ? 50000 : 0) + (document.getElementById('chk-elite').checked ? 150000 : 0);
    let finalTotal = baseTake + lockBoxCashAdd + hardPremium + bonuses + finalPrim;

    let htmlManifest = [];
    selected.forEach(item => {
        htmlManifest.push("• " + item.label + " (" + item.weight + "% Capacity)");
        let card = document.getElementById('row-' + item.id); 
        if(card) { 
            card.style.border = "2px solid #00ff88"; 
            card.style.backgroundColor = "rgba(0, 255, 136, 0.08)"; 
        }
    });
    
    if(document.getElementById('chk-autobox').checked && lockBoxCashAdd > 0) htmlManifest.push("• Auto-Filled Vault Lock Boxes");

    document.getElementById('slots-total-cap').innerText = maxCapacityPct;
    document.getElementById('slots-used').innerText = pctUsed.toFixed(0);
    document.getElementById('loot-recommendation').innerHTML = htmlManifest.join('<br>') || "No items selected.";
    document.getElementById('res-base').innerText = "$" + baseTake.toLocaleString();
    document.getElementById('res-lockbox').innerText = "$" + lockBoxCashAdd.toLocaleString();
    document.getElementById('res-hard').innerText = "$" + Math.round(hardPremium).toLocaleString();
    document.getElementById('res-bonus').innerText = "$" + bonuses.toLocaleString();
    document.getElementById('res-primary').innerText = "$" + finalPrim.toLocaleString();
    document.getElementById('res-total').innerText = "$" + Math.round(finalTotal).toLocaleString();
    document.getElementById('results-box').style.display = 'block';
}

let voiceRecognition = null;
function toggleVoiceListening() {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!window.SpeechRecognition) { alert("Speech matching not supported on this host client browser."); return; }
    let btn = document.getElementById('voice-ptt-btn');
    if (voiceRecognition) { voiceRecognition.stop(); return; }
    voiceRecognition = new window.SpeechRecognition();
    voiceRecognition.continuous = false; 
    voiceRecognition.interimResults = false; 
    voiceRecognition.lang = 'en-US';
    
    voiceRecognition.onstart = () => { btn.classList.add('listening'); };
    voiceRecognition.onend = () => { btn.classList.remove('listening'); voiceRecognition = null; };
    voiceRecognition.onerror = () => { btn.classList.remove('listening'); voiceRecognition = null; };
    
    voiceRecognition.onresult = (event) => {
        let textCommand = event.results[0].transcript.toLowerCase();
        let rawDigits = textCommand.replace(/\s+/g, '').match(/\d+/);
        let targetVal = 0;

        if (rawDigits) {
            targetVal = parseInt(rawDigits[0]);
            if (textCommand.includes('thousand') && targetVal < 1000) targetVal *= 1000;
            else if (textCommand.includes('grand') || textCommand.includes(' k')) targetVal *= 1000;
        }
        
        if (targetVal < 1000 && targetVal > 0) { targetVal *= 1000; }
        if (targetVal === 0) return;

        let targetId = null;
        if (textCommand.includes('hunter')) targetId = 'vleftfront';
        else if (textCommand.includes('friends')) targetId = 'vrightfront';
        else if (textCommand.includes('swing')) targetId = 'vleftback';
        else if (textCommand.includes('gouden') || textCommand.includes('hondje')) targetId = 'vrightback';
        else if (textCommand.includes('explain')) targetId = 'explain';
        else if (textCommand.includes('see me')) targetId = 'see';
        else if (textCommand.includes('duchessa')) targetId = 'duchessa';
        else if (textCommand.includes('canis')) targetId = 'canis';
        else if (textCommand.includes('orange')) targetId = 'orange';
        else if (textCommand.includes('chief')) targetId = 'chief';
        else if (textCommand.includes('skull')) targetId = 'skull';
        else if (textCommand.includes('downstairs egg')) targetId = 'downegg';
        else if (textCommand.includes('hoops')) targetId = 'hoops';
        else if (textCommand.includes('bracelet')) targetId = 'coquardbracelets';
        else if (textCommand.includes('horse')) targetId = 'pedleft';
        else if (textCommand.includes('carcanet')) targetId = 'pedright';
        else if (textCommand.includes('upstairs egg')) targetId = 'egg';
        else if (textCommand.includes('cooked')) targetId = 'cooked';
        else if (textCommand.includes('sawed')) targetId = 'sawed';
        else if (textCommand.includes('van')) targetId = 'van';
        else if (textCommand.includes('circle back')) targetId = 'circleback';
        else if (textCommand.includes('blueprint')) targetId = 'blueprints';
        else if (textCommand.includes('venus') || textCommand.includes('algernon')) targetId = 'algernon';
        else if (textCommand.includes('crew fertility')) targetId = 'crewfertility';
        else if (textCommand.includes('circlet')) targetId = 'circlets';
        else if (textCommand.includes('gemstone')) targetId = 'gemstone';
        else if (textCommand.includes('meteorite')) targetId = 'meteorite';
        else if (textCommand.includes('fertility')) targetId = 'fertility';

        if (targetId) {
            let inputField = document.getElementById('val-' + targetId);
            if (inputField) {
                inputField.value = targetVal;
                let card = document.getElementById('row-' + targetId);
                if (card) { 
                    card.style.borderColor = '#00ff88'; 
                    setTimeout(() => { card.style.borderColor = ''; }, 1500); 
                }
                updateGoldManifestTracker();
            }
        }
    };
    voiceRecognition.start();
}
