import { getClient } from "@/lib/sql";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const courseQuery =  (await getClient()).from('outlines').select("course_code, course_name, course_description")
        
        const { data, error } = await courseQuery

        //Error handling for courseQuery
        if (error) {
            console.error("Error fetching course information", error.message);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        if (!data || !data[0]) {
            console.error("No classes found");
            return NextResponse.json({ error: "No courses found" }, { status: 404 });
        }

        const courseCodes = data.map(row => row.course_code);
        const courseNames = data.map(row => row.course_name);
        const courseDescriptions = data.map(row => row.course_description);

        return NextResponse.json({ courseCodes, courseNames, courseDescriptions }, { status: 200 });
    }
    catch (error) {
        console.error("Internal Server Error");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}