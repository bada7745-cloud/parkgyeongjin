# 0.14.2 — Voice before detonation

The holy-grenade voice is triggered by the real projectile fuse, starting when 3.72 seconds remain. The current edited first phrase lasts roughly 3.57 seconds, leaving about 0.15 seconds before the normal five-second detonation. Explosion audio no longer triggers another vocal playback. Damage, fuse duration and projectile physics are unchanged.

The cue flag is stored on the projectile and emitted only once. Trajectory prediction and AI planning never emit audio. Grenades lost into water before reaching the cue point do not play the voice.

Manual pause stops and records the current phrase position. Continue resumes the remaining phrase together with the frozen fuse, instead of replaying the beginning. Leaving the match still clears pending voice playback.

Validation: 112 Node tests, including four fuse/cue/prediction/pause regressions; a browser scenario verifies real-time voice-before-explosion ordering, one cue, no explosion replay, complete phrase before detonation and pause/resume synchronization. The refinement browser regression also passes. Physical device testing was not performed.
