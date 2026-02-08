import { NextResponse } from 'next/server';
import { db, initializeDatabase } from '@/lib/database';
import { isValidSession } from '@/lib/admin';

export async function GET(request) {
  try {
    // Check for admin session cookie
    const sessionToken = request.cookies.get('admin_session');
    
    if (!sessionToken || !isValidSession(sessionToken.value)) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await initializeDatabase();
    const experience = await db.getExperience();
    return NextResponse.json(experience);
  } catch (error) {
    console.error('Error fetching experience:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experience' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Check for admin session cookie
    const sessionToken = request.cookies.get('admin_session');
    
    if (!sessionToken || !isValidSession(sessionToken.value)) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await initializeDatabase();
    const data = await request.json();
    const newExperience = await db.createExperience(data);
    
    return NextResponse.json(newExperience, { status: 201 });
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    // Check for admin session cookie
    const sessionToken = request.cookies.get('admin_session');
    
    if (!sessionToken || !isValidSession(sessionToken.value)) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await initializeDatabase();
    const { id, ...updateData } = await request.json();
    const updatedExperience = await db.updateExperience(id, updateData);
    
    if (!updatedExperience) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedExperience);
  } catch (error) {
    console.error('Error updating experience:', error);
    return NextResponse.json(
      { error: 'Failed to update experience' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    // Check for admin session cookie
    const sessionToken = request.cookies.get('admin_session');
    
    if (!sessionToken || !isValidSession(sessionToken.value)) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await initializeDatabase();
    const { id } = await request.json();
    const deleted = await db.deleteExperience(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    return NextResponse.json(
      { error: 'Failed to delete experience' },
      { status: 500 }
    );
  }
}
