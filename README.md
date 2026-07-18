# OrderRise — Consolidated Landing Page Revision

This build implements the final consolidation specification for OrderRise.

## Core product message

OrderRise turns a WhatsApp customer order into coordinated kitchen, inventory,
delivery and owner workflows.

## Process explanations kept

Only two detailed process experiences remain:

1. The hero's interactive seven-stage 3D flow
2. The Taco Heat chat and live restaurant-state demo

## Duplicate content removed

- Complete-process arrow list
- Seven-scene scroll walkthrough
- Five-system product-pillar section
- Floating device showcase
- Separate 3D demo destination
- Repeated subpage WebGL canvases
- Defensive meta-narration

## Product section

The product is consolidated into one Admin Hub with these modules:

- Orders
- Kitchen
- Receipts
- Promotions
- Customers
- Deliveries
- Reports
- Inventory
- Menu
- System

Useful capabilities from the former product-pillar section now appear under the
relevant Admin Hub module.

## CTA hierarchy

Primary action:

- Message Hamza on WhatsApp

Secondary action:

- Book a call through `contact.html`

The published WhatsApp link currently uses `923001794940`. Confirm this is the
number you want public before deployment.

## Pricing

- Starter — from $50/month
- Growth — custom quote
- Multi-location — custom quote

## Trust and proof

The About page names Hamza Khalil and states that OrderRise is based in Lahore,
Pakistan. No client logo, testimonial, response-time statistic or result has
been invented. Use `docs/REAL_PROOF_CHECKLIST.md` after the first approved pilot.

## 3D reliability

- Static workflow content is visible by default.
- Homepage WebGL is a progressive desktop enhancement.
- Mobile and reduced-motion visitors retain the static workflow.
- Unused order-demo, journey, pillar, device and command-center WebGL builders
  were removed from `three-scene.js`.
- Subpages do not load WebGL.

## Run locally

```powershell
python -m http.server 8080
```

Open `http://localhost:8080/`.

## Deploy

```powershell
git add .
git commit -m "Consolidate OrderRise landing page content and CTAs"
git push origin main
```
