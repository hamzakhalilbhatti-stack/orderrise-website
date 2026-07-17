# Stage 5.1 — Complete Real 3D Website

## Status

Completed.

## Requirement corrected

The previous Stage 5 design used CSS depth and was not genuine 3D. Stage 5.1 replaces that limitation with actual Three.js/WebGL scenes.

## Homepage real 3D scenes

### Cinematic hero

- Floating smartphone
- Cutaway restaurant
- Kitchen equipment and display
- Inventory shelves and stock boxes
- Delivery station and scooter
- Owner desk and dashboards
- AI order core
- Glowing workflow path
- Animated order data
- Camera focus controls
- Optional synthesized interface sound

### Interactive WhatsApp order demo

- Product enters the cart
- Cart state changes
- Inventory visibly decreases
- Spicy modifier appears
- Extra cheese appears
- Coupon appears
- Kitchen ticket activates
- Driver becomes available
- Scooter moves
- Owner revenue bars update

### Seven-scene journey

1. Capture
2. Understand
3. Validate
4. Checkout
5. Kitchen
6. Delivery
7. Owner Intelligence

Each scroll stage changes the 3D camera, scene objects and information overlays.

### Five product pillars

1. Intelligent Ordering
2. Restaurant Operations
3. Customers and Growth
4. Delivery Management
5. Owner Intelligence

### Additional 3D scenes

- Floating device showcase
- Admin Hub command center
- Final cinematic pull-away scene
- Eight restaurant-specific solution scenes

## Launch pages

- Home
- Product
- Features
- How It Works
- Solutions
- Interactive Demo
- Pricing
- About
- Contact
- Privacy
- Terms

## Restaurant solution pages

- Fast Food
- Pizza Restaurants
- Cafes
- Cloud Kitchens
- Burger Restaurants
- Bakeries
- Takeaway
- Multi-Location

## Performance

- Pixel ratio is capped
- Geometry is procedural and optimized
- Rendering pauses when canvases are far outside the viewport
- Reduced-motion preferences are respected by website motion
- CSS fallbacks appear when WebGL cannot start

## Deployment

This remains a static GitHub Pages website. Three.js is loaded as an exact-version ES module from jsDelivr.
