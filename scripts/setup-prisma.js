import { execSync } from 'child_process';
import path from 'path';

try {
  console.log('[v0] Running Prisma generate...');
  execSync('npx prisma generate', {
    stdio: 'inherit',
    cwd: path.resolve('.')
  });
  console.log('[v0] Prisma client generated successfully');
} catch (error) {
  console.error('[v0] Error running Prisma generate:', error.message);
  process.exit(1);
}
