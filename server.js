const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');               // Ensure axios is imported
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
Conduct a thorough analysis of the stock, combining qualitative and quantitative approaches to provide a well-rounded investment recommendation.

## Outline of Analysis
 Adhere STRICTLY to the sample output outline. Can add charts, and visualisations.

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

Reference Output

Reliance Industries Ltd - Equity Analysis Report

By Trading Mavericks
1. Company Overview
Reliance Industries Ltd (RIL) is India's largest private sector company and a global conglomerate headquartered in Mumbai. Founded by Dhirubhai Ambani, it is currently promoted and managed by his elder son, Mukesh Dhirubhai Ambani. The Ambani family holds approximately 50% shareholding in the company.
RIL operates across multiple sectors, with its core business segments including:
Oil-to-Chemicals (O2C) segment (~57% of revenues)
Digital Services (Jio)
Retail
Oil & Gas Exploration
Recently, RIL has made significant strides in expanding its digital and retail businesses, transforming from a traditional petrochemical company to a diversified conglomerate with strong consumer-facing businesses. A notable recent development is Jio's partnership with SpaceX to offer Starlink internet services to its customers, announced on March 12, 2025.

Investment Recommendation
Recommendation: BUY
Target Price: ₹1,850 (48% upside)
Investment Horizon: 18-24 months



2. Quantitative Analysis
a) Market Valuation and Price Metrics
Metric
Current Value (FY24)
5-Year Trend
Market Capitalization
₹16,88,704 Cr
Increasing
Current Stock Price
₹1,248
Fluctuating
Price-to-Earnings (P/E) Ratio
24.4
Above industry median

Trend Analysis: RIL's market capitalization has shown robust growth over the past decade, reflecting its successful business diversification. However, the stock price has witnessed fluctuations in the past year, with a 12% decline over the last 12 months despite a 5-year CAGR of 22%.
Key Takeaways: RIL trades at a P/E of 24.4x, which is higher than the industry median of 20.55x, indicating premium valuation compared to peers. This premium valuation suggests market expectations of continued growth from its diversified business model, particularly from its digital and retail segments.
b) Profitability and Returns
Metric
FY24
FY23
FY22
FY21
FY20
Trend
Return on Equity (ROE)
9.25%
9%
8%
8%
11%
Slight improvement
Return on Capital Employed (ROCE)
9.61%
9%
8%
8%
11%
Slight improvement
Net Profit Margin
8.97%
8.46%
9.77%
11.53%
6.68%
Fluctuating
Operating Profit Margin
18%
16%
16%
17%
15%
Stable with improvement

Trend Analysis: RIL's profitability metrics show mixed performance. ROE and ROCE have shown a marginal improvement in FY24 compared to the previous two years but remain below the levels seen in FY20. The operating profit margin has stabilized around 18%, showing resilience despite challenging macro conditions.
Key Takeaways: The company's returns metrics are lower than industry peers, with ROE at 9.25% compared to the industry median of 21.45%. This indicates that while RIL has massive scale, its efficiency in generating returns from equity is lower than smaller, more focused competitors. However, the consistent improvement in operating margins over recent quarters signals improving operational efficiency.
c) Growth Metrics
Metric
5-Year CAGR
3-Year CAGR
Trend
Revenue Growth Rate
10%
24%
Accelerating
Earnings Per Share (EPS) Growth
12%
16%
Strong growth

Trend Analysis: RIL has demonstrated accelerated revenue growth in the last three years (24% CAGR) compared to its 5-year average (10%), indicating successful scaling of newer business verticals. However, the latest TTM figures show a moderation to 7%, suggesting potential normalization of growth rates.
Key Takeaways: The company's EPS has grown at a healthy 12% CAGR over five years, outpacing revenue growth and indicating improving profitability. The Price/Earnings to Growth (PEG) ratio of 2.04 suggests that the stock is somewhat expensive relative to its growth rate.
d) Balance Sheet Strength
Metric
FY24
FY23
FY22
FY21
FY20
Trend
Debt-to-Equity Ratio
0.44
~0.48
0.40
0.40
0.65
Stable at low levels

