import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || !session.id || session.role !== 'DELIVERY') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!['OUT_FOR_DELIVERY', 'DELIVERED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status update' }, { status: 400 });
    }

    // Verify ownership and current status
    const order = await prisma.order.findUnique({
      where: { id },
      include: { delivery: true }
    });

    if (!order || !order.delivery || order.delivery.deliveryBoyId !== session.id) {
      return NextResponse.json({ error: 'Unauthorized. You are not assigned to this delivery.' }, { status: 403 });
    }

    // Enforce correct state machine transitions
    if (status === 'OUT_FOR_DELIVERY' && order.status !== 'ASSIGNED') {
      return NextResponse.json({ error: 'Order must be ASSIGNED to start delivery.' }, { status: 400 });
    }

    if (status === 'DELIVERED' && order.status !== 'OUT_FOR_DELIVERY') {
      return NextResponse.json({ error: 'Order must be OUT_FOR_DELIVERY to mark as delivered.' }, { status: 400 });
    }

    // Update the order and assignment
    const result = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id },
        data: { status },
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

      await tx.deliveryAssignment.update({
        where: { orderId: id },
        data: { status: status === 'OUT_FOR_DELIVERY' ? 'PICKED_UP' : 'DELIVERED' }
      });

      // If delivered, decrease workload
      if (status === 'DELIVERED') {
        await tx.user.update({
          where: { id: session.id },
          data: { activeOrderCount: { decrement: 1 } }
        });
      }

      return updatedOrder;
    });

    return NextResponse.json({ success: true, order: result });
  } catch (error) {
    console.error('Update delivery status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
