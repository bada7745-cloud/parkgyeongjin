# Combat models 0.16.0

Equipped weapons and flying ammunition now use separate transparent pre-rendered 3D sprite sheets. The game remains a 2D canvas simulation. Launcher, cannon and rifle equipment use rocket, shell and bullet ammunition; grenades, discs, sticky bombs and grappling hooks retain their distinct visuals. Existing recoil, facing, terrain tilt, muzzle effects, trails and collision rules remain in place.

The renderer crops sprites into cached canvases once, follows projectile velocity, spins throwable weapons, freezes stuck-bomb orientation and displays hook artwork in flight and at the rope anchor. Utility, parasite and revival effects use matching imagery. Missing artwork falls back to the existing vector models. Reduced motion disables decorative spin and glow; pause freezes temporary effects.

Validation: 118 Node tests; check-combat-art.cjs validates 28 equipped and 28 ammunition/skill tiles, actual equipped/fired rocket rendering, bat, holy grenade, hook, teleport, simulation purity and 568x320/390x844 layouts. check-flight.cjs validates existing flight effects, particle limits, pause and reduced motion. Physical phone testing was not performed.
