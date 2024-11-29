import { NextResponse } from 'next/server';
import prisma from '@../../../lib/prisma';

// export async function GET(req: Request) {
//   const clientId = req.url.split('/').pop()!;
  
//   try {
//     const quotes = await prisma.quote.findMany({
//       where: { clientId },
//     });

//     if (!quotes.length) {
//       return NextResponse.json({ message: 'No quotes found for this client' }, { status: 404 });
//     }

//     return NextResponse.json(quotes);
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
//   }
// }


export async function GET(req: Request, { params }: { params: { clientId: string } }) {
  const { clientId } = params;

  try {
    const quotes = await prisma.quote.findMany({
      where: { clientId },
    });

    return NextResponse.json(quotes);
  } catch (error) {
    return NextResponse.error();
  }
}
