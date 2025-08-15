# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Netlify Proxy Function for Supabase URLs

This project includes a Netlify function at `netlify/functions/proxy.js` that allows you to proxy any external URL (such as Supabase video links) to fix CORS issues and return the content as base64-encoded data.

### Usage

To use the proxy, replace any Supabase (or other) URL on the frontend with:

```
/.netlify/functions/proxy?url=ENCODED_SUPABASE_URL
```

Where `ENCODED_SUPABASE_URL` is the URL-encoded version of your original Supabase link.

**Example:**
```
/.netlify/functions/proxy?url=https%3A%2F%2Fnfedqczwuvfwfyvksnak.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fretronix-live%2FNeonCube_05.mp4
```

### Running Locally

To test the proxy and your site locally with Netlify Functions:

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the local Netlify dev server:
   ```sh
   netlify dev
   ```

This will serve your site and functions at `http://localhost:8888` by default.

### Deployment

To deploy your site and functions to Netlify:

1. Log in to Netlify (if not already):
   ```sh
   netlify login
   ```
2. Link your local folder to the Netlify site:
   ```sh
   netlify link
   ```
   (Follow prompts to select or enter your site name)
3. Deploy:
   ```sh
   netlify deploy --prod --dir=retronix/dist
   ```

### Automation Script

You can automate install and deployment with:

```sh
npm install && netlify login && netlify link && npm run build --workspace=retronix && netlify deploy --prod --dir=retronix/dist
```

## Netlify Streaming Proxy Function for Video Files

This project includes a Netlify function at `netlify/functions/proxy.js` that acts as a streaming proxy for video files hosted on external URLs (like Supabase Storage).

### Usage in Frontend

To use the proxy for video streaming, replace any direct video URL with:

```
/.netlify/functions/proxy?url=ENCODED_VIDEO_URL
```

Where `ENCODED_VIDEO_URL` is the URL-encoded version of your original video link.

**Example:**
```html
<video controls src="/.netlify/functions/proxy?url=https%3A%2F%2Fnfedqczwuvfwfyvksnak.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fretronix-live%2FNeonCube_05.mp4"></video>
```

This proxy supports HTTP Range requests, so video seeking and partial loading will work as expected.

### Running Locally

To test the proxy and your site locally with Netlify Functions:

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the local Netlify dev server:
   ```sh
   netlify dev
   ```

This will serve your site and functions at `http://localhost:8888` by default.

### Deployment

To deploy your site and functions to Netlify:

1. Log in to Netlify (if not already):
   ```sh
   netlify login
   ```
2. Link your local folder to the Netlify site:
   ```sh
   netlify link
   ```
   (Follow prompts to select or enter your site name)
3. Build your site:
   ```sh
   cd retronix
   npm run build
   cd ..
   ```
4. Deploy:
   ```sh
   netlify deploy --prod --dir=retronix/dist
   ```
