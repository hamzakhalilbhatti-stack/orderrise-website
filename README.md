# OrderRise — Streamlined 3D Sales Website

OrderRise is a restaurant automation website that explains one clear promise:

**One WhatsApp message becomes a connected restaurant workflow.**

The homepage now contains:

1. One concise value-focused hero
2. One lightweight Three.js restaurant scene
3. Four restaurant pain points
4. One interactive Taco Heat order demo
5. One combined product workspace
6. Restaurant-specific solutions
7. Pricing and ROI calculator
8. FAQ and demo-booking conversion section

## Performance decisions

- Only one WebGL renderer runs on the homepage.
- Repeated 3D journey, device and command-center canvases were removed.
- The practical order demo uses lightweight HTML, CSS and JavaScript.
- Three.js is included locally.
- The website works on GitHub Pages without npm or a build command.
- A text fallback appears only when WebGL genuinely cannot start.

## Run locally

Double-click:

`start-website.bat`

Or run:

```powershell
python -m http.server 8080
```

Open:

`http://localhost:8080/`

## Upload to GitHub

```powershell
git add .
git commit -m "Launch streamlined OrderRise 3D sales website"
git push origin main
```

## Important

The Taco Heat demonstration uses fictional data. The static contact form does
not transmit information and is not connected to a production restaurant
backend.
