const SITEMAP_URL = 'https://newvacancyalert.in/sitemap.xml';

async function pingSearchEngines() {
  console.log(📡 Pinging search engines for sitemap: \);
  const endpoints = [
    { name: 'Google', url: https://www.google.com/ping?sitemap=\ },
    { name: 'Bing', url: https://www.bing.com/ping?sitemap=\ }
  ];
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, { method: 'GET' });
      console.log(✅ [] Ping sent (Status: ));
    } catch (err) {
      console.log(ℹ️ [] Ping dispatched);
    }
  }
}

pingSearchEngines().catch(console.error);
