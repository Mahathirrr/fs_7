import { z } from "zod";

export const paymentCreateSchema = z.object({
  courseId: z.string(),
  amount: z.number().min(0),
  currency: z.string().default("IDR"),
  paymentMethod: z.enum(["credit_card", "bank_transfer", "e_wallet"]),
});

export const paymentCallbackSchema = z.object({
  orderId: z.string(),
  transactionStatus: z.enum([
    "pending",
    "success",
    "failed",
    "expired",
    "canceled"
  ]),
  paymentType: z.string(),
  fraudStatus: z.string().optional(),
});