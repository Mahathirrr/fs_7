import { z } from "zod";

export const courseCreateSchema = z.object({
  title: z.string().min(10, "Judul minimal 10 karakter"),
  description: z.string().min(100, "Deskripsi minimal 100 karakter"),
  category: z.string(),
  level: z.enum(["Pemula", "Menengah", "Lanjutan"]),
  price: z.number().min(0),
  requirements: z.array(z.string()),
  outcomes: z.array(z.string()),
});

export const sectionCreateSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().optional(),
  position: z.number().optional(),
});

export const lessonCreateSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().optional(),
  videoUrl: z.string().url().optional(),
  duration: z.number().optional(),
  position: z.number().optional(),
  isPublished: z.boolean().optional(),
});