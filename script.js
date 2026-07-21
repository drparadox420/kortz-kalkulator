/* ==========================================================================
   QUARTZ CENTER HEIST - MASTER TACTICAL LOGIC & CAPACITY ENGINE
   ========================================================================== */

let zoneManifestData = [
    { id: "zone-van", title: "🚛 Zone 1: Loading Bay Area", items: ["Loading Bay Van Cargo Asset (30% Space)"] },
    { id: "zone-vault", title: "🔒 Zone 2: Surveillance Vault / Security Loop", items: ["Painting: The Hunter Becomes the Hunted", "Painting: Het Gouden Hondje"] },
    { id: "zone-downstairs", title: "🚪 Zone 3: Downstairs Enclosures (Elevator Tower)", items: ["Pedestal: Memento non Mori Skull", "Byzantine Hoops"] },
    { id: "zone-middle", title: "🏛️ Zone 4: Middle Level Main Entrance & Staircase", items: ["Middle Floor Fertility Statue", "Painting: Canis Hominem Edit"] },
    { id: "zone-upstairs", title: "🏛️ Zone 5: Upstairs Level Sweep", items: ["Upstairs Decorative Egg", "Pedestal: Carcanets (Necklace)"] },
    { id: "zone-crew", title: "👥 Zone 6: Multiplayer Keycard Vault", items: ["Painting: Don't Forgo Blueprints"] }
];

window.onload = function() {
    calculateLootTotal();
    renderZoneManifest();
};

// CALCULATE BAG CAPACITY & VAN COMBINATIONS
function calculateLootTotal() {
    let totalWeight = 0;

    // Check van status
    const vanSelect = document.getElementById("state-van");
    if (vanSelect && vanSelect.value === "baseline") {
        totalWeight += 30; // Baseline van takes 30% space
    }

    // Sum checked loot items
    const checkboxes = document.querySelectorAll(".loot-item:checked");
    checkboxes.forEach(cb => {
        totalWeight += parseInt(cb.getAttribute("data-weight")) || 0;
    });

    // Update UI elements
    const fillBar = document.getElementById("capacity-fill");
    const capText = document.getElementById("capacity-text");

    if (fillBar && capText) {
        fillBar.style.width = Math.min(totalWeight, 100) + "%";
        
        // Color alert on over-fill
        if (totalWeight > 100) {
            fillBar.style.backgroundColor = "#ff5252";
            capText.innerHTML = `Total Bag Usage: <strong style="color: #ff5252;">${totalWeight}% / 100% (OVER CAPACITY!)</strong>`;
        } else {
            fillBar.style.backgroundColor = "#4caf50";
            capText.innerHTML = `Total Bag Usage: <strong>${totalWeight}% / 100%</strong>`;
        }
    }
}

// MASTER MATH MATRIX EXECUTION
function executeMasterMathMatrix() {
    const advisory = document.getElementById("advisory-engine-output");
    const checkedItems = document.querySelectorAll(".loot-item:checked");
    
    let totalWeight = 0;
    checkboxes = Array.from(checkedItems).map(cb => {
        totalWeight += parseInt(cb.getAttribute("data-weight"));
        return cb.getAttribute("data-name");
    });

    if (advisory) {
        if (totalWeight > 100) {
            advisory.innerHTML = `<div style="color: #ff5252; background: #2a1515; padding: 10px; border-radius: 4px; border: 1px solid #ff5252;">⚠️ <strong>ADVISORY WARNING:</strong> Selected loot exceeds bag capacity by ${totalWeight - 100}%. Deselect non-essential items or re-route.</div>`;
        } else {
            advisory.innerHTML = `<div style="color: #4caf50; background: #152a15; padding: 10px; border-radius: 4px; border: 1px solid #4caf50;">✅ <strong>ROUTE OPTIMIZED:</strong> ${totalWeight}% capacity utilized. Ready for speedrun execution.</div>`;
        }
    }

    renderZoneManifest();
}

// RENDER ZONE MANIFEST WITH REORDER CONTROLS
function renderZoneManifest() {
    const container = document.getElementById("zone-manifest-container");
    if (!container) return;

    container.innerHTML = "";

    zoneManifestData.forEach((zone, index) => {
        const zoneCard = document.createElement("div");
        zoneCard.className = "zone-card";

        zoneCard.innerHTML = `
            <div class="zone-header">
                <span class="zone-title">${zone.title}</span>
                <div class="reorder-btn-group">
                    <button class="btn-arrow" onclick="moveZone(${index}, -1)">▲</button>
                    <button class="btn-arrow" onclick="moveZone(${index}, 1)">▼</button>
                </div>
            </div>
            <ul class="zone-item-list">
                ${zone.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
        `;

        container.appendChild(zoneCard);
    });
}

function moveZone(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= zoneManifestData.length) return;

    const temp = zoneManifestData[index];
    zoneManifestData[index] = zoneManifestData[newIndex];
    zoneManifestData[newIndex] = temp;

    renderZoneManifest();
}
