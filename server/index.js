import "dotenv/config";
import cors from "cors";
import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { searchKnowledge } from "../src/knowledge.js";

const domain = process.env.AUTH0_DOMAIN || process.env.VITE_AUTH0_DOMAIN;
const audience = process.env.AUTH0_AUDIENCE || "https://okta-copilot-knowledge-api";
const port = Number(process.env.PORT || 3001);

if (!domain) {
  throw new Error("AUTH0_DOMAIN is required. Add it to .env before starting the API.");
}

const app = express();

const requireAuth = auth({
  audience,
  issuerBaseURL: `https://${domain}/`,
  tokenSigningAlg: "RS256"
});

app.use(cors());
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.get("/api/knowledge/search", requireAuth, (request, response) => {
  const query = typeof request.query.q === "string" ? request.query.q : "";
  const results = searchKnowledge(query).map((article) => ({
    id: article.id,
    title: article.title,
    summary: article.summary,
    category: article.category,
    audience: article.audience,
    content: article.content,
    tags: article.tags
  }));

  response.json({
    query,
    count: results.length,
    results
  });
});

app.use((error, _request, response, next) => {
  if (!error) {
    next();
    return;
  }

  const status = error.status || 500;
  response.status(status).json({
    error: error.code || "server_error",
    message: error.message
  });
});

app.listen(port, () => {
  console.log(`Knowledge API listening on http://localhost:${port}`);
  console.log(`Auth0 issuer: https://${domain}/`);
  console.log(`Auth0 audience: ${audience}`);
});
