import { NextResponse } from 'next/server';
import prisma from "@../../../lib/prisma";
import bcrypt from 'bcrypt';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['client', 'contractor']),
});

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { email, password, role } = registerSchema.parse(body);

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await prisma.user.create({
//       data: { email, password: hashedPassword, role },
//     });

//     return NextResponse.json(user);
//   } catch (error) {
//     return NextResponse.json({ error: (error as Error).message }, { status: 400 });
//   }
// }

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, role, name } = registerSchema.parse(body);

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create user in database
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role, name },
    });

    return NextResponse.json(
      { user: { id: user.id, email: user.email, role: user.role, name: user.name } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
