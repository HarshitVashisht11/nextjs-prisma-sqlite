import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET method to fetch all todos
export async function GET() {
  const todos = await prisma.todo.findMany();
  return NextResponse.json(todos);
}

// POST method to create a new todo
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

// DELETE method to delete a todo by id
export async function DELETE(req: Request) {
  const { id } = await req.json();
  
  if (!id || typeof id !== 'number') {
    return NextResponse.json(
      { error: 'Invalid input: "id" is required and must be a number.' },
      { status: 400 }
    );
  }

  try {
    const deletedTodo = await prisma.todo.delete({
      where: { id },
    });
    return NextResponse.json(deletedTodo);
  } catch (error) {
    return NextResponse.json(
      { error: 'Todo not found or could not be deleted.' },
      { status: 404 }
    );
  }
}
