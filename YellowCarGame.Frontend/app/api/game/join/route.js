import { url } from "@/config/config";

export async function GET(req) {
    const authHeader = req.headers.get("authorization");
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const apiUrl = `${url.baseURL}/Game/Join/${code}`;

    try {
        const res = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": authHeader?.startsWith("Bearer ")
                    ? authHeader
                    : `Bearer ${authHeader}`
            },
        });

        const contentType = res.headers.get("content-type");

        let data;
        if (contentType && contentType.includes("application/json")) {
            data = await res.json();
        } else {
            data = await res.text();
        }

        return new Response(JSON.stringify(data), {
            status: res.status,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("JOIN GAME ERROR:", error);

        return new Response(
            JSON.stringify({ message: "Server error" }),
            { status: 500 }
        );
    }
}