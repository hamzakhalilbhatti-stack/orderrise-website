# OrderRise — WhatsApp Restaurant Ordering Landing Page

A premium, static landing page for a WhatsApp-based restaurant ordering product. It is built with vanilla HTML, CSS, and JavaScript and can be deployed directly to GitHub Pages without a build process.

## Project structure

```text
whatsapp-order-agent-landing/
├── index.html
├── style.css
├── script.js
├── privacy.html
├── terms.html
├── README.md
└── assets/
    ├── logo.svg
    ├── favicon.svg
    ├── dashboard-preview.webp
    ├── restaurant-placeholder.webp
    └── og-image.webp
```

## How to run

Open `index.html` directly in a browser.

For a local development server, open PowerShell in the project folder and run:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Main configuration

Open `script.js` and edit the `SITE_CONFIG` object at the very top:

```javascript
const SITE_CONFIG = {
  brandName: "OrderRise",
  restaurantDemoName: "Taco Heat Demo",
  whatsappNumber: "923001234567",
  bookingUrl: "https://your-booking-link.example",
  email: "hello@yourdomain.com",
  linkedinUrl: "https://www.linkedin.com/in/your-profile",
  fiverrUrl: "https://www.fiverr.com/your-profile",
  monthlyPrice: 50,
  currency: "USD"
};
```

The WhatsApp number must use international format with digits only. Do not include `+`, spaces, brackets, or dashes.

When a contact value is empty or still contains placeholder text, the site handles it safely and displays a configuration notice rather than opening a broken link.

## Values to replace before publishing

- Brand name
- WhatsApp demo number
- WhatsApp pre-filled message in `getWhatsAppUrl()`
- Booking URL
- Email address
- LinkedIn URL
- Fiverr URL
- Restaurant demo name
- Menu items and prices in the animated chat
- Currency and monthly price
- Case-study content
- Client logo or restaurant photograph
- Testimonial and verified metrics
- Privacy Policy content
- Terms and Conditions content
- Open Graph image
- Canonical URL and domain name in `index.html`
- Structured-data details in `index.html`

## Important notes

- The phone conversation is a pre-scripted visual demonstration.
- No chatbot backend, database, payment service, or form backend is connected.
- The case-study section is clearly marked as placeholder content and must be replaced with approved, verified information before publishing.
- Review every public claim to confirm it matches the capabilities you actually deliver.
- Internet access is required for the real WhatsApp ordering service.
- The included privacy and terms pages are starter placeholders, not legal advice.

## Deploy to GitHub Pages

1. Create a new GitHub repository.
2. Upload all project files while preserving the folder structure.
3. Open the repository’s **Settings**.
4. Select **Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select the `main` branch and the `/root` folder.
7. Save and wait for GitHub to publish the site.
8. Replace the canonical and Open Graph URLs with the final GitHub Pages or custom-domain URL.

## Quality checks included

- Responsive layouts from 320px to large desktop widths
- Mobile navigation and sticky WhatsApp CTA
- Keyboard-accessible FAQ accordions
- Reduced-motion support
- Animated WhatsApp demo with mathematically correct `$12.00` total
- Configuration-driven contact links
- No external libraries or framework dependencies
- No private credentials or backend calls
- Semantic page structure and basic SEO metadata

## Future 404 page

For a custom GitHub Pages 404 experience, duplicate the main header and footer into a new `404.html` file and add a clear button linking back to `index.html`.

## Color Theme

The current build uses the **Caper & Copper** palette. The central color variables are at the top of `style.css` and are reinforced in the `CAPER & COPPER THEME` block near the end of the file.
