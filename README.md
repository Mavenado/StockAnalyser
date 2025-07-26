# Stock Analyzer Backend API

AI-powered stock fundamental analysis using OpenAI GPT-4.

## Features
- Comprehensive stock analysis using OpenAI
- RESTful API with Express.js
- Error handling and input validation
- CORS enabled for frontend integration

## API Endpoints

### POST /api/analyze
Analyze stocks by providing an array of stock symbols.

**Request:**
```json
{
  "stocks": ["AAPL", "GOOGL", "TSLA"]
}
```

**Response:**
```json
{
  "success": true,
  "stocks": ["AAPL", "GOOGL", "TSLA"],
  "analysis": "Detailed analysis text...",
  "timestamp": "2025-07-26T10:30:00.000Z"
}
```

### GET /api/health
Health check endpoint.

## Environment Variables
- `OPENAI_API_KEY` - Your OpenAI API key
- `PORT` - Server port (default: 3000)

## Deployment
This app is designed to be deployed on Railway, Vercel, or similar platforms.

1. Set environment variables
2. Deploy from GitHub
3. Update frontend API URL