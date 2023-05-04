export class TokenServer {
    server: Deno.Listener;

    constructor(port: number) {
        this.server = Deno.listen({ hostname: "localhost", port: port });
    }


    public async awaitConnections() {

        for await (const conn of this.server) {
            const http = Deno.serveHttp(conn);
            for await (const requestEvent of http) {
                const url = new URL(requestEvent.request.url);
                
                if(url.pathname.includes('/token/')) {
                    await requestEvent.respondWith(new Response("Token received", { status: 200 }));
                    return url.pathname.split('/')[2];
                }

                requestEvent.respondWith(new Response("Invalid token", { status: 400 }));
            }
        }
        return null;
    }
}