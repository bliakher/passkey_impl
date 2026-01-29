// test/auth.e2e-spec.ts
import { config } from 'dotenv';
config({ path: '.env.test' }); // load test env first

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import request from 'supertest';
import { LoginPayload } from '../src/auth/models/login-payload.model';

interface RegisterMutationResponse {
  errors: any;
  data: {
    register: LoginPayload;
  };
}

// Keep app and prisma at top-level
let app: INestApplication;
let prisma: PrismaService;

beforeAll(async () => {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleRef.createNestApplication();
  await app.init();

  prisma = app.get(PrismaService);

  // Clean DB once before all tests
  await prisma.$executeRawUnsafe(`DELETE FROM "User";`);
});

afterAll(async () => {
  // Disconnect Prisma and close app
  await prisma.$disconnect();
  await app.close();
});

describe('Auth e2e', () => {
  it('register mutation works', async () => {
    const mutation = `
      mutation Register($username: String!, $password: String!) {
        register(username: $username, password: $password) {
          accessToken
          refreshToken
          accessTokenTTLSec
          refreshTokenTTLSec
        }
      }
    `;

    const variables = { username: 'testuser', password: 'testpass' };

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation, variables });

    const body = response.body as RegisterMutationResponse;
    const payload = body.data.register;

    expect(payload.accessToken).toBeDefined();
    expect(payload.refreshToken).toBeDefined();
    expect(payload.accessTokenTTLSec).toBeGreaterThan(0);
    expect(payload.refreshTokenTTLSec).toBeGreaterThan(0);
  });
});

describe('Auth register (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // Required env vars for auth
    process.env.JWT_ACCESS_SECRET = 'test-access-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
    process.env.PASSWD_PEPPER = 'test-pepper';

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers a user and returns tokens', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation Register($username: String!, $password: String!) {
            register(username: $username, password: $password) {
              accessToken
              accessTokenTTLSec
              refreshToken
              refreshTokenTTLSec
            }
          }
        `,
        variables: {
          username: 'alice',
          password: 'super-secret',
        },
      })
      .expect(200);

    const body = response.body as RegisterMutationResponse;

    expect(body.errors).toBeUndefined();

    const payload: LoginPayload = body.data.register;

    expect(payload.accessToken).toBeDefined();
    expect(payload.refreshToken).toBeDefined();
    expect(payload.accessTokenTTLSec).toBeGreaterThan(0);
    expect(payload.refreshTokenTTLSec).toBeGreaterThan(0);
  });
});
