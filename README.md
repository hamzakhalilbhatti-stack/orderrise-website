# OrderRise Hybrid Sales + Guided 3D Website

This version combines:

- Clear restaurant-focused sales messaging
- Guided Three.js restaurant scenes
- An interactive WhatsApp order demonstration
- Kitchen, inventory, delivery and owner explanations
- Responsive desktop and mobile layouts
- Separate product, feature, solution, pricing and company pages

## Website purpose

OrderRise turns customer messages on WhatsApp into structured restaurant operations:

WhatsApp → AI → Cart → Kitchen → Inventory → Delivery → Owner reporting

## Start locally

Double-click:

`start-website.bat`

Or run:

```powershell
python -m http.server 8080
```

Then open:

`http://localhost:8080/`

## Main files

- `index.html` — hybrid sales homepage
- `style.css` — complete responsive design
- `script.js` — UI and product-demo interactions
- `three-scene.js` — homepage Three.js scenes
- `page-scene.js` — subpage Three.js scenes
- `diagnostics.html` — WebGL browser test
- `vendor/` — local Three.js modules

## Upload to GitHub

```powershell
git add .
git commit -m "Build OrderRise hybrid sales and guided 3D website"
git push origin main
```

The demonstration uses fictional information and does not connect to the production restaurant backend.
