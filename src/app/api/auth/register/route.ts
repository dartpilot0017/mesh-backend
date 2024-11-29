import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt'; // To hash the password
import prisma from '@../../../lib/prisma'; // Assuming prisma is set up
import { sign } from 'jsonwebtoken'; // Assuming you're using JWT for token generation

// Environment variable for JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use a strong secret in production

export async function POST(req: Request) {
  const { email, password, name, role } = await req.json();

  // Validate inputs
  if (!email || !password || !name || !role ) {
    return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
  }

  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json({ message: 'User already exists' }, { status: 400 });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Create a new user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
      },
    });

    // Generate JWT token
    const token = sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '1h' });

    // Send back the user data and token
    return NextResponse.json(
      { user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role }, token },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
