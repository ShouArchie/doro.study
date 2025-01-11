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
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Upcoming Summatives</CardTitle>
          <CardDescription>Your next assessments</CardDescription>
        </CardHeader>
        <CardContent>
          {/* <div className="max-h-[270px] overflow-auto pr-2 custom-scrollbar"> */}
          <ScrollArea className="h-[50px]">
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

