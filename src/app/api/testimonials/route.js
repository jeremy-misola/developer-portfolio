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
      const testimonials = await db.getTestimonials('approved');
      if (testimonials && testimonials.length > 0) {
        return applyCorsHeaders(NextResponse.json(testimonials));
      }
    }
    
    // Fallback to static JSON file if database fails or is empty
    console.log('Falling back to static testimonials data');
    const filePath = path.join(process.cwd(), 'data', 'testimonials.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const staticData = JSON.parse(fileContent);
    // Filter to only approved testimonials (same as database query)
    const approvedTestimonials = staticData.filter(t => t.status === 'approved');
    return applyCorsHeaders(NextResponse.json(approvedTestimonials));
    
  } catch (error) {
    console.error('Error fetching public testimonials:', error);
    // Fallback to static JSON file even if initializeDatabase fails
    try {
      const filePath = path.join(process.cwd(), 'data', 'testimonials.json');
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const staticData = JSON.parse(fileContent);
      const approvedTestimonials = staticData.filter(t => t.status === 'approved');
      return applyCorsHeaders(NextResponse.json(approvedTestimonials));
    } catch (staticError) {
      console.error('Error reading static testimonials data:', staticError);
      return applyCorsHeaders(NextResponse.json([], { status: 200 })); // Return empty array if all fails
    }
  }
}
