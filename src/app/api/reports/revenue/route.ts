import { NextResponse } from 'next/server';
import prisma from '@../../../lib/prisma';

export async function GET(req: Request) {
  try {
    const revenueReport = await prisma.order.aggregate({
      _sum: {
        quoteAmount: true,
      },
    });

    return NextResponse.json(revenueReport);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate revenue report' }, { status: 500 });
  }
}
