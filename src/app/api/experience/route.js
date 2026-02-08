import { NextResponse } from 'next/server';
import { db, initializeDatabase } from '@/lib/database';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    // Try to fetch from database first
    const initialized = await initializeDatabase();
    if (initialized) {
      const experience = await db.getExperience();
      if (experience && experience.length > 0) {
        return NextResponse.json(experience);
      }
    }
    
    // Fallback to static JSON file if database fails or is empty
    console.log('Falling back to static experience data');
    const filePath = path.join(process.cwd(), 'data', 'experience.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const staticData = JSON.parse(fileContent);
    return NextResponse.json(staticData);
    
  } catch (error) {
    console.error('Error fetching experience:', error);
    // Fallback to static JSON file even if initializeDatabase fails
    try {
      const filePath = path.join(process.cwd(), 'data', 'experience.json');
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const staticData = JSON.parse(fileContent);
      return NextResponse.json(staticData);
    } catch (staticError) {
      console.error('Error reading static experience data:', staticError);
      return NextResponse.json([], { status: 200 }); // Return empty array if all fails
    }
  }
}
