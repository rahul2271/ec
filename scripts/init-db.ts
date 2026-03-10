import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function initializeDatabase() {
  try {
    console.log('🗄️  Initializing database with Prisma...');
    
    // Generate Prisma client
    console.log('📦 Generating Prisma client...');
    await execAsync('npx prisma generate');
    
    // Push schema to database (creates tables)
    console.log('🚀 Pushing schema to Neon database...');
    await execAsync('npx prisma db push --skip-generate');
    
    console.log('✅ Database initialized successfully!');
    console.log('📝 Next steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Check your Neon console to verify tables were created');
    
  } catch (error) {
    console.error('❌ Error initializing database:');
    console.error(error);
    process.exit(1);
  }
}

initializeDatabase();
