# Design System: The Cinematic Curator

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Cinema."** We are not just building a portfolio; we are directing an immersive, large-screen experience. The aesthetic moves away from the "flat web" by utilizing deep tonal layering, light-emitting accents, and high-editorial typography to evoke the feeling of a premium streaming service or a modern film production suite.

This system breaks the standard template look by utilizing **intentional asymmetry**—specifically through the use of a floating, high-utility profile anchor on the left that contrasts against a heavy, content-driven grid. We prioritize "Atmospheric Depth," where the UI feels like it exists in a dark, physical space illuminated by neon light sources.

---

## 2. Colors & Atmospheric Polish

The palette is anchored in deep charcoal and navy, designed to make media content "pop." Accents are not merely colors; they are light sources.

### Color Tokens (Material Design Convention)
*   **Surface / Background:** `#0c0e12` (The "Blackout")
*   **Primary (Neon Orange):** `#ff9159`
*   **Secondary (Teal/Cyan):** `#00f1fe`
*   **Tertiary (Golden Accent):** `#ffe792`
*   **On-Surface (Typography):** `#f6f6fc`
*   **Surface-Container-High:** `#1d2025` (For elevated cards/modals)

### The "No-Line" Rule
Prohibit 1px solid borders for sectioning. Structural boundaries must be defined through background color shifts. For example, a `surface-container-low` content area should sit directly on a `background` base. 

### The "Glass & Gradient" Rule
To achieve a signature look, utilize Glassmorphism for floating elements (like the Profile Card). 
*   **Implementation:** Use `surface-container` colors at 60-80% opacity with a `backdrop-blur` of 20px-40px. 
*   **Signature Textures:** Main CTAs should use a subtle linear gradient from `primary` (#ff9159) to `primary-container` (#ff7a2f) to provide a "glowing" physical presence rather than a flat digital fill.

---

## 3. Typography: Editorial Authority

We use a duo-font system to balance modern tech with editorial sophistication.

*   **Display & Headlines (Manrope):** This is our "Voice." `display-lg` (3.5rem) and `headline-md` (1.75rem) use Manrope to provide a sleek, wide, and authoritative feel. It communicates high-end production value.
*   **Body & Titles (Be Vietnam Pro):** This is our "Intelligence." `body-lg` (1rem) and `title-md` (1.125rem) use Be Vietnam Pro. Its clean metrics ensure legibility against dark backgrounds where "haloing" can often occur with lesser fonts.

**Hierarchy Tip:** Use `label-md` in uppercase with letter-spacing (0.05em) for category headers to create a "technical" metadata feel.

---

## 4. Elevation & Depth: Tonal Layering

Depth in this system is achieved through light and shadow, not lines.

*   **The Layering Principle:** Stack `surface-container` tiers. A `surface-container-highest` (#23262c) card should sit on a `surface-container-low` (#111318) section. This creates a natural "lift."
*   **Ambient Shadows:** Floating elements (like the Profile Card) must use extra-diffused shadows. 
    *   *Shadow Specs:* `0px 20px 50px rgba(0, 0, 0, 0.5)`. 
    *   Avoid pure black shadows; use a deep navy tint to maintain the cinematic atmosphere.
*   **The "Ghost Border" Fallback:** If containment is needed for buttons or inputs, use `outline-variant` (#46484d) at 20% opacity. 
*   **Glow Effects:** Navigation items or active states use a subtle outer glow: `0px 0px 12px rgba(255, 145, 89, 0.4)` (Primary Glow).

---

## 5. Components

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary-container`), rounded-full, with a subtle glow on hover.
*   **Secondary (Ghost):** `outline-variant` border (20% opacity) with `on-surface` text. 
*   **Tertiary:** No border, `secondary` (Teal) text for high-contrast actions.

### Cards & Media Grid
*   **Visual Rule:** Forbid divider lines. Use `0.75rem` (md) or `1rem` (lg) corner radius.
*   **Content Separation:** Separate media items using the Spacing Scale (24px - 32px) rather than borders.
*   **Hover State:** Upon hover, the card should scale slightly (1.02x) and the border-glow should transition from 20% opacity to 100%.

### Floating Profile Card
*   **Role:** An "Always-on" anchor.
*   **Styling:** Use `surface-container-high` with 40px backdrop-blur. The card should feel like it is hovering above the media grid, utilizing the "Ambient Shadow" spec defined above.

### Input Fields
*   **Styling:** Rounded-full (pill-shaped) search bars with a `surface-container-highest` fill. 
*   **Active State:** The border glows with the `secondary` (Teal) token.

---

## 6. Do's and Don'ts

### Do
*   **DO** use high-contrast "light-leaks" (subtle radial gradients of Teal or Orange in the background corners) to add depth.
*   **DO** utilize the `full` roundedness scale for navigation pills and buttons to maintain the "Sleek Modern" vibe.
*   **DO** ensure all text on dark surfaces meets WCAG AA contrast ratios, especially when using Teal or Orange accents.

### Don't
*   **DON'T** use 100% white (#ffffff) for body text; use `on-surface` (#f6f6fc) to prevent eye strain in dark mode.
*   **DON'T** use standard drop-shadows with small blur radii. It breaks the "Immersive Cinematic" illusion.
*   **DON'T** use 1px solid separators between list items. Use vertical space or subtle background-color shifts.
*   **DON'T** clutter the hero banner. Let the imagery speak; keep the UI elements (Floating Card/Nav) as the supporting cast.