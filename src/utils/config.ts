import { readFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

// Load environment variables from .penport-secret on import
dotenv.config({
  path: '.penport-secret'
});

// Load config on import
const configPath = join(process.cwd(), 'penport.config.json');
let config: PenportConfig;

try {
  const configContent = readFileSync(configPath, 'utf-8');
  config = JSON.parse(configContent);
} catch (error) {
  throw new Error(`Failed to load penport.config.json: ${error}`);
}

export interface PenportConfig {
  projectId: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN: string;
    }
  }
}

export const loadConfig = (): PenportConfig => config;

export const getAccessToken = (): string => {
  const token = process.env.ACCESS_TOKEN;
  if (!token) {
    throw new Error('ACCESS_TOKEN is not set - add it to .penport-secret file');
  }
  return token;
};

export const getProjectId = () => config.projectId;

export const validateEnvironment = () => {
  // These will throw if not properly configured
  getAccessToken();
  getProjectId();
};  