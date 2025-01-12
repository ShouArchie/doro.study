"use client"

import { useState, useMemo, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "./ui/scroll-area"
import { Checkbox } from "./ui/checkbox"
import { Switch } from "./ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Label } from "./ui/label"

type Summative = {
  id: string
  date: string
  time: string
  course: string
  type: string
}

type SortKey = "date" | "course" | "type"

export function UpcomingSummativesTable({ summatives }: { summatives: Omit<Summative, 'id'>[] }) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [sortBy, setSortBy] = useState<SortKey>("date")
  const [showStrikethrough, setShowStrikethrough] = useState(true)

  // Add unique ids to summatives
  const summativesWithIds = useMemo(() => 
    summatives.map((summative, index) => ({
      ...summative,
      id: `${summative.date}-${summative.time}-${summative.course}-${index}`
    })),
    [summatives]
  )

  const handleCheckboxChange = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const sortedAndFilteredSummatives = useMemo(() => {
    return summativesWithIds
      .filter((summative) => showStrikethrough || !checkedItems[summative.id])
      .sort((a, b) => {
        if (sortBy === "date") {
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        }
        return a[sortBy].localeCompare(b[sortBy])
      })
  }, [summativesWithIds, sortBy, showStrikethrough, checkedItems])

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Upcoming Deliverables</CardTitle>
        <CardDescription>Your next assessments</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow space-y-4">
        <div className="flex justify-between items-center">
          <Select onValueChange={(value) => setSortBy(value as SortKey)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="course">Course</SelectItem>
              <SelectItem value="type">Type</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-2">
            <Switch
              id="show-strikethrough"
              checked={showStrikethrough}
              onCheckedChange={setShowStrikethrough}
            />
            <Label htmlFor="show-strikethrough">Show completed</Label>
          </div>
        </div>
        <ScrollArea className="flex-grow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredSummatives.map((summative) => (
                <TableRow 
                  key={summative.id} 
                  className={checkedItems[summative.id] ? "line-through opacity-50" : ""}
                >
                  <TableCell>
                    <Checkbox
                      id={`checkbox-${summative.id}`}
                      checked={checkedItems[summative.id] || false}
                      onCheckedChange={() => handleCheckboxChange(summative.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <label htmlFor={`checkbox-${summative.id}`}>{summative.date}</label>
                  </TableCell>
                  <TableCell>
                    <label htmlFor={`checkbox-${summative.id}`}>{summative.time}</label>
                  </TableCell>
                  <TableCell>
                    <label htmlFor={`checkbox-${summative.id}`}>{summative.course}</label>
                  </TableCell>
                  <TableCell>
                    <label htmlFor={`checkbox-${summative.id}`}>{summative.type}</label>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

