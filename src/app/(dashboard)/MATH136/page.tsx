import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { AssignmentsTable } from "@/components/assignments-table";
import { CourseInfo } from "@/components/course-info";

const initialAssignments = [
    { id: 1, name: "Assignment 1", date: "01/02/2025", weighting: 5, grade: "" },
    { id: 2, name: "Assignment 2", date: "01/05/2025", weighting: 5, grade: "" },
    { id: 3, name: "Assignment 3", date: "01/10/2025", weighting: 5, grade: "" },
    { id: 4, name: "Assignment 4", date: "01/25/2025", weighting: 5, grade: "" },
    { id: 5, name: "Assignment 5", date: "02/05/2025", weighting: 5, grade: "" },
    { id: 6, name: "Assignment 6", date: "02/13/2025", weighting: 5, grade: "" },
    { id: 7, name: "Midterm", date: "02/25/2025", weighting: 20, grade: "" },
    { id: 8, name: "Final", date: "02/29/2025", weighting: 50, grade: "" },
]

export default async function MATH136Page() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="min-h-screen bg-black">
            <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-4xl">
              <CourseInfo 
                courseCode="MATH 136" 
                courseName="Linear Algebra 1 for Honours Mathematics" 
              />
              <h2 className="text-2xl font-semibold mb-4 text-white">Assignments</h2>
              <AssignmentsTable assignment={initialAssignments} />
            </div>
          </div>
        </div>
  )
}

