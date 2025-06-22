import { getFile } from "../../src/api/request";
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
  await getFile(PROJECT_ID, process.env.ACCESS_TOKEN);
});

it('project not found', async () => {
  await expect(getFile('123', process.env.ACCESS_TOKEN)).rejects.toThrow();
});

it('invalid token', async () => {
  await expect(getFile(PROJECT_ID, 'invalid')).rejects.toThrow();
});
