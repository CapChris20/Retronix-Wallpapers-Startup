# Retronix-Wallpapers-Startup
link: retronixwallpapers.com


## Project Overview

Retronix is a subscription-based wallpaper app designed to provide high-quality static and live wallpapers. Users can access different grids (LiveGrid, StaticGrid, PremiumGrid) based on their subscription tier. The app integrates with Firebase for authentication, Firestore for data storage, and Stripe for handling subscription payments.

## Features

* User authentication with Firebase Auth.
* Subscription tiers handled via Stripe Checkout.
* Weekly randomized static wallpapers using seeded shuffling.
* Live wallpapers with plashURL, downloadURL, and previewURL.
* Different grids for different types of wallpapers.
* Admin and developer-friendly JSON data structure.

## Tech Stack

* React (Frontend)
* Firebase Auth & Firestore
* Stripe (Checkout & Webhooks)
* Tailwind CSS for styling
* Netlify for hosting frontend
* IDrive e2 for storage of live wallpapers
* Supabase for live wallpaper URLs

## Getting Started

### Prerequisites

* Node.js
* npm
* Firebase account
* Stripe account
* Git

### Installation

1. Clone the repo: `git clone https://github.com/CapChris20/Retronix-Wallpapers-Startup.git`
2. Navigate to the project directory: `cd Retronix-Startup`
3. Install dependencies: `npm install`
4. Create a `.env` file for Firebase and Stripe keys (do not commit this file).
5. Start the development server: `npm start`

### Firebase Setup

* Configure Firebase Auth (Email/Password).
* Set up Firestore with collections for wallpapers.
* Configure Firebase Functions for Stripe webhook.
* Add `.env` variables for Firebase credentials.

### Stripe Setup

* Create products and pricing tiers in Stripe.
* Use Stripe Checkout for subscriptions.
* Ensure the webhook endpoint is configured in Firebase Functions.

## Project Structure

```
Retronix-Startup/
├─ functions/           # Firebase functions
│  └─ .env             # Private keys (do not commit)
├─ retronix/           # React app
│  ├─ dist/            # Build folder
│  └─ public/*.json    # Generated JSON
├─ retronix-live/      # Live wallpaper React app
│  └─ dist/            # Build folder
├─ .gitignore          # Git ignore rules
├─ package.json
├─ README.pdf          # PDF version of this README
```

## .gitignore Highlights

```
# macOS system files
.DS_Store

# Node modules
node_modules/

# Logs
*.log
pglite-debug.log

# Build / Dist folders
retronix/dist/
retronix-live/dist/

# Generated JSON files
retronix/public/*.json

# Firebase cache and config
.firebase/
.firebaserc
functions/.env

# Netlify files
.netlify/
retronix/.netlify/
functions/.netlify/

# Editor configs
.vscode/
*.sublime-workspace
*.sublime-project

# Misc
*.numbers
*.imresizer.jpg

# Wranglers / R2 dumper
r2-link-dumper/.wrangler
r2-link-dumper/pglite-debug.log
```

## Deployment

* **Frontend:** Deploy `retronix` and `retronix-live` using Netlify.
* **Backend Functions:** Deploy Firebase Functions for Stripe webhook.
* **Database:** Use Firestore to store wallpaper metadata.

## Notes

* Keep `.env` files out of Git.
* Use `git filter-repo` to remove sensitive files if accidentally committed.
* Ensure JSON data integrity for wallpaper display.

## License

This project is under MIT License.
