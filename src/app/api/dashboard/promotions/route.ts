import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const promotionSchema = z.object({
  description: z.string().min(1, "Description is required"),
  code: z.string().min(1, "Code is required"),
  discountPercentage: z.number().min(0, "Discount must be a positive number"),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export async function GET() {
  try {
    const promotions = await prisma.promotion.findMany();
    return NextResponse.json(promotions);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      description,
      code,
      discountPercentage,
      startDate,
      endDate,
    } = promotionSchema.parse(body);

    const promotion = await prisma.promotion.create({
      data: {
        description,
        code,
        discountPercentage,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    return NextResponse.json(promotion);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

