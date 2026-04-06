# Eximso Seller Portal.

A Next.js 14 application that powers the seller-facing experience for the Eximso platform. The project uses React 18, TypeScript, TanStack Query, PrimeReact, and a mixture of server-side and edge API routes for authentication, file uploads, email, and AI-assisted workflows.【F:package.json†L35-L39】

## Prerequisites

- **Node.js 20** – matches the runtime used in the CI pipelines and is compatible with Next.js 14 features. 【F:.github/workflows/Create_Release_PR.yml†L23-L32】
- **npm 9+** – the repository uses `npm ci` in CI/CD for reproducible installs. 【F:.github/workflows/Create_Release_PR.yml†L28-L34】
- Optional tooling: `gh` CLI for local release automation testing, AWS CLI for S3/SQS debugging, MongoDB shell for database inspection.

## Environment configuration

Create a `.env.local` file in the project root with the following variables. Values below are examples – replace them with the credentials for your environments.

| Variable | Required | Example | Purpose / Where used |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | ✅ | `https://api.dev.eximso.com` | Base URL for backend APIs. Also used to proxy `/backend/*` calls in Next.js rewrites. 【F:next.config.js†L3-L9】【F:lib/utils/api.interceptor.ts†L1-L7】 |
| `NEXT_PUBLIC_BUYER_DOMAIN` | ✅ | `https://buyer.dev.eximso.com` | Used in auth flows and middleware to redirect sellers to the buyer app when necessary. 【F:middleware.ts†L10-L22】【F:app/(full-page)/auth/login/page.tsx†L48-L58】 |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | ✅ (if Google login enabled) | `123.apps.googleusercontent.com` | OAuth client used for Google social login. 【F:app/(full-page)/layout.tsx†L15-L22】 |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY` | ✅ (for push) | `ABCDEF...` | Firebase Cloud Messaging public VAPID key required to mint browser push tokens. 【F:layout/layout.tsx†L150-L207】 |
| `JWT_SECRET` | ✅ | `super-secret` | Signing secret for JWT tokens used in server actions and API routes. 【F:lib/utils/getDataFromToken.ts†L4-L27】【F:app/api/auth/login/route.ts†L8-L56】 |
| `MONGODB_URI` | ✅ | `mongodb+srv://…` | Connection string for MongoDB via Mongoose. 【F:lib/utils/db.ts†L4-L46】 |
| `RESEND_API_KEY` | ✅ (if using Resend emails) | `re_...` | API key for sending password reset emails through Resend. 【F:app/api/auth/forgot-password/route.ts†L1-L122】 |
| `GMAIL_USER`, `GMAIL_PASS` | Optional | `alerts@eximso.com`, `app-specific-password` | Credentials for nodemailer fallback flows. 【F:lib/actions/password.ts†L30-L51】【F:app/api/auth/forgot-password/route.ts†L83-L114】 |
| `REGION` | ✅ (for AWS) | `ap-south-1` | AWS region for S3 and SQS clients. 【F:app/api/s3-upload/route.ts†L1-L24】【F:app/api/chat/route.ts†L5-L69】 |
| `AWS_BUCKET_NAME` | ✅ (for uploads) | `eximso-seller-assets` | Target S3 bucket for direct uploads. 【F:app/api/s3-upload/route.ts†L1-L24】 |
| `ONBOARDING_QUEUE_URL` | Optional | `https://sqs...` | Seller onboarding notifications queue. 【F:lib/email/send-mail.ts†L1-L18】 |
| `AI_USAGE_QUEUE_URL` | Optional | `https://sqs...` | Queue for AI usage telemetry. 【F:app/api/chat/route.ts†L5-L69】 |
| `VERCEL_URL` / `VERCEL_PROJECT_PRODUCTION_URL` | Optional | `seller.eximso.com` | Used in email templates to construct absolute URLs. 【F:lib/email/welcome-mail.tsx†L15-L35】【F:app/api/auth/forgot-password/route.ts†L69-L88】 |

> ℹ️ During development you can point `NEXT_PUBLIC_API_URL` to a local backend (e.g., `http://localhost:5000/api`) or a staging cluster. When using a local backend, ensure CORS allows the seller app origin.

After editing `.env.local`, restart the dev server so Next.js picks up the new values.

## Local development

1. **Install dependencies**
   ```bash
   npm install
   ```
   Use `npm ci` if you want installs that match the lockfile exactly (mirroring CI). 【F:.github/workflows/Create_Release_PR.yml†L27-L34】
