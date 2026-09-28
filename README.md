# Bitquanta company website

Static company website for https://bitquanta.org/.
Repository: https://github.com/bitquantatech/bitquanta.

The inspection application at https://inspect.bitquanta.org/ is a separate
project: https://github.com/sbilmis/tank-cleanliness-ai.

## Local preview

```sh
python3 -m http.server 8003 --bind 127.0.0.1
```

Open http://127.0.0.1:8003/. For the contact form and product links, also run
`bash scripts/run-local.sh` in the sibling `tank-cleanliness-ai` project;
its isolated API preview listens on port 8002. Local preview links automatically
use that service. External email senders are disabled by its local script.

## Website work, September 2026

- The company page leads with broad AI imaging, computer vision and custom AI
  services. Application areas precede tank inspection, which is presented as the
  first use case. The main call to action invites visitors to discuss their project.
- English and Turkish copy is written for each audience. `translations.js`
  contains the copy, accessible labels, metadata and form placeholders.
- `brand.css` is shared in appearance with the inspection application. Keep its
  colours, controls and logo usage coordinated with the other repository.
- `assets/example-tank.jpg` is a metadata-free tank-interior example from the
  existing inspection dataset, using a neutral public filename. It depicts no
  people or visible container identifiers. Its measured current model score is
  0.8507. The UI explicitly identifies it as an example inspection.
- `assets/tank-inspection-demo.mp4` is the user-supplied 58-second recording,
  copied unchanged. The poster is a frame at 8 seconds. `media-demo.js` and
  `media-demo.css` provide the Photo/Video switch and on-demand playback. Keep
  their copies in sync with the inspection site. The photo score is separate
  from the video playback example; the current gate could not assess this clip.
- The contact form now uses the inspection service's existing `/contact` API,
  replacing the old demonstration alert. Data is saved with the service's leads;
  configured email notifications are best-effort. Errors retain the entered text
  and offer the public email address as a fallback.
- CSS/JS asset versions prevent older cached resources from mixing with a new
  page. Increment the query version when releasing subsequent changes.

## Release order

Deploy the reviewed inspection application first. It adds contact-only CORS for
`https://bitquanta.org` and `https://www.bitquanta.org` and contains the video and
report features described here. Then publish this static site through GitHub Pages, which builds `main` from
the repository root and serves the existing `bitquanta.org` custom domain.
Both sites were published and verified on 2026-09-27. Hosting and DNS are unchanged.
The company application release is `093fd00`; the inspection release is `ab1b671`.

Do not synchronize data folders between the projects. User accounts and the live
SQLite database remain on the Bitquanta inspection VM. No database changes are
needed for these website improvements.

Full local verification and deployment notes are in the sibling inspection
project's `docs/WEBSITE_IMPROVEMENTS.md`.

## Previous stabilized walkthrough — September 27 (superseded)

The eight-second silent demo uses one continuous camera passage from the side
wall to the end surface, with illustrative residue already tracked onto it as
it enters view. Source seconds 14.2–17.8 play at half speed with a 0.8-second hold.
The opening is subtly reframed to show the side wall; no scene cuts or dissolves
are used. Motion interpolation smooths playback. The exact final video frame
becomes the close-up and result view, including a fresh smooth zoom on replay.
This replaces the rejected ten-second sequence that showed the same surface
clean first and dirty later.

The manually set demo score remains 0.92 / 1 (0,92 / 1 in Turkish), with the short
Score / Skor heading and compact Illustrative demo / Temsili demo badge. The
generated reference still's measured 0.8385 score remains separately preserved
under measured_reference in assets/tank-illustrative-demo-result.json. Source
ranges and current file hashes are recorded there. No model behavior changed.

The result CTA is Request a demo / Demo talep edin, leading to the existing
contact form. It closes the enlarged player and focuses the contact heading.
Existing sign-in links let approved customers use their own photos and videos.
Live authentication was checked read-only: DEMO_MODE=false; anonymous inspection
requests return HTTP 401. Login requires an approved account. No accounts,
passwords, database data or production settings were changed.

Replay video / Videoyu tekrar izle restarts from zero in inline and enlarged
views. Full frame / Zoom in and Back remain available. The Photo tab is unchanged.

Assets: assets/tank-inspection-illustrative-demo.mp4,
assets/tank-inspection-illustrative-ending.png and
assets/tank-inspection-illustrative-poster.jpg. Component version: 20260927-18.
Two-pass camera stabilization smooths translation and roll before interpolation;
a fixed 1.1745x crop avoids exposed borders. The poster and exact ending frame
are regenerated to match. The eight-second clip remains silent.
Editing notes are in the sibling inspection project's docs/VIDEO_DEMO_TRIAL.md;
publication/data-preservation records are in docs/RELEASE_2026-09-27_DEMO.md there.

## Previous procedural demo — September 27 (superseded)

The selected 14-second silent demo is rendered directly at 1280×720, 60 fps.
Its camera moves from the side wall toward one end surface, then closes in on
permanent residue and ends on the result. No captured footage or frame
interpolation is used. Layered translucent stains, irregular deposits and runoff
remain fixed on the surface throughout the camera move.

The public badge is simply **Demo** in both languages. The score **0.92 / 1**
(**0,92 / 1** in Turkish) is manually staged for this marketing example; it is
not a measured model result, confidence or an accuracy claim. The focus brackets
are editorial. `assets/tank-marketing-demo.json` records this provenance and hashes.
The older measured reference remains separate in `tank-illustrative-demo-result.json`.

The page selects the English or Turkish video with its language controls,
preserving playback position. The final frame stays in the player; Replay video
restarts from zero, and Back closes the enlarged player. Request a demo goes to
the contact form. The public example does not accept uploads or bypass login.

Current assets: `assets/tank-inspection-demo-en.mp4`,
`assets/tank-inspection-demo-tr.mp4` and `assets/tank-inspection-demo-poster-*.jpg`.
Shared player version: **20260927-20**. Reproducible rendering source is
`scripts/render_marketing_demo.py` in the inspection repository. Its dependencies
are NumPy, Pillow and PyAV; font paths can be supplied with `DEMO_FONT` and
`DEMO_FONT_BOLD`. Render with `python scripts/render_marketing_demo.py --video`.

## Current supplied demo — September 28

The active clip is `assets/bitquanta_tank_demo_draft.mp4`, supplied by the user and
copied byte-for-byte: 20 seconds, silent, 1280×720 H.264, 30 fps. It includes its
own English photo/video overlays and illustrative scores. Both language pages use
this same clip; surrounding controls and copy remain localized.

The former external 0.92 result card is removed. At completion the player shows
an exact extracted frame from second 17, so the supplied fade-to-black does not
leave the page blank. Replay restores the video from zero; Back and Request a
demo remain available. The poster is extracted at second 2. The standalone photo
example remains unchanged.

`tank-marketing-demo.json` records the current supplied-media provenance and
hashes. `tank-marketing-demo-20260927.json` preserves the prior procedural demo
record. The embedded scores and highlighted regions are demonstration graphics,
not measurements of this service’s performance. No model or inference change.
Shared player/page version: **20260928-01**.
