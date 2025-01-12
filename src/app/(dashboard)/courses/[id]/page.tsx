import { AssignmentsTable } from "@/components/assignments-table"
import { CourseInfo } from "@/components/course-info"

export default async function Page({
    params
}: {
    params: { slug: number }
}) {
    const slug = (await params).slug
    console.log("SLUG: ", slug)
    return (
        <div className="container mx-auto py-10 min-h-screen">
            <CourseInfo courseCode="CS101" courseName="Introduction to Computer Science" />
            <h2 className="text-2xl font-semibold mb-4 text-white">Assignments</h2>
            <AssignmentsTable />
        </div>
    )
}