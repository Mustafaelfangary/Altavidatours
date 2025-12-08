"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const userFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  role: z.enum(['ADMIN', 'USER', 'EDITOR'], {
    required_error: 'Please select a role.',
  }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }).optional().or(z.literal('')),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  initialData?: {
    id?: string;
    name: string;
    email: string;
    role: string;
  } | null;
  onSubmit: (data: Omit<UserFormValues, 'password'> & { password?: string }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UserForm({ initialData, onSubmit, onCancel, isLoading }: UserFormProps) {
  const isEditMode = !!initialData?.id;
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      email: initialData.email,
      role: initialData.role as 'ADMIN' | 'USER' | 'EDITOR',
      password: '',
    } : {
      name: '',
      email: '',
      role: 'USER',
      password: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const role = watch('role');

  const handleFormSubmit = async (data: UserFormValues) => {
    try {
      // Only include password if it's provided (for edit mode) or if it's a new user
      const submitData = { ...data };
      if (!submitData.password && !isEditMode) {
        delete submitData.password;
      } else if (submitData.password === '') {
        delete submitData.password;
      }
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            {...register('name')}
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-sm font-medium text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            {...register('email')}
            disabled={isLoading || isEditMode}
          />
          {errors.email && (
            <p className="text-sm font-medium text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            value={role}
            onValueChange={(value) => setValue('role', value as 'ADMIN' | 'USER' | 'EDITOR')}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="EDITOR">Editor</SelectItem>
              <SelectItem value="USER">User</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-sm font-medium text-destructive">
              {errors.role.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">
              {isEditMode ? 'New Password' : 'Password'}
            </Label>
            {isEditMode && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs h-6 px-2"
              >
                {showPassword ? 'Hide' : 'Change'}
              </Button>
            )}
          </div>
          
          {(showPassword || !isEditMode) && (
            <>
              <Input
                id="password"
                type="password"
                placeholder={isEditMode ? 'Leave blank to keep current password' : '••••••••'}
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm font-medium text-destructive">
                  {errors.password.message}
                </p>
              )}
              {isEditMode && (
                <p className="text-xs text-muted-foreground">
                  Leave blank to keep current password
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditMode ? 'Save Changes' : 'Create User'}
        </Button>
      </div>
    </form>
  );
}
