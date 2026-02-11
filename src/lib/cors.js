// Reusable CORS configuration
export function applyCorsHeaders(response) {
  // Allow all origins
  response.headers.set('Access-Control-Allow-Origin', '*');
  // Allow all methods including HEAD
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
  // Allow common headers
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  // Allow credentials (if needed)
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  // Set maximum age for preflight cache
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours

  return response;
}

// Helper function to create a preflight response
export function createPreflightResponse() {
  const response = new Response(null, { status: 204 });
  return applyCorsHeaders(response);
}