import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('POST /api/zipcodes', () => {
  afterAll(async () => {
    await prisma.zipCode.deleteMany();
    await prisma.$disconnect();
  });

  it('should create a new ZipCode', async () => {
    const body = {
      address: 'Test St',
      code: '12345-123',
      name: 'Test Building',
    };

    const response = await fetch('http://localhost:3000/api/cep', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const jsonResponse = await response.json();

    expect(response.status).toBe(201);
    expect(jsonResponse.address).toBe(body.address);
    expect(jsonResponse.code).toBe(body.code);
    expect(jsonResponse.name).toBe(body.name);

    const zipCodeInDb = await prisma.zipCode.findUnique({
      where: { id: jsonResponse.id },
    });
    expect(zipCodeInDb).not.toBeNull();
    expect(zipCodeInDb?.address).toBe(body.address);
  });

  it('should return 400 if required fields are missing', async () => {
    const body = {
      address: 'Missing Fields St',
    };

    const response = await fetch('http://localhost:3000/api/cep', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const jsonResponse = await response.json();

    expect(response.status).toBe(400);
    expect(jsonResponse.error).toBe('Missing required fields');
  });
});
