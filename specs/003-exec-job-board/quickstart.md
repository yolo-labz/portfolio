# Quickstart: Executive Job Board Aggregator

**Branch**: `003-exec-job-board`

## Python Collector

```bash
cd projects/exec-job-board

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r collector/requirements.txt

# Set API keys (get free keys from each service)
export JSEARCH_API_KEY="your-rapidapi-key"
export ADZUNA_APP_ID="your-app-id"
export ADZUNA_API_KEY="your-api-key"
export THEMUSE_API_KEY="your-api-key"
export USAJOBS_API_KEY="your-api-key"
export USAJOBS_EMAIL="your@email.com"

# Run collector
python -m collector.main

# Verify output
cat data/jobs.json | python -m json.tool | head -20
```

## Next.js Site

```bash
cd projects/exec-job-board/site

# Install dependencies
pnpm install

# Dev server (reads data/jobs.json from parent)
pnpm dev
# Open http://localhost:3001

# Build
pnpm build
```

## Verification Checklist

- [ ] `python -m collector.main` produces `data/jobs.json` with 50+ entries
- [ ] `data/jobs.json` has entries from at least 2 sources
- [ ] No duplicate `id` values in the output
- [ ] `pnpm dev` renders the job board with cards
- [ ] Search filters jobs in real-time
- [ ] Location and seniority filters narrow results
- [ ] RSS feed at `/feed.xml` returns valid XML
- [ ] Site is responsive on 375px viewport
- [ ] `pnpm build` succeeds
- [ ] README has architecture diagram and setup instructions

## Environment Variables

| Variable | Service | How to get |
|----------|---------|-----------|
| `JSEARCH_API_KEY` | RapidAPI | Sign up at rapidapi.com, subscribe to JSearch |
| `ADZUNA_APP_ID` | Adzuna | developer.adzuna.com |
| `ADZUNA_API_KEY` | Adzuna | Same |
| `THEMUSE_API_KEY` | The Muse | themuse.com/developers |
| `USAJOBS_API_KEY` | USAJobs | developer.usajobs.gov |
| `USAJOBS_EMAIL` | USAJobs | Your email (required for auth header) |
