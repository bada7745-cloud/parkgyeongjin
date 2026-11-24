# v0.9.0 · Bright dimensional interface

The game remains the existing web/Android WebView implementation. This release adds an original, Unity-inspired 2.5D interface rather than claiming a Unity engine conversion or commercial launch readiness.

## Reference and direction

Reviewed Worms W.M.D Mobilize's official mobile menu/weapon-panel examples and Brawl Stars interface images for role separation, character focus, navigation prominence and distinct currency presentation. The layout, icons, character graphics and CSS materials here are original.

- https://www.team17.com/news/worms-w-md-mobilize-out-now-on-apple-android
- https://supercell.com/brawlstars/en/

## Home screen

- Separate persistent top panels for Worm Coins and medal tokens, with different original SVG icons, labels and live balances. Coins lead to the shop; tokens lead to missions. The old combined wallet shortcut is hidden without removing its underlying state handling.
- Main navigation visibly labels Shop, Worm Roster and Missions. Landscape/desktop places them on the left; portrait uses an accessible three-button bottom row.
- Central three-worm showroom reflects the actual saved roster, with radial/linear shaded original portraits, highlights, eye reflections, individual accessories, floating motions and raised island plinths. Clicking a displayed worm opens roster management.
- Campaign start gets one prominent gold button in its own right-side/portrait lower card. Clear progress is visible. Resume remains available when present.
- Free-match difficulty, turn duration, mode and map choices move into an expandable settings section. Existing controls and event handlers are moved rather than duplicated, preserving actual behavior.
- Guide and install remain visible on desktop/landscape. A portrait overflow button exposes both actions on small phones.

## Shared material system

Sky blue, ivory, gold, coral and soft green replace the dark teal panels. Buttons use highlights, lower edges and cast shadows to communicate thickness. Shop, roster slots, missions, campaign cards, pause/results/help/account dialogs, weapon inventory and battle controls share that palette. Currency and navigation use original SVG line art. Character portraits are generated on canvas without remote assets, fonts or paid services.

The home screen no longer renders the former battle-preview worms behind the new showroom, avoiding duplicated ghost characters. Gameplay rendering is skipped only while the showroom is active; real battles retain the original renderer and all physics. Reduced-motion preference disables the decorative floating animation. App theme/background colors match the lighter home screen.

## Validation

Chromium captures and bounding-box checks at 1440×900, 1024×768, 844×390, 568×320, 390×844 and 360×640 verify the two currency panels and main navigation/start button fit without overlap or clipping. Actual interaction checks cover shop, missions, preserved free-match settings, campaign entry, battle entry and the 22-card weapon inventory. Release integrity/service-worker checks pass, and deployment CI runs the existing simulation/progression tests. No gameplay economy, saved roster, ownership or currency keys are reset or changed by this redesign. Physical-device readability/performance and store readiness remain separate validation tasks.
