import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { processExpiredAdminOrders } from '@/lib/orderService';
import { assignDeliveryBoy } from '@/lib/deliveryService';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Process expired orders FIRST to prevent race condition approvals
    await processExpiredAdminOrders();

    const session = await getSession();
    if (!session || !session.id || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { finalPrice } = body;

    if (finalPrice === undefined || finalPrice === null || isNaN(Number(finalPrice)) || Number(finalPrice) <= 0) {
      return NextResponse.json({ error: 'Invalid final price' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id } });
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status !== 'ADMIN_PENDING') {
      return NextResponse.json({ error: 'Order is not in pending state or has already been approved' }, { status: 400 });
    }

    // Atomic update
    const updatedOrder = await prisma.order.update({
      where: { 
        id,
        status: 'ADMIN_PENDING',
        adminDeadline: { gt: new Date() } // double check it hasn't expired yet
      },
      data: { 
        status: 'ADMIN_APPROVED',
        finalPrice: Number(finalPrice),
        approvedBy: session.id,
        approvedAt: new Date(),
        approvalType: 'MANUAL'
      },
      include: {
        shop: { select: { name_en: true, name_hi: true, image: true, owner: { select: { name: true, phone: true } } } },
        customer: { select: { name: true, phone: true } },
        orderItems: {
          include: {
            product: { select: { image: true } }
          }
        }
      }
    });

    // Trigger delivery assignment in background
    assignDeliveryBoy(updatedOrder.id).catch(err => {
      console.error('Failed to auto-assign delivery after manual admin approval:', err);
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    if (error.code === 'P2025') {
       // Prisma RecordNotFound error means the 'where' clause failed (e.g. it's expired or already approved)
       return NextResponse.json({ error: 'Order approval failed. It may have been auto-approved or already processed.' }, { status: 400 });
    }
    console.error('Approve order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
