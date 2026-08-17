# barirasaad.com

A one-page site for Barira Saad — Registered Dietitian and freelance health
writer — plus a privacy notice. Static HTML, CSS and a little vanilla
JavaScript. No build step, no frameworks, no dependencies: upload the files and
they work.

**The single rule of this template: all content lives in `content.js`.** The
HTML and CSS read from it. Change a headline, swap an article, add a
testimonial, update the form endpoint — one file, then refresh. Layout and
styling never need touching.

---

## Files

| File | What it is | Do you edit it? |
| --- | --- | --- |
| `content.js` | Every word on the site, as one commented object. | **Yes — this is the file.** |
| `index.html` | Empty layout skeleton with mount points. No copy. | No |
| `render.js` | Reads `content.js`, writes it into the page. | No |
| `styles.css` | All design. Colours and type scale are tokens at the top. | Only to restyle |
| `privacy.html` | Privacy notice. Prose here, contact details from `content.js`. | Yes — the prose |
| `assets/` | Logos, favicon, social share image. | Swap the files |

---

## Uploading to Hostinger

1. In hPanel open **File Manager** and go to `public_html`.
2. Upload `index.html`, `privacy.html`, `styles.css`, `content.js`,
   `render.js`, and the whole `assets` folder — keeping that structure.
   `README.md` doesn't need to go up, but does no harm if it does.
3. Visit the domain. Make sure HTTPS is on (hPanel → SSL) and that
   HTTP redirects to HTTPS.

All paths in the site are relative, so it also works in a subfolder or opened
straight from disk by double-clicking `index.html`.

To update later: edit `content.js` on your computer, upload just that one file,
and hard-refresh the page (Ctrl/Cmd + Shift + R).

---

## Content key → what it controls

Section numbers match the order the sections appear on the page.

| Key in `content.js` | Controls |
| --- | --- |
| `meta` | Browser tab title, Google snippet, Open Graph / Twitter link previews, favicon. `meta.siteUrl` must be the live https address for share images to resolve. |
| `hero` | **1. Hero** — name, role line, one-line positioning, the "Discuss a project" button and the small reassurance line under it. |
| `about` | **2. About** — `about.paragraphs` is a list; add or remove strings to add or remove paragraphs. |
| `whatIWrite` | **3. What I write** — `cards` renders the grid. Any number of cards lays out cleanly. |
| `selectedWork` | **4. Selected work** — `articles` is the `[[SAMPLE ARTICLES]]` array (title, publication, date, `whatItShows`, `url`, `linkLabel`). `footnote` is the "further articles … available on request" line. |
| `publications` | **5. Selected publications** — `items` is the `[[PUBLICATIONS]]` array. An item with `url: ''` renders as plain text instead of a link. `footnote` is the "full publication list available on request" line. |
| `hcpcFeature` | **6. Featured by the HCPC** — the two HCPC "In your words" links and the non-endorsement disclaimer. |
| `credentials` | **7. Credentials & verification** — registration wording, `[[HCPC LOGO]]` and `[[BDA LOGO]]` paths, and the HCPC Register verification link. |
| `testimonials` | **8. Testimonials** — `[[TESTIMONIALS]]`. Empty list = the section is hidden completely. Add one quote and it appears, styled, with no other change. |
| `enquiry` | **9. Enquiry form** — `[[FORMSPREE ENDPOINT]]`, the "no confidential or patient information" notice, the fields, the thank-you and error states. |
| `footer` | **10. Footer** — email address, links, copyright line. |
| `nav` | The header menu. Each `target` must match a section id (`#about`, `#what-i-write`, `#work`, `#publications`, `#hcpc`, `#credentials`, `#testimonials`, `#enquiry`). |
| `privacy` | Controller name, description, email and "last updated" date, injected into `privacy.html`. |

---

## The three things to do before going live

### 1. Connect the form

