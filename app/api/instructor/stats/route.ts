import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { UserService } from "@/lib/services/user.service";

export async function GET() {
  const session = await getServerSession();
  
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const stats = await UserService.getInstructorStats(session.user.id);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching instructor stats:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}