Trend Analysis: RIL has significantly improved its balance sheet strength over the past five years, reducing its debt-to-equity ratio from 0.65 in FY20 to 0.44 in FY24. This is particularly notable given the company's massive capital expenditure programs.
Key Takeaways: The company's low debt-to-equity ratio reflects its strong deleveraging efforts, primarily driven by strategic investments in Jio Platforms and Reliance Retail from global investors. This provides financial flexibility for future expansion and acquisitions.
e) Cash Flow Analysis
Metric
FY22
FY21
FY20
Trend
Cash Flow from Operations
₹110,654 Cr
₹26,958 Cr
₹94,877 Cr
Volatile but strong

Trend Analysis: RIL's operational cash flows have been strong but volatile. FY22 showed a substantial recovery compared to FY21, reaching ₹110,654 crores, which supports the company's significant capital expenditure requirements.
Key Takeaways: The robust operating cash flow generation capacity is a key strength, allowing RIL to fund its ambitious expansion plans across businesses while maintaining financial stability. However, the volatility in cash flows highlights the cyclical nature of its core businesses.
f) Dividend Analysis
Metric
FY24
FY23
FY22
FY21
FY20
Trend
Dividend Yield
0.40%
~0.40%
~0.40%
~0.40%
~0.40%
Stable but low
Dividend Payout Ratio
9%
9%
9%
9%
10%
Consistent

Trend Analysis: RIL maintains a conservative dividend policy with a consistent payout ratio of around 9%, which is low compared to mature companies in similar industries.
Key Takeaways: The low dividend yield of 0.40% suggests that RIL prioritizes reinvesting profits for growth rather than distributing them to shareholders. This approach aligns with its aggressive expansion strategy across various business segments.
g) Efficiency Ratios
Metric
FY24
FY23
FY22
FY21
FY20
Trend
Cash Conversion Cycle
-3 days
7 days
-27 days
-19 days
-9 days
Efficient working capital management
Working Capital Days
-10 days
-9 days
-13 days
12 days
-101 days
Negative (favorable)

Trend Analysis: RIL demonstrates exceptional efficiency in working capital management, maintaining a negative cash conversion cycle in most years. This indicates that the company effectively utilizes supplier credit to finance its operations.
Key Takeaways: The negative working capital position is a significant competitive advantage, allowing RIL to operate with minimal capital tied up in day-to-day operations and generating additional financial flexibility.
h) Valuation Metrics Comparison with Industry Peers
Company
P/E Ratio
ROCE
Debt/Equity
Reliance Industries
24.41
9.61%
0.44
IOCL
18.28
21.14%
0.90
BPCL
8.19
32.09%
0.76
HPCL
11.42
21.26%
1.58
Industry Median
20.55
21.45%
0.78

