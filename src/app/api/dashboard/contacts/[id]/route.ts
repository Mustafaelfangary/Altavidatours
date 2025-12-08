import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { ContactStatus } from "@prisma/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'ADMIN') {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  try {
    const { status } = await request.json() as { status: ContactStatus };

    if (!status || !Object.values(ContactStatus).includes(status)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid status provided' }),
        { status: 400 }
      );
    }

    const message = await prisma.contact.update({
      where: { id },
      data: { status },
    });

    return new NextResponse(JSON.stringify(message));
  } catch (error) {
    console.error('Error updating contact status:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to update contact status' }),
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'ADMIN') {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  try {
    const message = await prisma.contact.findUnique({
      where: { id },
    });

    if (!message) {
      return new NextResponse(
        JSON.stringify({ error: 'Contact not found' }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(message));
  } catch (error) {
    console.error('Error fetching contact:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch contact' }),
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.contact.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    );
  }
}