# Kortz Center Heist Master Matrix HUD (v5.0-Alpha)

An underground black-market payload planner and Loot Bag optimization engine built specifically for the **Kortz Center Heist**. This utility maps out total cash payouts and solves the mathematical distribution problem to pack the absolute highest dollar yield into your gear without breaking maximum Loot Bag capacity limits.

## 🗺️ Hardcoded Loot Routing Order
The application cards and sequential navigation track follow a strict, one-way path through the mansion compound to eliminate back-and-forth foot traffic across 33 steps:
1.  **Main Entrance Room Wide Sweep:** Canis Hominem Edit, Orange Crush, Pharaonic Bands, Explain Yourself, La Duchesse.
2.  **Left Room Window:** Do You See Me?
3.  **Staircase Partition Wall:** Coquard Rings, Middle Floor Fertility Statue, Antique Bands, Art Deco Rings, Antique Rings.
4.  **Security Room Walk-in:** The Chief.
5.  **Surveillance Camera Monitor Feeds:** Vault Paintings (Swing Set, Hunter, Friends, Het Gouden Hondje) and the Variable Loading Bay Van.
6.  **Downstairs Elevator Tower Enclosures:** Memento non Mori Skull, Downstairs Egg, Byzantine Hoops.
7.  **Upstairs Doorway 360-degree Sweep:** Upstairs Egg, Carcanets, Horse Statue, Coquard Bracelets, Sod Off, Cooked.
8.  **Multiplayer Keycard Vault Loop:** Keycard Rooms, Blueprints, Great Circle Back, Gemstone, Meteorite Fragments, Venus D'Algernon, Art Deco Circlets.

## ⚙️ Tactical Architecture
*   **Loot Bag Math Solver:** Packs the highest density dollar yield into your crew's gear based on true item space restrictions.
*   **3-State Van Spawn Selector:** Handles variable spawn states (Not Present / Base Average / Manual Finale Override) with embedded field warnings.
*   **Adaptive Local Average Engine:** Automatically logs successfully completed scores, bumps your run counter starting at Run #8, and overwrites text benchmarks based on your actual personal history using `localStorage`.
*   **Visual Burn Alerts:** Automatically dims skipped or locked-out cards to 35% opacity and strikes through names to show dead weight on click.
*   **Split-Row Sticky Top HUD:** Splits the top portrait row into a collapsible menu, a vivid gold `#ffaa00` Buyer's Request list, and a cyber-blue speedrun timer that floats over fields without blocking input cards.
