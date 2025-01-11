import { getClient } from "@/lib/sql";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const classesQuery = (await getClient())
            .from('schedules')
            .select('course_code');

        console.log(classesQuery)
        const { data, error } = await classesQuery;

        if (error) {
            console.error("Error fetching classes", error.message);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        if (!data || !data[0]) {
            console.error("No classes found");
            return NextResponse.json({ error: "No classes found" }, { status: 404 });
        }

        console.log("Class List Updated");
        return NextResponse.json({ data }, { status: 200 });
    }
    catch (error) {
        console.error("Internal Server Error");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}