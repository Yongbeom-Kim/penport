import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

// Load environment variables from .penport-secret on import
dotenv.config({
  path: '.penport-secret'
});

// Load config on import - but handle missing files gracefully
const configPath = join(process.cwd(), 'penport.config.json');
let config: PenportConfig | null = null;

try {
  if (existsSync(configPath)) {
    const configContent = readFileSync(configPath, 'utf-8');
    config = JSON.parse(configContent);
  }
} catch (error) {
  // Config will remain null if there's an error
}

export interface PenportConfig {
  teamId: string;
  fileId: string;
  pageId: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN: string;
    }
  }
}

export const loadConfig = (): PenportConfig => {
  if (!config) {
    throw new Error('Configuration not loaded - run "penport init" first');
  }
  return config;
};

export const getAccessToken = (): string => {
  const token = process.env.ACCESS_TOKEN;
  if (!token) {
    throw new Error('ACCESS_TOKEN is not set - add it to .penport-secret file or run "penport init"');
  }
  return token;
};

export const getFileId = () => {
  if (!config) {
    throw new Error('Configuration not loaded - run "penport init" first');
  }
  return config.fileId;
};

export const getTeamId = () => {
  if (!config) {
    throw new Error('Configuration not loaded - run "penport init" first');
  }
  return config.teamId;
};

export const getPageId = () => {
  if (!config) {
    throw new Error('Configuration not loaded - run "penport init" first');
  }
  return config.pageId;
};

export const validateEnvironment = () => {
  // Check if config files exist
  const secretPath = join(process.cwd(), '.penport-secret');
  if (!existsSync(secretPath)) {
    throw new Error('Configuration file .penport-secret not found - run "penport init" first');
  }
  
  if (!existsSync(configPath)) {
    throw new Error('Configuration file penport.config.json not found - run "penport init" first');
  }
  
  // These will throw if not properly configured
  getAccessToken();
  getFileId();
  getTeamId();
  getPageId();
};  