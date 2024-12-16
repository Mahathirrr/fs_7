import { z } from 'zod';

export const courseCreateSchema = z.object({
  title: z.string().min(10, "Judul minimal 10 karakter"),
  description: z.string().min(100, "Deskripsi minimal 100 karakter"),
  category: z.string(),
  level: z.enum(["Pemula", "Menengah", "Lanjutan"]),
  price: z.number().min(0),
  requirements: z.array(z.string()),
  outcomes: z.array(z.string()),
});

export const courseUpdateSchema = courseCreateSchema.partial();

export const sectionSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().optional(),
});

export const lessonSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  description: z.string().optional(),
  videoUrl: z.string().url().optional(),
  duration: z.number().optional(),
  isPublished: z.boolean().optional(),
});

export const discussionSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  content: z.string().min(10, "Konten minimal 10 karakter"),
  lessonId: z.string().optional(),
  isAnnouncement: z.boolean().optional(),
  isPinned: z.boolean().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Ulasan minimal 10 karakter"),
});