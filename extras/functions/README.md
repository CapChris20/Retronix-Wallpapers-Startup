# Firebase Functions Setup

## Environment Variables Required

Create a `.env` file in this directory with the following variables:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
```

## Installation

```bash
npm install
```

## Deployment

```bash
firebase deploy --only functions
```

## Security Note

Never commit your `.env` file to version control. It contains sensitive API keys. 