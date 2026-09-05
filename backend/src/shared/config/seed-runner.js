import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createConnection } from './db.js';
import { seedDatabase } from './db-seeder.js';

import dns from "dns";
if (process.env.NODE_ENV !== 'production') {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
}

dotenv.config();

const runSeeder = async () => {
  try {
    console.log("Connecting to Database for seeding...");
    const conn = await createConnection();
    console.log("Starting seeding process...");
    await seedDatabase();
    console.log('Seeding finished successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

runSeeder();
