## Migration version control

Migrations are created automatically but are not automatically version controlled. This is done to ensure that intermediate migration steps are not versioned causing the database to traverse to incorrect intermediate states unnecessarily. Once multiple PRs have landed and an official migration is required a PR dedicated to the task can be opened.

Ensure that no un-named trailing orphaned migrations are lingering on the host. Generate the migration using `yarn prisma migrate dev.

Once the migration/s exist they can be version controlled by force adding them via the force flag `-f, --force`, `git add --force my/ignored/file.foo`

Commit, push and create a PR as per usual.
