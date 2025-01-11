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
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Upcoming Deliverables</CardTitle>
        <CardDescription>Your next assessments</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-grow overflow-hidden">
        <ScrollArea className="h-[310px] w-full">
          <div className="max-h-[calc(100vh-12rem)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky top-0 bg-background z-10">Date</TableHead>
                  <TableHead className="sticky top-0 bg-background z-10">Time</TableHead>
                  <TableHead className="sticky top-0 bg-background z-10">Course</TableHead>
                  <TableHead className="sticky top-0 bg-background z-10">Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="h-full">
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
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

