import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.id || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const catalogs = await prisma.shop.findMany({
      select: {
        id: true,
        name_en: true,
        name_hi: true,
        area: true,
        status: true,
        whatsappNumber: true,
        whatsappCatalogEnabled: true,
        whatsappCatalogStatus: true,
        whatsappCatalogVerified: true,
        owner: { select: { name: true, phone: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ catalogs });
  } catch (error) {
    console.error('Fetch admin catalogs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
