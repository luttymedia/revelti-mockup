# Revelti visual library (internal)

Internal working notes for producing Revelti blog images from Lutty's own photography, using Gemini (website, signed-in account) to replace real people with fictional adults. Not for publication.

## Files

| File | Purpose |
|---|---|
| `photo-catalogue.csv` | Searchable catalogue of every photo in the permitted archive folders (one row per photo). |
| `gemini-generation-log.md` | Record of each Gemini generation: reference, prompt, date, output file, QC verdict. |

Generated images go in `images/blog/` (per `REVELTI_BLOG_TECHNICAL_REFERENCE.md`, section 7) with the prefix `gen-` so they are never confused with published article images.

## Archive rules

- Source: `D:\Pictures`, only folders whose names contain `- Processed` (and their subfolders).
- Read-only. Nothing in the archive is renamed, moved, edited or deleted. Working copies go to a temporary scratch folder, never back into the archive.
- People in the photos are not identified, and the catalogue records no names.

## Catalogue (built 2026-11-25)

Permitted folders found: 12 (5 top-level). Two are empty (`Focus Dance - 21sep26 - Processed`, `Andrea & Nely - 21oct26 - Processed`).

| Event | Photos | Sessions |
|---|---|---|
| Copenhagen Bachata Congress 2026 (2-4 Oct) | 656 | Friday Social, Shows, Workshops, Jack & Jill, Saturday Social, group photo |
| Tallinn Bachata Experience 2026 (19-22 Nov) | 1,423 | Thursday/Friday/Saturday/Sunday socials, day socials, J&J, Shows, Workshops, Solo Battle |
| Aitana / Rittmo team shoot (11 Aug) | 4 | Posed team photos |
| **Total** | **2,083** | |

All photos are 2048 px on the long edge, 3:2 or 2:3 (1,106 portrait, 977 landscape).

**Method.** Dimensions and paths were read for every file. Every photo was placed on numbered contact sheets; sessions were reviewed visually and given session-level descriptions (category, composition, typical lighting). 51 photos were reviewed individually and rated A/B/C. The `review_level` column says which applies to each row. Session-level rows are a starting point, not a per-photo judgement.

**Columns.** `id` (catalogue number), `file_name`, `original_path`, `event`, `session`, `width`, `height`, `orientation`, `aspect_ratio`, `dance_style`, `category` (close-up couple, couple, wide dance floor, wide, stage, class, competition, solo, group, lighting), `people`, `composition`, `lighting_colour_atmosphere`, `branding_notes`, `quality_notes`, `rating`, `review_level`, `status`.

**Branding to watch.** Almost every event photo has a watermark at the bottom centre: the event logo (Copenhagen Bachata Congress or Tallinn Bachata Experience) plus a photographer/agency credit. Some shots also show printed T-shirts, wristbands with text and event signage on LED walls. All of this needs removing in generated images.

**Style notes.** Socials are mostly tight vertical couple shots in dark venues with blue, magenta or red light and slow-shutter light trails. Strong wides exist but are rare (about 1 in 100). Workshops are mostly daylight. B&W edits appear in every session.

### Best candidates by use (rating A)

- **Wide dance floor:** 1385 (lasers, best overall), 0118, 0116, 0068, 1384, 1530
- **Close-up couple:** 0011, 0050, 1543
- **Lighting / composition:** 1521, 1522, 0082, 0148, 1638
- **Workshops:** 0268

## Gemini workflow (draft, being tested)

1. Pick a reference from the catalogue (rating A, check `branding_notes`).
2. Copy it to the scratch folder (never upload from the archive path directly).
3. Open gemini.google.com in Lutty's signed-in browser, start a new chat, upload the reference, paste the prompt from the log template.
4. Review the result against the QC checklist. Regenerate or refine with a follow-up prompt when it fails.
5. Download the accepted image, save to `images/blog/gen-<topic>-<nn>.jpg`, resize to 2048 px long edge if larger.
6. Log it in `gemini-generation-log.md`.

### QC checklist

Photographic realism (skin texture, noise, lens behaviour) · dance authenticity (believable hold and frame) · anatomy and hands (count fingers, check wrists) · lighting and colour match the reference · composition preserved · no logos, text or watermarks · nobody resembles the original people · suitable for an editorial dance site. If any item fails, the image is rejected.

## Status (2026-11-25)

Gemini generation was stopped at Lutty's request, so the workflow above is on hold (see the outcome section in `gemini-generation-log.md`). For blog images, use Lutty's already-edited photos in `albums/event/` and copy them to `images/blog/` under descriptive names.

| Blog file | Source | Used in `social-dance-event-formats` (EN and ES) |
|---|---|---|
| `social-dance-event-formats-latin-social-floor.jpg` | `albums/event/gallery2.jpg` | Featured image |
| `social-dance-event-formats-latin-social-couple.jpg` | `albums/event/gallery12.jpg` | Congress/festival section |
| `social-dance-event-formats-evening-social.jpg` | `albums/event/gallery11.jpg` | Socials/milongas section |
