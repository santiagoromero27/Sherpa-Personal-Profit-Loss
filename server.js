const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const DATA_PATH = path.join(__dirname, 'data.json');

app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not set on the server.' });
  }

  const { message, history } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Missing "message" in request body.' });
  }

  let financialData;
  try {
    financialData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  } catch (err) {
    return res.status(500).json({ error: 'Could not read data.json: ' + err.message });
  }

  const systemPrompt = `You are a financial analyst assistant embedded in a private dashboard for Sherpa Digital Agency, a solo pay-per-call agency. You have access to the business's real financial data below. Answer questions precisely using only this data — never invent numbers. If something isn't in the data, say so plainly rather than guessing. Be concise and direct, like a sharp operator, not a generic chatbot. Cash-basis figures (revenue_by_buyer, cogs_by_publisher, opex_by_category, net_profit, etc.) reflect money actually received/spent. pending_receivables and anomalies of type "Expected Receivable" are NOT yet posted — never present them as confirmed revenue.

FINANCIAL DATA:
${JSON.stringify(financialData)}`;

  const messages = [
    ...(Array.isArray(history) ? history : []).map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: message }
  ];

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 1024,
        system: systemPrompt,
        messages
      })
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return res.status(502).json({ error: 'Anthropic API error: ' + errText });
    }

    const json = await anthropicRes.json();
    const reply = json.content && json.content[0] && json.content[0].text
      ? json.content[0].text
      : "(no response text returned)";
    res.json({ reply });
  } catch (err) {
    res.status(502).json({ error: 'Failed to reach Anthropic API: ' + err.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sherpa dashboard server running on port ${PORT}`));
