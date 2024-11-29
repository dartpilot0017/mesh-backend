import { NextResponse } from 'next/server';
import prisma from "@../../../lib/prisma";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { email, password } = body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

      return NextResponse.json({ token });
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}