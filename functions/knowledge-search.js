import { app } from "@azure/functions";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { searchKnowledge } from "../src/knowledge.js";

const domain = process.env.AUTH0_DOMAIN || process.env.VITE_AUTH0_DOMAIN;
const audience = process.env.AUTH0_AUDIENCE || "https://okta-copilot-knowledge-api";

if (!domain) {
  throw new Error("AUTH0_DOMAIN is required.");
}

const issuer = `https://${domain}/`;
const jwks = createRemoteJWKSet(new URL(`${issuer}.well-known/jwks.json`));

app.http("knowledge-search", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "knowledge/search",
  handler: async (request) => {
    const authorization = request.headers.get("authorization") || "";
    const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1];

    if (!token) {
      return unauthorized("missing_token", "Authorization bearer token is required.");
    }

    try {
      await jwtVerify(token, jwks, {
        issuer,
        audience
      });
    } catch (error) {
      return unauthorized("invalid_token", error instanceof Error ? error.message : "Token validation failed.");
    }

    const query = request.query.get("q") || "";
    const results = searchKnowledge(query).map((article) => ({
      id: article.id,
      title: article.title,
      summary: article.summary,
      category: article.category,
      audience: article.audience,
      content: article.content,
      tags: article.tags
    }));

    return {
      jsonBody: {
        query,
        count: results.length,
        results
      }
    };
  }
});

function unauthorized(error, message) {
  return {
    status: 401,
    jsonBody: {
      error,
      message
    }
  };
}
