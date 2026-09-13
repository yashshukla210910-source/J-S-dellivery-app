import { prisma } from '@/lib/prisma';

export async function assignDeliveryBoy(orderId: string) {
  try {
    // We use a transaction to avoid race conditions.
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { shop: true }
      });

      if (!order) throw new Error('Order not found');
      if (order.status !== 'ADMIN_APPROVED' && order.status !== 'AUTO_APPROVED' && order.status !== 'READY_FOR_DELIVERY') {
        throw new Error(`Order status ${order.status} is not eligible for delivery assignment.`);
      }

      // Check if it's already assigned
      const existingAssignment = await tx.deliveryAssignment.findUnique({
        where: { orderId }
      });
      if (existingAssignment) {
        throw new Error('Order is already assigned to a delivery boy.');
      }

      // Find eligible delivery boys
      // Rules:
      // 1. role = DELIVERY
      // 2. availability = AVAILABLE
      // 3. activeOrderCount < 5 (capacity limit)
      // Preference: matching location, then fewest active orders.
      const eligibleDeliveryBoys = await tx.user.findMany({
        where: {
          role: 'DELIVERY',
          availability: 'AVAILABLE',
          activeOrderCount: { lt: 5 }
        },
        orderBy: {
          activeOrderCount: 'asc'
        }
      });

      if (eligibleDeliveryBoys.length === 0) {
        // No delivery boys available. We'll set it to READY_FOR_DELIVERY if it isn't already.
        if (order.status !== 'READY_FOR_DELIVERY') {
          const updatedOrder = await tx.order.update({
            where: { id: orderId },
            data: { status: 'READY_FOR_DELIVERY' }
          });
          return { success: false, reason: 'No delivery boys available', order: updatedOrder };
        }
        return { success: false, reason: 'No delivery boys available', order };
      }

      // Find preferred match
      const orderArea = order.shop.area;
      let selectedDeliveryBoy = eligibleDeliveryBoys.find(db => db.location === orderArea);

      // Fallback if no one in the same area
      if (!selectedDeliveryBoy) {
        selectedDeliveryBoy = eligibleDeliveryBoys[0];
      }

      // Assign the order
      const assignment = await tx.deliveryAssignment.create({
        data: {
          orderId: order.id,
          deliveryBoyId: selectedDeliveryBoy.id,
          status: 'ASSIGNED'
        }
      });

      // Update Order Status
      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: { status: 'ASSIGNED' }
      });

      // Update Delivery Boy Workload
      await tx.user.update({
        where: { id: selectedDeliveryBoy.id },
        data: { activeOrderCount: { increment: 1 } }
      });

      return { success: true, assignment, order: updatedOrder, deliveryBoy: selectedDeliveryBoy };
    });

    return result;
  } catch (error) {
    console.error(`Failed to assign delivery boy for order ${orderId}:`, error);
    return { success: false, error };
  }
}
