import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { faqSchema } from "@/lib/validations/faq";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const faqs = await prisma.faq.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(faqs);
  } catch (error) {
    console.error('[FAQS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await req.json();
    const body = faqSchema.parse(json);

    const faq = await prisma.faq.create({
      data: {
        question: body.question,
        answer: body.answer,
        order: body.order,
      },
    });

    return NextResponse.json(faq);
  } catch (error) {
    console.error('[FAQS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}