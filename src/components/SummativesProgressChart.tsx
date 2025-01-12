"use client"

import React, { useMemo } from "react"
import { CheckCircle } from 'lucide-react'
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"

type Summative = {
  id: string
  date: string
  time: string
  course: string
  type: string
}

export function SummativesProgressChart({ summatives, checkedItems }: { summatives: Summative[], checkedItems: Record<string, boolean> }) {
  const { completedCount, totalCount, completionPercentage } = useMemo(() => {
    const completed = Object.values(checkedItems).filter(Boolean).length
    const total = summatives.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    return { completedCount: completed, totalCount: total, completionPercentage: percentage }
  }, [summatives, checkedItems])

  const dynamicChartData = [
    { label: "Summatives Progress", percentage: completionPercentage, fill: "hsl(var(--primary))" },
  ]

  const dynamicChartConfig = {
    percentage: {
      label: "Percentage Completed",
    },
    summativesProgress: {
      label: "Summatives Progress",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig

  return (
    <Card className="w-full flex flex-col">
      <CardHeader className="text-center">
        <CardTitle>Summatives Progress</CardTitle>
        <CardDescription>Completed vs Total Summatives</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        <ChartContainer
          config={dynamicChartConfig}
          className="w-full h-full"
        >
          <RadialBarChart
            data={dynamicChartData}
            startAngle={90}
            endAngle={360 * completionPercentage / 100 + 90}
            innerRadius={65}
            outerRadius={82.5}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[69, 61]}
            />
            <RadialBar dataKey="percentage" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <g>
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="fill-foreground text-5xl font-bold"
                        >
                          {completionPercentage}%
                        </text>
                      </g>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm text-center">
        <div className="flex items-center justify-center gap-2 font-medium leading-none">
          {completionPercentage < 50 ? 'Keep going!' : 'Almost there!'} <CheckCircle className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {completedCount} out of {totalCount} summatives completed
        </div>
      </CardFooter>
    </Card>
  )
}

