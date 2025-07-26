// server.js - Simple Express backend for Stock Analysis
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Store your API key in .env file
});

// Middleware
app.use(cors());
app.use(express.json());

// Analysis prompt template
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

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Stock Analysis API is running' });
});

app.post('/api/analyze', async (req, res) => {
  try {
    const { stocks } = req.body;

    // Validation
    if (!stocks || !Array.isArray(stocks) || stocks.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid input', 
        message: 'Please provide an array of stock symbols' 
      });
    }

    // Clean and validate stock symbols
    const cleanedStocks = stocks
      .map(stock => stock.toString().trim().toUpperCase())
      .filter(stock => stock.length > 0);

    if (cleanedStocks.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid input', 
        message: 'No valid stock symbols provided' 
      });
    }

    const stocksString = cleanedStocks.join(', ');
    const prompt = ANALYSIS_PROMPT.replace('{STOCKS}', stocksString);

    console.log(`Analyzing stocks: ${stocksString}`);

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // or 'gpt-4o-mini' for faster/cheaper analysis
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const analysis = completion.choices[0].message.content;

    console.log(`Analysis completed for: ${stocksString}`);

    res.json({
      success: true,
      stocks: cleanedStocks,
      analysis: analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analysis error:', error);

    // Handle different types of errors
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({
        error: 'API quota exceeded',
        message: 'OpenAI API quota exceeded. Please check your billing.'
      });
    }

    if (error.code === 'invalid_api_key') {
      return res.status(401).json({
        error: 'Invalid API key',
        message: 'OpenAI API key is invalid or missing.'
      });
    }

    if (error.code === 'rate_limit_exceeded') {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.'
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while processing your request.'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'API endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Stock Analysis API is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
