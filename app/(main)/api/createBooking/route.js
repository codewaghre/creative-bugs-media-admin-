import { createBooking } from "@/actions/bookings";

export async function POST(req) {

    const allowedOriginPath = process.env.CROSS_ORIGIN;

    const allowedOrigins = [
        "http://localhost:5173",
        allowedOriginPath,
    ];

    const origin = req.headers.get("origin");

    const headers = {
        "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
        "Cache-Control": "no-store",
    };

    // // Handle OPTIONS request for CORS preflight
    // if (req.method === "OPTIONS") {
    //     return new Response(null, {
    //         status: 204,
    //         headers: {
    //             ...headers,
    //             "Access-Control-Max-Age": "3600", // Cache preflight for 1 hour
    //         },
    //     });
    // }

    // return new Response(null, {
    //     status: 204,
    //     headers,
    // });

    try {
        const body = await req.json(); // Parse JSON body

        // Validate required fields
        const requiredFields = ["eventId", "name", "email", "startTime", "endTime"];
        for (const field of requiredFields) {
            if (!body[field]) {
                return new Response(JSON.stringify({ error: `${field} is required` }), { status: 400, headers });
            }
        }

        const result = await createBooking(body);

        if (!result.success) {
            return new Response(JSON.stringify({ error: result.error }), { status: 500, headers });
        }

        return new Response(JSON.stringify(result), { status: 200, headers });
    } catch (error) {
        console.error("API error:", error);
        return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400, headers });
    }
}
