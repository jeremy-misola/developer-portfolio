import { NextResponse } from 'next/server';
import { db, initializeDatabase } from '@/lib/database';

export async function GET() {
  try {
    await initializeDatabase();
    const testimonials = await db.getTestimonials('approved');
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching public testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}
