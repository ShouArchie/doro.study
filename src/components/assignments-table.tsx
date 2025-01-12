"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Assignment {
  id: number
  name: string
  date: string
  weighting: number
  grade: string
}

const initialAssignments: Assignment[] = [
  { id: 1, name: "Coding Assignment 1", date: "01/02/2025", weighting: 5, grade: "" },
  { id: 2, name: "Coding Assignment 2", date: "01/05/2025", weighting: 5, grade: "" },
  { id: 3, name: "Coding Assignment 3", date: "01/10/2025", weighting: 5, grade: "" },
  { id: 4, name: "Coding Assignment 4", date: "01/25/2025", weighting: 5, grade: "" },
  { id: 5, name: "Coding Assignment 5", date: "02/05/2025", weighting: 5, grade: "" },
  { id: 6, name: "Coding Assignment 6", date: "02/13/2025", weighting: 5, grade: "" },
  { id: 7, name: "Midterm", date: "02/25/2025", weighting: 20, grade: "" },
  { id: 8, name: "Final", date: "02/29/2025", weighting: 50, grade: "" },
]

export function AssignmentsTable() {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments)
  const [tempGrades, setTempGrades] = useState<{ [key: number]: string }>({})

  const handleGradeChange = (id: number, grade: string) => {
    setTempGrades({ ...tempGrades, [id]: grade })
  }

  const handleSave = () => {
    setAssignments(assignments.map(assignment => ({
      ...assignment,
      grade: tempGrades[assignment.id] || assignment.grade
    })))
    setTempGrades({})
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white">Assignment Name</TableHead>
            <TableHead className="text-white">Due Date</TableHead>
            <TableHead className="text-white text-right">Weighting (%)</TableHead>
            <TableHead className="text-white">Grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment) => (
            <TableRow key={assignment.id}>
              <TableCell className="font-medium text-white">{assignment.name}</TableCell>
              <TableCell className="text-gray-300">{assignment.date}</TableCell>
              <TableCell className="text-right text-gray-300">{assignment.weighting}</TableCell>
              <TableCell>
                <Input
                  type="text"
                  value={tempGrades[assignment.id] !== undefined ? tempGrades[assignment.id] : assignment.grade}
                  onChange={(e) => handleGradeChange(assignment.id, e.target.value)}
                  className="w-20 bg-gray-800 text-white border-gray-700"
                  placeholder="Grade"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-end">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
          Save Grades
        </Button>
      </div>
    </div>
  )
}

