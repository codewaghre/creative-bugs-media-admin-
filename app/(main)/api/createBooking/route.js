import { createBooking } from "@/actions/bookings";

const allowedOrigins = [
    "http://localhost:5173",
    process.env.CROSS_ORIGIN,
];

function getCorsHeaders(origin) {
    return {
        "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
        "Cache-Control": "no-store",
    };
}

export async function OPTIONS(req) {
    const origin = req.headers.get("origin");
    return new Response(null, {
        status: 204,
        headers: {
            ...getCorsHeaders(origin),
            "Access-Control-Max-Age": "3600",
        },
    });
}

export async function POST(req) {
    const origin = req.headers.get("origin");
    const headers = getCorsHeaders(origin);

    try {
        const body = await req.json();

        const requiredFields = ["eventId", "name", "email", "startTime", "endTime"];
        for (const field of requiredFields) {
            if (!body[field]) {
                return new Response(JSON.stringify({ error: `${field} is required` }), {
                    status: 400,
                    headers,
                });
            }
        }

        const result = await createBooking(body);

        if (!result.success) {
            return new Response(JSON.stringify({ error: result.error }), {
                status: 500,
                headers,
            });
        }

        return new Response(JSON.stringify(result), { status: 200, headers });
    } catch (error) {
        console.error("API error:", error);
        return new Response(JSON.stringify({ error: "Invalid request body" }), {
            status: 400,
            headers,
        });
    }
}

