'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Search, UserPlus, Edit, Lock, Shield } from 'lucide-react';
import { User, Role } from "@prisma/client";

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'ALL'>('ALL');
  const router = useRouter();

  const handleFilterChange = (value: string) => {
    setRoleFilter(value as Role | 'ALL');
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast('Failed to load users. Please try again.', {
        style: { backgroundColor: 'red', color: 'white' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: User['role']) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error('Failed to update user role');

      toast('Success', {
        description: 'User role updated successfully.',
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, role: newRole }
            : user
        )
      );
    } catch (error) {
      toast('Failed to update user role. Please try again.', {
        style: { backgroundColor: 'red', color: 'white' }
      });
    }
  };

  const getRoleBadgeColor = (role: User['role']) => {
    const colors = {
      USER: 'bg-gray-100 text-gray-800',
      ADMIN: 'bg-red-100 text-red-800',
      MANAGER: 'bg-blue-100 text-blue-800',
      GUIDE: 'bg-green-100 text-green-800',
    };
    return colors[role];
  };

  const filteredUsers = users
    .filter(
      (user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    )
    .filter((user) =>
      roleFilter === 'ALL' ? true : user.role === roleFilter
    );

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="space-x-2">
                  <Skeleton className="h-9 w-20" />
                  <Skeleton className="h-9 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">User Management</h2>
        <Button onClick={() => router.push('/dashboard/users/new')}>
          <UserPlus className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select
              value={roleFilter}
              onValueChange={(value) => handleFilterChange(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="MANAGER">Manager</SelectItem>
                <SelectItem value="GUIDE">Guide</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{user.name || 'Unnamed User'}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{user.email}</span>
                    <span>Joined {format(new Date(user.createdAt), 'PP')}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    className={getRoleBadgeColor(user.role)}
                    variant="secondary"
                  >
                    {user.role}
                  </Badge>
                  {!user.emailVerified && (
                    <Badge variant="outline" className="text-yellow-600">
                      Unverified
                    </Badge>
                  )}
                  <Select
                    value={user.role}
                    onValueChange={(value) => handleRoleChange(user.id, value as User['role'])}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="GUIDE">Guide</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/users/${user.id}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/users/${user.id}/reset-password`)}
                  >
                    <Lock className="h-4 w-4" />
                  </Button>
                  {user.role !== 'ADMIN' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRoleChange(user.id, 'ADMIN')}
                    >
                      <Shield className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredUsers.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No users found matching your criteria.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserManagement;