import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function withAuth(
  request: NextRequest,
  handler: () => Promise<NextResponse>,
  options?: { requireInstructor?: boolean }
) {
  const token = await getToken({ req: request });

  if (!token) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (options?.requireInstructor && token.role !== "instructor") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return handler();
}