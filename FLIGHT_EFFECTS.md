# v0.6.1 �� Flight action effects

This visual-only layer adds rocket/mortar/drill/airstrike exhaust flames, expanding smoke trails, moving sparks, grenade fuse sparks, special-weapon glows and afterimages, launch flashes and bounce/impact streaks. Existing projectile rotation and individual weapon silhouettes are retained. Camera framing adds a smoothed velocity-based look-ahead while respecting overview and manual panning.

The simulation, ammo, projectile coordinates, damage and turn timing remain independent of these effects. Particles are capped at 160 on viewports below 1000 px and 260 elsewhere, freeze while the game is paused, reset between matches, and stop emitting when reduced motion is requested. All effects are procedurally drawn on the existing canvas without external image/video resources.

Verified in Chromium at mobile landscape dimensions: real charged rocket launch emits particles; rendering leaves projectile data unchanged; emission stays under the cap; pause freezes particles; reduced motion emits no extra particles; 12 projectile styles draw without runtime errors. Release asset and service-worker checks pass. Physical phone performance is not yet measured.

