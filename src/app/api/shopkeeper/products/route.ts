import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'SHOPKEEPER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const shop = await prisma.shop.findUnique({
    where: { ownerId: session.id as string },
  });

  if (!shop) {
    return NextResponse.json({ products: [] });
  }

  const products = await prisma.product.findMany({
    where: { shopId: shop.id },
  });

  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'SHOPKEEPER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const shop = await prisma.shop.findUnique({
      where: { ownerId: session.id as string },
    });

    if (!shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    const body = await request.json();
    
    const product = await prisma.product.create({
      data: {
        shopId: shop.id,
        name_en: body.name_en,
        name_hi: body.name_hi,
        description_en: body.description_en,
        description_hi: body.description_hi,
        price: parseFloat(body.price),
        category: body.category,
        image: body.image,
        isAvailable: body.isAvailable ?? true,
      },
    });

    return NextResponse.json({ product });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
