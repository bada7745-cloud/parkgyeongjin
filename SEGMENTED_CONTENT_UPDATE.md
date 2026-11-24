# v0.10.0 · Dedicated screens, spaced controls and new content

## One screen, one job

Main navigation now has separate Shop, Worm Roster, Weapons and Missions entries. The landscape navigation uses four separated tiles in a 2×2 group and portrait uses a four-item bottom row. Clicking a displayed worm opens the roster, not the shop. Coins open the shop and tokens open missions.

The new dedicated role screen has an opaque background and a back button rather than letting home content show through a multipurpose dialog:

- Shop contains only unowned purchasable worms/weapons, with category filters. Purchased items disappear; it has no equipment controls, owned-product cards or mission list.
- Roster contains only owned worms and the three individual squad slots. It has no purchase controls.
- Weapons is an owned-inventory reference with ammo and availability conditions; it has no shop buttons. Owned weapons are automatically supplied in new battles.
- Missions separates daily, weekly, monthly and stage challenge pages. It has no store inventory or roster.
- Free-match setup opens in its own screen. Existing settings nodes are retained in a hidden parking container when another screen is open, preserving IDs/event handlers and saved settings. Selecting a map now also uses its actual layout in free matches.
- Campaign selection has an opaque standalone background and 20 stage cards.

## Separated combat controls

The continuous bottom dock is removed. Movement/jump are separate round buttons on the left, the weapon picker floats above them, aim buttons sit separately on the right, the fire button is a large isolated circle, and the power meter is its own centered panel. Status/energy are read-only badges near the top. Rope controls appear as a separate contextual panel. Empty space between islands continues to receive camera drag input. Existing hold, pointer capture, two-click power charging and rope handlers remain connected to the same elements.

## New stages (13–20)

Steam Harbor, Crystal Cavern, Cloud Garden, Clockwork Tower, Coral Ruins, Moonlight Base, Thunder Spire and Starwhale Garden have their own terrain silhouettes, floating-platform arrangements, palettes and decorations. Clockwork uses a 30-second campaign turn timer. Moonlight has lower character and projectile gravity, including prediction; Thunder has strong ±48 wind. Map rules follow the selected layout in free matches too, while free-match turn duration stays user configurable.

Enemies increase from 108 to 136 health across the new stages. Their health UI uses actual maximum HP rather than assuming 100. The original 12 masks remain identical. Existing saved worlds and purchases remain valid. First-clear rewards extend to 560 coins at stage 20; late stages award currency rather than inserting invalid/null weapon unlocks.

## New worms (12 total)

|Worm|Price|HP|Ability|
|---|---:|---:|---|
|빙하 펭귄|720 coins|120|Frost immunity|
|꿀벌 독침|950 coins + 2 tokens|90|Basic bazooka/grenade/mortar damage inflicts 2 poison ticks, 6 HP each, on the target's activations|
|홈런 해적|850 coins|100|Bat horizontal knockback +35%, upward force +10%|
|성운 요정|1,400 coins + 4 tokens|90|One water-fall rescue per battle to a surviving safe surface, costing 25 HP (minimum 1 HP)|

Abilities, spent rescue state and poison fields persist with battle units. Accessories are shared between new showroom portraits and combat rendering. An available landing surface is required for rescue.

## New weapons (26 total)

|Weapon|Price|Ammo|Gate|Behavior|
|---|---:|---:|---|---|
|귀환 디스크|430 coins|2|Own team activation 2|Curves toward its owner after 0.55 seconds; damages/knocks units without terrain destruction|
|중력 폭탄|680 coins|2|Own team activation 3|2.5-second fuse; pulls nearby worms inward, low damage, no terrain destruction|
|치유 비콘|520 coins|2|Own team activation 2|1.5-second fuse; heals allies near impact by up to 25, no enemy damage or terrain destruction|
|포자 씨앗|780 coins|2|Own team activation 3|Impact blast plus 2 poison ticks, 7 HP each, for damaged enemy survivors|

Purchases remain permanent, with fixed ammo per new battle. Friendly-fire/owner-return risks apply to damaging weapons. Poison does not repeatedly reapply itself. Guardian blocks prevent seed/bee poison when no initial damage is dealt.

## Missions and migration

Daily 4, weekly 5, monthly 5, and 4 permanent challenges per stage (80 total). The added permanent challenge is a win within that stage's recommended turn count; weekly adds stage variety and monthly adds perfect victories. Additional recurring tactic tasks use the already-available basic weapons/rope/bat. Existing period definitions, progress and paid rewards are retained; only previously missing mission IDs are appended. Old stage challenges gain the new challenge without resetting their three existing entries. Progress and reward validation now accept stages 1–20.

## Validation and limits

80 automated tests pass, including distinct/supported terrain across all 20 maps, original-map preservation, mission additions without resetting paid progress, late-stage save/reward persistence, lower gravity, frost immunity, poison, stronger bat, one-use rescue, non-destructive disk/gravity and ally-only beacon healing.

Chromium interaction checks cover dedicated screen isolation, owned/unowned filtering, purchases, 20-stage navigation, free-match layout selection, 26-card weapon inventory, actual charge firing and new-stage win/reward/reload. Bounding-box checks at 844×390, 568×320, 390×844 and 1024×768 verify the five combat control islands do not overlap and stay in the viewport. Main navigation is checked at 844×390, 568×320, 390×844 and 360×640. Tests prepare some owned items and victory states directly; these are not a full human playthrough. Physical-device performance and long-form content/economy balancing remain to be evaluated.

Currency remains local-device storage; this release adds no server authority or cross-device currency synchronization.
