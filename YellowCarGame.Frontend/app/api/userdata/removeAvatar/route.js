import { url } from "@/config/config";

export async function DELETE(req) {
    try {
        const authHeader = req.headers.get("authorization");

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        const res = await fetch(`${url.baseURL}/Auth/avatar/${userId}`, {
            method: "DELETE",
            headers: {
                Authorization: authHeader?.startsWith("Bearer ")
                    ? authHeader
                    : `Bearer ${authHeader}`
            }
        });

        // const data = res.ok ? await res.json() : await res.text();

        return new Response(
            // typeof data === "string" ? data : JSON.stringify(data),
            {
                status: res.status,
                headers: { "Content-Type": "application/json" }
            }
        );

    } catch (error) {
        console.error("DELETE AVATAR ERROR:", error);

        return new Response(
            JSON.stringify({ message: "Server error" }),
            { status: 500 }
        );
    }
}