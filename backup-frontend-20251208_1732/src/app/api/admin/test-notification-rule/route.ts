import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { ruleId } = body as { ruleId?: string };

    if (!ruleId) {
      return NextResponse.json({ error: 'ruleId is required' }, { status: 400 });
    }

    // Simulate sending a test notification. In production, integrate with your notification service.
    const simulated = {
      ruleId,
      sentAt: new Date().toISOString(),
      recipients: ['admins'],
      status: 'queued'
    };

    return NextResponse.json({ success: true, result: simulated });
  } catch (error) {
    console.error('Error testing notification rule:', error);
    return NextResponse.json({ error: 'Failed to send test notification' }, { status: 500 });
  }
}
