import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { processExpiredAdminOrders } from '@/lib/orderService';

export async function GET(request: Request) {
  try {
    await processExpiredAdminOrders();

    const session = await getSession();
    if (!session || !session.id || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pendingOrders = await prisma.order.findMany({
      where: { status: 'ADMIN_PENDING' },
      orderBy: { adminDeadline: 'asc' },
      include: {
        shop: { select: { name_en: true, name_hi: true } },
        customer: { select: { name: true, phone: true } },
        orderItems: true
      }
    });

    const stats = {
      pending: pendingOrders.length,
      approvedToday: await prisma.order.count({
        where: {
          status: 'ADMIN_APPROVED',
          approvedAt: { gte: new Date(new Date().setHours(0,0,0,0)) }
        }
      }),
      autoApproved: await prisma.order.count({
        where: { status: 'AUTO_APPROVED' }
      }),
      total: await prisma.order.count()
    };

    return NextResponse.json({ orders: pendingOrders, stats });
  } catch (error) {
    console.error('Fetch admin pending orders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
