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
    const projects = await db.getProjects();
    return applyCorsHeaders(NextResponse.json(projects));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return applyCorsHeaders(NextResponse.json(
      { error: 'Failed to fetch projects' },
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
    const newProject = await db.createProject(data);
    
    return applyCorsHeaders(NextResponse.json(newProject, { status: 201 }));
  } catch (error) {
    console.error('Error creating project:', error);
    return applyCorsHeaders(NextResponse.json(
      { error: 'Failed to create project' },
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
    const updatedProject = await db.updateProject(id, updateData);
    
    if (!updatedProject) {
      return applyCorsHeaders(NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      ));
    }

    return applyCorsHeaders(NextResponse.json(updatedProject));
  } catch (error) {
    console.error('Error updating project:', error);
    return applyCorsHeaders(NextResponse.json(
      { error: 'Failed to update project' },
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
    const deleted = await db.deleteProject(id);
    
    if (!deleted) {
      return applyCorsHeaders(NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      ));
    }

    return applyCorsHeaders(NextResponse.json({ message: 'Project deleted successfully' }));
  } catch (error) {
    console.error('Error deleting project:', error);
    return applyCorsHeaders(NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    ));
  }
}
