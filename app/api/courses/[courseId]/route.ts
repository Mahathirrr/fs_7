import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { CourseService } from "@/lib/services/course.service";

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const course = await CourseService.getCourseById(params.courseId);
    
    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  const session = await getServerSession();
  
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const course = await CourseService.getCourseById(params.courseId);

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    if (course.instructorId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updatedCourse = await CourseService.updateCourse(params.courseId, body);
    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}