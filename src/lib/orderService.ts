import { prisma } from '@/lib/prisma';
import { assignDeliveryBoy } from './deliveryService';

export const AUTO_APPROVAL_EXTRA_CHARGE = 20;

export async function processExpiredAdminOrders() {
  try {
    const now = new Date();
    
    // Find orders that are past their deadline
    const expiredOrders = await prisma.order.findMany({
      where: {
        status: 'ADMIN_PENDING',
        adminDeadline: {
          lte: now
        }
      }
    });

    for (const order of expiredOrders) {
      const finalPrice = order.cartValue + AUTO_APPROVAL_EXTRA_CHARGE;
      
      // Use updateMany for atomicity, ensuring status is still ADMIN_PENDING
      const result = await prisma.order.updateMany({
        where: {
          id: order.id,
          status: 'ADMIN_PENDING',
          adminDeadline: {
            lte: now
          }
        },
        data: {
          status: 'AUTO_APPROVED',
          finalPrice,
          approvalType: 'AUTO',
          approvedAt: new Date()
        }
      });

      if (result.count > 0) {
        // Automatically try to assign a delivery boy
        await assignDeliveryBoy(order.id);
      }
    }
  } catch (error) {
    console.error('Error processing expired admin orders:', error);
  }
}
