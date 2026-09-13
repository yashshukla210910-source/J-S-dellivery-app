import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || !session.id || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    const shop = await prisma.shop.update({
      where: { id },
      data: {
        whatsappCatalogStatus: data.whatsappCatalogStatus !== undefined ? data.whatsappCatalogStatus : undefined,
        whatsappCatalogVerified: data.whatsappCatalogVerified !== undefined ? data.whatsappCatalogVerified : undefined
      }
    });

    return NextResponse.json({ success: true, shop });
  } catch (error) {
    console.error('Update catalog status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
