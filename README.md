# Backend & Database Configuration Guide

This document explains where to put backend code and how to configure database credentials and environment variables for local development and production deployments.

**Summary:**
- Put backend server code in `server/` (or create it if missing).
- Keep secrets out of git: use `.env` files locally and host/provider secret stores in production.
- Example `.env` templates for Postgres and Mongo are included below — add them to `server/.env` and do NOT commit.

---

## Project layout (recommended)

- `server/` — Put your backend app here (Express, Fastify, Nest, or similar). Keep server-specific `package.json`, config, and scripts inside.
- `public/` and `src/` — Frontend assets and React app (already present in this repo).
- `server/.env` — Local environment variables for the backend (gitignored).
- `.env.example` or `server/.env.example` — Template with example keys (safe to commit).

If you already have a `server/` folder (there is evidence of `server/package-lock.json`), use that as the backend root.

## Where to put configs

- Local development: create `server/.env` and add your DB connection details there.
- Frontend-only config (public, non-secret): use `VITE_` prefixed variables in the root `.env` (or `.env.local`) for Vite/React.
- Production: set connection strings and secrets using your hosting provider's secret manager (Vercel/Netlify/Render/GitHub Actions/Railway/etc.).

## Security best practices

- Never commit `.env` or files containing secrets. Add them to `.gitignore`.
- Commit `server/.env.example` with placeholder values.
- Use provider secrets (Vercel Environment Variables, Render/Heroku config vars, Railway secrets, GitHub Actions secrets) for production.

## Example environment variables

General variables used by many libraries:

- `NODE_ENV=development`
- `PORT=8080`

Postgres example (set `DATABASE_URL` or separate keys):

```
# server/.env
DATABASE_URL=postgres://dbuser:dbpass@localhost:5432/sauyo_db
PGHOST=localhost
PGUSER=dbuser
PGPASSWORD=dbpass
PGDATABASE=sauyo_db
PGPORT=5432
```

MongoDB example:

```
# server/.env
MONGODB_URI=mongodb://user:pass@localhost:27017/sauyo_db?authSource=admin
```

## Oracle Express (XE) — Local dev & backend setup

If you plan to use Oracle Database Express Edition (XE) for your backend, here are recommended steps for local development and how to configure your server to connect.

### Run Oracle XE with Docker (quick start)

This uses the community image that runs Oracle XE in a container. It exposes the default listener on port `1521` and the Enterprise Manager on `5500`.

```bash
docker run -d --name oracle-xe -p 1521:1521 -p 5500:5500 \
	-e ORACLE_PASSWORD=oracle \
	gvenzl/oracle-xe:18.4.0
```

The default pluggable database service name is `XEPDB1`. A typical connect string is `localhost:1521/XEPDB1`.

### Docker Compose (example)

Create `server/docker-compose.yml` to ease local development:

```yaml
version: '3.8'
services:
	oracle-xe:
		image: gvenzl/oracle-xe:18.4.0
		container_name: oracle-xe
		environment:
			- ORACLE_PASSWORD=oracle
		ports:
			- 1521:1521
			- 5500:5500
		healthcheck:
			test: ["CMD", "bash", "-c", "echo 'SELECT 1 FROM DUAL;' | /usr/local/bin/sqlplus -s SYSTEM/oracle@//localhost:1521/XEPDB1"]
			interval: 30s
			timeout: 10s
			retries: 10
```

Start it with:

```bash
cd server
docker-compose up -d
```

### Environment variables (add to `server/.env`)

Option 1 — separate parts:

```
ORACLE_HOST=localhost
ORACLE_PORT=1521
ORACLE_SERVICE=XEPDB1
ORACLE_USER=sauyo
ORACLE_PASSWORD=yourpassword
```

Option 2 — single connection string:

```
ORACLE_CONNECT=sauyo/yourpassword@localhost:1521/XEPDB1
```

### Node.js usage with `oracledb`

Install the driver:

```bash
npm install oracledb
```

If running against the Docker image above, you don't need to install Instant Client separately. Example connection code:

