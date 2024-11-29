import { NextResponse } from 'next/server';
import prisma from '@../../../lib/prisma';

export async function GET(req: Request, { params }: { params: { contractorId: string } }) {
  const url = new URL(req.url);
  const contractorId = params.contractorId;
  const startDate = url.searchParams.get('startDate');
  const endDate = url.searchParams.get('endDate');

  try {
    const revenue = await prisma.workOrder.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        quote: {
          clientId: parseInt(contractorId),
        },
        startDate: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
    });

    return NextResponse.json({
      contractorId,
      totalRevenue: revenue._sum.totalAmount || 0,
      startDate,
      endDate,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 400 });
  }
}