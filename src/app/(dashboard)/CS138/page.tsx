import { CourseInfo } from '@/components/course-info'
import { AssignmentsTable } from '@/components/assignments-table'

export default function CoursePage() {
  return (
    <div className="container mx-auto py-10 min-h-screen">
      <CourseInfo courseCode="CS101" courseName="Introduction to Computer Science" />
      <h2 className="text-2xl font-semibold mb-4 text-white">Assignments</h2>
      <AssignmentsTable />
    </div>
  )
}

