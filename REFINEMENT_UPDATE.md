# 0.14.1 — Short low-register holy cue and interaction audit

The holy cue now plays only source seconds 0.03–2.96 at 0.82× pitch/rate, producing roughly 3.57 seconds of lower-register choral sound. Low-shelf and presence EQ add warmth; a high-end filter reduces the previous bright sound. Extra synthesized holy arpeggio notes are removed and the explosion is quieter so the word is easier to hear. The source remains the credited mixed choir, not a newly recorded male operatic solo. See AUDIO_CREDITS.md.

Starting another match or returning to the lobby stops any remaining holy cue and restores music gain immediately. The source remains subject to the effects volume and master mute, and music still ducks during playback.

Fixed a real control mismatch: teleport fires immediately but its fire-button label and charge hint still described power charging. Both now consistently show immediate use. The weapon menu initializes its accessibility expanded state and pinned-tool availability on load.

Audit: native input editing, text-selection suppression, weapon filters, quick tool selection, touch target bounds, lost-focus movement release, exact teleport, rope pulling, sudden-death pause/resume, boss warnings/rewards and victory timing. Existing lost-focus automatic pause already clears movement correctly and was retained.

Validation: 108 Node tests and browser integration scenarios. The new refinement scenario verifies the short low-register playback settings, actual holy detonation, mute, music recovery, voice cleanup on lobby return, teleport label, native fields, touch hold and three viewport layouts. No physical phone listening or device test was performed.
