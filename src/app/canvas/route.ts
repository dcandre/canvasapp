

export async function GET() {
    const sdk = process.env.SDK_URL;
    const origin = process.env.ORIGIN_URL ?? '';
    
    
    const html = `<!DOCTYPE html>
    <html>
    <head>
    <script type="text/javascript" src="${sdk}"></script>
    <script type="text/javascript">
        function dragOverHandler(ev) {
            ev.preventDefault();
        }
        function dropHandler(ev) {
            ev.preventDefault();

            let message = '';   

            if (ev.dataTransfer.items) {                
                [...ev.dataTransfer.items].forEach((item, i) => {      
                    if (item.kind === "file") {
                        const file = item.getAsFile();  
                        message += "<div>File: " + file.name + " Size: " + file.size + " bytes</div>";        
                    }
                });
            } else {                
                [...ev.dataTransfer.files].forEach((file, i) => {
                    message += "<div>File: " + file.name + " Size: " + file.size + " bytes</div>";
                });
            }

            document.getElementById("drop_zone_message").innerHTML = message;
        }
    </script>
    </head>
    <body>
    <h2>Hi Derek!</h2>
    <div
    id="drop_zone"
    style="border: 5px solid black;width:200px;height:100px;"
    ondrop="dropHandler(event);"
    ondragover="dragOverHandler(event);">
        <div id="drop_zone_message">Drag one or more files here.</div>
    </div>    
    </body>
    </html>`;
    
    return new Response(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': origin }
    });
}

export async function POST(req: Request) {
    const sdk = process.env.SDK_URL;
    const origin = process.env.ORIGIN_URL ?? '';
    
    let message = 'yo!';
    try {
        const fu = await req.json();
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