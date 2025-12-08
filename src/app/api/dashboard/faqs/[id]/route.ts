import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { faqSchema } from "@/lib/validations/faq";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const faq = await prisma.faq.findUnique({
      where: {
        id,
      },
    });

    if (!faq) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(faq);
  } catch (error) {
    console.error("[FAQ_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = faqSchema.parse(json);

    const faq = await prisma.faq.update({
      where: {
        id,
      },
      data: {
        question: body.question,
        answer: body.answer,
        order: body.order,
      },
    });

    return NextResponse.json(faq);
  } catch (error) {
    console.error("[FAQ_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.faq.delete({
      where: {
        id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[FAQ_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}