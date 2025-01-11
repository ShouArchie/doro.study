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
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { getChartColors } from "@/components/ui/helpers";
import { parse, format, isValid, compareAsc } from 'date-fns';

const parseDate = (dateString: string | undefined) => {
  if (!dateString) return new Date(NaN);
  
  const formats = ['yyyy-MM-dd', 'MM/dd/yyyy', 'MMM d', 'MMMM d', 'MMM d yyyy', 'MMMM d yyyy'];
  for (const fmt of formats) {
    const date = parse(dateString, fmt, new Date());
    if (isValid(date)) {
      return date;
    }
  }
  return new Date(NaN);
};

const formatDate = (date: Date) => {
  return isValid(date) ? format(date, 'MMM d, yyyy') : 'Invalid Date';
};

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

  const sortedData = [...chartData]
    .filter(dataPoint => isValid(parseDate(dataPoint.date)))
    .sort((a, b) => compareAsc(parseDate(a.date), parseDate(b.date)));

  const averageData = sortedData.map((dataPoint) => {
    const visibleCourseValues = courses
      .filter((course) => visibleCourses[course])
      .map((course) => dataPoint[course] || 0);
    const average = visibleCourseValues.length
      ? visibleCourseValues.reduce((sum, value) => sum + value, 0) / visibleCourseValues.length
      : 0;
    return {
      ...dataPoint,
      average: Number(average.toFixed(2)),
      parsedDate: parseDate(dataPoint.date),
    };
  });

  const calculateYAxisDomain = () => {
    const allValues = averageData.flatMap(dataPoint => 
      courses.map(course => dataPoint[course]).filter(value => typeof value === 'number')
    );
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const lowerBound = Math.max(0, Math.floor((minValue - 5) / 10) * 10);
    const upperBound = Math.min(100, Math.ceil((maxValue + 5) / 10) * 10);
    return [lowerBound, upperBound];
  };

  const yAxisDomain = calculateYAxisDomain();

  return (
    <Card className="w-full h-[600px] md:h-[700px] lg:h-[800px] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Course Performance</CardTitle>
        <CardDescription>Grade Trends Over Time</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col min-h-0">
        <div className="mb-4 flex-shrink-0">
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
        <div className="flex-grow min-h-0">
          <ChartContainer config={chartConfig} className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={averageData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis
                  dataKey="parsedDate"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => isValid(value) ? format(value, 'MMM d') : ''}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  domain={yAxisDomain}
                  tickCount={6}
                  tickFormatter={(value) => `${value}%`}
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: "Grade (%)", angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                />
                <ChartTooltip
                  cursor={false}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border border-border p-2 rounded shadow">
                          <p className="font-bold">{formatDate(label)}</p>
                          {payload.map((entry, index) => (
                            <p key={index} style={{ color: entry.color }}>
                              {entry.name}: {entry.value}%
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
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
      <CardFooter className="flex-shrink-0">
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

