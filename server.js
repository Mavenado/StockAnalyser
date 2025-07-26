const express = require('express');
const cors = require('cors');
const path = require('path');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// Prompt template
const ANALYSIS_PROMPT = `Please provide a comprehensive fundamental analysis for the following stock(s): {STOCKS}

Include the following key areas in your analysis:

1. **Company Overview & Business Model**
- Core business operations and revenue streams
- Market position and competitive advantages
- Recent strategic initiatives or changes

2. **Financial Health Analysis**
- Revenue growth trends (last 3-5 years)
- Profitability metrics (gross, operating, net margins)
- Balance sheet strength (debt levels, cash position)
- Cash flow analysis (operating, free cash flow)

3. **Valuation Metrics**
- P/E ratio (current and forward)
- Price-to-Book (P/B) ratio
- Price-to-Sales (P/S) ratio
- PEG ratio
- Comparison to industry averages

4. **Key Financial Ratios**
- Return on Equity (ROE)
- Return on Assets (ROA)
- Debt-to-Equity ratio
- Current ratio and quick ratio
- Asset turnover ratios

5. **Growth Analysis**
- Historical revenue and earnings growth
- Future growth projections
- Market expansion opportunities
- R&D investment and innovation pipeline

6. **Risks & Challenges**
- Industry-specific risks
- Company-specific vulnerabilities
- Economic sensitivity
- Regulatory or competitive threats

7. **Investment Thesis**
- Bull case scenario
- Bear case scenario
- Fair value estimation
- Recommendation (Buy/Hold/Sell) with reasoning

Please provide specific numbers, recent data, and focus on the most recent quarterly and annual reports. Structure your response clearly with headers and bullet points for easy reading.`;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Stock Analysis API is running' });
});

// POST endpoint for stock analysis
app.post('/api/analyze', async (req, res) => {
  try {
    const { stocks } = req.body;

    // Validate input
    if (!stocks || !Array.isArray(stocks) || stocks.length === 0) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Please provide an array of stock symbols',
      });
    }

    // Sanitize stock symbols
    const cleanedStocks = stocks
      .map((s) => s.toString().trim().toUpperCase())
      .filter((s) => s.length > 0);

    if (cleanedStocks.length === 0) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'No valid stock symbols provided',
      });
    }

    const stocksList = cleanedStocks.join(', ');
    const prompt = ANALYSIS_PROMPT.replace('{STOCKS}', stocksList);

    console.log(`Analyzing stocks: ${stocksList}`);

    // Call OpenAI chat completion
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // Replace with your available model name
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const analysis = completion.choices[0].message.content;

    // Respond with analysis
    res.json({
      success: true,
      stocks: cleanedStocks,
      analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Analysis error:', error);

    if (error.code === 'insufficient_quota') {
      return res.status(429).json({
        error: 'API quota exceeded',
        message: 'OpenAI API quota exceeded. Please check your billing.',
      });
    } else if (error.code === 'invalid_api_key') {
      return res.status(401).json({
        error: 'Invalid API key',
        message: 'OpenAI API key is invalid or missing.',
      });
    } else if (error.code === 'rate_limit_exceeded') {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.',
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while processing your request.',
    });
  }
});

// Fallback: serve index.html for all other routes (supports SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Stock Analysis API running on port ${PORT}`);
});
