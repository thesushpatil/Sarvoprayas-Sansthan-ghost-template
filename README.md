# Sarvo Prayas Sansthan — Ghost Theme 

A custom Ghost theme for **Sarvo Prayas Sansthan (SPS)**, Madhubani, Bihar, India.
Fully responsive, accessible, GScan-validated. Built for donors and partners as the primary audience.

---

## Design

- **Palette**: Blue Primary `#1B3FA0` · Blue Dark `#101D4F` · Red `#D42B31` · Orange `#F07820` · Page BG `#F4F6FC`.
- **Fonts**: Montserrat (headings, nav, buttons) + Open Sans (body), loaded from Google Fonts.
- **Features**: Sticky header with dropdown menus · Full-screen hero with rotating image slider · Animated stat counters · Scroll-in-view reveals · Partner marquee strip · Timeline · Dark footer · EN/Hindi language toggle.
- **Responsive**: Hamburger menu at 980px · Fully tested on mobile, tablet, laptop and desktop.

---

## Templates

| Template | Slug | Purpose |
|---|---|---|
| `index.hbs` | `/` | Homepage (hero, stats, focus cards, journey, updates, partners, CTA) |
| `page-about.hbs` | `about` | Organisation Journey (story, stats, mission/vision, timeline, where we work) |
| `page-ongoing-projects.hbs` | `ongoing-projects` | Ongoing project cards with images |
| `page-past-projects.hbs` | `past-projects` | Past project name-only cards (no images) |
| `page-gallery.hbs` | `gallery` | Photo grid from tagged posts |
| `page-videos.hbs` | `videos` | Video grid from tagged posts |
| `page-events.hbs` | `events` | Events list with date blocks |
| `page-contact.hbs` | `contact` | Contact info + form |
| `page-donate.hbs` | `donate` | Bank account details (single bank) |
| `post.hbs` | — | Single post view |
| `page.hbs` | — | Generic page |
| `tag.hbs` | — | Tag archive |
| `author.hbs` | — | Author archive |
| `error.hbs` | — | Error page |

---

## Dynamic Content via Tags

Almost all site content is editable from Ghost Admin using tagged posts. One post per tag; edit the existing post to update.

| Tag | Where it shows | What to put in the post |
|---|---|---|
| `ongoing-project` | Ongoing Projects page | Title, description, feature image |
| `past-project` | Past Projects page | Title only (no image needed) |
| `gallery` | Photos page | Title (caption), feature image |
| `video` | Videos page | Title, feature image, YouTube link in body |
| `event` | Events page | Title, description, publish date = event date |
| `partner` | Partner marquee (home) | Bulleted list of partner names in body |
| `milestone` | Timeline (home + about) | Bulleted list: bold year then description. Feature image shows beside the timeline on home only |
| `stats` | Impact stats band (home + about) | Bulleted list: bold number then label |
| `hero-slider` | Hero background (home) | Add multiple images in body — they rotate every 5 seconds |
| `home-focus-child` | Child Protection card (home) | Title, short text, feature image |
| `home-focus-livelihood` | Livelihood card (home) | Title, short text, feature image |
| `about-story` | Background story (about) | Title = heading, body = paragraphs, feature image |
| `about-mission` | Mission card (about) | Title, short text |
| `about-vision` | Vision card (about) | Title, short text |
| `about-where` | Where We Work (about) | Title = heading, body = paragraphs, feature image |

Posts tagged with the helper tags above are automatically excluded from "Latest Updates" and "More updates" feeds.

---

## Custom Settings (Theme Settings in Ghost Admin)

Editable in Settings → Design & branding → Customize → Sitewide. Currently 15 fields (Ghost limit is 20).

| Field | Purpose |
|---|---|
| `hero_title` | Main headline on the home page |
| `brand_tagline` | Small tagline under the logo |
| `contact_phone_1` / `contact_phone_2` | Phone numbers (footer + contact page) |
| `contact_email_1` | Email address (contact page) |
| `office_address_1` / `office_address_2` | Head office and branch office addresses |
| `reg_society_number` / `reg_12a_number` / `reg_80g_number` / `pan_number` | Legal registration numbers |
| `bank1_name` / `bank1_branch` / `bank1_account` / `bank1_ifsc` | Bank details on the Donate page |

---

## Pagination

Pages with `data-paginate="6"` (or `"9"` for past projects) automatically show page numbers at the bottom when content exceeds the limit. This is client-side JS — no server config needed.

---

## Language Toggle (English / Hindi)

- Header shows **EN / हिं** buttons. English is the default.
- Hindi translation is powered by Google Website Translate.
- The toggle uses `notranslate` class to keep button labels fixed.
- Cookie is cleared across all domain scopes (including `.ghost.io` subdomains) when reverting to English.

---

## Quick Start — Docker (development)

```bash
cd d:\oasis\SarvoPrayas
docker compose up -d
# Open http://localhost:2368/ghost for setup
# Theme folder is volume-mounted — edits are live after theme reactivation
```

---

## Deploy to Production

1. Zip the `sarvoprayas-theme` folder.
2. Ghost Admin → Settings → Design → Change theme → Upload → Activate.
3. Create the 8 required Pages with exact slugs (see Templates table above).
4. Set site title, description, and logo in Settings → General.
5. Fill theme custom settings in Settings → Design & branding → Customize.
6. Create the tagged posts (see Dynamic Content table).
7. Hard-refresh the site (Ctrl+Shift+R) to see changes.

---

## GScan Validation

```powershell
npx gscan@latest .\sarvoprayas-theme
```

---

## File Structure

```
sarvoprayas-theme/
├── assets/
│   ├── css/screen.css       — All styles (single file, responsive)
│   ├── js/main.js           — Navigation, language toggle, hero slider, pagination, stat counters, scroll reveals
│   └── Images/              — Bundled fallback images (used until real posts replace them)
├── partials/
│   ├── site-header.hbs      — Header with nav dropdowns
│   ├── site-footer.hbs      — Footer with contact details
│   ├── post-card.hbs        — Reusable post card
│   ├── project-placeholder.hbs
│   ├── pagination.hbs
│   └── navigation.hbs
├── default.hbs              — Base layout
├── index.hbs                — Homepage
├── page-about.hbs           — About page
├── page-ongoing-projects.hbs
├── page-past-projects.hbs
├── page-gallery.hbs
├── page-videos.hbs
├── page-events.hbs
├── page-contact.hbs
├── page-donate.hbs
├── page.hbs                 — Generic page
├── post.hbs                 — Single post
├── tag.hbs / author.hbs / error.hbs
├── package.json             — Theme config + custom settings
├── routes.yaml              — Ghost routing (default routing)

```

---

## Notes

- The contact form is currently a visual placeholder — wire it to a real form handler (Formspree, Web3Forms, etc.) before launch.
- Fallback/placeholder content shows until real tagged posts are published, then disappears automatically.
- All images should be uploaded in **WebP format** for best performance.
- The theme is built for Ghost 5+.
