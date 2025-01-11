"use client";

import { useEffect, useState } from "react";
import { GradetimeChart } from "@/components/ui/GradetimeChart";
import { YearProgressChart } from "@/components/ui/YearProgressChart";
import { UpcomingSummativesTable } from "@/components/ui/UpcomingSummativesTable";

export default function Dashboard() {
  const [chartData, setChartData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [visibleCourses, setVisibleCourses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingSummatives, setUpcomingSummatives] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mockChartData = [
          { date: "01/02/2025", Math: 82, Science: 75, English: 88, History: 80, Art: 90, Engineering: 78 },
          { date: "01/18/2025", Math: 85, Science: 78, English: 86, History: 82, Art: 92, Engineering: 80 },
          { date: "02/10/2025", Math: 88, Science: 80, English: 89, History: 85, Art: 91, Engineering: 99 },
          { date: "02/20/2025", Math: 86, Science: 82, English: 90, History: 83, Art: 93, Engineering: 85 },
          { date: "03/01/2025", Math: 89, Science: 84, English: 88, History: 86, Art: 92, Engineering: 87 },
          { date: "03/13/2025", Math: 91, Science: 86, English: 92, History: 88, Art: 94, Engineering: 89 },
          { date: "03/28/2025", Math: 93, Science: 88, English: 91, History: 90, Art: 95, Engineering: 91 },
          { date: "04/02/2025", Math: 90, Science: 87, English: 93, History: 89, Art: 96, Engineering: 90 },
          { date: "04/12/2025", Math: 92, Science: 89, English: 94, History: 91, Art: 97, Engineering: 92 },
          { date: "04/30/2025", Math: 95, Science: 91, English: 96, History: 93, Art: 98, Engineering: 94 }
        ];

        setChartData(mockChartData);
        
        const dynamicCourses = Object.keys(mockChartData[0]).filter(key => key !== 'date');
        setCourses(dynamicCourses);

        const initialVisibleCourses = dynamicCourses.reduce((acc, course) => {
          acc[course] = true;
          return acc;
        }, {});
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

  const handleToggleCourse = (course) => {
    setVisibleCourses(prev => ({
      ...prev,
      [course]: !prev[course]
    }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-4rem)] p-4">
      <div className="lg:col-span-3 h-full">
        <GradetimeChart 
          chartData={chartData} 
          courses={courses} 
          visibleCourses={visibleCourses}
          onToggleCourse={handleToggleCourse}
        />
      </div>
      <div className="lg:col-span-1 flex flex-col gap-4 h-full">
        <div className="flex-grow-0">
          <YearProgressChart />
        </div>
        <div className="flex-grow overflow-hidden">
          <UpcomingSummativesTable summatives={upcomingSummatives} />
        </div>
      </div>
    </div>
  );
}

