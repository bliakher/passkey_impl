import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { GraphQLResponse } from './models/response-body.model';

describe('GraphQL E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should perform signup and login', async () => {
    const signupMutation = `
      mutation {
        signup(email: "test@example.com", password: "1234")
      }
    `;

    await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: signupMutation })
      .expect(200);

    const loginMutation = `
      mutation {
        login(email: "test@example.com", password: "1234")
      }
    `;

    const loginResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: loginMutation })
      .expect(200);

    type LoginResponse = { login: string };
    const body = loginResponse.body as GraphQLResponse<LoginResponse>;

    expect(body.data?.login).toBeDefined();
  });
});
