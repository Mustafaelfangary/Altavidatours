import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const policySchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export async function GET() {
  try {
    const policies = await prisma.policy.findMany();
    return NextResponse.json(policies);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content } = policySchema.parse(body);

    const policy = await prisma.policy.create({
      data: {
        title,
        description: content,
        cruiseId: "clxmc5k2r000008l45j2g78n2",
        type: "CANCELLATION",
      },
    });

    return NextResponse.json(policy);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}