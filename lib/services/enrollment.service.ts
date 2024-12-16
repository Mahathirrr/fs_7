import prisma from '@/lib/prisma';

export class EnrollmentService {
  static async enrollStudent(courseId: string, userId: string) {
    // Check if student is already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw new Error('Student is already enrolled in this course');
    }

    return prisma.enrollment.create({
      data: {
        userId,
        courseId,
        status: 'active',
        progress: 0,
        completedLessons: [],
      },
    });
  }

  static async updateProgress(
    userId: string,
    courseId: string,
    lessonId: string,
    progress: number
  ) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        course: {
          include: {
            sections: {
              include: {
                lessons: true,
              },
            },
          },
        },
      },
    });

    if (!enrollment) {
      throw new Error('Enrollment not found');
    }

    // Update lesson progress
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      create: {
        userId,
        lessonId,
        progress,
        completedAt: progress >= 0.9 ? new Date() : null,
      },
      update: {
        progress,
        completedAt: progress >= 0.9 ? new Date() : null,
      },
    });

    // Calculate overall course progress
    const totalLessons = enrollment.course.sections.reduce(
      (acc, section) => acc + section.lessons.length,
      0
    );

    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId,
        lesson: {
          section: {
            courseId,
          },
        },
        progress: {
          gte: 0.9,
        },
      },
    });

    const overallProgress = totalLessons > 0 ? completedLessons / totalLessons : 0;

    // Update enrollment progress
    return prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      data: {
        progress: overallProgress,
        completedAt: overallProgress >= 1 ? new Date() : null,
        lastAccessedAt: new Date(),
      },
    });
  }
}