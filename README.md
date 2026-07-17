# OrderRise — Clear Colorful Real 3D Website

This is the clarity-focused real 3D version of OrderRise.

## What makes the process easy to understand

The complete workflow uses one consistent color language:

- Green: WhatsApp message
- Purple: AI understanding
- Orange: cart and checkout
- Amber: kitchen
- Blue: inventory
- Pink: delivery
- Cyan: owner reporting

Every main scene contains visible labels, numbered process stages and written explanations.

## Start on Windows

Double-click:

```text
start-website.bat
```

Or run:

```powershell
cd "PATH-TO-THIS-FOLDER"
python -m http.server 8080
```

Then open:

```text
http://localhost:8080/
```

## Test 3D support

Open:

```text
http://localhost:8080/diagnostics.html
```

The diagnostics page tests WebGL, the local Three.js module, renderer creation and animation.

## No CDN required for Three.js

Three.js, OrbitControls and RoundedBoxGeometry are stored in `vendor/`, so the 3D scenes do not depend on a remote Three.js CDN.

## Main files

- `index.html`
- `style.css`
- `script.js`
- `three-scene.js`
- `page-scene.js`
- `diagnostics.html`
- `vendor/`
- `solutions/`
- `docs/`

## GitHub Pages

The project is a static website and can be deployed directly from the repository `main` branch and root folder.
