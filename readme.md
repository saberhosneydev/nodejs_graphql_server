## Presequities
- PostgreSQL v13.2 server
## Getting up and running:
- run `npm install`
- rename `.env.example` to `.env` and modify it with correct connection url
- run `npx prisma migrate dev --name init --preview-feature`
- run the server with `npm run dev` and navigate to [Localhost](http://127.0.0.1:4000/graphql)
- example queries to run
```graphql
users {
    name,
    projects {
      name
    }
  }
```

```graphql
query {
  # createUser(name: "John Doe", email:"johndoe@example.com", password: "12345678"){
  #   result
  # }
  # user(id: 1) {
  #   name,
  #   projects{
  #     name
  #   }
  # }
  # authenticateUser(email:"johndoe@example.com", password: "12345678"){
  #   result
  # }
}
```