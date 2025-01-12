"use client";

import { useEffect, useState } from "react";
import { GradetimeChart } from "@/components/GradetimeChart";
import { YearProgressChart } from "@/components/YearProgressChart";
import { UpcomingSummativesTable } from "@/components/UpcomingSummativesTable";

interface GradeUpdate {
  date: string;
  course: string;
  grade: number;
}

export default function Dashboard() {
  const [gradeUpdates, setGradeUpdates] = useState<GradeUpdate[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [visibleCourses, setVisibleCourses] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingSummatives, setUpcomingSummatives] = useState<{date:string, time:string, course:string, type:string}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mockGradeUpdates: GradeUpdate[] = [
          { date: "01/02/2025", course: "CS 138", grade: 78 },
          { date: "01/05/2025", course: "CS 138", grade: 82 },
          { date: "01/10/2025", course: "CS 138", grade: 80 },
          { date: "01/25/2025", course: "CS 138", grade: 84 },
          { date: "02/05/2025", course: "CS 138", grade: 86 },
          { date: "02/13/2025", course: "CS 138", grade: 90 },
          { date: "02/20/2025", course: "CS 138", grade: 92 },
          { date: "02/30/2025", course: "CS 138", grade: 97 },

          { date: "01/04/2025", course: "CS 115", grade: 82 },
          { date: "01/07/2025", course: "CS 115", grade: 88 },
          { date: "01/21/2025", course: "CS 115", grade: 88 },
          { date: "02/05/2025", course: "CS 115", grade: 86 },
          { date: "02/11/2025", course: "CS 115", grade: 90 },
          { date: "02/25/2025", course: "CS 115", grade: 92 },
          { date: "02/30/2025", course: "CS 115", grade: 94 },
          { date: "03/03/2025", course: "CS 115", grade: 99 },

          
        ];

        setGradeUpdates(mockGradeUpdates);
        
        const uniqueCourses = Array.from(new Set(mockGradeUpdates.map(update => update.course)));
        setCourses(uniqueCourses);

        const initialVisibleCourses = uniqueCourses.reduce((acc, course) => {
          acc[course] = false;
          return acc;
        }, {} as Record<string, boolean>);
        setVisibleCourses(initialVisibleCourses);

        // Mock data for upcoming summatives
        const mockSummatives = [
          { date: "2025-01-15", time: "10:00 AM", course: "Math", type: "Test" },
          { date: "2025-01-18", time: "2:00 PM", course: "Science", type: "Assignment" },
          { date: "2025-01-22", time: "11:30 AM", course: "English", type: "Midterm" },
          { date: "2025-01-25", time: "9:00 AM", course: "History", type: "Assignment" },
          { date: "2025-01-29", time: "1:00 PM", course: "Art", type: "Project" },
          { date: "2025-02-01", time: "3:00 PM", course: "Engineering", type: "Quiz" },
          { date: "2025-02-05", time: "10:30 AM", course: "Math", type: "Assignment" },
          { date: "2025-04-05", time: "10:30 AM", course: "Math", type: "Assignment" },
        ];
        setUpcomingSummatives(mockSummatives);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleCourse = (course: string) => {
    setVisibleCourses(prev => ({
      ...prev,
      [course]: !prev[course]
    }));
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
        <div className="lg:col-span-3 h-fit w-full">
          <GradetimeChart
            isLoading={isLoading}
            gradeUpdates={gradeUpdates}
            courses={courses}
            visibleCourses={visibleCourses}
            onToggleCourse={handleToggleCourse}
          />
        </div>
        <div className="lg:col-span-1 flex flex-col">
          <div className="lg:row-span-1flex flex-row">
            <div className="mb-4 h-full">
              <YearProgressChart isLoading={isLoading}/>
            </div>
          </div>
        </div>
      </div>
      <div className="m-4">
        <UpcomingSummativesTable summatives={upcomingSummatives} isLoading={isLoading} />
      </div>
    </>
  );
}