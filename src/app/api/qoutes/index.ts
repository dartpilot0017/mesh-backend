import { NextResponse } from "next/server";
import prisma from "@@../../../lib/prisma";
import { z } from "zod";

const quoteSchema = z.object({
  clientId: z.number(),
  propertyDetails: z.string(),
  additionalNotes: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { clientId, propertyDetails, additionalNotes } =
      quoteSchema.parse(body);

    const quote = await prisma.quote.create({
      data: {
        clientId,
        propertyDetails,
        additionalNotes: additionalNotes || "",
      },
    });

    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    } else if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "An unknown error occured" },
      { status: 400 }
    );
  }
}

// catch (error) {
//     if (error instanceof Error) {
//       return NextResponse.json({ error: error.message }, { status: 400 });
//     }
//     return NextResponse.json({ error: 'An unknown error occurred' }, { status: 400 });
//   }
// }
