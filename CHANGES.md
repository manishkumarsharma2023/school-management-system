# Changes in this customized version

## UI / responsive improvements
- Added a mobile navigation drawer for phones/tablets while preserving the desktop sidebar.
- Made the dashboard content use a safer responsive overflow layout.
- Made the navbar sticky and improved mobile spacing.
- Added a small Admin Quick Actions section.

## Functional improvements
- Added a working root route that redirects signed-in users to their role dashboard and unsigned users to sign-in.
- Added Profile, Settings, Messages and Logout pages so menu links no longer lead to missing routes.
- Added an Attendance page with recent records and attendance-rate summary.
- Fixed the Results table bug that displayed the student's first name twice.
- Fixed the student dashboard so an unassigned student does not crash when no class exists.
- Removed invalid Prisma `password` fields from Teacher/Student database updates; passwords remain managed by Clerk.
- Added route protection for Profile, Settings and Messages.

## Setup / deployment improvements
- Added `.env.example` for PostgreSQL and Clerk configuration.
- Updated README with local setup and Docker instructions.
- Fixed Docker Compose PostgreSQL service naming and DATABASE_URL format.
- Changed Dockerfile to generate Prisma Client during image build and run `prisma migrate deploy` when the container starts instead of trying to migrate during image build.

## Attribution
The base application is an existing GitHub project. Preserve its original license and attribution when using or submitting this customized version.
