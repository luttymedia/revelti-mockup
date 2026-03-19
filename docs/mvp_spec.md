1. Project Overview

The project is a specialized event management and media collaboration platform designed for the dance and entertainment industry. It bridges the gap between Event Organizers, Media Creatives (photographers/videographers), and Attendees.

The goal of the MVP is to provide a seamless workflow for creating events, managing ticket sales, and automating the delivery of professional media to attendees while ensuring creatives can monetize their work.

2. User Roles & Value Proposition

2.1 Event Organizer
Goal: Efficiently manage events, sell tickets, and collaborate with media professionals to enhance event value.
Key Value: Seamless collaborator management and integrated financial tracking.

2.2 Media Creative
Goal: Upload, organize, and monetize high-quality event media.
Key Value: Automated gallery generation, watermark protection, and direct sales to attendees.

2.3 Attendee
Goal: Discover events, purchase tickets, and access personal media captured during events.
Key Value: A central hub for event tickets and high-quality memories.

3. Core MVP Features

3.1 Organizer Workflow
Event Wizard: Multi-step creation (Core Details → Description/Media → Ticketing → Collaborators).
Ticketing Engine: Support for Simple (fixed) and Dynamic pricing (tier-based by date or sales volume).
Collaborator Hub: Invite Creatives and Promoters; manage permissions (e.g., specific gallery folder access).
Financial Dashboard: Overview of gross/net revenue, ticket sales volume, and pending breakouts.

3.2 Creative Workflow
Media Upload Manager: Robust drag-and-drop system supporting RAW, JPG, and MP4.
Studio Workspace (Root Layer):
Organize media into hierarchical folders.
Modular Gallery Architecture: Any folder can be toggled as a "Gallery" independently, regardless of its parent or child folder status.
Visual indicators (badges) for gallery status and visibility.
Gallery Management:
Dedicated layer for managing high volumes of galleries.
Grid and List view modes with advanced filtering (by status, event, or name).
Bulk actions for visibility and watermark settings.
Analytics & Monitoring:
Media Assets Stats: Tracking total assets, uploads per event, and engagement.
Storage Monitoring: Real-time tracking of space usage (GB) against plan limits.
Revenue Tracking: Direct sales from media and promoter-driven conversions.

3.3 Attendee Experience
Unified Dashboard: Manage "My Tickets" (QR codes) and "My Media" (curated galleries from attended events).
Discovery: Follow favorite organizers and creators to receive notifications for new events/media.
Seamless Purchase: Integrated checkout for both event tickets and premium media downloads (Full-Res).

4. MVP Scope Summary

Feature Area
Mandatory (MVP)
Deferred (Post-MVP)
Auth
Multi-role Login (Email/Social)
Advanced Role Permissions (Team/Staff)
Events
Wizard, Ticketing, Independent Galleries
AI-Driven Demand Forecasting
Media
Folder-level Collaborators, Watermarking
In-browser RAW Editing, AI Auto-Tagging
Payments
Stripe/PayPal Integration
Multi-Currency Auto-Conversion
Stats
Assets & Storage Analytics
Predictive Revenue Modeling


5. Required Deliverables

Full-Stack Web Application: Responsive design (Mobile-optimized for Attendees; Professional Desktop for Organizers/Creatives).
API Documentation: Clear documentation for all core endpoints.
Admin Panel: Basic system-wide management (User moderation, Dispute resolution).
Deployment Guide: Step-by-step instructions for staging and production (AWS/GCP/Vercel).

6. Architecture Constraints (MVP)

No Circular Hierarchy: Galleries are independent distribution layers; deleting a "Gallery" toggle does not delete the source folder.
Collaborator Privacy: Organizers cannot see the Creative's entire workspace; only folders explicitly shared.
Scalability: Frontend must handle 100+ galleries and 1,000+ folders in the Studio view without UI lag.
