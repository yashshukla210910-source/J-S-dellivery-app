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

  return NextResponse.json({ shop });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'SHOPKEEPER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Ensure the shopkeeper doesn't already have a shop
    const existing = await prisma.shop.findUnique({ where: { ownerId: session.id as string }});
    if (existing) {
      return NextResponse.json({ error: 'Shop already exists' }, { status: 400 });
    }

    const shop = await prisma.shop.create({
      data: {
        ownerId: session.id as string,
        name_en: body.name_en,
        name_hi: body.name_hi,
        description_en: body.description_en,
        description_hi: body.description_hi,
        phone: body.phone,
        area: body.area,
        address: body.address,
        image: body.image,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ shop });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'SHOPKEEPER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    const shop = await prisma.shop.update({
      where: { ownerId: session.id as string },
      data: {
        name_en: body.name_en,
        name_hi: body.name_hi,
        description_en: body.description_en,
        description_hi: body.description_hi,
        phone: body.phone,
        area: body.area,
        address: body.address,
        image: body.image,
      },
    });

    return NextResponse.json({ shop });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
