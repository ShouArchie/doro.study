import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "./ui/scroll-area";

export function UpcomingSummativesTable({ summatives }) {
  return (
    <Card className="flex flex-col custom-scrollbar">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Upcoming Deliverables</CardTitle>
        <CardDescription>Your next assessments</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ScrollArea className="h-2/6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky top-0 bg-background z-10">Date</TableHead>
                <TableHead className="sticky top-0 bg-background z-10">Time</TableHead>
                <TableHead className="sticky top-0 bg-background z-10">Course</TableHead>
                <TableHead className="sticky top-0 bg-background z-10">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summatives.map((summative, index) => (
                <TableRow key={index}>
                  <TableCell>{summative.date}</TableCell>
                  <TableCell>{summative.time}</TableCell>
                  <TableCell>{summative.course}</TableCell>
                  <TableCell>{summative.type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}