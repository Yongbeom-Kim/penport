import dotenv from 'dotenv';

// Load environment variables from .penpot-secret
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

export const validateEnvironment = () => {
  if (!process.env.ACCESS_TOKEN) {
    throw new Error('ACCESS_TOKEN is not set - add it to .penpot-secret file');
  }
  if (!process.env.PROJECT_ID) {
    throw new Error('PROJECT_ID is not set - add it to .penpot-secret file');
  }
};

export const getProjectId = () => process.env.PROJECT_ID;
export const getAccessToken = () => process.env.ACCESS_TOKEN;