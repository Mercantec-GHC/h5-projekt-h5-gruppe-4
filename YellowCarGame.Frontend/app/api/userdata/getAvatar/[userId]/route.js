import { url } from "@/config/config";
export async function GET(req, context) {
    const params = await context.params; // 🔥 det her er nøglen

    const userId = params.userId;

    if (!userId) {
        return new Response(JSON.stringify({ message: "Missing userId" }), {
            status: 400
        });
    }

    const authHeader = req.headers.get("authorization");

    const res = await fetch(`${url.baseURL}/Auth/avatar/${userId}`, {
        method: "GET",
        headers: {
            Authorization: authHeader?.startsWith("Bearer ")
                ? authHeader
                : `Bearer ${authHeader}`
        },
    });

    const buffer = await res.arrayBuffer();

    return new Response(buffer, {
        status: res.status,
        headers: {
            "Content-Type": res.headers.get("content-type") || "image/png"
        }
    });
}