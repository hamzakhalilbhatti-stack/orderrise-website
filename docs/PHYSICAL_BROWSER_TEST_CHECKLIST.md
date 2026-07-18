# Physical Device and Browser Checklist

The generated files pass structural, syntax and local HTTP checks. Complete
these physical-device checks before public deployment.

## Android on mobile data

- Confirm headline and static workflow appear immediately.
- Confirm all seven hero stages are horizontally accessible.
- Run all Taco Heat quick replies.
- Open every FAQ answer.
- Tap the WhatsApp CTA.
- Confirm no horizontal page scrolling.

## Desktop

Test current Chrome, Edge, Firefox and Safari where available:

- Confirm the static hero is visible before WebGL starts.
- Confirm the hero 3D enhancement appears only when supported.
- Click all seven hero stage controls.
- Confirm Admin Hub module content changes.
- Confirm Taco Heat demo, ROI calculator and FAQ work without 3D.

## Slow connection

In Chrome DevTools select Network → Slow 3G and disable cache:

- The headline, CTA and static workflow must remain visible.
- The page must not display repeated unavailable messages.
- The Taco Heat demo must remain usable after JavaScript loads.
