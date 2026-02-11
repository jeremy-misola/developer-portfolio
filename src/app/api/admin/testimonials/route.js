import { NextResponse } from 'next/server';
import { db, initializeDatabase } from '@/lib/database';
import { isValidSession } from '@/lib/admin';
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

export async function GET(request) {
  try {
    // Check for admin session cookie
    const sessionToken = request.cookies.get('admin_session');
    
    if (!sessionToken || !isValidSession(sessionToken.value)) {
      return applyCorsHeaders(NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      ));
    }

    await initializeDatabase();
    const testimonials = await db.getTestimonials('all');
    return applyCorsHeaders(NextResponse.json(testimonials));
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return applyCorsHeaders(NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    ));
  }
}

export async function POST(request) {
  try {
    // Check for admin session cookie
    const sessionToken = request.cookies.get('admin_session');
    
    if (!sessionToken || !isValidSession(sessionToken.value)) {
      return applyCorsHeaders(NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      ));
    }

    await initializeDatabase();
    const data = await request.json();
    const newTestimonial = await db.createTestimonial(data);
    
    return applyCorsHeaders(NextResponse.json(newTestimonial, { status: 201 }));
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return applyCorsHeaders(NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    ));
  }
}

export async function PUT(request) {
  try {
    // Check for admin session cookie
    const sessionToken = request.cookies.get('admin_session');
    
    if (!sessionToken || !isValidSession(sessionToken.value)) {
      return applyCorsHeaders(NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      ));
    }

    await initializeDatabase();
    const { id, ...updateData } = await request.json();
    const updatedTestimonial = await db.updateTestimonial(id, updateData);
    
    if (!updatedTestimonial) {
      return applyCorsHeaders(NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      ));
    }

    return applyCorsHeaders(NextResponse.json(updatedTestimonial));
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return applyCorsHeaders(NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    ));
  }
}

export async function DELETE(request) {
  try {
    // Check for admin session cookie
    const sessionToken = request.cookies.get('admin_session');
    
    if (!sessionToken || !isValidSession(sessionToken.value)) {
      return applyCorsHeaders(NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      ));
    }

    await initializeDatabase();
    const { id } = await request.json();
    const deleted = await db.deleteTestimonial(id);
    
    if (!deleted) {
      return applyCorsHeaders(NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      ));
    }

    return applyCorsHeaders(NextResponse.json({ message: 'Testimonial deleted successfully' }));
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return applyCorsHeaders(NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    ));
  }
}
