import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.id || session.role !== 'DELIVERY') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { availability } = await request.json();

    if (!['AVAILABLE', 'OFFLINE', 'BUSY'].includes(availability)) {
      return NextResponse.json({ error: 'Invalid availability status' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: session.id },
      data: { availability },
      select: { availability: true }
    });

    return NextResponse.json({ success: true, availability: user.availability });
  } catch (error) {
    console.error('Update availability error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
