import { getClient } from "@/lib/sql";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(){
    const cookieStore = await cookies()

    if (!cookieStore.has('user_metadata') || !cookieStore.has('term')){
        console.error("User doens't have metadata / Term data is not stored")
        return NextResponse.json({ error: "User doesn't have metadata / Term data is not stored" }, { status: 404 })
    }

    const metadata = cookieStore.get('user_metadata')
    const term = cookieStore.get('term')

    const formatted_metadata = JSON.parse(metadata!.value)
    const value = term!.value

    let data, termData;

    if (value=="1A"){
        data = await (await getClient())
            .from('profiles')
            .select("1A")
            .eq('id', formatted_metadata.id)
        
        termData = data!.data![0]["1A"]
    } else if (value=="1B"){
        data = await (await getClient())
            .from('profiles')
            .select("1B")
            .eq('id', formatted_metadata.id)

        termData = data!.data![0]["1B"]
    } else if (value=="2A"){
        data = await (await getClient())
            .from('profiles')
            .select("2A")
            .eq('id', formatted_metadata.id)
        
        termData = data!.data![0]["2A"]
    } else if (value=="2B"){
        data = await (await getClient())
            .from('profiles')
            .select("2B")
            .eq('id', formatted_metadata.id)
        
        termData = data!.data![0]["2B"]
    } else if (value=="3A"){
        data = await (await getClient())
            .from('profiles')
            .select("3A")
            .eq('id', formatted_metadata.id)

        termData = data!.data![0]["3A"]
    } else if (value=="3B"){
        data = await (await getClient())
            .from('profiles')
            .select("3B")
            .eq('id', formatted_metadata.id)
        
        termData = data!.data![0]["3B"]
    } else if (value=="4A"){
        data = await (await getClient())
            .from('profiles')
            .select("4A")
            .eq('id', formatted_metadata.id)
        
        termData = data!.data![0]["4A"]
    } else if (value=="4B") {
        data = await (await getClient())
            .from('profiles')
            .select("4B")
            .eq('id', formatted_metadata.id)

        termData = data!.data![0]["4B"]
    }

    if (!data){
        console.error("No data returned")
        return NextResponse.json({message: "No data returned"}, {status: 404})
    }

    if (data.error){
        console.error("ERROR: ", data.error.message)
        return NextResponse.json({message: data.error.message}, {status: 400})
    }

    if (!termData){
        return NextResponse.json({data: null}, {status: 200})
    }
    
    return NextResponse.json({data: termData}, {status: 200})
}