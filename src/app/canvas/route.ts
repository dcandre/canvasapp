import crypto from "crypto";

export async function POST(req: Request) {
    const sdk = process.env.SDK_URL;
    const origin = process.env.ORIGIN_URL ?? '';
    const secret = process.env.CONSUMER_SECRET ?? '';
    let message = 'yo!';
    try {
    const body: { signed_request: string } = await req.json();

    if (!body.signed_request) {
        // return new Response('Bad Request', {
        //     status: 400
        // });
    }

    
    
    const [encodedSignature, encodedPayload]: string[] = body.signed_request.split(".");
    const decodedPayload: string = Buffer.from(encodedPayload, "base64").toString("utf-8");
    const signed_request: Sfdc.canvas.SignedRequest = JSON.parse(decodedPayload) as Sfdc.canvas.SignedRequest;

    if(signed_request) {
        
    }

    const expectedSignature: string = crypto
            .createHmac("sha256", secret)
            .update(encodedPayload)
            .digest("base64");

    if (expectedSignature !== encodedSignature) {
        // return new Response('Unauthorized', {
        //     status: 401
        // });
    }

    //const name = signed_request.context.user?.firstName;
    }
    catch(e) {
        if (typeof e === "string") {
        message = e; // works, `e` narrowed to string
        } else if (e instanceof Error) {
            message = e.message // works, `e` narrowed to Error
        }
    }
    const html = `<!DOCTYPE html>
    <html>
    <head>
    <script type="text/javascript" src="${sdk}"></script>
    </head>
    <body>
    <h1>Hi ${message}!</h1>
    </body>
    </html>`;
    
    return new Response(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': origin }
    });
}