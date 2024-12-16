import { NextResponse } from "next/server";

export async function handleApiError(error: unknown) {
  console.error("API Error:", error);

  if (error instanceof Error) {
    return new NextResponse(error.message, { status: 400 });
  }

  return new NextResponse("Internal Server Error", { status: 500 });
}

export function validateRequestBody<T>(
  schema: { parse: (data: unknown) => T },
  data: unknown
): T | NextResponse {
  try {
    return schema.parse(data);
  } catch (error) {
    return new NextResponse("Invalid request body", { status: 400 });
  }
}

export async function withErrorHandling(
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    return await handler();
  } catch (error) {
    return handleApiError(error);
  }
}