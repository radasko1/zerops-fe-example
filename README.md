# Zerops frontend code style example

## Start development server
Start by installing dependencies (`npm i`).

### app (frontend)
1. copy `.env.example` -> `.env`
2. run `npm run dev:app`

### api (backend)
1. set `DB_URL` env to postgres database connection string
2. run `npm run dev:api`

## Deploy to Zerops
```yaml
project:
  name: zerops-fe-example
  envVariables:
    Z_API_URL: https://api-${zeropsSubdomainHost}-3000.prg1.zerops.app/api
    Z_CLIENT_ID: ar
    Z_PRODUCTION: true

services:
  - hostname: db
    type: postgresql@16
    mode: NON_HA

  - hostname: app
    type: static
    buildFromGit: https://github.com/fxck/zerops-fe-example
    enableSubdomainAccess: true

  - hostname: api
    type: nodejs@22
    buildFromGit: https://github.com/fxck/zerops-fe-example
    enableSubdomainAccess: true
```
