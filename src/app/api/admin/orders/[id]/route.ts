import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { processExpiredAdminOrders } from '@/lib/orderService';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await processExpiredAdminOrders();

    const session = await getSession();
    if (!session || !session.id || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        shop: { select: { name_en: true, name_hi: true, image: true, owner: { select: { name: true, phone: true } } } },
        customer: { select: { name: true, phone: true } },
        orderItems: {
          include: {
            product: { select: { image: true } }
          }
        },
        delivery: {
          include: {
            deliveryBoy: { select: { name: true, phone: true, location: true } }
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Fetch admin order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
