import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/database';

export async function GET() {
  try {
    // Check database connection
    const isDbConnected = await testConnection();
    
    // Return all environment variables (no filtering)
    const environmentVariables = process.env;
    
    // Return combined system info
    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      database: {
        connected: isDbConnected,
        host: process.env.DATABASE_HOST || 'localhost',
        port: process.env.DATABASE_PORT || 5432,
        name: process.env.DATABASE_NAME || 'portfolio',
        user: process.env.DATABASE_USER || 'postgres',
        password: process.env.DATABASE_PASSWORD
      },
      environment: environmentVariables,
      runtime: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch
      }
    });
    
  } catch (error) {
    console.error('Error fetching system info:', error);
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message,
        database: {
          connected: false,
          error: error.message
        }
      },
      { status: 500 }
    );
  }
}
