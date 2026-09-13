import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const shop = await prisma.shop.findFirst({
    where: { 
      id,
      status: 'ACTIVE',
      whatsappCatalogEnabled: true,
      whatsappCatalogStatus: 'ACTIVE'
    },
  });

  if (!shop) {
    return NextResponse.json({ error: 'Catalog not found or disabled' }, { status: 404 });
  }

  const products = await prisma.product.findMany({
    where: { 
      shopId: id,
      isCatalogVisible: true 
    },
    orderBy: [
      { catalogSortOrder: 'asc' },
      { name_en: 'asc' }
    ]
  });

  return NextResponse.json({ shop, products });
}
