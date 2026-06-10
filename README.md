# Node.js Project Lab CI/CD

A small Express API packaged as a non-root Docker container and validated by
GitHub Actions.

## Requirements

- Node.js 22+
- Docker with Docker Compose

## Local development

```bash
npm ci
npm test
npm run dev
```

The API listens on `http://localhost:3000`.

## Endpoints

- `GET /` - API metadata
- `GET /health` - container health check
- `GET /ready` - readiness check
- `GET /api/v1/hello/:name` - sample versioned endpoint

## Docker

```bash
docker compose up --build
```

Override the host port with `PORT=8080 docker compose up --build`.

## CI/CD

Pull requests run tests and build the Docker image without publishing it.
Pushes to `main` run tests, build multi-platform images, and push SHA and
`latest` tags to Docker Hub.

Configure these GitHub repository secrets:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN` - use a Docker Hub access token, not an account password
