import { getProject } from "../../src/api/request";
import dotenv from 'dotenv';

dotenv.config({
  path: '.penpot-secret'
});

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN: string;
    }
  }
}

const PROJECT_ID = '4ad2a2f5-64b0-80be-8006-4a0c775086b1';

if (!process.env.ACCESS_TOKEN) {
  throw new Error('ACCESS_TOKEN is not set');
}

it('should get project', async () => {
  await getProject(PROJECT_ID, process.env.ACCESS_TOKEN);
});

it('project not found', async () => {
  expect(async () => {
    await getProject('123', process.env.ACCESS_TOKEN);
  }).not.toThrow();
});

it('invalid token', async () => {
  expect(async () => {
    await getProject(PROJECT_ID, 'invalid');
  }).not.toThrow();
});
