import { getEventAvailability } from "@/actions/availability";


export async function GET(req) {
    const allowedOrigin = process.env.CROSS_ORIGIN;

    const headers = {
        "Access-Control-Allow-Origin": allowedOrigin,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
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

    const url = new URL(req.url);
    const eventId = url.searchParams.get("eventId");

    if (!eventId) {
        return new Response(JSON.stringify({ error: "EventId is required" }), {
            status: 400,
            headers,
        });
    }

    try {
        const availability = await getEventAvailability(eventId);
        return new Response(JSON.stringify(availability), {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers,
        });
    }
}
