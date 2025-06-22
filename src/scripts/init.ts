import { existsSync, readFileSync, writeFileSync } from 'fs';
import { z } from 'zod';
import * as readline from 'readline';

function createReadlineInterface(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function promptAsync(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function promptPassword(_rl: readline.Interface, message: string): Promise<string> {
  return new Promise((resolve) => {
    // Hide input by setting stdin to raw mode
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    
    let input = '';
    process.stdout.write(message + ': ');
    
    const onData = (chunk: Buffer) => {
      const char = chunk.toString();
      
      // Handle enter key (newline)
      if (char === '\n' || char === '\r') {
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(false);
        }
        process.stdin.removeListener('data', onData);
        process.stdout.write('\n');
        resolve(input);
        return;
      }
      
      // Handle backspace
      if (char === '\b' || char === '\x7f') {
        if (input.length > 0) {
          input = input.slice(0, -1);
          process.stdout.write('\b \b');
        }
        return;
      }
      
      // Handle Ctrl+C
      if (char === '\x03') {
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(false);
        }
        process.stdin.removeListener('data', onData);
        process.stdout.write('\n');
        process.exit(1);
      }
      
      // Add character to input (don't echo it)
      if (char >= ' ' && char <= '~') {
        input += char;
        process.stdout.write('*');
      }
    };
    
    process.stdin.on('data', onData);
  });
}

const PenpotUrlSchema = z.string().url().refine(
  (url) => {
    const parsed = new URL(url);
    return parsed.hostname === 'design.penpot.app' && parsed.hash.includes('#/workspace');
  },
  {
    message: 'Invalid Penpot URL format. Expected format: https://design.penpot.app/#/workspace?team-id=...&file-id=...&page-id=...',
  }
);

interface ParsedPenpotUrl {
  teamId: string;
  fileId: string;
  pageId: string;
}

function parsePenpotUrl(url: string): ParsedPenpotUrl {
  const parsed = new URL(url.trim());
  
  // Extract the hash fragment and parse the query parameters from it
  const hash = parsed.hash;
  if (!hash) {
    throw new Error('URL must contain a hash fragment with workspace parameters');
  }
  
  // Find the query string part after the hash
  const queryIndex = hash.indexOf('?');
  if (queryIndex === -1) {
    throw new Error('URL must contain query parameters after the hash');
  }
  
  const queryString = hash.substring(queryIndex + 1);
  const searchParams = new URLSearchParams(queryString);
  
  const teamId = searchParams.get('team-id');
  const fileId = searchParams.get('file-id');
  const pageId = searchParams.get('page-id');
  
  if (!teamId || !fileId || !pageId) {
    throw new Error('URL must contain team-id, file-id, and page-id parameters. Parameters: ' + teamId + ', ' + fileId + ', ' + pageId);
  }
  
  // Validate UUIDs
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(teamId) || !uuidRegex.test(fileId) || !uuidRegex.test(pageId)) {
    throw new Error('team-id, file-id, and page-id must be valid UUIDs');
  }
  
  return { teamId, fileId, pageId };
}


export async function initCommand(): Promise<void> {
  const rl = createReadlineInterface();
  
  try {
    // Check if .penport-secret exists
    const secretPath = '.penport-secret';
    const configPath = 'penport.config.json';
    
    let existingAccessToken = '';
    let existingConfig: any = {};
    
    // Read existing .penport-secret if it exists
    if (existsSync(secretPath)) {
      try {
        const secretContent = readFileSync(secretPath, 'utf-8');
        const match = secretContent.match(/ACCESS_TOKEN=(.+)/);
        if (match && match[1]) {
          existingAccessToken = match[1].trim();
        }
      } catch (error) {
        console.log('Warning: Could not read existing .penport-secret file');
      }
    }
    
    // Read existing config if it exists
    if (existsSync(configPath)) {
      try {
        const configContent = readFileSync(configPath, 'utf-8');
        existingConfig = JSON.parse(configContent);
      } catch (error) {
        console.log('Warning: Could not read existing penport.config.json file');
      }
    }
    
    // Prompt for access token
    let accessToken = existingAccessToken;
    if (!existingAccessToken) {
      console.log('No access token found.');
      accessToken = await promptPassword(rl, 'Enter your Penpot access token');
      if (!accessToken.trim()) {
        throw new Error('Access token is required');
      }
    } else {
      console.log('Existing access token found.');
      const newToken = await promptPassword(rl, 'Enter new access token (press Enter to keep existing)');
      if (newToken.trim()) {
        accessToken = newToken.trim();
      }
    }
    
    // Prompt for Penpot URL
    let penpotUrl = '';
    const hasExistingConfig = existingConfig.teamId && existingConfig.fileId && existingConfig.pageId;
    
    if (!hasExistingConfig) {
      console.log('No existing configuration found.');
      penpotUrl = await promptAsync(rl, 'Enter your Penpot file URL: ');
      if (!penpotUrl.trim()) {
        throw new Error('Penpot URL is required');
      }
    } else {
      console.log('Existing configuration found.');
      const newUrl = await promptAsync(rl, 'Enter new Penpot file URL (press Enter to keep existing): ');
      if (newUrl.trim()) {
        penpotUrl = newUrl.trim();
      }
    }
    
    // Parse and validate URL if provided
    let config = existingConfig;
    if (penpotUrl) {
      console.log('Validating URL...');
      PenpotUrlSchema.parse(penpotUrl);
      const parsedUrl = parsePenpotUrl(penpotUrl);
      config = {
        teamId: parsedUrl.teamId,
        fileId: parsedUrl.fileId,
        pageId: parsedUrl.pageId,
      };
    }
    
    // Write .penport-secret file
    writeFileSync(secretPath, `ACCESS_TOKEN=${accessToken}\n`);
    console.log('✓ Access token saved to .penport-secret');
    
    // Write penport.config.json file
    writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('✓ Configuration saved to penport.config.json');
    
    console.log('\nInitialization complete!');
    
  } catch (error) {
    console.error('Error during initialization:', error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    rl.close();
  }
}