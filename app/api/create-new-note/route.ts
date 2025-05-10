import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const { id } = await prisma.note.create({
      data: {
        authorId: userId,
        text: "",
      },
    });

    return NextResponse.json({ noteId: id });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create note",
      },
      { status: 500 }
    );
  }
}
