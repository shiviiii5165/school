import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Config for Prisma
const prismaConfig = {
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(prismaConfig as any);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Utility function to execute a database query with automatic retries for connection timeouts (like Neon cold starts).
 * Useful for critical API endpoints where the DB might be asleep.
 */
export async function withDbRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  baseDelayMs = 1000
): Promise<T> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await operation();
    } catch (error: any) {
      attempt++;
      const isConnectionError = error?.code === 'P1001' || error?.message?.includes('Can\'t reach database server');
      
      if (!isConnectionError || attempt >= maxRetries) {
        if (attempt >= maxRetries && isConnectionError) {
          console.error(`[DB Error] Connection failed after ${maxRetries} attempts. DB might be down.`);
        }
        throw error;
      }
      
      const delayMs = baseDelayMs * Math.pow(2, attempt - 1); // Exponential backoff: 1s, 2s, 4s
      console.warn(`[DB Warning] Connection attempt ${attempt} failed (P1001). Retrying in ${delayMs}ms...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  throw new Error("Unreachable");
}
