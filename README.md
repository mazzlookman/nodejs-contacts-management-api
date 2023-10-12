# NodeJS Contacts Management API

---
### Description

---
This project is a RESTful API of contacts management website. 
Here it is applied in a project named "NodeJS Contacts Management API", which is made using NodeJS and ExpressJS Framework. 
This project implements `Clean Code`, `Integration Testing`, and `API Documentation`.

### Libraries and Tools Used

---
1. Prisma ORM: [www.npmjs.com/package/prisma](https://www.npmjs.com/package/prisma)
2. Integration Testing: [www.npmjs.com/package/jest](https://www.npmjs.com/package/jest)
3. HTTP Testing: [www.npmjs.com/package/supertest](https://www.npmjs.com/package/supertest)
4. UUID Generator: [www.npmjs.com/package/uuid](https://www.npmjs.com/package/uuid)
5. Logging: [www.npmjs.com/package/winston](https://www.npmjs.com/package/winston)
6. Password Hashing (Bcrypt): [www.npmjs.com/package/bcrypt](https://www.npmjs.com/package/bcrypt)
7. Request Payload Validation: [www.npmjs.com/package/joi](https://www.npmjs.com/package/joi) 
> The full details can be seen on `./package-lock.json`

### Database Design

---
![DB_DESIGN](https://ik.imagekit.io/mazzlookman/nodejs_contact_management_api_diagram.png?updatedAt=1697029871229)

Table relationship:
* `users` table has `one to many` relationship with `contacts` table.
* `contacts` table has `one to many` relationship with `addresses` table.


### How To Run This Project ?

---
> Make sure your computer has `Git` and `Docker` are installed.

Please follow the steps below:

```
# Open the terminal, then clone this repository
git clone https://github.com/mazzlookman/nodejs-contacts-management-api

# Move to project
cd ./nodejs-contacts-management-api

# Run application
docker compose up -d

# Migrate all prisma models to database
docker exec -it contacts-app sh -c "npx prisma migrate dev"

# After that, you can start to hit the endpoints using http client (Postman, Insomnia, cURL, etc.)

# Stop application
docker compose down

# If you want to delete application image and volume
docker image rm contacts-app
docker volume prune
```

### API Documentation

---

You can view the API Documentation in this repository at `./docs` directory. Enter into `./docs` directory,
then there is API Documentation for each endpoint. In this project, it's using `openapi version 3.0.3`
with `json` file format. If you want to get the UI display of this API Documentation, you must install the `swagger-ui plugin` for your IDE.
> Which I know:
> * Jetbrains: is automatically installed
> * VSCode: it's "OpenAPI (Swagger) Editor".

### How To Contribute?

---
You can contribute by adding features or endpoints or creating the frontend.
So, let's start fork this repository and feel free to pull request.


