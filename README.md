# Dhakshatha J: Portfolio (full stack)

| Layer     | Technology                         |
|-----------|------------------------------------|
| Frontend  | HTML, CSS, JavaScript (`public/`)  |
| Backend   | Node.js + Express (`server.js`, `routes/`) |
| Database  | MongoDB Atlas via Mongoose (`models/`) |
| Hosting   | Render (free web service)          |

**How the pieces connect**
- The page loads and calls `GET /api/projects`. Express reads the projects from MongoDB and the page draws them.
- The contact form calls `POST /api/contact`. Express validates the message and saves it in MongoDB.
- Adding, editing or deleting a project goes through the API and needs your `ADMIN_KEY`.

## API

| Method | Route | Access | Purpose |
|--------|-------|--------|---------|
| GET | `/api/health` | public | server and database status |
| GET | `/api/projects` | public | list all projects |
| GET | `/api/projects/:slug` | public | one project |
| POST | `/api/projects` | admin | add a project |
| PUT | `/api/projects/:slug` | admin | update a project |
| DELETE | `/api/projects/:slug` | admin | delete a project |
| POST | `/api/contact` | public | save a contact message |

Admin requests need the header `x-admin-key: <your ADMIN_KEY>`.

## Run it on your computer

1. Install Node.js 18 or newer.
2. Create a free MongoDB Atlas cluster (cloud.mongodb.com). Under Database Access add a user. Under Network Access allow your IP (use `0.0.0.0/0` for now so Render can connect too). Under Connect > Drivers, copy the connection string.
3. In this folder:
   ```
   npm install
   copy .env.example .env      (macOS/Linux: cp .env.example .env)
   ```
   Open `.env`, paste your connection string into `MONGODB_URI`, and set `ADMIN_KEY` to a long random string.
4. Load your projects into the database, then start the server:
   ```
   npm run seed
   npm start
   ```
5. Open http://localhost:3000

## Deploy on Vercel

Vercel runs the backend as a serverless function (`api/index.js`) instead of a normal always-on server, and serves everything in `public/` as static files. `vercel.json` wires this up already.

1. Push this folder to a GitHub repository (`.env` is ignored by `.gitignore`, so your secrets stay off GitHub).
2. Go to vercel.com, sign in with GitHub, click **Add New → Project**, and import the repo.
3. Leave the build settings as detected (Framework Preset: Other). You don't need a build command.
4. Under **Environment Variables**, add `MONGODB_URI` and `ADMIN_KEY` with the same values you used locally.
5. Click **Deploy**. You'll get a link like `https://your-project.vercel.app`.
6. In MongoDB Atlas, under Network Access, make sure `0.0.0.0/0` (allow from anywhere) is added, or Vercel won't be able to reach your database.

Each serverless request reconnects to MongoDB only if needed (see `ensureDbConnection` in `server.js`), so cold starts add a small delay on the first request after idle time, then stay fast.

## Deploy on Render (alternative)

Render runs a normal always-on server, using `npm start` directly (not the `api/` folder).

1. Push this folder to a GitHub repository.
2. On render.com choose **New → Web Service**, and connect the repo.
3. Build command: `npm install`. Start command: `npm start`.
4. Add environment variables `MONGODB_URI` and `ADMIN_KEY`.
5. Deploy. The free plan sleeps when idle, so the first visit can take about 30 seconds.

Heroku no longer has a free plan.

## Edit your content

- **Projects:** change `scripts/seed.js` and run `npm run seed` again, or use the API. Example with curl:
  ```
  curl -X PUT https://YOUR-SITE/api/projects/fire-navigation-robot \
    -H "Content-Type: application/json" -H "x-admin-key: YOUR_KEY" \
    -d '{"links":[{"label":"GitHub","url":"https://github.com/Dhakshatha2007/..."}]}'
  ```
- **Everything else** (about, skills, education, activities): edit `public/index.html`.
- **Resume button:** set `RESUME_URL` near the bottom of `public/index.html`.
- **Read contact messages:** in Atlas, open Browse Collections > `messages`.
