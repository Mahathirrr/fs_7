import { NextResponse } from "next/server";
import { handleApiError } from "./error-handler";

type ApiHandler = () => Promise<NextResponse>;

export async function withApiMiddleware(handler: ApiHandler): Promise<NextResponse> {
  try {
    return await handler();
  } catch (error) {
    return handleApiError(error);
  }
}