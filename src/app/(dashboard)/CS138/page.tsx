import { CourseInfo } from '@/components/course-info'
import { AssignmentsTable } from '@/components/assignments-table'

export default function CoursePage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-4xl">
        <CourseInfo 
          courseCode="CS 138" 
          courseName="Introduction to Data Abstraction and Implementation" 
        />
        <h2 className="text-2xl font-semibold mb-4 text-white">Assignments</h2>
        <AssignmentsTable />
      </div>
    </div>
  )
}