1. Create a free account at [formspree.io](https://formspree.io) and make a new
   form pointed at `hello@barirasaad.com`.
2. Copy the endpoint it gives you — it looks like
   `https://formspree.io/f/abcdwxyz`.
3. Paste it into `content.js` → `enquiry.formspreeEndpoint`, replacing
   `https://formspree.io/f/YOUR_FORM_ID`.
4. Send yourself a test enquiry.

Until you do this the form shows a polite "not connected yet" message rather
than failing silently. The form posts in the background and swaps itself for the
thank-you message — visitors never leave the page. A hidden honeypot field
catches most spam bots.

### 2. Drop in the real logos

Replace `assets/hcpc-logo.svg` and `assets/bda-logo.svg` with the official
files. Keep the same filenames and nothing else needs changing; use different
filenames and update the `src` paths in `content.js` → `credentials`.

SVG or PNG both work. The stylesheet sizes them by height and preserves their
aspect ratio — it applies no border, no background fill, no recolouring and no
cropping.

### 3. Finish the privacy notice

Open `privacy.html` and search for `[[CONFIRM]]`. Each marker is a decision only
you can make — trading address, international transfer safeguards for Formspree,
your email provider, retention periods. Replace each with your answer and delete
the marker. They are styled with a dashed box so they are impossible to miss on
the live page.

The file is a template, not legal advice.

---

## Compliance notes (please don't undo these)

These are built into the template deliberately:

- **Protected title.** "Dietitian" is protected by law in the UK. The wording is
  **"HCPC registered (DT30976)"**. Never write "state registered".
- **The BDA logo links to <https://www.bda.uk.com>.** That link lives in
  `content.js` → `credentials.items[1].logo.href`. Leave it in place.
- **Logos are not to be altered** — no recolouring, stretching, cropping,
  boxing. The CSS keeps clear space around them and applies no filters.
- **The marks are tied to Barira Saad personally**, not to business branding.
- **The HCPC section is framed "Published by the HCPC"** and carries a line
  saying the pieces are not an endorsement of her services. Keep that framing.
- **The form carries the notice** "Please don't include confidential or patient
  information in your message."
- **No third-party tracking.** No analytics, no cookies, no externally hosted
  fonts or scripts — which is what lets the privacy notice stay this short.

---

## Adding a testimonial later

In `content.js`, find `testimonials` and put a block inside the square brackets:

```js
testimonials: {
  heading: 'What editors say',
  items: [
    {
      quote: 'She turned a dense evidence base into copy we ran as written.',
      name: 'Emma Example',
      role: 'Commissioning Editor',
      organisation: 'Publication name'
    }
  ]
},
```

The section appears automatically. `role` and `organisation` are optional — set
either to `''` to leave it out. Two or more quotes lay out side by side on wider
screens. No redesign, no other file touched.

---

## Design

- **Palette:** warm off-white paper (`#fcf9f4`) with one deep teal accent
  (`#14504b`) and near-black ink. Editorial rather than clinical.
- **Type:** a serif for display headings, a clean sans for body text, both from
  the system font stack — nothing is fetched from Google Fonts, so pages load
  instantly and no visitor data goes to a third party.
- **Layout:** mobile-first, one column, widening to two and three at 40rem and
  62rem. Body text is capped at a comfortable measure.
- **Accessibility:** single `h1`, headings in order, a skip link, visible focus
  rings, labelled fields, alt text on every image, live-region status messages
  on the form, and `prefers-reduced-motion` respected.

All colours and sizes are CSS custom properties at the top of `styles.css`.
Change `--accent` there and the whole site follows.

---

## Social share image

`assets/og-image.png` is a plain placeholder. `assets/og-image-source.svg` is
the same image with the real wording on it — open it in a browser, export or
screenshot it at 1200 × 630, and save the result over `og-image.png`. Anything
1200 × 630 works; nothing else needs changing.

---

## Regenerating this site

The layout is deterministic: it is derived entirely from the shape of
`content.js`. Rebuilding from the original prompt with an updated content file
reproduces the same design, because no copy is embedded in the HTML or CSS.

## A note on JavaScript

The page assembles itself in the browser from `content.js` — that is what keeps
all the content in one editable file. Search engines run JavaScript, so this is
fine for SEO, and the tab title, meta description and share tags are set before
the page paints. There is a plain `<noscript>` block in `index.html` with your
name, positioning and email for the rare visitor with JavaScript switched off;
if you change your headline copy substantially, it is worth updating that block
too. It is the only copy that lives outside `content.js`.
