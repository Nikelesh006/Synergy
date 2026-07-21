import mongoose from 'mongoose';
import { connectDB } from '../lib/db';
import { seedProducts } from './seed-products';

async function runSeed() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Connected to MongoDB');
    
    await seedProducts();
    console.log('Seed completed successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

runSeed();
