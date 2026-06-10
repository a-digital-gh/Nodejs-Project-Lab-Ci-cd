process.env.NODE_ENV = "test";

const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { createApp } = require("../src/app");

const app = createApp();

test("GET / returns API metadata", async () => {
  const response = await request(app).get("/").expect(200);

  assert.deepEqual(response.body, {
    name: "nodejs-project-lab-ci-cd",
    status: "ok",
  });
});

test("GET /health reports healthy", async () => {
  const response = await request(app).get("/health").expect(200);

  assert.equal(response.body.status, "healthy");
});

test("GET /api/v1/hello/:name returns a greeting", async () => {
  const response = await request(app).get("/api/v1/hello/Ada").expect(200);

  assert.equal(response.body.message, "Hello, Ada!");
});

test("unknown routes return JSON 404", async () => {
  const response = await request(app).get("/missing").expect(404);

  assert.equal(response.body.error, "Not found");
});
