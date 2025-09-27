# ProtocolPulse

Real-time DeFi protocol health analysis powered by The Graph Protocol. Analyze user behavior patterns to predict protocol health before problems become obvious.

## 🚀 Features

- **Real-time Health Analysis**: Compare Uniswap vs SushiSwap health scores
- **Predictive Analytics**: Spot protocol problems weeks before traditional metrics show them
- **User Behavior Analysis**: Track retention, volume stability, and activity trends
- **Mathematical Analysis**: No AI/ML - pure mathematical analysis of behavioral patterns
- **Auto-refresh**: Updates every 5 minutes with caching
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Architecture

### Health Metrics Calculated

1. **User Retention Score (0-100)**
   - Analyzes users who made multiple transactions
   - Compares 7-day periods: recent vs previous
   - Higher retention = higher score

2. **Volume Stability Score (0-100)**
   - Calculates daily volume variance using coefficient of variation
   - More stable = higher score

3. **Activity Trend Score (-50 to +50)**
   - Compares recent 3 days vs previous 3 days
   - Looks at user count and transaction count
   - Growing activity = positive score

4. **Technical Health Score (0-100)**
   - Average gas costs (lower = better)
   - Transaction success rate

### Overall Score Calculation
- **User Retention**: 40% weight
- **Volume Stability**: 30% weight  
- **Activity Trend**: 20% weight (converted to 0-100 scale)
- **Technical Health**: 10% weight

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: Apollo GraphQL Client
- **Charts**: Recharts
- **Icons**: Lucide React
- **Runtime**: Bun
- **Data Source**: The Graph Protocol

## 📊 Data Sources

**Important Note**: The Graph Protocol has moved to a new authentication system. The old public endpoints are no longer available and return 301 redirects. To use real data, you need to:

1. **Get a Graph API Key**: Visit [The Graph Studio](https://thegraph.com/studio/) to create an account and get an API key
2. **Use New Endpoints**: The new endpoints require authentication headers
3. **Update Environment Variables**: Add your API key to the environment configuration

**Current Setup**: The application uses realistic mock data for demonstration purposes.

**Legacy URLs (No longer working)**:
- ~~Uniswap: https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3~~
- ~~SushiSwap: https://api.thegraph.com/subgraphs/name/sushi-labs/sushiswap~~

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your system

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd protocolpulse
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
# .env.local
NEXT_PUBLIC_UNISWAP_SUBGRAPH_URL=https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3
NEXT_PUBLIC_SUSHISWAP_SUBGRAPH_URL=https://api.thegraph.com/subgraphs/name/sushi-labs/sushiswap
```

4. Start the development server:
```bash
bun run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
protocolpulse/
├── src/
│   ├── app/
│   │   ├── api/health/route.ts    # Health comparison API endpoint
│   │   ├── globals.css            # Global styles
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Main page
│   ├── components/
│   │   ├── ComparisonDashboard.tsx # Main dashboard component
│   │   ├── HealthMetrics.tsx      # Detailed metrics breakdown
│   │   ├── ProtocolCard.tsx       # Individual protocol card
│   │   └── TrendChart.tsx         # 7-day trend visualization
│   ├── lib/
│   │   ├── graphClient.ts         # Apollo GraphQL clients
│   │   ├── healthCalculator.ts    # Health calculation engine
│   │   ├── queries.ts             # GraphQL queries
│   │   └── types.ts               # TypeScript interfaces
│   └── utils/
│       └── helpers.ts             # Utility functions
```

## 🔍 API Endpoints

### GET /api/health

Returns health comparison data for specified protocols.

**Query Parameters:**
- `protocols` (optional): Comma-separated list of protocols (default: "uniswap,sushiswap")

**Response:**
```json
{
  "uniswap": {
    "protocol": "uniswap",
    "overallScore": 85,
    "grade": "A",
    "metrics": {
      "userRetention": { "score": 78, "details": {...} },
      "volumeStability": { "score": 92, "details": {...} },
      "activityTrend": { "score": 15, "details": {...} },
      "technicalHealth": { "score": 88, "details": {...} }
    },
    "trend": "improving",
    "lastUpdated": "2024-01-15T10:30:00.000Z"
  },
  "sushiswap": { ... },
  "lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

## 🎨 UI/UX Design

### Color Scheme
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981) for healthy protocols
- **Warning**: Yellow (#F59E0B) for caution
- **Danger**: Red (#EF4444) for unhealthy protocols
- **Background**: Gray (#F9FAFB)

### Health Score Ranges
- **80-100**: Green (Healthy) - Grade A/A+
- **60-79**: Yellow (Caution) - Grade B/C
- **0-59**: Red (Avoid) - Grade D/F

## 🔄 Data Refresh

- **Auto-refresh**: Every 5 minutes
- **Manual refresh**: Available via refresh button
- **Caching**: 5-minute cache to reduce API calls
- **Error handling**: Graceful fallback to cached data

## 🧮 Mathematical Analysis

The health calculation engine uses mathematical analysis without AI/ML:

1. **Coefficient of Variation**: `σ/μ` for volume stability
2. **Retention Rate**: `(returning_users / total_users) × 100`
3. **Growth Rate**: `(recent_value - previous_value) / previous_value × 100`
4. **Weighted Scoring**: Multiple metrics with different weights

## 🚀 Deployment

The application can be deployed to any platform that supports Next.js:

1. **Vercel** (recommended):
```bash
bun run build
vercel deploy
```

2. **Docker**:
```bash
docker build -t protocolpulse .
docker run -p 3000:3000 protocolpulse
```

## 🔧 Integrating Real Data

To connect to real The Graph Protocol data:

1. **Get API Key**:
   ```bash
   # Visit https://thegraph.com/studio/ and create an account
   # Generate an API key for your project
   ```

2. **Update Environment Variables**:
   ```bash
   # .env.local
   NEXT_PUBLIC_GRAPH_API_KEY=your_api_key_here
   NEXT_PUBLIC_UNISWAP_SUBGRAPH_ID=your_uniswap_subgraph_id
   NEXT_PUBLIC_SUSHISWAP_SUBGRAPH_ID=your_sushiswap_subgraph_id
   ```

3. **Update GraphQL Client**:
   ```typescript
   // Add authorization header to Apollo client
   const client = new ApolloClient({
     link: createHttpLink({
       uri: 'https://gateway-arbitrum.network.thegraph.com/api/subgraphs/id/YOUR_SUBGRAPH_ID',
       headers: {
         authorization: `Bearer ${process.env.NEXT_PUBLIC_GRAPH_API_KEY}`
       }
     }),
     cache: new InMemoryCache()
   });
   ```

4. **Update API Route**:
   ```typescript
   // Replace mock data generation with real GraphQL queries
   // Remove the generateRealisticMockSwaps() calls
   ```

## 📈 Future Enhancements

- [ ] Support for more DeFi protocols
- [ ] Historical health data analysis
- [ ] Alert system for protocol health changes
- [ ] Advanced filtering and comparison tools
- [ ] Protocol-specific health indicators
- [ ] Export functionality for reports
- [ ] Real-time data integration with The Graph Protocol

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [The Graph Protocol](https://thegraph.com/) for providing decentralized indexing
- [Uniswap](https://uniswap.org/) and [SushiSwap](https://sushi.com/) for the protocols analyzed
- [Apollo GraphQL](https://www.apollographql.com/) for GraphQL client
- [Recharts](https://recharts.org/) for data visualization