2. **Run the development server**
   ```bash
   npm run dev
   ```
   The dev server listens on [http://localhost:3001](http://localhost:3001) by default. 【F:package.json†L7-L14】
3. **Lint and type-check**
   ```bash
   npm run lint
   ```
   Linting mirrors what runs in CI. You can also run `npm run build` to validate the production bundle locally.
4. **Production preview**
   ```bash
   npm run build
   npm run start
   ```
   `npm run start` serves the optimized build on port 3000 unless overridden by `PORT`.

### API proxying

Requests from the browser to `/backend/*` are transparently proxied to `NEXT_PUBLIC_API_URL`. This allows local development without updating dozens of fetch URLs. Configure your backend CORS to permit the origin served by `npm run dev`. 【F:next.config.js†L3-L9】【F:lib/utils/api.interceptor.ts†L1-L7】

### Emails and notifications

- Email templates live in `lib/email`. They rely on `VERCEL_URL` or `VERCEL_PROJECT_PRODUCTION_URL` to build absolute links so make sure those are set in hosted environments. 【F:lib/email/welcome-mail.tsx†L15-L24】【F:lib/email/reset-password.tsx†L16-L64】
- Push notifications use Firebase Cloud Messaging with the VAPID key and register a service worker at runtime. Ensure your Firebase project is configured for web push in non-production environments. 【F:layout/layout.tsx†L150-L207】

## Continuous integration & delivery

### Release PR creation (`Create_Release_PR.yml`)

- **Trigger:** runs automatically every Saturday at 06:30 UTC (12:00 PM IST) and can be run manually with an optional semantic version. 【F:.github/workflows/Create_Release_PR.yml†L1-L40】
- **Lint gate:** checks out the `develop` branch, installs dependencies with `npm ci`, and runs `npm run lint`. 【F:.github/workflows/Create_Release_PR.yml†L14-L55】
- **Versioning:** determines the next version (patch bump on schedule, or `major`/`minor`/`patch`/explicit number for manual runs), updates `package.json`/`package-lock.json`, and commits the bump on a `release/vX.Y.Z` branch. 【F:.github/workflows/Create_Release_PR.yml†L56-L166】
- **PR automation:** generates release notes from commits since the last tag, creates or updates a release PR targeting `main`, and labels it appropriately. 【F:.github/workflows/Create_Release_PR.yml†L167-L219】
- **No-change guard:** exits early if `develop` is not ahead of `main`. 【F:.github/workflows/Create_Release_PR.yml†L95-L112】

### Release promotion (`Promote_Release.yml`)

- **Trigger:** manually via the Actions tab (with optional PR number and tag inputs) or automatically when a PR into `main` receives the `release` label. 【F:.github/workflows/Promote_Release.yml†L1-L24】
- **Safety checks:** resolves the release PR, verifies it targets `main`, ensures it is mergeable and conflict-free, and compares versions between `main` and the release branch. 【F:.github/workflows/Promote_Release.yml†L25-L118】
- **Merge & tag:** performs a squash merge using the GitHub CLI, optionally creates a tag (defaulting to `v<package.json version>`), and pushes back to `main`. 【F:.github/workflows/Promote_Release.yml†L161-L221】
- **Back-merge:** after tagging, merges `main` back into `develop` to keep branches aligned and pushes the result. 【F:.github/workflows/Promote_Release.yml†L177-L223】
- **Release notes:** generates a GitHub Release with the changes pulled from the merged PR and attaches the created tag. 【F:.github/workflows/Promote_Release.yml†L224-L280】

> 🔁 The two workflows work together: the scheduled job prepares a release branch and PR from `develop`, while the promotion workflow merges it into `main`, tags the release, and syncs the changes back to `develop`.

## Troubleshooting

- **Missing environment variables:** Next.js will throw at build/runtime when required variables are missing. Double-check `.env.local` and the hosting provider's secret store.
- **Service worker / push issues:** Ensure `NEXT_PUBLIC_FIREBASE_VAPID_KEY` is valid and that HTTPS is used (required for push notifications). For local development, configure Firebase to accept `http://localhost:3001` origins.
- **AWS access errors:** Confirm `REGION`, `AWS_BUCKET_NAME`, and AWS credentials are available (via environment or your AWS profile) when invoking S3/SQS routes.
- **MongoDB connection failures:** Verify `MONGODB_URI` allows connections from your environment and that IP whitelists include your machine or server.

## Useful scripts

- `npm run format` – format supported source directories with Prettier. 【F:package.json†L7-L12】
- `npm run lint` – run Next.js lint checks (executed in CI).
- `npm run build` – produce an optimized production build.
- `npm run start` – start the production server (after `npm run build`).

