This directory holds Docker secret files for production compose.

Create the following files with secure values (do not commit them):

- postgres_password.txt  # POSTGRES password for the Postgres container
- redis_password.txt     # Redis password used by the redis server

Compose will mount them at /run/secrets inside the respective containers.

Security notes:
- This folder is ignored by .gitignore to prevent accidental commits.
- Rotate these passwords periodically and update the files before deploys.
