const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2/everything';

/** rss2json proxies RSS feeds with CORS — works for static GitHub Pages (no /api/news backend). */
const RSS2JSON_ENDPOINT = 'https://api.rss2json.com/v1/api.json';
const RSS2JSON_KEY = import.meta.env.VITE_RSS2JSON_API_KEY;

function stripHtmlEntities(text) {
    if (!text || typeof text !== 'string') return '';
    return text
        .replace(/<[^>]*>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"');
}

function buildGoogleNewsRssUrl(searchQuery, countryCode) {
    const gl = countryCode && /^[A-Za-z]{2}$/.test(String(countryCode))
        ? String(countryCode).toUpperCase()
        : 'US';
    const ceid = `${gl}:en`;
    return `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery)}&hl=en-US&gl=${gl}&ceid=${encodeURIComponent(ceid)}`;
}

async function fetchRssItems(rssUrl) {
    try {
        let url = `${RSS2JSON_ENDPOINT}?rss_url=${encodeURIComponent(rssUrl)}`;
        if (RSS2JSON_KEY && !String(RSS2JSON_KEY).includes('your_')) {
            url += `&api_key=${encodeURIComponent(RSS2JSON_KEY)}`;
        }
        const response = await fetch(url);
        if (!response.ok) return null;
        const data = await response.json();
        if (data.status !== 'ok' || !Array.isArray(data.items) || data.items.length === 0) return null;
        return data.items;
    } catch {
        return null;
    }
}

/** Real headlines for the searched area — works on static hosts without NewsAPI proxy. */
async function fetchLocalNewsFromGoogleRss(city, state, country) {
    const parts = [city, state, country].filter(Boolean);
    if (parts.length === 0) return null;
    const rssUrl = buildGoogleNewsRssUrl(parts.join(' '), country);
    const items = await fetchRssItems(rssUrl);
    if (!items) return null;
    return items.slice(0, 10).map((item) => ({
        title: stripHtmlEntities(item.title),
        link: item.link,
        image: item.thumbnail || (item.enclosure && item.enclosure.link) || undefined,
        source: stripHtmlEntities(item.author) || 'Google News',
        pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
    }));
}

async function fetchAttractionsFromGoogleRss(city, state, country) {
    const parts = [city, state, country].filter(Boolean);
    if (parts.length === 0) return null;
    const query = `${parts.join(' ')} (travel OR tourism OR restaurant OR events OR landmarks OR "things to do")`;
    const rssUrl = buildGoogleNewsRssUrl(query, country);
    const items = await fetchRssItems(rssUrl);
    if (!items) return null;
    return items.slice(0, 10).map((item) => ({
        title: stripHtmlEntities(item.title),
        link: item.link,
        source: stripHtmlEntities(item.author) || 'Google News',
    }));
}

// --- RICH MOCK DATA GENERATOR (For Production Demo Fallback) ---
const generateMockNews = (city) => [
    {
        title: `${city} City Council announces new green initiative for downtown district`,
        source: "Local Gazette",
        pubDate: new Date().toISOString(),
        link: `https://www.google.com/search?q=${city}+city+council+news`
    },
    {
        title: `Community spotlight: How ${city} volunteers are making a difference`,
        source: "Daily Herald",
        pubDate: new Date(Date.now() - 3600000 * 2).toISOString(),
        link: `https://www.google.com/search?q=${city}+volunteers`
    },
    {
        title: `Prep Sports: ${city} High School teams prepare for regional finals`,
        source: "Sports Weekly",
        pubDate: new Date(Date.now() - 3600000 * 5).toISOString(),
        link: `https://www.google.com/search?q=${city}+high+school+sports`
    },
    {
        title: `Weekly Weather Outlook: What residents in ${city} can expect`,
        source: "Weather Watch",
        pubDate: new Date(Date.now() - 3600000 * 12).toISOString(),
        link: `https://www.google.com/search?q=${city}+weather+news`
    },
    {
        title: `New seasonal market opens this weekend in ${city}`,
        source: "Lifestyle Blog",
        pubDate: new Date(Date.now() - 3600000 * 24).toISOString(),
        link: `https://www.google.com/search?q=${city}+events+weekend`
    },
    {
        title: `Economic report shows growth in ${city} small business sector`,
        source: "Business Journal",
        pubDate: new Date(Date.now() - 3600000 * 48).toISOString(),
        link: `https://www.google.com/search?q=${city}+business+news`
    },
    {
        title: `Local artist unveils new mural in downtown ${city}`,
        source: "Arts & Culture",
        pubDate: new Date(Date.now() - 3600000 * 50).toISOString(),
        link: `https://www.google.com/search?q=${city}+art+scene`
    },
    {
        title: `Traffic Alert: Road closures planned for ${city} main street`,
        source: "Traffic Update",
        pubDate: new Date(Date.now() - 3600000 * 72).toISOString(),
        link: `https://www.google.com/search?q=${city}+traffic+news`
    },
    {
        title: `Best places to hike near ${city} this season`,
        source: "Outdoors Magazine",
        pubDate: new Date(Date.now() - 3600000 * 96).toISOString(),
        link: `https://www.google.com/search?q=${city}+hiking`
    },
    {
        title: `Review: The newest coffee shop in ${city} is a hit`,
        source: "Food Finder",
        pubDate: new Date(Date.now() - 3600000 * 120).toISOString(),
        link: `https://www.google.com/search?q=${city}+coffee+shops`
    }
];

const generateMockAttractions = (city) => [
    {
        title: `Top 10 Things to Do in ${city}`,
        source: "Travel Guide",
        link: `https://www.google.com/search?q=things+to+do+in+${city}`
    },
    {
        title: `The Best Restaurants in ${city} You Must Try`,
        source: "Foodie Blog",
        link: `https://www.google.com/search?q=best+restaurants+in+${city}`
    },
    {
        title: `Historical Sites & Hidden Gems in ${city}`,
        source: "History Weekly",
        link: `https://www.google.com/search?q=history+of+${city}`
    },
    {
        title: `Family Friendly Activities in ${city}`,
        source: "Parenting Mag",
        link: `https://www.google.com/search?q=family+activities+${city}`
    },
    {
        title: `Nightlife and Live Music in ${city}`,
        source: "City Nights",
        link: `https://www.google.com/search?q=${city}+nightlife`
    }
];

const fetchFromNewsAPI = async (query, sortBy = 'publishedAt') => {
    try {
        let url;

        // --- ENVIRONMENT DETECTION ---
        if (import.meta.env.DEV) {
            // [LOCALHOST]: Direct call to NewsAPI (Allowed by Browser)
            // Requires VITE_NEWS_API_KEY in .env
            if (!NEWS_API_KEY || NEWS_API_KEY.includes('your_api_key')) return null;
            url = `${BASE_URL}?q=${encodeURIComponent(query)}&language=en&sortBy=${sortBy}&pageSize=10&apiKey=${NEWS_API_KEY}`;
        } else {
            // [PRODUCTION / PROXY]:
            // Call local endpoint '/api/news' which must be proxied by Nginx or Cloudflare.
            // We append apiKey here so "dumb proxies" (like Nginx) can simply forward the request.
            // (Cloudflare Functions will ignore this param if they use their own env secret, so it's safe).
            if (!NEWS_API_KEY) return null;
            url = `/api/news?q=${encodeURIComponent(query)}&sortBy=${sortBy}&pageSize=10&apiKey=${NEWS_API_KEY}`;
        }

        const response = await fetch(url);

        if (!response.ok) return null;

        const data = await response.json();

        // Check for Proxy errors
        if (data.status === 'error' && data.message) {
            console.warn("Proxy Error:", data.message);
            return null;
        }

        if (data.status !== 'ok') return null;
        if (!Array.isArray(data.articles)) return null;

        return data.articles.map(article => ({
            title: article.title,
            link: article.url,
            image: article.urlToImage,
            source: article.source.name,
            pubDate: article.publishedAt
        }));

    } catch (error) {
        console.error("API Fetch Error:", error);
        return null;
    }
};

export const fetchNews = async (location) => {
    const safeLoc = typeof location === 'string' ? location : '';
    const parts = safeLoc.split(',').map((p) => p.trim()).filter(Boolean);
    const city = parts[0] || 'Local';
    const state = parts.length > 1 ? parts[1] : '';
    const country = parts.length > 2 ? parts[2] : '';

    // STRICT QUERY: +Bloomington +Illinois -Indiana
    const strictQuery = state ? `+"${city}" +"${state}" -Indiana -Hoosiers` : `"${city}" -Indiana -Hoosiers`;

    // 1. NewsAPI (dev: direct; prod: /api/news proxy — not available on GitHub Pages)
    let data = await fetchFromNewsAPI(strictQuery, 'publishedAt');
    if (data && data.length > 0) return data;

    data = await fetchFromNewsAPI(strictQuery, 'relevancy');
    if (data && data.length > 0) return data;

    // 2. Static-friendly: Google News RSS via rss2json (no backend)
    data = await fetchLocalNewsFromGoogleRss(city, state, country);
    if (data && data.length > 0) return data;

    // 3. Demo fallback
    return generateMockNews(city);
};

export const fetchAttractions = async (location) => {
    const safeLoc = typeof location === 'string' ? location : '';
    const parts = safeLoc.split(',').map((p) => p.trim()).filter(Boolean);
    const city = parts[0] || 'Local';
    const state = parts.length > 1 ? parts[1] : '';
    const country = parts.length > 2 ? parts[2] : '';

    const keywords = '(tourism OR "things to do" OR restaurants OR landmarks)';
    const strictQuery = state
        ? `+"${city}" +"${state}" AND ${keywords} -Indiana -Hoosiers`
        : `"${city}" AND ${keywords} -Indiana -Hoosiers`;

    let data = await fetchFromNewsAPI(strictQuery, 'relevancy');
    if (data && data.length > 0) return data;

    data = await fetchAttractionsFromGoogleRss(city, state, country);
    if (data && data.length > 0) return data;

    return generateMockAttractions(city);
};
