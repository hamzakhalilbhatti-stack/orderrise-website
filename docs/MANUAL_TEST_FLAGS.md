# Task 9 — Manual Testing Flags

No automated production fixes were applied for the items below.

## Real-device 3D reliability

After removing the journey, pillar and device scenes, **3 homepage WebGL fallback blocks remain**:

1. Guided 3D order process — `hero3dCanvas`
2. Product proof — `orderDemoCanvas`
3. Admin Hub command center — `adminCanvas`

The owner should test these on:

- A mid-range Android phone using mobile data
- Chrome on Android
- Chrome, Firefox and Safari on desktop where available
- Chrome DevTools with **Slow 3G** and cache disabled

Check whether the written controls remain usable and whether fallback text appears repeatedly during normal loading.

## Pricing page business review

`pricing.html` currently presents three implementation categories:

- Restaurant Pilot
- Growth Setup
- Multi-Location

It does **not** yet publish finalized tier prices or a detailed feature matrix. This is flagged for a manual business decision and was not changed automatically.
