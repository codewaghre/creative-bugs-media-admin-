import { getEventAvailability } from "@/actions/availability";

export async function GET(req) {
    const headers = {
        "Access-Control-Allow-Origin": "*", // Allow from any origin (for development, use specific domain for production)
        "Access-Control-Allow-Methods": "GET, OPTIONS", // Allow only GET and OPTIONS methods
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
