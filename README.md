# Test implementation of passkey authentication

In this project, I aimed to implement an authentication flow using passkey credentials and explore various backend and frontend frameworks.

## Technologies

### Backend

The backend is implemented in Node.js using the [Nest.js](https://nestjs.com/) framework. The application has a GraphQL API, leveraging the [Apollo server](https://www.apollographql.com/) plugin for Nest.js.

[SQLite](https://sqlite.org/) is used for the database with the [Prisma](https://www.prisma.io/) ORM framework.

### Frontend

The frontend is implemented with the [React](https://react.dev/) framework. Components from [Shadcn](https://ui.shadcn.com/) were used for UI. 
Claude Code was used for generating the GraphQL client and for creating some of the components.

## Running the project

Prerequisites: Install Node.js and npm v24 - https://nodejs.org/en/download/archive/v24.13.1

**1. Run the backend**

_You can use the commands below_

- Work inside the `passkey-backend` directory
- Create a `.env` file, copy the contents of `.env_schema` into it, you can leave the values for testing
- Install dependencies
- Generate database client and initialize database
- Start the project

```
cd passkey-backend
touch .env && cat .env_schema > .env
npm install
npm run prisma:init
npm run start:dev
```

**2. Run the frontend**

- Work inside the `passkey-frontend` directory
- Install dependencies
- Start the project

```
cd passkey-frontend
npm install
npm run dev
```

- the application will be available at: `http://localhost:5173`

## Passkey Demo

In this application we explore a scenario where passkeys are an additional method of authentication, on top of classic password authentication, as this would be the case if an existing application wanted to add passkeys as an authentication method. Registering a passkey to an account is a priviledged operation, available to the user only after logging in. The passkeys are not discoverable, meaning that the user has to enter their username when logging in. This allows the backend to connect multiple credentials from different device to the same user account without another form of account synchronization, such as through email.

Passkey registering and authentication flow:

**1. Register**
- register an account with username and password

**2. Add a passkey credential to your account**
- after the registration, you will be prompted to add a passkey credential to your account

**3. List of passkeys displayed in user profile**
- you can see a list of passkeys registered to the account in user profile
- you can register additional passkeys

**4. Log in with passkeys**
- log out
- you will now be able to log in without a password, using your passkey

## Passkey implementation

### Registering a passkey

After user chooses to register a passkey, a request is first sent to
