#!/usr/bin/env node

/**
 * Password Hash Generator
 * Generates a bcrypt hash for the admin password to use in .env.local
 *
 * Usage: npx ts-node scripts/generate-password-hash.ts
 *
 * The script will prompt for a password and output the bcrypt hash
 * to use in the ADMIN_PASSWORD_HASH environment variable
 */

import bcrypt from 'bcrypt';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('MQ Studio - Password Hash Generator');
  console.log('====================================\n');

  try {
    const password = await question('Enter the admin password: ');

    if (!password || password.length < 8) {
      console.error('Error: Password must be at least 8 characters');
      process.exit(1);
    }

    console.log('\nGenerating bcrypt hash (this may take a few seconds)...\n');
    const hash = await bcrypt.hash(password, 12);

    console.log('Generated password hash:');
    console.log('------------------------');
    console.log(hash);
    console.log('\nAdd this to your .env.local file:');
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    console.log('\nOr store in 1Password and reference it:');
    console.log(
      'ADMIN_PASSWORD_HASH=op://Development/MQ Studio API Keys/admin_password_hash'
    );
  } catch (error) {
    console.error('Error generating password hash:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
