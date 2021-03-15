## Presequities
- PostgreSQL v13.2 server
## Getting up and running:
- run `npm install & npx prisma init`
- rename `.env.example` to `.env` and modify it with correct connection url
- run `npx prisma migrate dev --name init --preview-feature`
- run the server with `npm run dev` and navigate to (Localhost)[127.0.0.1:4000/graphql]
- run the following query ```graphql
users {
    name,
    projects {
      name
    }
  }
```