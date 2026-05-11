# Revelti UX Strategy & Decision Architecture

Based on the competitor analysis, the competitor's system is inherently **database-driven**, prioritizing absolute edge-case flexibility over user guidance. This forces the organizer to translate their real-world goals (e.g., "I want to sell 500 tickets total and run an early-bird promo") into abstract relational database logic (Tickets + Stock Pools + Discount Mapping).

To design a superior product experience, Revelti must shift from a **database-driven architecture** to an **intent-driven architecture**.

Here is how Revelti can outperform the competitor in usability, clarity, and cognitive load reduction:

## 1. Unified Capacity Architecture (Solving Fragmented Stock Control)
**Competitor Failure:** Separates ticket creation from "Stock control," requiring users to build abstract relational links to prevent overselling. 
**Revelti Solution: "Visual Capacity Pools"**
*   **Venue Cap Guardrail:** Introduce a global "Venue Capacity" at the event level. 
*   **Inline Pooling:** In `ticketManagement.html`, instead of forcing users to a new page, allow them to simply drag and drop tickets into a "Shared Capacity Pool" directly on the main table.
*   **Visual Feedback:** Display a unified capacity bar at the top of the ticketing page. As users set individual ticket limits, the bar fills up toward the Venue Cap, providing instant visual reassurance that they aren't overselling.

## 2. Interactive Pricing Timeline (Solving Blind Configuration)
**Competitor Failure:** High cognitive load caused by entering dynamic pricing dates/sales targets blindly without seeing the resulting timeline.
**Revelti Solution: "The Yield Curve Preview"**
*   **Visual Validation:** In the `createEvent.html` and `ticketManagement.html` dynamic pricing modals, render a simple horizontal timeline chart.
*   **Immediate Context:** As a user adds a pricing rule (e.g., "Increase to €190 on Sept 1"), the timeline updates. This removes the need for mental gymnastics and visually flags errors (like setting a date backwards or creating a gap).

## 3. Unified Campaign Engine (Solving Siloed Promotional Tools)
**Competitor Failure:** Forces users to jump between "Discounts," "Private Sales," and "Promoters" to build a comprehensive marketing strategy.
**Revelti Solution: "Access & Incentives Hub"**
*   Instead of maintaining separate tables for "Discount Codes", unify these mechanics into a single **Campaigns** mental model.
*   A campaign consists of a **Trigger** (e.g., a promo code, a specific URL, or a promoter's referral) and a **Result** (e.g., 10% off, unlock a hidden VIP ticket). 
*   This drastically reduces navigation friction and allows powerful combinations (e.g., a promoter link that also unlocks a hidden ticket) through a single, clean interface.

## 4. Smart Inheritance (Solving Redundant Data Entry)
**Competitor Failure:** Forces repetitive configuration for attendee data requirements across every single ticket variant.
**Revelti Solution: "Event-Level Defaults with Granular Overrides"**
*   Move checkout data requirements (e.g., Require ID, Require Phone Number) to the Event level.
*   All tickets inherit these rules by default. 
*   Only expose a "Custom Data Collection" toggle on the individual ticket modal if the user explicitly wants to override the global setting (e.g., asking for a T-shirt size only on the VIP pass).

## 5. Deferring the Friction (Solving Flow Interruption)
**Competitor Failure:** Interrupts the initial 6-step wizard by forcing heavy tasks like Organizer Profile creation and fee distribution choices.
**Revelti Solution: "The Pre-Flight Check"**
*   Keep the `createEvent.html` wizard strictly focused on the event itself (What, Where, When, Tickets).
*   Use a **"Draft First, Configure Later"** approach. Let the user finish the fun part (creating the event) quickly.
*   Move bureaucratic friction (Bank details, precise fee splitting, legal Organizer verification) to a final "Pre-Flight Checklist" that only gates the **Publishing** action, not the **Drafting** action.

## Summary of Differentiation
By implementing these strategies, Revelti shifts the cognitive burden from the user to the system. The system should calculate the dates, visualize the capacity, and inherit the mundane settings, leaving the organizer to focus purely on their event strategy.
