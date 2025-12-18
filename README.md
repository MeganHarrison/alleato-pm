# Alleato AI Project Manager

## Resources

- https://developers.procore.com/documentation/introduction
- https://v2.support.procore.com
- https://procore.com
- https://cookbook.openai.com/articles/codex_PLANS_DOCs
- /Users/meganharrison/Documents/github/alleato-procore/.agents/PLANS.md

## Folder Structure

See [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) for the full breakdown and placement rules.

### Frontend

- `frontend/` – Next.js 15 app code
  - `src/app` for routes
  - `src/components` for shared UI
  - `src/lib` for utilities/hooks
  - `src/types` for shared types. Supabase schema lives at `frontend/src/types/database.ts` and should be imported via `@/types/database.types`.
  - `tests/` – **only** location for Playwright, Jest, and screenshots (keep screenshots in `frontend/tests/screenshots/`).
  - `public/`, `supabase/`, and `scripts/` for static assets and app-specific tooling.

### Backend

- `backend/` – Python APIs, workers, and tests (`backend/src/api|services|workers`, `backend/tests/{unit,integration}`, `backend/scripts`).
- `scripts/` – root-level automation and tooling shared across the monorepo.
- `supabase/` and `migrations/` – database migrations and metadata.

### Docs

- `docs/` – architectural/process documentation referenced by CLAUDE.md and the Plans Doc.

## How to use

### Setting your OpenAI API key

Set your OpenAI API key in your environment variables:

```bash
export OPENAI_API_KEY=your_api_key
```

You can also follow [these instructions](https://platform.openai.com/docs/libraries#create-and-export-an-api-key) to set your OpenAI key at a global level.

Alternatively, you can set the `OPENAI_API_KEY` environment variable in an `.env` file at the root of the `python-backend` folder. You will need to install the `python-dotenv` package to load the environment variables from the `.env` file. And then, add these lines of code to your app:

```bash
from dotenv import load_dotenv

load_dotenv()
```

### Install dependencies

Install the dependencies for the backend by running the following commands:

```bash
cd python-backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

```
cd python-backend
source .venv/bin/activate
python -m uvicorn api:app --reload --port 8000
```

#### Run the backend independently

From the `python-backend` folder, run:

```bash
python -m uvicorn api:app --reload --port 8000
```

### Run the app

You can either run the backend independently if you want to use a separate UI, or run both the UI and backend at the same time.

The backend will be available at: [http://localhost:8000](http://localhost:8000)

For the UI, you can run:

```bash
cd ui
npm install
```

#### Run the UI & backend simultaneously

From the `ui` folder, run:

```bash
cd ui
npm run dev
```

The frontend will be available at: [http://localhost:3000](http://localhost:3000)

This command will also start the backend.

### Actions

```
.save-docs.sh
```