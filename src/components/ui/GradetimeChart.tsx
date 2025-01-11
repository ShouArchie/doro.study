import { TrendingUp } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { getRandomColor } from "@/components/ui/helpers";

interface GradetimeChartProps {
  chartData: any[];
  courses: string[];
  visibleCourses: Record<string, boolean>;
  onToggleCourse: (course: string) => void;
}

export function GradetimeChart({ chartData, courses, visibleCourses, onToggleCourse }: GradetimeChartProps) {
  const chartConfig = courses.reduce((acc, course) => {
    acc[course] = {
      label: course,
      color: getRandomColor(),
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card className="w-full h-[600px] md:h-[700px] lg:h-[800px]">
      <CardHeader>
        <CardTitle>Course Performance</CardTitle>
        <CardDescription>Grade Trends Over Time</CardDescription>
      </CardHeader>
      <CardContent className="h-[calc(100%-8rem)]">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Courses</h3>
          <div className="flex flex-wrap gap-4">
            {courses.map((course) => (
              <div key={course} className="flex items-center space-x-2">
                <Checkbox
                  id={course}
                  checked={visibleCourses[course]}
                  onCheckedChange={() => onToggleCourse(course)}
                />
                <label
                  htmlFor={course}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {course}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="h-[calc(100%-4rem)]">
          <ChartContainer config={chartConfig} className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis 
                  domain={[0, 100]}
                  ticks={[0, 20, 40, 60, 80, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                {courses.map((course) => (
                  visibleCourses[course] && (
                    <Line
                      key={course}
                      dataKey={course}
                      type="monotone"
                      stroke={chartConfig[course].color}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  )
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Grade Trends <TrendingUp className="h-4 w-4" />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

