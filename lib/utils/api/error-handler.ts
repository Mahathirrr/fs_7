import { NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function handleApiError(error: unknown) {
  console.error("API Error:", error);

  if (error instanceof ApiError) {
    return new NextResponse(error.message, { status: error.statusCode });
  }

  if (error instanceof Error) {
    return new NextResponse(error.message, { status: 400 });
  }

  return new NextResponse("Internal Server Error", { status: 500 });
}