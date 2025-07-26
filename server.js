const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
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

// Updated Prompt Template
const ANALYSIS_PROMPT = `Please provide a comprehensive fundamental analysis for the following stock(s): {STOCKS}
## Objective
Conduct a thorough analysis of the stock, combining qualitative and quantitative approaches to provide a well-rounded investment recommendation.

## Instructions

{STOCKS} - Equity Analysis Report
By "Trading Maverick"

### 1. Company Overview
- Provide a brief introduction to the company
- Mention any recent significant events
- Include quick investment recommendation

### 2. Quantitative Analysis
Analyze these metrics with current values and 5-year trends:
a) Market Valuation:
   - Market Cap, P/E Ratio, Stock Price
b) Profitability:
   - ROE, ROCE, Margins
c) Growth:
   - Revenue Growth, EPS Growth
d) Balance Sheet:
   - Debt-to-Equity, Current Ratio
e) Dividends:
   - Yield, Payout Ratio

### 3. Qualitative Analysis
Evaluate:
a) Business Model
b) Management Quality
c) Growth Strategy

### 4. Shareholding Pattern
Analyze promoter, FII, DII holdings

### 5. Investment Thesis
Key growth drivers and catalysts

### 6. Valuation and Recommendation
- Fair value estimate
- BUY/SELL/HOLD recommendation
- Target price and timeframe

### 7. Conclusion
Summary and final recommendation

### Output Requirements
- Generate professional HTML report
- Use color-coded trends (green/red)
- Include data tables
- Highlight key metrics
- Add disclaimer`;

// Enhanced Yahoo Finance Data Fetcher
async function fetchYahooFinanceData(stockSymbol) {
  try {
    const modules = [
      'assetProfile', 'incomeStatementHistory', 
      'balanceSheetHistory', 'cashflowStatementHistory',
      'defaultKeyStatistics', 'financialData',
      'price', 'summaryDetail', 
      'institutionOwnership', 'majorHoldersBreakdown'
    ];
    
    const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${stockSymbol}.NS?modules=${modules.join(',')}`;
    const response = await axios.get(url);
    const data = response.data.quoteSummary.result[0];
    
    // Process financial history
    const processHistory = (history, field) => {
      return history?.map(item => ({
        year: item.endDate?.fmt || 'N/A',
        value: item[field]?.fmt || 'N/A'
      })) || [];
    };

    return {
      // Company info
      name: data.assetProfile?.longName || stockSymbol,
      sector: data.assetProfile?.sector || 'N/A',
      industry: data.assetProfile?.industry || 'N/A',
      description: data.assetProfile?.longBusinessSummary || 'N/A',
      
      // Price data
      price: data.price?.regularMarketPrice?.fmt || 'N/A',
      currency: data.price?.currency || 'INR',
      marketCap: data.price?.marketCap?.fmt || 'N/A',
      peRatio: data.summaryDetail?.trailingPE?.fmt || 'N/A',
      
      // Profitability
      roe: data.financialData?.returnOnEquity?.fmt || 'N/A',
      roa: data.financialData?.returnOnAssets?.fmt || 'N/A',
      profitMargins: data.financialData?.profitMargins?.fmt || 'N/A',
      
      // Growth
      revenueHistory: processHistory(data.incomeStatementHistory?.incomeStatementHistory, 'totalRevenue'),
      earningsHistory: processHistory(data.incomeStatementHistory?.incomeStatementHistory, 'netIncome'),
      
      // Balance sheet
      debtToEquity: data.financialData?.debtToEquity?.fmt || 'N/A',
      currentRatio: data.financialData?.currentRatio?.fmt || 'N/A',
      
      // Dividends
      dividendYield: data.summaryDetail?.dividendYield?.fmt || '0%',
      payoutRatio: data.summaryDetail?.payoutRatio?.fmt || 'N/A',
      
      // Shareholding
      institutionHolding: data.institutionOwnership?.fmt || 'N/A',
      insiderHolding: data.majorHoldersBreakdown?.insidersPercentHeld?.fmt || 'N/A',
      
      // Additional data
      beta: data.defaultKeyStatistics?.beta?.fmt || 'N/A',
      fiftyTwoWeekHigh: data.summaryDetail?.fiftyTwoWeekHigh?.fmt || 'N/A',
      fiftyTwoWeekLow: data.summaryDetail?.fiftyTwoWeekLow?.fmt || 'N/A'
    };

  } catch (error) {
    console.error(`Error fetching data for ${stockSymbol}:`, error.message);
    return null;
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Stock Analysis API is running' });
});

// Analysis endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { stocks } = req.body;

    if (!stocks || !Array.isArray(stocks) || stocks.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid input', 
        message: 'Please provide an array of stock symbols' 
      });
    }

    // Process stock symbols
    const cleanedStocks = stocks.map(s => s.toString().trim().toUpperCase())
                              .filter(s => s.length > 0);

    // Fetch data for all stocks
    const stockDataList = await Promise.all(
      cleanedStocks.map(fetchYahooFinanceData)
    );

    // Prepare financial data text
    const financialDataText = stockDataList.map((stock, index) => {
      if (!stock) return `Stock: ${cleanedStocks[index]}\nData not available`;
      
      return `
Stock: ${stock.name} (${cleanedStocks[index]})
Price: ₹${stock.price}
Market Cap: ${stock.marketCap}
P/E Ratio: ${stock.peRatio}
ROE: ${stock.roe}
Debt-to-Equity: ${stock.debtToEquity}
Dividend Yield: ${stock.dividendYield}

5-Year Revenue Trend:
${stock.revenueHistory.map(item => `  ${item.year}: ${item.value}`).join('\n')}

5-Year Earnings Trend:
${stock.earningsHistory.map(item => `  ${item.year}: ${item.value}`).join('\n')}
      `;
    }).join('\n\n');

    // Generate prompt
    const stocksList = cleanedStocks.join(', ');
    const prompt = ANALYSIS_PROMPT.replace(/{STOCKS}/g, stocksList)
                      .concat(`\n\n## Financial Data\n${financialDataText}`);

    // Get AI analysis
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const analysis = completion.choices[0].message.content;

    res.json({ 
      success: true, 
      stocks: cleanedStocks, 
      analysis,
      rawData: stockDataList, // Include raw data for reference
      timestamp: new Date().toISOString() 
    });

  } catch (error) {
    console.error('Analysis error:', error);
    
    let status = 500;
    let message = 'An error occurred while processing your request.';
    
    if (error.code === 'insufficient_quota') {
      status = 429;
      message = 'OpenAI API quota exceeded. Please check your billing.';
    } else if (error.code === 'invalid_api_key') {
      status = 401;
      message = 'OpenAI API key is invalid or missing.';
    }
    
    res.status(status).json({ 
      error: error.code || 'server_error', 
      message 
    });
  }
});

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
