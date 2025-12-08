"use client";

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { AnimatedSection } from '@/components/ui/animated-section';
import EmailTemplatesManager from '@/components/admin/EmailTemplatesManager';
import { Settings, Mail } from 'lucide-react';

export default function EmailTemplatesPage() {
  const { data: session, status } = useSession();

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <Container className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-t-primary border-l-primary border-r-transparent border-b-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading email templates...</p>
        </div>
      </Container>
    );
  }

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/api/auth/signin');
  }

  // Redirect to admin dashboard if not an admin
  if (session.user.role !== 'ADMIN') {
    redirect('/admin');
  }

  return (
    <Container className="py-8 space-y-8">
      <AnimatedSection delay={0.1}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
            <p className="text-muted-foreground">
              Manage your email templates and notification settings
            </p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <Card className="overflow-hidden border border-border/50 shadow-sm">
          <CardHeader className="border-b bg-muted/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Email Templates</CardTitle>
                <CardDescription>
                  Create and manage email templates for various notifications and communications
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <EmailTemplatesManager />
          </CardContent>
        </Card>
      </AnimatedSection>
    </Container>
  );
}
