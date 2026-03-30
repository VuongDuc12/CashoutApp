# Design System Strategy: The Radiant Obsidian Executive

## 1. Overview & Creative North Star
The "Creative North Star" for this design system is **The Digital Vault**. 

In an industry often cluttered with loud "sale" banners and aggressive marketing, this system takes an editorial, high-end approach to financial rewards. We are not just a cashback platform; we are a premium curator of value. To move beyond a "template" look, we leverage **intentional asymmetry** and **tonal depth**. 

By breaking the rigid 12-column grid with overlapping "Bento" modules and varying card heights, we create a sense of architectural sophistication. The interface should feel like a high-end physical dashboard—machined, polished, and deep.

## 2. Colors: Tonal Depth & The "No-Line" Rule
The palette is built on a foundation of `#0e0e11` (Surface), using vibrant accents to pull the user's eye toward financial gain.

### The "No-Line" Rule
**Explicit Instruction:** Prohibit the use of 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts or subtle tonal transitions. For example:
- A `surface-container-low` (`#131316`) section sitting on a `surface` (`#0e0e11`) background.
- Content groupings separated by a shift from `surface-container` (`#19191d`) to `surface-container-high` (`#1f1f23`).

### Surface Hierarchy & Nesting
Treat the UI as physical layers. Each "inner" container should use a slightly higher tier to define importance:
1. **Base:** `surface` (#0e0e11) - The canvas.
2. **Sectioning:** `surface-container-low` (#131316) - Large layout blocks.
3. **Primary Cards:** `surface-container-highest` (#25252a) - Interactive bento modules.

### The "Glass & Gradient" Rule
Floating elements (Modals, Hover states, Floating Navigation) must utilize Glassmorphism. Use `surface-bright` (#2c2c30) at 60% opacity with a `20px` backdrop-blur. 

**Signature Textures:** For high-impact CTAs, use a linear gradient: `primary` (#81ecff) to `primary-dim` (#00d4ec) at a 135° angle. This provides a "liquid metal" feel that flat colors cannot replicate.

## 3. Typography: Editorial Authority
We utilize two distinct typefaces to balance tech-forwardness with financial reliability.

*   **Display & Headlines (Manrope):** Used for large data points and section titles. Its geometric nature feels "engineered."
*   **Body & UI (Inter):** Used for micro-copy and financial lists. Highly legible at small sizes.

**Hierarchy Strategy:**
- **Financial Data:** Use `display-md` or `headline-lg` for cashback balances. Bold weights in `primary` (#81ecff) reinforce the "Rewarding" brand pillar.
- **Labels:** Use `label-md` or `label-sm` in `on-surface-variant` (#acaaae) for secondary metadata to ensure the "Display" numbers pop.

## 4. Elevation & Depth: The Layering Principle
Depth is achieved through **Tonal Layering** rather than traditional structural lines.

*   **The Layering Principle:** Place a `surface-container-lowest` (#000000) card on a `surface-container-low` (#131316) section to create a soft "recessed" effect.
*   **Ambient Shadows:** Floating cards use an extra-diffused shadow: `offset: 0 20px, blur: 40px, color: rgba(0, 0, 0, 0.4)`. Never use pure grey shadows; always tint them toward the background.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` (#48474b) at **15% opacity**. 100% opaque borders are strictly forbidden.

## 5. Components: Bespoke Elements

### Buttons
- **Primary:** Gradient from `primary` to `primary-dim`. `roundness: lg` (0.5rem). High contrast text in `on-primary-fixed` (#003840).
- **Secondary (The Glass Button):** `surface-variant` background at 40% opacity with a `20px` backdrop blur. `Ghost Border` (15% opacity) enabled.
- **Tertiary:** Text-only in `primary`, no background, used for "See All" or "View Details."

### Bento Cards & Lists
- **Rule:** Forbid divider lines. Separate list items using `spacing-3` (1rem) of vertical whitespace or a subtle background shift to `surface-container-low` on hover.
- **Bento Modules:** Use `roundness: xl` (0.75rem). Apply a subtle inner-glow (top-down) using a 1px `outline-variant` at 10% opacity to catch the "light."

### Status Indicators (The Reward Pulse)
- **Pending:** `secondary` (#ffd709) - High-contrast gold suggests "Value in Transit."
- **Approved:** `tertiary` (#8eff71) - Neon green evokes "Growth/Success."
- **Reversed:** `error` (#ff716c) - A soft coral red, never aggressive.

### Data Visualization
Charts should use `primary` for the main trend line with a `primary-container` semi-transparent glow underneath. Avoid harsh axes; use `label-sm` for minimalist coordinates.

## 6. Do's and Don'ts

### Do:
- **Do** use `spacing-8` (2.75rem) or `spacing-10` (3.5rem) between major Bento sections to allow the design to breathe.
- **Do** use `primary` (#81ecff) sparingly—only for conversion points and success data.
- **Do** nest a `surface-container-highest` element inside a `surface-container-low` area to create immediate visual hierarchy.

### Don't:
- **Don't** use pure white (#ffffff) for body text. Use `on-surface` (#f0edf1) to prevent eye strain in dark mode.
- **Don't** use standard "Drop Shadows" on cards. Use tonal shifts or the "Ghost Border" fallback.
- **Don't** use sharp corners. Every element should follow the `Roundedness Scale` (Min: `md`, Max: `xl`) to maintain a premium, high-tech feel.