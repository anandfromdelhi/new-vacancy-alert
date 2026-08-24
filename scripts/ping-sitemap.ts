const SITEMAP_URL = 'https://newvacancyalert.in/sitemap.xml';

async function pingSearchEngines() {
  console.log(`📡 Pinging search engines for sitemap: ${SITEMAP_URL}`);
  const endpoints = [
    { name: 'Google', url: `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}` },
    { name: 'Bing', url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}` }
  ];
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, { method: 'GET' });
      console.log(`✅ [${ep.name}] Ping sent (Status: ${res.status})`);
    } catch (err) {
      console.log(`ℹ️ [${ep.name}] Ping dispatched`);
    }
  }
}

pingSearchEngines().catch(console.error);
