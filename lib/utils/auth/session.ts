import { getServerSession } from "next-auth/next";
import { ApiError } from "../api/error-handler";

export async function requireAuth() {
  const session = await getServerSession();
  
  if (!session?.user) {
    throw new ApiError(401, "Unauthorized");
  }

  return session;
}

export async function requireInstructor() {
  const session = await requireAuth();
  
  if (session.user.role !== "instructor") {
    throw new ApiError(403, "Forbidden - Instructor access required");
  }

  return session;
}