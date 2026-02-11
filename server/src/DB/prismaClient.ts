// This file exports a singleton PrismaClient instance for use in your app
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Connects to the PostgreSQL database using Prisma.
 * Logs a success or failure message.
 * Best practice: call this at server startup.
 */
export async function connectPrisma() {
	try {
		await prisma.$connect();
		console.log('✅ Prisma connected to PostgreSQL successfully.');
	} catch (error) {
		console.error('❌ Prisma failed to connect to PostgreSQL:', error);
		process.exit(1); // Exit process on failure
	}
}

export default prisma;
