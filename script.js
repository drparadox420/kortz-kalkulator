/* ==========================================================================
   HUDBUILD_V5_ALPHA_OFFICIAL - MASTER LOGIC & TACTICAL ROUTE ENGINE
   ========================================================================== */

// BASELINE ZONE DATA & TARGET MAPPING
let zoneManifestData = [
    { id: "zone-van", title: "🚛 Zone 1: Loading Bay Area", items: ["Loading Bay Van Cargo Asset (30% Space)"] },
    { id: "zone-vault", title: "🔒 Zone 2: Surveillance Vault / Security Loop", items: ["Painting: The Hunter Becomes the Hunted", "Painting: Het Gouden Hondje"] },
    { id: "zone-downstairs", title: "🚪 Zone 3: Downstairs Enclosures (Elevator Tower)", items: ["Pedestal: Memento non Mori Skull", "Byzantine Hoops"] },
    { id: "zone-middle", title: "🏛️ Zone 4: Middle Level Main Entrance & Staircase", items: ["Middle Floor Fertility Statue", "Painting: Canis Hominem Edit"] },
    { id: "zone-upstairs", title: "🏛️ Zone 5: Upstairs Level Sweep", items: ["Upstairs Decorative Egg", "Pedestal: Carcanets (Necklace)"] },
    { id: "zone-crew", title: "👥 Zone 6: Multiplayer Keycard Vault", items: ["Painting: Don't Forgo Blueprints"] }
];

// INITIALIZATION
window.onload = function() {
    handleVanDropdownStateChange();
    renderZoneManifest();
};

// VAN DROPDOWN HANDLER
function handleVanDropdownStateChange() {
    const vanSelect = document.getElementById("state-van");
    if (!vanSelect) return;
    const currentMode = vanSelect.value;
    console.log("Loading Bay Van State Updated:", currentMode);
}

// MASTER MATH MATRIX & ADVISORY ENGINE
function executeMasterMathMatrix() {
    // Simulated advisory status toggle for BR items
    const brList = document.getElementById("br-items-list");
    const brNote = document.getElementById("br-status-note");

    // Placeholder check to render advisory state
    const isBrOptimal = false; // Toggle logic based on run optimization

    if (!isBrOptimal) {
        if (brNote) {
            brNote.className = "status-warning";
            brNote.innerText = "🔴 STATUS: NOT NEEDED THIS RUN (IGNORE MINIMAP ICONS)";
        }
        if (brList) {
            const listItems = brList.querySelectorAll("li");
            listItems.forEach(li => li.classList.add("br-not-needed"));
        }
    } else {
        if (brNote) {
            brNote.className = "status-optimal";
            brNote.innerText = "🟢 STATUS: COLLECT FOR PEAK YIELD";
        }
        if (brList) {
            const listItems = brList.querySelectorAll("li");
            listItems.forEach(li => li.classList.remove("br-not-needed"));
        }
    }

    renderZoneManifest();
}

// RENDER ZONE-BY-ZONE MANIFEST WITH REORDER CONTROLS
function renderZoneManifest() {
    const container = document.getElementById("zone-manifest-container");
    if (!container) return;

    container.innerHTML = "";

    zoneManifestData.forEach((zone, index) => {
        const zoneCard = document.createElement("div");
        zoneCard.className = "zone-card";
        zoneCard.id = zone.id;

        const zoneHeader = document.createElement("div");
        zoneHeader.className = "zone-header";

        const zoneTitle = document.createElement("span");
        zoneTitle.className = "zone-title";
        zoneTitle.innerText = zone.title;

        const btnGroup = document.createElement("div");
        btnGroup.className = "reorder-btn-group";

        const btnUp = document.createElement("button");
        btnUp.className = "btn-arrow";
        btnUp.innerText = "▲";
        btnUp.onclick = () => moveZone(index, -1);

        const btnDown = document.createElement("button");
        btnDown.className = "btn-arrow";
        btnDown.innerText = "▼";
        btnDown.onclick = () => moveZone(index, 1);

        btnGroup.appendChild(btnUp);
        btnGroup.appendChild(btnDown);

        zoneHeader.appendChild(zoneTitle);
        zoneHeader.appendChild(btnGroup);

        const itemList = document.createElement("ul");
        itemList.className = "zone-item-list";

        zone.items.forEach(item => {
            const li = document.createElement("li");
            li.innerText = item;
            itemList.appendChild(li);
        });

        zoneCard.appendChild(zoneHeader);
        zoneCard.appendChild(itemList);

        container.appendChild(zoneCard);
    });
}

// DOM SHIFTING FUNCTION FOR ▲ / ▼ REORDERING
function moveZone(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= zoneManifestData.length) return;

    // Swap elements in manifest data array
    const temp = zoneManifestData[index];
    zoneManifestData[index] = zoneManifestData[newIndex];
    zoneManifestData[newIndex] = temp;

    // Re-render updated layout
    renderZoneManifest();
}
