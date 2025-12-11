import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import pool from '@/lib/db';
import { randomUUID } from 'crypto';

// GET - Fetch all readings for the authenticated user
export async function GET(request: NextRequest) {
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

    // Get all readings for this user
    const result = await pool.query(
      'SELECT * FROM bible_readings WHERE "userId" = $1 ORDER BY "dateRead" DESC',
      [payload.userId]
    );

    return NextResponse.json({
      readings: result.rows,
    });
  } catch (error) {
    console.error('Get readings error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}

// POST - Create a new reading
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { bibleBook, chapters, verses, dateRead, notes } = body;

    // Validate required fields
    if (!bibleBook || !chapters || !dateRead) {
      return NextResponse.json(
        { error: 'Bible book, chapters, and date are required' },
        { status: 400 }
      );
    }

    const readingId = randomUUID();

    // Insert new reading
    const result = await pool.query(
      `INSERT INTO bible_readings (
        id, "userId", "bibleBook", chapters, verses, "dateRead", completed, notes, "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      ) RETURNING *`,
      [
        readingId,
        payload.userId,
        bibleBook,
        chapters,
        verses || null,
        dateRead,
        true, // completed
        notes || null,
      ]
    );

    return NextResponse.json(
      {
        message: 'Reading added successfully',
        reading: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add reading error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
