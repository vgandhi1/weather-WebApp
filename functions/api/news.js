export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);

    // Extract parameters from the client request
    const query = url.searchParams.get('q');
    const sortBy = url.searchParams.get('sortBy') || 'publishedAt';

    // Validate API Key presence in Cloudflare Environment
    const apiKey = env.VITE_NEWS_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ status: 'error', message: 'Missing API Key configuration on Server' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // Forward the request to NewsAPI
        // User-Agent is sometimes required by NewsAPI to avoid 403s
        const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=${sortBy}&pageSize=10&apiKey=${apiKey}`;

        const response = await fetch(newsApiUrl, {
            headers: {
                'User-Agent': 'WeatherApp-Cloudflare-Worker'
            }
        });

        const data = await response.json();

        // Return the data to our Frontend
        return new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json',
                // Optional: CORS headers if needed, but usually not for same-origin Pages
            }
        });

    } catch (error) {
        return new Response(JSON.stringify({ status: 'error', message: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
