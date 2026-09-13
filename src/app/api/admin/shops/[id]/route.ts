import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const updatedShop = await prisma.shop.update({
      where: { id },
      data: { status: body.status },
    });

    return NextResponse.json({ shop: updatedShop });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
