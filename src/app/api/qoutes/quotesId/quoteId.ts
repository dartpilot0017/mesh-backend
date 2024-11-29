import { NextResponse } from 'next/server';
import prisma from '@../../../lib/prisma';
import { z } from 'zod';

const updateQuoteSchema = z.object({
  status: z.enum(['pending', 'accepted', 'rejected']),
  additionalNotes: z.string().optional(),
});

export async function PUT(req: Request, { params }: { params: { quoteId: string } }) {
  try {
    const body = await req.json();
    const { status, additionalNotes } = updateQuoteSchema.parse(body);
    const quoteId = parseInt(params.quoteId);

    const quote = await prisma.quote.update({
      where: { id: quoteId },
      data: {
        status,
        additionalNotes: additionalNotes || '',
      },
    });

    return NextResponse.json(quote);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 400 });
  }
}