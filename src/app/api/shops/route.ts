import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const area = searchParams.get('area');

  const whereClause: any = {
    status: 'ACTIVE',
  };

  if (area) {
    whereClause.area = area;
  }

  const shops = await prisma.shop.findMany({
    where: whereClause,
  });

  return NextResponse.json({ shops });
}
