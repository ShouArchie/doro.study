import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        interface TermData {
            title: string,
            index: number
        }

        const { value: term } = await req.json()

        // Validate input
        if ( term === undefined || term === null) {
            return NextResponse.json(
                { error: "Term index is required" },
                { status: 400 }
            )
        }

        // Set cookie with some additional options
        (await cookies()).set('term', term, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            // maxAge: 60 * 60 * 24 * 7 // 1 week
        })

        return NextResponse.json(
            { message: "Term updated successfully" },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error setting term cookie:", error)
        return NextResponse.json(
            { error: "Failed to set term" },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const term = (await cookies()).get('term')

        if (!term) {
            return NextResponse.json(
                { data: null, message: "No term cookie found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ data: term.value })
    } catch (error) {
        console.error("Error retrieving term cookie:", error)
        return NextResponse.json(
            { error: "Failed to retrieve term" },
            { status: 500 }
        )
    }
}