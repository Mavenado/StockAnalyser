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
const ANALYSIS_PROMPT = ` Please provide a comprehensive fundamental analysis for the following stock(s): {STOCKS}
## Objective
Conduct a thorough analysis of the stock, combining qualitative and quantitative approaches to provide a well-rounded investment recommendation.

## Source & Outline of Analysis
Take financial statements and other data points on the company from Screener.in on the said company!! Adhere STRICTLY to the sample output outline. Can add charts, and visualisations.

## Instructions

{STOCKS} - Equity Analysis Report

By “Trading Maverick”

### 1. Company Overview
- Provide a brief introduction to the company, including its name, sector, and primary business activities.
- Mention any recent significant events or changes in the company's structure or operations.
- Investment Recommendation (Quick reference from & based on Step 8 below)
Recommendation: BUY/SELL/HOLD
Target Price: ₹x (y% upside/downside)
Investment Horizon:  months


### 2. Quantitative Analysis
Use the provided financial data to analyze the following metrics. For each subtopic, provide:
The current value and historical data for the past 5 years (where available)
A clear trend analysis (e.g., improving, declining, stable)
Analytical commentary on the reasons behind the observed trends
Key takeaways and their implications for the company's financial health and future prospects
a) Market Valuation and Price Metrics:
Market Capitalization
Current Stock Price
Price-to-Earnings (P/E) Ratio
b) Profitability and Returns:
Return on Equity (ROE)
Return on Capital Employed (ROCE)
Net Profit Margin
Operating Profit Margin
c) Growth Metrics:
Revenue Growth Rate (5-year CAGR)
Earnings Per Share (EPS) Growth Rate (5-year CAGR)
d) Balance Sheet Strength:
Debt-to-Equity Ratio
e) Cash Flow Analysis:
Cash Flow from Operations
f) Dividend Analysis:
Dividend Yield
Dividend Payout Ratio
g) Efficiency Ratios:
Asset Turnover Ratio
h) Valuation Metrics:
Compare P/E ratio with industry peers
For each metric, ensure that you:
Highlight any significant year-over-year changes
Discuss how the company's performance compares to industry benchmarks
Identify any potential red flags or areas of concern
Explain the implications of these metrics for potential investors

### 3. Qualitative Analysis
Evaluate the following aspects:

a) Business Model:
   - Core products/services
   - Revenue streams
   - Competitive advantages

b) Management Quality:
   - Experience and track record of key executives
   - Corporate governance practices

c) Growth Strategy:
   - Expansion plans
   - Research and development initiatives

### 4. Shareholding Pattern Analysis
Analyze the company's shareholding pattern, focusing on:
- Promoter holding and any recent changes
- Institutional investor (FII and DII) holdings
- Public shareholding trends

### 5. Investment Thesis
Synthesize the qualitative and quantitative analyses to form a coherent investment thesis. This should include:
- Key drivers for future growth
- Potential catalysts for stock price movement
- How the company is positioned to handle industry trends and challenges

### 6. Valuation and Recommendation
- Provide a fair value estimate for the stock based on various valuation methods.
- Offer a clear investment recommendation (Strong Buy, Buy, Hold, Sell, Strong Sell) with a detailed rationale.
- Include a target price and the expected timeframe for achieving it.

### 7. Conclusion
Summarize the key points of your analysis and restate your recommendation.

### Output Type

Give the output in a HTML version of the equity research report by the author. Design as a professional with the following features:
Professional Design Elements:
Clean, corporate color scheme with professional typography
Branded header with company and report information
Recommendation box highlighting the BUY recommendation
Color-coded trends (positive in green, negative in red, neutral in orange)
Proper spacing and margins for readability
Well-Structured Content:
All seven sections from the original report maintained
Data presented in neatly formatted tables
Clear hierarchical headings and subheadings
Highlighted key metrics and recommendations
Page breaks at logical points for PDF printing
Enhanced Readability:
Key points highlighted in bold
Important figures and recommendations emphasized
Consistent formatting throughout
Footer with disclaimer and publication information


## Important Notes
- Remember that for Indian markets, the financial year starts from April 1st and ends on March 31st. For example, FY24 would be from April 1, 2023, to March 31, 2024.
- For all Balance Sheet, Income Statement, and Cash flow statement data and metrics, refer to FY24 as the latest available annual period. For market metrics and valuation data, refer to the latest available data from the credible sources noted above.
- For the P/E Ratio comparison with peers, provide a qualitative analysis rather than specific figures.
- Provide detailed financial metrics, market share figures, and growth rates to substantiate each point.
- No need to mention the report generation date.
- Focus on unique trends, challenges, and innovations that are shaping the specific industry, and how the company's trends align to it.
- Ensure the analysis leads to practical insights for decision-making, whether it is for investors, market entrants, or industry strategists.
- Maintain an objective tone throughout the analysis.
- Use bold formatting for headings and subheadings. Highlight or underline important figures and the final recommendation.
- Ensure consistency in formatting and presentation.
- If certain data points are not available, provide a qualitative assessment based on available information.
- Keep the lookback period as the last 5 fiscal years.
- In the Quantitative Analysis section, ensure that each subtopic includes a clear trend analysis, commentary, and key takeaways to provide a comprehensive understanding of the company's financial performance and position.
- Refer to the reference Output below. The structure, framework, style, chronology of the prompt output should be as per the reference, for any stock being analysed.

`;

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
