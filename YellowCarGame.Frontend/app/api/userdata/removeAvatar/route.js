import { url } from "@/config/config";
export async function DELETE(req) {
    try {
        const authHeader = req.headers.get("authorization");

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        const res = await fetch(`${url.baseURL}/Auth/avatar/${userId}`, {
            method: "DELETE",
            headers: {
                Authorization: authHeader
            }
        });

        // 🔥 vigtig fix
        if (res.status === 204) {
            return new Response(null, { status: 204 });
        }

        const text = await res.text();

        return new Response(text, {
            status: res.status
        });

    } catch (error) {
        console.error("DELETE AVATAR ERROR:", error);

        return new Response(
            JSON.stringify({ message: "Server error" }),
            { status: 500 }
        );
    }
}