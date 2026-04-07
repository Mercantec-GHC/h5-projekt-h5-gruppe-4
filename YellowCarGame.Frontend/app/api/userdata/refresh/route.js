import { url } from "@/config/config";
export async function POST(req) {
    const body = await req.json();
    const authHeader = req.headers.get("authorization");
    const apiUrl = `${url.baseURL}/Auth/Refresh`;
    console.log("REFRESH REQUEST BODY:", authHeader);
    try {
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": authHeader?.startsWith("Bearer ")
                    ? authHeader
                    : `Bearer ${authHeader}`
            },
            body: JSON.stringify(body)
        });

        const text = await res.text();

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = { message: text || "Unknown error" };
        }

        return new Response(JSON.stringify(data), {
            status: res.status,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("REFRESH PROXY ERROR:", error);
        return new Response(JSON.stringify({ message: "Server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}