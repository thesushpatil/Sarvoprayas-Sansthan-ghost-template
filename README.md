# Sarvo Prayas Sansthan — Ghost Theme 

Custom Ghost theme for **Sarvo Prayas Sansthan (SPS)**, Madhubani, Bihar, India.
Fully responsive, accessible, GScan-validated (zero errors, zero warnings). Built for donors and partners as the primary audience.

---

## Design

- **Palette**: Blue `#1B3FA0` · Dark `#101D4F` · Red `#D42B31` · Orange `#F07820` · Page BG `#F4F6FC`
- **Fonts**: Montserrat (headings, nav) + Open Sans (body), Google Fonts
- **Features**: Dynamic navigation with dropdowns · Hero image slider · Animated stat counters · Client-side pagination · Partner marquee · Timeline · EN/Hindi toggle · Scroll reveals
- **Responsive**: Hamburger at 980px · Tested on mobile, tablet, laptop, desktop

---

## Templates

| Template | Slug | Purpose |
|---|---|---|
| `index.hbs` | `/` | Homepage |
| `page-about.hbs` | `about` | Organisation Journey |
| `page-ongoing-projects.hbs` | `ongoing-projects` | Ongoing projects (6/page) |
| `page-past-projects.hbs` | `past-projects` | Past projects, title-only cards (9/page) |
| `page-gallery.hbs` | `gallery` | Photo grid (6/page) |
| `page-videos.hbs` | `videos` | Video grid (6/page) |
| `page-events.hbs` | `events` | Events list (6/page) |
| `page-contact.hbs` | `contact` | Contact info + form |
| `page-donate.hbs` | `donate` | Bank details |
| `post.hbs` | — | Single post |
| `page.hbs` | — | Generic page |
| `tag.hbs` / `author.hbs` / `error.hbs` | — | System pages |

---

## Dynamic Content via Tags

All site content is editable from Ghost Admin using tagged posts.

| Tag | Shows on | What to add | One post? |
|---|---|---|---|
| `ongoing-project` | Ongoing Projects page | Title, description, feature image | Multiple |
| `past-project` | Past Projects page | Title only | Multiple |
| `gallery` | Photos page | Title, feature image | Multiple |
| `video` | Videos page | Title, feature image, YouTube link | Multiple |
| `event` | Events page | Title, description, publish date = event date | Multiple |
| `partner` | Partner marquee (home) | Bulleted list in body | One |
| `stats` | Stats band (home + about) | Bulleted list: bold number + label | One |
| `milestone` | Timeline (home + about) | Bulleted list: bold year + description. Feature image for home | One |
| `hero-slider` | Hero background (home) | Multiple images in body, rotate every 5s | One |
| `home-focus-intro` | Focus heading (home) | Title + excerpt | One |
| `home-focus-child` | Child Protection card (home) | Title, text, feature image | One |
| `home-focus-livelihood` | Livelihood card (home) | Title, text, feature image | One |
| `home-story` | Our Story section (home) | Title, paragraphs | One |
| `about-story` | Story block (about) | Title, paragraphs, feature image | One |
| `about-mission` | Mission card (about) | Title, text | One |
| `about-vision` | Vision card (about) | Title, text | One |
| `about-where` | Where We Work (about) | Title, paragraphs, feature image | One |
| `donate-info` | Donate card | Title, text, excerpt for note | One |

Helper-tagged posts are automatically excluded from Latest Updates and More Updates feeds.

---

## Dynamic Navigation

The header and footer menus are managed from **Settings → Navigation** in Ghost Admin.

**Primary Navigation**: top-level items. Items with URL `#` become dropdown parents. The item with URL containing `/donate` becomes the red Donate button.

**Secondary Navigation**: dropdown sub-items using format `ParentLabel: ChildLabel`. Footer links are also generated from secondary nav automatically.

---

## Custom Settings (17/20)

Editable in Settings → Design & branding → Customize → Sitewide:

| Field | Purpose |
|---|---|
| `hero_title` | Homepage headline |
| `hero_lead` | Homepage subtitle paragraph |
| `brand_tagline` | Tagline under logo |
| `contact_phone_1` / `contact_phone_2` | Phone numbers |
| `contact_email_1` | Email address |
| `office_address_1` / `office_address_2` | Office addresses |
| `reg_society_number` / `reg_12a_number` / `reg_80g_number` / `pan_number` | Legal numbers |
| `bank1_name` / `bank1_branch` / `bank1_account` / `bank1_ifsc` | Bank details |
| `footer_tagline` | Footer bottom text |

---

## Page Excerpts

Each page's description (shown below the title) is set via the page's **Excerpt** field in Ghost Admin (⚙ → Excerpt). No hardcoded page leads exist.

---

## Pagination

Client-side pagination with `data-paginate` attribute. Shows page numbers at the bottom automatically when content exceeds the limit. No server config needed.

---

## Language Toggle

EN/Hindi buttons in header. Powered by Google Website Translate. Toggle buttons are marked `notranslate` so they stay fixed. Cookie clearing handles ghost.io subdomains.

---

## Quick Start (Docker)

```bash
cd Docker
docker compose up -d
# Open http://localhost:2368/ghost
```

---

## Deploy

1. Zip the `sarvoprayas-theme` folder
2. Ghost Admin → Settings → Design → Change theme → Upload → Activate
3. Create the 8 required Pages with exact slugs
4. Set up Navigation (Primary + Secondary)
5. Fill theme custom settings
6. Create the tagged posts
7. Set page excerpts
8. Hard-refresh (Ctrl+Shift+R)

---

## GScan

```
npx gscan@latest ./sarvoprayas-theme
✓ Your theme is compatible with Ghost 6.x
```

Zero errors. Zero warnings.

---

## File Structure

```
sarvoprayas-theme/
├── assets/
│   ├── css/screen.css
│   ├── js/main.js
│   └── Images/ (empty — all images are dynamic via Ghost)
├── partials/
│   ├── site-header.hbs (dynamic nav)
│   ├── site-footer.hbs (dynamic links)
│   ├── navigation.hbs
│   ├── post-card.hbs
│   ├── project-placeholder.hbs
│   └── pagination.hbs
├── default.hbs
├── index.hbs
├── page-about.hbs
├── page-ongoing-projects.hbs
├── page-past-projects.hbs
├── page-gallery.hbs
├── page-videos.hbs
├── page-events.hbs
├── page-contact.hbs
├── page-donate.hbs
├── page.hbs / post.hbs / tag.hbs / author.hbs / error.hbs
├── package.json
├── routes.yaml
└── README.md
```

---

## Notes

- Contact form is a visual placeholder — wire to Formspree/Web3Forms before launch
- No bundled images — all visuals come from Ghost posts/settings
- Theme requires Ghost 5+
- All content shows "Coming soon" empty states until populated via Ghost Admin
