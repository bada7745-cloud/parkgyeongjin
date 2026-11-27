# 0.12.0 — Thirty stages and six boss encounters

All six encounters retain three player worms against a boss and two guards. Every fifth stage now has a named boss. Boss health and attack increase across the campaign; armor and warning mechanics provide different responses beyond larger health pools.

| Stage | Boss | HP | Pattern |
| --- | --- | --- | --- |
| 5 | 닻왕 바나클 | 230 | Rising tide and anchor impact zones |
| 10 | 사막왕 스카라 | 270 | 20% armor before half health, alternating desert wind |
| 15 | 서리 여왕 글라시아 | 300 | Ice floor and frost zones that reduce movement |
| 20 | 용광로 골리앗 | 330 | Volcanic warnings and lava zones |
| 25 | 폭풍 제독 제피르 | 360 | Wind 55 and vortex knockback |
| 30 | 공허 군주 녹스 | 400 | Strong magnetic field, one relocation at half health |

At half health each boss enrages once: attack increases by 0.12 and special attacks target two player positions. Red ground markers allow a complete player turn to escape before the next turn's impact. Boss death removes its pending warnings. The stage is won after remaining guards are defeated. Water knockouts remain possible.

Ten new arenas have distinct terrain masks and sky structures. Stages have functional regional rules: wind, tide, jumping, sliding ice, lower gravity, magnetic projectile deflection, active-unit healing or telegraphed environmental strikes. These affect prediction and AI through the same ballistic path. Simple stages retain calm practice rules.

Supplies parachute in, granting up to 25 health or one grenade (up to four). They can be collected by either team. Barrels create a 32-damage, radius-58 chain explosion and terrain destruction, rewarding map awareness. Objects, boss phases and pending warnings persist in saved battles. Older battles are resumed without injecting a boss or new objects.

First victory in a boss encounter grants an additional 150 / 190 / 230 / 270 / 310 / 350 coins and two tokens. Bounties are stored atomically with the existing battle rewards, once per boss stage. Existing owners who cleared an old version can earn the bounty by defeating that stage's new boss. There is no bounty for losing after defeating the boss.

Graphics: enlarged crowned bosses with matching swept hitboxes; arrival focus, rage feedback, dedicated compact boss health bar, labeled ground warnings, impact particles, animated magnet field, falling parachutes and shaded barrels. Reduced-motion and pause behavior are preserved.

Validation: 99 Node tests, including ten new campaign tests, plus Chrome browser scenarios covering 30 stage cards, six boss cards, stage-30 rage and warnings, landscape/portrait HUD bounds, victory timing, bounty persistence and late-stage mission choices. Physical mobile testing was not performed.
