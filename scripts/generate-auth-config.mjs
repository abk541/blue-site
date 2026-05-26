import { access, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pbkdf2Sync, randomBytes } from 'node:crypto';

const OUTPUT_PATH = resolve('src/lib/authConfig.generated.js');
const ITERATIONS = 210000;
const KEY_LENGTH = 32;
const DIGEST = 'sha256';

const isCi = process.env.GITHUB_ACTIONS === 'true';
const username = process.env.BLUE_SITE_AUTH_USER;
const password = process.env.BLUE_SITE_AUTH_PASSWORD;

if (isCi && (!username || !password)) {
  throw new Error('Missing GitHub repository secrets USER and/or PASSWORD for the Blue Site login gate.');
}

// Skip regeneration if no explicit credentials provided and the file already exists.
if (!username && !password) {
  try {
    await access(OUTPUT_PATH);
    process.exit(0);
  } catch {
    // File doesn't exist yet — fall through to generate with defaults.
  }
}

const credentials = {
  username: username || 'blue-site',
  password: password || 'bouygues',
};

function makeDescriptor(value) {
  const salt = randomBytes(16);
  const hash = pbkdf2Sync(value, salt, ITERATIONS, KEY_LENGTH, DIGEST);

  return {
    salt: salt.toString('base64'),
    hash: hash.toString('base64'),
    iterations: ITERATIONS,
  };
}

const config = {
  username: makeDescriptor(credentials.username),
  password: makeDescriptor(credentials.password),
  sessionTtlMs: 60 * 60 * 1000,
};

const contents = `export const AUTH_CONFIG = ${JSON.stringify(config, null, 2)};\n`;

await mkdir(dirname(OUTPUT_PATH), { recursive: true });
await writeFile(OUTPUT_PATH, contents);
