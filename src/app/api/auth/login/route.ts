import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { UserLogin } from '@/types/user';
import { createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body: UserLogin & { rememberMe?: boolean } = await request.json();
    const { email, password, rememberMe = false } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Update last login
    await pool.query(
      'UPDATE users SET "lastLoginAt" = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Create JWT token
    const token = await createToken(user.id, user.email);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Create response with token in cookie
    const response = NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
    });

    // Set HTTP-only cookie with different expiration based on rememberMe
    // Remember me: 30 days, otherwise: 1 day
    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