```js
import oracledb from 'oracledb';
import dotenv from 'dotenv';
dotenv.config();

const connectString = `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_SERVICE}`;

await oracledb.createPool({
	user: process.env.ORACLE_USER,
	password: process.env.ORACLE_PASSWORD,
	connectString,
	poolMin: 1,
	poolMax: 10
});

const conn = await oracledb.getConnection();
const result = await conn.execute('SELECT 1 FROM DUAL');
await conn.close();
```

### TypeORM / ORM notes

TypeORM supports Oracle; a sample data source config:

```ts
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
	type: 'oracle',
	username: process.env.ORACLE_USER,
	password: process.env.ORACLE_PASSWORD,
	connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_SERVICE}`,
	synchronize: false,
	logging: false,
	// entities, migrations, etc.
});
```

For migrations, consider using Flyway or Liquibase with Oracle — they are robust and Oracle-friendly. TypeORM migrations also work but may require extra Oracle-specific configuration.

### Production notes

- Use a managed Oracle service or a properly provisioned instance for production.
- Configure connection pooling and monitor session usage.
- Store credentials in your host's secret manager (don’t commit them).
- Verify Oracle XE licensing is suitable for your deployment.

### Troubleshooting

- If you see native client errors when installing `oracledb`, confirm your environment or use the Docker image to avoid Instant Client needs.


SQLite (file-based) example:

```
# server/.env
DATABASE_URL=file:./dev.db
```

Supabase example (if using Supabase hosted DB):

```
# server/.env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=public-or-service-role-key
DATABASE_URL=postgres://... (if using the DB directly)
```

## .env.example (suggested)

Create `server/.env.example` with placeholders. Example:

```
# server/.env.example
NODE_ENV=development
PORT=8080
# For Postgres
DATABASE_URL=postgres://dbuser:dbpass@localhost:5432/sauyo_db

# For Mongo (choose one DB provider per environment)
# MONGODB_URI=mongodb://user:pass@localhost:27017/sauyo_db

# JWT / App secrets
JWT_SECRET=your_jwt_secret_here
```

## Connecting in code

Use environment variables in your server code. Examples:

Node (generic):

```js
// server/src/index.js
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 8080;
const dbUrl = process.env.DATABASE_URL || process.env.MONGODB_URI;
```

If you're using an ORM/migration tool (Prisma, TypeORM, Sequelize, Mongoose), point its connection setting at `process.env.DATABASE_URL` or the provider-specific key.

## Migrations and schema management

- If using Postgres + Prisma: add `schema.prisma` under `server/prisma/` and set `url = env("DATABASE_URL")`.
- Run migrations locally using the migration tool (Prisma: `npx prisma migrate dev`).

## Local DB setup tips

- Postgres: use Docker for an isolated dev DB:

```bash
docker run --name sauyo-postgres -e POSTGRES_USER=dbuser -e POSTGRES_PASSWORD=dbpass -e POSTGRES_DB=sauyo_db -p 5432:5432 -d postgres:15
```

- MongoDB: run `mongod` locally or use a Docker image.

## Production deployment notes

- Use the provider's secret/env UI to add `DATABASE_URL`, `JWT_SECRET`, and other secrets.
- Do not store secrets in the repo. Use database backups and monitoring.

## CI / GitHub Actions

- Add secrets to GitHub repository settings (Settings → Secrets) and reference them in workflows as `secrets.DATABASE_URL`.

## Common pitfalls

- Mixing frontend and backend env files: frontend variables must be prefixed for Vite (e.g., `VITE_API_URL`) and are exposed to client code.
- Credentials in commit history: if you accidentally commit secrets, rotate them and remove them from history (use `git filter-repo` or `bfg`).

## Recommended next steps I can do for you

- Create `server/.env.example` (I can add it).
- Add a short `server/README.md` with startup commands and migration steps.
- Add Docker Compose for a Postgres dev DB.

If you'd like, I can add `server/.env.example` and a `server/README.md` with commands specific to your backend stack — tell me which database (Postgres, MongoDB, Supabase, SQLite) and which server framework/ORM you're using (Express, Nest, Prisma, TypeORM, Mongoose, etc.).

***
File created by assistant: `README.md` — edit as needed.
