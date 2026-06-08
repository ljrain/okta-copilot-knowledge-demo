export const knowledgeArticles = [
  {
    id: "demo-purpose-and-value",
    title: "Demo purpose and business value",
    summary:
      "This demo shows how a Copilot Studio agent can answer from knowledge that is protected behind an Okta/Auth0-secured API.",
    category: "Overview",
    audience: "Executives, makers, architects, and identity administrators",
    tags: ["value", "demo", "okta", "auth0", "copilot studio", "protected knowledge"],
    content:
      "The value of this pattern is that a Copilot Studio agent can answer questions from approved knowledge without requiring Copilot Studio to crawl a login-protected website. The user-facing portal demonstrates Okta/Auth0-protected access, while the Copilot integration uses a secured HTTPS API and a Power Platform custom connector. This separates human sign-in from machine-to-machine retrieval and gives the solution owner a governed path for authentication, auditing, search, and response shaping. The demo is not intended to prove that website knowledge can crawl through Okta. It proves the more reliable enterprise pattern: expose approved protected content through an API, secure the API, connect to it with a custom connector, and let the agent summarize the returned results."
  },
  {
    id: "final-demo-architecture",
    title: "Final demo architecture",
    summary:
      "The working architecture uses a static protected portal, an Azure Function knowledge API, a Power Platform custom connector, and a Copilot Studio tool.",
    category: "Architecture",
    audience: "Solution architects and Power Platform makers",
    tags: ["architecture", "azure functions", "custom connector", "copilot studio", "github pages"],
    content:
      "The final demo has four parts. First, the demo portal is a Vite static site published to GitHub Pages at https://ljrain.github.io/okta-copilot-knowledge-demo/. The portal uses Auth0 by Okta for interactive user sign-in and shows protected knowledge articles after login. Second, the search API is hosted as an Azure Function at https://rg-okta-copilot-knowledge-demo-e2d5crebdcd2eufy.centralus-01.azurewebsites.net/api/knowledge/search. Third, a Power Platform custom connector in the GCC lab calls that API with an Authorization header. Fourth, the Copilot Studio agent exposes the connector operation as a tool named Search knowledge articles, dynamically fills the search query, and responds to the user using the returned results array. This architecture avoids relying on Copilot Studio website crawling for login-protected pages."
  },
  {
    id: "source-material-and-endpoints",
    title: "Source material and endpoints",
    summary:
      "The protected knowledge content is stored in the demo source code and exposed through a secured Azure Function API.",
    category: "Reference",
    audience: "Makers, developers, and reviewers",
    tags: ["source", "endpoint", "api", "portal", "repository", "knowledge"],
    content:
      "The human-facing demo portal is https://ljrain.github.io/okta-copilot-knowledge-demo/. The connector-facing API base URL is https://rg-okta-copilot-knowledge-demo-e2d5crebdcd2eufy.centralus-01.azurewebsites.net. The search operation is GET /api/knowledge/search?q={query}. The health check is GET /api/health and returns {\"status\":\"ok\"}. The anonymous protected search test should return 401 Unauthorized. A successful authorized search returns JSON with query, count, and results. Each result includes id, title, summary, category, audience, content, and tags. The source material for this demo is the approved article array in src/knowledge.js in the okta-copilot-knowledge-demo repository."
  },
  {
    id: "auth0-and-okta-role",
    title: "Role of Okta/Auth0 in the demo",
    summary:
      "Okta/Auth0 demonstrates the identity boundary for the portal and the production pattern for securing the knowledge API.",
    category: "Identity",
    audience: "Identity administrators and solution architects",
    tags: ["okta", "auth0", "identity", "oidc", "jwt", "authorization"],
    content:
      "Auth0 by Okta is used to protect the interactive portal and to demonstrate the intended identity pattern for the API. The static site uses the Auth0 SPA SDK and redirects users to the Auth0 login experience. The API is designed to validate bearer tokens issued for the configured audience https://okta-copilot-knowledge-api. Because the Auth0 dashboard was not accessible during final demo testing, a temporary demo connector token was added for the custom connector path. That fallback is only for fake demo data and should be replaced by real OAuth/OIDC in a production implementation. The production pattern should validate JWT issuer, audience, signing keys, expiration, and claims before returning protected content."
  },
  {
    id: "azure-function-api-setup",
    title: "Azure Function API setup",
    summary:
      "The API was deployed to Azure Functions Flex Consumption and exposes health and protected search endpoints.",
    category: "Azure",
    audience: "Developers and Azure administrators",
    tags: ["azure functions", "flex consumption", "api", "deployment", "node"],
    content:
      "The Azure resource group is rg-okta-copilot-knowledge-demo. The Function App is rg-okta-copilot-knowledge-demo in Central US on Linux Flex Consumption. The deployed API exposes /api/health and /api/knowledge/search. The app settings include AUTH0_DOMAIN, AUTH0_AUDIENCE, PORT, and CONNECTOR_DEMO_TOKEN for the temporary demo path. The function code lives under the functions folder and uses @azure/functions. The health function returns status ok. The knowledge search function checks the Authorization header, validates either the temporary demo token or a real Auth0 JWT, searches the approved article array, and returns matching results. For production, remove the demo token fallback and use only the approved identity provider token validation path."
  },
  {
    id: "deployment-lessons-learned",
    title: "Deployment lessons learned",
    summary:
      "Flex Consumption deployment required storage access fixes and a deployment-safe package build configuration.",
    category: "Operations",
    audience: "Azure administrators and developers",
    tags: ["deployment", "troubleshooting", "storage", "rbac", "zip deploy", "oryx"],
    content:
      "Several deployment issues were encountered and resolved. The original App Service plan failed because the subscription had zero quota for the selected SKU and region, so the Function App was created in Central US using Flex Consumption. GitHub Actions deployment failed with repository access blocked, so Azure Cloud Shell and ZIP deployment were used instead. The Function App could not upload packages to storage until the storage account public network access was enabled and the function's user-assigned managed identity was granted Storage Blob Data Contributor and Storage Account Contributor. Remote build initially failed because Oryx tried to run the Vite static site build and could not find index.html in the API package. The workaround was to use a deployment-safe package where the build script is a no-op for Azure Functions. The health endpoint confirmed deployment success with HTTP 200."
  },
  {
    id: "custom-connector-pattern",
    title: "Power Platform custom connector pattern",
    summary:
      "The GCC custom connector calls the secured Azure Function API and exposes SearchKnowledge to Copilot Studio.",
    category: "Integration",
    audience: "Power Platform makers and administrators",
    tags: ["custom connector", "api", "power automate", "copilot", "gcc", "authorization"],
    content:
      "The custom connector is named Okta Copilot Knowledge API. On the General tab, the scheme is HTTPS, the host is rg-okta-copilot-knowledge-demo-e2d5crebdcd2eufy.centralus-01.azurewebsites.net, and the base URL is /api. On the Security tab, the demo uses API Key authentication with parameter label Authorization, parameter name Authorization, and location Header. The connection value is Bearer followed by the configured demo token. On the Definition tab, the action is SearchKnowledge with method GET, path /knowledge/search, and query parameter q. The default response schema includes query, count, and a results array of articles. In a production version, replace the API key style demo token with OAuth and a properly governed identity provider configuration."
  },
  {
    id: "auth0-copilot-studio-pattern",
    title: "Using Auth0 with Copilot Studio",
    summary:
      "Copilot Studio should call protected Auth0 knowledge through a secured API action instead of crawling the login-protected website.",
    category: "Integration",
    audience: "Power Platform makers and identity administrators",
    tags: ["auth0", "okta", "copilot studio", "custom connector", "protected api", "knowledge"],
    content:
      "Use Auth0 to protect the knowledge portal or API, then expose a search endpoint through an HTTPS API. In Copilot Studio, add a tool that calls the API through a custom connector or Power Automate action. The tool sends the user's question as the q query parameter and receives matching approved articles. The agent should summarize the top result first and may include supporting details from other results. Website knowledge is best for public crawlable pages and usually should not be used to crawl an Auth0 login page. For a production solution, use OAuth/OIDC end to end, validate tokens in the API, keep secrets out of client code, and ensure the API, logging, and data storage meet the customer's compliance boundary."
  },
  {
    id: "copilot-studio-tool-configuration",
    title: "Copilot Studio tool configuration",
    summary:
      "The Copilot Studio tool dynamically fills the query input and responds to users from the returned results array.",
    category: "Copilot",
    audience: "Copilot Studio makers",
    tags: ["copilot studio", "tool", "agent", "instructions", "completion", "results"],
    content:
      "In Copilot Studio, the connector action is added as a tool named Search knowledge articles. The q input should be set to Dynamically fill with AI so the orchestrator can pass the user's question or search phrase into the API. The tool should be enabled and available to the OKTA Agent. Completion should be set to Respond to user, not Don't respond. The instructions should tell the agent to use the returned results array as the source of truth, summarize the top matching result first, avoid raw article IDs or JSON, and say when the knowledge source does not contain enough information. A useful instruction is: Use the returned results array to answer in plain language. Summarize the top matching result first. Do not show raw article IDs or citation keys. If useful, mention the article title as the source."
  },
  {
    id: "search-relevance-design",
    title: "Search relevance design",
    summary:
      "The search function ranks results by meaningful query terms so natural-language questions return useful articles.",
    category: "Search",
    audience: "Developers and makers",
    tags: ["search", "relevance", "ranking", "query", "natural language"],
    content:
      "The original search implementation only returned articles when the full normalized query string appeared in an article. That worked for simple terms such as password but failed for natural questions such as How can I use Auth0 with Copilot Studio? The improved search splits the query into meaningful terms, removes common stop words, scores articles based on matches in the title, tags, category, and full searchable text, then sorts by score. This makes connector results more useful for Copilot Studio because the agent can ask natural-language questions while the API returns the most relevant articles first. For larger production knowledge sets, replace this lightweight search with a dedicated search index, vector search, Dataverse search, Azure AI Search, or another approved enterprise search service."
  },
  {
    id: "gcc-and-production-boundary",
    title: "GCC and production boundary guidance",
    summary:
      "The demo uses a Commercial Azure-hosted API as a lab shortcut, but production GCC solutions should respect the required compliance boundary.",
    category: "Compliance",
    audience: "Government cloud architects and customer stakeholders",
    tags: ["gcc", "government cloud", "compliance", "commercial azure", "boundary"],
    content:
      "This lab demonstrates the integration pattern from a GCC Power Platform environment to an HTTPS API hosted in a Commercial Azure subscription. That is acceptable for fake demo data, but it should not be presented as the default production architecture for GCC customers. If real GCC, regulated, controlled, or customer-sensitive data is involved, the API hosting, data storage, logs, telemetry, identity configuration, and operational monitoring should remain inside the customer's required compliance boundary. For production, validate cloud availability, connector support, identity provider configuration, data residency, logging, audit requirements, DLP policies, and cross-cloud data movement before implementation."
  },
  {
    id: "replication-checklist",
    title: "Replication checklist",
    summary:
      "Use this checklist to reproduce the demo from protected content through Copilot Studio responses.",
    category: "Implementation",
    audience: "Makers, developers, and demo owners",
    tags: ["checklist", "replicate", "setup", "implementation", "steps"],
    content:
      "To replicate the demo, first prepare approved knowledge articles with title, summary, category, audience, tags, and content. Second, publish a protected portal if you want to show the human sign-in experience. Third, host an HTTPS API with a health endpoint and a search endpoint. Fourth, secure the API using OAuth/OIDC or a temporary demo token only for fake data. Fifth, confirm anonymous calls to the search endpoint return 401 Unauthorized and authorized calls return JSON results. Sixth, create a Power Platform custom connector with HTTPS host, /api base URL, Authorization header security, and a GET /knowledge/search action with q as the query parameter. Seventh, test the connector with q=password and verify HTTP 200. Eighth, add the connector action as a Copilot Studio tool, set q to dynamically fill with AI, and set completion to respond to the user. Ninth, test prompts about Auth0, custom connectors, password reset, MFA, and access requests. Tenth, document production caveats and replace demo authentication with the approved enterprise identity pattern."
  },
  {
    id: "operations-and-troubleshooting",
    title: "Operations and troubleshooting guide",
    summary:
      "Common issues include callback URL mismatch, missing tokens, deployment storage access, connector authorization, and weak search results.",
    category: "Operations",
    audience: "Support teams, makers, and administrators",
    tags: ["troubleshooting", "operations", "401", "callback", "deployment", "connector"],
    content:
      "If portal sign-in fails after publishing, check the Auth0 allowed callback URL, allowed logout URL, and allowed web origin. For GitHub Pages, the callback and logout URL include the repository path, such as https://ljrain.github.io/okta-copilot-knowledge-demo/. If the API search endpoint returns 401, confirm that the Authorization header is present and starts with Bearer. If the custom connector test fails, verify the host has no https prefix, the base URL is /api, the action path is /knowledge/search, and the connection value contains the full Bearer token. If Function deployment fails with storage 403, check storage public network access, managed identity role assignments, and deployment storage authentication. If the agent says it cannot find information, test the API directly with curl and inspect the results array. If direct API search returns good results but the agent does not answer, update the tool completion instructions and make sure After running is set to Respond to user."
  },
  {
    id: "client-demo-talk-track",
    title: "Client demo talk track",
    summary:
      "A presenter script for explaining the Okta-secured knowledge and Copilot Studio custom connector pattern.",
    category: "Demo",
    audience: "Presenter",
    tags: ["script", "talk track", "auth0", "okta", "copilot", "client demo"],
    content:
      "Start by explaining the problem: many enterprise knowledge sources are protected by an identity provider, and Copilot Studio website knowledge is not the right mechanism for crawling through an Okta login page. Show the protected portal as the user-facing experience and explain that the same approved content is also exposed through a secured API. Show the anonymous API search returning 401 Unauthorized to prove the endpoint is protected. Show the custom connector test returning 200 OK with article results when the Authorization header is present. Then ask the Copilot Studio agent: How can I use Auth0 with Copilot Studio? Explain that the agent calls the connector, sends the user question to the API, receives approved results, and summarizes the top result. Close by stating the production guidance: use OAuth/OIDC instead of demo tokens and keep government or regulated data inside the required compliance boundary."
  }
];

