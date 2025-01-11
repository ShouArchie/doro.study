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
          { month: "January", Math: 85, Science: 78, English: 88, History: 82, Art: 91, Engineering: 80},
          { month: "February", Math: 88, Science: 82, English: 90, History: 84, Art: 89, Engineering: 82 },
          { month: "March", Math: 92, Science: 85, English: 87, History: 88, Art: 93, Engineering: 85 },
          { month: "April", Math: 87, Science: 80, English: 85, History: 81, Art: 90, Engineering: 88 },
          { month: "May", Math: 90, Science: 88, English: 92, History: 85, Art: 94, Engineering: 90 },
          { month: "June", Math: 93, Science: 91, English: 95, History: 89, Art: 97, Engineering: 93 },
        ];

        setChartData(mockChartData);
        
        const dynamicCourses = Object.keys(mockChartData[0]).filter(key => key !== 'month');
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

