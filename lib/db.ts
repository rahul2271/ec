// Database stub - Prisma client initialization requires running `prisma generate`
// For local development, please ensure you have:
// 1. Set up a database (PostgreSQL recommended)
// 2. Created a .env.local file with DATABASE_URL
// 3. Run: npx prisma generate
// 4. Run: npx prisma db push

let prisma: any = null;

try {
  // This will only work if Prisma has been generated
  const { PrismaClient } = require("@prisma/client");
  
  const globalForPrisma = (global as any) || {};
  
  prisma = globalForPrisma.prisma || new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });
  
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }
} catch (error) {
  console.warn(
    "[Database] Prisma client not available. To use the database, run: npx prisma generate"
  );
  // Return a stub that will throw helpful errors when used
  prisma = new Proxy(
    {},
    {
      get() {
        throw new Error(
          "Prisma client not initialized. Run 'npx prisma generate' to set up the database."
        );
      },
    }
  );
}

export { prisma };
