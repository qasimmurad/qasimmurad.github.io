# Anchor

**An attention and working-memory layer for Figma's infinite canvas.**
A product concept and working plugin prototype built for designers with ADHD, and useful to anyone in a large, long-lived file.

Built for ADHD. Better for everyone.

- [`../CONCEPT.md`](../CONCEPT.md): the product concept (problem, users, features, metrics, risks, validation plan).
- [Scroll-driven concept prototype](https://qasimmurad.github.io/anchor/): one page, a Windows 95-style desktop in Figma's palette where a cursor acts out all three features as you scroll.
- This folder: a Figma plugin prototype of the three core features.

## What it does

| Feature | What happens |
|---|---|
| **Tunnel** | Select a frame or flow, type what you're here to do, press Enter Tunnel. Everything else on the page dims to 12% and locks. A quiet elapsed-time line sits under your intent. Exit restores every node exactly. |
| **Park it** | While in a Tunnel, Anchor watches your edits. If you've been editing things outside the scope for longer than the threshold (default 15 min), one soft prompt appears. *Park it* moves those frames to a `🅿 Parking lot` page with a dated note and brings you back to the scope. *Make it the intent* flips the tangent into the new tunnel. *Keep going* snoozes. |
| **Where was I?** | Every session, Anchor logs what you touched, your last selection, your intent, and a note you can leave for future you. On the next launch it shows a re-entry card ("You were here 2 days ago for 48 min, on *Checkout*. You set out to: *finish error states*. You edited 6 things, mostly *Cart empty*…") with a *Take me there* button that selects and zooms to where you left off. |

The Figma Plugin API cannot mute comments or notifications and cannot read version history, so the prototype fakes neither. The re-entry summary is rule-based; swapping it for an AI-written one is one function (`buildReentry` in `src/code.ts`).

## Try it (2 minutes)

1. Open the Figma **desktop** app and any file with a few top-level frames.
2. `Plugins → Development → Import plugin from manifest…` and pick `manifest.json` from this folder.
3. Run **Anchor** from the Plugins menu.
4. Select a frame, type an intent, press **Enter Tunnel**. Watch the rest of the page dim.
5. In the footer, set the drift nudge to **1 min (demo)**. Edit something *outside* the tunnel for a minute. The nudge appears. Press **Park it**.
6. Type a note for future you. Close the plugin, reopen it. The **Where was I?** card is waiting.

## Development

```
npm install
npm run build      # compiles src/code.ts → code.js
npm run watch
```

`code.js` is committed so the plugin imports without a build step.

## Files

```
manifest.json   plugin manifest (dynamic-page, no network access)
src/code.ts     main thread: tunnel, drift detection, parking, session log
code.js         compiled output
ui.html         the panel
CONCEPT.md      the product concept
```

## Privacy

All session tracking is stored with Figma's per-user `clientStorage` on the user's own machine, keyed to the file. Nothing is sent anywhere (the manifest declares `networkAccess: none`) and nothing is visible to teammates or admins. The only thing written into the file itself is a random file id and the active tunnel's restore table, so Exit works even if the plugin was closed mid-tunnel.
