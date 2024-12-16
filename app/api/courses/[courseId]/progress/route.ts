import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/firebase-admin";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const token = req.headers.get("Authorization")?.split("Bearer ")[1];
    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: params.courseId,
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
      return new NextResponse("Not enrolled", { status: 403 });
    }

    const progress = {
      overallProgress: enrollment.progress,
      completedLessons: enrollment.completedLessons as string[],
      currentLessonId: enrollment.lastAccessedAt
        ? await getNextIncompleteLesson(userId, params.courseId)
        : enrollment.course.sections[0]?.lessons[0]?.id,
      lastAccessedAt: enrollment.lastAccessedAt,
    };

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error fetching course progress:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

async function getNextIncompleteLesson(userId: string, courseId: string) {
  const result = await prisma.lesson.findFirst({
    where: {
      section: {
        courseId,
      },
      NOT: {
        progress: {
          some: {
            userId,
            progress: {
              gte: 0.9,
            },
          },
        },
      },
    },
    orderBy: [
      {
        section: {
          position: "asc",
        },
      },
      {
        position: "asc",
      },
    ],
  });

  return result?.id;
}