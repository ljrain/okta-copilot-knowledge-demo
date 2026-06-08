export const knowledgeArticles = [
  {
    id: "access-request-process",
    title: "Requesting access to the Knowledge Portal",
    summary:
      "Users must be assigned to the Auth0 application before they can sign in and view protected knowledge content.",
    category: "Access",
    audience: "Employees and support staff",
    tags: ["access", "auth0", "login", "assignment"],
    content:
      "To request access, open a support ticket with the user's name, email address, business justification, and manager approval. The identity administrator assigns the user to the Auth0 application. After assignment, the user can sign in at the portal URL and view the protected knowledge articles."
  },
  {
    id: "password-reset-guidance",
    title: "Password reset guidance",
    summary:
      "Users who forget their password should use the Auth0 login page password reset option.",
    category: "Support",
    audience: "Help desk",
    tags: ["password", "reset", "support", "auth0"],
    content:
      "If a user cannot remember their password, direct them to the Auth0 login page and have them select the password reset option. The user must have access to the email address associated with the account. Help desk agents should not set or ask for user passwords."
  },
  {
    id: "mfa-enrollment",
    title: "Multi-factor authentication enrollment",
    summary:
      "MFA helps protect access to the portal when sensitive knowledge content is available.",
    category: "Security",
    audience: "Employees",
    tags: ["mfa", "security", "authentication", "enrollment"],
    content:
      "When MFA is enabled, users are prompted during sign-in to enroll a second factor such as an authenticator app or one-time code. Users should complete enrollment during their first successful sign-in. If a user loses access to their factor, escalate to the identity administrator for verification and reset."
  },
  {
    id: "copilot-agent-scope",
    title: "Copilot agent scope",
    summary:
      "The Copilot agent should answer questions from approved knowledge articles and avoid unsupported commitments.",
    category: "Copilot",
    audience: "Makers and admins",
    tags: ["copilot", "scope", "answers", "governance"],
    content:
      "The Copilot agent should use approved knowledge content to answer questions about access, support, security, and demo operations. If the knowledge source does not contain an answer, the agent should say it does not have enough information and recommend contacting the appropriate support team."
  },
  {
    id: "knowledge-content-lifecycle",
    title: "Knowledge content lifecycle",
    summary:
      "Knowledge articles should be reviewed, approved, and retired through a lightweight governance process.",
    category: "Governance",
    audience: "Content owners",
    tags: ["knowledge", "review", "governance", "content"],
    content:
      "Each knowledge article should have an owner, category, audience, and review date. Content owners review articles before major demos and after policy changes. Outdated articles should be updated or removed so the Copilot agent does not provide stale guidance."
  },
  {
    id: "local-demo-limitations",
    title: "Local demo limitations",
    summary:
      "The local portal proves authentication works, but Copilot Studio cannot use localhost as a production knowledge source.",
    category: "Demo",
    audience: "Presenter",
    tags: ["localhost", "demo", "copilot studio", "publishing"],
    content:
      "The local site at http://localhost:3000 is useful for testing the sign-in experience and protected content. For Copilot Studio to use the content, publish the site or an API to a reachable HTTPS endpoint. Localhost is only available from the presenter's machine."
  },
  {
    id: "custom-connector-pattern",
    title: "Custom connector pattern",
    summary:
      "A custom connector can let a Copilot agent search protected knowledge through an API.",
    category: "Integration",
    audience: "Power Platform makers",
    tags: ["custom connector", "api", "power automate", "copilot"],
    content:
      "For a stronger identity demo, expose a search endpoint such as GET /api/knowledge/search?q=term and protect it with Auth0. Copilot Studio can call the endpoint through a custom connector or Power Automate flow. The connector should return concise JSON results with article title, summary, category, and content."
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
      "Use Auth0 to protect the knowledge portal or API, then expose a search endpoint through an HTTPS API. In Copilot Studio, create a custom connector or Power Automate action that sends the user's question to the API and returns matching approved articles. Website knowledge is best for public crawlable pages and usually should not be used to crawl an Auth0 login page."
  },
  {
    id: "incident-escalation",
    title: "Incident escalation",
    summary:
      "Access issues, suspicious sign-in activity, and incorrect knowledge responses should follow separate escalation paths.",
    category: "Operations",
    audience: "Support team",
    tags: ["incident", "escalation", "support", "security"],
    content:
      "For access failures, verify application assignment and redirect URL configuration. For suspicious sign-in activity, escalate to the security team and preserve available logs. For incorrect Copilot answers, notify the knowledge content owner and include the user question, returned answer, and article that needs correction."
  },
  {
    id: "demo-talk-track",
    title: "Demo talk track",
    summary:
      "A simple presenter script for explaining Auth0-protected knowledge and Copilot integration.",
    category: "Demo",
    audience: "Presenter",
    tags: ["script", "talk track", "auth0", "copilot"],
    content:
      "Start by showing the portal in a signed-out state. Explain that the knowledge content is protected by Auth0. Sign in, show the unlocked articles, and search for a support or security topic. Close by explaining that the same approved content can be published for a Copilot agent through a website knowledge source or secured API."
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
