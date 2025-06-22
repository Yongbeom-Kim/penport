import { getFile } from "../../src/api/request";
import dotenv from 'dotenv';

dotenv.config({
  path: '.penpot-secret'
});

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN: string;
      PROJECT_ID: string;
    }
  }
}

if (!process.env.ACCESS_TOKEN) {
  throw new Error('ACCESS_TOKEN is not set');
}

if (!process.env.PROJECT_ID) {
  throw new Error('PROJECT_ID is not set');
}

it('should get project', async () => {
  await getFile(process.env.PROJECT_ID, process.env.ACCESS_TOKEN);
});

it('project not found', async () => {
  await expect(getFile('123', process.env.ACCESS_TOKEN)).rejects.toThrow();
});

it('invalid token', async () => {
  await expect(getFile(process.env.PROJECT_ID, 'invalid')).rejects.toThrow();
});