Trend Analysis: RIL trades at a premium valuation compared to most of its peers in the refineries sector, with a P/E ratio of 24.41 versus the industry median of 20.55. However, its ROCE is lower than industry peers, while its debt levels are more conservative.
Key Takeaways: The premium valuation reflects RIL's successful diversification beyond traditional refining into high-growth areas like digital services and retail. Investors are willing to pay more for RIL's earnings due to its growth potential and lower financial risk, despite lower returns on capital compared to peers.
3. Qualitative Analysis
a) Business Model
Core Products/Services:
Oil-to-Chemicals (O2C): Integrated operations across refining, petrochemicals, and fuels retail
Digital Services: Telecommunication services through Jio, including mobile, broadband, and enterprise solutions
Retail: Operates across various formats including grocery, consumer electronics, fashion, and pharma retail
Oil & Gas Exploration: Upstream operations in India's KG Basin and international assets
Revenue Streams: RIL's revenue mix has evolved significantly over the past decade. While the O2C segment still contributes ~57% of revenues, the contribution from digital services and retail has been growing rapidly, creating a more balanced and diversified revenue profile.
Competitive Advantages:
Integrated Operations: Vertical integration across the energy value chain provides cost advantages and operational flexibility
Scale: Market leadership in most business segments creates economies of scale
Digital Ecosystem: Jio's substantial user base provides cross-selling opportunities across digital services
Distribution Network: Extensive retail footprint creates last-mile advantage
Financial Strength: Strong balance sheet allows aggressive investments in emerging opportunities
b) Management Quality
Experience and Track Record: Under Mukesh Ambani's leadership, RIL has successfully transformed from a primarily petrochemical business to a diversified conglomerate. The management team has demonstrated strategic foresight in pivoting towards consumer-facing businesses ahead of industry trends. Key examples include:
Early and aggressive investment in telecom infrastructure with Jio
Strategic expansion of retail footprint before e-commerce boom
Timely deleveraging through value unlocking in Jio and Retail
Corporate Governance Practices: RIL has made significant improvements in corporate governance over the years, with independent directors comprising a substantial portion of its board. However, being a promoter-led company with ~50% family ownership does raise some concerns about minority shareholder representation.
c) Growth Strategy
Expansion Plans:
Digital Services: Expanding beyond telecom into broader digital services including fintech, e-commerce, and content
New Energy: Ambitious plans to invest in renewable energy, hydrogen, and storage solutions
Retail: Accelerating both offline and online retail expansion, particularly in smaller cities
International Expansion: Gradually increasing global footprint, particularly in the digital and retail segments
Research and Development Initiatives: RIL is investing significantly in future technologies including:
Green hydrogen production
Carbon capture and utilization
Advanced materials and composites
5G applications and Internet of Things (IoT)
The recent partnership with SpaceX for Starlink internet services demonstrates RIL's commitment to bringing cutting-edge technology to the Indian market.
4. Shareholding Pattern Analysis
Category
Jun 2024
Mar 2024
Jun 2023
Jun 2022
Trend
Promoters
50.33%
50.31%
50.39%
50.62%
Stable
Foreign Institutional Investors (FIIs)
21.75%
22.06%
22.55%
23.90%
Gradual decrease
Domestic Institutional Investors (DIIs)
17.30%
16.98%
16.13%
14.67%
Increasing
Government
0.19%
0.19%
0.17%
0.17%
Stable
Public
10.43%
10.46%
10.76%
10.64%
Stable

Analysis:
Promoter Holding: The Ambani family's stake has remained steady around 50%, indicating their continued commitment to the business.
Institutional Ownership Shift: There has been a noticeable shift from foreign to domestic institutional ownership over the past two years. FII holding has decreased from 23.90% to 21.75%, while DII holding has increased from 14.67% to 17.30%.
Public Shareholding: Retail investor participation has remained stable around 10.5%, reflecting consistent interest from individual investors.
Key Takeaways: The increasing domestic institutional ownership potentially indicates growing confidence among Indian fund managers about RIL's long-term prospects, while the declining FII holding might reflect broader capital outflows from emerging markets or potential concerns about premium valuations.
5. Investment Thesis
Key Drivers for Future Growth
Digital Services Expansion: Jio's massive subscriber base of over 450 million provides a foundation for monetization through additional services including fintech, entertainment, and enterprise solutions.


Retail Penetration: With a growing middle class and increasing formalization of retail, RIL's retail business is positioned to capture a larger share of consumer spending.


New Energy Transition: The planned investment of ₹75,000 crores in renewable energy could position RIL as a leader in India's energy transition, creating a new growth engine.


Integration Between Digital and Retail: The convergence of Jio's digital capabilities with Reliance Retail's physical presence creates unique omnichannel opportunities.


Global Expansion: Gradual international expansion, particularly in digital services and specialty retail, could open new growth markets.


Potential Catalysts for Stock Price Movement
Successful Value Unlocking: Potential IPOs of Jio or Retail could crystallize value and trigger re-rating.


New Energy Business Traction: Early success in renewable energy investments could lead to valuation premium.


Margin Expansion in Retail: Increasing scale and private label penetration could drive profitability improvements.


