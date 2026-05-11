# Revelti Interaction Models UI Translation

This document translates the conceptual interaction models from `interaction_models.json` into concrete UI logic and structures, integrated into the existing Revelti mockups (e.g., `createEvent.html` and `ticketManagement.html`).

## 1. Unified Capacity Architecture
**Goal:** Set ticket availability limits without exceeding the total physical space of the venue.

### UI Structure
*   **Where it lives:** `ticketManagement.html` and Step 3 of `createEvent.html` (Ticketing).
*   **Components:** 
    *   **Global Capacity Bar:** A visual progress bar at the top of the Ticketing section indicating `Allocated Tickets / Venue Capacity`.
    *   **Shared Pool Container:** A visual grouping box in the ticket list to cluster linked tickets together.
*   **Visual Organization:** The Venue Capacity input sits right above the ticket list. Shared pools are represented as parent rows or visually grouped cards in the ticket table.

### User Flow
1.  User enters a number in a new `Venue Capacity` input field.
2.  System displays the global capacity progress bar (e.g., `0 / 500`).
3.  User creates individual tickets.
4.  User selects multiple tickets and clicks a "Link Capacity" button (replacing complex drag-and-drop).
5.  System groups the selected tickets into a "Shared Capacity Pool" and prompts for a shared limit.
6.  User sets the limit, and the global progress bar updates automatically.

### State Logic
*   **Default:** Venue capacity is undefined (infinite). Tickets have individual limits.
*   **Active:** Venue capacity defined. Progress bar recalculates on every keystroke in ticket quantity fields.
*   **Error:** The sum of ticket limits (or pool limits) exceeds the Venue Capacity. The progress bar turns red, and saving/publishing is blocked.

### Micro-interactions
*   Smooth, animated fill on the progress bar as quantities change.
*   Red warning text and tooltip when the limit is exceeded.
*   A "snap" animation when tickets are grouped into a pool.

### Simplification Notes
*   *Drag-and-drop is unnecessary complexity.* Instead, use a simple multi-select checkbox on the ticket table with a "Group into Shared Pool" bulk action.
*   System should auto-suggest the venue capacity based on the selected Venue (if known).

---

## 2. Interactive Pricing Timeline
**Goal:** Configure and verify scheduled price changes or quantity-based price tiers.

### UI Structure
*   **Where it lives:** Inside the "Create/Edit Ticket" modal (`ticketManagement.html`), specifically when the "Dynamic Pricing" strategy is selected.
*   **Components:** A simplified CSS-based step-timeline or sparkline chart appearing below the pricing rules.

### User Flow
1.  User selects "Dynamic Pricing".
2.  User inputs the Base Price.
3.  User clicks "+ Add Pricing Rule", selecting a date or sales threshold and a new price.
4.  System instantly plots a node on the horizontal timeline chart representing the price jump.

### State Logic
*   **Default:** Simple Price (no timeline).
*   **Active:** Rules added. Timeline visualizes the step-function curve of the price over time/sales.
*   **Error:** Chronological gap or out-of-order dates (e.g., jumping back in time).
*   **Edge Case:** Mixed rules (dates and sales). System plots two separate timeline tracks or uses a dotted line for conditional sales jumps.

### Micro-interactions
*   Hovering over a node on the timeline shows a tooltip with exact details (e.g., "€190 on Sept 1").
*   Conflicting rules flash red on the timeline.

### Simplification Notes
*   Avoid heavyweight charting libraries (like D3). Use a simple flexbox/CSS step-progress bar to represent the tiers visually. It reduces load time and cognitive overhead.

---

## 3. Unified Campaign Engine
**Goal:** Create promotional strategies using codes, links, or referrals in one place.

### UI Structure
*   **Where it lives:** Replaces the "Discount Codes" section in `ticketManagement.html`. Rename to "Campaigns & Promotions".
*   **Components:** The existing Code Modal is expanded to support "Triggers" and "Results".

### User Flow
1.  User clicks "Create Campaign".
2.  User selects a **Trigger** (e.g., "Promo Code" -> inputs "VIP10").
3.  System shows a green checkmark validating code uniqueness.
4.  User selects a **Result** (e.g., "Reveal Hidden Ticket" -> selects "Backstage Pass").
5.  System generates a plain-English summary: *"When attendee uses code VIP10, they will unlock Backstage Pass."*

### State Logic
*   **Default:** Simple discount percentage.
*   **Active:** Campaign active; triggers map to results.
*   **Error:** Duplicate trigger code entered. System disables the Save button.

### Micro-interactions
*   Dynamic natural-language sentence building at the bottom of the modal to confirm the logic.
*   Inline validation (green check / red cross) for unique codes.

### Simplification Notes
*   Don't build a new page. The existing discount modal already has 80% of this structure. Just add an "Action Type" dropdown (Discount vs. Reveal) to handle the "Result" side of the engine.

---

## 4. Smart Inheritance
**Goal:** Set checkout questions for all tickets, altering them only when a specific ticket requires it.

### UI Structure
*   **Where it lives:** A new "Checkout Settings" global panel in `ticketManagement.html`, plus a local toggle inside the individual Ticket Modal.
*   **Components:** Global toggles for common fields (Phone, T-Shirt, Address). A "Custom Data Collection" toggle in the Ticket Modal.

### User Flow
1.  User sets global defaults (e.g., "Require Phone Number" = ON).
2.  User edits a specific "VIP Ticket".
3.  User toggles "Override Checkout Questions".
4.  System expands a local panel pre-filled with the global defaults (Phone = ON).
5.  User adds a local custom question ("T-Shirt Size").

### State Logic
*   **Default:** `use_custom_data_collection` is false. Ticket silently inherits global rules.
*   **Active:** Toggle is true. Inheritance is broken; local schema is saved.
*   **Error:** Invalid custom question format.

### Micro-interactions
*   When overriding, the UI visually pulls down the global settings into the modal so the user doesn't start from scratch.
*   Tickets with overrides display a small badge in the ticket list (e.g., "⚙️ Custom Checkout").

### Simplification Notes
*   Avoid a complex drag-and-drop form builder for checkout questions. Use simple toggle switches for 90% of use cases (Phone, ID, Address) and a basic text input for custom questions.

---

## 5. Deferring the Friction
**Goal:** Build the core event quickly without being blocked by administrative setup.

### UI Structure
*   **Where it lives:** `createEvent.html` (Submit process) and the Event Dashboard.
*   **Components:** "Save Draft" vs "Publish" buttons. A "Pre-Flight Checklist" Modal.

### User Flow
1.  User fills out basic event info and clicks "Next" through the wizard.
2.  System saves the event implicitly as a "Draft".
3.  User clicks the final "Publish Event" button.
4.  System intercepts and opens the Pre-Flight Checklist modal if bank/tax details are missing.
5.  User enters the required admin details inside the modal.
6.  Event is published.

### State Logic
*   **Default:** Event status is Draft. Minimal validation required to save.
*   **Active:** Transitioning to Published. Strict schema validation applies.
*   **Error:** Missing mandatory bank/legal fields. Publish blocked.

### Micro-interactions
*   Checklist items show gray circles that animate to green checkmarks as they are completed.
*   A celebratory confetti animation fires when the event finally transitions to "Live".

### Simplification Notes
*   Keep the Pre-Flight checklist inside a modal on the Event Creation screen. Do not redirect the user to a global Account Settings page, as this breaks the flow and causes abandonment.
