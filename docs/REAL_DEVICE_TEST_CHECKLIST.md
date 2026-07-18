# Real Device Test Checklist

Automated browser checks passed for layout and interaction. The build
environment does not provide a usable WebGL GPU, so perform these final checks
before public launch.

## Android mobile data test

Use a mid-range Android phone on mobile data:

- Open the homepage
- Confirm the static workflow appears immediately
- Confirm no blank 3D area appears
- Open the mobile menu
- Run all Taco Heat quick replies
- Open every FAQ
- Tap the WhatsApp CTA
- Confirm no horizontal scrolling

## Desktop browsers

Test current versions of:

- Chrome
- Edge
- Safari on macOS, when available
- Firefox

Confirm:

- Static hero appears while WebGL initializes
- 3D replaces the static visual only when successful
- Taco Heat demo remains usable if WebGL is disabled
- Admin Hub tabs work
- Pricing and ROI work
- Contact form displays the local success message

## Slow connection

Use browser network throttling:

- Slow 4G
- Disable cache
- Reload
- Confirm text and static workflow appear before Three.js
