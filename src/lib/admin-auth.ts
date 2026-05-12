import { NextRequest, NextResponse } from 'next/server';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin-secret-key-2024';

/**
 * Verify admin access from request
 * Checks for x-admin-secret header or admin_token cookie
 */
export function requireAdminRequest(request: NextRequest): NextResponse | null {
  const adminSecret = request.headers.get('x-admin-secret');
  const adminToken = request.cookies.get('admin_token')?.value;
  
  if (adminSecret !== ADMIN_SECRET && adminToken !== ADMIN_SECRET) {
    return NextResponse.json(
      { success: false, error: 'غير مصرح بالوصول - Admin access required' },
      { status: 401 }
    );
  }
  
  return null; // null means authorized
}

/**
 * Check if request has admin access (boolean version)
 */
export function isAdminRequest(request: NextRequest): boolean {
  const adminSecret = request.headers.get('x-admin-secret');
  const adminToken = request.cookies.get('admin_token')?.value;
  
  return adminSecret === ADMIN_SECRET || adminToken === ADMIN_SECRET;
}
