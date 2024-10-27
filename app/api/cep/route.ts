import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const data = await prisma.zipCode.findMany()
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  try {
    const { address, number, code, name } = await request.json();

    if (!address || !number || !code || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newZipCode = await prisma.zipCode.create({
      data: {
        address,
        number,
        code,
        name,
      },
    });

    return NextResponse.json(newZipCode, {
      status: 201, headers: {
        Location: `/cep/${newZipCode.id}`
      }
    });
  } catch (error) {
    console.error('Error creating ZipCode:', error);
    return NextResponse.json({ error: 'Error creating ZipCode' }, { status: 500 });
  }
}
