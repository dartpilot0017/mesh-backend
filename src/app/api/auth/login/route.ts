import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt'; // To compare the password
import prisma from '@../../../lib/prisma'; // Assuming prisma is set up
import { sign } from 'jsonwebtoken'; // Assuming you're using JWT for token generation

// Environment variable for JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use a strong secret in production

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Validate inputs
  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
  }

  // Check if the user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  // Compare the password with the hashed password in the database
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
  }

  // Generate JWT token
  const token = sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

  // Send back the user data and token
  return NextResponse.json(
    { user: { id: user.id, email: user.email, name: user.name }, token },
    { status: 200 }
  );
}
