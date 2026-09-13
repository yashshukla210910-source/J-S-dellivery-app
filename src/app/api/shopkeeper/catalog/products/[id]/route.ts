import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || !session.id || session.role !== 'SHOPKEEPER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    // Verify ownership
    const product = await prisma.product.findUnique({
      where: { id },
      include: { shop: true }
    });

    if (!product || product.shop.ownerId !== session.id) {
      return NextResponse.json({ error: 'Product not found or unauthorized' }, { status: 403 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        isCatalogVisible: data.isCatalogVisible !== undefined ? data.isCatalogVisible : undefined,
        catalogSortOrder: data.catalogSortOrder !== undefined ? data.catalogSortOrder : undefined
      }
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Update catalog product error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
