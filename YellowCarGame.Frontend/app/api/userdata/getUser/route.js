import { url } from "@/config/config";
export async function GET(req) {
    const authHeader = req.headers.get("authorization");
    const apiUrl = `${url.baseURL}/Auth`;
    try {
        const res = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Authorization": authHeader || ""
            }
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
        console.error("GET USER ERROR:", error);
        return new Response(JSON.stringify({ message: "Server error" }), {
            status: 500
        });
    }
}