import { NextResponse } from 'next/server';
import { db, initializeDatabase } from '@/lib/database';
import fs from 'fs/promises';
import path from 'path';
import { applyCorsHeaders, createPreflightResponse } from '@/lib/cors';

// Handle CORS preflight
export async function OPTIONS() {
  return createPreflightResponse();
}

// Handle HEAD requests
export async function HEAD() {
  const response = new NextResponse(null);
  return applyCorsHeaders(response);
}

export async function GET() {
  try {
    // Try to fetch from database first
    const initialized = await initializeDatabase();
    if (initialized) {
      const projects = await db.getProjects();
      if (projects && projects.length > 0) {
        return applyCorsHeaders(NextResponse.json(projects));
      }
    }
    
    // Fallback to static JSON file if database fails or is empty
    console.log('Falling back to static projects data');
    const filePath = path.join(process.cwd(), 'data', 'projects.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const staticData = JSON.parse(fileContent);
    return applyCorsHeaders(NextResponse.json(staticData));
    
  } catch (error) {
    console.error('Error fetching projects:', error);
    // Fallback to static JSON file even if initializeDatabase fails
    try {
      const filePath = path.join(process.cwd(), 'data', 'projects.json');
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const staticData = JSON.parse(fileContent);
      return applyCorsHeaders(NextResponse.json(staticData));
    } catch (staticError) {
      console.error('Error reading static projects data:', staticError);
      return applyCorsHeaders(NextResponse.json([], { status: 200 })); // Return empty array if all fails
    }
  }
}
