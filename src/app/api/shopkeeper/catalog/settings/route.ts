import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.id || session.role !== 'SHOPKEEPER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const shop = await prisma.shop.findUnique({
      where: { ownerId: session.id },
      select: {
        id: true,
        whatsappNumber: true,
        whatsappCatalogEnabled: true,
        whatsappCatalogTitle: true,
        whatsappCatalogDescription: true,
        whatsappCatalogBanner: true,
        whatsappCatalogStatus: true,
        whatsappCatalogVerified: true
      }
    });

    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    return NextResponse.json({ settings: shop });
  } catch (error) {
    console.error('Fetch catalog settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.id || session.role !== 'SHOPKEEPER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate phone if provided (basic Indian +91 format or 10 digits)
    if (data.whatsappNumber) {
      const num = data.whatsappNumber.replace(/[^0-9+]/g, '');
      if (num.length < 10) {
        return NextResponse.json({ error: 'Invalid WhatsApp number format' }, { status: 400 });
      }
      data.whatsappNumber = num;
    }

    const updatedShop = await prisma.shop.update({
      where: { ownerId: session.id },
      data: {
        whatsappNumber: data.whatsappNumber !== undefined ? data.whatsappNumber : undefined,
        whatsappCatalogEnabled: data.whatsappCatalogEnabled !== undefined ? data.whatsappCatalogEnabled : undefined,
        whatsappCatalogTitle: data.whatsappCatalogTitle !== undefined ? data.whatsappCatalogTitle : undefined,
        whatsappCatalogDescription: data.whatsappCatalogDescription !== undefined ? data.whatsappCatalogDescription : undefined,
        whatsappCatalogBanner: data.whatsappCatalogBanner !== undefined ? data.whatsappCatalogBanner : undefined,
      }
    });

    return NextResponse.json({ success: true, settings: updatedShop });
  } catch (error) {
    console.error('Update catalog settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
