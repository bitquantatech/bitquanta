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
report features described here. Then publish this static site using its existing
hosting setup. This work has not changed hosting or DNS, pushed a branch, or
published either site.

Do not synchronize data folders between the projects. User accounts and the live
SQLite database remain on the Bitquanta inspection VM. No database changes are
needed for these website improvements.

Full local verification and deployment notes are in the sibling inspection
project's `docs/WEBSITE_IMPROVEMENTS.md`.
