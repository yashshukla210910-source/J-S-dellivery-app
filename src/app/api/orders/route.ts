import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { processExpiredAdminOrders } from '@/lib/orderService';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items, deliveryAddress, customerName, customerPhone } = body;

    if (!items || !items.length || !deliveryAddress || !customerName || !customerPhone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Group items by shopId
    const itemsByShop = items.reduce((acc: any, item: any) => {
      if (!acc[item.shopId]) acc[item.shopId] = [];
      acc[item.shopId].push(item);
      return acc;
    }, {});

    const shopIds = Object.keys(itemsByShop);
    
    // Verify all shops exist
    const shops = await prisma.shop.findMany({ where: { id: { in: shopIds } } });
    if (shops.length !== shopIds.length) {
      return NextResponse.json({ error: 'One or more shops not found' }, { status: 404 });
    }

    // Fetch product details to ensure prices and availability are accurate
    const productIds = items.map((i: any) => i.id);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isAvailable: true
      }
    });

    if (products.length !== items.length) {
      return NextResponse.json({ error: 'Some items are no longer available.' }, { status: 400 });
    }

    const createdOrders = await prisma.$transaction(async (tx) => {
      const orders = [];
      
      for (const shopId of shopIds) {
        const shopItems = itemsByShop[shopId];
        let cartValue = 0;
        
        const orderItemsData = shopItems.map((item: any) => {
          const product = products.find(p => p.id === item.id);
          if (!product) throw new Error("Product not found");
          
          const subtotal = product.price * item.quantity;
          cartValue += subtotal;

          return {
            productId: product.id,
            productName_en: product.name_en,
            productName_hi: product.name_hi,
            quantity: item.quantity,
            price: product.price,
            subtotal
          };
        });

        const deliveryFee = 20;
        const totalAmount = cartValue + deliveryFee;

        // Generate Order Number
        const dateStr = new Date().toISOString().slice(0, 7).replace('-', ''); // e.g., 202609
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const orderNumber = `LM-${dateStr}-${randomSuffix}`;

        const newOrder = await tx.order.create({
          data: {
            orderNumber,
            customerId: session.id,
            shopId,
            cartValue,
            deliveryFee,
            totalAmount,
            deliveryAddress,
            customerName,
            customerPhone,
            latitude: body.latitude || null,
            longitude: body.longitude || null,
            status: 'PENDING',
            paymentMethod: 'COD',
            orderItems: {
              create: orderItemsData
            }
          }
        });
        
        orders.push(newOrder);
      }
      return orders;
    });

    return NextResponse.json({ success: true, orders: createdOrders });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await processExpiredAdminOrders();

    const session = await getSession();
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { customerId: session.id },
      orderBy: { createdAt: 'desc' },
      include: {
        shop: { select: { name_en: true, name_hi: true, image: true } },
        orderItems: true
      }
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
