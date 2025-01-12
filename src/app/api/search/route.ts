import { getClient } from "@/lib/sql";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const courseQuery = (await getClient()).rpc('get_distinct_column')
        const personnelQuery = (await getClient()).from('outlines').select('personnel') //REPLACE THIS WITH COURSE NAME ONCE ALLEN FINISHES HIS STUFF 

        const { data, error } = await courseQuery
        const { data: personnelData, error: personnelError } = await personnelQuery

        //Error handling for courseQuery
        if (error) {
            console.error("Error fetching classes", error.message);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        if (!data || !data[0]) {
            console.error("No classes found");
            return NextResponse.json({ error: "No classes found" }, { status: 404 });
        }

        //Error handling for personnelQuery
        if (personnelError) {
            console.error("Error fetching personnel", personnelError.message);
            return NextResponse.json({ error: personnelError.message }, { status: 400 });
        }

        if (!personnelData || !personnelData[0]) {
            console.error("No personnel found");
            return NextResponse.json({ error: "No personnel found" }, { status: 404 });
        }

        return NextResponse.json({ data, personnelData }, { status: 200 });
    }
    catch (error) {
        console.error("Internal Server Error");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}