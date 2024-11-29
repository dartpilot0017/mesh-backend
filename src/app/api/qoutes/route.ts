// import { NextResponse } from 'next/server';
// import prisma from '@../../../lib/prisma';

// // POST /api/quotes
// export async function POST(req: Request) {
//   const { clientId, propertyDetails, quoteAmount, status } = await req.json();
//   const newQuote = await prisma.quote.create({
//     data: {
//       clientId,
//       propertyDetails,
//       quoteAmount,
//       status,
//     },
//   });
//   return NextResponse.json(newQuote);
// }

// // GET /api/quotes/:clientId
// export async function GET(req: Request) {
//   const clientId = req.url.split('/').pop(); // Get clientId from URL
//   if (!clientId) {
//     return NextResponse.json({ error: 'Client ID not provided' }, { status: 400 });
//   }
//   const quotes = await prisma.quote.findMany({
//     where: { clientId },
//   });
//   return NextResponse.json(quotes);
// }



import { NextResponse } from 'next/server';
import prisma from '@../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const { clientId, propertyDetails, quoteAmount, status } = await req.json();

    const newQuote = await prisma.quote.create({
      data: {
        clientId,
        propertyDetails,
        quoteAmount,
        status,
      },
    });

    return NextResponse.json(newQuote, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 });
  }
}
