# 0.11.0 — Traversal and character action

- New battles use an independent random spawn seed. Both teams are mixed across six clear, supported positions, including sky structures, with at least 155 pixels of separation. Map identity and restored battles remain unchanged.
- Rope is an unlimited basic tool. The hook travels at 1,050 pixels/second up to 560 pixels; solid anchors support swinging, spring tension, reeling and momentum on release. Movement fuel remains limited. Destroying the anchor releases the rope.
- Blink supports choosing a destination tier by tapping the map. It resolves a clear supported position and teleports immediately when used, spending one item.
- Ballistics use swept head, neck, belly and tail intersections and sub-pixel terrain sampling. The predictor and AI use the same implementation. Grenade fuses, sticky adhesion, drilling and special map gravity remain intact.
- Long falls trigger a 1.15-second headplant/recovery, with soil particles and impact audio. Movement and firing resume after recovery.
- Movement and jump effects have distinct squish and rising-pitch sounds. The victory call is original synthesized English speech, bundled locally and routed through the normal effects volume/mute controls.
- Victory shows cheering poses, confetti and a banner for three visible seconds before results. Rewards are recorded immediately and once; the outro cannot open the pause menu.
- Shop character portraits breathe, sway and sparkle, with offscreen/background/reduced-motion guards. Ground lighting, grass and structure rims add depth.

Validation: 89 Node tests, including nine new traversal/collision/placement tests; desktop Chrome browser fixtures check portrait animation, decoded audio, grapple controls, exact teleport and the timed result/reward transition. Existing layout tests cover four viewports. No physical Android/iPhone test was performed.
