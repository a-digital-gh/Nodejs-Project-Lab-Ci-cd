const express = require("express");
const helmet = require("helmet");
const pinoHttp = require("pino-http");

function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(express.json({ limit: "100kb" }));
  app.use(
    pinoHttp({
      enabled: process.env.NODE_ENV !== "test",
      redact: ["req.headers.authorization", "req.headers.cookie"],
    }),
  );

  app.get("/", (_request, response) => {
    response.json({
      name: "nodejs-project-lab-ci-cd",
      status: "ok ketsana",
    });
  });

  app.get("/health", (_request, response) => {
    response.json({ status: "healthy" });
  });

  app.get("/ready", (_request, response) => {
    response.json({ status: "ready" });
  });

  app.get("/api/v1/hello/:name", (request, response) => {
    const name = request.params.name.trim();

    if (!name || name.length > 50) {
      return response.status(400).json({
        error: "Name must contain between 1 and 50 characters.",
      });
    }

    return response.json({ message: `Hello, ${name}!` });
  });

  app.use((_request, response) => {
    response.status(404).json({ error: "Not found" });
  });

  app.use((error, request, response, _next) => {
    request.log?.error({ error }, "Unhandled request error");
    response.status(500).json({ error: "Internal server error" });
  });

  return app;
}

module.exports = { createApp };
