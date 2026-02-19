# Test implementation of passkey authentication

In this project, I aimed to implement an authentication flow using passkey credentials and explore various backend and frontend frameworks.

## Technologies

### Backend

The backend is implemented in Node.js using the [Nest.js](https://nestjs.com/) framework. The application has a GraphQL API, leveraging the [Apollo server](https://www.apollographql.com/) plugin for Nest.js.

[SQLite](https://sqlite.org/) is used for the database with the [Prisma](https://www.prisma.io/) ORM framework.

### Frontend

The frontend is implemented with the [React](https://react.dev/) framework. Components from [Shadcn](https://ui.shadcn.com/) were used for UI. 
Claude Code AI agent was used for generating the GraphQL client and for creating some of the components.

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

In this application, we explore a scenario where passkeys serve as an additional method of authentication, in addition to classic password authentication, as would be the case if an existing application wanted to incorporate passkeys as an authentication method. Registering a passkey to an account is a privileged operation, available to the user only after logging in. The passkeys are not discoverable, meaning that users must enter their username when logging in. This allows the backend to connect multiple credentials from different devices to the same user account without another form of account synchronization, such as through email.

The authorization is done through JWT tokens. The user is issued an access and refresh tokens after successful authentication. The access token is valid for 15 minutes and is sent in the `Authorization` header. On the frontend, the tokens are saved in local storage. After the access token expires and the frontend receives an `Unauthorized` error, the refresh token is used to obtain a new access token. The version in the refresh token payload is checked against the user's token version saved in the database. The refresh token is invalidated on logout. This is implemented by incrementing the user's token version in the database.

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

After the user chooses to register a passkey, a request is first sent to the backend to start the registration process.

**1. Start passkey registration - backend**
- passkey registration options are generated
  - configure the origin and RPID - connecting passkey with specific application
  - configure the allowed algorithms and verification options for the credential
  - set user ID - connecting credential to user
- a random challenge is generated and saved to the database
  - challenge has an expiration time and can be used only once
- registration options are returned to the frontend

**2. Create passkey on device - frontend**
- after receiving registration options, the WebAuthn browser API is called - passing the options
- user is prompted to confirm registration of a new passkey
- a key pair is created, private key is stored on the device
- the challenge is signed using the new private key
- passkey registration data, including the public key, is sent to the backend

**3. Finish passkey registration - backend**
- backend receives the passkey registration payload from the frontend
- the registration challenge is retrieved from the database, while checking that it is valid and not expired
- the registration payload is verified
  - origin, credential type is verified
  - the challenge is compared to the expected challenge
  - the signature is checked with the public key
- if valid, a new credential is saved to the database
- the challenge is invalidated

### Authentication with passkeys

After registering a passkey, the user can use it to authenticate

**1. User requests passkey authentication - frontend**
- the user must enter a username to identify themselves
- the request is sent to backend

**2. Start passkey authentication - backend**
- backend receives request, checks that the user account exists
- all passkey credentials registered to the account are retrieved from the database
- authentication options are generated
- an authentication challenge is generated and saved to the database
- the authentication options, along with all user credentials, are sent to the frontend

**3. Authentication request on device - frontend**
- after receiving authentication options, the WebAuthn browser API is invoked - passing the options
- the device credential API checks the list of allowed credentials from backend against the credentials saved on the device
  - only the credentials with a matching origin and user ID are considered
  - if a matching credential is found on device, it is selected for authentication
- the user is prompted to confirm authentication through the selected credential
- the challenge is signed using the private key from the selected credential
- the authentication response is returned to frontend and sent to backend

**4. Finish passkey authentication - backend**
- backend receives the passkey authentication payload from the frontend
- the authentication challenge is retrieved from the database, while checking that it is valid and not expired
- the authentication payload is verified
  - origin, credential type is verified
  - the challenge is compared to the expected challenge
  - the signature is checked with the public key
- if valid, JWT tokens are issued to the user
- the challenge is invalidated
