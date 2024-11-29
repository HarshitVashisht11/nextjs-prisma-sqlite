import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const todos = await prisma.todo.findMany();
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  const data = await req.json();
  
  if (!data.title || typeof data.title !== 'string') {
    return NextResponse.json(
      { error: 'Invalid input: "title" is required and must be a string.' },
      { status: 400 }
    );
  }

  const todo = await prisma.todo.create({
    data: { title: data.title },
  });

  return NextResponse.json(todo, { status: 201 });
}