export function searchKnowledge(query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return knowledgeArticles;
  }

  const terms = normalizedQuery
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length > 2 && !SEARCH_STOP_WORDS.has(term));

  if (!terms.length) {
    return knowledgeArticles;
  }

  return knowledgeArticles
    .map((article) => {
      const titleText = article.title.toLowerCase();
      const tagText = article.tags.join(" ").toLowerCase();
      const categoryText = article.category.toLowerCase();
      const searchableText = [
        article.title,
        article.summary,
        article.category,
        article.audience,
        article.content,
        ...article.tags
      ]
        .join(" ")
        .toLowerCase();

      const score = terms.reduce((total, term) => {
        if (!searchableText.includes(term)) {
          return total;
        }

        let termScore = 1;

        if (titleText.includes(term)) {
          termScore += 3;
        }

        if (tagText.includes(term)) {
          termScore += 2;
        }

        if (categoryText.includes(term)) {
          termScore += 1;
        }

        return total + termScore;
      }, 0);

      return { article, score };
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)
    .map(({ article }) => article);
}

const SEARCH_STOP_WORDS = new Set([
  "about",
  "and",
  "are",
  "can",
  "for",
  "from",
  "how",
  "should",
  "the",
  "this",
  "use",
  "using",
  "what",
  "when",
  "with"
]);
