import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || !session.id || session.role !== 'SHOPKEEPER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const shop = await prisma.shop.findUnique({ where: { ownerId: session.id } });
    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.shopId !== shop.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (order.status !== 'PENDING') {
      return NextResponse.json({ error: 'Order is not in pending state' }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: 'SHOPKEEPER_REJECTED' },
      include: {
        shop: { select: { name_en: true, name_hi: true, image: true, area: true, phone: true, ownerId: true } },
        orderItems: {
          include: {
            product: { select: { image: true } }
          }
        }
      }
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Reject order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
