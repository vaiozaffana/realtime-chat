import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, userIds, createdBy } = body;

    if (!name || !userIds || !Array.isArray(userIds) || userIds.length === 0 || !createdBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const room = await prisma.room.create({
      data: {
        name,
        isPrivate: true,
        createdBy,
        users: {
          connect: userIds.map((id: string) => ({ id })),
        },
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, message: "Room created successfully", room },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}