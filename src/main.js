import { createAuth0Client } from "@auth0/auth0-spa-js";
import { knowledgeArticles, searchKnowledge } from "./knowledge.js";
import "./styles.css";

const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: getAppUrl(),
    scope: "openid profile email"
  }
};

const isConfigured =
  Boolean(auth0Config.domain) &&
  Boolean(auth0Config.clientId) &&
  !auth0Config.domain.includes("YOUR_AUTH0_DOMAIN") &&
  !auth0Config.clientId.includes("YOUR_AUTH0_CLIENT_ID");

let auth0Client = null;

const state = {
  isAuthenticated: false,
  user: null,
  query: "",
  error: ""
};

const app = document.querySelector("#app");

function render() {
  const results = searchKnowledge(state.query);

  app.innerHTML = `
    <main class="shell">
      <section class="hero">
        <div>
          <p class="eyebrow">Auth0 by Okta + Copilot demo</p>
          <h1>Protected knowledge portal</h1>
          <p class="lede">
            A small starter site that uses Auth0 sign-in and presents curated knowledge content that can later be published for a Copilot agent.
          </p>
        </div>
        <div class="auth-card">
          ${renderAuthCard()}
        </div>
      </section>

      ${state.error ? `<div class="notice danger">${escapeHtml(state.error)}</div>` : ""}
      ${!isConfigured ? renderSetupPanel() : ""}

      <section class="grid">
        <article class="panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">Knowledge source</p>
              <h2>Searchable articles</h2>
            </div>
            <span class="badge">${knowledgeArticles.length} articles</span>
          </div>
          ${
            state.isAuthenticated
              ? renderKnowledgeSearch(results)
              : `<div class="locked">Sign in with Auth0 to view the protected knowledge content.</div>`
          }
        </article>

        <aside class="panel">
          <p class="eyebrow">Copilot readiness</p>
          <h2>How this connects later</h2>
          <ol class="steps">
            <li>Publish the site or knowledge API to an HTTPS URL.</li>
            <li>Use that URL as a Copilot Studio website knowledge source, or expose search through a custom connector.</li>
            <li>Keep Auth0 in front of the app/API when the demo needs identity-based access.</li>
          </ol>
          <div class="code-card">
            <span>Current demo URL</span>
            <code>${escapeHtml(getAppUrl())}</code>
          </div>
          <div class="code-card">
            <span>Callback URL</span>
            <code>${escapeHtml(getAppUrl())}</code>
          </div>
        </aside>
      </section>
    </main>
  `;

  bindEvents();
}

function renderAuthCard() {
  if (!isConfigured) {
    return `
      <p class="status warning">Auth0 not configured</p>
      <p>Add your Auth0 domain and client ID to a local <code>.env</code> file.</p>
    `;
  }

  if (state.isAuthenticated && state.user) {
    return `
      <p class="status success">Signed in</p>
      <p class="muted">Welcome, ${escapeHtml(state.user.name || state.user.email || "Auth0 user")}.</p>
      <button id="logout-button" class="secondary-button" type="button">Sign out</button>
    `;
  }

  return `
    <p class="status">Signed out</p>
    <p class="muted">Sign in to view the protected demo knowledge base.</p>
    <button id="login-button" class="primary-button" type="button">Sign in with Auth0</button>
  `;
}

function renderSetupPanel() {
  return `
    <section class="panel setup">
      <p class="eyebrow">First-time Auth0 setup</p>
      <h2>Configure your Auth0 application</h2>
      <ol class="steps">
        <li>Use the Auth0 Single Page Application you created.</li>
        <li>Add Allowed Callback URL <code>${escapeHtml(getAppUrl())}</code>.</li>
        <li>Add Allowed Logout URL <code>${escapeHtml(getAppUrl())}</code>.</li>
        <li>Add Allowed Web Origin <code>${escapeHtml(window.location.origin)}</code>.</li>
        <li>Copy <code>.env.example</code> to <code>.env</code> and paste your Auth0 domain and client ID.</li>
      </ol>
    </section>
  `;
}

function renderKnowledgeSearch(results) {
  return `
    <label class="search-label" for="knowledge-search">Search knowledge</label>
    <input
      id="knowledge-search"
      class="search-input"
      type="search"
      value="${escapeAttribute(state.query)}"
      placeholder="Try okta, copilot, support, or demo"
    />
    <div class="results">
      ${
        results.length
          ? results.map(renderArticle).join("")
          : `<div class="locked">No articles matched your search.</div>`
      }
    </div>
  `;
}

function renderArticle(article) {
  return `
    <article class="article-card">
      <div class="article-header">
        <h3>${escapeHtml(article.title)}</h3>
        <span class="badge">${escapeHtml(article.category)}</span>
      </div>
      <p>${escapeHtml(article.summary)}</p>
      <details>
        <summary>Show full content</summary>
        <p>${escapeHtml(article.content)}</p>
        <p class="muted">Audience: ${escapeHtml(article.audience)}</p>
      </details>
    </article>
  `;
}

function bindEvents() {
  document.querySelector("#login-button")?.addEventListener("click", () => {
    auth0Client.loginWithRedirect();
  });

  document.querySelector("#logout-button")?.addEventListener("click", () => {
    auth0Client.logout({
      logoutParams: {
        returnTo: getAppUrl()
      }
    });
  });

  document.querySelector("#knowledge-search")?.addEventListener("input", (event) => {
    state.query = event.target.value;
    render();
    document.querySelector("#knowledge-search")?.focus();
  });
}

async function initializeAuth() {
  if (!isConfigured) {
    render();
    return;
  }

  try {
    auth0Client = await createAuth0Client(auth0Config);

    const params = new URLSearchParams(window.location.search);

    if (params.has("error")) {
      throw new Error(`${params.get("error")}: ${params.get("error_description")}`);
    }

    if (params.has("code") && params.has("state")) {
      await auth0Client.handleRedirectCallback();
      window.history.replaceState({}, document.title, getAppUrl());
    }

    state.isAuthenticated = await auth0Client.isAuthenticated();
    state.user = state.isAuthenticated ? await auth0Client.getUser() : null;
  } catch (error) {
    state.error = error instanceof Error ? error.message : "Auth0 sign-in failed.";
  }

  render();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

initializeAuth();

function getAppUrl() {
  return window.location.href.split(/[?#]/)[0];
}
