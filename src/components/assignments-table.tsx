"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"

interface Assignment {
  id: number
  name: string
  date: string
  weighting: number
  grade: string
}

const initialAssignments: Assignment[] = [
  { id: 1, name: "Project 1", date: "2025-02-15", weighting: 20, grade: "" },
  { id: 2, name: "Midterm Exam", date: "2025-03-10", weighting: 30, grade: "" },
  { id: 3, name: "Project 2", date: "2025-04-05", weighting: 20, grade: "" },
  { id: 4, name: "Final Exam", date: "2025-05-20", weighting: 30, grade: "" },
]

export function AssignmentsTable() {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments)

  const handleGradeChange = (id: number, grade: string) => {
    setAssignments(assignments.map(assignment => 
      assignment.id === id ? { ...assignment, grade } : assignment
    ))
  }

  return (
    <Table>
      <TableCaption className="text-gray-400">List of course assignments and their details.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-white">Assignment Name</TableHead>
          <TableHead className="text-white">Due Date</TableHead>
          <TableHead className="text-white text-right">Weighting (%)</TableHead>
          <TableHead className="text-white text-right">Grade</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assignments.map((assignment) => (
          <TableRow key={assignment.id}>
            <TableCell className="font-medium text-white">{assignment.name}</TableCell>
            <TableCell className="text-gray-300">{assignment.date}</TableCell>
            <TableCell className="text-right text-gray-300">{assignment.weighting}</TableCell>
            <TableCell className="text-right">
              <Input
                type="text"
                value={assignment.grade}
                onChange={(e) => handleGradeChange(assignment.id, e.target.value)}
                className="w-20 text-right bg-gray-800 text-white border-gray-700"
                placeholder="Grade"
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

