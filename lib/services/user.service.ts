import prisma from '@/lib/prisma';
import { User } from '@prisma/client';

export class UserService {
  static async getUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        enrollments: {
          include: {
            course: true,
          },
        },
      },
    });
  }

  static async updateUser(userId: string, data: Partial<User>) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  static async getUserCourses(userId: string) {
    return prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            instructor: {
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

  static async getInstructorStats(instructorId: string) {
    const [totalStudents, totalCourses, revenue] = await Promise.all([
      prisma.enrollment.count({
        where: {
          course: {
            instructorId,
          },
        },
      }),
      prisma.course.count({
        where: {
          instructorId,
        },
      }),
      prisma.enrollment.aggregate({
        where: {
          course: {
            instructorId,
          },
          status: 'active',
        },
        _sum: {
          course: {
            select: {
              price: true,
            },
          },
        },
      }),
    ]);

    return {
      totalStudents,
      totalCourses,
      revenue: revenue._sum?.price || 0,
    };
  }
}