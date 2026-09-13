import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || !session.id || session.role !== 'DELIVERY') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        shop: { select: { name_en: true, name_hi: true, image: true, area: true, address: true, phone: true } },
        orderItems: {
          include: {
            product: { select: { image: true } }
          }
        },
        delivery: true
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Security: Only allow assigned delivery boy to view the details
    if (!order.delivery || order.delivery.deliveryBoyId !== session.id) {
      return NextResponse.json({ error: 'Unauthorized. You are not assigned to this delivery.' }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Fetch delivery order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
