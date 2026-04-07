import { url } from "@/config/config";
export async function POST(req) {
    const authHeader = req.headers.get("authorization");
    console.log("CREATE GAME PROXY AUTH HEADER:", authHeader);
    const apiUrl = `${url.baseURL}/Game/Start`;
    const body = await req.json();
    try {
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                Authorization: authHeader?.startsWith("Bearer ")
                    ? authHeader
                    : `Bearer ${authHeader}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        console.log("CREATE GAME PROXY RESPONSE:", res);
        let data;
        if (res.ok) {
            data = await res.json();
        } else {
            data = await res.text();
        }


        return new Response(
            typeof data === "string" ? data : JSON.stringify(data),
            {
                status: res.status,
                headers: { "Content-Type": "application/json" }
            }
        );

    } catch (error) {
        console.error("CREATE GAME PROXY ERROR:", error);
        return new Response(JSON.stringify({ message: "Server error" }), {
            status: 500
        });
    }
}