import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import pool from '@/lib/db';

// PUT - Update a reading
export async function PUT(
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
    const body = await request.json();
    const { book, chapters, verses, date } = body;

    if (!book || !chapters || !date) {
      return NextResponse.json(
        { error: 'Book, chapters, and date are required' },
        { status: 400 }
      );
    }

    // Update the reading (ensure it belongs to the user)
    const result = await pool.query(
      'UPDATE bible_readings SET "bibleBook" = $1, chapters = $2, verses = $3, "dateRead" = $4, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $5 AND "userId" = $6 RETURNING *',
      [book, chapters, verses || null, date, id, payload.userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Reading not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Reading updated successfully',
      reading: result.rows[0],
    });
  } catch (error) {
    console.error('Update reading error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}

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
