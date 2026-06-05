# Auth0 by Okta Copilot Knowledge Demo

This is a small local demo site that uses the official Auth0 JavaScript SDK and shows protected knowledge content that can later be published for a Copilot agent.

## What the demo does

- Runs locally at `http://localhost:3000`.
- Uses Auth0 OIDC sign-in through `@auth0/auth0-spa-js`.
- Shows a searchable knowledge base after sign-in.
- Keeps the Vite dev server pinned to port `3000` with `--strictPort` so Auth0 redirect URLs do not drift.

## Create the Auth0 app

1. Sign in to your Auth0 dashboard.
2. Go to **Applications** > **Applications**.
3. Create or open a **Single Page Application**.
4. Add this **Allowed Callback URL**:

   ```text
   http://localhost:3000/
   ```

5. Add this **Allowed Logout URL**:

   ```text
   http://localhost:3000/
   ```

6. Add this **Allowed Web Origin**:

   ```text
   http://localhost:3000
   ```

7. Save the app and copy the **Domain** and **Client ID**.

## Configure the local app

Copy `.env.example` to `.env`:

```powershell
Copy-Item .env.example .env
```

Edit `.env`:

```text
VITE_AUTH0_DOMAIN=YOUR_AUTH0_DOMAIN
VITE_AUTH0_CLIENT_ID=YOUR_AUTH0_CLIENT_ID
```

Do not put a client secret in this app. Browser-based SPA apps use the client ID only.

## Run it

```powershell
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Later Copilot connection

For this demo, do not use Copilot Studio website knowledge to crawl the protected portal. Website knowledge is best for crawlable pages, and it usually cannot authenticate through an Auth0 login page.

Use a Copilot Studio **action** backed by a custom connector instead:

1. Publish the API to a reachable HTTPS host.
2. Create an Auth0 API with this identifier:

   ```text
   https://okta-copilot-knowledge-api
   ```

3. Set the hosted API environment variables:

   ```text
   AUTH0_DOMAIN=dev-tbfw8qyfvlbbfixc.us.auth0.com
   AUTH0_AUDIENCE=https://okta-copilot-knowledge-api
   PORT=3001
   ```

4. Import `openapi.auth0-knowledge-api.yaml` into a Power Platform custom connector.
5. Replace these placeholders in the OpenAPI file:

   ```text
   https://YOUR-PUBLISHED-API-HOST
   YOUR_AUTH0_DOMAIN
   ```

6. Configure the custom connector OAuth settings with Auth0 authorization and token URLs.
7. Add the connector action to the Copilot agent and call `searchKnowledge` when the user asks questions about protected content.

Local API test commands:

```powershell
npm.cmd run api
```

Health endpoint:

```text
http://localhost:3001/api/health
```

Protected search endpoint:

```text
http://localhost:3001/api/knowledge/search?q=password
```

The protected search endpoint should return `401 Unauthorized` unless the caller sends a valid Auth0 access token for the configured audience.
