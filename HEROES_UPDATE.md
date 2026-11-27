# 0.15.0 — Original Nightfall superhero worms

The main screen now uses an original cinematic 3D night-city ensemble illustration with a portal, searchlights, armored worms and luminous wings. Original costumes and a new “웜 히어로즈 / NIGHTFALL SQUAD” presentation convey a team-of-heroes mood. Marvel/Avengers characters, logos and costumes are not used. Existing navigation, separate currencies, campaign progress and three individual party slots remain functional.

All worms receive capes or wings, armor and glowing emblems while retaining their existing character identities and stats. The shop and hero portraits use the same dark blue, cyan and gold treatment. The new hero/weapon art is generated artwork; this remains the existing canvas game, not a full 3D engine conversion.

| Hero | Price | HP / attack | Ability |
| --- | --- | --- | --- |
| 페러사이트웜 | 1,250 coins + 2 tokens | 95 / 100% | On death, a radius-95 biological burst deals up to 42 damage, decreasing with distance. Friends and enemies are affected. No terrain destruction. One burst per worm; chains terminate. |
| 대천사웜 | 1,800 coins + 4 tokens | 100 / 95% | Once per match, resurrect with 30% of maximum HP and 0.85 seconds of grace. Death counters and graves are corrected before victory checks. Water deaths relocate to nearby safe ground when available. Second death is final. |

Owned heroes are bought and equipped through the existing wallet; coins, tokens, previous clear progress and the other two party slots are preserved. Spent ability state is saved; each new match resets it.

A generated 7×4 atlas supplies detailed 3D-style images for all 26 existing weapons and both new abilities. These appear in the combat arsenal, selected weapon, shop, inventory and skill badges. Weapon mechanics remain unchanged. Images are bundled and included in the verified offline release; JPEG support was added to the release manifest builder.

Validation: 118 Node tests (six new hero/economy/death/revival regressions) and Chrome browser scenarios covering four responsive home layouts, purchases and separate equipment slots, loaded detailed icon pixels, revival and parasite effects. Existing touch, grappling, sudden-death, boss, holy-fuse and reward flows are rechecked. Physical Android/iPhone validation remains outstanding.
