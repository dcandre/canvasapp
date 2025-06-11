import crypto, { sign } from "crypto";

export async function POST(req: Request) {
    const body: { signed_request?: string } = await req.json();

    if (!body.signed_request) {
        return new Response('Bad Request', {
            status: 400
        });
    }

    const sdk = process.env.SDK_URL;
    const origin = process.env.ORIGIN_URL ?? '';
    const secret = process.env.CONSUMER_SECRET ?? '';
    
    const [encodedSignature, encodedPayload]: string[] = body.signed_request.split(".");
    const decodedPayload: string = Buffer.from(encodedPayload, "base64").toString("utf-8");
    const signed_request: Sfdc.canvas.SignedRequest = JSON.parse(decodedPayload) as Sfdc.canvas.SignedRequest;

    const expectedSignature: string = crypto
            .createHmac("sha256", secret)
            .update(encodedPayload)
            .digest("base64");

    if (expectedSignature !== encodedSignature) {
        return new Response('Unauthorized', {
            status: 401
        });
    }

    const name = signed_request.context.user?.firstName;
        
    const html = `<!DOCTYPE html>
    <html>
    <head>
    <script type="text/javascript" src="${sdk}"></script>
    </head>
    <body>
    <h1>Hi ${name}!</h1>
    </body>
    </html>`;
    
    return new Response(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': origin }
    });
}