export default async function handler(req: Request) {
  // Common CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    'Access-Control-Allow-Headers':
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    let text: string | undefined;

    // Handle body parsing for Request object
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await req.json();
      text = body.text;
    } else {
      const rawBody = await req.text();
      try {
        const parsed = JSON.parse(rawBody);
        text = parsed.text;
      } catch (e) {
        text = rawBody;
      }
    }

    if (!text) {
      return new Response(JSON.stringify({ error: 'Missing text in payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Forward to the OpenClaw Gateway hook via GET (known to work on this local loopback)
    const gatewayUrl =
      'http://127.0.0.1:18789/hook/agent:main:telegram:group:-1003713028358/contact_form?text=' +
      encodeURIComponent(text);

    console.log('Forwarding to gateway:', gatewayUrl);

    const response = await fetch(gatewayUrl, {
      method: 'GET',
    });

    if (response.ok) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      const errorText = await response.text();
      console.error('Gateway error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to forward message to gateway', detail: errorText }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error: any) {
    console.error('Internal Server Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', detail: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}
