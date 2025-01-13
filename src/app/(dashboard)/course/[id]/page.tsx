"use client"
import { AssignmentsTable } from "@/components/assignments-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { AssignmentsTable } from "@/components/assignments-table"
// import { CourseInfo } from "@/components/course-info"

import { useEffect, useState } from "react";
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

interface JSONType {
    course_code: string,
    course_description: string,
    course_name: string,
    id: string,
    personnel: personnel[],
    schemes: schemes[],
}

interface personnel {
    name: string,
    role: string,
    email: string,
}

interface condition {
    symbol: string,
    lowerBound: number,
    upperBound: number,
}

interface assessment {
    date: string[],
    drop: number,
    name: string,
    count: number,
    grade: number[],
    symbol: string,
    weight: number,
    assessmentType: string
}

interface schemes {
    condition: condition,
    schemeNum: number,
    assessments: assessment[],
}


export default function Page({ params }: { params: { id: string } }) {
    // const courseId = params.id
    const [courseId, setCourseId] = useState<string>()
    const [courseMetadata, setCourseMetadata] = useState<JSONType>();
    const [isLoading, setLoading] = useState<boolean>(true);

    const dynamicChartData = [
        { label: "Semester Progress", percentage: 100, fill: "hsl(var(--primary))" },
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

    useEffect(()=>{

        const fetchCourseData = async () => {
            const value = (await params).id
            setCourseId(value)

            const payload = {
                value: {id: value} 
            }

            //Practically a GET but GET's can't have a body
            const response = await fetch('/api/courses/pages/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            const { data, error } = await response.json()

            console.log("DATA FETCHED: ", data)

            if (error){
                console.error("ERROR: ", error.message)
                return;
            }

            if (!data) {
                console.error("No course data returned")
                return;
            }

            console.log("DATA DATA: ", data)
            setCourseMetadata(data)
            setLoading(false);
        }

        fetchCourseData();
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4"> {/* SPLIT BASED ON COLS & ROWS */}
            <div className="col-span-3">
                {isLoading ?
                    <>
                        <Skeleton className="h-8 w-1/2 mb-4" />
                        <Skeleton className="h-6 w-1/5" />
                    </>
                    : <>
                        <h2 className="text-3xl font-semibold mb-4 text-white">
                            {courseMetadata!.course_code}: {courseMetadata!.course_name}
                        </h2>
                        <p className="text-muted-foreground">
                            {courseMetadata!.course_description}
                        </p>
                        <Table className="mt-10">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-white">Assignment Name</TableHead>
                                    <TableHead className="text-white">Due Date</TableHead>
                                    <TableHead className="text-white text-right">Weighting (%)</TableHead>
                                    <TableHead className="text-white text-right">Grade</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {courseMetadata!.schemes[0].assessments.map((assessment,index) => 
                                Array.from({length: assessment.count}).map((_, i) => (
                                    <TableRow key={assessment.assessmentType+i}>
                                        <TableCell className="font-medium text-white">
                                            {(assessment.count > 1) ?
                                                <>
                                                    {assessment.name.slice(0, -1)} #{i + 1}
                                                </>
                                                : <>
                                                    {assessment.name}
                                                </>
                                            }
                                        </TableCell>
                                        <TableCell className="text-gray-300">
                                            {(assessment.date[0]=="none") ? "N/A": assessment.date}
                                        </TableCell>
                                        <TableCell className="text-right text-gray-300">
                                            {(100*assessment.weight)/(assessment.count)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Input
                                                type="text"
                                                // value={tempGrades[assignment.id] !== undefined ? tempGrades[assignment.id] : assignment.grade}
                                                // onChange={(e) => handleGradeChange(assignment.id, e.target.value)}
                                                className="px-2 self-end ml-auto py-0 w-1/3 bg-gray-800 text-white border-gray-700"
                                                placeholder="Grade"
                                            />
                                        </TableCell>
                                    </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <div className="mt-4 flex justify-end">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                Save Grades
                            </Button>
                        </div>
                    </>
                }
            </div>
            <div className="col-span-1 flex flex-col gap-2">
                <Card className="w-full flex flex-col h-fit">
                    <CardHeader className="text-center">
                        <CardTitle>
                            {isLoading ?
                                <Skeleton className="h-5 w-1/3" />
                                : <>Semester Progress</>
                            }
                        </CardTitle>
                        <CardDescription>
                            Semester
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex items-center justify-center">
                        <ChartContainer
                            config={dynamicChartConfig}
                            className="w-full h-full"
                        >
                            <RadialBarChart
                                data={dynamicChartData}
                                startAngle={90}
                                endAngle={360 * 80/ 100 + 90}
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
                                                            className="fill-foreground text-3xl font-bold"
                                                        >
                                                            {80}%
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
                            {/* {semesterProgress < 50 ? 'Just getting started!' : 'Over halfway there!'} <TrendingUp className="h-4 w-4" /> */}
                            Testing
                        </div>
                        <div className="leading-none text-muted-foreground mb-3">
                            {/* {semester} semester: {dates.start.toLocaleDateString()} - {dates.end.toLocaleDateString()} */}
                            Testing
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
        // <div className="container py-10 min-h-screen">
        //     <CourseInfo courseCode="CS101" courseName="Introduction to Computer Science" />
        //     <h2 className="text-2xl font-semibold mb-4 text-white">{params.slug}</h2>
        //     <AssignmentsTable />
        // </div>
    )
}