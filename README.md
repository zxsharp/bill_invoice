Docker image build & run

Build the production image (from workspace root):

```bash
docker build -t invoicelist-backend ./backend
```

Run with environment from `backend/.env`:

```bash
docker run --env-file backend/.env -p 5000:5000 --name invoicelist-backend invoicelist-backend
```

Or use docker-compose from workspace root:

```bash
docker-compose up --build -d
```

Notes:
- The app expects `MONGODB_URI` (Atlas) in the env file.
- For CI/CD you can push the built image to a registry and deploy to your host/cloud provider.

Render deployment (recommended using Docker):

1. Connect your GitHub repo to Render and create a new Web Service.
2. Choose **Docker** as the environment and set `Dockerfile Path` to `backend/Dockerfile`.
3. Add environment variables in Render dashboard: `MONGODB_URI`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `ENCRYPTION_KEY`, `PORT` (5000), etc.
4. Optional: set `Health Check Path` to `/health` so Render can verify the service is healthy.

If you prefer using Render's Node environment (no Docker):
- Set `Build Command` to `npm ci && npm run build` (ensure dev deps are installed for build).
- Set `Start Command` to `npm start`.

Using `render.yaml` (provided in repo) will let Render auto-detect and create the service configuration when you deploy.
