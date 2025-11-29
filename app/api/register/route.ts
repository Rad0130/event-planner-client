import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/types/auth';

// Simple in-memory storage for demo (will reset on server restart)
const users: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "123456",
    image: null,
    createdAt: new Date().toISOString(),
  },
];

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (users.find(user => user.email === email)) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Create new user (in production, hash the password!)
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production, use bcrypt to hash this!
      image: null, // ✅ ADD THIS LINE - missing image property
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: { id: newUser.id, name: newUser.name, email: newUser.email }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// For debugging - get all users (remove in production)
export async function GET() {
  return NextResponse.json({ users });
}