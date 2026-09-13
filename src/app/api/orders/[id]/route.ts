import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { processExpiredAdminOrders } from '@/lib/orderService';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await processExpiredAdminOrders();

    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params; // Note: Next.js 15+ needs await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        shop: { select: { name_en: true, name_hi: true, image: true, area: true, phone: true, ownerId: true } },
        orderItems: {
          include: {
            product: { select: { image: true } }
          }
        },
        delivery: {
          include: {
            deliveryBoy: { select: { name: true } } // only exposing name, not phone as per requirements
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Verify ownership
    if (session.role === 'ADMIN') {
      // Admins can view any order
    } else if (session.role === 'SHOPKEEPER') {
      if (order.shop.ownerId !== session.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    } else {
      if (order.customerId !== session.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Fetch order detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
