# SchooLama — School Management Dashboard

A responsive school management system built with **Next.js 14, React, TypeScript, Tailwind CSS, Prisma/PostgreSQL and Clerk authentication**.

## Included modules
- Role-based dashboards: Admin, Teacher, Student and Parent
- Students, teachers, parents, subjects, classes, lessons, exams, assignments and results
- Attendance, events and announcements
- Responsive desktop + mobile navigation drawer
- Profile, Settings and Messages pages
- Admin Quick Actions
- Charts and calendar components
- Prisma database schema and seed data

## Requirements
- Node.js 18+
- PostgreSQL 14+
- Clerk account and API keys

## Local setup

1. Copy `.env.example` to `.env.local` and fill in your Clerk keys.
2. Create a PostgreSQL database named `mydb` (or change `DATABASE_URL`).
3. Install packages:

```bash
npm install
```

4. Generate Prisma Client and create the database schema:

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

5. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Docker

```bash
docker compose up --build
```

Before production deployment, configure the real `DATABASE_URL` and Clerk keys as environment variables.

## Important
This project was adapted from an existing GitHub project. Keep the original repository's license/attribution requirements when redistributing or submitting it.

## Production setup notes

### 1. Environment variables
Copy `.env.example` to `.env.local` and fill in your real values. Do not commit `.env` or `.env.local`.

Required values:
- `DATABASE_URL`: pooled PostgreSQL connection string
- `DIRECT_URL`: direct PostgreSQL connection string for Prisma migrations (if your provider supplies one)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-in`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` if image upload is enabled

### 2. Database
```bash
npm install
npx prisma migrate deploy
npx prisma generate
npm run dev
```

For a new development database:
```bash
npx prisma migrate dev
npx prisma db seed
```

### 3. Clerk roles
The application reads `publicMetadata.role`. Supported roles are:
- `admin`
- `coordinator`
- `teacher`
- `student`
- `parent`

The admin account must be created/configured in Clerk with `publicMetadata.role = "admin"`. The application-created Coordinator, Teacher, Student and Parent accounts automatically receive their respective metadata role.

### 4. Main permissions
- Admin: full school administration, including coordinator management.
- Coordinator: academic/staff/student/parent management and school communication; cannot manage coordinators.
- Teacher: assigned lessons, exams, assignments, results and attendance; student/class visibility is read-oriented.
- Student: own academic data and schedule.
- Parent: their linked children's academic data and schedule.

### 5. Validation
Before deployment, run:
```bash
npm run lint
npx tsc --noEmit
npm run build
```

The uploaded source was statically validated with TypeScript and ESLint. A production build could not be completed in the packaging environment because the environment could not download Next.js/Prisma native binaries from their registries; run `npm install`, `npx prisma generate`, and `npm run build` on a machine with registry/network access.
