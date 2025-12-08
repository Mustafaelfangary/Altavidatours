"use client";
export const dynamic = "force-dynamic";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ContactStatus } from "@prisma/client";
import { useState, useEffect } from "react";

export default function ContactsPage() {
  const { data: session } = useSession();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user || session.user.role !== 'ADMIN') {
      redirect('/auth/signin');
    }

    // Fetch contacts
    fetch('/api/contacts')
      .then(res => res.json())
      .then(data => {
        setContacts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching contacts:', error);
        setLoading(false);
      });
  }, [session]);

  const handleViewMessage = async (id: string) => {
    // TODO: Implement message viewing logic
    console.log('View message:', id);
  };

  const handleUpdateStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: ContactStatus.READ })
      });
      
      if (response.ok) {
        // Refresh contacts
        const updatedContacts = await fetch('/api/contacts').then(res => res.json());
        setContacts(updatedContacts);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  const columns = [
    {
      accessorKey: 'name' as const,
      header: 'Name',
    },
    {
      accessorKey: 'email' as const,
      header: 'Email',
    },
    {
      accessorKey: 'subject' as const,
      header: 'Subject',
    },
    {
      accessorKey: 'status' as const,
      header: 'Status',
      cell: ({ row }: { row: any }) => (
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(row.original.status)}`}>
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt' as const,
      header: 'Date',
      cell: ({ row }: { row: any }) => formatDate(row.original.createdAt),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: any }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewMessage(row.original.id)}
          >
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUpdateStatus(row.original.id)}
          >
            Mark as Read
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Contact Messages</h1>
      <DataTable
        columns={columns}
        data={contacts}
      />
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