O2C Business Recovery: Improvement in global refining margins could boost cash flows from the traditional business.


Strategic Partnerships: New global partnerships, like the recent SpaceX collaboration, could enhance growth prospects.


Positioning for Industry Trends and Challenges
RIL is well-positioned to navigate key industry trends:
Digital Transformation: Early and substantial investments in digital infrastructure have created first-mover advantages.


Energy Transition: Diversification into new energy mitigates the long-term risks to the traditional O2C business.


Retail Evolution: Omnichannel capabilities prepare the company for evolving consumer preferences.


Regulatory Challenges: Scale and diversification provide buffers against regulatory changes in any single industry.


Global Supply Chain Disruptions: Vertical integration and domestic focus reduce vulnerability to international disruptions.


6. Valuation and Recommendation
Fair Value Estimate
Based on a sum-of-the-parts (SOTP) valuation approach, considering the distinct business segments:
O2C Business: Valued at ~₹820 per share (9x FY24 EBITDA)
Jio Platforms: Valued at ~₹540 per share (20x FY24 EBITDA)
Reliance Retail: Valued at ~₹420 per share (25x FY24 EBITDA)
New Energy & Others: Valued at ~₹70 per share
This yields a fair value estimate of ₹1,850 per share, representing an upside potential of approximately 48% from the current price of ₹1,248.
Investment Recommendation
Recommendation: BUY
Target Price: ₹1,850 (48% upside)
Investment Horizon: 18-24 months
Rationale for Recommendation
Growth Momentum: The 3-year revenue CAGR of 24% and EPS CAGR of 16% demonstrate strong execution.


Improving Fundamentals: Gradual ROE improvement, reduced debt, and consistent operating margins indicate strengthening operations.


Strategic Transformation: RIL's successful pivot to consumer-facing businesses positions it favorably for future growth.


Valuation Gap: Current market price significantly undervalues the sum of RIL's diverse businesses.


Financial Flexibility: Strong balance sheet with debt-to-equity of 0.44 provides capacity for future investments.


7. Conclusion
Reliance Industries presents a compelling investment opportunity at current valuations. The company has successfully transformed itself from a predominantly petrochemical business to a diversified conglomerate with strong positions in digital services, retail, and traditional energy.
While the valuation appears premium compared to traditional refining peers, it fails to fully account for the growth potential of its newer businesses. The ROE, though lower than industry peers, has been gradually improving, and continued execution in high-growth segments could drive further enhancement.
The consistent promoter holding demonstrates management's confidence, while the increasing domestic institutional ownership provides additional validation of the company's prospects. Key near-term catalysts include potential value-unlocking events, margin expansion in retail, and momentum in the new energy investments.
With a target price of ₹1,850 representing 48% upside over an 18-24 month horizon, Reliance Industries warrants a BUY recommendation for investors seeking exposure to India's growth story through a diversified conglomerate with strong market leadership across multiple sectors.
`;

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
    
    // Process financial history helper
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

    // Normalize and cleanup stock symbols
    const cleanedStocks = stocks.map(s => s.toString().trim().toUpperCase())
                              .filter(s => s.length > 0);

    // Fetch data for all stocks concurrently
    const stockDataList = await Promise.all(
      cleanedStocks.map(fetchYahooFinanceData)
    );

    // Prepare financial data text to append to prompt
    const financialDataText = stockDataList.map((stock, idx) => {
      if (!stock) return `Stock: ${cleanedStocks[idx]}\nData not available`;
      
      return `
Stock: ${stock.name} (${cleanedStocks[idx]})
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

    // Generate prompt with stock list and financial data appended
    const stocksList = cleanedStocks.join(', ');
    const prompt = ANALYSIS_PROMPT.replace(/{STOCKS}/g, stocksList)
                      .concat(`\n\n## Financial Data\n${financialDataText}`);

    // Call OpenAI for GPT-4 analysis
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
      rawData: stockDataList,
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
      message = 'OpenAI API key is invalid or missing ';
    }

    res.status(status).json({ error: error.code || 'server_error', message });
  }
});

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
