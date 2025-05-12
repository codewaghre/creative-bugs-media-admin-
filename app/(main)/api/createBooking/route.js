import { createBooking } from "@/actions/bookings";

export async function POST(req) {
    const headers = {
        "Access-Control-Allow-Origin": "*", // Allow from any origin (for development, use specific domain for production)
        "Access-Control-Allow-Methods": "POST, OPTIONS", // Allow only POST and OPTIONS methods
        "Access-Control-Allow-Headers": "Content-Type, Authorization", // Allow content-type header and authorization if needed
    };

    // Handle OPTIONS request for CORS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: {
                ...headers,
                "Access-Control-Max-Age": "3600", // Cache preflight for 1 hour
            },
        });
    }

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
