import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { CourseService } from "@/lib/services/course.service";

export async function GET(req: Request) {
  const session = await getServerSession();
  
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const courses = await CourseService.getCourses({
      instructorId: session.user.id,
    });
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching instructor courses:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession();
  
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const course = await CourseService.createCourse({
      ...body,
      instructorId: session.user.id,
    });
    return NextResponse.json(course);
  } catch (error) {
    console.error("Error creating course:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}