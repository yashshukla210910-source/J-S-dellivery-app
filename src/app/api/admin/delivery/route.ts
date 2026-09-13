import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.id || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deliveryBoys = await prisma.user.findMany({
      where: { role: 'DELIVERY' },
      select: {
        id: true,
        name: true,
        phone: true,
        location: true,
        availability: true,
        activeOrderCount: true,
        deliveries: {
          where: {
            status: 'DELIVERED',
            order: {
              updatedAt: { gte: new Date(new Date().setHours(0,0,0,0)) }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    const formatted = deliveryBoys.map(db => ({
      ...db,
      completedToday: db.deliveries.length
    }));

    return NextResponse.json({ deliveryBoys: formatted });
  } catch (error) {
    console.error('Fetch admin delivery error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
