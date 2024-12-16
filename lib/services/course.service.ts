import prisma from '@/lib/prisma';
import { Course, Section, Lesson } from '@prisma/client';

export class CourseService {
  static async getCourses(params: {
    category?: string;
    level?: string;
    instructorId?: string;
    published?: boolean;
  }) {
    const { category, level, instructorId, published } = params;

    const where = {
      ...(category && { category }),
      ...(level && { level }),
      ...(instructorId && { instructorId }),
      ...(published && { status: 'published' }),
    };

    return prisma.course.findMany({
      where,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        sections: {
          include: {
            lessons: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });
  }

  static async getCourseById(courseId: string) {
    return prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
          },
        },
        sections: {
          include: {
            lessons: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });
  }

  static async createCourse(data: Partial<Course>) {
    return prisma.course.create({
      data: {
        ...data,
        requirements: data.requirements || [],
        outcomes: data.outcomes || [],
      },
    });
  }

  static async updateCourse(courseId: string, data: Partial<Course>) {
    return prisma.course.update({
      where: { id: courseId },
      data,
    });
  }

  static async addSection(courseId: string, data: Partial<Section>) {
    const lastSection = await prisma.section.findFirst({
      where: { courseId },
      orderBy: { position: 'desc' },
    });

    const position = lastSection ? lastSection.position + 1 : 0;

    return prisma.section.create({
      data: {
        ...data,
        courseId,
        position,
      },
    });
  }

  static async addLesson(sectionId: string, data: Partial<Lesson>) {
    const lastLesson = await prisma.lesson.findFirst({
      where: { sectionId },
      orderBy: { position: 'desc' },
    });

    const position = lastLesson ? lastLesson.position + 1 : 0;

    return prisma.lesson.create({
      data: {
        ...data,
        sectionId,
        position,
      },
    });
  }
}