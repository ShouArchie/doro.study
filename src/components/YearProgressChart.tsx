import React from 'react';
import { TrendingUp } from 'lucide-react';
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
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
} from "@/components/ui/chart";
import { getSemesterDates, calculateSemesterProgress } from "@/components/ui/helpers";

export function YearProgressChart() {
  const { semester, dates } = getSemesterDates();
  const semesterProgress = calculateSemesterProgress(dates);

  const dynamicChartData = [
    { label: "Semester Progress", percentage: semesterProgress, fill: "hsl(var(--primary))" },
  ];

  const dynamicChartConfig = {
    percentage: {
      label: "Percentage Completed",
    },
    semesterProgress: {
      label: "Semester Progress",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="w-full flex flex-col">
      <CardHeader className="text-center">
        <CardTitle>Semester Progress</CardTitle>
        <CardDescription>{semester} Semester {dates.start.getFullYear()}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        <ChartContainer
          config={dynamicChartConfig}
          className="w-full h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={dynamicChartData}
              startAngle={90}
              endAngle={360*semesterProgress/100+90}
              innerRadius="65%"
              outerRadius="90%"
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                polarRadius={[74, 64]}
                className="first:fill-muted last:fill-background"
              />
              <RadialBar dataKey="percentage" background cornerRadius={10}/>
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-5xl font-bold"
                          >
                            {semesterProgress}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 30}
                            className="fill-muted-foreground text-lg"
                          >
                            Done
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm text-center">
        <div className="flex items-center justify-center gap-2 font-medium leading-none">
          {semesterProgress < 50 ? 'Just getting started!' : 'Over halfway there!'} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {semester} semester: {dates.start.toLocaleDateString()} - {dates.end.toLocaleDateString()}
        </div>
      </CardFooter>
    </Card>
  );
}

