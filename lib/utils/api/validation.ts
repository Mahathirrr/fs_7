import { NextResponse } from "next/server";
import { ZodSchema } from "zod";

export async function validateRequest<T>(
  schema: ZodSchema,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; response: NextResponse }> {
  try {
    const validated = await schema.parseAsync(data);
    return { success: true, data: validated as T };
  } catch (error) {
    return {
      success: false,
      response: new NextResponse("Validation Error", { status: 400 }),
    };
  }
}