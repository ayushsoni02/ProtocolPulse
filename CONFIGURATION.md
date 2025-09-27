cd # ProtocolPulse Configuration Guide

## 🔧 Real Data Integration

This application is now configured to use **real data** from The Graph Protocol. Follow these steps to get it working:

### Step 1: Get Your API Credentials

1. **Visit The Graph Studio**: https://thegraph.com/studio/
2. **Create an Account**: Sign up for a free account
3. **Create a Project**: Set up a new project in The Graph Studio
4. **Get Your API Key**: Copy your API key from the project dashboard
5. **Find Subgraph IDs**: Look for existing Uniswap and SushiSwap subgraphs

### Step 2: Configure Environment Variables

Update your `.env.local` file with your credentials:

```bash
# Your Graph Protocol API Key
NEXT_PUBLIC_GRAPH_API_KEY=your_actual_api_key_here

# Subgraph IDs (replace with actual IDs from The Graph Studio)
NEXT_PUBLIC_UNISWAP_SUBGRAPH_ID=your_uniswap_subgraph_id
NEXT_PUBLIC_SUSHISWAP_SUBGRAPH_ID=your_sushiswap_subgraph_id
```

### Step 3: Restart the Application

```bash
bun run dev
```

### Step 4: Verify Connection

1. Open http://localhost:3000
2. Check the dashboard - it should show "✓ Connected to The Graph Protocol"
3. Health scores will be calculated from real transaction data

## 🚨 Error Handling

The application now provides clear error messages:

- **Missing API Key**: "Graph client not available for [protocol]. Please check your API credentials."
- **Invalid Subgraph**: "No swaps data found for [protocol]. Check if the subgraph is properly synced."
- **Low Activity**: "No recent swaps found for [protocol]. The protocol may have low activity."

## 🔍 What's Different Now

### ✅ **Real Data Integration**
- Fetches actual transaction data from The Graph Protocol
- Calculates health scores from real user behavior
- No more mock data or hardcoded values

### ✅ **Proper Error Handling**
- Clear error messages for missing credentials
- Graceful handling of API failures
- No fallback to fake data

### ✅ **Production Ready**
- Authentication headers properly configured
- Robust retry logic for API calls
- Professional error reporting

## 📊 Expected Results

With proper credentials, you'll see:
- **Real health scores** based on actual protocol activity
- **Accurate user retention** metrics from transaction data
- **True volume stability** analysis from real swaps
- **Actual activity trends** from user behavior patterns

## 🛠️ Troubleshooting

### Common Issues:

1. **"Graph client not configured"**
   - Check your API key in `.env.local`
   - Verify the environment variable names are correct

2. **"No swaps data found"**
   - Verify your subgraph IDs are correct
   - Check if the subgraph is fully synced in The Graph Studio

3. **"No recent swaps found"**
   - The protocol may have very low activity
   - Try adjusting the time window in the queries

### Getting Help:

- Check The Graph Studio documentation
- Verify your subgraph is properly deployed and synced
- Test your API key with a simple GraphQL query

## 🎯 Next Steps

Once configured, your ProtocolPulse application will:
- ✅ Analyze real DeFi protocol health
- ✅ Compare actual user behavior patterns
- ✅ Provide accurate predictive insights
- ✅ Update with live data every 5 minutes

**Your ProtocolPulse is now a professional-grade DeFi protocol analysis tool!** 🚀
