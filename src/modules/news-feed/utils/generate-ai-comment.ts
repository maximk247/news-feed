export async function generateAIComment(title: string, body: string) {
  const prompt = `Write a very short (1 sentence), friendly comment for the news:
    Title: "${title}"
    Text: "${body}"`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 30,
    }),
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}
