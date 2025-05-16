import { getEventDetails } from "@/actions/events";



export async function GET(req) {
    const url = new URL(req.url);
    const username = url.searchParams.get("username");
    const eventId = url.searchParams.get("eventId");

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

    if (!username || !eventId) {
        return new Response(JSON.stringify({ error: "Username and eventId are required" }), {
            status: 400,
            headers,
        });
    }

    try {
        const event = await getEventDetails(username, eventId);
        if (!event) {
            return new Response(JSON.stringify({ error: "Event not found" }), {
                status: 404,
                headers,
            });
        }

        return new Response(JSON.stringify(event), {
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

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*", // Replace * with allowed origin
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
