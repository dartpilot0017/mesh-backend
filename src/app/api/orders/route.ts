import { NextResponse } from 'next/server';
import prisma from '@../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const { quoteId, clientId, status } = await req.json();

    const newOrder = await prisma.order.create({
      data: {
        quoteId,
        clientId,
        status,
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create work order' }, { status: 500 });
  }
}
