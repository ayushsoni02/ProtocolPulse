import { NextRequest, NextResponse } from 'next/server';
import { withRetry } from '@/lib/graphClient';
import { getSevenDaysAgoTimestamp } from '@/lib/queries';
import { HealthCalculator } from '@/lib/healthCalculator';
import { SwapTransaction, HealthComparison, ProtocolHealth } from '@/lib/types';

// Cache for 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;
let cache: { data: HealthComparison; timestamp: number } | null = null;


export async function GET(request: NextRequest) {
  try {
    // Check cache first
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
      return NextResponse.json(cache.data);
    }

    const searchParams = request.nextUrl.searchParams;
    const protocols = searchParams.get('protocols') || 'uniswap,sushiswap';
    const protocolList = protocols.split(',');

    const sevenDaysAgoTimestamp = getSevenDaysAgoTimestamp();
    
    const healthComparison: HealthComparison = {
      uniswap: {} as ProtocolHealth,
      sushiswap: {} as ProtocolHealth,
      lastUpdated: new Date().toISOString()
    };

    // Fetch data for each protocol
    for (const protocol of protocolList) {
      try {
        if (protocol.trim() === 'uniswap') {
          const uniswapSubgraphId = process.env.NEXT_PUBLIC_UNISWAP_SUBGRAPH_ID;
          
          if (!uniswapSubgraphId) {
            throw new Error('Uniswap subgraph ID not configured. Please check your environment variables.');
          }
          
          const uniswapSwaps = await fetchProtocolSwaps(
            uniswapSubgraphId,
            sevenDaysAgoTimestamp,
            'uniswap'
          );
          
          const calculator = new HealthCalculator();
          healthComparison.uniswap = calculator.calculateProtocolHealth(uniswapSwaps, 'uniswap');
        }
        
        if (protocol.trim() === 'sushiswap') {
          const sushiswapSubgraphId = process.env.NEXT_PUBLIC_SUSHISWAP_SUBGRAPH_ID;
          
          if (!sushiswapSubgraphId) {
            throw new Error('SushiSwap subgraph ID not configured. Please check your environment variables.');
          }
          
          const sushiswapSwaps = await fetchProtocolSwaps(
            sushiswapSubgraphId,
            sevenDaysAgoTimestamp,
            'sushiswap'
          );
          
          const calculator = new HealthCalculator();
          healthComparison.sushiswap = calculator.calculateProtocolHealth(sushiswapSwaps, 'sushiswap');
        }
      } catch (protocolError) {
        console.error(`Error processing ${protocol}:`, protocolError);
        throw new Error(`Failed to fetch data for ${protocol}: ${protocolError instanceof Error ? protocolError.message : 'Unknown error'}`);
      }
    }

    // Update cache
    cache = {
      data: healthComparison,
      timestamp: Date.now()
    };

    return NextResponse.json(healthComparison);
  } catch (error) {
    console.error('Error fetching health data:', error);
    
    // Return cached data if available, even if expired
    if (cache) {
      return NextResponse.json(cache.data);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch protocol health data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function fetchProtocolSwaps(
  subgraphId: string,
  timestamp: string,
  protocol: 'uniswap' | 'sushiswap'
): Promise<SwapTransaction[]> {
  const apiKey = process.env.NEXT_PUBLIC_GRAPH_API_KEY;
  
  if (!apiKey || !subgraphId) {
    throw new Error(`Graph credentials not available for ${protocol}. Please check your API credentials.`);
  }

  return withRetry(async () => {
    try {
      const query = `
        query GetSwaps($timestamp: String!) {
          swaps(
            where: { timestamp_gte: $timestamp }
            orderBy: timestamp
            orderDirection: desc
            first: 1000
          ) {
            id
            timestamp
            sender
            to
            amountUSD
          }
        }
      `;

      const response = await fetch(`https://gateway-arbitrum.network.thegraph.com/api/subgraphs/id/${subgraphId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          query,
          variables: { timestamp }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
      }

      const swaps = data.data?.swaps || [];

      if (swaps.length === 0) {
        throw new Error(`No recent swaps found for ${protocol}. The protocol may have low activity.`);
      }
      
      return swaps.map((swap: any) => ({
        id: swap.id,
        timestamp: swap.timestamp.toString(),
        recipient: swap.sender || swap.to, // Use recipient as the user field
        amountUSD: swap.amountUSD || '0',
        transaction: {
          gasUsed: '0' // Gas data not available in this subgraph
        },
        protocol
      }));
    } catch (error) {
      console.error(`${protocol} query error:`, error);
      throw new Error(`Failed to query ${protocol} subgraph: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }); 
} 