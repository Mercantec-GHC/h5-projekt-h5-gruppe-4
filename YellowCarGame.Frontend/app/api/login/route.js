export async function POST(req) {
    const body = await req.json();

    try {
        const res = await fetch("http://10.133.51.112:8080/Auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
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
        console.error("LOGIN PROXY ERROR:", error); // 👈 vigtigt!
        return new Response(JSON.stringify({ message: "Server error" }), {
            status: 500
        });
    }
}