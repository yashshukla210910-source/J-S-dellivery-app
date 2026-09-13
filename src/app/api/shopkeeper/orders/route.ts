import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { processExpiredAdminOrders } from '@/lib/orderService';

export async function GET(request: Request) {
  try {
    await processExpiredAdminOrders();

    const session = await getSession();
    if (!session || !session.id || session.role !== 'SHOPKEEPER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const shop = await prisma.shop.findUnique({ where: { ownerId: session.id } });
    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    const orders = await prisma.order.findMany({
      where: { shopId: shop.id },
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: true
      }
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Fetch shopkeeper orders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
