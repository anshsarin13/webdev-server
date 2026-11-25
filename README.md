# Kambaz Node Server (CS5610 A5)

Express + TypeScript server for the Kambaz client (`webdev-client`).
Data is kept in memory and seeded from `Kambaz/Database/*.json`, so it resets on every restart.

## Run locally

```
npm install
cp .env.example .env
npm run dev        # nodemon on http://localhost:4000
npm start          # what Render runs
npm run typecheck
```

## Environment variables

| Name | Purpose |
| --- | --- |
| `PORT` | Port to listen on (Render sets this) |
| `CLIENT_URL` | Allowed client origin(s), comma separated (e.g. the Vercel URL) |
| `SESSION_SECRET` | Secret for the session cookie |
| `SERVER_ENV` | `development` locally (default); `production` on Render enables secure cross-site cookies |

## Routes

Lab 5: `/lab5/welcome`, `/lab5/add|subtract|multiply|divide/:a/:b`, `/lab5/calculator?operation=&a=&b=`,
`/lab5/assignment` (+ `/title`, `/title/:t`, `/score/:s`, `/completed/:c`), `/lab5/module` (+ `/name`, `/name/:n`, `/description/:d`),
`/lab5/todos` (GET, POST, `?completed=`, `/:id` GET, PUT, DELETE, plus the path based `/create`, `/:id/delete`, `/:id/title/:t`, `/:id/completed/:c`, `/:id/description/:d`).

Kambaz: `/api/users/*` (signup, signin, signout, profile, CRUD, enroll/unenroll), `/api/courses` (CRUD),
`/api/courses/:courseId/modules`, `/api/courses/:courseId/assignments`, `/api/courses/:courseId/users`,
`/api/modules/:moduleId`, `/api/assignments/:assignmentId`, `/api/enrollments`.
