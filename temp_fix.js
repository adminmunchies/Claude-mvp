// Finde diese Zeile in pages/[username].js:
const { data: newsData } = await supabase
  .from('news_posts')
  .select('*')

// Ersetze sie mit:
const { data: newsData } = await supabase
  .from('news_posts')
  .select('*, users(name)')
