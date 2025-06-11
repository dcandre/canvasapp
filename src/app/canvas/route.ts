

export async function POST(req: Request) {
    const sdk = process.env.SDK_URL;
    const origin = process.env.ORIGIN_URL ?? '';
    
    let message = 'yo!';
    try {
        let fu = await req.json();
        message = JSON.stringify(fu);
    }
    catch(e) {
        if (typeof e === "string") {
        message = e; // works, `e` narrowed to string
        } else if (e instanceof Error) {
            message = e.message // works, `e` narrowed to Error
        }
    }

    message = message;
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