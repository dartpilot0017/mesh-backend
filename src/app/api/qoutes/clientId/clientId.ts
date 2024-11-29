import { NextResponse } from 'next/server';
import prisma from '@../../../lib/prisma';

export async function GET(req: Request, { params }: { params: { clientId: string } }) {
  try {
    const clientId = parseInt(params.clientId);
    const quotes = await prisma.quote.findMany({
      where: { clientId },
      include: { client: true },
    });

    return NextResponse.json(quotes);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    } else {
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 400 });
    }
  }
}