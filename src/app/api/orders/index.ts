import { NextResponse } from 'next/server';
import prisma from '@../../../lib/prisma';
import { z } from 'zod';

const workOrderSchema = z.object({
  quoteId: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  totalAmount: z.number(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { quoteId, startDate, endDate, totalAmount } = workOrderSchema.parse(body);

    const workOrder = await prisma.workOrder.create({
      data: {
        quoteId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalAmount,
      },
    });

    return NextResponse.json(workOrder, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 400 });
  }
}