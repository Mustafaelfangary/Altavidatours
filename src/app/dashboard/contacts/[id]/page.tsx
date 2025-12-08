import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { ContactStatus } from "@prisma/client";

interface ContactDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ContactDetailsPage({ params }: ContactDetailsPageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  const contact = await prisma.contact.findUnique({
    where: { id },
  });

  if (!contact) {
    notFound();
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contact Message Details</h1>
        <Link href="/dashboard/contacts">
          <Button variant="outline">Back to Messages</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Message from {contact.name}</CardTitle>
          <div className="text-sm text-gray-500">
            Received on {formatDate(contact.createdAt)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <span className="ml-2">{contact.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2">{contact.email}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold">Subject</h3>
              <p className="mt-1">{contact.subject}</p>
            </div>

            <div>
              <h3 className="font-semibold">Message</h3>
              <p className="mt-1 whitespace-pre-wrap">{contact.message}</p>
            </div>

            <div>
              <h3 className="font-semibold">Status</h3>
              <div className="mt-1">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(contact.status as ContactStatus)}`}>
                  {contact.status}
                </span>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                onClick={() => updateStatus(contact.id, ContactStatus.READ)}
                variant="outline"
                disabled={contact.status === ContactStatus.READ}
              >
                Mark as Read
              </Button>
              <Button
                onClick={() => updateStatus(contact.id, ContactStatus.ARCHIVED)}
                variant="outline"
                disabled={contact.status === ContactStatus.ARCHIVED}
              >
                Archive
              </Button>
              <Link href={`mailto:${contact.email}`}>
                <Button>
                  Reply via Email
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getStatusColor(status: ContactStatus) {
  switch (status) {
    case ContactStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800';
    case ContactStatus.READ:
      return 'bg-blue-100 text-blue-800';
    case ContactStatus.REPLIED:
      return 'bg-green-100 text-green-800';
    case ContactStatus.ARCHIVED:
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

async function updateStatus(id: string, status: ContactStatus) {
  'use server';
  
  await prisma.contact.update({
    where: { id },
    data: { status },
  });
}