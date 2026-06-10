const { createApp } = require("./app");

const port = Number.parseInt(process.env.PORT || "3000", 10);
const host = process.env.HOST || "0.0.0.0";
const app = createApp();

const server = app.listen(port, host, () => {
  console.log(`API listening on http://${host}:${port}`);
});

function shutdown(signal) {
  console.log(`${signal} received, shutting down`);

  server.close((error) => {
    if (error) {
      console.error("Graceful shutdown failed", error);
      process.exit(1);
    }

    process.exit(0);
  });

  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
