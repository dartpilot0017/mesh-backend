import { NextResponse } from 'next/server';
import prisma from '@../../../lib/prisma';

export async function GET(req: Request, { params }: { params: { quoteId: string } }) {
    const { quoteId } = params;
  
  try {
    const { status, quoteAmount } = await req.json();

    const updatedQuote = await prisma.quote.update({
      where: { id: quoteId },
      data: { status, quoteAmount },
    });

    return NextResponse.json(updatedQuote);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 });
  }
}
