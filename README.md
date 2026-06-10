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
Pushes to `main` run tests, build multi-platform images, push the full commit
SHA and `latest` tags to Docker Hub, and deploy the immutable SHA image to an
Ubuntu server.

Configure these GitHub repository secrets:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN` - use a Docker Hub access token, not an account password
- `DEPLOY_HOST` - Ubuntu server hostname or IP address
- `DEPLOY_PORT` - SSH port; use `22` for the default
- `DEPLOY_USER` - unprivileged Ubuntu user with Docker access
- `DEPLOY_Password_KEY` - SSH password for the deployment user
- `DEPLOY_PATH` - optional server directory; defaults to `/root/ksn`
- `DEPLOY_KNOWN_HOSTS` - optional trusted host-key line from `ssh-keyscan`

Create a protected GitHub environment named `production` for the deploy job.
Environment approvals can be enabled if deployments should require a manual
review.

## Ubuntu server preparation

Install Docker Engine and the Docker Compose plugin, then allow the deployment
user to run Docker. Log in to Docker Hub once on the server if the image
repository is private:

```bash
docker login
```

Create the deployment directory and place `compose.prod.yaml` on the server:

```bash
mkdir -p /root/ksn
cd /root/ksn
# Create compose.prod.yaml here.
```

Ensure SSH password authentication is enabled for the deployment user. For
strong host verification, set `DEPLOY_KNOWN_HOSTS` from a trusted machine after
verifying the server fingerprint. Include the custom SSH port when applicable:

```bash
ssh-keyscan -p 22 -H your-server.example.com
```

If `DEPLOY_KNOWN_HOSTS` is not set, the workflow discovers the host key with
`ssh-keyscan` during deployment. This is convenient for a lab but does not
protect the first connection from a man-in-the-middle attack.

The workflow uses
`${DEPLOY_PATH:-/root/ksn}/compose.prod.yaml`, pulls the exact commit image,
starts the service, waits for the container health check, and removes unused
images. The deployment user must have permission to access this directory.
