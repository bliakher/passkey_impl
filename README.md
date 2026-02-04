# Test implementation of passkey authentication

In this project, I aimed to implement an authentication flow using passkey credentials and explore various backend and frontend frameworks.

## Technologies

### Backend

The backend is implemented in Node.js using the [Nest.js](https://nestjs.com/) framework. The application has a GraphQL API, leveraging the [Apollo server](https://www.apollographql.com/) plugin for Nest.js.

[SQLite](https://sqlite.org/) is used for the database with the [Prisma](https://www.prisma.io/) ORM framework.

### Frontend

The frontend is implemented with the [React](https://react.dev/) framework. Components from [Shadcn](https://ui.shadcn.com/) were used for UI.

## Running the project

**1. Run the backend**

- work inside the `passkey-backend` directory
- install dependencies
- start the project

```
cd passkey-backend
npm install
npm run start:dev
```

**2. Run the frontend**

- work inside the `passkey-frontend` directory
- install dependencies
- start the project

```
cd passkey-frontend
npm install
npm run dev
```

- the application will be available at: `http://localhost:5173`

**3. Register**
- register with username and password

**4. Add a passkey credential to your account**
- after the registration, you will be prompted to add a passkey credential to your account

**5. Log in with passkeys**
- you will now be able to log in without a password, using your passkey
