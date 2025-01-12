import { getClient } from "@/lib/sql";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const courseQuery = (await getClient()).rpc('get_distinct_column')
        const nameQuery = (await getClient()).from('outlines').select('course_name') 

        const { data, error } = await courseQuery
        const { data: nameData, error: nameError } = await nameQuery

        //Error handling for courseQuery
        if (error) {
            console.error("Error fetching classes", error.message);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        if (!data || !data[0]) {
            console.error("No classes found");
            return NextResponse.json({ error: "No classes found" }, { status: 404 });
        }

        //Error handling for nameQuery
        if (nameError) {
            console.error("Error fetching name", nameError.message);
            return NextResponse.json({ error: nameError.message }, { status: 400 });
        }

        if (!nameData || !nameData[0]) {
            console.error("No name found");
            return NextResponse.json({ error: "No name found" }, { status: 404 });
        }

        return NextResponse.json({ data, nameData }, { status: 200 });
    }
    catch (error) {
        console.error("Internal Server Error");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}