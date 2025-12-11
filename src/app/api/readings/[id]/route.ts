import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import pool from '@/lib/db';

// DELETE - Remove a reading
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Delete the reading (ensure it belongs to the user)
    const result = await pool.query(
      'DELETE FROM bible_readings WHERE id = $1 AND "userId" = $2 RETURNING id',
      [id, payload.userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Reading not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Reading deleted successfully',
    });
  } catch (error) {
    console.error('Delete reading error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
