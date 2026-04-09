import { url } from "@/config/config";

export async function POST(req) {
    const authHeader = req.headers.get("authorization");

    try {
        const contentType = req.headers.get("content-type");

        const arrayBuffer = await req.arrayBuffer();

        const res = await fetch(`${url.baseURL}/Auth/avatar`, {
            method: "POST",
            headers: {
                "Authorization": authHeader?.startsWith("Bearer ")
                    ? authHeader
                    : `Bearer ${authHeader}`,
                "Content-Type": contentType || ""
            },
            body: arrayBuffer,
            duplex: "half"
        });

        const data = await res.text();

        return new Response(data, {
            status: res.status,
            headers: {
                "Content-Type": res.headers.get("content-type") || "application/json"
            }
        });

    } catch (error) {
        console.error("AVATAR UPLOAD ERROR:", error);

        return new Response(
            JSON.stringify({ message: "Server error" }),
            { status: 500 }
        );
    }
}