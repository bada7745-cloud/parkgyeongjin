# v0.7.0 · Full power range, baseball bat and rope traversal

Power now oscillates from 1 to 100 percent and back with the existing 1.5-second half-cycle. The launch velocity clamp is also 1 percent, so a low reading is not silently upgraded to the old 20-percent minimum.

Two tools are available immediately in new matches and existing save migrations, bringing the arsenal to 18:

- Home-run bat: three swings per battle, 90-unit reach in front, 35 direct damage and power-dependent horizontal knockback. It never craters terrain, including floating platforms. A swing can hit a teammate and a miss still spends a swing and ends the action. The ordinary charge-shot interface controls knockback strength.
- Ninja rope: five successful attachments per battle, 560-unit straight-line aiming ray, no ammo cost on a miss. A valid hook attaches to solid geometry. Move left/right to pump the pendulum, reel in/out with the rope panel, and release with Jump, the release button or the fire button. Release retains velocity. Each attachment uses one rope; hanging consumes movement fuel and action time. At least eight movement fuel is required to attach. Changing weapons, anchor destruction, death, an exhausted movement budget or turn end releases the rope. Opening the pause menu freezes it. The rope blocks movement through terrain rather than passing the character through a platform. No automatic AI rope traversal is included; AI can use the bat against a nearby target.

New battles include five floating metal/stone platforms, with stage-dependent heights and an additional middle platform on alternating layouts. They have real collision masks: characters can stand on them, bullets collide with them, explosions cut holes in them and ropes can attach to their undersides. Rope previews use straight dashed lines and a target ring, and the bat preview shows reach rather than an incorrect ballistic arc.

Save files include the structure version and current rope attachment. Previous saves lacking the structure version keep their original world geometry until a new battle starts; their bat/rope inventory is added without resetting campaign unlocks or records. Newly started stages and free battles use the floating structures. Structure destruction and valid attached ropes survive save/restore.

Validation: 49 automated tests pass, including actual 1-percent launch speed, non-destructive bat hits/misses, solid platform destruction, rope attach/swing/reel/release momentum, broken-anchor release and old/new save restoration. Chromium at 844×390 and 568×320 verifies the 18-card arsenal, controls, rope interaction, charged bat strike, unchanged terrain and responsive rope controls. Actual phone performance and long-form rope/AI balancing still require device playtesting.
