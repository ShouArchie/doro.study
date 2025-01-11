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
import { getChartColors } from "@/components/ui/helpers";

interface GradetimeChartProps {
  chartData: any[];
  courses: string[];
  visibleCourses: Record<string, boolean>;
  onToggleCourse: (course: string) => void;
}

export function GradetimeChart({ chartData, courses, visibleCourses, onToggleCourse }: GradetimeChartProps) {
  const colors = getChartColors();
  const chartConfig = courses.reduce((acc, course, index) => {
    acc[course] = {
      label: course,
      color: colors[index % colors.length],
    };
    return acc;
  }, {} as ChartConfig);

  chartConfig.average = {
    label: "Average",
    color: "hsl(var(--primary))",
  };

  const averageData = chartData.map((dataPoint) => {
    const visibleCourseValues = courses
      .filter((course) => visibleCourses[course])
      .map((course) => dataPoint[course] || 0);
    const average = visibleCourseValues.length
      ? visibleCourseValues.reduce((sum, value) => sum + value, 0) / visibleCourseValues.length
      : 0;
    return {
      ...dataPoint,
      average: Number(average.toFixed(2)),
    };
  });

  const calculateYAxisDomain = () => {
    const allValues = averageData.flatMap(dataPoint => 
      Object.values(dataPoint).filter(value => typeof value === 'number')
    );
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const lowerBound = Math.max(0, Math.floor((minValue - 5) / 10) * 10);
    const upperBound = Math.ceil(maxValue / 10) * 10;
    return [lowerBound, upperBound];
  };

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
            <div className="flex items-center space-x-2">
              <Checkbox
                id="average"
                checked={visibleCourses.average}
                onCheckedChange={() => onToggleCourse('average')}
              />
              <label
                htmlFor="average"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Average
              </label>
            </div>
          </div>
        </div>
        <div className="h-[calc(100%-4rem)]">
          <ChartContainer config={chartConfig} className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={averageData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  domain={calculateYAxisDomain()}
                  tickCount={6}
                  tickFormatter={(value) => `${value}%`}
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: "Grade (%)", angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
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
                      strokeDasharray="5 5"
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                  )
                ))}
                {visibleCourses.average && (
                  <Line
                    key="average"
                    dataKey="average"
                    type="monotone"
                    stroke={chartConfig.average.color}
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: chartConfig.average.color }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                )}
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

