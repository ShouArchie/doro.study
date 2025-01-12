import { getClient } from "@/lib/sql";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try {
        const cookieStore = await cookies()
        const terms = {
            "1A": 0,
            "1B": 1,
            "2A": 2,
            "2B": 3,
            "3A": 4,
            "3B": 5,
            "4A": 6,
            "4B": 7
        }

        const index = 0;

        if (cookieStore.has('selected_courses')) {

            const term = cookieStore.get('term')

            if (term) {
                for (const [key, value] of Object.entries(terms)) {
                    if (key === term.value) {
                        console.log(`Term: ${key}, Index: ${value}`);
                        // Perform some logic using `key` and `value`
                    }
                }
            } else {
                console.error("No term found in cookies.");
                return NextResponse.json({ data: null, error: "No term found" }, { status: 404 })
            }

            const payload = {
                value: JSON.stringify({ term: index, course: cookieStore.get('selected_courses') })
            }

            return NextResponse.json({ data: payload }, { status: 200 })
        }

        return NextResponse.json({data: null}, {status: 201})

    } catch (error) {
        console.error("Internal Server Error");
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}

export async function POST(Req:NextRequest){
    try {
        const cookieStore = await cookies()
        
        const { value: { code, id } } = await Req.json()

        // Validate input
        if (!code) {
            return NextResponse.json(
                { error: "Invalid Request (Course Code is required)" },
                { status: 400 }
            )
        }

        console.log("CODE: ", code)
        console.log("ID: ", id)

        if (!cookieStore.has('user_metadata') || !cookieStore.has('term')){
            console.error("User doens't have metadata / Term data is not stored")
            return NextResponse.json({error: "User doesn't have metadata / Term data is not stored"}, {status: 404})
        }

        const metadata = cookieStore.get('user_metadata')
        const term = cookieStore.get('term')

        const formatted_metadata = JSON.parse(metadata!.value)

        const { data, error }= await (await getClient())
            .from('profiles')
            .select('selected_courses')
            .eq('id', formatted_metadata.id)
            .single()

        if (error){
            console.error("Error returning selected_courses: ", error.message)
            return NextResponse.json({error: error.message}, {status: 400})
        }

        if (!data){
            console.error("Old selected courses data returned nothing")
            return NextResponse.json({error:"Old selected courses data returned nothing"}, {status: 404})
        }

        //Data is valid now, save new one in cookies for caching
        const value = term!.value;

        let index; //TODO: Write a better for loop
        if (value==="1A"){
            index = 0;
        } else if(value==="1B"){
            index = 1;
        } else if (value==="2A"){
            index = 2;
        } else if (value==="2B"){
            index = 3;
        } else if (value==="3A"){
            index = 4;
        } else if (value==="3B"){
            index = 5;
        } else if (value==="4A"){
            index = 6;
        } else if (value==="4B"){
            index = 7;
        } else {
            return NextResponse.json({error: "Invalid term value"}, {status: 501})
        }

        data.selected_courses![index]! = {courses: { ...data.selected_courses![index]!, code:code, id:id}}

        console.log("MOST IMPORTANTEST TEST: ", data.selected_courses!)

        //TODO: Add once confirmed that the data is correctly formatted
        const res = await (await getClient())
            .from('profiles')
            .insert({'selected_courses': data.selected_courses!})
            .eq('id', formatted_metadata.id);


        // // Set cookie with some additional options
        (await cookies()).set('selected_courses', JSON.stringify(data.selected_courses![0]), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            // maxAge: 60 * 60 * 24 * 7 // 1 week
        })

        return NextResponse.json(
            { message: "Course successfully added" },
            { status: 200 }
        )
    } catch (error){
        console.error("Internal Server Error")
        return NextResponse.json({error: "Internal Server Error"}, {status: 500})
    }
}