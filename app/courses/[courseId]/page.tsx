import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProgressTracker } from "@/components/courses/progress-tracker";
import { DiscussionList } from "@/components/discussion/discussion-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/prisma";

export default async function CourseDetailsPage({
  params,
}: {
  params: { courseId: string };
}) {
  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    include: {
      instructor: true,
      sections: {
        include: {
          lessons: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return <div>Course not found</div>;
  }

  const totalLessons = course.sections.reduce(
    (acc, section) => acc + section.lessons.length,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-muted-foreground mb-6">{course.description}</p>

            <Tabs defaultValue="curriculum" className="space-y-4">
              <TabsList>
                <TabsTrigger value="curriculum">Kurikulum</TabsTrigger>
                <TabsTrigger value="discussion">Diskusi</TabsTrigger>
              </TabsList>

              <TabsContent value="curriculum">
                {course.sections.map((section) => (
                  <div key={section.id} className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">
                      {section.title}
                    </h3>
                    <div className="space-y-2">
                      {section.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-3 bg-card rounded-lg"
                        >
                          <span>{lesson.title}</span>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(lesson.duration / 60)} menit
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="discussion">
                <DiscussionList courseId={params.courseId} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <ProgressTracker
                courseId={params.courseId}
                totalLessons={totalLessons}
              />
              {/* Course actions, enrollment status, etc. */}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}