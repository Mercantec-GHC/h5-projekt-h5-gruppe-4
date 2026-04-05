import { url } from "@/config/config";
export async function POST(req) {
    const body = await req.json();
    const apiUrl = `${url.baseURL}/Game/Start`;

    try {
        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                Authorization: authHeader || ""
            },
            body: JSON.stringify(body)
        });

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