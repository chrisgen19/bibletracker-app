import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { UserRegistration } from '@/types/user';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body: UserRegistration = await request.json();
    const {
      email,
      password,
      firstName,
      lastName,
      gender,
      phoneNumber,
      dateOfBirth,
      country,
      city,
      address,
      postalCode,
    } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !gender) {
      return NextResponse.json(
        { error: 'Email, password, first name, last name, and gender are required' },
        { status: 400 }
      );
    }

    // Validate gender
    const validGenders = ['MALE', 'FEMALE', 'OTHER'];
    if (!validGenders.includes(gender)) {
      return NextResponse.json(
        { error: 'Invalid gender value' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate user ID
    const userId = randomUUID();

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users (
        id, email, password, "firstName", "lastName", gender,
        "phoneNumber", "dateOfBirth", country, city, address, "postalCode",
        "emailVerified", "phoneVerified", status, "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6::text::"Gender",
        $7, $8, $9, $10, $11, $12,
        false, false, 'PENDING_VERIFICATION'::text::"UserStatus", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      ) RETURNING id, email, "firstName", "lastName", gender, "phoneNumber", "dateOfBirth",
        country, city, address, "postalCode", "emailVerified", "phoneVerified", status, "createdAt"`,
      [
        userId,
        email.toLowerCase(),
        hashedPassword,
        firstName,
        lastName,
        gender,
        phoneNumber || null,
        dateOfBirth || null,
        country || null,
        city || null,
        address || null,
        postalCode || null,
      ]
    );

    const newUser = result.rows[0];

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
