import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.id || session.role !== 'DELIVERY') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Active Deliveries (ASSIGNED, OUT_FOR_DELIVERY)
    const activeOrders = await prisma.order.findMany({
      where: {
        delivery: {
          deliveryBoyId: session.id
        },
        status: {
          in: ['ASSIGNED', 'OUT_FOR_DELIVERY']
        }
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        shop: { select: { name_en: true, name_hi: true, area: true } },
        orderItems: true
      }
    });

    // Completed Deliveries
    const completedOrders = await prisma.order.findMany({
      where: {
        delivery: {
          deliveryBoyId: session.id
        },
        status: 'DELIVERED'
      },
      orderBy: { updatedAt: 'desc' },
      take: 20, // Limit to recent 20
      include: {
        shop: { select: { name_en: true, name_hi: true, area: true } },
        orderItems: true
      }
    });

    // Stats
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { availability: true, name: true, activeOrderCount: true }
    });

    const stats = {
      assignedToday: await prisma.deliveryAssignment.count({
        where: {
          deliveryBoyId: session.id,
          assignedAt: { gte: new Date(new Date().setHours(0,0,0,0)) }
        }
      }),
      deliveredToday: await prisma.order.count({
        where: {
          delivery: { deliveryBoyId: session.id },
          status: 'DELIVERED',
          updatedAt: { gte: new Date(new Date().setHours(0,0,0,0)) } // roughly delivered today
        }
      }),
      activeOrders: activeOrders.length,
      availability: user?.availability,
      name: user?.name,
      activeOrderCount: user?.activeOrderCount
    };

    return NextResponse.json({ activeOrders, completedOrders, stats });
  } catch (error) {
    console.error('Fetch delivery orders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
